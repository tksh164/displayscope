import * as path from "path";
import { exec } from "child_process";

function getExternalCommandPath(): string {
    const setMouseCursorPosExeFileName = "setmousecursorpos.exe";
    return process.env.NODE_ENV !== "production" ?
      path.join(process.cwd(), "build", setMouseCursorPosExeFileName) :
      path.join(process.resourcesPath, setMouseCursorPosExeFileName);
}

export async function setMouseCursorPosition(posX: number, posY: number): Promise<void> {
    const commandPath = getExternalCommandPath();
    const cmdline = `"${commandPath}" ${posX} ${posY}`;
    exec(cmdline, (error, stdout, stderr) => {
      // console.log(stdout);
      // console.log(stderr);
      // console.log(error);
    });
}
