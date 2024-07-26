
export interface CaptureArea{
    width: number | string;
    height: number | string;
    x: number;
    y: number;
}
export const eqCaptureArea = (a: CaptureArea, b: CaptureArea) => {
    return a && b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}


// screen
export interface CursorPosition{
    x: number;
    y: number;
}
export interface ScreenArea{
    x: number,
    y: number,
    width: number,
    height: number,
}

