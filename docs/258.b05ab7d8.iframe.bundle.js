"use strict";(self.webpackChunkledfx=self.webpackChunkledfx||[]).push([[258],{"./node_modules/@mui/icons-material/esm/Check.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _utils_createSvgIcon__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/material/utils/createSvgIcon.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,_utils_createSvgIcon__WEBPACK_IMPORTED_MODULE_1__.A)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path",{d:"M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"}),"Check")},"./node_modules/@mui/icons-material/esm/Close.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _utils_createSvgIcon__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/material/utils/createSvgIcon.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,_utils_createSvgIcon__WEBPACK_IMPORTED_MODULE_1__.A)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close")},"./node_modules/@mui/icons-material/esm/Delete.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _utils_createSvgIcon__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/material/utils/createSvgIcon.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__=(0,_utils_createSvgIcon__WEBPACK_IMPORTED_MODULE_1__.A)((0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"}),"Delete")},"./node_modules/@mui/material/Fab/Fab.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>Fab_Fab});var react=__webpack_require__("./node_modules/react/index.js"),clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),composeClasses=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),ButtonBase=__webpack_require__("./node_modules/@mui/material/ButtonBase/ButtonBase.js"),capitalize=__webpack_require__("./node_modules/@mui/material/utils/capitalize.js"),generateUtilityClasses=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js"),generateUtilityClass=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js");function getFabUtilityClass(slot){return(0,generateUtilityClass.Ay)("MuiFab",slot)}const Fab_fabClasses=(0,generateUtilityClasses.A)("MuiFab",["root","primary","secondary","extended","circular","focusVisible","disabled","colorInherit","sizeSmall","sizeMedium","sizeLarge","info","error","warning","success"]);var rootShouldForwardProp=__webpack_require__("./node_modules/@mui/material/styles/rootShouldForwardProp.js"),styled=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),memoTheme=__webpack_require__("./node_modules/@mui/material/utils/memoTheme.js"),createSimplePaletteValueFilter=__webpack_require__("./node_modules/@mui/material/utils/createSimplePaletteValueFilter.js"),DefaultPropsProvider=__webpack_require__("./node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const FabRoot=(0,styled.Ay)(ButtonBase.A,{name:"MuiFab",slot:"Root",shouldForwardProp:prop=>(0,rootShouldForwardProp.A)(prop)||"classes"===prop,overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,styles[ownerState.variant],styles[`size${(0,capitalize.A)(ownerState.size)}`],"inherit"===ownerState.color&&styles.colorInherit,styles[(0,capitalize.A)(ownerState.size)],styles[ownerState.color]]}})((0,memoTheme.A)((({theme})=>({...theme.typography.button,minHeight:36,transition:theme.transitions.create(["background-color","box-shadow","border-color"],{duration:theme.transitions.duration.short}),borderRadius:"50%",padding:0,minWidth:0,width:56,height:56,zIndex:(theme.vars||theme).zIndex.fab,boxShadow:(theme.vars||theme).shadows[6],"&:active":{boxShadow:(theme.vars||theme).shadows[12]},color:theme.vars?theme.vars.palette.text.primary:theme.palette.getContrastText?.(theme.palette.grey[300]),backgroundColor:(theme.vars||theme).palette.grey[300],"&:hover":{backgroundColor:(theme.vars||theme).palette.grey.A100,"@media (hover: none)":{backgroundColor:(theme.vars||theme).palette.grey[300]},textDecoration:"none"},[`&.${Fab_fabClasses.focusVisible}`]:{boxShadow:(theme.vars||theme).shadows[6]},variants:[{props:{size:"small"},style:{width:40,height:40}},{props:{size:"medium"},style:{width:48,height:48}},{props:{variant:"extended"},style:{borderRadius:24,padding:"0 16px",width:"auto",minHeight:"auto",minWidth:48,height:48}},{props:{variant:"extended",size:"small"},style:{width:"auto",padding:"0 8px",borderRadius:17,minWidth:34,height:34}},{props:{variant:"extended",size:"medium"},style:{width:"auto",padding:"0 16px",borderRadius:20,minWidth:40,height:40}},{props:{color:"inherit"},style:{color:"inherit"}}]}))),(0,memoTheme.A)((({theme})=>({variants:[...Object.entries(theme.palette).filter((0,createSimplePaletteValueFilter.A)(["dark","contrastText"])).map((([color])=>({props:{color},style:{color:(theme.vars||theme).palette[color].contrastText,backgroundColor:(theme.vars||theme).palette[color].main,"&:hover":{backgroundColor:(theme.vars||theme).palette[color].dark,"@media (hover: none)":{backgroundColor:(theme.vars||theme).palette[color].main}}}})))]}))),(0,memoTheme.A)((({theme})=>({[`&.${Fab_fabClasses.disabled}`]:{color:(theme.vars||theme).palette.action.disabled,boxShadow:(theme.vars||theme).shadows[0],backgroundColor:(theme.vars||theme).palette.action.disabledBackground}})))),Fab_Fab=react.forwardRef((function Fab(inProps,ref){const props=(0,DefaultPropsProvider.b)({props:inProps,name:"MuiFab"}),{children,className,color="default",component="button",disabled=!1,disableFocusRipple=!1,focusVisibleClassName,size="large",variant="circular",...other}=props,ownerState={...props,color,component,disabled,disableFocusRipple,size,variant},classes=(ownerState=>{const{color,variant,classes,size}=ownerState,slots={root:["root",variant,`size${(0,capitalize.A)(size)}`,"inherit"===color?"colorInherit":color]},composedClasses=(0,composeClasses.A)(slots,getFabUtilityClass,classes);return{...classes,...composedClasses}})(ownerState);return(0,jsx_runtime.jsx)(FabRoot,{className:(0,clsx.A)(classes.root,className),component,disabled,focusRipple:!disableFocusRipple,focusVisibleClassName:(0,clsx.A)(classes.focusVisible,focusVisibleClassName),ownerState,ref,...other,classes,children})}))},"./node_modules/@mui/material/IconButton/IconButton.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>IconButton_IconButton});var react=__webpack_require__("./node_modules/react/index.js"),clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),composeClasses=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),colorManipulator=__webpack_require__("./node_modules/@mui/system/esm/colorManipulator/colorManipulator.js"),styled=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),memoTheme=__webpack_require__("./node_modules/@mui/material/utils/memoTheme.js"),createSimplePaletteValueFilter=__webpack_require__("./node_modules/@mui/material/utils/createSimplePaletteValueFilter.js"),DefaultPropsProvider=__webpack_require__("./node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js"),ButtonBase=__webpack_require__("./node_modules/@mui/material/ButtonBase/ButtonBase.js"),capitalize=__webpack_require__("./node_modules/@mui/material/utils/capitalize.js"),generateUtilityClasses=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js"),generateUtilityClass=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js");function getIconButtonUtilityClass(slot){return(0,generateUtilityClass.Ay)("MuiIconButton",slot)}const IconButton_iconButtonClasses=(0,generateUtilityClasses.A)("MuiIconButton",["root","disabled","colorInherit","colorPrimary","colorSecondary","colorError","colorInfo","colorSuccess","colorWarning","edgeStart","edgeEnd","sizeSmall","sizeMedium","sizeLarge"]);var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const IconButtonRoot=(0,styled.Ay)(ButtonBase.A,{name:"MuiIconButton",slot:"Root",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,"default"!==ownerState.color&&styles[`color${(0,capitalize.A)(ownerState.color)}`],ownerState.edge&&styles[`edge${(0,capitalize.A)(ownerState.edge)}`],styles[`size${(0,capitalize.A)(ownerState.size)}`]]}})((0,memoTheme.A)((({theme})=>({textAlign:"center",flex:"0 0 auto",fontSize:theme.typography.pxToRem(24),padding:8,borderRadius:"50%",color:(theme.vars||theme).palette.action.active,transition:theme.transitions.create("background-color",{duration:theme.transitions.duration.shortest}),variants:[{props:props=>!props.disableRipple,style:{"--IconButton-hoverBg":theme.vars?`rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`:(0,colorManipulator.X4)(theme.palette.action.active,theme.palette.action.hoverOpacity),"&:hover":{backgroundColor:"var(--IconButton-hoverBg)","@media (hover: none)":{backgroundColor:"transparent"}}}},{props:{edge:"start"},style:{marginLeft:-12}},{props:{edge:"start",size:"small"},style:{marginLeft:-3}},{props:{edge:"end"},style:{marginRight:-12}},{props:{edge:"end",size:"small"},style:{marginRight:-3}}]}))),(0,memoTheme.A)((({theme})=>({variants:[{props:{color:"inherit"},style:{color:"inherit"}},...Object.entries(theme.palette).filter((0,createSimplePaletteValueFilter.A)()).map((([color])=>({props:{color},style:{color:(theme.vars||theme).palette[color].main}}))),...Object.entries(theme.palette).filter((0,createSimplePaletteValueFilter.A)()).map((([color])=>({props:{color},style:{"--IconButton-hoverBg":theme.vars?`rgba(${(theme.vars||theme).palette[color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})`:(0,colorManipulator.X4)((theme.vars||theme).palette[color].main,theme.palette.action.hoverOpacity)}}))),{props:{size:"small"},style:{padding:5,fontSize:theme.typography.pxToRem(18)}},{props:{size:"large"},style:{padding:12,fontSize:theme.typography.pxToRem(28)}}],[`&.${IconButton_iconButtonClasses.disabled}`]:{backgroundColor:"transparent",color:(theme.vars||theme).palette.action.disabled}})))),IconButton_IconButton=react.forwardRef((function IconButton(inProps,ref){const props=(0,DefaultPropsProvider.b)({props:inProps,name:"MuiIconButton"}),{edge=!1,children,className,color="default",disabled=!1,disableFocusRipple=!1,size="medium",...other}=props,ownerState={...props,edge,color,disabled,disableFocusRipple,size},classes=(ownerState=>{const{classes,disabled,color,edge,size}=ownerState,slots={root:["root",disabled&&"disabled","default"!==color&&`color${(0,capitalize.A)(color)}`,edge&&`edge${(0,capitalize.A)(edge)}`,`size${(0,capitalize.A)(size)}`]};return(0,composeClasses.A)(slots,getIconButtonUtilityClass,classes)})(ownerState);return(0,jsx_runtime.jsx)(IconButtonRoot,{className:(0,clsx.A)(classes.root,className),centerRipple:!0,focusRipple:!disableFocusRipple,disabled,ref,...other,ownerState,children})}))},"./node_modules/@mui/material/ListItemIcon/ListItemIcon.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),clsx__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),_mui_utils_composeClasses__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),_zero_styled_index_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),_utils_memoTheme_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@mui/material/utils/memoTheme.js"),_DefaultPropsProvider_index_js__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js"),_listItemIconClasses_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@mui/material/ListItemIcon/listItemIconClasses.js"),_List_ListContext_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@mui/material/List/ListContext.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const ListItemIconRoot=(0,_zero_styled_index_js__WEBPACK_IMPORTED_MODULE_4__.Ay)("div",{name:"MuiListItemIcon",slot:"Root",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,"flex-start"===ownerState.alignItems&&styles.alignItemsFlexStart]}})((0,_utils_memoTheme_js__WEBPACK_IMPORTED_MODULE_5__.A)((({theme})=>({minWidth:56,color:(theme.vars||theme).palette.action.active,flexShrink:0,display:"inline-flex",variants:[{props:{alignItems:"flex-start"},style:{marginTop:8}}]})))),__WEBPACK_DEFAULT_EXPORT__=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((function ListItemIcon(inProps,ref){const props=(0,_DefaultPropsProvider_index_js__WEBPACK_IMPORTED_MODULE_6__.b)({props:inProps,name:"MuiListItemIcon"}),{className,...other}=props,context=react__WEBPACK_IMPORTED_MODULE_0__.useContext(_List_ListContext_js__WEBPACK_IMPORTED_MODULE_7__.A),ownerState={...props,alignItems:context.alignItems},classes=(ownerState=>{const{alignItems,classes}=ownerState,slots={root:["root","flex-start"===alignItems&&"alignItemsFlexStart"]};return(0,_mui_utils_composeClasses__WEBPACK_IMPORTED_MODULE_2__.A)(slots,_listItemIconClasses_js__WEBPACK_IMPORTED_MODULE_3__.f,classes)})(ownerState);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(ListItemIconRoot,{className:(0,clsx__WEBPACK_IMPORTED_MODULE_8__.A)(classes.root,className),ownerState,ref,...other})}))},"./node_modules/use-long-press/index.mjs":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{HZ:()=>J});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),l=(e=>(e.Mouse="mouse",e.Touch="touch",e.Pointer="pointer",e))(l||{}),d=(e=>(e.CancelledByMovement="cancelled-by-movement",e.CancelledByRelease="cancelled-by-release",e.CancelledOutsideElement="cancelled-outside-element",e))(d||{});const A=()=>"object"==typeof window?window?.PointerEvent??null:null,z=()=>"object"==typeof window?window?.TouchEvent??null:null;function U(e){const{nativeEvent:t}=e,u=z();return u&&t instanceof u||"touches"in e}function X(e){const t=A();return e.nativeEvent instanceof MouseEvent&&!(t&&e.nativeEvent instanceof t)}function Y(e){const{nativeEvent:t}=e;if(!t)return!1;const u=A();return u&&t instanceof u||"pointerId"in t}function R(e){return X(e)||U(e)||Y(e)}function j(e){return U(e)?{x:e.touches[0].pageX,y:e.touches[0].pageY}:X(e)||Y(e)?{x:e.pageX,y:e.pageY}:null}function J(e,{threshold:t=400,captureEvent:u=!1,detect:y=l.Pointer,cancelOnMovement:w=!1,cancelOutsideElement:v=!0,filterEvents:p,onStart:M,onMove:C,onFinish:L,onCancel:b}={}){const P=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),c=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1),I=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(),a=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(),T=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(e),f=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),E=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((n=>r=>{c.current||R(r)&&(void 0!==p&&!p(r)||(u&&r.persist(),M?.(r,{context:n}),f.current=j(r),c.current=!0,I.current=r.currentTarget,a.current=setTimeout((()=>{T.current&&(T.current(r,{context:n}),P.current=!0)}),t)))}),[u,p,M,t]),i=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((n=>(r,o)=>{R(r)&&c.current&&(f.current=null,u&&r.persist(),P.current?L?.(r,{context:n}):c.current&&b?.(r,{context:n,reason:o??d.CancelledByRelease}),P.current=!1,c.current=!1,void 0!==a.current&&clearTimeout(a.current))}),[u,L,b]),m=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((n=>r=>{if(C?.(r,{context:n}),!1!==w&&f.current){const o=j(r);if(o){const B=!0===w?25:w,D={x:Math.abs(o.x-f.current.x),y:Math.abs(o.y-f.current.y)};(D.x>B||D.y>B)&&i(n)(r,d.CancelledByMovement)}}}),[i,w,C]),q=(0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((n=>{if(null===e)return{};switch(y){case l.Mouse:{const r={onMouseDown:E(n),onMouseMove:m(n),onMouseUp:i(n)};return v&&(r.onMouseLeave=o=>{i(n)(o,d.CancelledOutsideElement)}),r}case l.Touch:return{onTouchStart:E(n),onTouchMove:m(n),onTouchEnd:i(n)};case l.Pointer:{const r={onPointerDown:E(n),onPointerMove:m(n),onPointerUp:i(n)};return v&&(r.onPointerLeave=o=>i(n)(o,d.CancelledOutsideElement)),r}}}),[e,i,v,y,m,E]);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{if(window)return window.addEventListener("mouseup",n),window.addEventListener("touchend",n),window.addEventListener("pointerup",n),()=>{window.removeEventListener("mouseup",n),window.removeEventListener("touchend",n),window.removeEventListener("pointerup",n)};function n(r){const o=function G(e){return{target:e.target,currentTarget:e.currentTarget,nativeEvent:e,persist:()=>{}}}(r);i()(o)}}),[i]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>()=>{void 0!==a.current&&clearTimeout(a.current)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{T.current=e}),[e]),q}}}]);