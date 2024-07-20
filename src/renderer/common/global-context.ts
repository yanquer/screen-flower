import {createContext} from "react";

export enum MovieQuality{
    FourK = "4k",
    FullHD = "1080p",
    HD = "720p",
    SD4 = "480p",
    SD3 = "360p",
    S2 = "240p",
}

// bar 额外工具
export type BarVideoMode = 'draw' | 'blur' | 'cursor' | 'none'

// 光标模式
export type CursorMode =
    "none" |
    "target" |
    "highlight" |
    "spotlight"



export interface IRecordContext{
    recording: boolean
    setRecording?(recording: boolean): void
    pause: boolean
    setPause?(pause: boolean): void

    qualityValue: MovieQuality
    setQualityValue?: (qualityVal: MovieQuality) => void

    // 使用麦克风
    useAudio: boolean
    setUseAudio?: (useAudio: boolean) => void
    // 使用摄像头
    useVideo: boolean
    setUseVideo?: (useVideo: boolean) => void

    areaElement?: HTMLCanvasElement
    setAreaElement?: (areaElement: HTMLCanvasElement) => void

    canPreview: boolean
    setCanPreview?: (canPreview: boolean) => void
    previewBlob?: Blob
    setPreviewBlob?: (previewBlob?: Blob) => void

    toPage?: (pageUrl: string) => void

    barMode: BarVideoMode,
    setBarMode?: (mode: BarVideoMode) => void
    cursorMode: CursorMode,
    setCursorMode?: (mode: CursorMode) => void
    blurView: boolean | string[]
    setBlurView?: (blurView: boolean | string[]) => void
}

export const RecordContext = createContext<IRecordContext>({
    recording: false,
    pause: false,
    qualityValue: MovieQuality.HD,
    useAudio: false,
    useVideo: false,
    canPreview: false,
    barMode: 'none',
    cursorMode: 'none',
    blurView: false,
})
