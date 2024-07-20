import ffmpeg from 'ffmpeg-static';
import {fixPathForAsarUnpack} from 'electron-util';
import {IRecordService} from "../../../common/service";
import {injectable, postConstruct} from "inversify";
import {FluentFfmpegApi} from './fluent-ffmpeg/api'

const ffmpegPath = fixPathForAsarUnpack(ffmpeg);

import FfmpegCommand from 'fluent-ffmpeg';
import {CaptureArea} from "../../../common/models";
import {getCropAreaStr} from "../../common/electron/display";
import {Emitter, Event} from "../../../common/event";

FfmpegCommand.setFfmpegPath(ffmpegPath)

@injectable()
export class ScreenRecorder implements IRecordService{

    protected currentCmd: FluentFfmpegApi
    protected recordingRunEmitter = new Emitter<boolean>()
    recordingRunEmitterEvent: Event<boolean> = this.recordingRunEmitter.event

    protected ffmpegCommand = (input?: any): FluentFfmpegApi => {
        if (input) this.currentCmd = new FfmpegCommand(input);
        else this.currentCmd = new FfmpegCommand();
        return this.currentCmd
    }
    // protected ffmpegCommand = () => Ffmpeg('./report/video/simple.mp4');

    async startRecord(area: CaptureArea, savePath?: string,){

        const cropArea = getCropAreaStr(area)
        console.log(`>> Starting record...  area: ${cropArea}`)

        const output = './report/video/simple3.mp4'

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

}