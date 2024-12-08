import { Text, Image } from "@fluentui/react-components";
import { ScreenSpec } from "src/main/types/screenSpec";
import "./ScreenListItem.css";

export default function ScreenListItem(props: { screenSpec: ScreenSpec }) {
  return (
    <div className="screen-list-item">
      <Text block={true} size={500} weight="semibold" className="screen-name">{props.screenSpec.name}</Text>
      <Text block={true} size={300} className="screen-description">{props.screenSpec.display.isPrimary ? "Primary, " : "" }{props.screenSpec.display.bounds.width} x {props.screenSpec.display.bounds.width}, {props.screenSpec.display.scaleFactor * 100}%</Text>
      <Image className="screen-thumbnail" shape="rounded" src={props.screenSpec.thumbnailDataUri} />
    </div>
  );
}
