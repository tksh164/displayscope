import { Button } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";

export default function InteractiveScreenHeader() {
  return (
    <div>
      <h3>InteractiveViewHeader</h3>
      <Button shape="circular" size="large" icon={<ArrowLeftRegular />} appearance="primary" />
    </div>
  );
}
