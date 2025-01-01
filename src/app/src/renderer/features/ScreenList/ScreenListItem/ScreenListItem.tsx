import { useNavigate } from "react-router";
import { Text, Image } from "@fluentui/react-components";
import { ScreenSpec } from "../../../../main/types/screenSpec.d";
import "./ScreenListItem.css";

type ScreenListItemProps = {
  readonly screenSpec: ScreenSpec;
  readonly setCurrentScreenSpec: React.Dispatch<React.SetStateAction<ScreenSpec>>;
};

export default function ScreenListItem(props: ScreenListItemProps) {
  const navigate = useNavigate();
  const screenName = props.screenSpec.name;
  const displayLabel = props.screenSpec.displaySpec.label;
  const primaryText = props.screenSpec.displaySpec.isPrimary ? "Primary, " : "";
  const resolutionText = props.screenSpec.displaySpec.bounds.width + " x " + props.screenSpec.displaySpec.bounds.height;
  const scaleFactorText = props.screenSpec.displaySpec.scaleFactor * 100 + "%";

  return (
    <div className="screen-list-item" onClick={() => {
      // Update the current screen spec then navigate to the interactive screen view.
      props.setCurrentScreenSpec(props.screenSpec);
      navigate("/interactive-screen");
    }}>
      <Text className="screen-name" block={true} size={500} weight="semibold">{screenName}</Text>
      <Text className="screen-description" block={true} size={300}>{displayLabel}, {primaryText}{resolutionText}, {scaleFactorText}</Text>
      <div className="screen-thumbnail-wrapper">
        <Image className="screen-thumbnail" shape="square" src={props.screenSpec.thumbnailDataUri} />
      </div>
    </div>
  );
}
