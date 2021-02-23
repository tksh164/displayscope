import * as path from "path";
import { exec } from "child_process";

export async function setMouseCursorPosition(posX: number, posY: number): Promise<void> {
  const commandPath = getExternalCommandPath();
  const cmdline = `"${commandPath}" ${posX} ${posY}`;
  exec(cmdline, (error, stdout, stderr) => {
    // console.log(stdout);
    // console.log(stderr);
    // console.log(error);
  });
}

function getExternalCommandPath(): string {
    const EXECUTABLE_FILE_NAME = "setmousecursorpos.exe";
    const isDevelopment = process.env.NODE_ENV !== "production";
    return isDevelopment ?
      path.join(process.cwd(), "build", EXECUTABLE_FILE_NAME) :
      path.join(process.resourcesPath, EXECUTABLE_FILE_NAME);
}
