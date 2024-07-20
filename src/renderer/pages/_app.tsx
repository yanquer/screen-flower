import React, {useState} from 'react'
import type { AppProps } from 'next/app'

import '@radix-ui/themes/styles.css';
import '../styles/globals.css'
import '../styles/drag-box.scss'
import {BarVideoMode, CursorMode, MovieQuality, RecordContext} from "../common/global-context";
import {useRouter} from "next/router";


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

    const router = useRouter()
    const toPage = (pageUrl: string) => {
      router.push({ pathname: `${pageUrl}` }).then()
    }

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
      }}>
        <Component {...pageProps} />
      </RecordContext.Provider>

  )
}

export default MyApp
