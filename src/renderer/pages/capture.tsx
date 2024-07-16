import {Component} from "react";
import {CaptureWin} from "../components/capture-win";
import {ActionBar} from "../components/action-bar";


class _Capture extends Component<any, any>{

    render() {
        return (
            <div>
                <CaptureWin/>
                <ActionBar/>
            </div>
        )
    }
}

export default function CapturePage(){
    return (<_Capture/>)
}


