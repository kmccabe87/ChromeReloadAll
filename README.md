# Reload All Tabs

A small Chrome extension that reloads every open tab in one click.

## Features

- Reloads all open browser tabs at once.
- Manifest V3, no external dependencies.

## Installation (Load unpacked)

1. Clone or download this repository.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked**.
5. Select the **`Reload All Tabs`** folder in this repository (it contains `manifest.json`).
6. Pin the extension and click it to reload all tabs.

## Repository layout

| Path | Description |
| --- | --- |
| `Reload All Tabs/manifest.json` | Extension manifest (MV3) |
| `Reload All Tabs/background.js` | Background service worker |
| `Reload All Tabs/popup.html`, `popup.js` | Click-to-reload popup UI |
| `Reload All Tabs/icon16.png`, `icon32.png`, `icon128.png` | Toolbar icons |

## License

GPL-3.0 — see [LICENSE](LICENSE).
