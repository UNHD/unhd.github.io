"""Compile/link generated material shaders in a hidden Windows OpenGL context."""
import ctypes as c
from ctypes import wintypes as w
import json
from pathlib import Path
import sys

user = c.WinDLL("user32", use_last_error=True)
gdi = c.WinDLL("gdi32", use_last_error=True)
gl = c.WinDLL("opengl32", use_last_error=True)
kernel = c.WinDLL("kernel32", use_last_error=True)
LRESULT = c.c_ssize_t
WNDPROC = c.WINFUNCTYPE(LRESULT, w.HWND, w.UINT, w.WPARAM, w.LPARAM)
user.DefWindowProcW.argtypes = [w.HWND, w.UINT, w.WPARAM, w.LPARAM]
user.DefWindowProcW.restype = LRESULT
callback = WNDPROC(user.DefWindowProcW)

class WNDCLASS(c.Structure):
    _fields_ = [("style", w.UINT), ("procedure", WNDPROC), ("class_extra", c.c_int),
                ("window_extra", c.c_int), ("instance", w.HINSTANCE), ("icon", w.HANDLE),
                ("cursor", w.HANDLE), ("background", w.HANDLE), ("menu", w.LPCWSTR), ("name", w.LPCWSTR)]

class PFD(c.Structure):
    _fields_ = [("size", w.WORD), ("version", w.WORD), ("flags", w.DWORD)] + [
        (name, c.c_ubyte) for name in ["type", "color", "red", "red_shift", "green", "green_shift",
        "blue", "blue_shift", "alpha", "alpha_shift", "accum", "accum_red", "accum_green",
        "accum_blue", "accum_alpha", "depth", "stencil", "aux", "layer", "reserved"]] + [
        (name, w.DWORD) for name in ["layer_mask", "visible_mask", "damage_mask"]]

kernel.GetModuleHandleW.argtypes = [w.LPCWSTR]
kernel.GetModuleHandleW.restype = w.HMODULE
user.RegisterClassW.argtypes = [c.POINTER(WNDCLASS)]
user.RegisterClassW.restype = w.ATOM
user.CreateWindowExW.argtypes = [w.DWORD, w.LPCWSTR, w.LPCWSTR, w.DWORD,
    c.c_int, c.c_int, c.c_int, c.c_int, w.HWND, w.HANDLE, w.HINSTANCE, c.c_void_p]
user.CreateWindowExW.restype = w.HWND
user.GetDC.argtypes = [w.HWND]
user.GetDC.restype = w.HDC
user.ReleaseDC.argtypes = [w.HWND, w.HDC]
user.DestroyWindow.argtypes = [w.HWND]
user.UnregisterClassW.argtypes = [w.LPCWSTR, w.HINSTANCE]
gdi.ChoosePixelFormat.argtypes = [w.HDC, c.POINTER(PFD)]
gdi.SetPixelFormat.argtypes = [w.HDC, c.c_int, c.POINTER(PFD)]
gl.wglCreateContext.argtypes = [w.HDC]
gl.wglCreateContext.restype = c.c_void_p
gl.wglMakeCurrent.argtypes = [w.HDC, c.c_void_p]
gl.wglDeleteContext.argtypes = [c.c_void_p]
gl.wglGetProcAddress.argtypes = [c.c_char_p]
gl.wglGetProcAddress.restype = c.c_void_p
gl.glGetString.argtypes = [w.UINT]
gl.glGetString.restype = c.c_char_p

def bind(name, result, *args):
    address = gl.wglGetProcAddress(name.encode())
    if not address or address in (1, 2, 3, c.c_void_p(-1).value):
        raise RuntimeError("GPU entry point unavailable: " + name)
    return c.WINFUNCTYPE(result, *args)(address)

instance = kernel.GetModuleHandleW(None)
window_class = WNDCLASS(0x0020, callback, 0, 0, instance, None, None, None, None, "LycorisShaderValidation")
if not user.RegisterClassW(c.byref(window_class)):
    raise c.WinError(c.get_last_error())
window = user.CreateWindowExW(0, window_class.name, "Lycoris shader validation", 0,
    0, 0, 1, 1, None, None, instance, None)  # No WS_VISIBLE / ShowWindow.
if not window:
    raise c.WinError(c.get_last_error())
dc = user.GetDC(window)
context = None
try:
    pixel = PFD()
    pixel.size, pixel.version, pixel.flags = c.sizeof(PFD), 1, 0x25
    pixel.color, pixel.alpha, pixel.depth = 24, 8, 24
    chosen = gdi.ChoosePixelFormat(dc, c.byref(pixel))
    if not chosen or not gdi.SetPixelFormat(dc, chosen, c.byref(pixel)):
        raise c.WinError(c.get_last_error())
    context = gl.wglCreateContext(dc)
    if not context or not gl.wglMakeCurrent(dc, context):
        raise c.WinError(c.get_last_error())
    create = bind("glCreateShader", w.UINT, w.UINT)
    source = bind("glShaderSource", None, w.UINT, c.c_int, c.POINTER(c.c_char_p), c.POINTER(c.c_int))
    compile_shader = bind("glCompileShader", None, w.UINT)
    shader_info = bind("glGetShaderiv", None, w.UINT, w.UINT, c.POINTER(c.c_int))
    shader_log = bind("glGetShaderInfoLog", None, w.UINT, c.c_int, c.POINTER(c.c_int), c.c_char_p)
    delete_shader = bind("glDeleteShader", None, w.UINT)
    create_program = bind("glCreateProgram", w.UINT)
    attach = bind("glAttachShader", None, w.UINT, w.UINT)
    link = bind("glLinkProgram", None, w.UINT)
    program_info = bind("glGetProgramiv", None, w.UINT, w.UINT, c.POINTER(c.c_int))
    program_log = bind("glGetProgramInfoLog", None, w.UINT, c.c_int, c.POINTER(c.c_int), c.c_char_p)
    delete_program = bind("glDeleteProgram", None, w.UINT)
    directory = Path(sys.argv[1]).resolve()
    report = {"renderer": gl.glGetString(0x1F01).decode(), "version": gl.glGetString(0x1F02).decode(), "programs": []}
    for vertex in sorted(directory.glob("*.vert")):
        shaders = []
        program = create_program()
        try:
            for path, kind in [(vertex, 0x8B31), (vertex.with_suffix(".frag"), 0x8B30)]:
                shader = create(kind)
                shaders.append(shader)
                text = c.c_char_p(path.read_bytes())
                source(shader, 1, c.byref(text), None)
                compile_shader(shader)
                status = c.c_int()
                shader_info(shader, 0x8B81, c.byref(status))
                if not status.value:
                    log = c.create_string_buffer(65536)
                    shader_log(shader, len(log), None, log)
                    raise RuntimeError(path.name + ": " + log.value.decode())
                attach(program, shader)
            link(program)
            status = c.c_int()
            program_info(program, 0x8B82, c.byref(status))
            if not status.value:
                log = c.create_string_buffer(65536)
                program_log(program, len(log), None, log)
                raise RuntimeError(vertex.stem + ": " + log.value.decode())
            report["programs"].append({"name": vertex.stem, "compiled": True, "linked": True})
        finally:
            delete_program(program)
            for shader in shaders:
                delete_shader(shader)
    (directory / "gpu-report.json").write_text(json.dumps(report, indent=2), encoding="utf8")
    print(json.dumps(report, indent=2))
finally:
    gl.wglMakeCurrent(None, None)
    if context:
        gl.wglDeleteContext(context)
    user.ReleaseDC(window, dc)
    user.DestroyWindow(window)
    user.UnregisterClassW(window_class.name, instance)
