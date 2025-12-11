const { notarize } = require('@electron/notarize');

const appleApiKeyId = process.env.APPLE_API_KEY;
const appleApiIssuer = process.env.APPLE_API_ISSUER;
const appleApiKeyPath = process.env.APPLE_API_KEY_PATH;

if (!appleApiKeyId || !appleApiIssuer || !appleApiKeyPath) {
  console.error('Missing environment variables!');
  console.error('Need: APPLE_API_KEY, APPLE_API_ISSUER, APPLE_API_KEY_PATH');
  process.exit(1);
}

const appPath = './dist/mac-arm64/LedFx CC.app';

console.log(`Notarizing ${appPath}...`);
console.log(`Using Apple API Key ID: ${appleApiKeyId}`);

notarize({
  tool: 'notarytool',
  appPath: appPath,
  appleApiKeyId: appleApiKeyId,
  appleApiIssuer: appleApiIssuer,
  appleApiKey: appleApiKeyPath,
})
.then(() => {
  console.log('✅ Notarization complete!');
})
.catch((error) => {
  console.error('❌ Notarization failed:', error);
  process.exit(1);
});
