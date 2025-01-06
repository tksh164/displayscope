<br />

<p align="center"><img src="./media/displayscope.png" width="10%" alt="Displayscope app icon."></p>

<h1 align="center">Displayscope</h1>
<p align="center">Displayscope enables to use apps on out of sight screens.</p>

<br /><br />

## 🗨 About

Displayscope enables to use apps on <strong>out of sight screens</strong> such as display emulators, display dummy plugs and behind screens.

![Displayscope demo animation](https://raw.githubusercontent.com/tksh164/whatnot/main/displayscope/media/displayscope-demo.gif)

## 🎯 Use cases

Displayscope has two use cases.

### 1. Dedicated display for screen sharing in remote meetings

The screen sharing in remote meetings is consume one display for just the screen sharing (e.g. slide show, demo using entire screen, etc). In that case, you can get an emulated display by *[the display emulators/display dummy plugs](https://www.amazon.com/s?k=Display+Emulator)*, but it's can't see and can't control.

Displayscope provides view and control through the window to the emulated display. You can save a physical display for other purpose by using the emulated display for the screen sharing.

### 2. Control the demo screen in onsite presentations

Some time there are no preview screen in onsite presentations.

Displayscope provides view and control through the window to the screen. You can demo naturally through Displayscope even if the screen is at behind you.

## 📥 Install

### Install from GitHub (Recommended)

1. Download [the setup package](https://github.com/tksh164/displayscope/releases/latest). Currently supported only Windows.
    - Select "Keep" if you get warning when the download is completed.
    - After the download, unblock the download setup package file from the file's property or using Unblock-File cmdlet.
2. Run the setup package to install.
3. You can find Displayscope in the Start menu.

If you don't need Displayscope anymore, you can uninstall it from **Apps & features** in the Settings or **Uninstall a program** in the Control Panel.

<!--
### Install from Microsoft Store

You can install [Displayscope](https://apps.microsoft.com/store/detail/displayscope/XP9LZC3BDC1CG2) from Microsoft Store.
-->

## 🔨 Build from source

### Build environment requirements

- Windows 11 x64 or Windows 10 x64
- [Node.js](https://nodejs.org/)
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
    npm install
    npm run make
    ```

## 📃 Notes　

- Displayscope prevents the screen from going to sleep during the external display showing. If you want to go to sleep on your PC, move back to the screen list view.
- Displayscope doesn't work correctly if you selected the *High-performance NVIDIA processor* as the **Preferred graphics processor** in the NVIDIA Control Panel. *Auto-select* and *Integrated graphics* are works well.
- The Displayscope's settings file located at `%AppData%\Displayscope\settings.json`. You can change the global shortcut keys through this file. See [here](https://www.electronjs.org/docs/api/accelerator#available-modifiers) for the acceptable shortcut key combination.

    ```json
    "shortcutKeys": {
        "returnMouseCursorToAppWindow": "Shift + Esc",
        "navigateToScreenList": "Ctrl + Alt + Home",  // Not works with v0.24.0. It will support in the future release.
        "navigateToInteractiveScreen1": "Ctrl + Alt + F1",
        "navigateToInteractiveScreen2": "Ctrl + Alt + F2",
        "navigateToInteractiveScreen3": "Ctrl + Alt + F3",
        "navigateToInteractiveScreen4": "Ctrl + Alt + F4",
        "navigateToInteractiveScreen5": "Ctrl + Alt + F5",
        "navigateToInteractiveScreen6": "Ctrl + Alt + F6",
        "navigateToInteractiveScreen7": "Ctrl + Alt + F7",
        "navigateToInteractiveScreen8": "Ctrl + Alt + F8",
        "navigateToInteractiveScreen9": "Ctrl + Alt + F9"
    }
    ```

## ⚖ License

Copyright (c) 2020-present Takeshi Katano. All rights reserved. This software is released under the [MIT License](https://github.com/tksh164/displayscope/blob/master/LICENSE).

Disclaimer: The codes stored herein are my own personal codes and do not related my employer's any way.
