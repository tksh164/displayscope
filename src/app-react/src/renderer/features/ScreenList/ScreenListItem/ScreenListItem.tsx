import { Text, Image } from "@fluentui/react-components";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./ScreenListItem.css";

export default function ScreenListItem(props: { screenSpec: ScreenSpec }) {
  const primaryText = props.screenSpec.display.isPrimary ? "Primary, " : "";
  const resolutionText = props.screenSpec.display.bounds.width + " x " + props.screenSpec.display.bounds.height;
  const scaleFactorText = props.screenSpec.display.scaleFactor * 100 + "%";

  return (
    <div className="screen-list-item">
      <Text block={true} size={500} weight="semibold" className="screen-name">{props.screenSpec.name}</Text>
      <Text block={true} size={300} className="screen-description">{primaryText}{resolutionText}, {scaleFactorText}</Text>
      <Image className="screen-thumbnail" shape="rounded" src={props.screenSpec.thumbnailDataUri} />
    </div>
  );
}
