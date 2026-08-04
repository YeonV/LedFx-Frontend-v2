/// <reference types="react-scripts" />

// CRA's react-app.d.ts declares *.module.css but not plain *.css, because
// TypeScript used to ignore side-effect imports it could not resolve. Editors
// on TS >= 5.6 enable noUncheckedSideEffectImports and flag every `import
// './x.css'` instead (TS2882/TS2307).
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
