
import {VideoPlayer} from "../components/player/video-player";
import Link from "next/link";
import {useContext, useEffect} from "react";
import {RecordContext} from "../common/global-context";
import {invokeElectronHandler, invokeElectronHandlerAsync} from "../common/common";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IUtilService} from "../../common/service";
import {createBlobByBuffer} from "../../common/common";
import {WindowNames} from "../../common/defines";
import {Logger} from "../common/logger";

export default function Preview(){
    const {previewBlob, setPreviewBlob,
        canPreview, setCanPreview} = useContext(RecordContext);

    useEffect(()=>{
        invokeElectronHandlerAsync(async () => {
            if (!previewBlob && canPreview) {
                const utilService: IUtilService = getServiceBySymbol(IUtilService);
                const videoBuffer = await utilService.askSelectAVideoFile()
                setPreviewBlob(createBlobByBuffer(videoBuffer))
            }
        }).then()
    }, [canPreview])

    return (
        canPreview ? <div>
            {/*<Link href={"/capture"}>返回录制</Link>*/}

            <VideoPlayer/>
        </div> : ""
    );
}
