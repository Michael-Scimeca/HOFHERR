import Link from 'next/link';
import FireBorder from '@/components/TestimonialWall/FireBorder';

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
                    <Link href="/" className="btn-hit">
                        <span className="btn btn-secondary">← Back to Home</span>
                    </Link>
                    <Link href="/online-orders" className="btn-hit">
                        <span className="btn btn-primary">
                            <FireBorder active={true} radius={6} />
                            Order Online
                        </span>
                    </Link>
                    <Link href="/specials" className="btn-hit">
                        <span className="btn btn-secondary">See Specials</span>
                    </Link>
                </div>
                <div className="notFoundHours">
                    <span>Need help? Call us:</span>
                    <a href="tel:8474416328">(847) 441-MEAT</a>
                </div>
            </div>
            <div className="notFoundBigNum" aria-hidden>404</div>
        </div>
    );
}
