import { useState, useEffect } from "react";
import { Button, Switch } from "@fluentui/react-components";
import { ArrowSyncRegular } from "@fluentui/react-icons";
import "./ScreenListHeader.css";

type ScreenListHeaderProps = {
  refreshScreenSpecs: () => Promise<void>;
};

export default function ScreenListHeader(props: ScreenListHeaderProps) {
  const updateScreenSpecs = props.refreshScreenSpecs;
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState<boolean>(false);

  //
  // The always on top setting changed event listener for if it changed from the menu item.
  //

  const alwaysOnTopSettingChangedEventListener = (event: Electron.IpcRendererEvent, shouldAlwaysOnTop: boolean) => {
    setIsAlwaysOnTop(shouldAlwaysOnTop);
    //console.log(`Always on top setting change to ${shouldAlwaysOnTop} from the menu item.`);
  };
  const addEventListeners = () => {
    window.exposedApi.addAlwaysOnTopSettingChangedEventListener(alwaysOnTopSettingChangedEventListener);
    //console.log("Add AlwaysOnTopSettingChanged event listener.");
  };
  const removeEventListeners = () => {
    window.exposedApi.removeAlwaysOnTopSettingChangedEventListener(alwaysOnTopSettingChangedEventListener);
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
    const newAlwaysOnTopSetting = !(await window.exposedApi.getCurrentAlwaysOnTopSetting());
    window.exposedApi.setAlwaysOnTopSetting(newAlwaysOnTopSetting);
    setIsAlwaysOnTop(newAlwaysOnTopSetting);
    //console.log(`Always on top setting change to ${newAlwaysOnTopSetting} from UI.`);
  }

  return (
    <div className="screen-list-header">
      <h3>ScreenListHeader</h3>
      <Switch className="header-item" label="Always on top" labelPosition="before" onClick={onClickAlwaysOnTopSetting} checked={isAlwaysOnTop} />
      <Button className="header-item" shape="circular" size="large" appearance="primary" icon={<ArrowSyncRegular />} onClick={updateScreenSpecs} />
    </div>
  );
}
