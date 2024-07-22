import 'reflect-metadata'

import {ScreenRecorder} from "../main/middle/ffemp/screen-recorder";


async function testGetFFmpegInputs(){
    console.log(process.env.NODE_ENV)
    const recorder = new ScreenRecorder()
    await recorder.getMacScreens()
    expect(recorder.currentScreen)
}

describe('testMain', () => {
    it("ffmpeg inputs", async () => {
        await testGetFFmpegInputs();
        expect(1+1).toBe(2);
    }, 50000)

    // it('renders correctly', () => {
    //     render(<MyComponent />);
    //     expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    // });
    //
    // it('handles button click', () => {
    //     render(<MyComponent />);
    //     const button = screen.getByRole('button', { name: /click me/i });
    //     fireEvent.click(button);
    //     expect(screen.getByText(/clicked/i)).toBeInTheDocument();
    // });
});
