module.exports = {
  pluginOptions: {
    electronBuilder: {
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
        ]
      }
    }
  }
}
