import { Button, Switch } from "@fluentui/react-components";
import { ArrowSyncRegular } from "@fluentui/react-icons";
import "./ScreenListHeader.css";

type ScreenListHeaderProps = {
  refreshScreenSpecs: () => Promise<void>;
};

export default function ScreenListHeader(props: ScreenListHeaderProps) {
  const updateScreenSpecs = props.refreshScreenSpecs;

  return (
    <div className="screen-list-header">
      <h3>ScreenListHeader</h3>
      <Switch className="header-item" label="Always on top" labelPosition="before" onChange={() => window.exposedApi.setAlwaysOnTopSetting(true)} />
      <Button className="header-item" shape="circular" size="large" appearance="primary" icon={<ArrowSyncRegular />} onClick={updateScreenSpecs} />
    </div>
  );
}
