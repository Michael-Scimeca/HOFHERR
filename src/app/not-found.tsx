import ActionButton from '@/components/ActionButton';
import ContactLink from '@/components/ContactLink';

export default function NotFound() {
    return (
        <div className="notFoundPage">
            <div className="notFoundInner">
                <h1 className="notFoundHeadline">
                    This cut<br />doesn&apos;t exist.
                </h1>
                <p className="notFoundSub">
                    Looks like you wandered into the walk-in cooler. That page isn&apos;t on the board — but we&apos;ve got plenty of good stuff back at the counter.
                </p>
                <div className="notFoundBtns">
                    <ActionButton href="/" variant="secondary">
                        ← Back to Home
                    </ActionButton>
                    <ActionButton href="/online-orders" variant="primary" fire>
                        Order Online
                    </ActionButton>
                    <ActionButton href="/specials" variant="secondary">
                        See Specials
                    </ActionButton>
                </div>
                <div className="notFoundHours">
                    <span>Need help? Call us:</span>
                    <ContactLink kind="phone" />
                </div>
            </div>
            <div className="notFoundBigNum" aria-hidden>404</div>
        </div>
    );
}
