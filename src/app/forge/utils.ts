import path from "path";
import fs  from "fs";
import { SETMOUSECURSORPOS_EXECUTABLE_FILE_NAME, APP_DEFAULT_SETTING_FILE_NAME, APP_ICON_PNG_FILE_NAME } from "../src/main/constants";

export function copyResourceFiles(outputPath: string) {
  // Copy files into the resources directory.
  const copyFileIntoResourcesDir = (outputPath: string, sourceRelativePathFromOutputPath: string, fileName: string) => {
    const sourceFilePath = path.join(outputPath, sourceRelativePathFromOutputPath, fileName);
    const destinationFilePath = path.join(outputPath, "resources", fileName);
    console.log("Copy", fileName);
    console.log("- Source file path:", sourceFilePath);
    console.log("- Destination file path:", destinationFilePath);
    fs.copyFileSync(sourceFilePath, destinationFilePath, fs.constants.COPYFILE_EXCL);
  }

  const filesToCopy = [
    {
      sourceRelativePath: "../../../setmousecursorpos",
      fileName: SETMOUSECURSORPOS_EXECUTABLE_FILE_NAME,
    },
    {
      sourceRelativePath: "../../src/assets",
      fileName: APP_DEFAULT_SETTING_FILE_NAME,
    },
    {
      sourceRelativePath: "../../src/assets",
      fileName: APP_ICON_PNG_FILE_NAME,
    },
  ];

  filesToCopy.forEach((file) => {
    copyFileIntoResourcesDir(outputPath, file.sourceRelativePath, file.fileName);
  });
}
