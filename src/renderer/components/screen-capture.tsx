import React, { Component } from 'react';

interface ScreenCaptureProps {
    onStart?: (stream: MediaStream) => void;
    onStop?: (blobUrl: string) => void;
}

interface ScreenCaptureState {
    isRecording: boolean;
    mediaRecorder: MediaRecorder | null;
    recordedChunks: Blob[];
}

export class ScreenCapture extends Component<ScreenCaptureProps, ScreenCaptureState> {
    state: ScreenCaptureState = {
        isRecording: false,
        mediaRecorder: null,
        recordedChunks: [],
    };

    startCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });
            if (this.props.onStart) {
                this.props.onStart(stream);
            }

            const mediaRecorder = new MediaRecorder(stream);
            this.setState({ mediaRecorder, isRecording: true });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.setState((prevState) => ({
                        recordedChunks: [...prevState.recordedChunks, event.data],
                    }));
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(this.state.recordedChunks, { type: 'video/webm' });
                const blobUrl = URL.createObjectURL(blob);
                if (this.props.onStop) {
                    this.props.onStop(blobUrl);
                }
                this.setState({ recordedChunks: [] });
            };

            mediaRecorder.start();
        } catch (err) {
            console.error('Error capturing screen:', err);
        }
    };

    stopCapture = () => {
        if (this.state.mediaRecorder) {
            this.state.mediaRecorder.stop();
            this.setState({ isRecording: false });
        }
    };

    render() {
        return (
            <div>
                {this.state.isRecording ? (
                    <button onClick={this.stopCapture}>Stop Recording</button>
                ) : (
                    <button onClick={this.startCapture}>Start Recording</button>
                )}
            </div>
        );
    }
}

