#!/usr/bin/env python3
"""Builds the standalone Android WebView APK for Tiệm Hoa Tươi Nghệ Thuật V&V Florielle.

Outputs:
  - public/VVFlorielle.apk
  - public/download/VVFlorielle.apk
  - android/build/VVFlorielle.apk
Uses Android SDK build-tools 35.0.1 and JDK 25 / OpenJDK.
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path
from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(r"E:\VVFlorielle")
ANDROID_DIR = PROJECT_ROOT / "android"
PUBLIC_DIR = PROJECT_ROOT / "public"
OUTPUT_DIR = PUBLIC_DIR / "download"
APK_OUTPUT = PUBLIC_DIR / "VVFlorielle.apk"

SDK_ROOT = Path(r"C:\Users\Admin\AppData\Local\Android\Sdk")
BUILD_TOOLS = SDK_ROOT / "build-tools" / "35.0.1"
PLATFORM_JAR = SDK_ROOT / "platforms" / "android-35" / "android.jar"

AAPT2 = BUILD_TOOLS / "aapt2.exe"
D8 = BUILD_TOOLS / "d8.bat"
ZIPALIGN = BUILD_TOOLS / "zipalign.exe"
APKSIGNER = BUILD_TOOLS / "apksigner.bat"

KEYSTORE_PATH = ANDROID_DIR / "vvflorielle-release.jks"
KEY_ALIAS = "vvflorielle"
KEY_PASS = "vvflorielle2026"


def setup_project_structure() -> None:
    print("[*] Setting up Android project structure for V&V Florielle...")
    res_dir = ANDROID_DIR / "src" / "main" / "res"
    values_dir = res_dir / "values"
    values_dir.mkdir(parents=True, exist_ok=True)

    # 1. AndroidManifest.xml
    manifest_path = ANDROID_DIR / "src" / "main" / "AndroidManifest.xml"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_content = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.vvflorielle.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <queries>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
        <intent>
            <action android:name="android.intent.action.DIAL" />
            <data android:scheme="tel" />
        </intent>
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="zalo" />
        </intent>
    </queries>

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher"
        android:theme="@style/AppTheme"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:largeHeap="true"
        android:allowBackup="true"
        android:supportsRtl="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
    manifest_path.write_text(manifest_content, encoding="utf-8")

    # 2. strings.xml & styles.xml & colors.xml
    (values_dir / "strings.xml").write_text("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">V&amp;V Florielle</string>
</resources>
""", encoding="utf-8")

    (values_dir / "styles.xml").write_text("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.DeviceDefault.Light.NoActionBar">
        <item name="android:statusBarColor">#064E3B</item>
        <item name="android:windowBackground">#F0FDF4</item>
    </style>
</resources>
""", encoding="utf-8")

    (values_dir / "colors.xml").write_text("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#059669</color>
    <color name="primary_dark">#064E3B</color>
    <color name="accent">#F97316</color>
    <color name="bg_light">#F0FDF4</color>
</resources>
""", encoding="utf-8")

    # 3. Generate launcher icons from logo-vvflorielle-square.png
    logo_path = PUBLIC_DIR / "logo-vvflorielle-square.png"
    if logo_path.is_file():
        img = Image.open(logo_path)
        icon_sizes = {
            "mipmap-mdpi": (48, 48),
            "mipmap-hdpi": (72, 72),
            "mipmap-xhdpi": (96, 96),
            "mipmap-xxhdpi": (144, 144),
            "mipmap-xxxhdpi": (192, 192),
        }
        for folder, size in icon_sizes.items():
            folder_path = res_dir / folder
            folder_path.mkdir(parents=True, exist_ok=True)
            resized = img.resize(size, Image.Resampling.LANCZOS)
            resized.save(folder_path / "ic_launcher.png", format="PNG")
        print("  -> Generated high-resolution app icons in mipmap folders.")

    # 4. MainActivity.java
    java_dir = ANDROID_DIR / "src" / "main" / "java" / "com" / "vvflorielle" / "app"
    java_dir.mkdir(parents=True, exist_ok=True)
    main_activity = """package com.vvflorielle.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILECHOOSER_RESULTCODE = 1001;

    // Production URL (Cloudflare Pages)
    private static final String ONLINE_URL = "https://vvflorielle.pages.dev";
    private static final String OFFLINE_URL = "file:///android_asset/offline.html";

    private long lastBackPressTime = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware-accelerated full view
        webView = new WebView(this);
        setContentView(webView);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        // Custom User Agent for App identification
        String defaultUA = settings.getUserAgentString();
        settings.setUserAgentString(defaultUA + " VVFlorielleApp/1.0.0 AndroidWebView");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    return handleUri(request.getUrl());
                }
                return false;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null) {
                    return handleUri(Uri.parse(url));
                }
                return false;
            }

            private boolean handleUri(Uri uri) {
                String scheme = uri.getScheme();
                if ("tel".equalsIgnoreCase(scheme)) {
                    Intent intent = new Intent(Intent.ACTION_DIAL, uri);
                    startActivity(intent);
                    return true;
                } else if ("zalo".equalsIgnoreCase(scheme) || uri.toString().contains("zalo.me")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                } else if ("mailto".equalsIgnoreCase(scheme)) {
                    Intent intent = new Intent(Intent.ACTION_SENDTO, uri);
                    startActivity(intent);
                    return true;
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request != null && request.isForMainFrame()) {
                    view.loadUrl(OFFLINE_URL);
                }
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                if (failingUrl != null && failingUrl.startsWith("https://vvflorielle")) {
                    view.loadUrl(OFFLINE_URL);
                }
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // Cloudflare SSL trusted proceed
                handler.proceed();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/*");
                startActivityForResult(Intent.createChooser(intent, "Chọn hình ảnh hoa hoặc biên lai chuyển khoản"), FILECHOOSER_RESULTCODE);
                return true;
            }
        });

        // Load Live V&V Florielle Store
        webView.loadUrl(ONLINE_URL);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILECHOOSER_RESULTCODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK && data != null) {
                    Uri dataUri = data.getData();
                    if (dataUri != null) {
                        results = new Uri[]{dataUri};
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            if (System.currentTimeMillis() - lastBackPressTime < 2000) {
                super.onBackPressed();
            } else {
                lastBackPressTime = System.currentTimeMillis();
                Toast.makeText(this, "Bấm lần nữa để thoát V&V Florielle", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
"""
    (java_dir / "MainActivity.java").write_text(main_activity, encoding="utf-8")
    print("  -> Created MainActivity.java with hardware acceleration, file upload & resilient webview.")


