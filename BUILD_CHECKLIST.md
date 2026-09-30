# Final Build Prep Checklist

- [x] **Remove Console Logs**: Use \`babel-plugin-transform-remove-console\` or override \`console.log\` in production.
- [x] **Verify Permissions**: Review \`app.json\` iOS and Android permission strings (Camera, Photos).
- [x] **Web Build**: Run \`npx expo export --platform web\` for static HTML/JS export.
- [x] **Native Build**: Use \`eas build --platform all\` to build APK/AAB and IPA in the cloud. No local Android Studio needed.
- [x] **Bundle Size**: Audit heavy libraries. Ensure \`react-native-reanimated\` is necessary.
- [x] **Expo Doctor**: Run \`npx expo-doctor\` to fix misaligned versions.
- [x] **Env Variables**: Make sure production \`EXPO_PUBLIC_API_URL\` points to the deployed backend URL, not localhost.
