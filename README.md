<br />

<h1 align="center">Displayscope 🔭</h1>
<p align="center">Displayscope enables to use apps on the out of sight screens.</p>

<br /><br />

[![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/tksh164/displayscope)

Displayscope enables to use apps on <strong>the out of sight screens</strong> such as the display emulators, display dummy plugs and behind screens.

## 🎯 Use cases

Displayscope has two use cases.

### 1. Dedicated display for screen sharing in remote meetings

The screen sharing in remote meetings is consume one display for just the screen sharing (e.g. slide show, demo using entire screen, etc). In that case, you can get an emulated display by *[the display emulators/display dummy plugs](https://www.amazon.com/s?k=Display+Emulator)*, but it's can't see and can't control.

Displayscope provides view and control through the window to the emulated display. You can save a physical display for other purpose by using the emulated display for the screen sharing.

### 2. Control the demo screen in onsite presentations

Some time there are no preview screen in onsite presentations.

Displayscope provides view and control through the window to the screen. You can demo naturally through Displayscope even if the screen is at behind you.

## 📥 Install

1. Download [the setup package](https://github.com/tksh164/displayscope/releases/latest). Currently suppoeted only Windows.
    - Select "Keep" if you get warning when the download is completed.
    - After the download, unblock the download setup package file from the file's property or using Unblock-File cmdlet.
2. Run the setup package to install.
3. You can find Displayscope in the Start menu.

If you don't need Displayscope anymore, you can uninstall it from **Apps & features** in the Settings or **Uninstall a program** in the Control Panel.

## 🔨 Build from source

### Build environment requirements

- Windows 10 x64
- [yarn](https://yarnpkg.com/)
- [Visual Studio](https://visualstudio.microsoft.com/)

### Build package

1. Building the C++ codes using Visual Studio's Developer PowerShell or Developer Command Prompt.

    ```
    cd src/setmousecursorpos
    nmake build
    ```

2. Building the Displayscope installer package.

    ```
    cd src/app
    yarn install
    yarn electron:build
    ```

## 📃 Notes　

- Displayscope prevents the screen from going to sleep during the external display showing. If you want to go to sleep on your PC, move back to the selection screen of the screen.
- Displayscope doesn't work correctly if you selected the *High-performance NVIDIA processor* as the **Preferred graphics processor** in the NVIDIA Control Panel. *Auto-select* and *Integrated graphics* are works well.
- The app settings file located at `%AppData%\Displayscope\settings.json`. You can global shortcut key through the file. See [here](https://www.electronjs.org/docs/api/accelerator#available-modifiers) for the acceptable shortcut key combination.

    ```json
    "MouseCursorReturnShortcutKey": "Shift + Esc"
    ```

## ⚖ License

Copyright (c) 2020-present Takeshi Katano. All rights reserved. This software is released under the [MIT License](https://github.com/tksh164/displayscope/blob/master/LICENSE).

Disclaimer: The codes stored herein are my own personal codes and do not related my employer's any way.
