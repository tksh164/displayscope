# Displayscope

Displayscope shows the external display screen within the window.

## Building from source

### Prerequisites

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
