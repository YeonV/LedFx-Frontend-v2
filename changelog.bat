@echo off
setlocal enabledelayedexpansion

:: Define the starting commit and the output file
set "START_COMMIT=cd09d60531dab1ea6749c2db4a3aab86420aedcf"
set "OUTPUT_FILE=C:\temp\messages.txt"
set "TEMP_SEEN_FILE=%TEMP%\seen_subjects.tmp"

:: Clean up the temporary file for de-duplication
if exist "%TEMP_SEEN_FILE%" del "%TEMP_SEEN_FILE%"

:: 1. Get log data, using ||| as a separator.
:: 2. Pipe to FINDSTR to filter out lines (like grep -v).
:: 3. Process the result in a FOR loop.
FOR /F "tokens=1,2,3 delims=|" %%a IN (
    'git log --pretty=format:"%%s|||%%an|||%%h" %START_COMMIT%..@ ^| findstr /V /I /C:"cleanup" /C:"Update"'
) DO (
    set "subject=%%a"
    set "author=%%b"
    set "hash=%%c"

    :: 3. De-duplication (like awk !seen[msg]++)
    :: This is slow and fragile in CMD. We write seen subjects to a temp file.
    set "is_seen="
    findstr /X /C:"!subject!" "%TEMP_SEEN_FILE%" > nul && (
        set "is_seen=true"
    )
    
    if not defined is_seen (
        :: Add the subject to our list of seen subjects
        (echo !subject!)>>"%TEMP_SEEN_FILE%"

        :: 4. Length Check (like awk length >= 5)
        :: This is very difficult in CMD, so this part is omitted for reliability.
        :: A simple check could be added, but it would fail on many characters.

        :: 5. Replace spaces in author name (like sed)
        set "formatted_author=!author: =_!"
        
        :: 6. Construct the final string and append to the output file
        >>"%OUTPUT_FILE%" echo + !subject! [!by](https://img.shields.io/badge/by-!formatted_author!-blue.svg?logo=github^&logoColor=white^)(https://github.com/YeonV/LedFx-Frontend-v2/commit/!hash!^)
    )
)

:: Clean up the temporary file
if exist "%TEMP_SEEN_FILE%" del "%TEMP_SEEN_FILE%"

echo Changelog generated in %OUTPUT_FILE%
endlocal