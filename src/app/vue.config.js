module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: "Displayscope",
        extraFiles: [
          {
            from: "build/setmousecursorpos.exe",
            to: "./resources"
          },
          {
            from: "build/icon.png",
            to: "./resources"
          }
        ],
        "nsis": {
          artifactName: "${name}-setup-${version}.${ext}"
        }
      }
    }
  }
}
