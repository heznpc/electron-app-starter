# Electron App Starter

Electron app with cross-platform builds (macOS/Windows/Linux), code signing, auto-update, and GitHub Releases CI/CD.

## Project Structure

```
src/
  main.js           → Main process (window creation, lifecycle)
  preload.js        → Preload script (context bridge)
  renderer/         → Renderer process (HTML/CSS/JS UI)
assets/             → App icon (icon.png, 256x256 minimum)
scripts/
  bump-version.js   → Version bumping
docs/
  CODE_SIGNING.md   → macOS/Windows code signing setup
  AUTO_UPDATE.md    → electron-updater configuration
```

## CI/CD Pipeline

- **ci.yml**: Push/PR to main. ESLint + Jest + npm audit. No secrets.
- **cd.yml**: Manual trigger. CI gate → cross-platform matrix build (macOS/Windows/Linux) → code signing (optional) → GitHub Release with installers.
- **setup.yml**: First push only. Creates setup checklist Issue.

## Secrets (all optional — unsigned builds work)

| Secret | For | Required |
|--------|-----|----------|
| `CSC_LINK` | Code signing certificate (base64) | Optional |
| `CSC_KEY_PASSWORD` | Certificate password | Optional |
| `APPLE_ID` | macOS notarization | Optional |
| `APPLE_APP_SPECIFIC_PASSWORD` | macOS notarization | Optional |
| `APPLE_TEAM_ID` | macOS notarization | Optional |

Without code signing secrets, builds complete successfully but installers show OS security warnings.

## What to Modify

- `src/renderer/` → Your app UI (HTML/CSS/JS)
- `src/main.js` → Window configuration, app lifecycle
- `src/preload.js` → APIs exposed to renderer
- `assets/icon.png` → Your app icon (256x256px minimum)
- `package.json` → Update these fields:
  - `name` → Your app name (lowercase, no spaces)
  - `description` → App description
  - `build.appId` → Reverse domain (com.yourname.yourapp)
  - `build.productName` → Display name
- Version → `npm run version:patch|minor|major`

## Do NOT Modify

- `build` config structure in package.json
  - **Why**: electron-builder가 이 구조를 파싱. 키 이름이나 중첩 구조를 바꾸면 빌드 실패.
- `publish.provider: "github"` in package.json
  - **Why**: electron-updater가 GitHub Releases에서 새 버전을 체크. provider를 바꾸면 auto-update가 동작하지 않음.
- CD workflow matrix (macOS/Windows/Linux)
  - **Why**: 각 OS에서 네이티브 빌드가 필요함 (macOS = DMG, Windows = NSIS, Linux = AppImage). 크로스 컴파일 불가.
- electron-updater import in main.js
  - **Why**: 앱 시작 시 GitHub Releases를 체크해서 자동 업데이트. 제거하면 유저가 수동으로 새 버전을 다운로드해야 함.

## Build Targets

Configured in `package.json.build`:
- **macOS**: DMG + ZIP
- **Windows**: NSIS installer
- **Linux**: AppImage + DEB

## Key Patterns

- electron-builder for packaging (config in package.json `build` field)
- electron-updater for auto-update (checks GitHub Releases)
- Preload script bridges main ↔ renderer (contextIsolation: true)
- No bundler — plain JS, loaded directly by Electron
- Runtime dep: `electron-updater` only. `electron` itself is devDep.
