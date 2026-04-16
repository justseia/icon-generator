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
        { name: 'Icon-App-20x20@2x.png',      size: 40,   idiom: 'iphone', scale: '2x', sizeStr: '20x20' },
        { name: 'Icon-App-20x20@3x.png',      size: 60,   idiom: 'iphone', scale: '3x', sizeStr: '20x20' },
        { name: 'Icon-App-29x29@1x.png',      size: 29,   idiom: 'iphone', scale: '1x', sizeStr: '29x29' },
        { name: 'Icon-App-29x29@2x.png',      size: 58,   idiom: 'iphone', scale: '2x', sizeStr: '29x29' },
        { name: 'Icon-App-29x29@3x.png',      size: 87,   idiom: 'iphone', scale: '3x', sizeStr: '29x29' },
        { name: 'Icon-App-40x40@2x.png',      size: 80,   idiom: 'iphone', scale: '2x', sizeStr: '40x40' },
        { name: 'Icon-App-40x40@3x.png',      size: 120,  idiom: 'iphone', scale: '3x', sizeStr: '40x40' },
        { name: 'Icon-App-60x60@2x.png',      size: 120,  idiom: 'iphone', scale: '2x', sizeStr: '60x60' },
        { name: 'Icon-App-60x60@3x.png',      size: 180,  idiom: 'iphone', scale: '3x', sizeStr: '60x60' },
        // iPad
        { name: 'Icon-App-20x20@1x.png',      size: 20,   idiom: 'ipad', scale: '1x', sizeStr: '20x20' },
        { name: 'Icon-App-20x20@2x.png',      size: 40,   idiom: 'ipad', scale: '2x', sizeStr: '20x20' },
        { name: 'Icon-App-29x29@1x.png',      size: 29,   idiom: 'ipad', scale: '1x', sizeStr: '29x29' },
        { name: 'Icon-App-29x29@2x.png',      size: 58,   idiom: 'ipad', scale: '2x', sizeStr: '29x29' },
        { name: 'Icon-App-40x40@1x.png',      size: 40,   idiom: 'ipad', scale: '1x', sizeStr: '40x40' },
        { name: 'Icon-App-40x40@2x.png',      size: 80,   idiom: 'ipad', scale: '2x', sizeStr: '40x40' },
        { name: 'Icon-App-76x76@1x.png',      size: 76,   idiom: 'ipad', scale: '1x', sizeStr: '76x76' },
        { name: 'Icon-App-76x76@2x.png',      size: 152,  idiom: 'ipad', scale: '2x', sizeStr: '76x76' },
        { name: 'Icon-App-83.5x83.5@2x.png',  size: 167,  idiom: 'ipad', scale: '2x', sizeStr: '83.5x83.5' },
        // App Store
        { name: 'Icon-App-1024x1024@1x.png',  size: 1024, idiom: 'ios-marketing', scale: '1x', sizeStr: '1024x1024' },
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

    // --- iOS Launch Image (for LaunchScreen.storyboard + imageset) ---
    const IOS_LAUNCH_IMAGE = [
        { name: 'LaunchImage.png',    scaleFactor: 1, scale: '1x' },
        { name: 'LaunchImage@2x.png', scaleFactor: 2, scale: '2x' },
        { name: 'LaunchImage@3x.png', scaleFactor: 3, scale: '3x' },
    ];

    // --- Android Splash Logo (for launch_background.xml layer-list) ---
    const ANDROID_SPLASH_LOGO = [
        { folder: 'drawable-mdpi',    factor: 1   },
        { folder: 'drawable-hdpi',    factor: 1.5 },
        { folder: 'drawable-xhdpi',   factor: 2   },
        { folder: 'drawable-xxhdpi',  factor: 3   },
        { folder: 'drawable-xxxhdpi', factor: 4   },
    ];

    // --- Favicon ---
    const FAVICON_SIZES = [
        { name: 'favicon-16x16.png',       size: 16  },
        { name: 'favicon-32x32.png',       size: 32  },
        { name: 'favicon-48x48.png',       size: 48  },
        { name: 'apple-touch-icon.png',    size: 180 },
        { name: 'android-chrome-192x192.png', size: 192 },
        { name: 'android-chrome-512x512.png', size: 512 },
        { name: 'maskable-icon-192x192.png',  size: 192, maskable: true },
        { name: 'maskable-icon-512x512.png',  size: 512, maskable: true },
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
        if (assets.includes('ios-splash'))     count += IOS_LAUNCH_IMAGE.length;
        if (assets.includes('android-splash')) count += ANDROID_SPLASH_LOGO.length;
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

    // ============================================================
    //  COLOR PRESETS (localStorage)
    // ============================================================

    const PRESETS_KEY = 'appAssetGen_colorPresets';
    const savePresetBtn = document.getElementById('savePresetBtn');
    const presetsList   = document.getElementById('presetsList');

    function loadPresets() {
        try { return JSON.parse(localStorage.getItem(PRESETS_KEY)) || []; }
        catch { return []; }
    }

    function savePresets(presets) {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    }

    function getCurrentSettings() {
        return {
            bg: bgColorText.value,
            iconBg: iconBgColorText.value,
            bgDark: bgColorDarkText.value,
            iconBgDark: iconBgColorDarkText.value,
        };
    }

    function applyPreset(preset) {
        bgColor.value = preset.bg;
        bgColorText.value = preset.bg;
        iconBgColor.value = preset.iconBg;
        iconBgColorText.value = preset.iconBg;
        bgColorDark.value = preset.bgDark;
        bgColorDarkText.value = preset.bgDark;
        iconBgColorDark.value = preset.iconBgDark;
        iconBgColorDarkText.value = preset.iconBgDark;
    }

    function renderPresets() {
        const presets = loadPresets();
        presetsList.innerHTML = '';
        presets.forEach((p, i) => {
            const chip = document.createElement('div');
            chip.className = 'preset-chip';
            chip.innerHTML =
                `<div class="preset-colors">` +
                    `<span class="preset-dot" style="background:${p.bg}"></span>` +
                    `<span class="preset-dot" style="background:${p.iconBg}"></span>` +
                `</div>` +
                `<span class="preset-values">` +
                    `<span class="preset-light">${p.bg} / ${p.iconBg}</span>` +
                    `<span class="preset-dark">${p.bgDark} / ${p.iconBgDark}</span>` +
                `</span>` +
                `<button class="preset-delete" title="Delete">&times;</button>`;

            chip.querySelector('.preset-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                const list = loadPresets();
                list.splice(i, 1);
                savePresets(list);
                renderPresets();
            });

            chip.addEventListener('click', (e) => {
                if (e.target.closest('.preset-delete')) return;
                applyPreset(p);
            });

            presetsList.appendChild(chip);
        });
    }

    savePresetBtn.addEventListener('click', () => {
        const settings = getCurrentSettings();
        const presets = loadPresets();
        presets.push(settings);
        savePresets(presets);
        renderPresets();
    });

    renderPresets();

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

    /**
     * Create a monochrome silhouette for Android themed icons.
     * Converts the image to a white shape on transparent background.
     * Android system tints this with the user's wallpaper color.
     *
     * The layer is 108dp (adaptive icon spec). The system masks to a
     * 72dp square visible area (18dp padding each side). Critical content
     * should stay within the 66dp diameter circular safe zone.
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

    /**
     * Create a maskable icon for PWA.
     * Safe zone is the inner 80% circle — pad the icon into that area
     * so launchers can apply any mask shape without clipping content.
     */
    function createMaskableIcon(img, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Fill with background color (use icon bg color)
        ctx.fillStyle = iconBgColor.value;
        ctx.fillRect(0, 0, size, size);

        // Draw icon in the inner 80% safe zone
        const safeSize = Math.round(size * 0.8);
        const offset = Math.round((size - safeSize) / 2);
        ctx.drawImage(img, offset, offset, safeSize, safeSize);
        return canvas;
    }

    /**
     * Build a multi-resolution favicon.ico from PNG canvases.
     * Uses embedded PNG format (supported by all modern browsers).
     */
    async function createIcoBlob(img, sizes) {
        const pngBuffers = [];
        for (const size of sizes) {
            const canvas = resizeToSquare(img, size);
            const blob = await canvasToBlob(canvas);
            pngBuffers.push(await blob.arrayBuffer());
        }

        // ICO header: 6 bytes
        const headerSize = 6;
        const dirEntrySize = 16;
        const dirSize = dirEntrySize * pngBuffers.length;
        let dataOffset = headerSize + dirSize;

        const totalSize = dataOffset + pngBuffers.reduce((sum, buf) => sum + buf.byteLength, 0);
        const ico = new ArrayBuffer(totalSize);
        const view = new DataView(ico);

        // Header
        view.setUint16(0, 0, true);                    // Reserved
        view.setUint16(2, 1, true);                    // Type: 1 = ICO
        view.setUint16(4, pngBuffers.length, true);    // Image count

        // Directory entries + image data
        for (let i = 0; i < pngBuffers.length; i++) {
            const buf = pngBuffers[i];
            const s = sizes[i];
            const entryOffset = headerSize + i * dirEntrySize;

            view.setUint8(entryOffset, s < 256 ? s : 0);      // Width (0 = 256)
            view.setUint8(entryOffset + 1, s < 256 ? s : 0);  // Height
            view.setUint8(entryOffset + 2, 0);                 // Color palette
            view.setUint8(entryOffset + 3, 0);                 // Reserved
            view.setUint16(entryOffset + 4, 1, true);          // Color planes
            view.setUint16(entryOffset + 6, 32, true);         // Bits per pixel
            view.setUint32(entryOffset + 8, buf.byteLength, true);  // Image size
            view.setUint32(entryOffset + 12, dataOffset, true);     // Data offset

            new Uint8Array(ico, dataOffset, buf.byteLength).set(new Uint8Array(buf));
            dataOffset += buf.byteLength;
        }

        return new Blob([ico], { type: 'image/x-icon' });
    }

    /**
     * Build site.webmanifest referencing all web icons.
     */
    function buildWebManifest() {
        const manifest = {
            name: '',
            short_name: '',
            icons: [
                { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
                { src: 'maskable-icon-192x192.png',  sizes: '192x192', type: 'image/png', purpose: 'maskable' },
                { src: 'maskable-icon-512x512.png',  sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            ],
            theme_color: '#ffffff',
            background_color: '#ffffff',
            display: 'standalone',
        };
        return JSON.stringify(manifest, null, 2);
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
    //  iOS LAUNCH SCREEN (LaunchImage.imageset + storyboard)
    // ============================================================

    function buildLaunchImageContentsJson() {
        const images = IOS_LAUNCH_IMAGE.map(item => ({
            filename: item.name,
            idiom: 'universal',
            scale: item.scale,
        }));
        return JSON.stringify({ images, info: { author: 'xcode', version: 1 } }, null, 2);
    }

    function buildLaunchScreenStoryboard(bgHex) {
        const r = parseInt(bgHex.slice(1, 3), 16) / 255;
        const g = parseInt(bgHex.slice(3, 5), 16) / 255;
        const b = parseInt(bgHex.slice(5, 7), 16) / 255;
        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="12121" systemVersion="16G29" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="12089"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <layoutGuides>
                        <viewControllerLayoutGuide type="top" id="Ydg-fD-yQy"/>
                        <viewControllerLayoutGuide type="bottom" id="xbc-2k-c8Z"/>
                    </layoutGuides>
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <imageView opaque="NO" clipsSubviews="YES" multipleTouchEnabled="YES" contentMode="center" image="LaunchImage" translatesAutoresizingMaskIntoConstraints="NO" id="YRO-k0-Ey4">
                            </imageView>
                        </subviews>
                        <color key="backgroundColor" red="${r}" green="${g}" blue="${b}" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                        <constraints>
                            <constraint firstItem="YRO-k0-Ey4" firstAttribute="centerX" secondItem="Ze5-6b-2t3" secondAttribute="centerX" id="1a2-6s-vTC"/>
                            <constraint firstItem="YRO-k0-Ey4" firstAttribute="centerY" secondItem="Ze5-6b-2t3" secondAttribute="centerY" id="4X2-HB-R7a"/>
                        </constraints>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="53" y="375"/>
        </scene>
    </scenes>
    <resources>
        <image name="LaunchImage" width="168" height="185"/>
    </resources>
</document>`;
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
        if (assets.includes('ios-splash'))     total += IOS_LAUNCH_IMAGE.length;
        if (assets.includes('android-splash')) total += ANDROID_SPLASH_LOGO.length;
        if (assets.includes('favicon'))        total += FAVICON_SIZES.length + 2; // +favicon.ico +manifest
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
                const folder = zip.folder('ios/Runner/Assets.xcassets/AppIcon.appiconset');
                folder.file('Contents.json', buildContentsJson());

                const generatedIcons = new Set();
                for (const icon of IOS_ICONS) {
                    if (!generatedIcons.has(icon.name)) {
                        const canvas = resizeToSquare(sourceImage, icon.size);
                        const blob = await canvasToBlob(canvas);
                        folder.file(icon.name, blob);
                        previews.push({ name: icon.name, size: `${icon.size}px`, canvas });
                        generatedIcons.add(icon.name);
                    }
                    tick(icon.name);
                }
            }

            // --- Android Icons ---
            if (assets.includes('android-icons')) {
                const resFolder = zip.folder('android/app/src/main/res');

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
                const resFolder = zip.folder('android/app/src/main/res');
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
                const resFolder = zip.folder('android/app/src/main/res');
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

            // --- iOS Splash (LaunchScreen.storyboard + LaunchImage.imageset) ---
            if (assets.includes('ios-splash')) {
                const iosLogoBasePt = Math.round(390 * scale / 100);

                // LaunchImage.imageset
                const imagesetFolder = zip.folder('ios/Runner/Assets.xcassets/LaunchImage.imageset');
                imagesetFolder.file('Contents.json', buildLaunchImageContentsJson());

                for (const img of IOS_LAUNCH_IMAGE) {
                    const size = iosLogoBasePt * img.scaleFactor;
                    const canvas = resizeToSquare(sourceImage, size);
                    const blob = await canvasToBlob(canvas);
                    imagesetFolder.file(img.name, blob);
                    previews.push({ name: img.name, size: `${size}px`, canvas });
                    tick(img.name);
                }

                // LaunchScreen.storyboard
                zip.folder('ios/Runner/Base.lproj').file(
                    'LaunchScreen.storyboard',
                    buildLaunchScreenStoryboard(bg)
                );
            }

            // --- Android Splash (launch_background.xml + splash_screen per density) ---
            if (assets.includes('android-splash')) {
                const resFolder = zip.folder('android/app/src/main/res');
                const androidLogoBaseDp = Math.round(360 * scale / 100);

                // drawable/launch_background.xml (layer-list)
                resFolder.folder('drawable').file('launch_background.xml',
`<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item>
        <bitmap android:gravity="center" android:src="@drawable/splash_screen" />
    </item>
</layer-list>`);

                // drawable-v21/launch_background.xml (API 21+ override)
                resFolder.folder('drawable-v21').file('launch_background.xml',
`<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background" />
    <item>
        <bitmap android:gravity="center" android:src="@drawable/splash_screen" />
    </item>
</layer-list>`);

                // Splash logo per density
                for (const splash of ANDROID_SPLASH_LOGO) {
                    const size = Math.round(androidLogoBaseDp * splash.factor);
                    const f = resFolder.folder(splash.folder);
                    const canvas = resizeToSquare(sourceImage, size);
                    const blob = await canvasToBlob(canvas);
                    f.file('splash_screen.png', blob);
                    previews.push({ name: `${splash.folder}/splash_screen.png`, size: `${size}px`, canvas });
                    tick(`${splash.folder}/splash_screen.png`);
                }
            }

            // --- Android values & values-night (colors + styles) ---
            if (assets.includes('android-icons') || assets.includes('android-splash') || hasMono) {
                const resFolder = zip.folder('android/app/src/main/res');

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

                // values/styles.xml (Flutter LaunchTheme + NormalTheme)
                resFolder.folder('values').file('styles.xml',
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="LaunchTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">@drawable/launch_background</item>
    </style>
    <style name="NormalTheme" parent="@android:style/Theme.Light.NoTitleBar">
        <item name="android:windowBackground">?android:colorBackground</item>
    </style>
</resources>`);

                // values-night/styles.xml (dark theme)
                resFolder.folder('values-night').file('styles.xml',
`<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="LaunchTheme" parent="@android:style/Theme.Black.NoTitleBar">
        <item name="android:windowBackground">@drawable/launch_background</item>
    </style>
    <style name="NormalTheme" parent="@android:style/Theme.Black.NoTitleBar">
        <item name="android:windowBackground">?android:colorBackground</item>
    </style>
</resources>`);
            }

            // --- Favicon ---
            if (assets.includes('favicon')) {
                const folder = zip.folder('web');
                for (const fav of FAVICON_SIZES) {
                    const canvas = fav.maskable
                        ? createMaskableIcon(sourceImage, fav.size)
                        : resizeToSquare(sourceImage, fav.size);
                    const blob = await canvasToBlob(canvas);
                    folder.file(fav.name, blob);
                    previews.push({ name: fav.name, size: `${fav.size}px`, canvas });
                    tick(fav.name);
                }

                // favicon.ico (multi-resolution: 16, 32, 48)
                const icoBlob = await createIcoBlob(sourceImage, [16, 32, 48]);
                folder.file('favicon.ico', icoBlob);
                tick('favicon.ico');

                // site.webmanifest
                folder.file('site.webmanifest', buildWebManifest());
                tick('site.webmanifest');
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
