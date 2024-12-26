import { session } from "electron";
import path from "path";
import os from "os";
import fs from "fs";

// Add React Developer Tools extension. Need reload to enable the extension.
export async function installReactDevTools() {
  const reactDevToolsPath = getReactDevToolsPath();
  if (fs.existsSync(reactDevToolsPath)) {
    const result = await session.defaultSession.loadExtension(reactDevToolsPath)
    console.log(`Added Extension: ${result.name}`);
  }
}

function getReactDevToolsPath() {
  return path.join(
    os.homedir(),
    'AppData/Local/Microsoft/Edge Beta/User Data/Profile 1/Extensions/fmkadmapgofadopljbjfkapdkoienihi/6.0.1_0'
  );
}
