import {app} from 'electron';
import {Promisable} from 'type-fest';

export const ensureDockIsShowing = async (action: () => Promisable<void>) => {
  const wasDockShowing = app.dock.isVisible();
  if (!wasDockShowing) {
    await app.dock.show();
  }

  await action();

  if (!wasDockShowing) {
    app.dock.hide();
  }
};

export const ensureDockIsShowingSync = (action: () => void) => {
  const wasDockShowing = app.dock.isVisible();
  if (!wasDockShowing) {
    app.dock.show().then();
  }

  action();

  if (!wasDockShowing) {
    app.dock.hide();
  }
};
