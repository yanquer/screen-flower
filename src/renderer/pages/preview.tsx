
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IUtilService} from "../../common/service";
import {PlayerView} from "../components/player/player-view";
import {DefaultBgView} from "../components/default-bg-view";
import {Logger} from "../common/logger";

const Preview_ = () => {
    const {previewBlob, setPreviewBlob,
        videoUrl, setVideoUrl,
        canPreview, setCanPreview} = useContext(RecordContext);

    // useEffect(()=>{
    //     // 用于打开预览窗口时, 如果没有 url, 初始化一下
    //     invokeElectronHandlerAsync(async () => {
    //         if (!videoUrl && canPreview) {
    //             const utilService: IUtilService = getServiceBySymbol(IUtilService);
    //             const videoPath: string = await utilService.askLastRecord(true) as string
    //             Logger.info("Preview get url form backend: ", videoPath)
    //             setVideoUrl(videoPath)
    //         }
    //     }).then()
    // }, [])

    // const [videoUrl, setVideoUrl] = useEffect<>("")

    // 每次加载的时候都刷新
    invokeElectronHandlerAsync(async () => {
        if (canPreview) {
            const utilService: IUtilService = getServiceBySymbol(IUtilService);
            const videoPath: string = await utilService.askLastRecord(true) as string
            Logger.info("Preview get url form backend: ", videoPath)
            setVideoUrl(videoPath)
        }
    }).then()

    useEffect(() => {

    }, []);

    Logger.debug("Preview preview with videoUrl: ", videoUrl)
    return <PlayerView playUrl={videoUrl} setPlayUrl={setVideoUrl}/>
}

export default function Preview(){
    const {canPreview} = useContext(RecordContext);

    Logger.debug("Preview preview with canPreview: ", canPreview)
    return (
        canPreview ? <div>
            <Preview_ />
        </div> :
            <DefaultBgView/>
    );
}
