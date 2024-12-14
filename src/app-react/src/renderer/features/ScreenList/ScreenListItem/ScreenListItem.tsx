import { useNavigate } from "react-router";
import { Text, Image } from "@fluentui/react-components";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./ScreenListItem.css";

type ScreenListItemProps = {
  screenSpec: ScreenSpec;
  setCurrentScreenId: React.Dispatch<React.SetStateAction<string>>;
}

export default function ScreenListItem(props: ScreenListItemProps) {
  const navigate = useNavigate();
  const screenName = props.screenSpec.name;
  const primaryText = props.screenSpec.display.isPrimary ? "Primary, " : "";
  const resolutionText = props.screenSpec.display.bounds.width + " x " + props.screenSpec.display.bounds.height;
  const scaleFactorText = props.screenSpec.display.scaleFactor * 100 + "%";

  return (
    <div className="screen-list-item" onClick={() => {
      // Update the current screen ID then navigate to the interactive screen view.
      props.setCurrentScreenId(props.screenSpec.id);
      navigate("/interactive-screen");
    }}>
      <Text block={true} size={500} weight="semibold" className="screen-name">{screenName}</Text>
      <Text block={true} size={300} className="screen-description">{primaryText}{resolutionText}, {scaleFactorText}</Text>
      <Image className="screen-thumbnail" shape="rounded" src={props.screenSpec.thumbnailDataUri} />
    </div>
  );
}
