all: help

help:
	@type <<
nmake build    Build the executable file.
nmake clean    Clean all intermediate files.
nmake help     Show help for this Makefile. (default target)

<<

OPTIMIZATION=/O2
CODE_GENERATION=/GS /GL /Gy /Gm-
PREPROCESSOR=/D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_UNICODE" /D "UNICODE"
LANGUAGE=/Zi /Zc:wchar_t /Zc:inline /Zc:forScope
LINKING=/MT
CODE_ANALYSIS=/analyze-
DIAGNOSTICS=/W3 /WX- /sdl /diagnostics:column
MISCELLANEOUS=/nologo

build:
	cl.exe $(OPTIMIZATION) $(CODE_GENERATION) $(PREPROCESSOR) $(LANGUAGE) $(LINKING) $(CODE_ANALYSIS) $(DIAGNOSTICS) $(MISCELLANEOUS) setmousecursorpos.cpp

clean:
	del *.exe
	del *.obj
	del *.ilk
	del *.pdb
	del *.res
