import {SettingView} from "../components/setting-view";
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {ISettingService} from "../../common/service";

const SettingPage = () => {
    const {canSetting, setCachePath, setLogPath} = useContext(RecordContext)

    // 设置
    useEffect(() => {
        if (canSetting){
            invokeElectronHandlerAsync(async () => {
                const setService = getServiceBySymbol<ISettingService>(ISettingService)
                setCachePath(await setService.getCachePath())
                setLogPath(await setService.getLogPath())
            }).then()
        }
    }, [canSetting]);

    const render = () => {
        return canSetting ? <div>
            <SettingView/>
        </div> : ""
    }

    return render();
}


export default SettingPage;

