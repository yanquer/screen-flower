
import {CaptureWin} from "../layout/capture-win";
import {ActionToolBar} from "../layout/action-bar/action-tool-bar";
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandler} from "../common/common";
import {IUtilService} from "../../common/service";
import {getServiceBySymbol} from "@yanquer/common/common";
import {Logger} from "../common/logger";
import {DefaultBgView} from "../components/default-bg-view";


const Capture_ = () => {

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

    return <div>
        <CaptureWin/>
        <ActionToolBar/>
    </div>
}

export default function Capture() {
    const {canCapture} = useContext(RecordContext)

    const render = () => {
        return (
            canCapture ? <Capture_ /> : <DefaultBgView mode={'cap'}/>
        )
    }

    return render()
}


