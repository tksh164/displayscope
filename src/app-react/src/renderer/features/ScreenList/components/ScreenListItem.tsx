import { Text, Image } from "@fluentui/react-components";
import { ScreenSpec } from "src/main/types/screenSpec";

export default function ScreenListItem(props: { screenSpec: ScreenSpec }) {
  return (
    <div>
      <div><Text>{props.screenSpec.name}</Text></div>
      <div><Text>{props.screenSpec.display.isPrimary ? "Primary, " : "" }{props.screenSpec.display.bounds.width} x {props.screenSpec.display.bounds.width}, {props.screenSpec.display.scaleFactor * 100}%</Text></div>
      <div><Image src={props.screenSpec.thumbnailDataUri}/></div>
    </div>
  );
}
