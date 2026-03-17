'use client';

import dynamic from 'next/dynamic';

const VideoCallout = dynamic(() => import('./VideoCallout'), { ssr: false });

interface Props {
    image: string;
    video: string;
    alt: string;
    title?: string | null;
    sub?: string | null;
}

export default function VideoCalloutWrapper(props: Props) {
    return <VideoCallout {...props} />;
}
