import ffmpeg from 'ffmpeg-static';
import {fixPathForAsarUnpack} from 'electron-util';
import * as Puppeteer from 'puppeteer'
import {PuppeteerScreenRecorder} from 'puppeteer-screen-recorder';
import {IRecordService} from "../../../common/service";
import {injectable, postConstruct} from "inversify";
import {Page} from "puppeteer";
import {CaptureArea} from "../../../common/models";

const ffmpegPath = fixPathForAsarUnpack(ffmpeg);


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

@injectable()
export class ScreenRecorderByPuppeteer implements IRecordService{

    protected recorder: PuppeteerScreenRecorder
    protected page: Page;

    protected waitInitResolve: (val: any) => void
    protected waitInit: Promise<unknown>;

    constructor() {
        this.initWait()
    }

    protected initWait(){
        this.waitInit = new Promise(resolve => {
            this.waitInitResolve = resolve;
        })
    }

    protected async initPageAndRec(){
        const browser = await Puppeteer.launch();
        this.page = await browser.newPage();
        // new PuppeteerScreenRecorder(page, defaultConfig)
        this.recorder = new PuppeteerScreenRecorder(this.page, defaultConfig)

        this.waitInitResolve(undefined)

        // await recorder.start('./report/video/simple.mp4'); // supports extension - mp4, avi, webm and mov
        // await page.goto('https://example.com');
        //
        // await page.goto('https://test.com');
        // await recorder.stop();
        // await browser.close();
    }

    @postConstruct()
    protected init(){

        this.initPageAndRec().then()
    }

    protected reInitRec() {
        this.initWait()
        this.initPageAndRec().then()
    }

    async startRecord(area: CaptureArea, savePath?: string,){
        console.log('>> Starting record... ')
        await this.waitInit
        await this.recorder.start('./report/video/simple.mp4')
        await this.page.goto('http://localhost:8888/capture')
    }

    async stopRecord(){
        console.log('>> Stop record... ')
        await this.waitInit
        await this.recorder.stop()
        this.reInitRec()
    }

    pauseRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    restartRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    resumeRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    cancelRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

}