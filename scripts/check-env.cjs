const http = require('http');

const BACKEND_URL = 'http://localhost:8888/api/info';
const FRONTEND_URL = 'http://localhost:3000/manifest.json';

async function checkUrl(url, expectedName, serviceName) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.name === expectedName) {
            console.log(`✅ ${serviceName} is running and reachable.`);
            resolve(true);
          } else {
            console.log(`⚠️ ${serviceName} responded but name "${json.name}" does not match expected "${expectedName}".`);
            resolve(false);
          }
        } catch (e) {
          console.log(`❌ ${serviceName} returned invalid JSON.`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${serviceName} is NOT reachable at ${url}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🔍 Checking LedFx environment...\n');

  const backendOk = await checkUrl(BACKEND_URL, 'LedFx', 'Backend');
  const frontendOk = await checkUrl(FRONTEND_URL, 'Blade', 'Frontend');

  console.log('');

  if (backendOk && frontendOk) {
    console.log('🚀 Environment is ready for Playwright tests!');
  } else {
    console.log('❌ Environment is NOT ready.');
    console.log('\n--- HOW TO FIX ---');

    if (!backendOk) {
      console.log('\n[Backend]');
      console.log('1. Ensure you have the LedFx backend repository cloned.');
      console.log('2. Run: uv run ledfx --offline -vv');
      console.log('   (See .ai-rules.md for more details)');
    }

    if (!frontendOk) {
      console.log('\n[Frontend]');
      console.log('1. Run: yarn start');
      console.log('   (This will start the React dev server on port 3000)');
    }

    console.log('\nFor more details, check .ai-rules.md');
    process.exit(1);
  }
}

main();
