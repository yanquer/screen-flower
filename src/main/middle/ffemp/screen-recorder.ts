import ffmpeg from 'ffmpeg-static';
import {IFileService, IRecordService} from "../../../common/service";
import {inject, injectable, postConstruct} from "inversify";
import {FluentFfmpegApi} from './fluent-ffmpeg/api'

import FfmpegCommand from 'fluent-ffmpeg';
import {CaptureArea} from "../../../common/models";
import {getCropAreaStr, getFoucScreen} from "../../common/electron/display";
import {Emitter, Event} from "../../../common/event";
import {join} from "path";
import {getHomeDir} from "../../common/dynamic-defines";
import {getRandomStr} from "../../../renderer/common/common";
import {spawn} from "node:child_process";
import {Dispose} from "../../../common/container/dispose";
import {IWindowsManager} from "../../windows/base";
import {WindowNames} from "../../common/defines";
import {isTest} from "../../../common/common";
import {Process} from "../../common/process";
import ffmpegPath from "ffmpeg-static";

// import {fixPathForAsarUnpack} from 'electron-util'
// const {fixPathForAsarUnpack} = require('electron-util');
// const ffmpegPath = fixPathForAsarUnpack(ffmpeg);
// FfmpegCommand.setFfmpegPath(ffmpegPath)

if (!isTest()){
    const util = require('electron-util');
    const ffmpegPath = util.fixPathForAsarUnpack(ffmpeg);
    FfmpegCommand.setFfmpegPath(ffmpegPath)
} else (
    FfmpegCommand.setFfmpegPath(ffmpeg)
)


@injectable()
export class ScreenRecorder extends Dispose implements IRecordService{

    protected currentCmd?: FluentFfmpegApi
    protected recordingRunEmitter = new Emitter<boolean>()
    recordingRunEmitterEvent: Event<boolean> = this.recordingRunEmitter.event

    @inject(IFileService)
    protected readonly fileService: IFileService
    @inject(IWindowsManager)
    protected readonly windowsManager: IWindowsManager

    protected saveDir: string

    protected initWait: Promise<any>

    @postConstruct()
    protected init(){
        this.saveDir = join(getHomeDir(), "./screen-recorder");
        this.fileService.isExists(this.saveDir).then(async (exists) => {
            !exists && await this.fileService.mkDir(this.saveDir)
        })

        this.addServiceToCleanUp(this)

        const capWin = this.windowsManager.getWinById(WindowNames.CaptureWin)
        if (capWin){
            capWin.windowHideEmitterEvent(
                (winName: WindowNames) => {
                    if (winName === WindowNames.CaptureWin){
                        console.log('>>> close cap win')
                        this.stopRecord().then()
                    }
                }
            )
        }

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
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                console.log(`${desc} finished!`);
            })
            .on('error', (err: Error) => {
                console.error(`Error ${desc}`, err);
            })
            .run()
    }

    currentScreen : string
    async getMacScreens(refresh: boolean=false){
        if (!this.currentScreen || refresh) {
            // @ts-ignore
            const screenIndex: number = isTest() ? 0 : getFoucScreen(true)

            const out = (await (new Process([
                isTest() ? ffmpeg : ffmpegPath,
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
                    // console.log(`>>> match ${matches[1]}`)
                    console.log(matches)
                    this.currentScreen = (matches[screenIndex] ?? matches[0]).match(screenIndexRegex)[1]
                    console.log(`>>> match index ${this.currentScreen}`)
                }
            }

            // console.log(out)

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
            //         console.log(`ffmpegCommand stdout start`);
            //         console.log(`${line}`);
            //         console.log(`ffmpegCommand stdout end`);
            //         waitResolve()
            //     })
            //     .on('end', () => waitResolve())
            // this.cmdCommonDo(cmd, 'getMacScreens')
            // await wait
        }
    }

    async startRecord(area: CaptureArea, savePath?: string,){
        await this.initWait
        const cropArea = getCropAreaStr(area)
        console.log(`>> Starting record...  area: ${cropArea}`)

        let newSavePath: string = savePath
        if (!savePath){
            newSavePath = join(this.saveDir, getRandomStr() + '.mp4')
        }

        const output = newSavePath ?? './report/video/simple3.mp4'

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

    async stopRecord(){
        console.log('>> Stop record... ')

        this.currentCmd?.kill('SIGTERM')
        // this.currentCmd.ffmpegProc.stdin.write('q')

        this.recordingRunEmitter.fire(false)

    }

    async pauseRecord(): Promise<void> {
        console.log('>> Pause record... ')
        this.currentCmd?.kill('SIGSTOP')
    }

    restartRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async resumeRecord(): Promise<void> {
        console.log('>> Resume record... ')
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
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                console.log('Cropping finished!');
                waitResolve()
            })
            .on('error', (err) => {
                console.error('An error occurred: ' + err.message);
            })
            .run();

        await wait
        return outputImg
    }

    async recordBgImage(area: CaptureArea, savePath?: string, relative?: boolean): Promise<Buffer | undefined>{
        await this.initWait

        const cropArea = getCropAreaStr(area)
        console.log(`>> Starting recordBgImage...  area: ${cropArea}`)

        let newSavePath: string = savePath
        console.log(`>> recordBgImage...  newSavePath: ${newSavePath}`)

        if (!savePath){
            newSavePath = join(this.saveDir, getRandomStr() + '.jpg')
        } else {
            relative && (newSavePath = join(this.saveDir, savePath))
            console.log(`>> recordBgImage...  newSavePath: ${newSavePath}`)

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
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                waitResolve()
            })
            .on('error', (err: Error) => {
                console.error('Error recording screen:', err);
            })
            .run()

        await wait

        // staic 是 6.0 的, 不能直接 crop, 需要再转一遍
        await this.cropImage(newSavePath, newSavePath, cropArea)

        // // 插件有bug, 还是直接调用命令吧.
        // const args = `-f avfoundation -i 2 -y -vf "crop=${cropArea}" -vframes 1 ${newSavePath}`
        //     .split(' ')
        // const child = spawn(ffmpegPath, args)
        // console.log(`>> - ${ffmpegPath}`)
        //
        // child.on('close', (code) => {
        //     console. log(`child process close with code ${code}`);
        //     waitResolve()
        // });
        // child.on('exit', (code) => {
        //     console. log(`child process exited with code ${code}`);
        //     waitResolve()
        // });
        // child.on('error', (err: Error) => {
        //     console.error(`child process error with: ${err}`);
        // })
        // child.stderr.on('data', (chunk) => {
        //     console.log(`child process stderr: ${chunk}`);
        // })

        console.log(`>> recordBgImage...  img: ${newSavePath}`)

        const buffer = await this.fileService.openBuffer(newSavePath)
        // const blob = new Blob([buffer], { type: 'image/png' })
        // return blob
        return buffer
    }

}

export namespace ScreenRecorder {
    export const MacScreenSource = 'avfoundation'
}
