# Displayscope

Displayscope shows the external display screen within the window.

## Install

1. Download [the setup package](https://github.com/tksh164/displayscope/releases/latest). Currently suppoeted only Windows.
    - Select "Keep" if you get warning when the download is completed.
    - After the download, unblock the download setup package file from the file's property or using Unblock-File cmdlet.
2. Run the setup package to install.
3. You can find Displayscope in the Start menu.

If you don't need Displayscope anymore, you can uninstall it from "Apps & features" in the Settings or "Uninstall a program" in the Control Panel.

## Notes

- Displayscope prevents the screen from going to sleep during the external display showing. If you want to go to sleep on your PC, move back to the selection screen of the screen.

## Building from source

### Build environment requirements

- Windows 10
- yarn
- Visual Studio

### Build package

1. Building the C++ codes using Visual Studio's Developer PowerShell or Developer Command Prompt.

    ```
    cd src/setmousecursorpos
    nmake build
    ```

2. Building the Displayscope installer package.

    ```
    cd src/setmousecursorpos
    yarn install
    yarn electron:build
    ```
