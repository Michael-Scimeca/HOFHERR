/**
 * Ensures all images (including lazy Next.js <Image> tags), CSS background images,
 * web fonts, and video frames in the current document are fetched and GPU-decoded
 * before the preloader or page transition melts the page into view.
 */

function waitForSingleImage(img: HTMLImageElement): Promise<void> {
    return new Promise(resolve => {
        // Force eager loading so offscreen/below-fold images load before the curtain drops
        if (img.loading === 'lazy') {
            img.loading = 'eager';
        }

        const finish = () => {
            if (typeof img.decode === 'function') {
                img.decode().then(() => resolve()).catch(() => resolve());
            } else {
                resolve();
            }
        };

        if (img.complete) {
            finish();
            return;
        }

        const onDone = () => {
            img.removeEventListener('load', onDone);
            img.removeEventListener('error', onDone);
            finish();
        };

        img.addEventListener('load', onDone, { once: true });
        img.addEventListener('error', onDone, { once: true });
    });
}

function collectCssBackgroundUrls(root: ParentNode): string[] {
    const urls = new Set<string>();
    const elements = root.querySelectorAll<HTMLElement>('*');
    const urlRegex = /url\(["']?([^"')]+)["']?\)/g;

    elements.forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (!bg || bg === 'none') return;
        let match: RegExpExecArray | null;
        urlRegex.lastIndex = 0;
        while ((match = urlRegex.exec(bg)) !== null) {
            const rawUrl = match[1];
            if (rawUrl && !rawUrl.startsWith('data:')) {
                urls.add(rawUrl);
            }
        }
    });

    return Array.from(urls);
}

function preloadCssBackgroundUrl(url: string): Promise<void> {
    return new Promise(resolve => {
        const img = new window.Image();
        const finish = () => {
            if (typeof img.decode === 'function') {
                img.decode().then(() => resolve()).catch(() => resolve());
            } else {
                resolve();
            }
        };
        img.onload = finish;
        img.onerror = () => resolve();
        img.src = url;
        if (img.complete) finish();
    });
}

function waitForVideo(video: HTMLVideoElement): Promise<void> {
    return new Promise(resolve => {
        if (video.readyState >= 2) {
            resolve();
            return;
        }
        const onDone = () => {
            video.removeEventListener('loadeddata', onDone);
            video.removeEventListener('error', onDone);
            resolve();
        };
        video.addEventListener('loadeddata', onDone, { once: true });
        video.addEventListener('error', onDone, { once: true });
    });
}

export interface AssetProgress {
    loaded: number;
    total: number;
    ready: boolean;
}

/**
 * Waits for document readyState, fonts, all <img> elements (decoded), CSS background-images,
 * and <video> first frames, up to `timeoutMs`.
 */
export function waitForPageAssets(
    timeoutMs = 4500,
    onProgress?: (progress: AssetProgress) => void
): Promise<void> {
    if (typeof window === 'undefined') return Promise.resolve();

    return new Promise(resolve => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            onProgress?.({ loaded: totalCount, total: totalCount, ready: true });
            resolve();
        };

        const timer = setTimeout(finish, timeoutMs);

        let totalCount = 0;
        let loadedCount = 0;

        const track = (p: Promise<unknown>) => {
            totalCount++;
            onProgress?.({ loaded: loadedCount, total: totalCount, ready: false });
            return p.then(() => {
                loadedCount++;
                onProgress?.({
                    loaded: loadedCount,
                    total: totalCount,
                    ready: loadedCount >= totalCount,
                });
            });
        };

        const runScan = async () => {
            const tasks: Promise<unknown>[] = [];

            // 1. Window load state
            if (document.readyState !== 'complete') {
                tasks.push(
                    track(
                        new Promise<void>(res => {
                            window.addEventListener('load', () => res(), { once: true });
                        })
                    )
                );
            }

            // 2. Web fonts
            if (document.fonts?.ready) {
                tasks.push(track(document.fonts.ready.catch(() => {})));
            }

            // Allow one animation frame so hydrated React components mount their <img> tags
            await new Promise<void>(r => requestAnimationFrame(() => r()));

            // 3. All <img> tags in document (including Navbar logo, hero images, product cards)
            const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
            imgs.forEach(img => {
                tasks.push(track(waitForSingleImage(img)));
            });

            // 4. CSS background-image URLs inside <header> and <main>
            const bgUrls = collectCssBackgroundUrls(document.body);
            bgUrls.forEach(url => {
                tasks.push(track(preloadCssBackgroundUrl(url)));
            });

            // 5. Any <video> elements
            const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));
            videos.forEach(video => {
                tasks.push(track(waitForVideo(video)));
            });

            await Promise.allSettled(tasks);

            // Second pass: catch any <img> tags mounted after the first batch resolved
            const seenImgs = new Set(imgs);
            const lateImgs = Array.from(document.querySelectorAll<HTMLImageElement>('img')).filter(
                img => !seenImgs.has(img)
            );
            if (lateImgs.length > 0) {
                await Promise.allSettled(lateImgs.map(img => track(waitForSingleImage(img))));
            }

            finish();
        };

        void runScan();
    });
}

