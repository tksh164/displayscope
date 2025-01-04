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

  const alwaysOnTopStateChanged = (event: Electron.IpcRendererEvent, newAlwaysOnTopState: boolean) => {
    setIsAlwaysOnTop(newAlwaysOnTopState);
    //console.log(`Always on top setting change to ${newAlwaysOnTopState} from the menu item.`);
  };
  const addEventListeners = () => {
    window.exposedApi.alwaysOnTopState.addChangedEventListener(alwaysOnTopStateChanged);
    //console.log("Add AlwaysOnTopStateChanged event listener.");
  };
  const removeEventListeners = () => {
    window.exposedApi.alwaysOnTopState.removeChangedEventListener(alwaysOnTopStateChanged);
    //console.log("Remove AlwaysOnTopStateChanged event listener.");
  };
  useEffect(() => {
    addEventListeners();
    return removeEventListeners;
  }, []);

  //
  // Event handler for the always on top setting switch.
  //

  const onClickAlwaysOnTop = async (event: React.MouseEvent) => {
    const newAlwaysOnTopState = !(await window.exposedApi.alwaysOnTopState.get());
    window.exposedApi.alwaysOnTopState.set(newAlwaysOnTopState);
    setIsAlwaysOnTop(newAlwaysOnTopState);
    //console.log(`Always on top setting change to ${newAlwaysOnTopState} from UI.`);
  }

  return (
    <div className="screen-list-header">
      <Button className="refresh" shape="circular" size="large" appearance="primary" icon={<ArrowSyncRegular />} onClick={updateScreenSpecs} />
      <Switch className="always-on-top" label="Always on top" labelPosition="before" onClick={onClickAlwaysOnTop} checked={isAlwaysOnTop} />
    </div>
  );
}

// <Button className="setting" shape="circular" size="large" appearance="primary" icon={<SettingsRegular />} onClick={updateScreenSpecs} />
// <Button className="info" shape="circular" size="large" appearance="primary" icon={<InfoRegular />} onClick={updateScreenSpecs} />
