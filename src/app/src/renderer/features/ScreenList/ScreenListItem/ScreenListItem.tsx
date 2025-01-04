import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Text, Image } from "@fluentui/react-components";
import { ScreenSpec } from "../../../../main/types/screenSpec.d";
import { APP_SETTINGS_ITEM_NAME_PREFIX_SHORTCUT_KEY_NAVIGATE_TO_INTERACTIVE_SCREEN } from "../../../../main/constants";

import "./ScreenListItem.css";

type ScreenListItemProps = {
  readonly screenSpec: ScreenSpec;
  readonly setCurrentScreenSpec: React.Dispatch<React.SetStateAction<ScreenSpec>>;
};

export default function ScreenListItem(props: ScreenListItemProps) {
  const [directNavigationShortcutKey, setDirectNavigationShortcutKey] = useState<string>("");
  const navigate = useNavigate();
  const displayLabel = props.screenSpec.displaySpec.label;
  const isPrimary = props.screenSpec.displaySpec.isPrimary;
  const resolutionText = props.screenSpec.displaySpec.bounds.width + " x " + props.screenSpec.displaySpec.bounds.height;
  const scaleFactorText = props.screenSpec.displaySpec.scaleFactor * 100 + "%";

  // Shortcut key for direct navigation to the interactive screen.
  useEffect(() => {
    const settingItemName = APP_SETTINGS_ITEM_NAME_PREFIX_SHORTCUT_KEY_NAVIGATE_TO_INTERACTIVE_SCREEN + (props.screenSpec.sequenceNumber + 1).toString();
    window.exposedApi.appSettings.shortcutKey.get(settingItemName).then((shortcutKey) => {
      setDirectNavigationShortcutKey(shortcutKey);
    });
  }, []);

  return (
    <div className="screen-list-item" onClick={() => {
      // Update the current screen spec then navigate to the interactive screen view.
      props.setCurrentScreenSpec(props.screenSpec);
      navigate("/interactive-screen");
    }}>
      <div className="screen-label-wrapper">
        <Text className="label" block={true} size={800} weight="semibold">{displayLabel}</Text>
        <Text className="shortcut" block={true} size={200}>{directNavigationShortcutKey}</Text>
      </div>
      <div className="screen-details-wrapper">
        {
          isPrimary ? <Text className="detail" block={false} size={300}>Primary</Text> : null
        }
        <Text className="detail" block={true} size={300}>{resolutionText}</Text>
        <Text className="detail" block={true} size={300}>{scaleFactorText}</Text>
      </div>
      <div className="screen-thumbnail-wrapper">
        <Image className="screen-thumbnail" shape="square" src={props.screenSpec.thumbnailDataUri} />
      </div>
    </div>
  );
}
