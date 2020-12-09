all: help

help:
	@type <<
nmake build    Build the executable file.
nmake clean    Clean all intermediate files.
nmake help     Show help for this Makefile. (default target)

<<

RC_SWITCH=/nologo
CL_OPTIMIZATION=/O2
CL_CODE_GENERATION=/GS /GL /Gy /Gm-
CL_PREPROCESSOR=/D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_UNICODE" /D "UNICODE"
CL_LANGUAGE=/Zi /Zc:wchar_t /Zc:inline /Zc:forScope
CL_LINKING=/MT
CL_CODE_ANALYSIS=/analyze-
CL_DIAGNOSTICS=/W3 /WX- /sdl /diagnostics:column
CL_MISCELLANEOUS=/nologo 
CL_SWITCH=$(CL_OPTIMIZATION) $(CL_CODE_GENERATION) $(CL_PREPROCESSOR) $(CL_LANGUAGE) $(CL_LINKING) $(CL_CODE_ANALYSIS) $(CL_DIAGNOSTICS) $(CL_MISCELLANEOUS)

build:
	rc.exe $(RC_SWITCH) resource.rc
	cl.exe $(CL_SWITCH) setmousecursorpos.cpp resource.res

clean:
	del *.exe
	del *.obj
	del *.ilk
	del *.pdb
	del *.res
