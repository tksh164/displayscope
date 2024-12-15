import path from "path";
import { exec } from "child_process";

export async function setMouseCursorPosition(posX: number, posY: number): Promise<void> {
  const commandPath = getExternalCommandPath();
  const commandline = `"${commandPath}" ${posX} ${posY}`;

  // NOTE: Setting the mouse cursor position two times as workaround, because in specific case the
  // mouse cursor is drift from the correct position.
  // The first time, the mouse courser moves into the screen that contains the specified coordinate,
  // but the coordinate is incorrect. The second time, the mouse cursor moves to the correct
  // coordinates in the screen. This behavior is happen even if set the mouse cursor from the
  // simple command-line tool.
  // The presumed reproduce condition is the screen that contains the new mouse position is different
  // with the screen that contains the window that executed the mouse position setting Windows API.
  // Also, the high DPI settings are affected of each screen.
  exec(commandline, (error, stdout, stderr) => {
    //console.log("setMouseCursorPosition1", { error: error, stdout: stdout, stderr: stderr });
  });
  exec(commandline, (error, stdout, stderr) => {
    //console.log("setMouseCursorPosition2", { error: error, stdout: stdout, stderr: stderr });
  });
}

function getExternalCommandPath(): string {
    const EXECUTABLE_FILE_NAME = "setmousecursorpos.exe";
    const isDevelopment = process.env.NODE_ENV !== "production";
    return isDevelopment ?
      path.join(process.cwd(), "../setmousecursorpos", EXECUTABLE_FILE_NAME) :
      path.join(process.resourcesPath, EXECUTABLE_FILE_NAME);
}
