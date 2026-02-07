import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const frontendBuildDir = path.join(__dirname, '..', 'build');
const backendDir = path.join(__dirname, '..', '..', 'backend');
const backendFrontendDir = path.join(backendDir, 'ledfx_frontend');

console.log('\n🚀 Starting backend update process...\n');

try {
  // Check if backend directory exists
  if (!fs.existsSync(backendDir)) {
    console.error('❌ Backend directory not found:', backendDir);
    process.exit(1);
  }

  // Check if build directory exists
  if (!fs.existsSync(frontendBuildDir)) {
    console.error('❌ Frontend build directory not found:', frontendBuildDir);
    process.exit(1);
  }

  // Navigate to backend and run git commands
  process.chdir(backendDir);
  console.log('📁 Changed to backend directory:', backendDir);

  // Checkout main
  console.log('🔄 Checking out main branch...');
  execSync('git checkout main', { stdio: 'inherit' });

  // Pull latest
  console.log('⬇️  Pulling latest changes...');
  execSync('git pull', { stdio: 'inherit' });

  // Create new branch
  const branchName = 'new-frontend-' + Date.now();
  console.log(`🌿 Creating new branch: ${branchName}...`);
  try {
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
  } catch (error) {
    console.log(`⚠️  Branch ${branchName} might already exist, checking it out...`);
    execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
  }

  // Save frontend_config.json if it exists
  const frontendConfigPath = path.join(backendFrontendDir, 'frontend_config.json');
  let frontendConfig = null;
  if (fs.existsSync(frontendConfigPath)) {
    console.log('💾 Saving frontend_config.json...');
    frontendConfig = fs.readFileSync(frontendConfigPath);
  }

  // Delete all files in ledfx_frontend except frontend_config.json
  console.log('🗑️  Cleaning ledfx_frontend directory...');
  if (fs.existsSync(backendFrontendDir)) {
    const files = fs.readdirSync(backendFrontendDir);
    for (const file of files) {
      if (file !== 'frontend_config.json') {
        const filePath = path.join(backendFrontendDir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      }
    }
  } else {
    fs.mkdirSync(backendFrontendDir, { recursive: true });
  }

  // Copy all files from frontend/build to backend/ledfx_frontend (except frontend_config.json)
  console.log('📋 Copying build files to backend...');
  
  function copyRecursive(src, dest) {
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      // Skip frontend_config.json
      if (item === 'frontend_config.json') {
        continue;
      }
      
      if (fs.lstatSync(srcPath).isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  copyRecursive(frontendBuildDir, backendFrontendDir);

  // Restore frontend_config.json if it existed
  if (frontendConfig) {
    console.log('♻️  Restoring frontend_config.json...');
    fs.writeFileSync(frontendConfigPath, frontendConfig);
  }

  // Commit changes
  console.log('📝 Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "Update frontend build"', { stdio: 'inherit' });

  // Push to remote
  console.log('⬆️  Pushing to remote...');
  execSync(`git push origin ${branchName}`, { stdio: 'inherit' });

  console.log('\n✅ Backend update completed successfully!');
  console.log(`\n📝 Branch ${branchName} has been pushed to remote.`);

} catch (error) {
  console.error('\n❌ Error during backend update:', error.message);
  process.exit(1);
}
