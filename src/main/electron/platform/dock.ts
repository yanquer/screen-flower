
import {Promisable} from 'type-fest';
import {AppManager} from "../manager/app-manager";

export const ensureDockIsShowing = async (action: () => Promisable<void>) => {
  const wasDockShowing = AppManager.dock.isVisible();
  if (!wasDockShowing) {
    await AppManager.dock.show();
  }

  await action();

  if (!wasDockShowing) {
    AppManager.dock.hide();
  }
};

export const ensureDockIsShowingSync = (action: () => void) => {
  const wasDockShowing = AppManager.dock.isVisible();
  if (!wasDockShowing) {
    AppManager.dock.show().then();
  }

  action();

  if (!wasDockShowing) {
    AppManager.dock.hide();
  }
};
