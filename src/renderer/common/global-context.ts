import {createContext} from "react";
import {CaptureArea} from "../../common/models";

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

    // 是否show Preview-Window
    canPreview: boolean
    setCanPreview?: (canPreview: boolean) => void
    previewBlob?: Blob
    setPreviewBlob?: (previewBlob?: Blob) => void
    videoUrl?: string
    setVideoUrl?: (videoUrl?: string) => void

    // 是否show Capture-Window
    canCapture: boolean,
    setCanCapture?: (canCapture: boolean) => void
    canSetting: boolean,
    setCanSetting?: (canSetting: boolean) => void

    toPage?: (pageUrl: string) => void

    barMode: BarVideoMode,
    setBarMode?: (mode: BarVideoMode) => void
    cursorMode: CursorMode,
    setCursorMode?: (mode: CursorMode) => void
    blurView: boolean | string[]
    setBlurView?: (blurView: boolean | string[]) => void

    capArea: CaptureArea,
    setCapArea?: (areaArea: CaptureArea | ((preArea: CaptureArea) => CaptureArea)) => void

    // 是否允许点击穿透
    allowPenetrate: boolean
    setAllowPenetrate?: (allowPenetrate: boolean) => void
    // 是不是在小工具区域
    isInActionBar: boolean
    setIsInActionBar?: (isInActionBar: boolean) => void

    // 设置
    showDock: boolean
    setShowDock?: (showDock: boolean | ((showDock: boolean) => boolean)) => void
    cachePath: string
    setCachePath?: (cachePath: string) => void
    logPath: string
    setLogPath?: (logPath: string) => void
}

export const DefaultCapArea = () => ({
    width: 300,
    height: 200,
    x: 0,
    y: 0,
})

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
    capArea: DefaultCapArea(),
    allowPenetrate: false,
    isInActionBar: false,
    showDock: false,
    cachePath: "~/screen-recorder",
    logPath: "~/Log",
    canCapture: false,
    canSetting: false,
})
