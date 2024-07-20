import {useContext, useEffect, useRef, useState} from "react";
import {IRecordContext, RecordContext} from "../../common/global-context";


export const RecordedTimer = () => {
    const {recording, pause}: IRecordContext = useContext(RecordContext)

    const [rTimer, setRTimer] = useState<number>(0);
    const [rTimeText, setRTimeText] = useState<string>("00:00");
    const timeRef = useRef<HTMLDivElement>(undefined);

    useEffect(() => {
        if (recording) {
            const timerI = setInterval(() => {
                if (!pause) {
                    setRTimer((prevState) => prevState + 1);
                }
            }, 1000)

            return () => clearInterval(timerI)
        } else {
            setRTimer(0)
        }
    }, [recording, rTimer])

    useEffect(() => {
        timeFormat()
    }, [rTimer])

    const timeFormat = () => {
        const hours = Math.floor(rTimer / 3600);
        const minutes = Math.floor((rTimer % 3600) / 60);
        const seconds = rTimer % 60;

        // Determine the timestamp format based on the total duration (t)
        const newTimestamp =
            hours > 0
                ? `${hours.toString().padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                : `${minutes.toString().padStart(2, "0")}:${seconds
                    .toString()
                    .padStart(2, "0")}`;

        // Adjust the width of the time display based on the duration
        if (hours > 0) {
            // Adjust for HH:MM:SS format when hours are present
            timeRef.current.style.width = "58px"; // You might need to adjust this value based on your actual UI
        } else {
            // Adjust for MM:SS format when there are no hours
            timeRef.current.style.width = "42px"; // Adjust this value as needed
        }

        setRTimeText(newTimestamp);
    }

    const render = () => {
        return (<div ref={timeRef} className={'text-gray-600 text-xs text-center'}>
            {rTimeText}
        </div>)
    }

    return render()

}