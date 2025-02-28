
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IUtilService} from "../../common/service";
import {PlayerView} from "../components/player/player-view";
import {DefaultBgView} from "../components/default-bg-view";
import {Logger} from "../common/logger";

export default function Preview(){
    const {previewBlob, setPreviewBlob,
        videoUrl, setVideoUrl,
        canPreview, setCanPreview} = useContext(RecordContext);

    useEffect(()=>{
        invokeElectronHandlerAsync(async () => {
            if (!videoUrl && canPreview) {
                const utilService: IUtilService = getServiceBySymbol(IUtilService);
                const videoPath: string = await utilService.askLastRecord(true) as string
                Logger.info("Preview get url form backend: ", videoPath)
                setVideoUrl(videoPath)
            }
        }).then()
    }, [canPreview])

    Logger.debug("Preview preview with canPreview: ", canPreview)
    Logger.debug("Preview preview with videoUrl: ", videoUrl)
    return (
        canPreview && videoUrl ? <div>
            <PlayerView/>
        </div> :
            <DefaultBgView/>
    );
}
