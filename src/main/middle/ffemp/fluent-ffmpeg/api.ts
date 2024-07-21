import {ReadStream} from "fs";

type FluentFfmpegEventName = 'end' | 'error' | 'start'
type CmdSignal =
    // 挂起线程, 可用作暂停
    'SIGSTOP' |
    // 恢复线程, 可用作暂停后的继续
    'SIGCONT' |
    'SIGTERM'


export interface FluentFfmpegApi{

    ffmpegProc: any


    //
    // Input options
    //

    // 设置输入
    input(videoFile: string | ReadStream): FluentFfmpegApi,
    addInput(videoFile: string | ReadStream): FluentFfmpegApi,
    mergeAdd(videoFile: string | ReadStream): FluentFfmpegApi,

    // 输入格式, 比如 mp4 mov avi
    inputFormat(format: string): FluentFfmpegApi,

    // 开始录屏
    // fromScreenCaptureAsync(): FluentFfmpegApi,

    // 设置视频帧率
    withInputFps(fps: number): FluentFfmpegApi,
    inputFPS(fps: number): FluentFfmpegApi,

    // 从屏幕获取帧
    native(): FluentFfmpegApi,
    withNativeFramerate(): FluentFfmpegApi,
    nativeFramerate(): FluentFfmpegApi,

    // set input start time
    // 比如开始几秒跳过?
    // number时, 单位为秒
    // 还可以是 `[[hh:]mm:]ss[.xxx]` 格式, 如 '2:14.500'
    seekInput(time: number | string): FluentFfmpegApi,
    setStartTime(time: number): FluentFfmpegApi,

    // loop over input
    // 循环输入
    loop(duration?: number | string): FluentFfmpegApi,

    // 自定义输入参数
    // 比如
    //      /* Single option */
    //      ffmpeg('/path/to/file.avi').inputOptions('-someOption');
    //
    //      /* Single option with parameter */
    //      ffmpeg('/dev/video0').inputOptions('-r 24');
    // 也支持数组
    //      ffmpeg('/path/to/file.avi').inputOptions([
    //          '-option1',
    //          '-option2 param2',
    //          '-option3',
    //          '-option4 param4'
    //      ]);
    //      ffmpeg('/path/to/file.avi').inputOptions(
    //          '-option1',
    //           '-option2', 'param2',
    //          '-option3',
    //          '-option4', 'param4'
    //      );
    inputOptions(option: string | string[]): FluentFfmpegApi,
    addInputOption(option: string | string[]): FluentFfmpegApi,
    addInputOptions(option: string | string[]): FluentFfmpegApi,
    withInputOption(option: string | string[]): FluentFfmpegApi,
    withInputOptions(option: string | string[]): FluentFfmpegApi,

    // 设置录制区域
    // crop=${cropArea}
    videoFilter(area: string): FluentFfmpegApi,

    //
    //  Audio options
    //

    // disable audio altogether
    noAudio(): FluentFfmpegApi,
    withNoAudio(): FluentFfmpegApi,

    // set audio codec
    //     如 ffmpeg('/path/to/file.avi').audioCodec('libmp3lame');
    audioCodec(codec: string): FluentFfmpegApi,
    withAudioCodec(codec: string): FluentFfmpegApi,

    // set audio bitrate
    //  如
    //      ffmpeg('/path/to/file.avi').audioBitrate(128);
    //      ffmpeg('/path/to/file.avi').audioBitrate('128');
    //      ffmpeg('/path/to/file.avi').audioBitrate('128k');
    audioBitrate(bitrate: number | string): FluentFfmpegApi,
    withAudioBitrate(bitrate: number | string): FluentFfmpegApi,

    // set audio channel count
    //  如
    //      ffmpeg('/path/to/file.avi').audioChannels(2);
    audioChannels(count: number): FluentFfmpegApi,
    withAudioChannels(count: number): FluentFfmpegApi,


    // set video codec
    //     如 ffmpeg('/path/to/file.avi').videoCodec('libx264')
    videoCodec(codec: string): FluentFfmpegApi,


    // 设置大小
    //  如
    //      size('320x200')
    size(data: string): FluentFfmpegApi,

    //
    //  如
    //      ffmpeg('/path/to/file.avi')
    //          .output('outputfile.mp4')
    //          .output(stream);
    //
    //      ffmpeg('/path/to/file.avi')
    //           // You may pass a pipe() options object when using a stream
    //          .output(stream, { end:true });
    output(outputFile: string | ReadStream, pipeOptions?: any): FluentFfmpegApi,

    //
    run(): void

    //  set output duration
    //  设置视频的总时长, 即使实际时间并没有达到
    // number时, 单位为秒
    // 还可以是 `[[hh:]mm:]ss[.xxx]` 格式, 如 '2:14.500'
    //      ffmpeg('/path/to/file.avi').duration(134.5);
    //      ffmpeg('/path/to/file.avi').duration('2:14.500');
    duration(time: number | string): FluentFfmpegApi,
    withDuration(time: number | string): FluentFfmpegApi,
    setDuration(time: number | string): FluentFfmpegApi,

    // 设置输出格式, 比如 flv
    format(format: string): FluentFfmpegApi,

    // update FLV metadata after transcoding
    // 转码后更新 flv 源数据
    //      ffmpeg('/path/to/file.avi').flvmeta().format('flv');
    flvmeta(): FluentFfmpegApi,

    // 使用预设信息
    //  如
    //      // Uses <path-to-fluent-ffmpeg>/lib/presets/divx.js
    //      ffmpeg('/path/to/file.avi').preset('divx');
    //
    //      // Uses /my/presets/foo.js
    //      ffmpeg('/path/to/file.avi', { presets: '/my/presets' }).preset('foo');
    preset(preset: string): FluentFfmpegApi,

    // 发信号
    // 默认 是 SIGKILL,  kill any running ffmpeg process
    kill(signal?: CmdSignal): FluentFfmpegApi,

    // 设置zhen
    frames(count: number): FluentFfmpegApi,
    takeFrames(count: number): FluentFfmpegApi,
    withFrames(count: number): FluentFfmpegApi,

    //
    outputOptions(option: string | string[]): FluentFfmpegApi,

    // // 设置视频码率, 比如 3Mbps 就是 3000000
    // withVideoBitrate(bit: number): FluentFfmpegApi,
    // // 设置视频编码器, 比如 libx264
    // withVideoCodec(coder: string): FluentFfmpegApi,
    // // 设置音频编码器, 比如 AAC 就是 aac
    // withAudioCodec(coder: string): FluentFfmpegApi,
    // // 设置音频通道数, 一般为 2
    // withAudioChannels(channelNum: number): FluentFfmpegApi,
    // // 设置音频码率, 如 128Kbps 就是 128000
    // withAudioBitrate(bit: number): FluentFfmpegApi,
    // // 设置音频采样率, 比如 44.1KHz 就是 44100
    // withAudioSampleRate(rate: number): FluentFfmpegApi,
    // // 保存录制的视频到文件 outputFile
    // saveToFile(outputFile: string): FluentFfmpegApi,
    //
    // // 设置录制时长, 单位: 秒
    // setDuration(capTime: number): FluentFfmpegApi,
    //

    // 事件定义
    on(eventName: FluentFfmpegEventName, listener: (...args: any[]) => void): FluentFfmpegApi,
}
