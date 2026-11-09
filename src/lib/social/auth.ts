/** Allow Vercel Cron (Bearer CRON_SECRET) or a signed-in admin. */
export async function isAuthorized(request: Request, allowCron = false): Promise<boolean> {
    if (allowCron) {
        const secret = process.env.CRON_SECRET;
        if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true;
    }
    const { auth } = await import('@/auth');
    const session = await auth();
    return Boolean(session?.user?.isAdmin);
}
