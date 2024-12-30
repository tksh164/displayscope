import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftRegular } from "@fluentui/react-icons";
import "./InteractiveScreenHeader.css";

type InteractiveScreenHeaderProps = {
  id: string;
};

export default function InteractiveScreenHeader(props: InteractiveScreenHeaderProps) {
  const [mouseCursorReturnShortcutKey, setMouseCursorReturnShortcutKey] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    window.exposedApi.getMouseCursorReturnShortcutKey().then((shortcutKey) => {
      setMouseCursorReturnShortcutKey(shortcutKey);
    });
  }, []);

  const onClick = (event: React.MouseEvent) => {
    navigate("/");
  };

  return (
    <div id={props.id} className="interactive-screen-header hide-header">
      <Button className="grid-column1 header-item" shape="circular" size="large" appearance="primary" icon={<ArrowLeftRegular />} onClick={onClick} />
      <Text className="grid-column2 notification-message" block={true} size={400} weight="regular">Your mouse cursor is now on this window. Click anywhere on the screen you are seeing to enter the screen.<br/>
      Press <strong className="shortcut-key-stroke">{mouseCursorReturnShortcutKey}</strong> key combination to leave the screen and return your mouse cursor on this window.</Text>
    </div>
  );
}
