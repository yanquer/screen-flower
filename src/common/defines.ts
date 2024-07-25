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


  onWindowHide = 'onService:onWindowHide',
  onWindowShow = 'onService:onWindowShow',

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
export const ProtocolViaLocal = 'protocolViaLocal://';

