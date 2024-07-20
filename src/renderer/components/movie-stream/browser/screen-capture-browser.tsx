import React, { Component } from 'react';
import {IRecordContext, RecordContext} from "../../../common/global-context";
import {MovieStream} from "../../../common/movie-stream";

interface ScreenCaptureProps {
    onStart?: (stream: MediaStream) => void;
    onStop?: (blobUrl: string) => void;
}

interface ScreenCaptureState {
    isRecording: boolean;
    mediaRecorder?: MediaRecorder;
    recordedChunks: Blob[];
    liveStream?: MediaStream;
    cancel?: boolean
}

export class ScreenCaptureBrowser extends Component<ScreenCaptureProps, ScreenCaptureState> {
    static contextType = RecordContext
    context: IRecordContext

    // 与渲染无关
    stateSync: ScreenCaptureState = {
        isRecording: false,
        mediaRecorder: null,
        recordedChunks: [],
        liveStream: null,
        cancel: false,
    };

    protected getBitAndMimeType(){
        const {qualityValue} = this.context
        return MovieStream.getBitAndMimeType(qualityValue)
    }

    protected async initMediaRecorder(){
        try {
            const {useAudio, useVideo, areaElement} = this.context
            let stream: MediaStream
            if (!this.stateSync.liveStream) {

                const [width, height] = MovieStream.getVideoSize(this.context.qualityValue)
                const fps = 30

                const reqStreamOption: DisplayMediaStreamOptions = {
                    // preferCurrentTab: true,
                    audio: useAudio, // data.systemAudio,
                    video: {
                        frameRate: fps,
                        width: {
                            ideal: width,
                        },
                        height: {
                            ideal: height,
                        },
                    },
                }

                // 会请求屏幕录制权限
                stream = await navigator.mediaDevices.getDisplayMedia(reqStreamOption ?? {
                // stream = await navigator.mediaDevices.getUserMedia(reqStreamOption ?? {
                    video: useVideo,
                    audio: useAudio,
                });

                const track: MediaStreamTrack = stream.getVideoTracks()[0]

                // 裁剪好像无效?
                // @ts-ignore
                // track.cropTo({
                //     x: 100,
                //     y: 100,
                //     width: 100,
                //     height: 100
                // })

                // if (areaElement){
                //     console.log(">> 区域录制")
                //
                //     // 不行, 只有当 canvas 有绘制行为的时候 才可以录制, 而且没发当作正常的录屏使用
                //
                //     const ctx = areaElement.getContext('2d');
                //
                //     // 在 canvas 上绘制一些内容
                //     ctx.fillRect(0, 0, 100, 100);
                //
                //     stream = areaElement.captureStream(
                //         // 25,      // 25fps
                //         0
                //     )
                // } else {
                //     // 全屏录制
                //     console.log(">> 全屏录制")
                //     stream = await navigator.mediaDevices.getDisplayMedia({
                //         video: useVideo,
                //         audio: useAudio,
                //     });
                // }
                this.stateSync.liveStream = stream
            } else {
                stream = this.stateSync.liveStream
            }
            if (this.props.onStart) {
                this.props.onStart(this.stateSync.liveStream);
            }

            const [mimeType, audioBits, videoBits] = this.getBitAndMimeType()

            if (!this.stateSync.mediaRecorder) {
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: mimeType,
                    audioBitsPerSecond: audioBits,
                    videoBitsPerSecond: videoBits,
                });
                this.stateSync.mediaRecorder = mediaRecorder;

                // 录制时候, 数据块更新
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0 && !this.stateSync.cancel) {
                        this.stateSync.recordedChunks = [
                            ...this.stateSync.recordedChunks,
                            event.data,
                        ]
                    }
                    this.stateSync.cancel = false
                };

                mediaRecorder.onstop = () => {
                    if (!this.stateSync.recordedChunks || this.stateSync.recordedChunks.length === 0){
                        console.log('>> 没有获取到blob...')
                        return
                    }
                    const blob = new Blob(this.stateSync.recordedChunks, {type: mimeType});
                    // 默认直接到预览界面
                    this.preview(blob)
                    // const blobUrl = URL.createObjectURL(blob);
                    // if (this.props.onStop) {
                    //     this.props.onStop(blobUrl);
                    // }
                    this.stateSync.recordedChunks = []
                };
                return mediaRecorder
            }

        } catch (err) {
            this.stateSync.liveStream = null
            this.stateSync.mediaRecorder = null
            console.error('>>> Error capturing screen initMediaRecorder:', err);
        }
    }

    protected preview(blob: Blob){
        const { toPage, setPreviewBlob } = this.context

        // const blobUrl = URL.createObjectURL(blob);

        setPreviewBlob(blob);

        // 自动跳转到 preview
        toPage('/preview')

    }

    protected async saveToLocal(blob: Blob){
        const buffer = Buffer.from( await blob.arrayBuffer() );

        // fs.writeFile('video.webm', buffer, () => console.log('video saved!') );
    }

    componentDidMount() {
        // this.initMediaRecorder().then()
    }
    componentWillUnmount() {
        this.clear()
    }

    protected setRecording(recording: boolean) {
        const {setRecording} = this.context
        this.stateSync.isRecording = recording
        // 更新全局状态
        setRecording(recording);
    }

    // 开始
    startCapture = async () => {
        console.log(">> 开始录制")
        await this.initMediaRecorder()
        this.stateSync.mediaRecorder.start()
        this.setRecording(true)
    };

    // 停止, 完全结束, 不可恢复
    stopCapture = () => {
        console.log(">> 停止录制")
        if (this.stateSync.mediaRecorder) {
            this.stateSync.mediaRecorder.stop();
            this.setRecording(false)

            // 测试的时候就不清除了
            // this.setState({recordedChunks: []})
            this.stateSync.liveStream = null
            this.stateSync.mediaRecorder = null
        }
    };

    // 暂停, 可以恢复
    pauseCapture = () => {
        console.log(">> 暂停录制")
        if (this.stateSync.mediaRecorder) {
            this.stateSync.mediaRecorder.pause();
        }
    };

    // 继续
    resumeCapture = () => {
        console.log(">> 继续录制")
        if (this.stateSync.mediaRecorder){
            this.stateSync.mediaRecorder.resume()
        }
    };

    // 重新开始录制, 仅清理chunk即可
    redoCapture = () => {
        console.log(">> 重新录制")
        this.stateSync.recordedChunks = []
    }

    // 取消录制
    cancelCapture = () => {
        console.log(">> 取消录制")
        this.stateSync.cancel = true
        this.pauseCapture()
        this.stateSync.recordedChunks = []
        this.stopCapture()
    }

    protected clear(){
        this.stateSync.mediaRecorder = null
        this.stateSync.recordedChunks = []
        this.stateSync.liveStream = null

        this.setRecording(false)
    }

    render() {
        return (
            <div>
                {/*{this.state.isRecording ? (*/}
                {/*    <button onClick={this.stopCapture}>Stop Recording</button>*/}
                {/*) : (*/}
                {/*    <button onClick={this.startCapture}>Start Recording</button>*/}
                {/*)}*/}
            </div>
        );
    }
}

