import ffmpeg from 'ffmpeg-static';
import {fixPathForAsarUnpack} from 'electron-util';
import {IFileService, IRecordService} from "../../../common/service";
import {inject, injectable, postConstruct} from "inversify";
import {FluentFfmpegApi} from './fluent-ffmpeg/api'

const ffmpegPath = fixPathForAsarUnpack(ffmpeg);

import FfmpegCommand from 'fluent-ffmpeg';
import {CaptureArea} from "../../../common/models";
import {getCropAreaStr} from "../../common/electron/display";
import {Emitter, Event} from "../../../common/event";
import {join} from "path";
import {getHomeDir} from "../../common/dynamic-defines";
import {getRandomStr} from "../../../renderer/common/common";
import {spawn} from "node:child_process";

FfmpegCommand.setFfmpegPath(ffmpegPath)

@injectable()
export class ScreenRecorder implements IRecordService{

    protected currentCmd: FluentFfmpegApi
    protected recordingRunEmitter = new Emitter<boolean>()
    recordingRunEmitterEvent: Event<boolean> = this.recordingRunEmitter.event

    @inject(IFileService)
    protected readonly fileService: IFileService

    protected saveDir: string

    @postConstruct()
    protected init(){
        this.saveDir = join(getHomeDir(), "./screen-recorder");
        this.fileService.isExists(this.saveDir).then(async (exists) => {
            !exists && await this.fileService.mkDir(this.saveDir)
        })
    }

    protected ffmpegCommand = (input?: any): FluentFfmpegApi => {
        if (input) this.currentCmd = new FfmpegCommand(input);
        else this.currentCmd = new FfmpegCommand();
        return this.currentCmd
    }
    // protected ffmpegCommand = () => Ffmpeg('./report/video/simple.mp4');

    async startRecord(area: CaptureArea, savePath?: string,){

        const cropArea = getCropAreaStr(area)
        console.log(`>> Starting record...  area: ${cropArea}`)

        let newSavePath: string = savePath
        if (!savePath){
            newSavePath = join(this.saveDir, getRandomStr() + '.mp4')
        }

        const output = newSavePath ?? './report/video/simple3.mp4'

        // this.ffmpegCommand
        // this.ffmpegCommand({source: "1"})
        this.ffmpegCommand("2")
            .inputFormat('avfoundation')
            // .native()
            .noAudio()
            .videoFilter(`crop=${cropArea}`)
            .videoCodec('libx264')
            .format('matroska')
            .output(output)
            // .setDuration(18)
            .on('start', function (commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('end', () => {
                console.log('Screen recording finished!');
            })
            .on('error', (err: Error) => {
                console.error('Error recording screen:', err);
            })
            .run()

        // 时长不兼容所有软件...


        // console.log(this.currentCmd)
        this.recordingRunEmitter.fire(true)
    }

    async stopRecord(){
        console.log('>> Stop record... ')

        this.currentCmd.kill('SIGTERM')
        // this.currentCmd.ffmpegProc.stdin.write('q')

        this.recordingRunEmitter.fire(false)

    }

    async pauseRecord(): Promise<void> {
        console.log('>> Pause record... ')
        this.currentCmd.kill('SIGSTOP')
    }

    restartRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async resumeRecord(): Promise<void> {
        console.log('>> Resume record... ')
        this.currentCmd.kill('SIGCONT')
    }

    cancelRecord(): Promise<void> {
        return Promise.resolve(undefined);
    }

    async recordBgImage(area: CaptureArea, savePath?: string,): Promise<Buffer | undefined>{
        const cropArea = getCropAreaStr(area)
        console.log(`>> Starting recordBgImage...  area: ${cropArea}`)

        let newSavePath: string = savePath
        if (!savePath){
            newSavePath = join(this.saveDir, getRandomStr() + '.jpg')
        }

        let waitResolve: any
        const wait = new Promise(resolve => waitResolve = resolve);

        // ffmpeg -f avfoundation -i "2" -vframes 1 -s 1920x1080 screenshot.png
        this.ffmpegCommand("2")
            .inputFormat('avfoundation')
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

        const wait2 = new Promise(resolve => waitResolve = resolve);

        // staic 是 6.0 的, 不能直接 crop, 需要再转一遍
        this.ffmpegCommand(newSavePath)
            .videoFilter(`crop=${cropArea}`)
            // .outputOptions([
            //     `-vf "crop=${cropArea}"`,
            // ])
            .output(newSavePath)
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

        await wait2

        console.log(`>> recordBgImage...  img: ${newSavePath}`)

        const buffer = await this.fileService.openBuffer(newSavePath)
        // const blob = new Blob([buffer], { type: 'image/png' })
        // return blob
        return buffer
    }

}