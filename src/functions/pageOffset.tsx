export function pageOffset(height: number) {
    if (window.innerWidth > 1024) {
        if (window.innerHeight > 880) {
            return (height - 600) / 2;
        } else {
            return (height - 500) / 2;
        }
    } else {
        return (height - 500) / 2;
    }
}
