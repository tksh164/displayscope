import { Button, Switch } from "@fluentui/react-components";
import { ArrowSyncRegular } from "@fluentui/react-icons";

export default function DisplayListHeader() {
  return (
    <div>
      <h3>DisplayListHeader</h3>
      <Switch label="Always on top" onChange={() => window.exposedApi.setAlwaysOnTopSetting(true)}/>
      <Button shape="circular" size="large" icon={<ArrowSyncRegular />} appearance="primary" />
    </div>
  );
}
