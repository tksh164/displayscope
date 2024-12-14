import { Button, Switch } from "@fluentui/react-components";
import { ArrowSyncRegular } from "@fluentui/react-icons";
import "./ScreenListHeader.css";

type ScreenListHeaderProps = {
  refreshScreenSpecs: () => Promise<void>;
};

export default function ScreenListHeader(props: ScreenListHeaderProps) {
  const updateScreenSpecs = props.refreshScreenSpecs;

  return (
    <div className="function-area">
      <h3>ScreenListHeader</h3>
      <Switch className="function-area-item" label="Always on top" labelPosition="before" onChange={() => window.exposedApi.setAlwaysOnTopSetting(true)} />
      <Button className="function-area-item" shape="circular" size="large" appearance="primary" icon={<ArrowSyncRegular />} onClick={updateScreenSpecs} />
    </div>
  );
}