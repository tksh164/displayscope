module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: false,
      preload: "src/preload.ts",
      builderOptions: {
        productName: "Displayscope",
        extraFiles: [
          {
            from: "../../LICENSE",
            to: "./LICENSE.txt"
          },
          {
            from: "../../ThirdPartyNotices.txt",
            to: "."
          },
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
