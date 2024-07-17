
export enum WindowNames {
    CaptureWin = 'capture-window'

}

const isProd = process.env.NODE_ENV === 'production'
export const getHostUrl = (url: string) => {
    if (isProd) {
        return 'app://./home'
    } else {
        const port = process.argv[2]
        return `http://localhost:${port}/${url}`
        // mainWindow.webContents.openDevTools()
    }
}



