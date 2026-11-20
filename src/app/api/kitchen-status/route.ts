import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { adminClient } from '@/sanity/adminClient';

export type KitchenLoadMode = 'normal' | 'busy' | 'paused';

export interface KitchenStatusPayload {
    kitchenLoad: KitchenLoadMode;
    prepMinutes: number;
    maxOrdersPerSlot: number;
    pauseUntil: string | null;
    slotCounts: Record<string, number>;
    updatedAt: string;
}

const IS_DEV = process.env.NODE_ENV === 'development';

// In-memory state mirror so instant admin toggles always take effect immediately even if Sanity write token is unset
let liveState: {
    kitchenLoad: KitchenLoadMode;
    maxOrdersPerSlot: number;
    pauseUntil: string | null;
    updatedAt: string;
} = {
    kitchenLoad: 'normal',
    maxOrdersPerSlot: 8,
    pauseUntil: null,
    updatedAt: new Date().toISOString(),
};

function prepMinutesFor(mode: KitchenLoadMode): number {
    if (mode === 'busy') return 30;
    if (mode === 'paused') return 40;
    return 15;
}

/**
 * GET /api/kitchen-status?store=butcher&day=Today
 * Returns live kitchen load mode, prep delay, max orders per 15-min slot, and current booked counts per slot.
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const store = searchParams.get('store') === 'depot' ? 'depot' : 'butcher';

        // Auto-resume if temporary pause has expired
        if (liveState.kitchenLoad === 'paused' && liveState.pauseUntil) {
            if (Date.now() > new Date(liveState.pauseUntil).getTime()) {
                liveState = {
                    ...liveState,
                    kitchenLoad: 'normal',
                    pauseUntil: null,
                    updatedAt: new Date().toISOString(),
                };
            }
        }

        // Count active non-cancelled orders per pickup_time slot from the last 48h
        const slotCounts: Record<string, number> = {};
        try {
            const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
            const recentOrders = await adminClient.fetch<
                { metadata?: { pickup_time?: string; store_id?: string } }[]
            >(
                `*[_type == "order" && status != "cancelled" && createdAt >= $since]{
                    metadata { pickup_time, store_id }
                }`,
                { since }
            );
            for (const ord of recentOrders ?? []) {
                const ordStore = ord.metadata?.store_id || 'butcher';
                if (ordStore !== store) continue;
                const slot = ord.metadata?.pickup_time?.trim();
                if (!slot) continue;
                slotCounts[slot] = (slotCounts[slot] || 0) + 1;
            }
        } catch {
            // non-fatal if Sanity unavailable in local offline mode
        }

        const payload: KitchenStatusPayload = {
            kitchenLoad: liveState.kitchenLoad,
            prepMinutes: prepMinutesFor(liveState.kitchenLoad),
            maxOrdersPerSlot: liveState.maxOrdersPerSlot,
            pauseUntil: liveState.pauseUntil,
            slotCounts,
            updatedAt: liveState.updatedAt,
        };

        return NextResponse.json(payload);
    } catch (err) {
        console.error('[KitchenStatus GET] Error:', err);
        return NextResponse.json(
            {
                kitchenLoad: 'normal',
                prepMinutes: 15,
                maxOrdersPerSlot: 8,
                pauseUntil: null,
                slotCounts: {},
                updatedAt: new Date().toISOString(),
            } satisfies KitchenStatusPayload,
            { status: 200 }
        );
    }
}

/**
 * POST /api/kitchen-status
 * Admin-only toggle for Kitchen Load (normal / busy / paused) and Per-Slot Pickup Cap.
 */
export async function POST(req: Request) {
    try {
        if (!IS_DEV) {
            const session = await auth();
            if (!session?.user?.isAdmin) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const body = await req.json();
        const nextLoad: KitchenLoadMode =
            body?.kitchenLoad === 'busy' || body?.kitchenLoad === 'paused' || body?.kitchenLoad === 'normal'
                ? body.kitchenLoad
                : liveState.kitchenLoad;

        const nextCap =
            typeof body?.maxOrdersPerSlot === 'number'
                ? Math.max(2, Math.min(30, Math.round(body.maxOrdersPerSlot)))
                : liveState.maxOrdersPerSlot;

        const pauseUntil =
            nextLoad === 'paused'
                ? new Date(Date.now() + 20 * 60 * 1000).toISOString()
                : null;

        liveState = {
            kitchenLoad: nextLoad,
            maxOrdersPerSlot: nextCap,
            pauseUntil,
            updatedAt: new Date().toISOString(),
        };

        // Best-effort persist to Sanity siteSettings if available
        try {
            const settingsDoc = await adminClient.fetch<{ _id: string } | null>(`*[_type == "siteSettings"][0]{ _id }`);
            if (settingsDoc?._id) {
                await adminClient
                    .patch(settingsDoc._id)
                    .set({
                        kitchenLoad: liveState.kitchenLoad,
                        maxOrdersPerSlot: liveState.maxOrdersPerSlot,
                        pauseUntil: liveState.pauseUntil,
                    })
                    .commit();
            }
        } catch {
            // non-fatal
        }

        return NextResponse.json({
            ok: true,
            kitchenLoad: liveState.kitchenLoad,
            prepMinutes: prepMinutesFor(liveState.kitchenLoad),
            maxOrdersPerSlot: liveState.maxOrdersPerSlot,
            pauseUntil: liveState.pauseUntil,
            updatedAt: liveState.updatedAt,
        });
    } catch (err) {
        console.error('[KitchenStatus POST] Error:', err);
        return NextResponse.json({ error: 'Failed to update kitchen status' }, { status: 500 });
    }
}

