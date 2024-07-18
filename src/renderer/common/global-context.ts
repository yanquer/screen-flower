import {createContext} from "react";

export interface IRecordContext{
    recording: boolean
    setRecording?(recording: boolean): void
}

export const RecordContext = createContext<IRecordContext>({
    recording: false
})
