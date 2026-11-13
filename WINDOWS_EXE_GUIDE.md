# How to Package "Starlight Atlas" as a Windows `.exe`

Your gift is already configured for 100% offline Windows desktop packaging using **Electron**.

## Option 1: Build Directly on a Windows PC (Fastest)
1. Install **Node.js (LTS)** from https://nodejs.org if you don't already have it.
2. Download/extract this project folder onto your Windows PC.
3. Double-click **`build-windows-exe.bat`** (or open a terminal in the folder and run `npm install` followed by `npm run build:win`).
4. Open the newly created **`release/`** folder:
   - **`Starlight-Atlas-Portable.exe`** — A single standalone `.exe` file you can send straight to her! She just double-clicks it and it opens immediately with zero installation.
   - **`Starlight-Atlas-Setup.exe`** — Optional standard Windows installer.

## Option 2: Build Automatically in the Cloud (If You Aren't on Windows)
1. Push this project folder to a private GitHub repository.
2. Open the **Actions** tab on GitHub and click **Build Windows EXE** → **Run workflow**.
3. Wait ~2 minutes and download the build artifact containing **`Starlight-Atlas-Portable.exe`** ready to share with her!

## What Works Offline in the `.exe`
- The entire 20-stop floating-island journey, animations, heart progress bar, minimap, interactive sky charms, and Gift Board work completely offline.
- Lo-Fi background music, bird chirping, paper rustling, walking footsteps, kitten meows, sparkler crackle, and gift sparkle chimes are synthesized locally using Web Audio—no external audio files needed.
- Her collected gifts and progress are automatically saved locally on her Windows laptop.
- Clicking any tool's link opens it cleanly in her default Windows web browser.
