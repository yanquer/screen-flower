import {Component} from "react";
import {CaptureWin} from "../components/capture-win";
import {ActionToolBar} from "../components/action-tool-bar";


class _Capture extends Component<any, any>{

    render() {
        return (
            <div>
                <CaptureWin/>
                <ActionToolBar/>
            </div>
        )
    }
}

export default function CapturePage(){
    return (<_Capture/>)
}


