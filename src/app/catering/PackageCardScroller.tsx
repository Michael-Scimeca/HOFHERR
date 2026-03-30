'use client';

interface Props {
    packageName: string;
    className?: string;
}

/**
 * Maps a package name to a specific calculator configuration.
 * This pre-fills the calculator with the right event type, guest count,
 * meat/side counts, and add-ons for each package.
 */
function getPackageConfig(name: string) {
    const n = name.toLowerCase();

    // Whole Pig Roast → pig mode, 2 sides via pig_2s package
    if (n.includes('pig') || n.includes('roast')) {
        return {
            eventType: 'pig' as const,
            guests: 50,
            meatsCount: 0,
            sidesCount: 2,
            charcuterie: false,
            pigPackageId: 'pig_2s',
        };
    }

    // BBQ Feast → bbq mode, 2 meats, 2 sides, charcuterie
    if (n.includes('feast')) {
        return {
            eventType: 'feast' as const,
            guests: 50,
            meatsCount: 2,
            sidesCount: 2,
            charcuterie: true,
            pigPackageId: null,
        };
    }

    // Backyard BBQ (default) → bbq mode, 1 meat, 1 side
    return {
        eventType: 'backyard' as const,
        guests: 25,
        meatsCount: 1,
        sidesCount: 1,
        charcuterie: false,
        pigPackageId: null,
    };
}

export default function PackageCardScroller({ packageName, className }: Props) {
    const handleClick = () => {
        const config = getPackageConfig(packageName);

        // Dispatch a custom event so CateringHub can pick up the full config
        window.dispatchEvent(
            new CustomEvent('select-catering-package', {
                detail: { packageName, ...config },
            })
        );

        // Scroll to the Build Your Package calculator
        const target = document.getElementById('build-your-package');
        if (target) {
            if ((window as any).lenis) {
                (window as any).lenis.scrollTo(target, { offset: -80, duration: 1.5 });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            className={className}
            style={{ cursor: 'pointer', border: 'none' }}
        >
            Build This Package ↓
        </button>
    );
}
