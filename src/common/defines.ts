export enum PathStat {
  other,
  file,
  dir
}

export enum HandlerStr {
  serviceFileService = 'service:FileService',
  serviceRecordService = 'service:RecordService',

  openRightContextMenu = 'onService:openRightContextMenu',

  // 后端调前端
  onOpenRightContextMenu = 'onService:onOpenRightContextMenu'
}

export enum ContextMenuNames {
  IRightContextMenuManager = 'IRightContextMenuManager'
}
