#pragma comment(lib, "user32.lib")

#ifndef _UNICODE
#define _UNICODE
#endif
#ifndef UNICODE
#define UNICODE
#endif

#include <windows.h>
#include <wchar.h>

int wmain(int argc, wchar_t *argv[])
{
    if (argc < 3)
    {
        return -1;
    }

    int posX = _wtoi(argv[1]);
    int posY = _wtoi(argv[2]);
    wprintf(L"Set mouse cursor position to x:%d,y:%d\n", posX, posY);
    SetCursorPos(posX, posY);

    return 0;
}
