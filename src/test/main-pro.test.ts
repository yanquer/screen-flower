import 'reflect-metadata'

import {ScreenRecorder} from "../main/middle/ffemp/screen-recorder";

// import {execa} from "execa";
// const {execa} = require('execa');
// const {execa} = await import('execa');

async function testGetFFmpegInputs(){
    console.log(process.env.NODE_ENV)
    const recorder = new ScreenRecorder()
    await recorder.getMacScreens()
    console.log(`>>> current screen: ${recorder.currentScreen}`)
    expect(recorder.currentScreen)
}

async function testExec(){
    // 暂时不用 execa, 因为 新版是 ESM, 支持性欠佳
    const {execa} = await import('execa');
    const {stdout, code, stderr} = await execa('ls', ['-l ./'])
    console.log(stdout, code, stderr)
}

describe('testMain', () => {
    it("ffmpeg inputs", async () => {
        await testGetFFmpegInputs();
        // expect(1+1).toBe(2);
    }, 5000)

    it("test exec", async () => {
        // await testExec();
    }, 5000)

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
