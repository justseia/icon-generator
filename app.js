// ============================================================
// App Asset Generator — all processing runs in the browser
// ============================================================

(() => {
    'use strict';

    // ---------- DOM refs ----------
    const fileInput     = document.getElementById('fileInput');
    const uploadArea    = document.getElementById('uploadArea');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImg    = document.getElementById('previewImg');
    const removeBtn     = document.getElementById('removeBtn');
    const generateBtn   = document.getElementById('generateBtn');
    const progressBar   = document.getElementById('progressBar');
    const progressFill  = document.getElementById('progressFill');
    const progressText  = document.getElementById('progressText');
    const generateInfo  = document.getElementById('generateInfo');
    const previewSection = document.getElementById('previewSection');
    const previewGrid   = document.getElementById('previewGrid');
    const bgColor       = document.getElementById('bgColor');
    const bgColorText   = document.getElementById('bgColorText');
    const logoScale     = document.getElementById('logoScale');
    const logoScaleValue = document.getElementById('logoScaleValue');
    const iconBgColor       = document.getElementById('iconBgColor');
    const iconBgColorText   = document.getElementById('iconBgColorText');
    const bgColorDark       = document.getElementById('bgColorDark');
    const bgColorDarkText   = document.getElementById('bgColorDarkText');
    const iconBgColorDark   = document.getElementById('iconBgColorDark');
    const iconBgColorDarkText = document.getElementById('iconBgColorDarkText');
    const monoThreshold = document.getElementById('monoThreshold');
    const monoThresholdValue = document.getElementById('monoThresholdValue');
    const monoInvert    = document.getElementById('monoInvert');
    const monoPreviewCanvas = document.getElementById('monoPreviewCanvas');
    const monoThemedCanvas  = document.getElementById('monoThemedCanvas');

    let sourceImage = null;   // HTMLImageElement

    // ============================================================
    //  ASSET SPECIFICATIONS
    // ============================================================

    // --- iOS App Icons (AppIcon.appiconset) ---
    // Filenames follow Xcode convention: unique per entry, idiom resolved via Contents.json
    const IOS_ICONS = [
        // iPhone
        { name: 'iPhone-Notification@2x.png',  size: 40,   idiom: 'iphone', scale: '2x', sizeStr: '20x20' },
        { name: 'iPhone-Notification@3x.png',  size: 60,   idiom: 'iphone', scale: '3x', sizeStr: '20x20' },
        { name: 'iPhone-Settings@2x.png',      size: 58,   idiom: 'iphone', scale: '2x', sizeStr: '29x29' },
        { name: 'iPhone-Settings@3x.png',      size: 87,   idiom: 'iphone', scale: '3x', sizeStr: '29x29' },
        { name: 'iPhone-Spotlight@2x.png',     size: 80,   idiom: 'iphone', scale: '2x', sizeStr: '40x40' },
        { name: 'iPhone-Spotlight@3x.png',     size: 120,  idiom: 'iphone', scale: '3x', sizeStr: '40x40' },
        { name: 'iPhone-App@2x.png',           size: 120,  idiom: 'iphone', scale: '2x', sizeStr: '60x60' },
        { name: 'iPhone-App@3x.png',           size: 180,  idiom: 'iphone', scale: '3x', sizeStr: '60x60' },
        // iPad
        { name: 'iPad-Notification@1x.png',    size: 20,   idiom: 'ipad', scale: '1x', sizeStr: '20x20' },
        { name: 'iPad-Notification@2x.png',    size: 40,   idiom: 'ipad', scale: '2x', sizeStr: '20x20' },
        { name: 'iPad-Settings@1x.png',        size: 29,   idiom: 'ipad', scale: '1x', sizeStr: '29x29' },
        { name: 'iPad-Settings@2x.png',        size: 58,   idiom: 'ipad', scale: '2x', sizeStr: '29x29' },
        { name: 'iPad-Spotlight@1x.png',       size: 40,   idiom: 'ipad', scale: '1x', sizeStr: '40x40' },
        { name: 'iPad-Spotlight@2x.png',       size: 80,   idiom: 'ipad', scale: '2x', sizeStr: '40x40' },
        { name: 'iPad-App@1x.png',             size: 76,   idiom: 'ipad', scale: '1x', sizeStr: '76x76' },
        { name: 'iPad-App@2x.png',             size: 152,  idiom: 'ipad', scale: '2x', sizeStr: '76x76' },
        { name: 'iPad-ProApp@2x.png',          size: 167,  idiom: 'ipad', scale: '2x', sizeStr: '83.5x83.5' },
        // App Store
        { name: 'AppStore-1024@1x.png',        size: 1024, idiom: 'ios-marketing', scale: '1x', sizeStr: '1024x1024' },
    ];

    // --- Android Icons ---
    const ANDROID_DENSITIES = [
        { folder: 'mipmap-mdpi',    size: 48,  adaptiveLayer: 108 },
        { folder: 'mipmap-hdpi',    size: 72,  adaptiveLayer: 162 },
        { folder: 'mipmap-xhdpi',   size: 96,  adaptiveLayer: 216 },
        { folder: 'mipmap-xxhdpi',  size: 144, adaptiveLayer: 324 },
        { folder: 'mipmap-xxxhdpi', size: 192, adaptiveLayer: 432 },
    ];

    // --- Android Notification Icons (24dp, white on transparent) ---
    const ANDROID_NOTIFICATION = [
        { folder: 'drawable-mdpi',    size: 24  },
        { folder: 'drawable-hdpi',    size: 36  },
        { folder: 'drawable-xhdpi',   size: 48  },
        { folder: 'drawable-xxhdpi',  size: 72  },
        { folder: 'drawable-xxxhdpi', size: 96  },
    ];

    // --- iOS Splash Screens ---
    // Each entry includes metadata for Contents.json:
    //   orientation, idiom, scale, minimum-system-version, subtype (screen height for iPhones)
    const IOS_SPLASH = [
        // Portrait — iPhones
        { name: 'Default-Portrait-iPhone8.png',        w: 750,  h: 1334,  orientation: 'portrait', idiom: 'iphone', scale: '2x', minVer: '8.0', subtype: '667h' },
        { name: 'Default-Portrait-iPhone8Plus.png',    w: 1242, h: 2208,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '8.0', subtype: '736h' },
        { name: 'Default-Portrait-iPhoneX.png',        w: 1125, h: 2436,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '11.0', subtype: '812h' },
        { name: 'Default-Portrait-iPhoneXsMax.png',    w: 1242, h: 2688,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '12.0', subtype: '896h' },
        { name: 'Default-Portrait-iPhoneXr.png',       w: 828,  h: 1792,  orientation: 'portrait', idiom: 'iphone', scale: '2x', minVer: '12.0', subtype: '896h' },
        { name: 'Default-Portrait-iPhone12Mini.png',   w: 1080, h: 2340,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '14.0', subtype: '780h' },
        { name: 'Default-Portrait-iPhone12.png',       w: 1170, h: 2532,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '14.0', subtype: '844h' },
        { name: 'Default-Portrait-iPhone12ProMax.png', w: 1284, h: 2778,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '14.0', subtype: '926h' },
        { name: 'Default-Portrait-iPhone14Pro.png',    w: 1179, h: 2556,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '16.0', subtype: '852h' },
        { name: 'Default-Portrait-iPhone14ProMax.png', w: 1290, h: 2796,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '16.0', subtype: '932h' },
        { name: 'Default-Portrait-iPhone16Pro.png',    w: 1206, h: 2622,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '18.0', subtype: '874h' },
        { name: 'Default-Portrait-iPhone16ProMax.png', w: 1320, h: 2868,  orientation: 'portrait', idiom: 'iphone', scale: '3x', minVer: '18.0', subtype: '956h' },
        // Portrait — iPads
        { name: 'Default-Portrait-iPad.png',           w: 1536, h: 2048,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '7.0' },
        { name: 'Default-Portrait-iPadMini6.png',      w: 1488, h: 2266,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '15.0' },
        { name: 'Default-Portrait-iPadAir11.png',      w: 1640, h: 2360,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '15.0' },
        { name: 'Default-Portrait-iPadPro10.png',      w: 1668, h: 2224,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '10.0' },
        { name: 'Default-Portrait-iPadPro11.png',      w: 1668, h: 2388,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '12.0' },
        { name: 'Default-Portrait-iPadPro12.png',      w: 2048, h: 2732,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '9.0' },
        { name: 'Default-Portrait-iPadPro13M4.png',    w: 2064, h: 2752,  orientation: 'portrait', idiom: 'ipad', scale: '2x', minVer: '18.0' },
        // Landscape — iPhones
        { name: 'Default-Landscape-iPhone8.png',       w: 1334, h: 750,   orientation: 'landscape', idiom: 'iphone', scale: '2x', minVer: '8.0', subtype: '667h' },
        { name: 'Default-Landscape-iPhone8Plus.png',   w: 2208, h: 1242,  orientation: 'landscape', idiom: 'iphone', scale: '3x', minVer: '8.0', subtype: '736h' },
        { name: 'Default-Landscape-iPhoneX.png',       w: 2436, h: 1125,  orientation: 'landscape', idiom: 'iphone', scale: '3x', minVer: '11.0', subtype: '812h' },
        { name: 'Default-Landscape-iPhone12.png',      w: 2532, h: 1170,  orientation: 'landscape', idiom: 'iphone', scale: '3x', minVer: '14.0', subtype: '844h' },
        { name: 'Default-Landscape-iPhone14Pro.png',   w: 2556, h: 1179,  orientation: 'landscape', idiom: 'iphone', scale: '3x', minVer: '16.0', subtype: '852h' },
        { name: 'Default-Landscape-iPhone16ProMax.png',w: 2868, h: 1320,  orientation: 'landscape', idiom: 'iphone', scale: '3x', minVer: '18.0', subtype: '956h' },
        // Landscape — iPads
        { name: 'Default-Landscape-iPad.png',          w: 2048, h: 1536,  orientation: 'landscape', idiom: 'ipad', scale: '2x', minVer: '7.0' },
        { name: 'Default-Landscape-iPadAir11.png',     w: 2360, h: 1640,  orientation: 'landscape', idiom: 'ipad', scale: '2x', minVer: '15.0' },
        { name: 'Default-Landscape-iPadPro11.png',     w: 2388, h: 1668,  orientation: 'landscape', idiom: 'ipad', scale: '2x', minVer: '12.0' },
        { name: 'Default-Landscape-iPadPro12.png',     w: 2732, h: 2048,  orientation: 'landscape', idiom: 'ipad', scale: '2x', minVer: '9.0' },
        { name: 'Default-Landscape-iPadPro13M4.png',   w: 2752, h: 2064,  orientation: 'landscape', idiom: 'ipad', scale: '2x', minVer: '18.0' },
    ];

    // --- Android Splash Screens ---
    const ANDROID_SPLASH = [
        { folder: 'drawable-mdpi',    w: 320,  h: 480  },
        { folder: 'drawable-hdpi',    w: 480,  h: 800  },
        { folder: 'drawable-xhdpi',   w: 720,  h: 1280 },
        { folder: 'drawable-xxhdpi',  w: 960,  h: 1600 },
        { folder: 'drawable-xxxhdpi', w: 1280, h: 1920 },
    ];

    // --- Favicon ---
    const FAVICON_SIZES = [
        { name: 'favicon-16x16.png',       size: 16  },
        { name: 'favicon-32x32.png',       size: 32  },
        { name: 'favicon-48x48.png',       size: 48  },
        { name: 'apple-touch-icon.png',    size: 180 },
        { name: 'android-chrome-192x192.png', size: 192 },
        { name: 'android-chrome-512x512.png', size: 512 },
    ];

    // ============================================================
    //  FILE INPUT & DRAG/DROP
    // ============================================================

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) loadFile(fileInput.files[0]);
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sourceImage = null;
        uploadPlaceholder.hidden = false;
        uploadPreview.hidden = true;
        updateUI();
    });

    function loadFile(file) {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                sourceImage = img;
                previewImg.src = e.target.result;
                uploadPlaceholder.hidden = true;
                uploadPreview.hidden = false;
                updateUI();
                updateMonoPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ============================================================
    //  UI UPDATES
    // ============================================================

    function getSelectedAssets() {
        return [...document.querySelectorAll('input[name="asset"]:checked')].map(c => c.value);
    }

    function updateUI() {
        const assets = getSelectedAssets();
        const ready = sourceImage && assets.length > 0;
        generateBtn.disabled = !ready;

        let count = 0;
        if (assets.includes('ios-icons'))      count += IOS_ICONS.length;
        if (assets.includes('android-icons'))  count += ANDROID_DENSITIES.length * 2; // launcher + round
        if (assets.includes('android-mono'))   count += ANDROID_DENSITIES.length;     // monochrome layers
        if (assets.includes('android-notif'))  count += ANDROID_NOTIFICATION.length;  // notification icons
        if (assets.includes('ios-splash'))     count += IOS_SPLASH.length;
        if (assets.includes('android-splash')) count += ANDROID_SPLASH.length;
        if (assets.includes('favicon'))        count += FAVICON_SIZES.length;
        if (assets.includes('store'))          count += 2;

        generateInfo.innerHTML = ready
            ? `<p>Ready to generate <strong>${count} files</strong></p>`
            : '<p>Select assets above and upload an image to generate</p>';
    }

    document.querySelectorAll('input[name="asset"]').forEach(c => c.addEventListener('change', updateUI));

    // Color sync helper
    function syncColor(picker, text) {
        picker.addEventListener('input', () => { text.value = picker.value; });
        text.addEventListener('input', () => {
            if (/^#[0-9a-f]{6}$/i.test(text.value)) picker.value = text.value;
        });
    }
    syncColor(bgColor, bgColorText);
    syncColor(iconBgColor, iconBgColorText);
    syncColor(bgColorDark, bgColorDarkText);
    syncColor(iconBgColorDark, iconBgColorDarkText);

    // Scale display
    logoScale.addEventListener('input', () => {
        logoScaleValue.textContent = logoScale.value + '%';
    });

    // Monochrome controls
    monoThreshold.addEventListener('input', () => {
        monoThresholdValue.textContent = monoThreshold.value;
        updateMonoPreview();
    });
    monoInvert.addEventListener('change', () => updateMonoPreview());

    // ============================================================
    //  IMAGE GENERATION HELPERS
    // ============================================================

    function resizeToSquare(img, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);
        return canvas;
    }

    function resizeToRound(img, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        return canvas;
    }

    function createSplash(img, w, h, bg, scale) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Background
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);

        // Center logo
        const minDim = Math.min(w, h);
        const logoSize = Math.round(minDim * (scale / 100));
        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;
        const aspect = srcW / srcH;
        let drawW, drawH;
        if (aspect >= 1) {
            drawW = logoSize;
            drawH = Math.round(logoSize / aspect);
        } else {
            drawH = logoSize;
            drawW = Math.round(logoSize * aspect);
        }
        const x = Math.round((w - drawW) / 2);
        const y = Math.round((h - drawH) / 2);
        ctx.drawImage(img, x, y, drawW, drawH);
        return canvas;
    }

    /**
     * Create a monochrome silhouette for Android themed icons.
     * Converts the image to a white shape on transparent background.
     * Android system tints this with the user's wallpaper color.
     *
     * The layer is 108dp (adaptive icon spec). The logo sits in the
     * center 66dp safe zone with the outer 21dp padding on each side.
     */
    function createMonochrome(img, layerSize, threshold, invert) {
        const canvas = document.createElement('canvas');
        canvas.width = layerSize;
        canvas.height = layerSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill full 108dp layer — Android masks the outer edges itself
        ctx.drawImage(img, 0, 0, layerSize, layerSize);

        const imageData = ctx.getImageData(0, 0, layerSize, layerSize);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            let isFg;
            if (invert) {
                isFg = lum >= threshold && a > 30;
            } else {
                isFg = lum < threshold && a > 30;
            }

            if (isFg) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = Math.max(a, 200);
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * Create adaptive icon foreground layer.
     * Canvas is 108dp, Android masks to ~72dp visible area.
     * Draw the icon into the 72dp zone so nothing gets clipped.
     */
    function createAdaptiveForeground(img, layerSize) {
        const canvas = document.createElement('canvas');
        canvas.width = layerSize;
        canvas.height = layerSize;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 72dp visible area inside 108dp canvas
        const visibleSize = Math.round(layerSize * (72 / 108));
        const offset = Math.round((layerSize - visibleSize) / 2);
        ctx.drawImage(img, offset, offset, visibleSize, visibleSize);
        return canvas;
    }

    /**
     * Create notification icon: white silhouette on transparent, 24dp.
     * 2dp padding on each side → icon content in 20dp safe area.
     */
    function createNotificationIcon(img, size, threshold, invert) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 2dp padding → content in 20/24 of size
        const padding = Math.round(size * (2 / 24));
        const contentSize = size - padding * 2;
        ctx.drawImage(img, padding, padding, contentSize, contentSize);

        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            let isFg;
            if (invert) {
                isFg = lum >= threshold && a > 30;
            } else {
                isFg = lum < threshold && a > 30;
            }

            if (isFg) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
            } else {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 0;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * Update the live monochrome preview canvases
     */
    function updateMonoPreview() {
        if (!sourceImage) return;
        const threshold = parseInt(monoThreshold.value, 10);
        const invert = monoInvert.checked;

        // Raw monochrome — white silhouette on transparent (shown on dark bg via CSS)
        const mono = createMonochrome(sourceImage, 108, threshold, invert);
        const mCtx = monoPreviewCanvas.getContext('2d');
        mCtx.clearRect(0, 0, 108, 108);
        mCtx.drawImage(mono, 0, 0);

        // Themed preview — tinted version (simulate Material You blue tint)
        const themed = createMonochrome(sourceImage, 108, threshold, invert);
        const tCtx = monoThemedCanvas.getContext('2d');
        tCtx.clearRect(0, 0, 108, 108);
        // Tint the white pixels to a Material You blue
        const td = themed.getContext('2d').getImageData(0, 0, 108, 108);
        for (let i = 0; i < td.data.length; i += 4) {
            if (td.data[i + 3] > 0) {
                td.data[i] = 24;      // R
                td.data[i + 1] = 79;  // G
                td.data[i + 2] = 158; // B
            }
        }
        tCtx.putImageData(td, 0, 0);
    }

    function canvasToBlob(canvas, type = 'image/png') {
        return new Promise(resolve => canvas.toBlob(resolve, type));
    }

    // ============================================================
    //  CONTENTS.JSON for iOS
    // ============================================================

    function buildContentsJson() {
        const images = IOS_ICONS.map(icon => ({
            filename: icon.name,
            idiom: icon.idiom,
            scale: icon.scale,
            size: icon.sizeStr,
        }));
        return JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2);
    }

    // ============================================================
    //  CONTENTS.JSON for LaunchImage
    // ============================================================

    function buildLaunchImageContentsJson() {
        const images = IOS_SPLASH.map(splash => {
            const entry = {
                filename: splash.name,
                idiom: splash.idiom,
                orientation: splash.orientation,
                scale: splash.scale,
                extent: 'full-screen',
                'minimum-system-version': splash.minVer,
            };
            if (splash.subtype) {
                entry.subtype = splash.subtype;
            }
            return entry;
        });
        return JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2);
    }

    // ============================================================
    //  ADAPTIVE ICON XML
    // ============================================================

    function adaptiveIconXml(withMono) {
        const mono = withMono
            ? '\n    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />'
            : '';
        return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />${mono}
</adaptive-icon>`;
    }

    // ============================================================
    //  GENERATE
    // ============================================================

    generateBtn.addEventListener('click', generate);

    async function generate() {
        if (!sourceImage) return;
        const assets = getSelectedAssets();
        if (!assets.length) return;

        const zip = new JSZip();
        const bg = bgColor.value;
        const iconBg = iconBgColor.value;
        const bgDark = bgColorDark.value;
        const iconBgDark = iconBgColorDark.value;
        const scale = parseInt(logoScale.value, 10);
        const previews = [];

        generateBtn.disabled = true;
        progressBar.hidden = false;
        previewSection.hidden = true;

        const hasMono = assets.includes('android-mono');

        let total = 0;
        if (assets.includes('ios-icons'))      total += IOS_ICONS.length;
        if (assets.includes('android-icons'))  total += ANDROID_DENSITIES.length * 2 + ANDROID_DENSITIES.length + 1;
        else if (hasMono)                      total += 1;
        if (hasMono)                           total += ANDROID_DENSITIES.length;
        if (assets.includes('android-notif'))  total += ANDROID_NOTIFICATION.length;
        if (assets.includes('ios-splash'))     total += IOS_SPLASH.length;
        if (assets.includes('android-splash')) total += ANDROID_SPLASH.length;
        if (assets.includes('favicon'))        total += FAVICON_SIZES.length;
        if (assets.includes('store'))          total += 2;

        let done = 0;
        function tick(label) {
            done++;
            const pct = Math.round((done / total) * 100);
            progressFill.style.width = pct + '%';
            progressText.textContent = `${pct}% — ${label}`;
        }

        try {
            // --- iOS Icons ---
            if (assets.includes('ios-icons')) {
                const folder = zip.folder('ios').folder('AppIcon.appiconset');
                folder.file('Contents.json', buildContentsJson());

                for (const icon of IOS_ICONS) {
                    const canvas = resizeToSquare(sourceImage, icon.size);
                    const blob = await canvasToBlob(canvas);
                    folder.file(icon.name, blob);
                    previews.push({ name: icon.name, size: `${icon.size}px`, canvas });
                    tick(icon.name);
                }
            }

            // --- Android Icons ---
            if (assets.includes('android-icons')) {
                const resFolder = zip.folder('android').folder('res');

                for (const density of ANDROID_DENSITIES) {
                    const f = resFolder.folder(density.folder);

                    // Legacy launcher icons
                    const square = resizeToSquare(sourceImage, density.size);
                    const sqBlob = await canvasToBlob(square);
                    f.file('ic_launcher.png', sqBlob);
                    tick(`${density.folder}/ic_launcher.png`);

                    const round = resizeToRound(sourceImage, density.size);
                    const rdBlob = await canvasToBlob(round);
                    f.file('ic_launcher_round.png', rdBlob);
                    previews.push({ name: `${density.folder}/ic_launcher.png`, size: `${density.size}px`, canvas: square });
                    tick(`${density.folder}/ic_launcher_round.png`);

                    // Adaptive foreground layer (108dp)
                    const drawableFolder = resFolder.folder(density.folder.replace('mipmap-', 'drawable-'));
                    const fg = createAdaptiveForeground(sourceImage, density.adaptiveLayer);
                    drawableFolder.file('ic_launcher_foreground.png', await canvasToBlob(fg));
                    tick(`${density.folder}/ic_launcher_foreground.png`);
                }

                // Background drawable (solid color)
                const bgDrawable = resFolder.folder('drawable');
                bgDrawable.file('ic_launcher_background.xml',
`<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="${iconBg}" />
</shape>`);

                // Adaptive icon XML (with monochrome if selected)
                const anydpi = resFolder.folder('mipmap-anydpi-v26');
                anydpi.file('ic_launcher.xml', adaptiveIconXml(hasMono));
                anydpi.file('ic_launcher_round.xml', adaptiveIconXml(hasMono));
                tick('adaptive icon xml');
            }

            // --- Android Monochrome / Themed Icons ---
            if (hasMono) {
                const resFolder = zip.folder('android').folder('res');
                const threshold = parseInt(monoThreshold.value, 10);
                const invert = monoInvert.checked;

                for (const density of ANDROID_DENSITIES) {
                    const drawableFolder = resFolder.folder(density.folder.replace('mipmap-', 'drawable-'));
                    const mono = createMonochrome(sourceImage, density.adaptiveLayer, threshold, invert);
                    drawableFolder.file('ic_launcher_monochrome.png', await canvasToBlob(mono));
                    previews.push({ name: `${density.folder}/monochrome`, size: `${density.adaptiveLayer}px`, canvas: mono });
                    tick(`${density.folder}/ic_launcher_monochrome.png`);
                }

                // If android-icons wasn't selected, still output the XML + background
                if (!assets.includes('android-icons')) {
                    const bgDrawable = resFolder.folder('drawable');
                    bgDrawable.file('ic_launcher_background.xml',
`<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="${iconBg}" />
</shape>`);
                    const anydpi = resFolder.folder('mipmap-anydpi-v26');
                    anydpi.file('ic_launcher.xml', adaptiveIconXml(true));
                    anydpi.file('ic_launcher_round.xml', adaptiveIconXml(true));
                    tick('adaptive icon xml');
                }
            }

            // --- Android Notification Icons ---
            if (assets.includes('android-notif')) {
                const resFolder = zip.folder('android').folder('res');
                const threshold = parseInt(monoThreshold.value, 10);
                const invert = monoInvert.checked;

                for (const notif of ANDROID_NOTIFICATION) {
                    const f = resFolder.folder(notif.folder);
                    const canvas = createNotificationIcon(sourceImage, notif.size, threshold, invert);
                    f.file('ic_notification.png', await canvasToBlob(canvas));
                    previews.push({ name: `${notif.folder}/ic_notification.png`, size: `${notif.size}px`, canvas });
                    tick(`${notif.folder}/ic_notification.png`);
                }
            }

            // --- iOS Splash ---
            if (assets.includes('ios-splash')) {
                const folder = zip.folder('ios').folder('LaunchImage.launchimage');
                folder.file('Contents.json', buildLaunchImageContentsJson());

                for (const splash of IOS_SPLASH) {
                    const canvas = createSplash(sourceImage, splash.w, splash.h, bg, scale);
                    const blob = await canvasToBlob(canvas);
                    folder.file(splash.name, blob);
                    previews.push({ name: splash.name, size: `${splash.w}x${splash.h}`, canvas });
                    tick(splash.name);
                }
            }

            // --- Android Splash ---
            if (assets.includes('android-splash')) {
                const resFolder = zip.folder('android').folder('res');
                for (const splash of ANDROID_SPLASH) {
                    const f = resFolder.folder(splash.folder);
                    const canvas = createSplash(sourceImage, splash.w, splash.h, bg, scale);
                    const blob = await canvasToBlob(canvas);
                    f.file('splash_screen.png', blob);
                    previews.push({ name: `${splash.folder}/splash_screen.png`, size: `${splash.w}x${splash.h}`, canvas });
                    tick(`${splash.folder}/splash_screen.png`);
                }
            }

            // --- Android values & values-night (colors only) ---
            if (assets.includes('android-icons') || assets.includes('android-splash') || hasMono) {
                const resFolder = zip.folder('android').folder('res');

                // values/colors.xml (light)
                resFolder.folder('values').file('colors.xml',
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${iconBg}</color>
    <color name="splash_background">${bg}</color>
</resources>`);

                // values-night/colors.xml (dark)
                resFolder.folder('values-night').file('colors.xml',
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${iconBgDark}</color>
    <color name="splash_background">${bgDark}</color>
</resources>`);
            }

            // --- Favicon ---
            if (assets.includes('favicon')) {
                const folder = zip.folder('web');
                for (const fav of FAVICON_SIZES) {
                    const canvas = resizeToSquare(sourceImage, fav.size);
                    const blob = await canvasToBlob(canvas);
                    folder.file(fav.name, blob);
                    previews.push({ name: fav.name, size: `${fav.size}px`, canvas });
                    tick(fav.name);
                }
            }

            // --- Store Icons ---
            if (assets.includes('store')) {
                const storeFolder = zip.folder('store');
                const appStore = resizeToSquare(sourceImage, 1024);
                storeFolder.file('AppStore-1024x1024.png', await canvasToBlob(appStore));
                previews.push({ name: 'AppStore-1024x1024.png', size: '1024px', canvas: appStore });
                tick('AppStore-1024x1024.png');

                const playStore = resizeToSquare(sourceImage, 512);
                storeFolder.file('PlayStore-512x512.png', await canvasToBlob(playStore));
                previews.push({ name: 'PlayStore-512x512.png', size: '512px', canvas: playStore });
                tick('PlayStore-512x512.png');
            }

            // --- Download ---
            progressText.textContent = 'Packing ZIP...';
            const content = await zip.generateAsync({ type: 'blob' }, (meta) => {
                progressFill.style.width = meta.percent.toFixed(0) + '%';
            });
            saveAs(content, 'app-assets.zip');

            progressText.textContent = 'Done! ZIP downloaded.';
            progressFill.style.width = '100%';

            // --- Show previews ---
            showPreviews(previews);
        } catch (err) {
            progressText.textContent = 'Error: ' + err.message;
            console.error(err);
        } finally {
            setTimeout(() => {
                generateBtn.disabled = false;
                progressBar.hidden = true;
                progressFill.style.width = '0%';
            }, 3000);
        }
    }

    function showPreviews(items) {
        previewGrid.innerHTML = '';
        // Show a subset (max ~30)
        const shown = items.slice(0, 30);
        for (const item of shown) {
            const div = document.createElement('div');
            div.className = 'preview-item';

            const img = document.createElement('img');
            img.src = item.canvas.toDataURL('image/png');
            div.appendChild(img);

            const nameSpan = document.createElement('span');
            nameSpan.textContent = item.name.split('/').pop();
            div.appendChild(nameSpan);

            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'size-label';
            sizeSpan.textContent = item.size;
            div.appendChild(sizeSpan);

            previewGrid.appendChild(div);
        }
        if (items.length > 30) {
            const more = document.createElement('div');
            more.className = 'preview-item';
            more.innerHTML = `<span style="font-size:12px;color:var(--text-muted)">+${items.length - 30} more in ZIP</span>`;
            previewGrid.appendChild(more);
        }
        previewSection.hidden = false;
    }

})();
