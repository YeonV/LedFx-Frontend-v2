/**
 * Custom dev runner that catches Ctrl+C to properly clean up song detector
 * Run with --debug flag to see all logs: yarn dev --debug
 */

const { spawn, execSync } = require('child_process');

let tsc, electron, react;
let isShuttingDown = false;
const isDebugMode = process.argv.includes('--debug');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',           // [Main]
  yellow: '\x1b[33m',         // [TSC]
  green: '\x1b[92m',          // [Electron] - bright green
  red: '\x1b[31m',            // Errors only
  magenta: '\x1b[35m',        // [Browser]
  blue: '\x1b[34m',
  orange: '\x1b[38;5;208m'    // [React]
};

function log(prefix, color, message) {
  const timestamp = new Date().toLocaleTimeString();
  const paddedPrefix = `[${prefix}]`.padEnd(10); // Pad AFTER brackets to 10 chars total
  console.log(`${color}${paddedPrefix}${colors.reset} ${colors.dim}${timestamp}${colors.reset} ${message}`);
}

function startReactDevServer() {
  log('React', colors.orange, 'Starting React dev server...');
  
  react = spawn('yarn', ['start'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, BROWSER: 'none' }
  });

  react.on('error', (err) => {
    log('React', colors.red, `Error: ${err.message}`);
  });

  react.on('exit', (code, signal) => {
    if (!isShuttingDown) {
      log('React', colors.red, `Exited unexpectedly (code: ${code}, signal: ${signal})`);
      process.exit(1);
    }
  });
}

function startTypeScriptCompiler() {
  log('TSC', colors.yellow, 'Starting TypeScript compiler in watch mode...');
  
  tsc = spawn('npx', ['tsc', '--project', 'tsconfig.electron.json', '--watch'], {
    stdio: 'inherit',
    shell: true
  });

  tsc.on('error', (err) => {
    log('TSC', colors.red, `Error: ${err.message}`);
  });

  tsc.on('exit', (code, signal) => {
    if (!isShuttingDown) {
      log('TSC', colors.red, `Exited unexpectedly (code: ${code}, signal: ${signal})`);
    }
  });
}

function startElectron() {
  log('Electron', colors.green, 'Waiting for public/electron.js...');
  
  electron = spawn('npx', ['wait-on', 'public/electron.js'], {
    stdio: 'inherit',
    shell: true
  });

  electron.on('exit', () => {
    if (isShuttingDown) return;
    
    log('Electron', colors.green, 'Starting Electron...');
    
    electron = spawn('electron', ['.'], {
      stdio: isDebugMode ? 'inherit' : ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: { ...process.env, ELECTRON_ENABLE_LOGGING: isDebugMode ? '1' : '0' }
    });

    // Filter noisy output when not in debug mode
    if (!isDebugMode) {
      const filterNoisyLogs = (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) return;
          
          // Skip extension-related warnings
          if (line.includes('INFO:CONSOLE') || 
              line.includes('chrome-extension://') ||
              line.includes('Message from tab') ||
              line.includes('session.loadExtension') ||
              line.includes('ExtensionLoadWarning') ||
              line.includes('differential_fingerprint') ||
              line.includes("Permission 'notifications' is unknown") ||
              line.includes("Permission 'contextMenus' is unknown") ||
              line.includes('electron --trace-warnings') ||
              line.includes(':INFO:electron')) {
            return;
          }
          
          // Skip CSP security warnings (full and partial lines)
          if (line.includes('unsafe-eval') ||
              line.includes('exposes users of this app to') ||
              line.includes('For more information and help, consult') ||
              line.includes('electronjs.org/docs/tutorial/security') ||
              line.includes('This warning will not show up') ||
              line.includes('once the app is packaged') ||
              line.includes('to unnecessary security risks') ||
              line.includes('to severe security risks')) {
            return;
          }
          
          // Skip Electron extension API warnings
          if (line.includes('chrome.action.show is not supported') ||
              line.includes('chrome.action.setIcon is not supported')) {
            return;
          }
          
          // Skip Electron sandbox errors
          if (line.includes('ERROR:CONSOLE') && 
              (line.includes('sandboxed_renderer') || 
               line.includes('Autofill.enable') ||
               line.includes('Autofill.setAddresses'))) {
            return;
          }
          
          // Check if line already has a colored prefix from Electron main process
          // (these contain ANSI codes so we check with includes)
          if (line.includes('[Core]') ||
              line.includes('[Handler]') ||
              line.includes('[Detector]') ||
              line.includes('[Startup]')) {
            // Already has a color prefix - show as-is
            console.log(line);
          } else if (line.includes('source: http://localhost:') || 
                     line.includes('source: devtools://') ||
                     line.includes('source: node:electron') ||
                     line.includes('source: chrome')) {
            // Renderer console logs (from browser) - add [Browser] prefix
            console.log(`${colors.magenta}[Browser]  ${colors.reset}${trimmed}`);
          } else {
            // Main process logs - add [Main] prefix
            console.log(`${colors.cyan}[Main]     ${colors.reset}${trimmed}`);
          }
        });
      };

      if (electron.stdout) electron.stdout.on('data', filterNoisyLogs);
      if (electron.stderr) electron.stderr.on('data', filterNoisyLogs);
    }

    electron.on('error', (err) => {
      log('Electron', colors.red, `Error: ${err.message}`);
    });

    electron.on('exit', (code, signal) => {
      if (!isShuttingDown) {
        log('Electron', colors.red, `Exited unexpectedly (code: ${code}, signal: ${signal})`);
        shutdown();
      }
    });
  });
}

