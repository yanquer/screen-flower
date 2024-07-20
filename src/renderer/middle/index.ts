import {bindToDefaultContainer} from "../../common/container/inject-container";
import {IRecordService} from "../../common/service";
import {RecordService} from "./record-service";


const bindMiddle = () => {

    bindToDefaultContainer(IRecordService, RecordService);
}

bindMiddle()