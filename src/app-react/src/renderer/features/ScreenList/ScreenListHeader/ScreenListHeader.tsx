import { Button, Switch } from "@fluentui/react-components";
import { ArrowSyncRegular } from "@fluentui/react-icons";
import "./ScreenListHeader.css";

export default function ScreenListHeader() {
  return (
    <div className="function-area">
      <h3>ScreenListHeader</h3>
      <Switch className="function-area-item" label="Always on top" labelPosition="before" onChange={() => window.exposedApi.setAlwaysOnTopSetting(true)} />
      <Button className="function-area-item" shape="circular" size="large" appearance="primary" icon={<ArrowSyncRegular />} />
    </div>
  );
}
