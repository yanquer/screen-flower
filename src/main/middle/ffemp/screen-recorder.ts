import ffmpeg from 'ffmpeg-static';
import {IContextService, IFileService, IRecordService, ISettingService} from "../../../common/service";
import {inject, injectable, postConstruct} from "inversify";
import {FluentFfmpegApi} from './fluent-ffmpeg/api'

import FfmpegCommand from 'fluent-ffmpeg';
import {CaptureArea, eqCaptureArea, VideoArgs} from "../../../common/models";
import {Emitter, Event} from "../../../common/event";
import {dirname, join, basename, extname} from "path";
import {getHomeDir} from "../../common/dynamic-defines";
import {Dispose} from "../../../common/container/dispose";
import {IScreenManager, ISysDialogService, IWindowsManager} from "../../electron/service";
import {isProd} from "../../common/defines";
import {getCurrentTime, getRandomStr, isTest} from "../../../common/common";
import {Process} from "../../common/process";
import ffmpegPath from "ffmpeg-static";
import {Logger} from "../../common/logger";
import util from "electron-util";
import {ContextKey, WindowNames} from "../../../common/defines";
import {MovieQuality, MovieStream} from "../../../common/movie-stream";
import {getPathDirAndNameAndExt} from "../../common/common";

// import {fixPathForAsarUnpack} from 'electron-util'
// const {fixPathForAsarUnpack} = require('electron-util');
// const ffmpegPath = fixPathForAsarUnpack(ffmpeg);
// FfmpegCommand.setFfmpegPath(ffmpegPath)

Logger.info(`>> origin ffmpeg path: ${ffmpeg}`)

// fix Asar path
const truthFfmpegPath = isProd ?
    ffmpeg.replace('app.asar', 'app.asar.unpacked') :
    // ffmpeg:
    ffmpeg;

Logger.info(`>> truth ffmpeg path: ${truthFfmpegPath}`)

FfmpegCommand.setFfmpegPath(truthFfmpegPath)

// fixPathForAsarUnpack 不知道为什么无效... 暂时注释
// if (!isTest()) {
//     const util = require('electron-util');
//     const ffmpegPath = util.fixPathForAsarUnpack(truthFfmpegPath);
//     Logger.info(`>> production ffmpeg path: ${ffmpegPath}`)
//     FfmpegCommand.setFfmpegPath(ffmpegPath)
// } else (
//     FfmpegCommand.setFfmpegPath(truthFfmpegPath)
// )


@injectable()
export class ScreenRecorder extends Dispose implements IRecordService{

    protected currentCmd?: FluentFfmpegApi
    protected recordingRunEmitter = new Emitter<boolean>()
    recordingRunEmitterEvent: Event<boolean> = this.recordingRunEmitter.event

    @inject(IFileService)
    protected readonly fileService: IFileService
    @inject(IWindowsManager)
    protected readonly windowsManager: IWindowsManager
    @inject(IScreenManager)
    protected readonly screenManager: IScreenManager
    @inject(ISettingService)
    protected readonly settingService: ISettingService
    @inject(ISysDialogService)
    protected readonly dialogService: ISysDialogService
    @inject(IContextService)
    protected readonly contextKeyService: IContextService

    protected saveDir: string

    protected initWait: Promise<any>

    @postConstruct()
    protected init(){
        this.saveDir = this.settingService.getCachePathSync() ?? join(getHomeDir(), "./screen-recorder");
        this.fileService.isExists(this.saveDir).then(async (exists) => {
            !exists && await this.fileService.mkDir(this.saveDir)
        })

        this.windowsManager.setWinHideEventById(WindowNames.CaptureWin, (winName) => {
            if (winName === WindowNames.CaptureWin){
                Logger.info('>>> close cap win')
                if (this.contextKeyService.getValByKey(ContextKey.Recording) === true){
                    Logger.info('>>> check close cap win but already Recording, stop')
                    this.stopRecord().then()
                }
            }
        })

        this.settingService.cachePathChangeEvent?.((cacheDir: string) => {
            this.saveDir = cacheDir
        })

        this.initWait = this.getMacScreens(true)
    }

