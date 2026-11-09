import { notFound } from 'next/navigation';
import Receiver from './Receiver';

/** DEV-ONLY: receives the Toast image list via the URL hash and hands it to /api/dev/import-toast-images. Safe to delete. */
export default function Page() {
    if (process.env.NODE_ENV !== 'development') notFound();
    return <Receiver />;
}
