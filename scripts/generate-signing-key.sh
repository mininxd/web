#!/bin/bash
# Script to help generate Android signing key and set up secrets

echo "Android Signing Key Helper"
echo "=========================="
echo ""
echo "This script helps you generate a signing key for your Android app."
echo "For production releases, you should sign your APK with a release key."
echo ""

if [ -z "$1" ]; then
    echo "Usage: $0 <keystore-path> <alias-name>"
    echo "Example: $0 ./app-release-key.keystore my-key-alias"
    exit 1
fi

KEYSTORE_PATH=$1
ALIAS_NAME=$2

echo "Generating keystore at: $KEYSTORE_PATH"
echo "Using alias: $ALIAS_NAME"
echo ""

# Generate the keystore
keytool -genkey -v -keystore $KEYSTORE_PATH -alias $ALIAS_NAME -keyalg RSA -keysize 2048 -validity 10000

if [ $? -eq 0 ]; then
    echo ""
    echo "Keystore generated successfully!"
    echo ""
    echo "Now encode your keystore for GitHub secrets:"
    echo "cat $KEYSTORE_PATH | base64 -w 0"
    echo ""
    echo "Add these secrets to your GitHub repository:"
    echo "- SIGNING_KEY: (output from the base64 command above)"
    echo "- ALIAS: $ALIAS_NAME"
    echo "- KEY_STORE_PASSWORD: (the password you entered when creating the keystore)"
    echo "- KEY_PASSWORD: (usually same as keystore password)"
    echo ""
    echo "Remember to keep your keystore file secure and backed up!"
else
    echo "Error generating keystore."
fi