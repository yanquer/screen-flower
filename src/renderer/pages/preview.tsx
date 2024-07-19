
import {VideoPlayer} from "../components/video-player";
import Link from "next/link";

export default function Preview(){
    return (
        <div>
            <Link href={"/capture"}>返回录制</Link>
            <VideoPlayer/>
        </div>
    );
}
