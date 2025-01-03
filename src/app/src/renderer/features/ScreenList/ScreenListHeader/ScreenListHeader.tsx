import { useState, useEffect } from "react";
import { Button, Switch } from "@fluentui/react-components";
import { ArrowSyncRegular, SettingsRegular, InfoRegular } from "@fluentui/react-icons";
import "./ScreenListHeader.css";

type ScreenListHeaderProps = {
  readonly refreshScreenSpecs: () => Promise<void>;
};

export default function ScreenListHeader(props: ScreenListHeaderProps) {
  const updateScreenSpecs = props.refreshScreenSpecs;
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState<boolean>(false);

  //
  // The always on top setting changed event listener for if it changed from the menu item.
  //

  const alwaysOnTopSettingChanged = (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => {
    setIsAlwaysOnTop(shouldAlwaysOnTop);
    //console.log(`Always on top setting change to ${shouldAlwaysOnTop} from the menu item.`);
  };
  const addEventListeners = () => {
    window.exposedApi.alwaysOnTopSetting.addChangedEventListener(alwaysOnTopSettingChanged);
    //console.log("Add AlwaysOnTopSettingChanged event listener.");
  };
  const removeEventListeners = () => {
    window.exposedApi.alwaysOnTopSetting.removeChangedEventListener(alwaysOnTopSettingChanged);
    //console.log("Remove AlwaysOnTopSettingChanged event listener.");
  };
  useEffect(() => {
    addEventListeners();
    return removeEventListeners;
  }, []);

  //
  // Event handler for the always on top setting switch.
  //

  const onClickAlwaysOnTopSetting = async (event: React.MouseEvent) => {
    const newAlwaysOnTopSetting = !(await window.exposedApi.alwaysOnTopSetting.get());
    window.exposedApi.alwaysOnTopSetting.set(newAlwaysOnTopSetting);
    setIsAlwaysOnTop(newAlwaysOnTopSetting);
    //console.log(`Always on top setting change to ${newAlwaysOnTopSetting} from UI.`);
  }

  return (
    <div className="screen-list-header">
      <Button className="refresh" shape="circular" size="large" appearance="primary" icon={<ArrowSyncRegular />} onClick={updateScreenSpecs} />
      <Switch className="always-on-top" label="Always on top" labelPosition="before" onClick={onClickAlwaysOnTopSetting} checked={isAlwaysOnTop} />
    </div>
  );
}

// <Button className="setting" shape="circular" size="large" appearance="primary" icon={<SettingsRegular />} onClick={updateScreenSpecs} />
// <Button className="info" shape="circular" size="large" appearance="primary" icon={<InfoRegular />} onClick={updateScreenSpecs} />
