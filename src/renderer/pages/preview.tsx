
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IUtilService} from "../../common/service";
import {PlayerView} from "../components/player/player-view";

export default function Preview(){
    const {previewBlob, setPreviewBlob,
        videoUrl, setVideoUrl,
        canPreview, setCanPreview} = useContext(RecordContext);

    useEffect(()=>{
        invokeElectronHandlerAsync(async () => {
            if (!videoUrl && canPreview) {
                const utilService: IUtilService = getServiceBySymbol(IUtilService);
                const videoPath: string = await utilService.askLastRecord(true) as string
                setVideoUrl(videoPath)
            }
        }).then()
    }, [canPreview])

    return (
        canPreview && videoUrl ? <div>
            <PlayerView/>
        </div> :
            <div
                className={"w-full bg-gray-500 h-full"}
            ></div>
    );
}
