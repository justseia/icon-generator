# App Asset Generator

Browser-based tool for generating app icons and splash screens for iOS, Android, and Web. All image processing runs locally — nothing is uploaded to any server.

**[Live Demo](https://justseia.github.io/icon-generator/)** (if deployed to GitHub Pages)

## Features

- **iOS Icons** — full `AppIcon.appiconset` with `Contents.json` (iPhone, iPad, App Store)
- **Android Icons** — `mipmap-*` folders with `ic_launcher.png`, `ic_launcher_round.png`, adaptive icon foreground layers, and `ic_launcher.xml`
- **Android Themed Icons** — monochrome silhouette layers for Material You (Android 13+) with live preview and threshold control
- **Android Notification Icons** — 24dp white silhouettes for status bar across all densities
- **iOS Splash Screens** — launch images for all iPhone and iPad sizes (portrait + landscape), including iPhone 16 Pro/Pro Max
- **Android Splash Screens** — splash images for all density buckets (mdpi through xxxhdpi)
- **Web Favicons** — `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`
- **Store Icons** — 1024x1024 for App Store, 512x512 for Play Store
- **Light/Dark theme colors** — configurable background and icon background colors, exported as `values/colors.xml` and `values-night/colors.xml`
- **Splash logo scale** — adjustable logo size on splash screens (10%–80%)
- **ZIP download** — all assets packaged in a single ZIP with correct folder structure and naming conventions

## Quick Start

No build tools, no dependencies to install. Open `index.html` in a browser:

```bash
# clone and open
git clone https://github.com/justseia/icon-generator.git
cd icon-generator
open index.html
```

Or serve with any static server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Usage

1. **Upload** a source image (recommended: 1024x1024 PNG for icons, 1920x1920+ for splash screens)
2. **Select** which asset types to generate (iOS Icons, Android Icons, Splash Screens, etc.)
3. **Configure** colors and options:
   - Background color for splash screens (light and dark themes)
   - Icon background color for adaptive icons (light and dark themes)
   - Logo scale for splash screens
   - Monochrome threshold and invert for themed/notification icons
4. **Generate & Download** — a single ZIP file containing all selected assets

## Output Structure

```
app-assets.zip
├── ios/
│   ├── AppIcon.appiconset/
│   │   ├── Contents.json
│   │   ├── iPhone-App@2x.png
│   │   ├── iPhone-App@3x.png
│   │   ├── iPad-App@1x.png
│   │   ├── iPad-App@2x.png
│   │   ├── AppStore-1024@1x.png
│   │   └── ...
│   └── LaunchImage.launchimage/
│       ├── Contents.json
│       ├── Default-Portrait-iPhone14Pro.png
│       ├── Default-Landscape-iPad.png
│       └── ...
├── android/
│   └── res/
│       ├── mipmap-mdpi/
│       │   ├── ic_launcher.png
│       │   └── ic_launcher_round.png
│       ├── mipmap-hdpi/
│       ├── mipmap-xhdpi/
│       ├── mipmap-xxhdpi/
│       ├── mipmap-xxxhdpi/
│       ├── mipmap-anydpi-v26/
│       │   ├── ic_launcher.xml
│       │   └── ic_launcher_round.xml
│       ├── drawable/
│       │   └── ic_launcher_background.xml
│       ├── drawable-mdpi/
│       │   ├── ic_launcher_foreground.png
│       │   ├── ic_launcher_monochrome.png
│       │   ├── ic_notification.png
│       │   └── splash_screen.png
│       ├── drawable-hdpi/
│       ├── drawable-xhdpi/
│       ├── drawable-xxhdpi/
│       ├── drawable-xxxhdpi/
│       ├── values/
│       │   └── colors.xml
│       └── values-night/
│           └── colors.xml
├── web/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   └── android-chrome-512x512.png
└── store/
    ├── AppStore-1024x1024.png
    └── PlayStore-512x512.png
```

## Asset Sizes Reference

### iOS Icons

| Name | Size (px) | Idiom | Scale | Purpose |
|------|-----------|-------|-------|---------|
| iPhone-Notification@2x | 40 | iphone | 2x | Notifications |
| iPhone-Notification@3x | 60 | iphone | 3x | Notifications |
| iPhone-Settings@2x | 58 | iphone | 2x | Settings |
| iPhone-Settings@3x | 87 | iphone | 3x | Settings |
| iPhone-Spotlight@2x | 80 | iphone | 2x | Spotlight |
| iPhone-Spotlight@3x | 120 | iphone | 3x | Spotlight |
| iPhone-App@2x | 120 | iphone | 2x | Home Screen |
| iPhone-App@3x | 180 | iphone | 3x | Home Screen |
| iPad-Notification@1x | 20 | ipad | 1x | Notifications |
| iPad-Notification@2x | 40 | ipad | 2x | Notifications |
| iPad-Settings@1x | 29 | ipad | 1x | Settings |
| iPad-Settings@2x | 58 | ipad | 2x | Settings |
| iPad-Spotlight@1x | 40 | ipad | 1x | Spotlight |
| iPad-Spotlight@2x | 80 | ipad | 2x | Spotlight |
| iPad-App@1x | 76 | ipad | 1x | Home Screen |
| iPad-App@2x | 152 | ipad | 2x | Home Screen |
| iPad-ProApp@2x | 167 | ipad | 2x | Home Screen (Pro) |
| AppStore-1024@1x | 1024 | ios-marketing | 1x | App Store |

### Android Icons

| Density | Launcher (px) | Adaptive Layer (px) |
|---------|--------------|-------------------|
| mdpi | 48 | 108 |
| hdpi | 72 | 162 |
| xhdpi | 96 | 216 |
| xxhdpi | 144 | 324 |
| xxxhdpi | 192 | 432 |

### Android Notification Icons

| Density | Size (px) |
|---------|-----------|
| mdpi | 24 |
| hdpi | 36 |
| xhdpi | 48 |
| xxhdpi | 72 |
| xxxhdpi | 96 |

### iOS Splash Screens

Covers iPhone 8 through iPhone 16 Pro Max, iPad, iPad Mini 6, iPad Air 11", iPad Pro 10.5"/11"/12.9"/13" M4 — both portrait and landscape orientations. Full list is in `app.js`.

### Android Splash Screens

| Density | Size (px) |
|---------|-----------|
| mdpi | 320x480 |
| hdpi | 480x800 |
| xhdpi | 720x1280 |
| xxhdpi | 960x1600 |
| xxxhdpi | 1280x1920 |

## Tech Stack

- Vanilla HTML, CSS, JavaScript (no frameworks, no build step)
- [JSZip](https://stuk.github.io/jszip/) — ZIP file generation
- [FileSaver.js](https://github.com/nicolo-ribaudo/FileSaver.js) — download trigger
- [Inter](https://rsms.me/inter/) — font (loaded from Google Fonts)

## Browser Support

Works in any modern browser with Canvas and Blob support (Chrome, Firefox, Safari, Edge).

## License

MIT
