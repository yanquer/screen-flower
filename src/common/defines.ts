export enum PathStat {
  other,
  file,
  dir
}

export enum HandlerStr {
  serviceFileService = 'service:FileService',
  serviceRepoService = 'service:RepoService',
  testService = 'service:testService',

  openRightContextMenu = 'onService:openRightContextMenu',

  // 后端调前端
  onOpenRightContextMenu = 'onService:onOpenRightContextMenu'
}

export enum ContextMenuNames {
  IRightContextMenuManager = 'IRightContextMenuManager'
}
