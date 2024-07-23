import {IScreenManager} from "../service";
import {Emitter} from "../../../common/event";
import {injectable, postConstruct} from "inversify";
import {Display, screen} from "electron";
import {CaptureArea, CursorPosition, ScreenArea} from "../../../common/models";
import {toNumber} from "lodash";
import {Logger} from "../../common/logger";


@injectable()
export class ScreenManager implements IScreenManager{
    currentScreenId: string;

    protected _allDisplays: Display[]
    protected getAllScreen(refresh: boolean=false): Display[]{
        if (refresh || !this._allDisplays){
            this._allDisplays = screen.getAllDisplays()
        }
        return this._allDisplays
    }

    // 多显示器时, 会把所有显示器合并为一个平面, 获取的是在整个屏幕上的坐标
    //  获取鼠标在所有屏幕上的绝对位置
    protected getFoucPointInAllDisplay(): CursorPosition{
        return screen.getCursorScreenPoint() as CursorPosition
    }

    // 多显示器时, 会把所有显示器合并为一个平面, 获取的相对于当前屏幕的坐标
    //  获取鼠标在当前屏幕上的相对位置
    protected getPointInFocusDisplay(): CursorPosition{
        const pos = this.getFoucPointInAllDisplay()
        const {x, y} = this.getCurrentScreenArea()
        return {x: pos.x - x, y: pos.y - y}
    }

    get mulDisplay(){return this._mulDisplay}
    protected _mulDisplay = false
    protected getFoucScreen(): Display {
        const allDisplays = this.getAllScreen()
        if (allDisplays === undefined) {
            throw new Error('Cant find the screen, are you bind the display ?')
        }
        if (allDisplays.length === 1){
            this._mulDisplay = false
            return allDisplays[0]
        }
        this._mulDisplay = true
        const cursor = this.getFoucPointInAllDisplay()
        return screen.getDisplayNearestPoint(cursor)
    }

    // 包括任务栏
    protected _currentScreenArea: ScreenArea
    // 不包括任务栏
    protected _currentScreenAreaOnlyContent: ScreenArea
    getCurrentScreenArea(refresh: boolean=false, fullArea: boolean=true): ScreenArea{
        if (!this._currentScreenArea || !this._currentScreenAreaOnlyContent || refresh) {
            const screen = this.getFoucScreen()
            this._currentScreenArea = screen.bounds as ScreenArea
            this._currentScreenAreaOnlyContent = screen.workArea as ScreenArea
        }
        return fullArea ? this._currentScreenArea : this._currentScreenAreaOnlyContent
    }

    protected _currentScreenIndex: number
    protected getCurrentDisplay(): Display {
        const allDisplays = this.getAllScreen()
        if (allDisplays === undefined) {
            throw new Error('Cant find the screen, are you bind the display ?')
        }
        if (allDisplays.length === 1){
            this._currentScreenIndex = 0
            return allDisplays[0]
        }
        const cursor = this.getFoucPointInAllDisplay()
        const scr = screen.getDisplayNearestPoint(cursor)
        allDisplays.map((one, index) => {
            if (one.id === scr.id){
                this._currentScreenIndex = index
            }
        })
        return scr
    }

    protected refreshDisplayEmitter = new Emitter<void>()
    refreshDisplayEvent = this.refreshDisplayEmitter.event

    constructor() {
        this._init()
    }

    protected _init(){
        this.needRefreshInfo()
        this.bindScreenEvent().then()
    }

    protected needRefreshInfo(){
        this.getAllScreen(true)
        this.getCurrentScreenArea(true)
        this.refreshDisplayEmitter.fire()
    }

    protected async bindScreenEvent(){
        screen.on('display-added', (event, oldDisplay) => {
            this.needRefreshInfo()
        })
        screen.on('display-removed', (event, oldDisplay) => {
            this.needRefreshInfo()
        })
        screen.on('display-metrics-changed', (event, display, changedMetrics) => {
            Logger.info('>> display metrics changed', changedMetrics)
        })
    }

    getCursorPosition(): CursorPosition {
        return this.getPointInFocusDisplay();
    }

    getCurrentScreenIndex(refresh: boolean=false): number {
        if (refresh || !this._currentScreenIndex){
            this.getCurrentDisplay()
        }

        return this._currentScreenIndex;
    }

    protected _PPI: number
    // 获取屏幕 ppi, 方便将物理像素转换为逻辑像素
    // PPI (Pixels Per Inch)
    //  表示每英寸有多少个物理像素
    protected getPpi(refresh: boolean=false) {
        if (refresh || !this._PPI) {
            const display: Display = this.getCurrentDisplay()

            // scaleFactor: device's pixel scale factor.
            //  当前显示器的缩放比例
            const {size, scaleFactor} = display

            const physicalWidth = size.width / scaleFactor;
            const physicalHeight = size.height / scaleFactor;

            this._PPI = Math.sqrt(size.width * size.width + size.height * size.height) /
                Math.sqrt(physicalWidth * physicalWidth + physicalHeight * physicalHeight);

            Logger.info(`>>> ${size.width} -- ${size.height} -- ${physicalWidth} -- ${physicalHeight}`)
        }
        return this._PPI
    }

    // 获取 ffmpeg 使用区域
    //  需要将前端传过来的CSS像素, 转换为物理像素
    getCropAreaStr(area: CaptureArea): string{
        Logger.info('>>> prep convert size...')
        const curPpi = this.getPpi()
        Logger.info(area, curPpi)
        const width = toNumber(`${area.width}`.replace('px', ''))
        const height = toNumber(`${area.height}`.replace('px', ''))
        // 剪去边框
        return `${(width-4) * curPpi}:${(height-4) * curPpi}:${(area.x+2) * curPpi}:${(area.y+2) * curPpi}`
    }


}