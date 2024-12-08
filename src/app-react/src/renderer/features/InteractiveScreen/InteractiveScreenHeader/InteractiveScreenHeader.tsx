import { useNavigate } from "react-router";
import { Button } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";

export default function InteractiveScreenHeader() {
  const navigate = useNavigate();
  return (
    <div>
      <h3>InteractiveViewHeader</h3>
      <Button shape="circular" size="large" appearance="primary" icon={<ArrowLeftRegular />} onClick={() => navigate("/")} />
    </div>
  );
}
