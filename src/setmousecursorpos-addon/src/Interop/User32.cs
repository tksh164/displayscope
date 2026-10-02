using System.Runtime.InteropServices;

namespace SetMouseCursorPosAddon.Interop
{
    internal static partial class User32
    {
        [LibraryImport("user32.dll", EntryPoint = "SetCursorPos", SetLastError = false)]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static partial bool SetCursorPos(int x, int y);
    }
}
