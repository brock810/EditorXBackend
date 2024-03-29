@echo off

REM Check if Node.js is installed
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not found in the PATH. Please install Node.js and try again.
    exit /b 1
)

REM Check if Go is installed
go version > nul 2>&1
if %errorlevel% neq 0 (
    echo Go is not installed or not found in the PATH. Please install Go and try again.
    exit /b 1
)

REM Check if .NET Core SDK is installed
dotnet --version > nul 2>&1
if %errorlevel% neq 0 (
    echo .NET Core SDK is not installed or not found in the PATH. Please install .NET Core SDK and try again.
    exit /b 1
)


echo All dependencies are installed.
exit /b 0
