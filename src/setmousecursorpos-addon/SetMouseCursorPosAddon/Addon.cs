using System;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using SetMouseCursorPosAddon.Interop;

namespace SetMouseCursorPosAddon
{
    public static unsafe class Addon
    {
        [UnmanagedCallersOnly(EntryPoint = "napi_register_module_v1", CallConvs = [typeof(CallConvCdecl)])]
        public static nint Init(nint env, nint exports)
        {
            NodeApi.Initialize();

            RegisterFunction(env, exports, "setMouseCursorPosition"u8, &SetMouseCursorPosition);

            return exports;
        }

        private static unsafe void RegisterFunction(nint env, nint exports, ReadOnlySpan<byte> name, delegate* unmanaged[Cdecl]<nint, nint, nint> callback)
        {
            NodeApi.CreateFunction(env, name, (nuint)name.Length, callback, 0, out nint func);
            NodeApi.SetNamedProperty(env, exports, name, func);
        }

        [UnmanagedCallersOnly(CallConvs = [typeof(CallConvCdecl)])]
        private static nint SetMouseCursorPosition(nint env, nint cbinfo)
        {
            try
            {
                const int requiredNumOfArgs = 2;
                nuint argc = requiredNumOfArgs;
                Span<nint> argv = stackalloc nint[requiredNumOfArgs];

                Status status = NodeApi.GetCallbackInfo(env, cbinfo, ref argc, argv, null, null);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to GetCallbackInfo(). Status: {status}");
                }

                if (argc < requiredNumOfArgs)
                {
                    NodeApiHelper.ThrowError(env, $"Expected {requiredNumOfArgs} arguments that x and y as integers.");
                    return nint.Zero;
                }

                status = NodeApi.GetValueInt32(env, argv[0], out int x);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to GetValueInt32() for x. Status: {status}");
                }

                status = NodeApi.GetValueInt32(env, argv[1], out int y);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to GetValueInt32() for y. Status: {status}");
                }

                NodeApiHelper.WriteConsoleLog(env, $"Setting mouse cursor position: x={x}, y={y}");
                User32.SetCursorPos(x, y);

                return nint.Zero;
            }
            catch (Exception ex)
            {
                NodeApiHelper.ThrowError(env, ex.Message);
                return nint.Zero;
            }
        }
    }
}
