import ffemp from 'fluent-ffmpeg'


export interface CaptureOptions{
    area?: {
        x: number,
        y: number,
        width: number,
        height: number
    },
    inputFile?: string,
    outputFile?: string,
}

export class FfempScreenCapture{
    protected static ffInstance = ffemp()

    static cropMedia(){

    }
}