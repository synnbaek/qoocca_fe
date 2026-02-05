const IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? 'http://localhost:8081';

export const getImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${IMAGE_BASE_URL}${url}`;
};
