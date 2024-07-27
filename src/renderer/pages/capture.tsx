
import {CaptureWin} from "../components/capture-win";
import {ActionToolBar} from "../components/action-bar/action-tool-bar";
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandler} from "../common/common";
import {IUtilService} from "../../common/service";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {Logger} from "../common/logger";
import {DefaultBgView} from "../components/default-bg-view";


export default function Capture() {
    const {recording, canCapture, allowPenetrate} = useContext(RecordContext)

    // 是否允许点击穿透
    useEffect(() => {
        invokeElectronHandler(() => {
            const utilService: IUtilService = getServiceBySymbol<IUtilService>(IUtilService)

            if (canCapture) {
                if (recording) {
                    Logger.info(`>> recording ${allowPenetrate}`)
                    if (allowPenetrate) {
                        utilService.setClickPenetrate(true).then()
                    } else {
                        utilService.setClickPenetrate(false).then()
                    }
                } else {
                    Logger.info(`>> no recording ${allowPenetrate}`)
                    // 没有录制时就不允许变
                    allowPenetrate || utilService.setClickPenetrate(false).then()
                }
            }
        })

    }, [allowPenetrate]);

    const render = () => {
        return (
            canCapture ? <div>
                <CaptureWin/>
                <ActionToolBar/>
            </div> : <DefaultBgView mode={'cap'}/>
        )
    }

    return render()
}


