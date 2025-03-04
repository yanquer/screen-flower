import {SettingView} from "../layout/setting-view";
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {DefaultBgView} from "../components/default-bg-view";
import {isFrontDev} from "../common/run-time-env";
import {Logger} from "../common/logger";

const SettingPage = () => {
    const {canSetting} = useContext(RecordContext)

    const render = () => {
        const showSettingPage = isFrontDev || canSetting
        Logger.debug("showSettingPage: ", showSettingPage)
        return (showSettingPage ? <SettingView/>: <DefaultBgView/>)
    }

    return render();
}


export default SettingPage;

