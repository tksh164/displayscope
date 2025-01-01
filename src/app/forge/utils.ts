import path from 'path';
import fs  from 'fs';

export function copyResourceFiles(outputPath: string) {
  // Copy files into the resources directory.
  const copyFileIntoResourcesDir = (outputPath: string, sourceRelativePathFromOutputPath: string, fileName: string) => {
    const sourceFilePath = path.join(outputPath, sourceRelativePathFromOutputPath, fileName);
    const destinationFilePath = path.join(outputPath, 'resources', fileName);
    console.log('Copy', fileName);
    console.log('- Source file path:', sourceFilePath);
    console.log('- Destination file path:', destinationFilePath);
    fs.copyFileSync(sourceFilePath, destinationFilePath, fs.constants.COPYFILE_EXCL);
  }

  const filesToCopy = [
    {
      sourceRelativePath: '../../../setmousecursorpos',
      fileName: 'setmousecursorpos.exe',
    },
    {
      sourceRelativePath: '../../src/assets',
      fileName: 'default-settings.json',
    },
    {
      sourceRelativePath: '../../src/assets',
      fileName: 'appicon.png',
    },
  ];

  filesToCopy.forEach((file) => {
    copyFileIntoResourcesDir(outputPath, file.sourceRelativePath, file.fileName);
  });
}
