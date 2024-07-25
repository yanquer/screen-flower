// for inject
import 'reflect-metadata'
// bind
import '../middle'

import React, {useEffect, useState} from 'react'
import type { AppProps } from 'next/app'

import '@radix-ui/themes/styles.css';
import '../styles/globals.css'
import '../styles/drag-box.scss'
import {BarVideoMode, CursorMode, DefaultCapArea, MovieQuality, RecordContext} from "../common/global-context";
import {useRouter} from "next/router";
import {CaptureArea} from "../../common/models";
import {Logger} from "../common/logger";
import {invokeElectronHandler} from "../common/common";
import {WindowNames} from "../../common/defines";

Logger.info('>> start _app...')

function MyApp({ Component, pageProps }: AppProps) {

  const [recording, setRecording] = useState<boolean>(false)
  const [pause, setPause] = useState<boolean>(false)
    const [qualityValue, setQualityValue] = useState<MovieQuality>(MovieQuality.HD)
  const [useAudio, setUseAudio] = useState<boolean>(false)
  const [useVideo, setUseVideo] = useState<boolean>(false)
  const [areaElement, setAreaElement] = useState<HTMLCanvasElement>(null)
    const [canPreview, setCanPreview] = useState<boolean>(false)
    const [previewBlob, setPreviewBlob] = useState<Blob>(undefined)
    const [barMode, setBarMode] = useState<BarVideoMode>('none')
    const [cursorMode, setCursorMode] = useState<CursorMode>('none')
    const [blurView, setBlurView] = useState<boolean | string[]>(false)

    const [capArea, setCapArea] = useState<CaptureArea>(DefaultCapArea())

    const [allowPenetrate, setAllowPenetrate] = useState<boolean>(false)
    const [isInActionBar, setIsInActionBar] = useState<boolean>(false)

  const [canCapture, setCanCapture] = useState<boolean>(false)
  const [canSetting, setCanSetting] = useState<boolean>(false)

  // 设置
  const [showDock, setShowDock] = useState<boolean>(false)
  const [cachePath, setCachePath] = useState<string | null>(undefined)
  const [logPath, setLogPath] = useState<string | null>(undefined)

    const router = useRouter()
    const toPage = (pageUrl: string) => {
      router.push({ pathname: `${pageUrl}` }).then()
    }

  // 后端窗口关闭时, 关闭录制
  useEffect(() => {

    invokeElectronHandler(
        () => {
          window.ipcInvoke.onHandleWindowHide((winName: WindowNames) => {
            Logger.info(`>>>> _app get: hide ${winName}`);
            (winName === WindowNames.CaptureWin) && setCanCapture(false);
            (winName === WindowNames.SettingWin) && setCanSetting(false);
            (winName === WindowNames.PlayerWin) && setCanPreview(false);
            setRecording(false)
          })
          window.ipcInvoke.onHandleWindowShow((winName: WindowNames) => {
            Logger.info(`>>>> _app get: show ${winName} -- ${winName === WindowNames.SettingWin}`)
            setCanCapture(winName === WindowNames.CaptureWin);
            setCanSetting(winName === WindowNames.SettingWin);
            setCanPreview(winName === WindowNames.PlayerWin);
          })
        }
    )
    window.addEventListener('error', (error) => {
      // 处理渲染进程错误
      Logger.error(error)
    });
    router.events.on('routeChangeError', (err) => {
      Logger.error('>> Error loading route', err)
    })
  }, []);

  // Logger.info('re render app...')
  //   Logger.info(capArea)

  Logger.info('re run')

  return (
      <RecordContext.Provider value={{
        recording, setRecording,
          pause, setPause,
        qualityValue, setQualityValue,
        useAudio, setUseAudio,
        useVideo, setUseVideo,
        areaElement, setAreaElement,
          canPreview, setCanPreview,
          toPage,
          previewBlob, setPreviewBlob,
          barMode, setBarMode,
          cursorMode, setCursorMode,
          blurView, setBlurView,
          capArea, setCapArea,
          allowPenetrate, setAllowPenetrate,
        isInActionBar, setIsInActionBar,
        showDock, setShowDock,
        cachePath, setCachePath,
        logPath, setLogPath,
        canCapture, setCanCapture,
        canSetting, setCanSetting,

      }}>
        <Component {...pageProps} />
      </RecordContext.Provider>

  )
}

export default MyApp
