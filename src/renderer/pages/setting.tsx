import {SettingView} from "../components/setting-view";
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {ISettingService} from "../../common/service";
import {DefaultBgView} from "../components/default-bg-view";
import {Logger} from "../common/logger";

const SettingPage = () => {
    const {canSetting, setCachePath, setLogPath, setShowDock} = useContext(RecordContext)

    // 设置
    useEffect(() => {
        if (canSetting){
            invokeElectronHandlerAsync(async () => {
                const setService = getServiceBySymbol<ISettingService>(ISettingService)
                setCachePath(await setService.getCachePath())
                setLogPath(await setService.getLogPath())
                const showDock = await setService.getDockShow()
                Logger.info(`>> showDock: ${showDock}`)
                setShowDock(showDock)
            }).then()
        }
    }, [canSetting]);

    const render = () => {
        return canSetting ? <div>
            <SettingView/>
        </div> : <DefaultBgView/>
    }

    return render();
}


export default SettingPage;

