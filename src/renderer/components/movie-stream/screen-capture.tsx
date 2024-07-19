import React, { Component } from 'react';
import {IRecordContext, RecordContext} from "../../common/global-context";
import {MovieStream} from "../../common/movie-stream";

interface ScreenCaptureProps {
    onStart?: (stream: MediaStream) => void;
    onStop?: (blobUrl: string) => void;
}

interface ScreenCaptureState {
    isRecording: boolean;
    mediaRecorder?: MediaRecorder;
    recordedChunks: Blob[];
    liveStream?: MediaStream;
}

export class ScreenCapture extends Component<ScreenCaptureProps, ScreenCaptureState> {
    static contextType = RecordContext
    context: IRecordContext

    state: ScreenCaptureState = {
        isRecording: false,
        mediaRecorder: null,
        recordedChunks: [],
        liveStream: null,
    };

    protected getBitAndMimeType(){
        const {qualityValue} = this.context
        return MovieStream.getBitAndMimeType(qualityValue)
    }

    protected async initMediaRecorder(){
        try {
            const {useAudio, useVideo, areaElement} = this.context
            let stream: MediaStream
            if (!this.state.liveStream) {

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
                    video: useVideo,
                    audio: useAudio,
                });

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
                this.setState({liveStream: stream})
            } else {
                stream = this.state.liveStream
            }
            if (this.props.onStart) {
                this.props.onStart(this.state.liveStream);
            }

            const [mimeType, audioBits, videoBits] = this.getBitAndMimeType()

            if (!this.state.mediaRecorder) {
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: mimeType,
                    audioBitsPerSecond: audioBits,
                    videoBitsPerSecond: videoBits,
                });
                this.setState({mediaRecorder});

                // 录制时候, 数据块更新
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.setState((prevState) => ({
                            recordedChunks: [...prevState.recordedChunks, event.data],
                        }));
                    }
                };

                mediaRecorder.onstop = () => {
                    // const blob = new Blob(this.state.recordedChunks, { type: 'video/webm' });
                    if (!this.state.recordedChunks || this.state.recordedChunks.length === 0){
                        console.log('>> 没有获取到blob...')
                        return
                    }
                    const blob = new Blob(this.state.recordedChunks, {type: mimeType});
                    // 默认直接到预览界面
                    this.preview(blob)
                    // const blobUrl = URL.createObjectURL(blob);
                    // if (this.props.onStop) {
                    //     this.props.onStop(blobUrl);
                    // }
                    this.setState({recordedChunks: []});
                };
            }

        } catch (err) {
            this.setState({liveStream: null, mediaRecorder: null});
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
        this.setState({ isRecording: recording });
        // 更新全局状态
        setRecording(recording);
    }

    // 开始
    startCapture = async () => {
        console.log(">> 开始录制")
        await this.initMediaRecorder()
        if (this.state.mediaRecorder){
            this.state.mediaRecorder.start()
            this.setRecording(true)
        }
    };

    // 停止, 完全结束, 不可恢复
    stopCapture = () => {
        console.log(">> 停止录制")
        if (this.state.mediaRecorder) {
            this.state.mediaRecorder.stop();
            this.setRecording(false)
            this.setState({liveStream: null, mediaRecorder: null})
        }
    };

    // 暂停, 可以恢复
    pauseCapture = () => {
        console.log(">> 暂停录制")
        if (this.state.mediaRecorder) {
            this.state.mediaRecorder.pause();
        }
    };

    // 继续
    resumeCapture = () => {
        console.log(">> 继续录制")
        if (this.state.mediaRecorder){
            this.state.mediaRecorder.resume()
        }
    };

    // 重新开始录制, 仅清理chunk即可
    redoCapture = () => {
        console.log(">> 重新录制")
        this.setState({recordedChunks: []})
    }

    // 取消录制
    cancelCapture = () => {
        console.log(">> 取消录制")
        this.pauseCapture()
        this.setState({recordedChunks: []})
    }

    protected clear(){
        this.setState({
            // isRecording: false,
            mediaRecorder: null,
            recordedChunks: [],
            liveStream: null,
        })
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

