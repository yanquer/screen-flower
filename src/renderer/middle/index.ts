import {bindToDefaultContainer} from "@yanquer/common/common";
import {IRecordService, ISettingService, IUtilService} from "../../common/service";
import {RecordService} from "./record-service";
import {UtilService} from "./util-service";
import {isElectronEnv} from "../common/common";
import {SettingService} from "./setting-service";


const bindMiddle = () => {

    bindToDefaultContainer(IRecordService, RecordService);
    bindToDefaultContainer(IUtilService, UtilService);
    bindToDefaultContainer(ISettingService, SettingService);
}

if (isElectronEnv()) bindMiddle()
