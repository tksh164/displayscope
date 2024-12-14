import { useNavigate } from "react-router";
import { Button } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import "./InteractiveScreenHeader.css";

export default function InteractiveScreenHeader() {
  const navigate = useNavigate();
  return (
    <div className="interactive-screen-header">
      <Button className="header-item" shape="circular" size="large" appearance="primary" icon={<ArrowLeftRegular />} onClick={() => navigate("/")} />
    </div>
  );
}
