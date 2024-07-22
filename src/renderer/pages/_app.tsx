// for inject
import 'reflect-metadata'
// bind
import '../middle'

import React, {useEffect, useRef, useState} from 'react'
import type { AppProps } from 'next/app'

import '@radix-ui/themes/styles.css';
import '../styles/globals.css'
import '../styles/drag-box.scss'
import {BarVideoMode, CursorMode, DefaultCapArea, MovieQuality, RecordContext} from "../common/global-context";
import {useRouter} from "next/router";
import {CaptureArea} from "../../common/models";
import {getServiceBySymbol} from "../../common/container/inject-container";
import {IUtilService} from "../../common/service";


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

    const router = useRouter()
    const toPage = (pageUrl: string) => {
      router.push({ pathname: `${pageUrl}` }).then()
    }

  const switchBodyPointer = (penetrate: boolean) => {
    const body = document.body;
    // body.toggleAttribute('pointer-events-none')
    if (penetrate) {
      body.classList.add('pointer-events-none')
    } else {
      body.classList.remove('pointer-events-none')
    }
    console.log(body.className)
  }

  // 后端窗口关闭时, 关闭录制
  useEffect(() => {
    window.ipcInvoke.onHandleWindowHide(() => {
      setRecording(false)
    })
  }, []);

  useEffect(() => {
    // 有鼠标穿透就, 没用...
    // switchBodyPointer(recording)
  }, [recording]);


  // console.log('re render app...')
  //   console.log(capArea)

  // 是否允许点击穿透
  useEffect(() => {
    const utilService: IUtilService = getServiceBySymbol<IUtilService>(IUtilService)

    if (recording){
      console.log(`>> recording ${allowPenetrate}`)
      if (allowPenetrate){
        utilService.setClickPenetrate(true).then()
      } else {
        utilService.setClickPenetrate(false).then()
      }
    } else {
      console.log(`>> no recording ${allowPenetrate}`)
      // 没有录制时就不允许变
      allowPenetrate || utilService.setClickPenetrate(false).then()
    }

  }, [allowPenetrate]);

  // 点击穿透初始化时候全局事件
  useEffect(() => {
    // document 检测鼠标抬起时, 一律不允许穿透
    // document.addEventListener('mouseup', () =>  setAllowPenetrate(false))
    //
    // return () => document.removeEventListener('mouseup', () =>  setAllowPenetrate(false))
  }, []);

  console.log('re run')

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
      }}>
        <Component {...pageProps} />
      </RecordContext.Provider>

  )
}

export default MyApp
