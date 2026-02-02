const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  
  // Only notarize on macOS
  if (electronPlatformName !== 'darwin') {
    console.log('Skipping notarization (not macOS)');
    return;
  }

  // Check if we have the required environment variables
  const appleApiKeyId = process.env.APPLE_API_KEY || process.env.APPLE_API_KEY_ID;
  const appleApiIssuer = process.env.APPLE_API_ISSUER;
  const appleApiKeyPath = process.env.APPLE_API_KEY_PATH;

  if (!appleApiKeyId || !appleApiIssuer || !appleApiKeyPath) {
    console.log('Skipping notarization: Missing APPLE_API_KEY/APPLE_API_KEY_ID, APPLE_API_ISSUER, or APPLE_API_KEY_PATH environment variables');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`Notarizing ${appPath}...`);
  console.log(`Using Apple API Key ID: ${appleApiKeyId}`);
  console.log(`Using Apple API Key Path: ${appleApiKeyPath}`);
  console.log(`Using Apple API Issuer: ${appleApiIssuer}`);
  
  console.log('DEBUG: Environment variables:');
  console.log('  APPLE_API_KEY:', process.env.APPLE_API_KEY);
  console.log('  APPLE_API_KEY_ID:', process.env.APPLE_API_KEY_ID);
  console.log('  APPLE_API_KEY_PATH:', process.env.APPLE_API_KEY_PATH);
  console.log('  APPLE_API_ISSUER:', process.env.APPLE_API_ISSUER);

  try {
    await notarize({
      tool: 'notarytool',
      appPath: appPath,
      appleApiKey: appleApiKeyPath,
      appleApiKeyId: appleApiKeyId,
      appleApiIssuer: appleApiIssuer,
    });
    console.log('Notarization complete!');
  } catch (error) {
    console.error('Notarization failed:', error);
    throw error;
  }
};
