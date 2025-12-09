# Setting up GitHub Actions for Android Releases

This guide explains how to configure GitHub Actions to automatically build and release your Android app.

## Prerequisites

Before setting up the workflow, ensure you have:

1. A GitHub repository with your project code
2. A properly configured Capacitor Android project
3. Access to set repository secrets

## Setting up Repository Secrets

To enable signing of your APK (recommended for production), you need to configure the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

### Required Secrets for Signed APKs

- `SIGNING_KEY`: Base64-encoded content of your keystore file
- `ALIAS`: The alias name in your keystore
- `KEY_STORE_PASSWORD`: Password for your keystore
- `KEY_PASSWORD`: Password for the specific key (often the same as keystore password)

### How to Generate a Signing Key

1. Run the helper script to generate a signing key:
   ```bash
   ./scripts/generate-signing-key.sh app-release-key.keystore my-key-alias
   ```

2. Encode your keystore file to base64:
   ```bash
   cat app-release-key.keystore | base64 -w 0
   ```

3. Copy the output and use it as the `SIGNING_KEY` secret value.

## Workflow Triggers

The workflow is triggered by:

1. **Push to main/master branches**: Automatically builds and creates a GitHub release
2. **Manual dispatch**: Allows you to trigger builds with different release types (alpha, beta, production)

## Release Types

When using manual dispatch, you can choose:

- `manual`: General manual build
- `alpha`: Alpha testing release (pre-release)
- `beta`: Beta testing release (pre-release)
- `production`: Production release

## Output Artifacts

The workflow produces:

1. APK file as a build artifact (available in Actions tab)
2. GitHub Release with the APK attached (for tagged releases)

## Customization

You can customize the workflow by editing `.github/workflows/android-release.yml` to:

- Change build types or flavors
- Add additional build steps
- Modify release conditions
- Add notification steps

## Troubleshooting

1. **Build fails with "Out of memory" error**:
   - Increase memory allocation by setting `JAVA_OPTS` environment variable

2. **Android SDK not found**:
   - The workflow should automatically install required SDK components

3. **Permission errors**:
   - Make sure Gradle wrapper scripts have execute permissions