async function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('\n' + colors.bright + colors.magenta + '🛑 Ctrl+C caught! Killing all processes...' + colors.reset);

  // FIRST: Kill song detector by name to catch all instances
  log('Cleanup', colors.red, 'Killing song detectors by name...');
  try {
    execSync('taskkill /IM song-detector.exe /F /T < nul', { stdio: 'ignore', shell: true });
    log('Cleanup', colors.green, 'Killed song-detector.exe');
  } catch {}
  try {
    execSync('taskkill /IM song-detector-plus.exe /F /T < nul', { stdio: 'ignore', shell: true });
    log('Cleanup', colors.green, 'Killed song-detector-plus.exe');
  } catch {}
  
  // THEN: Kill Electron
  if (electron && !electron.killed) {
    log('Electron', colors.red, 'Killing Electron...');
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${electron.pid} /T /F < nul`, { stdio: 'ignore', shell: true });
      } else {
        electron.kill('SIGKILL');
      }
    } catch {}
  }

  // Kill React dev server
  if (react && !react.killed) {
    log('React', colors.orange, 'Killing React dev server...');
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${react.pid} /T /F < nul`, { stdio: 'ignore', shell: true });
      } else {
        react.kill('SIGKILL');
      }
    } catch {}
  }

  // Kill TypeScript compiler
  if (tsc && !tsc.killed) {
    log('TSC', colors.yellow, 'Killing TypeScript compiler...');
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${tsc.pid} /T /F < nul`, { stdio: 'ignore', shell: true });
      } else {
        tsc.kill('SIGKILL');
      }
    } catch {}
  }

  log('Dev', colors.green, 'All processes killed. Goodbye! 👋');
  
  // Force exit immediately - use setTimeout to ensure log displays
  setTimeout(() => {
    process.exit(0);
  }, 100);
}

// THE KEY: Catch Ctrl+C (SIGINT)
process.on('SIGINT', () => {
  console.log(); // New line for cleaner output
  shutdown();
});

// Also catch SIGTERM for good measure
process.on('SIGTERM', shutdown);

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error(colors.red + '💥 Uncaught exception:' + colors.reset, err);
  shutdown();
});

// Start everything
async function start() {
  console.log(colors.bright + colors.cyan + '🚀 LedFx Development Server' + colors.reset);
  if (isDebugMode) {
    console.log(colors.yellow + '🐛 Debug mode enabled - showing all logs' + colors.reset);
  }
  console.log(colors.dim + 'Press Ctrl+C to exit with proper cleanup\n' + colors.reset);

  // Step 1: Start React dev server first
  startReactDevServer();
  
  // Step 2: Wait for React to be ready
  log('Wait', colors.magenta, 'Waiting for React dev server on http://127.0.0.1:3000...');
  const waitOn = spawn('npx', ['wait-on', 'http://127.0.0.1:3000'], {
    stdio: 'inherit',
    shell: true
  });

  await new Promise((resolve) => {
    waitOn.on('exit', resolve);
  });

  log('Wait', colors.green, 'React dev server is ready!');

  // Step 3: Start TypeScript compiler
  startTypeScriptCompiler();
  
  // Step 4: Wait a bit for initial compilation, then start Electron
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  startElectron();
}

start().catch((err) => {
  console.error(colors.red + '💥 Failed to start:' + colors.reset, err);
  process.exit(1);
});
