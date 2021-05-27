# LedFx reVamped

![state](https://img.shields.io/badge/STATE-alpha-blue.svg?logo=github&logoColor=white) ![version](https://img.shields.io/github/v/release/YeonV/LedFx-Frontend-v2?label=VERSION&logo=git&logoColor=white) [![creator](https://img.shields.io/badge/CREATOR-Yeon-blue.svg?logo=github&logoColor=white)](https://github.com/YeonV) [![creator](https://img.shields.io/badge/A.K.A-Blade-darkred.svg?logo=github&logoColor=white)](https://github.com/YeonV)

---

![logo192](https://user-images.githubusercontent.com/28861537/119760144-c5126680-bea9-11eb-991a-c08eedbc5929.png)

New [LedFx](https://github.com/LedFx/LedFx)-client for devs & bros only

---

## Features

- complete rewrite:
  - Modern React
    - no class-components
    - new structure
    - hooks
  - Zustand as State-Management
  - Mobile first
  - Dev-Friendly
- Connect to any LedFx-Instance (changeable host-ip)
- More Navigation
  - Left Drawer
  - Bottom Bar
  - Top Bar - Menu

## App structure

- assets _(fonts, images,...)_
- components _(global components)_
- pages
  - file _(page)_
  - folder: _(page + components)_
- utils
  - apiStore _(AppStore + Communication with LedFx-Core)_

## Rules

- NO class components!
  - _functional components + hooks_
- NO index.js
  - _use a proper name_
  - _adjust imports_

<details>
<summary>Notes</summary>
<p>
Keep it simple, nice (and then clean). Sanity is more important than clean-code:
We don't want to chain-open 20 files to traceback whats happening.
If you have 3 lines of styles, you can keep it in the component, there is not a MUST to splitcode everything. If feel its getting bigger and taking too much space, please keep a sane naming when splitting, i.e: `Blade.js` -> `Blade.styles.js`
</p>
</details>

---

## Screens

<details>
<summary>show</summary>
<p>

![image](https://user-images.githubusercontent.com/28861537/119760584-8e891b80-beaa-11eb-8ee9-f53217150467.png)

![image](https://user-images.githubusercontent.com/28861537/119760472-5b468c80-beaa-11eb-8928-5964457b7de1.png)

</p>
</details>

---

## Credits

[![ledfx-github](https://img.shields.io/badge/Github-LedFx-blue.svg?logo=github&logoColor=white)](https://github.com/LedFx/LedFx/tree/dev/ledfx) [![ledfx-discord](https://img.shields.io/badge/Discord-LedFx-blue.svg?logo=discord&logoColor=white)](https://discord.gg/wJ755dY)

<details>
<summary> Create React App</summary>
<p>

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

</p>
</details>
