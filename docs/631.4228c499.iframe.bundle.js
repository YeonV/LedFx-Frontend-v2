"use strict";(self.webpackChunkledfx=self.webpackChunkledfx||[]).push([[631],{"./node_modules/@mui/material/Divider/Divider.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),clsx__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),_mui_utils_composeClasses__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),_mui_system_colorManipulator__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mui/system/esm/colorManipulator/colorManipulator.js"),_zero_styled_index_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),_utils_memoTheme_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@mui/material/utils/memoTheme.js"),_DefaultPropsProvider_index_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js"),_dividerClasses_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@mui/material/Divider/dividerClasses.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const DividerRoot=(0,_zero_styled_index_js__WEBPACK_IMPORTED_MODULE_4__.Ay)("div",{name:"MuiDivider",slot:"Root",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,ownerState.absolute&&styles.absolute,styles[ownerState.variant],ownerState.light&&styles.light,"vertical"===ownerState.orientation&&styles.vertical,ownerState.flexItem&&styles.flexItem,ownerState.children&&styles.withChildren,ownerState.children&&"vertical"===ownerState.orientation&&styles.withChildrenVertical,"right"===ownerState.textAlign&&"vertical"!==ownerState.orientation&&styles.textAlignRight,"left"===ownerState.textAlign&&"vertical"!==ownerState.orientation&&styles.textAlignLeft]}})((0,_utils_memoTheme_js__WEBPACK_IMPORTED_MODULE_5__.A)((({theme})=>({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(theme.vars||theme).palette.divider,borderBottomWidth:"thin",variants:[{props:{absolute:!0},style:{position:"absolute",bottom:0,left:0,width:"100%"}},{props:{light:!0},style:{borderColor:theme.vars?`rgba(${theme.vars.palette.dividerChannel} / 0.08)`:(0,_mui_system_colorManipulator__WEBPACK_IMPORTED_MODULE_6__.X4)(theme.palette.divider,.08)}},{props:{variant:"inset"},style:{marginLeft:72}},{props:{variant:"middle",orientation:"horizontal"},style:{marginLeft:theme.spacing(2),marginRight:theme.spacing(2)}},{props:{variant:"middle",orientation:"vertical"},style:{marginTop:theme.spacing(1),marginBottom:theme.spacing(1)}},{props:{orientation:"vertical"},style:{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"}},{props:{flexItem:!0},style:{alignSelf:"stretch",height:"auto"}},{props:({ownerState})=>!!ownerState.children,style:{display:"flex",whiteSpace:"nowrap",textAlign:"center",border:0,borderTopStyle:"solid",borderLeftStyle:"solid","&::before, &::after":{content:'""',alignSelf:"center"}}},{props:({ownerState})=>ownerState.children&&"vertical"!==ownerState.orientation,style:{"&::before, &::after":{width:"100%",borderTop:`thin solid ${(theme.vars||theme).palette.divider}`,borderTopStyle:"inherit"}}},{props:({ownerState})=>"vertical"===ownerState.orientation&&ownerState.children,style:{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:`thin solid ${(theme.vars||theme).palette.divider}`,borderLeftStyle:"inherit"}}},{props:({ownerState})=>"right"===ownerState.textAlign&&"vertical"!==ownerState.orientation,style:{"&::before":{width:"90%"},"&::after":{width:"10%"}}},{props:({ownerState})=>"left"===ownerState.textAlign&&"vertical"!==ownerState.orientation,style:{"&::before":{width:"10%"},"&::after":{width:"90%"}}}]})))),DividerWrapper=(0,_zero_styled_index_js__WEBPACK_IMPORTED_MODULE_4__.Ay)("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.wrapper,"vertical"===ownerState.orientation&&styles.wrapperVertical]}})((0,_utils_memoTheme_js__WEBPACK_IMPORTED_MODULE_5__.A)((({theme})=>({display:"inline-block",paddingLeft:`calc(${theme.spacing(1)} * 1.2)`,paddingRight:`calc(${theme.spacing(1)} * 1.2)`,variants:[{props:{orientation:"vertical"},style:{paddingTop:`calc(${theme.spacing(1)} * 1.2)`,paddingBottom:`calc(${theme.spacing(1)} * 1.2)`}}]})))),Divider=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((function Divider(inProps,ref){const props=(0,_DefaultPropsProvider_index_js__WEBPACK_IMPORTED_MODULE_7__.b)({props:inProps,name:"MuiDivider"}),{absolute=!1,children,className,orientation="horizontal",component=children||"vertical"===orientation?"div":"hr",flexItem=!1,light=!1,role="hr"!==component?"separator":void 0,textAlign="center",variant="fullWidth",...other}=props,ownerState={...props,absolute,component,flexItem,light,orientation,role,textAlign,variant},classes=(ownerState=>{const{absolute,children,classes,flexItem,light,orientation,textAlign,variant}=ownerState,slots={root:["root",absolute&&"absolute",variant,light&&"light","vertical"===orientation&&"vertical",flexItem&&"flexItem",children&&"withChildren",children&&"vertical"===orientation&&"withChildrenVertical","right"===textAlign&&"vertical"!==orientation&&"textAlignRight","left"===textAlign&&"vertical"!==orientation&&"textAlignLeft"],wrapper:["wrapper","vertical"===orientation&&"wrapperVertical"]};return(0,_mui_utils_composeClasses__WEBPACK_IMPORTED_MODULE_2__.A)(slots,_dividerClasses_js__WEBPACK_IMPORTED_MODULE_3__.K,classes)})(ownerState);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DividerRoot,{as:component,className:(0,clsx__WEBPACK_IMPORTED_MODULE_8__.A)(classes.root,className),role,ref,ownerState,"aria-orientation":"separator"!==role||"hr"===component&&"vertical"!==orientation?void 0:orientation,...other,children:children?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(DividerWrapper,{className:classes.wrapper,ownerState,children}):null})}));Divider&&(Divider.muiSkipListHighlight=!0);const __WEBPACK_DEFAULT_EXPORT__=Divider},"./node_modules/@mui/material/Switch/Switch.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>Switch_Switch});var react=__webpack_require__("./node_modules/react/index.js"),clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),composeClasses=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),colorManipulator=__webpack_require__("./node_modules/@mui/system/esm/colorManipulator/colorManipulator.js"),capitalize=__webpack_require__("./node_modules/@mui/material/utils/capitalize.js"),createSimplePaletteValueFilter=__webpack_require__("./node_modules/@mui/material/utils/createSimplePaletteValueFilter.js"),SwitchBase=__webpack_require__("./node_modules/@mui/material/internal/SwitchBase.js"),styled=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),memoTheme=__webpack_require__("./node_modules/@mui/material/utils/memoTheme.js"),DefaultPropsProvider=__webpack_require__("./node_modules/@mui/material/DefaultPropsProvider/DefaultPropsProvider.js"),generateUtilityClasses=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js"),generateUtilityClass=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js");function getSwitchUtilityClass(slot){return(0,generateUtilityClass.Ay)("MuiSwitch",slot)}const Switch_switchClasses=(0,generateUtilityClasses.A)("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]);var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const SwitchRoot=(0,styled.Ay)("span",{name:"MuiSwitch",slot:"Root",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,ownerState.edge&&styles[`edge${(0,capitalize.A)(ownerState.edge)}`],styles[`size${(0,capitalize.A)(ownerState.size)}`]]}})({display:"inline-flex",width:58,height:38,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"},variants:[{props:{edge:"start"},style:{marginLeft:-8}},{props:{edge:"end"},style:{marginRight:-8}},{props:{size:"small"},style:{width:40,height:24,padding:7,[`& .${Switch_switchClasses.thumb}`]:{width:16,height:16},[`& .${Switch_switchClasses.switchBase}`]:{padding:4,[`&.${Switch_switchClasses.checked}`]:{transform:"translateX(16px)"}}}}]}),SwitchSwitchBase=(0,styled.Ay)(SwitchBase.A,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.switchBase,{[`& .${Switch_switchClasses.input}`]:styles.input},"default"!==ownerState.color&&styles[`color${(0,capitalize.A)(ownerState.color)}`]]}})((0,memoTheme.A)((({theme})=>({position:"absolute",top:0,left:0,zIndex:1,color:theme.vars?theme.vars.palette.Switch.defaultColor:`${"light"===theme.palette.mode?theme.palette.common.white:theme.palette.grey[300]}`,transition:theme.transitions.create(["left","transform"],{duration:theme.transitions.duration.shortest}),[`&.${Switch_switchClasses.checked}`]:{transform:"translateX(20px)"},[`&.${Switch_switchClasses.disabled}`]:{color:theme.vars?theme.vars.palette.Switch.defaultDisabledColor:`${"light"===theme.palette.mode?theme.palette.grey[100]:theme.palette.grey[600]}`},[`&.${Switch_switchClasses.checked} + .${Switch_switchClasses.track}`]:{opacity:.5},[`&.${Switch_switchClasses.disabled} + .${Switch_switchClasses.track}`]:{opacity:theme.vars?theme.vars.opacity.switchTrackDisabled:""+("light"===theme.palette.mode?.12:.2)},[`& .${Switch_switchClasses.input}`]:{left:"-100%",width:"300%"}}))),(0,memoTheme.A)((({theme})=>({"&:hover":{backgroundColor:theme.vars?`rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})`:(0,colorManipulator.X4)(theme.palette.action.active,theme.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},variants:[...Object.entries(theme.palette).filter((0,createSimplePaletteValueFilter.A)(["light"])).map((([color])=>({props:{color},style:{[`&.${Switch_switchClasses.checked}`]:{color:(theme.vars||theme).palette[color].main,"&:hover":{backgroundColor:theme.vars?`rgba(${theme.vars.palette[color].mainChannel} / ${theme.vars.palette.action.hoverOpacity})`:(0,colorManipulator.X4)(theme.palette[color].main,theme.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${Switch_switchClasses.disabled}`]:{color:theme.vars?theme.vars.palette.Switch[`${color}DisabledColor`]:`${"light"===theme.palette.mode?(0,colorManipulator.a)(theme.palette[color].main,.62):(0,colorManipulator.e$)(theme.palette[color].main,.55)}`}},[`&.${Switch_switchClasses.checked} + .${Switch_switchClasses.track}`]:{backgroundColor:(theme.vars||theme).palette[color].main}}})))]})))),SwitchTrack=(0,styled.Ay)("span",{name:"MuiSwitch",slot:"Track",overridesResolver:(props,styles)=>styles.track})((0,memoTheme.A)((({theme})=>({height:"100%",width:"100%",borderRadius:7,zIndex:-1,transition:theme.transitions.create(["opacity","background-color"],{duration:theme.transitions.duration.shortest}),backgroundColor:theme.vars?theme.vars.palette.common.onBackground:`${"light"===theme.palette.mode?theme.palette.common.black:theme.palette.common.white}`,opacity:theme.vars?theme.vars.opacity.switchTrack:""+("light"===theme.palette.mode?.38:.3)})))),SwitchThumb=(0,styled.Ay)("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:(props,styles)=>styles.thumb})((0,memoTheme.A)((({theme})=>({boxShadow:(theme.vars||theme).shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"})))),Switch_Switch=react.forwardRef((function Switch(inProps,ref){const props=(0,DefaultPropsProvider.b)({props:inProps,name:"MuiSwitch"}),{className,color="primary",edge=!1,size="medium",sx,...other}=props,ownerState={...props,color,edge,size},classes=(ownerState=>{const{classes,edge,size,color,checked,disabled}=ownerState,slots={root:["root",edge&&`edge${(0,capitalize.A)(edge)}`,`size${(0,capitalize.A)(size)}`],switchBase:["switchBase",`color${(0,capitalize.A)(color)}`,checked&&"checked",disabled&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},composedClasses=(0,composeClasses.A)(slots,getSwitchUtilityClass,classes);return{...classes,...composedClasses}})(ownerState),icon=(0,jsx_runtime.jsx)(SwitchThumb,{className:classes.thumb,ownerState});return(0,jsx_runtime.jsxs)(SwitchRoot,{className:(0,clsx.A)(classes.root,className),sx,ownerState,children:[(0,jsx_runtime.jsx)(SwitchSwitchBase,{type:"checkbox",icon,checkedIcon:icon,ref,ownerState,...other,classes:{...classes,root:classes.switchBase}}),(0,jsx_runtime.jsx)(SwitchTrack,{className:classes.track,ownerState})]})}))}}]);