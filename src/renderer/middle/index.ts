import {bindToDefaultContainer} from "../../common/container/inject-container";
import {IRecordService, IUtilService} from "../../common/service";
import {RecordService} from "./record-service";
import {UtilService} from "./util-service";


const bindMiddle = () => {

    bindToDefaultContainer(IRecordService, RecordService);
    bindToDefaultContainer(IUtilService, UtilService);
}

bindMiddle()