using System;
using System.Text;
using System.Buffers;
using System.Reflection;
using System.Runtime.InteropServices;

namespace SetMouseCursorPosAddon.Interop
{
    internal enum Status
    {
        Ok,
        InvalidArg,
        ObjectExpected,
        StringExpected,
        NameExpected,
        FunctionExpected,
        NumberExpected,
        BooleanExpected,
        ArrayExpected,
        GenericFailure,
        PendingException,
        Cancelled,
        EscapeCalledTwice,
        HandleScopeMismatch,
        CallbackScopeMismatch,
        QueueFull,
        Closing,
        BigintExpected,
        DateExpected,
        ArraybufferExpected,
        DetachableArraybufferExpected,
        WouldDeadlock,  // unused
        NoExternalBuffersAllowed,
        CannotRunJs,
    }

    internal static partial class NodeApi
    {
        public static void Initialize()
        {
            NativeLibrary.SetDllImportResolver(Assembly.GetExecutingAssembly(), ResolveDllImport);

            static nint ResolveDllImport(string libraryName, Assembly assembly, DllImportSearchPath? searchPath)
            {
                if (libraryName is not "node")
                {
                    return IntPtr.Zero;
                }
                return NativeLibrary.GetMainProgramHandle();
            }
        }

        [LibraryImport("node", EntryPoint = "napi_throw_error")]
        public static partial Status ThrowError(nint env, ReadOnlySpan<byte> code, ReadOnlySpan<byte> msg);

        [LibraryImport("node", EntryPoint = "napi_create_function")]
        public static unsafe partial Status CreateFunction(nint env, ReadOnlySpan<byte> utf8name, nuint length, delegate* unmanaged[Cdecl]<nint, nint, nint> cb, nint data, out nint result);

        [LibraryImport("node", EntryPoint = "napi_set_named_property")]
        public static partial Status SetNamedProperty(nint env, nint obj, ReadOnlySpan<byte> utf8name, nint value);

        [LibraryImport("node", EntryPoint = "napi_get_cb_info")]
        public static unsafe partial Status GetCallbackInfo(nint env, nint cbinfo, ref nuint argc, Span<nint> argv, nint* thisArg, nint* data);

        [LibraryImport("node", EntryPoint = "napi_get_global")]
        public static partial Status GetGlobal(nint env, out nint result);

        [LibraryImport("node", EntryPoint = "napi_get_named_property")]
        public static partial Status GetNamedProperty(nint env, nint obj, ReadOnlySpan<byte> utf8name, out nint result);

        [LibraryImport("node", EntryPoint = "napi_call_function")]
        public static partial Status CallFunction(nint env, nint recv, nint func, nuint argc, ReadOnlySpan<nint> argv, out nint result);

        [LibraryImport("node", EntryPoint = "napi_create_string_utf8")]
        public static partial Status CreateStringUtf8(nint env, ReadOnlySpan<byte> str, nuint length, out nint result);

        [LibraryImport("node", EntryPoint = "napi_get_value_int32")]
        public static partial Status GetValueInt32(nint env, nint value, out int result);
    }

    internal static class NodeApiHelper
    {
        public static void ThrowError(nint env, string message)
        {
            int messageLength = Encoding.UTF8.GetByteCount(message);
            int bufferLength = messageLength + 1;  // +1 for a null character.
            byte[]? rented = null;
            Span<byte> buffer = bufferLength < 512
                ? stackalloc byte[bufferLength]
                : (rented = ArrayPool<byte>.Shared.Rent(bufferLength));

            try
            {
                Encoding.UTF8.GetBytes(message, buffer);
                buffer[bufferLength - 1] = 0;  // napi_throw_error requires a null-terminated string. Ensure that the string is a null-terminated.
                NodeApi.ThrowError(env, null, buffer);
            }
            finally
            {
                if (rented is not null)
                {
                    ArrayPool<byte>.Shared.Return(rented);
                }
            }
        }

        public static nint CreateString(nint env, string value)
        {
            int bufferLength = Encoding.UTF8.GetByteCount(value);
            byte[]? rented = null;
            Span<byte> buffer = bufferLength <= 512
                ? stackalloc byte[bufferLength]
                : (rented = ArrayPool<byte>.Shared.Rent(bufferLength));

            try
            {
                Encoding.UTF8.GetBytes(value, buffer);
                Status status = NodeApi.CreateStringUtf8(env, buffer, (nuint)bufferLength, out nint result);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to CreateStringUtf8(). Status: {status}");
                }
                return result;
            }
            catch (Exception ex)
            {
                ThrowError(env, $"Failed to create JavaScript string. Exception: {ex.Message}");
                return nint.Zero;
            }
            finally
            {
                if (rented is not null)
                {
                    ArrayPool<byte>.Shared.Return(rented);
                }
            }
        }

        public static void WriteConsoleLog(nint env, string message)
        {
            try
            {
                Status status = NodeApi.GetGlobal(env, out nint jsGlobalObj);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to GetGlobal(). Status: {status}");
                }

                status = NodeApi.GetNamedProperty(env, jsGlobalObj, "console"u8, out nint jsConsoleObj);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to GetNamedProperty() for console. Status: {status}");
                }

                status = NodeApi.GetNamedProperty(env, jsConsoleObj, "log"u8, out nint jsLogFunc);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to GetNamedProperty() for log. Status: {status}");
                }

                nint jsMessageString = CreateString(env, message);
                ReadOnlySpan<nint> argv = new([jsMessageString]);
                status = NodeApi.CallFunction(env, jsConsoleObj, jsLogFunc, (nuint)argv.Length, argv, out _);
                if (status != Status.Ok)
                {
                    throw new Exception($"Failed to CallFunction(). Status: {status}");
                }
            }
            catch (Exception ex)
            {
                ThrowError(env, $"Failed to write console log. Exception: {ex.Message}");
            }
        }
    }
}
