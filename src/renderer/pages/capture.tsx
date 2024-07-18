
import {CaptureWin} from "../components/capture-win";
import {ActionToolBar} from "../components/action-tool-bar";
import {RecordContext} from "../common/global-context";
import {useState} from "react";


export default function Capture() {
    const [recording, setRecording] = useState<boolean>(false)

    const render = () => {
        return (
            <RecordContext.Provider value={{
                recording, setRecording,
            }}>
                <div>
                    <CaptureWin/>
                    <ActionToolBar/>
                </div>
            </RecordContext.Provider>
        )
    }

    return render()
}


