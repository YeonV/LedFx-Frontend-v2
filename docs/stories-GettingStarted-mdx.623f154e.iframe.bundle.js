(self.webpackChunkledfx=self.webpackChunkledfx||[]).push([[626],{"./node_modules/@mdx-js/react/lib/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{R:()=>useMDXComponents,x:()=>MDXProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const emptyComponents={},MDXContext=react__WEBPACK_IMPORTED_MODULE_0__.createContext(emptyComponents);function useMDXComponents(components){const contextComponents=react__WEBPACK_IMPORTED_MODULE_0__.useContext(MDXContext);return react__WEBPACK_IMPORTED_MODULE_0__.useMemo((function(){return"function"==typeof components?components(contextComponents):{...contextComponents,...components}}),[contextComponents,components])}function MDXProvider(properties){let allComponents;return allComponents=properties.disableParentContext?"function"==typeof properties.components?properties.components(emptyComponents):properties.components||emptyComponents:useMDXComponents(properties.components),react__WEBPACK_IMPORTED_MODULE_0__.createElement(MDXContext.Provider,{value:allComponents},properties.children)}},"./src/stories/GettingStarted.mdx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>MDXContent});__webpack_require__("./node_modules/react/index.js");var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@mdx-js/react/lib/index.js"),_storybook_blocks__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@storybook/blocks/dist/index.mjs");function _createMdxContent(props){const _components={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_2__.R)(),...props.components};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_storybook_blocks__WEBPACK_IMPORTED_MODULE_3__.W8,{title:"BladeBook/Getting Started"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("style",{children:"\n    .sbdocs table tr:nth-child(2n){ background-color: unset }\n  "}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h3,{id:"welcome-to-blades-storybook",children:"Welcome to Blade's Storybook"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h1,{id:"frontend-development-for-ledfx",children:"Frontend Development for LedFx"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"This is a growing place for supporting the frontend development of LedFx"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"requirements",children:"Requirements"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.ul,{children:["\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li,{children:"Running LedFx Core"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.li,{children:"Node >= 14"}),"\n"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.h2,{id:"getting-started",children:"Getting started"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"yarn"})," is recommended, but you can use ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"npm"})," aswell"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{className:"language-bash",children:"git clone https://github.com/YeonV/LedFx-Frontend-v2\ncd LedFx-Frontend-v2\nyarn # npm install\nyarn start # npm run start\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:"When working with VsCode, you can make use of tasks:"}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.pre,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{className:"language-bash",children:"git clone https://github.com/YeonV/LedFx-Frontend-v2\ncd LedFx-Frontend-v2\ncode .\n"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"CTRL"}),"+",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"SHIFT"}),"+",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.code,{children:"P"})," -> Run Task",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("br",{}),"\n-> Init Workspace (this does the yarn install)",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("br",{}),"\n-> Start Frontend (yarn start)"]}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.p,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"/story/bladebook-app-structure--page",children:"App Structure"})}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.hr,{}),"\n",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_components.p,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img,{src:"https://img.shields.io/badge/STATE-beta-blue.svg?logo=github&logoColor=white",alt:"state"})," ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img,{src:"https://img.shields.io/github/v/release/YeonV/LedFx-Frontend-v2?label=VERSION&logo=git&logoColor=white",alt:"version"})," ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"https://github.com/YeonV",rel:"nofollow",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img,{src:"https://img.shields.io/badge/CREATOR-Yeon-blue.svg?logo=github&logoColor=white",alt:"creator"})})," ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.a,{href:"https://github.com/YeonV",rel:"nofollow",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_components.img,{src:"https://img.shields.io/badge/A.K.A-Blade-darkred.svg?logo=github&logoColor=white",alt:"creator"})})]})]})}function MDXContent(props={}){const{wrapper:MDXLayout}={...(0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_storybook_addon_docs_dist_shims_mdx_react_shim_mjs__WEBPACK_IMPORTED_MODULE_2__.R)(),...props.components};return MDXLayout?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(MDXLayout,{...props,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_createMdxContent,{...props})}):_createMdxContent(props)}},"./node_modules/@storybook/blocks/dist sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/blocks/dist sync recursive",module.exports=webpackEmptyContext},"./node_modules/@storybook/core/dist/components sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/core/dist/components sync recursive",module.exports=webpackEmptyContext},"./node_modules/@storybook/core/dist/theming sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/core/dist/theming sync recursive",module.exports=webpackEmptyContext}}]);