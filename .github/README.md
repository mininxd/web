# GitHub Actions for Android Release

This project uses GitHub Actions to automatically build and release the Android app.

## Workflow Details

The workflow is defined in `.github/workflows/android-release.yml` and includes:

- Automatic build on push to main/master branches
- Manual dispatch option with different release types (alpha, beta, production)
- APK building and signing
- GitHub release creation

## Required Secrets

To enable APK signing, add these secrets to your repository:

- `SIGNING_KEY`: Base64-encoded keystore file content
- `ALIAS`: Keystore alias
- `KEY_STORE_PASSWORD`: Keystore password
- `KEY_PASSWORD`: Key password

## Manual Release Types

When using the workflow dispatch, you can choose from:

- `manual`: General manual build
- `alpha`: Alpha release (pre-release)
- `beta`: Beta release (pre-release) 
- `production`: Production release (full release)

To access the workflow dispatch, go to the "Actions" tab in your GitHub repository and select "Build and Release Android App".