# File Transfer App with Capacitor

This project is a web-based file transfer application that can be built as an Android APK using Capacitor.

## Capacitor Setup

The project has been configured with Capacitor to allow building native mobile applications from the web code.

### Installed Capacitor Modules

- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/cli` - Command line interface for Capacitor
- `@capacitor/android` - Android platform support
- `@capacitor/app` - App management features
- `@capacitor/device` - Device information access
- `@capacitor/filesystem` - File system operations
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/keyboard` - Keyboard management
- `@capacitor/status-bar` - Status bar control

## Building for Android

### Prerequisites

To build an Android APK, you need to have:

- Android Studio installed with Android SDK, Android SDK Platform-Tools, and Android SDK Build-Tools
- Java Development Kit (JDK) 17 or higher

### Steps to Build APK

1. First, make sure your project is clean by removing any old builds:
   ```bash
   rm -rf dist
   ```

2. Build the web assets:
   ```bash
   npm run build
   ```

3. Sync the web assets to Android:
   ```bash
   npx cap sync android
   ```

4. To build the APK, use the following command:
   ```bash
   npm run android:build
   ```

   Or manually navigate to the Android directory and build:
   ```bash
   cd android && ./gradlew assembleRelease
   ```

5. Find your APK at `android/app/build/outputs/apk/release/app-release.aab` or `app-release.apk`

## Using Android Studio

Alternatively, you can open the `android` folder in Android Studio to build and sign the APK:

1. Open Android Studio
2. Select "Open an existing project"
3. Navigate to and select the `android` folder in this project
4. Use Android Studio's build system to generate the APK

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build web assets
- `npm run preview` - Preview production build
- `npm run cap:sync` - Sync web assets to native projects
- `npm run android:build` - Build Android APK (requires Android Studio tools)