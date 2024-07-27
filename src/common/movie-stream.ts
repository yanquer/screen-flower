
// 视频质量
export enum MovieQuality{
    FourK = "4k",
    FullHD = "1080p",
    HD = "720p",
    SD4 = "480p",
    SD3 = "360p",
    S2 = "240p",
}

interface VideoInfo{
    audioBits: number,
    videoBits: number,
    width: number,
    height: number,
}

export namespace MovieStream {

    // 默认 720P
    const defaultInfo = {
        audioBits: 192000,
        videoBits: 8000000,
        width: 1920,
        height: 1080,
    }

    // 分辨率与bit size预定义
    const videoInfos = [
        // 4k
        [MovieQuality.FourK, {
            audioBits: 192000,
            videoBits: 40000000,
            width: 4096,
            height: 2160,
        }],
        // 1080p
        [MovieQuality.FullHD, defaultInfo],
        // 720p
        [MovieQuality.HD, {
            audioBits: 128000,
            videoBits: 5000000,
            width: 1280,
            height: 720,
        }],
        // 480p
        [MovieQuality.SD4, {
            audioBits: 96000,
            videoBits: 2500000,
            width: 854,
            height: 480,
        }],
        // 360p
        [MovieQuality.SD3, {
            audioBits: 96000,
            videoBits: 1000000,
            width: 640,
            height: 360,
        }],
        // 240p
        [MovieQuality.S2, {
            audioBits: 64000,
            videoBits: 500000,
            width: 426,
            height: 240,
        }],
    ]
    const videoInfosMap = new Map<MovieQuality, VideoInfo>()
    for (const [quality, Info] of videoInfos) {
        // @ts-ignore
        videoInfosMap.set(quality, Info)
    }
    const getMovieBits = (qualityVal: MovieQuality) => {
        const info = videoInfosMap.get(qualityVal) ?? defaultInfo
        return [info.audioBits, info.videoBits]
    }

    // List all mimeTypes
    const mimeTypes = [
        "video/webm;codecs=avc1",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm;codecs=h264",
        "video/webm",
    ];
    const getMimeType = () => {
        // Check if the browser supports any of the mimeTypes, make sure to select the first one that is supported from the list
        let mimeType = mimeTypes.find((mimeType) =>
            MediaRecorder.isTypeSupported(mimeType)
        );

        // If no mimeType is supported, throw an error
        if (!mimeType) {
            throw new Error("No supported mimeTypes available");
            // chrome.runtime.sendMessage({
            //     type: "recording-error",
            //     error: "stream-error",
            //     why: "No supported mimeTypes available",
            // });

            // Reload this iframe
            // window.location.reload();
        }

        return mimeType;
    }
    export const getBitAndMimeType = (qualityVal: MovieQuality): [string, number, number] => {
        // @ts-ignore
        return [getMimeType(), ...getMovieBits(qualityVal)]
    }

    export const getVideoSize = (qualityVal: MovieQuality) => {
        const info = videoInfosMap.get(qualityVal) ?? defaultInfo
        return [info.width, info.height]
    }

}
