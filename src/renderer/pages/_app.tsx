// for inject
// import 'reflect-metadata'
import "@yanquer/common/common"
// global css
import "@yanquer/common/style/css/all.css"

// bind
import '../middle'

import React, {useEffect, useState} from 'react'
import type { AppProps } from 'next/app'

import '@radix-ui/themes/styles.css';
import '../styles/globals.css'
import '../styles/drag-box.scss'
import {BarVideoMode, CursorMode, DefaultCapArea, RecordContext} from "../common/global-context";
import {useRouter} from "next/router";
import {CaptureArea} from "../../common/models";
import {Logger} from "../common/logger";
import {invokeElectronHandler} from "../common/common";
import {WindowNames} from "../../common/defines";
import {MovieQuality} from "../../common/movie-stream";
import {IUtilService} from "../../common/service";

// font
import "@fortawesome/fontawesome-free/css/all.css"
import {isFrontDev} from "../common/run-time-env";
import {getServiceBySymbol} from "@yanquer/common/common";
import {DefaultBgView} from "@yanquer/common/browser";


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

    const router = useRouter()
    const toPage = (pageUrl: string) => {
      router.push({ pathname: `${pageUrl}` }).then()
    }

  // 后端窗口关闭时, 关闭录制
  useEffect(() => {

    invokeElectronHandler(
        () => {
            window.ipcInvoke?.onHandleWindowClose((winName: WindowNames) => {
                Logger.info(`>>>> _app get: close ${winName}`);
                (winName === WindowNames.CaptureWin) && setCanCapture(false);
                (winName === WindowNames.SettingWin) && setCanSetting(false);
                if (winName === WindowNames.PlayerWin) {
                    Logger.debug("_app: set no video url and can't preview")
                    setCanPreview(false);
                }
                setRecording(false)
            })
          window.ipcInvoke?.onHandleWindowHide((winName: WindowNames) => {
            Logger.info(`>>>> _app get: hide ${winName}`);
            (winName === WindowNames.CaptureWin) && setCanCapture(false);
            (winName === WindowNames.SettingWin) && setCanSetting(false);
            (winName === WindowNames.PlayerWin) && setCanPreview(false);
            setRecording(false)
          })
          window.ipcInvoke?.onHandleWindowShow((winName: WindowNames) => {
            Logger.info(`>>>> _app get: show ${winName}`)
            console.log(`>>>> _app get: show ${winName}`)
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

    const [loadOver, setLoadOver] = useState<boolean>(false)

    useEffect(() => {
        setLoadOver(true)
    }, []);

  // 是否开发模式
    const [devMode, setDevMode] = useState<boolean>(false);
    useEffect(() => {
        invokeElectronHandler(() => {
            const utilService = getServiceBySymbol<IUtilService>(IUtilService)
            utilService?.isDevMode().then(dev => {
                setDevMode(dev)
            })
        })
    }, []);

  return (
      loadOver ? (<RecordContext.Provider value={{
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
        canCapture, setCanCapture,
        canSetting, setCanSetting,
          devMode, setDevMode,
      }}>
        <Component {...pageProps} />
      </RecordContext.Provider>) :
          <DefaultBgView/>
  )
}

export default MyApp
