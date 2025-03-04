"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import "plyr-react/plyr.css";
import dynamic from "next/dynamic";
import {getPathWithProtocol} from "../../../common/defines";
import {Logger} from "../../common/logger";
const Plyr = dynamic(() => import("plyr-react"), { ssr: false });


interface VideoPlayerProps {
    playUrl: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
    const playerRef = useRef(null);
    const [url, setUrl] = useState(null);
    const [source, setSource] = useState(null);
    const [isSet, setIsSet] = useState(false);

    const {playUrl} = props

    // useEffect(() => {
    //     if (
    //         playerRef.current &&
    //         playerRef.current.plyr &&
    //         contentState.updatePlayerTime
    //     ) {
    //         playerRef.current.plyr.currentTime = contentState.time;
    //     }
    // }, [contentState.time]);

    const options = useMemo(
        () => ({
            controls: ["play", "mute", "captions", "settings", "pip", "fullscreen"],
            ratio: "16:9",
            blankVideo: "",
            keyboard: {
                global: true,
            },
        }),
        []
    );

    useEffect(() => {

        const _setUrl = (preVal: string) => {
            if (playUrl) {
                const pUrl = getPathWithProtocol(playUrl)
                Logger.info(`>> video url _setUrl: ${pUrl}`)
                return pUrl
            }
        }

        setUrl(_setUrl)

        if (playUrl) {
            // const pUrl = getPathWithProtocol(videoUrl)
            // Logger.info(`>> video url: ${pUrl}`)
            // setSource({
            //     type: "video",
            //     sources: [
            //         {
            //             src: pUrl,
            //             type: "video/mp4",
            //         },
            //     ],
            // });
            // setUrl(pUrl);

            // if (playerRef.current && playerRef.current.plyr) {
            //   // Check when the video is playing, update the time in real time
            //   playerRef.current.plyr.on("timeupdate", () => {
            //     setContentState((prevContentState) => ({
            //       ...prevContentState,
            //       time: playerRef.current.plyr.currentTime,
            //       updatePlayerTime: false,
            //     }));
            //   });
            // }

        }
    }, [playUrl, playerRef]);

    useEffect(() => {
        const _setSource = (preVal: any) => {
            if (url) {
                Logger.info(`>> video url _setSource: ${url}`)
                return {
                    type: "video",
                    sources: [
                        {
                            src: url,
                            type: "video/mp4",
                        },
                    ],
                }
            }
        }

        setSource(_setSource)
    }, [url]);

    // useEffect(() => {
    //     if (playerRef.current && playerRef.current.plyr) {
    //         // Check when the video is playing, update the time in real time
    //         playerRef.current.plyr.on("timeupdate", () => {
    //             setContentState((prevContentState) => ({
    //                 ...prevContentState,
    //                 time: playerRef.current.plyr.currentTime,
    //                 updatePlayerTime: false,
    //             }));
    //         });
    //     }
    //
    //     return () => {
    //         if (playerRef.current && playerRef.current.plyr) {
    //             playerRef.current.plyr.off("timeupdate");
    //         }
    //     };
    // }, [playerRef]);

    // const handleClick = () => {
    //     if (isSet) return;
    //     if (playerRef.current && playerRef.current.plyr) {
    //         setIsSet(true);
    //         playerRef.current.plyr.on("timeupdate", () => {
    //             setContentState((prevContentState) => ({
    //                 ...prevContentState,
    //                 time: playerRef.current.plyr.currentTime,
    //                 updatePlayerTime: false,
    //             }));
    //         });
    //     }
    // };

    // useEffect(() => {
    //     if (isSet) return;
    //     const handleKeyPress = (event) => {
    //         if (playerRef.current && playerRef.current.plyr) {
    //             setIsSet(true);
    //             playerRef.current.plyr.on("timeupdate", () => {
    //                 setContentState((prevContentState) => ({
    //                     ...prevContentState,
    //                     time: playerRef.current.plyr.currentTime,
    //                     updatePlayerTime: false,
    //                 }));
    //             });
    //         }
    //     };
    //     window.addEventListener("keydown", handleKeyPress);
    //     return () => {
    //         window.removeEventListener("keydown", handleKeyPress);
    //     };
    // }, [isSet]);

    return (
        <div className="videoPlayer">
            <div className="playerWrap w-full h-full"
                 // onClick={handleClick}
            >
                {url && (
                    <Plyr
                        ref={playerRef}
                        id="plyr-player"
                        source={source}
                        options={options}
                    />
                )}
            </div>
            {/*<style>*/}
            {/*    {`*/}
			{/*		.plyr {*/}
			{/*			height: 90%!important;*/}
			{/*		}*/}
			{/*		@media (max-width: 900px) {*/}
			{/*			.videoPlayer {*/}
			{/*				height: 100%!important;*/}
			{/*				top: 40px!important;*/}
			{/*			}*/}
			{/*			.playerWrap {*/}
			{/*				height: calc(100% - 300px)!important;*/}
			{/*			}*/}
			{/*		`}*/}
            {/*</style>*/}
        </div>
    );
};



