#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('\n=================================================================');
console.log('🔐 Mac Code Signing Environment Check');
console.log('=================================================================\n');

// Helper to expand tilde in paths
function expandPath(filePath) {
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

// Try to load .env file if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('📁 Found .env file, attempting to load...');
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=["']?([^"']+)["']?$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key]) {
        process.env[key] = value;
        console.log(`   ✅ Loaded ${key} from .env`);
      }
    }
  });
  console.log('');
}

// Check for certificate identity
const codesignIdentity = process.env.CODESIGN_IDENTITY || process.env.CSC_NAME;
console.log('📝 CODESIGN_IDENTITY:', codesignIdentity || '⚠️  NOT SET (will use fallback)');
console.log('📝 CSC_NAME:', process.env.CSC_NAME || '⚠️  NOT SET');

// Check Apple API credentials
console.log('\n--- Notarization Credentials ---');
console.log('📝 APPLE_API_KEY:', process.env.APPLE_API_KEY || '⚠️  NOT SET');
console.log('📝 APPLE_API_ISSUER:', process.env.APPLE_API_ISSUER || '⚠️  NOT SET');
console.log('📝 APPLE_API_KEY_PATH:', process.env.APPLE_API_KEY_PATH || '⚠️  NOT SET');

// Check if Apple API key file exists
if (process.env.APPLE_API_KEY_PATH) {
  const keyPath = expandPath(process.env.APPLE_API_KEY_PATH);
  if (fs.existsSync(keyPath)) {
    console.log('   ✅ API key file exists at:', keyPath);
  } else {
    console.log('   ❌ API key file NOT FOUND at:', keyPath);
  }
}

// List available code signing identities
console.log('\n--- Available Code Signing Identities ---');
try {
  const identities = execSync('security find-identity -v -p codesigning', { encoding: 'utf8' });
  console.log(identities);
} catch (error) {
  console.log('❌ Error listing identities:', error.message);
}

// Check which identity would be used
console.log('--- Identity Resolution ---');
const identityToUse = codesignIdentity || 'CEE631E9774D506963ECC20D6BFA8213FB07B2B1';
console.log('🎯 Will use identity:', identityToUse);

// Check entitlements files
console.log('\n--- Entitlements Files ---');
const entitlementsFiles = [
  'entitlements.mac.plist',
  'entitlements.mac.inherit.plist',
  'entitlements.mac.core.plist'
];

let missingEntitlements = false;
entitlementsFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} NOT FOUND`);
    missingEntitlements = true;
  }
});

// Check extraResources/LedFx.app
console.log('\n--- Extra Resources ---');
const ledfxAppPath = path.join(process.cwd(), 'extraResources', 'LedFx.app');
if (fs.existsSync(ledfxAppPath)) {
  console.log(`✅ extraResources/LedFx.app exists`);
  
  // Check if it's already signed
  try {
    const signInfo = execSync(`codesign -dv "${ledfxAppPath}" 2>&1`, { encoding: 'utf8' });
    console.log('   Current signature info:');
    signInfo.split('\n').forEach(line => {
      if (line.includes('Authority=') || line.includes('Identifier=') || line.includes('TeamIdentifier=')) {
        console.log('   ', line.trim());
      }
    });
  } catch (error) {
    console.log('   ⚠️  Not currently signed or signature check failed');
  }
} else {
  console.log(`⚠️  extraResources/LedFx.app NOT FOUND (will be created during build)`);
}

console.log('\n=================================================================');
console.log('✅ Pre-flight Check Complete');
console.log('=================================================================\n');

if (missingEntitlements) {
  console.log('❌ Critical: Missing entitlements files');
  process.exit(1);
}

console.log('✅ Ready to build');
process.exit(0);
