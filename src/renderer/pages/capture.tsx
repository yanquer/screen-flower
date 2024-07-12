import {Component} from "react";
import {CaptureWin} from "../components/capture-win";
import {ActionBar} from "../components/action-bar";

export default class Capture extends Component<any, any>{

    render() {
        return (
            <div>
                <CaptureWin/>
                <ActionBar/>
            </div>
        )
    }
}


