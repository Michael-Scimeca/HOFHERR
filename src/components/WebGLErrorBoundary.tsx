'use client';

import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    failed: boolean;
}

/**
 * Local silent error boundary for optional 3D / WebGL canvases so a WebGL context failure
 * never bubbles up to the global Hofherr Error Boundary or crashes the page.
 */
export default class WebGLErrorBoundary extends Component<Props, State> {
    state: State = { failed: false };

    static getDerivedStateFromError(): State {
        return { failed: true };
    }

    componentDidCatch() {
        // Intentionally silent — optional 3D decoration degrades gracefully when WebGL is unavailable
    }

    render() {
        if (this.state.failed) return this.props.fallback ?? null;
        return this.props.children;
    }
}

