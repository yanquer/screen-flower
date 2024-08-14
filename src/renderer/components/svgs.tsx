
import React from "react";
import { ReactSVG } from "react-svg";

interface SvgProps {
    width?: string;
    height?: string;
    className?: string;
}

const defaultSize = {width: "40", height: "40"};


export const GrabIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/grab-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const PlayIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/play-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const StopIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/stop-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const RestartIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/restart-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const PauseIcon = (props) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/pause-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const ResumeIcon = (props) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/resume-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};


export const DiscardIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/discard-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};


export const CloseButtonToolbar = (props: SvgProps) => {
    return (
        <ReactSVG
            className={props?.className ?? ""}
            src={"/images/components/action-tool-bar/close-button.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const CircleCloseButtonToolbar = (props: SvgProps) => {
    return (
        <ReactSVG
            className={props?.className ?? ""}
            src={"/images/components/action-tool-bar/circle-close-button.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const FullCircleCloseButtonToolbar = (props: SvgProps) => {
    return (
        <ReactSVG
            className={props?.className ?? ""}
            src={"/images/components/action-tool-bar/full-circle-close-button.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};


export const DrawIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/draw-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const BlurIcon = (props) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/blur-icon.svg"}
            width={props.width ?? defaultSize.width}
            height={props.height ?? defaultSize.height}
        />
    );
};

export const TargetCursorIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/target-cursor-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

export const HighlightCursorIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/highlight-cursor-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

export const SpotlightCursorIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/spotlight-cursor-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

export const CursorIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/cursor-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

export const MicIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/mic-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

export const CameraIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/camera-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

export const AudioIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/audio-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};


export const TransformIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/transform-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};


export const TrashIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/trash-icon.svg"}
            width={props.width}
            height={props.height}
        />
    );
};

// https://fontawesome.com/icons/ellipsis-vertical?f=classic&s=solid
export const EllipsisVerticalIcon = (props: SvgProps) => {
    return (
        <ReactSVG
            src={"/images/components/action-tool-bar/ellipsis-vertical.svg"}
            width={props.width}
            height={props.height}
        />
    );
};




