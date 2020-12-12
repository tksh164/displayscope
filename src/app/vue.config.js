module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraFiles: [
          {
            from: "build/setmousecursorpos.exe",
            to: "./resources"
          },
          {
            from: "build/icon.png",
            to: "./resources"
          }
        ]
      }
    }
  }
}
