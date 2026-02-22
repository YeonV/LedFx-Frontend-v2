# 🎭 Playwright Testing Guide

This directory contains end-to-end tests for the LedFx Frontend.

## 🛠 Preparation

Before running tests, you must ensure that both the Backend and Frontend are running.

### 1. Verify Environment

Run the following command to check if services are reachable:

```bash
yarn check-env
```

If any service is missing, follow the instructions printed by the script or refer to `.ai-rules.md`.

## 🚀 Running Tests

### Run all tests

```bash
yarn test:pw
```

### Run a specific test

```bash
npx playwright test tests/initial-load.spec.ts
```

### Debug with UI

```bash
npx playwright test --ui
```

## 🎥 Recording & Animated Media

Tests are configured to record video on failure or when specifically requested.

### Generate Animated WebP from Videos

After running tests, you can convert captured `.webm` videos to animated `.webp` for easy sharing:

```bash
yarn test:video-to-webp
```

The output files will be located alongside the original videos in the `test-results/` directory.

## 📝 Writing New Tests

- Files should end in `.spec.ts`.
- Use the `clearDialogs` utility pattern (see `tests/initial-load.spec.ts`) to handle the initial "Connect" and "Skip" (Setup Assistant) dialogs.
- Captured screenshots and videos are stored in `test-results/`.

## 🧠 Key Findings

- **Host Selection:** If the backend is not remembered, a "Connect" dialog appears.
- **Setup Assistant:** On first load, an "Intro" dialog appears. Use the "Skip" button to bypass it in tests.
- **Visualiser:** Requires "Expert Mode", "Beta Mode", and "Background Visualiser" to be enabled in Settings.
