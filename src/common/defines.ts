export enum PathStat {
  other,
  file,
  dir
}

export enum HandlerStr {
  serviceFileService = 'service:FileService',
  serviceRecordService = 'service:RecordService',
  utilService = 'service:utilService',
  settingService = 'service:settingService',


  onWindowClose = 'onService:onWindowClose',
  onWindowHide = 'onService:onWindowHide',
  onWindowShow = 'onService:onWindowShow',

  onMouseMoveWhenRecording = 'onService:onMouseMoveWhenRecording',

  openRightContextMenu = 'onService:openRightContextMenu',

  // 后端调前端
  onOpenRightContextMenu = 'onService:onOpenRightContextMenu',

}

export enum ContextMenuNames {
  IRightContextMenuManager = 'IRightContextMenuManager'
}

export enum WindowNames {
  CaptureWin = 'capture-window',
  UniversalWin = 'universal-window',
  SettingWin = 'setting-window',
  PlayerWin = 'player-window',
}

// 为了 electron 加载本地文件用
//    为了安全性不使用
//     webPreferences: {
//      webSecurity: false
//     }
// 另外实际字符串不能太长还是驼峰, 不然不识别...
export const ProtocolViaLocal = 'local';
export const getPathWithProtocol = (path: string) => `${ProtocolViaLocal}://${path}`;


export enum ContextKey{
  // boolean
  Recording = 'recording',
  // boolean
  AskWhenStopInCapture = 'askWhenStopRecording',
  AskWhenSaveInPreview = 'askWhenPreviewRecording',
}

