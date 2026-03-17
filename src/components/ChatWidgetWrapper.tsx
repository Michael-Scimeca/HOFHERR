'use client';
import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget';

const HIDDEN_PATHS = ['/online-orders', '/studio'];

export default function ChatWidgetWrapper() {
    const pathname = usePathname();
    if (HIDDEN_PATHS.includes(pathname) || pathname.startsWith('/studio')) return null;
    return <ChatWidget />;
}
