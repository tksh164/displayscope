import path from "path";
import { exec } from "child_process";
import { IsRunInDevelopmentEnv } from "./utils";
import { SET_MOUSE_CURSOR_POS_EXECUTABLE_FILE_NAME } from "./constants";

export async function setMouseCursorPosition(posX: number, posY: number): Promise<void> {
  const commandPath = await getExternalCommandPath();
  const commandline = `"${commandPath}" ${posX} ${posY}`;

  // NOTE: Set the mouse cursor position two times as workaround, because in specific case the
  // mouse cursor is drift from the correct position.
  // The first time, the mouse courser moves into the screen that contains the specified coordinate,
  // but the coordinate is incorrect.
  // The second time, the mouse cursor moves to the correct coordinates in the screen. This behavior
  // is happen even if set the mouse cursor from the command-line tool (without Electron).
  // The presumed reproduce condition is the screen that contains the new mouse position is different
  // with the screen that contains the window that executed the mouse position setting Windows API.
  // Also, the high DPI settings are affected of each screen.
  exec(commandline, (error, stdout, stderr) => {
    console.log("setMouseCursorPosition1", { error: error, stdout: stdout, stderr: stderr });
  });
  exec(commandline, (error, stdout, stderr) => {
    console.log("setMouseCursorPosition2", { error: error, stdout: stdout, stderr: stderr });
  });
}

async function getExternalCommandPath(): Promise<string> {
    const externalCommandPath = IsRunInDevelopmentEnv() ?
      path.join(process.cwd(), "../setmousecursorpos", SET_MOUSE_CURSOR_POS_EXECUTABLE_FILE_NAME) :
      path.join(process.resourcesPath, SET_MOUSE_CURSOR_POS_EXECUTABLE_FILE_NAME);
    console.log("External command path:", externalCommandPath);
    return externalCommandPath;
}
