@echo off

REM Download C# .NET Core SDK
curl -o dotnet-sdk.exe https://download.visualstudio.microsoft.com/download/pr/3d5d1d19-0ef4-4964-bc1b-52d4b0c0b253/7a1e496cf92df4c7994c5a2a084b432f/dotnet-sdk-6.0.100-preview.6.21355.2-win-x64.exe

REM Download Ruby Installer
curl -o rubyinstaller.exe https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-3.0.3-1/rubyinstaller-devkit-3.0.3-1-x64.exe

REM Download Swift for Windows
curl -o swift.zip https://swift.org/builds/swift-5.5.3-release/windows10/swift-5.5.3-RELEASE/swift-5.5.3-RELEASE-windows10.exe

REM Download Go Language
curl -o go.zip https://golang.org/dl/go1.18.windows-amd64.msi

REM Download Rustup Installer
curl --proto '=https' --tlsv1.2 -sSf -o rustup-init.exe https://win.rustup.rs/x86_64

REM Download PHP for Windows
curl -o php.zip https://windows.php.net/downloads/releases/php-8.1.2-Win32-vs16-x64.zip

REM Download Kotlin Compiler
curl -o kotlin.zip https://github.com/JetBrains/kotlin/releases/download/v1.6.10/kotlin-compiler-1.6.10.zip

REM Download Scala Build Tool (SBT)
curl -L -o sbt.zip https://piccolo.link/sbt-1.5.5.zip

REM Download R for Windows
curl -o R.exe https://cran.r-project.org/bin/windows/base/R-4.1.2-win.exe

REM Download Perl for Windows
curl -o strawberry-perl.exe http://strawberryperl.com/download/5.32.1.1/strawberry-perl-5.32.1.1-64bit.msi

REM Download Haskell Platform for Windows
curl -o haskell-platform.exe https://downloads.haskell.org/platform/8.10.7/haskell-platform-8.10.7-a86_64-setup.exe

REM Download Lua for Windows
curl -o lua.zip https://sourceforge.net/projects/luabinaries/files/5.4.4/Tools%20Executables/lua-5.4.4_Win64_bin.zip

REM Download SQL Server Express Edition
curl -o sql-server.exe https://go.microsoft.com/fwlink/?linkid=866658

REM Download NASM (Assembler)
curl -o nasm.zip https://www.nasm.us/pub/nasm/releasebuilds/2.15.05/win64/nasm-2.15.05-installer-x86_64.exe

REM Download Java JDK (Replace 20 with the desired version, e.g., 17)
curl -o java.exe https://download.oracle.com/java/20/jdk-20_windows-x64_bin.exe

echo All languages downloaded successfully.
