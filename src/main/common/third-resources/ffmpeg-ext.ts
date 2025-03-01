import path from "path";
import {isProd} from "../defines";

export namespace FfmpegExtension {
    export const ffmpegPath = (binPath: string) =>
        isProd ?
            binPath.replace('app.asar', 'app.asar.unpacked') :
            // path.join(process.resourcesPath, 'resources', 'ffmpeg', 'ffmpeg') :
            binPath

}

