
import {CaptureWin} from "../components/capture-win";
import {ActionToolBar} from "../components/action-bar/action-tool-bar";


export default function Capture() {
    const render = () => {
        return (
            <div>
                <CaptureWin/>
                <ActionToolBar/>
            </div>
        )
    }

    return render()
}


