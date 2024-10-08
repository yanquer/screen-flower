import React, { useState, useEffect, useContext, useRef } from "react";
import {RecordContext} from "../../../common/global-context";
import {getServiceBySymbol} from "../../../../common/container/inject-container";
import {IUtilService} from "../../../../common/service";
import {Logger} from "../../../common/logger";

const CursorModes = () => {
  const {cursorMode, recording, setAllowPenetrate, isInActionBar} = useContext(RecordContext);
  const modeRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [size, setSize] = useState<{x: number, y: number} | undefined>()

  const clickTargetRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    modeRef.current = cursorMode;
  }, [cursorMode]);

  const mouseDownHandler = (e) => {
    if (modeRef.current === "target") {
      clickTargetRef.current.style.transform =
        "translate(-50%, -50%) scale(1)";
      clickTargetRef.current.style.opacity = "1";
    }
  };

  const mouseUpHandler = (e) => {
    if (modeRef.current === "target") {
      clickTargetRef.current.style.transform =
        "translate(-50%, -50%) scale(0)";
      clickTargetRef.current.style.opacity = "0";

      window.setTimeout(() => {
        clickTargetRef.current.style.transform =
          "translate(-50%, -50%) scale(1)";
      }, 350);
    }
  };

  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const lastMouseRef = useRef(lastMousePosition);

  useEffect(() => {
    lastMouseRef.current = lastMousePosition;
  }, [lastMousePosition]);

  const updateCursorPosition = () => {
    const scrollTop = window.scrollY;
    const scrollLeft = window.scrollX;

    const cursorElement =
      modeRef.current === "target"
        ? clickTargetRef
        : modeRef.current === "highlight"
        ? highlightRef
        : spotlightRef;

    if (cursorElement) {
      cursorElement.current.style.top = lastMouseRef.current.y + scrollTop + "px";
      cursorElement.current.style.left = lastMouseRef.current.x + scrollLeft + "px";
    }
  };

  const mouseMoveHandler = (e) => {
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    updateCursorPosition();
  };

  const scrollHandler = () => {
    updateCursorPosition();
  };

  // Show click target when user clicks anywhere for 1 second, animate scale up and fade out
  useEffect(() => {
    document.addEventListener("mousedown", mouseDownHandler);
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("scroll", scrollHandler);

    return () => {
      document.removeEventListener("mousedown", mouseDownHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

    const sizeRef = useRef(null);

    // 主要更新 按下后的位置
    useEffect(() => {
        const utilService: IUtilService = getServiceBySymbol(IUtilService)
        if (recording && !isInActionBar){
            sizeRef.current = setInterval(async () => {
                const {x, y} = await utilService.getCursorScreenPoint();
                if (x != size?.x || y != size.y){
                    setSize({x, y});
                }
            }, 100)
        } else {
            if (sizeRef.current) clearInterval(sizeRef.current);
        }

    }, [recording, isInActionBar]);

    // 监听主进程的鼠标移动
    // useEffect(() => {
    //     invokeElectronHandlerAsync(async () => {
    //         window.ipcInvoke.onHandleMouseMoveWhenRecording((pos) => {
    //             Logger.info('get position change from main: ', pos)
    //             setSize(pos);   // recording 判断不准确
    //             // if (recording){
    //             //     Logger.info(' position change from main set')
    //             //     setSize(pos);
    //             // }
    //         })
    //     }).then()
    // }, []);

    useEffect(() => {
        setLastMousePosition({ ...size });
        Logger.info(`>> u pos: ${size}`)
        Logger.info(size)
        updateCursorPosition();
    }, [size?.x, size?.y]);

  return (
    <div
    >
      <div
        className="cursor-highlight"
        ref={highlightRef}
        style={{
            display: cursorMode === "highlight" ? "block" : "none",
          // display: "block",
          visibility:
            cursorMode === "highlight" ? "visible" : "hidden",
          position: "absolute",

            // 设置到屏幕之外, 避免一开始卡一下在 0,0
          top: -100,
          left: -100,
          width: "80px",
          height: "80px",
          pointerEvents: "none",
          zIndex: 99999999999,
          background: "yellow",
          opacity: ".5",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          animation: "none",
            transition: "opacity 0.5s cubic-bezier(.25,.8,.25,1), transform .35s cubic-bezier(.25,.8,.25,1)",
        }}
      ></div>
      <div
        className="cursor-click-target"
        ref={clickTargetRef}
        style={{
          // display: "block",
          display: cursorMode === "target" ? "block" : "none",
          visibility:
            cursorMode === "target" ? "visible" : "hidden",
          position: "absolute",
          top: 0,
          opacity: 0,
          left: 0,
          width: "40px",
          height: "40px",
          transform: "translate(-50%, -50%) scale(1)",
          pointerEvents: "none",
          zIndex: 99999999999,
          border: "3px solid gray",
          // transform: "none",
          borderRadius: "50%",
          animation: "none",
          transition:
            "opacity .5s cubic-bezier(.25,.8,.25,1), transform .35s cubic-bezier(.25,.8,.25,1)",
        }}
      ></div>
      <div
        className="spotlight"
        ref={spotlightRef}
        style={{
          position: "absolute",
            display: cursorMode === "spotlight" ? "block" : "none",
          top: mousePosition.y + "px",
          left: mousePosition.x + "px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 99999999999,
        }}
      ></div>
      <style>
        {`
					@keyframes scaleDown {
							from {
									transform: translate(-50%, -50%) scale(1);
									opacity: 1;
							}
							to {
									transform: translate(-50%, -50%) scale(0);
									opacity: 0;
							}
					`}
      </style>
    </div>
  );
};

export default CursorModes;