    protected ffmpegCommand = (input?: any, record: boolean = true): FluentFfmpegApi => {
        if (record) {
            if (input) this.currentCmd = new FfmpegCommand(input);
            else this.currentCmd = new FfmpegCommand();
            return this.currentCmd
        } else {
            return new FfmpegCommand(input);
        }
    }
    // protected ffmpegCommand = () => Ffmpeg('./report/video/simple.mp4');

    protected cmdCommonDo(cmd: FluentFfmpegApi, desc?: string){
        return cmd
            .on('start', function (commandLine) {
                Logger.info('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                Logger.info(`${desc} finished!`);
            })
            .on('error', (err: Error) => {
                Logger.error(`Error ${desc}`, err);
            })
            .run()
    }

    currentScreen : string
    async getMacScreens(refresh: boolean=false){
        if (!this.currentScreen || refresh) {
            // @ts-ignore
            const screenIndex: number = isTest() ? 0 : this.screenManager.getCurrentScreenIndex(true)

            const out = (await (new Process([
                truthFfmpegPath,
                `-f`, ScreenRecorder.MacScreenSource,
                '-list_devices', 'true',
                '-i', '""',
            ])).run()).stderr

            for (const one of out){
                const screenRegex = /\[AVFoundation indev @ [0-9a-z]*] \[([0-9]+)] Capture screen [0-9]+/g
                const screenIndexRegex = /\[AVFoundation indev @ [0-9a-z]*] \[([0-9]+)] Capture screen [0-9]+/
                if (!one) continue
                const matches = one.match(screenRegex)
                if (matches){
                    // Logger.info(`>>> match ${matches[1]}`)
                    Logger.info(matches)
                    this.currentScreen = (matches[screenIndex] ?? matches[0]).match(screenIndexRegex)[1]
                    Logger.info(`>>> match index ${this.currentScreen}`)
                }
            }

            // Logger.info(out)

            // let waitResolve: any
            // const wait = new Promise(resolve => waitResolve=resolve)

            // const cmd = this.ffmpegCommand("", false)
            //     .inputFormat(ScreenRecorder.MacScreenSource)
            //     .inputOptions([
            //         // `-f ${ScreenRecorder.MacScreenSource}`,
            //         '-list_devices true',
            //         '-i ""'
            //     ])
            //     .output('1.txt')
            //     .on('stdout', function (line) {
            //         Logger.info(`ffmpegCommand stdout start`);
            //         Logger.info(`${line}`);
            //         Logger.info(`ffmpegCommand stdout end`);
            //         waitResolve()
            //     })
            //     .on('end', () => waitResolve())
            // this.cmdCommonDo(cmd, 'getMacScreens')
            // await wait
        }
    }

    get recentRecordPath(): string | undefined{
        return this.curRecordPath
    }
    protected curRecordPath: string
    async startRecord(area: CaptureArea, savePath?: string,){
        this.contextKeyService.setKeyVal<boolean>(ContextKey.Recording, true)

        await this.initWait

        // todo: 暂时不知怎么接受多显示器变化的通知, 所以多显示器下, 每次都刷新, 避免录制位置错误
        this.screenManager.mulDisplay && await this.getMacScreens(true)

        const cropArea = this.screenManager.getCropAreaStr(area)
        Logger.info(`>> Starting record...  area: ${cropArea}`)

        let newSavePath: string = savePath
        if (!savePath){
            newSavePath = join(this.saveDir, '录屏 ' + getCurrentTime() + '.mp4')
        }

        const output = newSavePath ?? './report/video/simple3.mp4'

        this.curRecordPath = output

        // this.ffmpegCommand
        // this.ffmpegCommand({source: "1"})
        const cmd = this.ffmpegCommand(this.currentScreen)
            .inputFormat(ScreenRecorder.MacScreenSource)
            // .native()
            .noAudio()
            .videoFilter(`crop=${cropArea}`)
            .videoCodec('libx264')
            .format('matroska')
            .output(output)

        this.cmdCommonDo(cmd, "startRecord")

        // todo: 后续考虑只给前端触发?
        //      这里, 可能前端在工具栏点击后, 还没有离开工具栏
        // this.recordingRunEmitter.fire(true)
    }

    async stopRecord(onlyStr: boolean=true, webContentId?: number): Promise<Buffer|string|undefined>{
        this.contextKeyService.setKeyVal<boolean>(ContextKey.Recording, false)

        Logger.info('>> Stop record... ')

        this.currentCmd?.kill('SIGTERM')
        // this.currentCmd.ffmpegProc.stdin.write('q')

        this.recordingRunEmitter.fire(false)

        Logger.info(`>> stopRecord file ${this.curRecordPath}`)

        // if (await this.contextKeyService.getValByKey(ContextKey.AskWhenStopInCapture) !== false){
        //     const win = this.windowsManager.findWinByWebId(webContentId)
        //     const savePath = await this.dialogService.openSaveFileDialog(
        //         win?.originWin,
        //         this.curRecordPath,
        //         "文件已保存, 是否需另存(建议取消)?",
        //     )
        //     if (savePath && savePath !== this.curRecordPath) {
        //         await this.fileService.copy(this.curRecordPath, savePath)
        //         this.curRecordPath = savePath
        //     }
        //     Logger.info(`>> stopRecord file and save in ${this.curRecordPath}`)
        // }

        setTimeout( () => {
            if(this.curRecordPath) this.windowsManager.openWinById(WindowNames.PlayerWin)
            // this.curRecordPath = undefined
        }, 500)

        if (onlyStr) return this.curRecordPath

        const data = await this.fileService.openBuffer(this.curRecordPath)
        Logger.info(`>> stopRecord buffer has data ${data && data.length > 0}`)
        if (!data) this.windowsManager.hideAllWindows().then();

        return data
    }

    async pauseRecord(): Promise<void> {
        Logger.info('>> Pause record... ')
        this.currentCmd?.kill('SIGSTOP')
    }

    restartRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async resumeRecord(): Promise<void> {
        Logger.info('>> Resume record... ')
        this.currentCmd?.kill('SIGCONT')
    }

    cancelRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    // area     200:200:0:0
    protected async cropImage(inputImg: string, outputImg: string, area: string){
        let waitResolve: any
        const wait = new Promise(resolve => waitResolve = resolve);

        let iImg = inputImg,
            oImg = outputImg
        if (inputImg === outputImg){
            iImg += '1.png'
            await this.fileService.move(oImg, iImg)
        }

        this.ffmpegCommand(iImg, false)
            .videoFilter(`crop=${area}`)
            // .outputOptions([
            //     `-vf "crop=${cropArea}"`,
            // ])
            .output(oImg)
            .on('start', function (commandLine) {
                Logger.info('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                Logger.info('Cropping finished!');
                waitResolve()
            })
            .on('error', (err) => {
                Logger.error('An error occurred: ' + err.message);
            })
            .run();

        await wait
        return outputImg
    }

    protected lastArea: CaptureArea
    protected lastBgBuffer: Buffer
    async recordBgImage(area: CaptureArea, savePath?: string, relative?: boolean): Promise<Buffer | undefined>{
        await this.initWait

        if (eqCaptureArea(area, this.lastArea) && this.lastBgBuffer) {
            return this.lastBgBuffer
        }

        this.lastArea = area

        // 暂时不知怎么接受多显示器变化的通知, 所以多显示器下, 每次都刷新, 避免录制位置错误
        this.screenManager.mulDisplay && await this.getMacScreens(true)

        const cropArea = this.screenManager.getCropAreaStr(area)
        Logger.info(`>> Starting recordBgImage...  area: ${cropArea}`)

        let newSavePath: string = savePath
        Logger.info(`>> recordBgImage...  newSavePath: ${newSavePath}`)

        if (!savePath){
            newSavePath = join(this.saveDir, getRandomStr() + '.jpg')
        } else {
            relative && (newSavePath = join(this.saveDir, savePath))
            Logger.info(`>> recordBgImage...  newSavePath: ${newSavePath}`)

        }

        let waitResolve: any
        const wait = new Promise(resolve => waitResolve = resolve);

        // ffmpeg -f avfoundation -i "2" -vframes 1 -s 1920x1080 screenshot.png
        this.ffmpegCommand(this.currentScreen, false)
            .inputFormat(ScreenRecorder.MacScreenSource)
            .outputOptions([
                // `-vf "crop=${cropArea}"`,
                '-vframes 1',
            ])
            // .frames(1)
            // .videoFilter(`crop=${cropArea}`)
            // .noAudio()
            // .frames(1)
            // .size('1920x1080')
            .output(newSavePath)
            .on('start', function (commandLine) {
                Logger.info('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                waitResolve()
            })
            .on('error', (err: Error) => {
                Logger.error('Error recording screen:', err);
            })
            .run()

        await wait

        // staic 是 6.0 的, 不能直接 crop, 需要再转一遍
        await this.cropImage(newSavePath, newSavePath, cropArea)

        // // 插件有bug, 还是直接调用命令吧.
        // const args = `-f avfoundation -i 2 -y -vf "crop=${cropArea}" -vframes 1 ${newSavePath}`
        //     .split(' ')
        // const child = spawn(ffmpegPath, args)
        // Logger.info(`>> - ${ffmpegPath}`)
        //
        // child.on('close', (code) => {
        //     Logger.info(`child process close with code ${code}`);
        //     waitResolve()
        // });
        // child.on('exit', (code) => {
        //     Logger.info(`child process exited with code ${code}`);
        //     waitResolve()
        // });
        // child.on('error', (err: Error) => {
        //     Logger.error(`child process error with: ${err}`);
        // })
        // child.stderr.on('data', (chunk) => {
        //     Logger.info(`child process stderr: ${chunk}`);
        // })

        Logger.info(`>> recordBgImage...  img: ${newSavePath}`)

        const buffer = await this.fileService.openBuffer(newSavePath)
        // const blob = new Blob([buffer], { type: 'image/png' })
        // return blob
        this.lastBgBuffer = buffer
        return buffer
    }

    async convertToGif(inputVideo: string, videoArg?: VideoArgs, webContentId?: number): Promise<string>{
        Logger.info(`>> convertToGif(inputVideo: ${inputVideo}`)
        if (!await this.fileService.isExists(inputVideo)){
            Logger.info(`>> convertToGif file not exists`)
            return
        }

        const [_dir, _name, _ext] = getPathDirAndNameAndExt(inputVideo)

        let output: string = join(_name, _name+'.gif')

        // if (this.contextKeyService.getValByKey(ContextKey.AskWhenSaveInPreview) === true) {
        if (this.contextKeyService.getValByKey(ContextKey.AskWhenSaveInPreview) !== false) {
            const win = this.windowsManager.findWinByWebId(webContentId)
            output = await this.dialogService.openSaveFileDialog(
                win.originWin, output, )
            Logger.info(`>> convertToGif get file from dialog ${output}`)
        }

        Logger.info(`>> convertToGif get output ${output}`)

        if (videoArg && videoArg.videoType !== 'gif'){
            Logger.info(`>> convertToGif file type ${videoArg.videoType} not support`)
            return
        }

        let cmd = this.ffmpegCommand(inputVideo, false)
        if (videoArg.videoSize && videoArg.videoSize !== 'origin') {
            const size = MovieStream.getVideoSize(videoArg.videoSize as MovieQuality)
            Logger.info(`>> convertToGif get convert size ${size}`)
            cmd = cmd.inputOptions([
                `-vf "scale=${size[0]}:-1"`
            ])
        }
        if (videoArg.fps && videoArg.fps !== 'origin') {
            const useFps = Number(videoArg.fps)
            Logger.info(`>> convertToGif get convert useFps ${useFps}`)
            cmd = cmd.inputFPS(useFps)
        }
        cmd = cmd.output(output)
        this.cmdCommonDo(cmd)
        return output
    }

}

export namespace ScreenRecorder {
    export const MacScreenSource = 'avfoundation'
}