def setup_mobile_assets() -> None:
    print("[*] Preparing mobile assets in android/src/main/assets...")
    assets_dir = ANDROID_DIR / "src" / "main" / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)

    # Copy logo
    shutil.copy2(PUBLIC_DIR / "logo-vvflorielle-square.png", assets_dir / "logo-vvflorielle-square.png")

    offline_html = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>V&V Florielle - Kết Nối Lại</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 100vw; height: 100vh;
      background: radial-gradient(circle at 50% 20%, #ecfdf5 0%, #f0fdf4 60%, #e6f4ea 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #064e3b; text-align: center; padding: 24px;
    }
    .logo-box {
      width: 90px; height: 90px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 12px 30px rgba(5, 150, 105, 0.18);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 18px; padding: 8px;
    }
    .logo-box img { width: 100%; height: 100%; object-fit: contain; }
    h2 { font-size: 20px; font-weight: 800; color: #064e3b; margin-bottom: 8px; }
    p { font-size: 13.5px; color: #047857; max-width: 320px; line-height: 1.5; margin-bottom: 22px; }
    .status-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: #ffffff; border: 1px solid #a7f3d0;
      padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #059669;
      margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .spinner {
      width: 14px; height: 14px; border: 2px solid #a7f3d0;
      border-top-color: #059669; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .btn-retry {
      background: linear-gradient(135deg, #059669, #047857);
      color: #ffffff; border: none; padding: 12px 28px;
      font-size: 14px; font-weight: 700; border-radius: 9999px;
      cursor: pointer; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
    }
  </style>
</head>
<body>
  <div class="logo-box">
    <img src="logo-vvflorielle-square.png" alt="V&V Florielle">
  </div>
  <h2>Tiệm Hoa Tươi V&V Florielle</h2>
  <p>Đang chờ kết nối Internet hoặc mạng chập chờn. Ứng dụng sẽ tự động kết nối lại ngay khi có sóng Wi-Fi/4G nha!</p>
  <div class="status-badge">
    <div class="spinner"></div>
    <span id="st">Đang kiểm tra kết nối...</span>
  </div>
  <div>
    <button class="btn-retry" onclick="reconnect()">Thử Kết Nối Lại</button>
  </div>
  <script>
    const TARGET = "https://vvflorielle.pages.dev";
    function reconnect() {
      document.getElementById("st").innerText = "Đang thử tải lại...";
      window.location.href = TARGET;
    }
    setInterval(async () => {
      try {
        const res = await fetch(TARGET, { mode: "no-cors", cache: "no-store" });
        window.location.href = TARGET;
      } catch (e) {}
    }, 4000);
  </script>
</body>
</html>
"""
    (assets_dir / "offline.html").write_text(offline_html, encoding="utf-8")
    print("  -> Prepared offline resilient assets.")


def compile_and_build_apk() -> None:
    build_dir = ANDROID_DIR / "build"
    build_dir.mkdir(parents=True, exist_ok=True)
    res_compiled = build_dir / "compiled_res.zip"
    gen_dir = build_dir / "gen"
    gen_dir.mkdir(parents=True, exist_ok=True)
    bin_dir = build_dir / "bin"
    bin_dir.mkdir(parents=True, exist_ok=True)

    res_dir = ANDROID_DIR / "src" / "main" / "res"
    manifest_path = ANDROID_DIR / "src" / "main" / "AndroidManifest.xml"
    assets_dir = ANDROID_DIR / "src" / "main" / "assets"

    # Step 1: AAPT2 compile
    print("[Step 1] AAPT2 compile resources...")
    cmd_compile = [
        str(AAPT2),
        "compile",
        "--dir", str(res_dir),
        "-o", str(res_compiled),
    ]
    subprocess.check_call(cmd_compile)

    # Step 2: AAPT2 link
    print("[Step 2] AAPT2 link...")
    unaligned_apk = bin_dir / "unaligned.apk"
    cmd_link = [
        str(AAPT2),
        "link",
        "-I", str(PLATFORM_JAR),
        "-A", str(assets_dir),
        "--manifest", str(manifest_path),
        "--java", str(gen_dir),
        "-o", str(unaligned_apk),
        "--auto-add-overlay",
        str(res_compiled),
    ]
    subprocess.check_call(cmd_link)

    # Step 3: Compile Java with javac
    print("[Step 3] Compiling Java classes with javac...")
    classes_dir = build_dir / "classes"
    classes_dir.mkdir(parents=True, exist_ok=True)

    java_sources = list((ANDROID_DIR / "src" / "main" / "java").rglob("*.java")) + list(gen_dir.rglob("*.java"))
    cmd_javac = [
        "javac",
        "-encoding", "utf-8",
        "-source", "1.8",
        "-target", "1.8",
        "-cp", str(PLATFORM_JAR),
        "-d", str(classes_dir),
    ] + [str(p) for p in java_sources]
    subprocess.check_call(cmd_javac)

    # Step 4: D8 convert .class to classes.dex
    print("[Step 4] D8 dexing classes...")
    class_files = [str(p) for p in classes_dir.rglob("*.class")]
    dex_output = build_dir / "dex"
    dex_output.mkdir(parents=True, exist_ok=True)
    cmd_d8 = [
        str(D8),
        "--output", str(dex_output),
        "--lib", str(PLATFORM_JAR),
    ] + class_files
    subprocess.check_call(cmd_d8, shell=True)

    # Step 5: Add classes.dex into unaligned.apk
    print("[Step 5] Adding classes.dex to APK...")
    dex_file = dex_output / "classes.dex"
    with zipfile.ZipFile(unaligned_apk, "a") as zf:
        zf.write(dex_file, "classes.dex")

    # Step 6: Zipalign APK
    print("[Step 6] Running zipalign...")
    aligned_apk = bin_dir / "aligned.apk"
    if aligned_apk.exists():
        aligned_apk.unlink()
    cmd_align = [
        str(ZIPALIGN),
        "-f",
        "4",
        str(unaligned_apk),
        str(aligned_apk),
    ]
    subprocess.check_call(cmd_align)

    # Step 7: Create release keystore if needed
    if not KEYSTORE_PATH.exists():
        print("[Step 7] Generating release keystore...")
        cmd_key = [
            "keytool",
            "-genkeypair",
            "-v",
            "-keystore", str(KEYSTORE_PATH),
            "-alias", KEY_ALIAS,
            "-keyalg", "RSA",
            "-keysize", "2048",
            "-validity", "10000",
            "-storepass", KEY_PASS,
            "-keypass", KEY_PASS,
            "-dname", "CN=VVFlorielle, OU=Florist, O=VVFlorielle, L=Hanoi, ST=Hanoi, C=VN",
        ]
        subprocess.check_call(cmd_key)

    # Step 8: Sign APK with apksigner
    print("[Step 8] Signing APK with apksigner...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    signed_apk = bin_dir / "signed.apk"
    if signed_apk.exists():
        signed_apk.unlink()

    cmd_sign = [
        str(APKSIGNER),
        "sign",
        "--ks", str(KEYSTORE_PATH),
        "--ks-key-alias", KEY_ALIAS,
        "--ks-pass", f"pass:{KEY_PASS}",
        "--key-pass", f"pass:{KEY_PASS}",
        "--out", str(signed_apk),
        str(aligned_apk),
    ]
    subprocess.check_call(cmd_sign, shell=True)

    # Copy signed apk to public destinations
    shutil.copy2(signed_apk, APK_OUTPUT)
    shutil.copy2(signed_apk, OUTPUT_DIR / "VVFlorielle.apk")
    shutil.copy2(signed_apk, build_dir / "VVFlorielle.apk")

    # Also copy to dist if dist exists
    dist_dir = PROJECT_ROOT / "dist"
    if dist_dir.exists():
        shutil.copy2(signed_apk, dist_dir / "VVFlorielle.apk")
        (dist_dir / "download").mkdir(parents=True, exist_ok=True)
        shutil.copy2(signed_apk, dist_dir / "download" / "VVFlorielle.apk")

    size_mb = APK_OUTPUT.stat().st_size / (1024 * 1024)
    print(f"\n[OK] Successfully built and signed V&V Florielle APK: '{APK_OUTPUT.name}' ({size_mb:.2f} MB)")
    print(f"  -> File available at: {APK_OUTPUT}")
    print(f"  -> File available at: {OUTPUT_DIR / 'VVFlorielle.apk'}")


if __name__ == "__main__":
    setup_project_structure()
    setup_mobile_assets()
    compile_and_build_apk()
