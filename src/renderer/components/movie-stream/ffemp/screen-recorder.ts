import ffmpeg from 'ffmpeg-static';
import {fixPathForAsarUnpack} from 'electron-util';

const ffmpegPath = fixPathForAsarUnpack(ffmpeg);

import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';


const defaultConfig = {
    followNewTab: true,
    fps: 25,
    ffmpeg_Path: ffmpegPath || null,
    videoFrame: {
        width: 1024,
        height: 768,
    },
    videoCrf: 18,
    videoCodec: 'libx264',
    videoPreset: 'ultrafast',
    videoBitrate: 1000,
    autopad: {
        // @ts-ignore
        color: 'black' | '#35A5FF',
    },
    aspectRatio: '4:3',
};

export class ScreenRecorder  {

}