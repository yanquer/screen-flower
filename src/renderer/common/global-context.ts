import {createContext} from "react";

export enum MovieQuality{
    FourK = "4k",
    FullHD = "1080p",
    HD = "720p",
    SD4 = "480p",
    SD3 = "360p",
    S2 = "240p",
}

export interface IRecordContext{
    recording: boolean
    setRecording?(recording: boolean): void

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
}

export const RecordContext = createContext<IRecordContext>({
    recording: false,
    qualityValue: MovieQuality.HD,
    useAudio: false,
    useVideo: false,
    canPreview: false,
})
