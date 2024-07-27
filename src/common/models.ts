
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

// ffmpeg参数
export type VideoFps = 'origin' | '10' | '15' | '20' | '25' | '30' | '60'
export interface VideoArgs{
    videoType?: 'gif' | 'mp4',
    videoSize?: 'origin' | 'HD',
    fps?: VideoFps ,
}


