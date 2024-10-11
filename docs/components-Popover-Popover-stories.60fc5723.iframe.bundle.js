"use strict";(self.webpackChunkledfx=self.webpackChunkledfx||[]).push([[15],{"./src/components/Popover/Popover.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Example:()=>Example,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Popover__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Popover/Popover.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const __WEBPACK_DEFAULT_EXPORT__={title:"UI Components/Popover",component:_Popover__WEBPACK_IMPORTED_MODULE_0__.A,argTypes:{type:{options:["menuItem","button"],control:{type:"select"}}},parameters:{options:{showPanel:!0}}},Template=args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_Popover__WEBPACK_IMPORTED_MODULE_0__.A,{...args}),Default=Template.bind({});Default.args={};const Example=Template.bind({});Example.args={type:"button"};const __namedExportsOrder=["Default","Example"];Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"args => <Popover {...args} />",...Default.parameters?.docs?.source}}},Example.parameters={...Example.parameters,docs:{...Example.parameters?.docs,source:{originalSource:"args => <Popover {...args} />",...Example.parameters?.docs?.source}}}},"./src/components/Popover/Popover.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_mui_material__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@mui/material/styles/useTheme.js"),_mui_material__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@mui/material/MenuItem/MenuItem.js"),_mui_material__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mui/material/ListItemIcon/ListItemIcon.js"),_mui_material__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@mui/material/Button/Button.js"),_mui_material__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/@mui/material/Fab/Fab.js"),_mui_material__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/@mui/material/IconButton/IconButton.js"),_mui_material__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/@mui/material/Popover/Popover.js"),_mui_material__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./node_modules/@mui/material/Typography/Typography.js"),_mui_icons_material__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@mui/icons-material/esm/Delete.js"),_mui_icons_material__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./node_modules/@mui/icons-material/esm/Check.js"),_mui_icons_material__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__("./node_modules/@mui/icons-material/esm/Close.js"),use_long_press__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/use-long-press/index.mjs"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Popover=_ref=>{let{onConfirm,onCancel,confirmDisabled,confirmContent,onSingleClick,onDoubleClick,openOnDoubleClick=!1,openOnLongPress=!1,noIcon=!1,disabled=!1,variant="contained",color="secondary",vertical="center",horizontal="left",size="small",text="Are you sure?",label,anchorOrigin,transformOrigin,startIcon,icon=(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_icons_material__WEBPACK_IMPORTED_MODULE_3__.A,{}),content,footer,className,style={},sx,popoverStyle,wrapperStyle,type="button",children}=_ref;const theme=(0,_mui_material__WEBPACK_IMPORTED_MODULE_4__.A)(),[anchorEl,setAnchorEl]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),openPopover=event=>{setAnchorEl((()=>event.currentTarget||event.target))},longPress=(0,use_long_press__WEBPACK_IMPORTED_MODULE_1__.HZ)((e=>openPopover(e)),{onCancel:e=>{onSingleClick&&onSingleClick(e)},threshold:1e3,captureEvent:!0}),open=Boolean(anchorEl),id=open?"simple-popover":void 0;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{style:{display:"initial",margin:0,...wrapperStyle},children:["menuItem"===type?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.A,{className,onClick:e=>{e.preventDefault(),onSingleClick&&onSingleClick(e),openPopover(e)},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_6__.A,{children:icon}),label]}):openOnLongPress?"button"===type?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.A,{"aria-describedby":id,variant,color,size,className,style,startIcon:!noIcon&&startIcon,disabled,...longPress,children:[label,!startIcon&&!noIcon&&icon]}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__.A,{"aria-label":"clear-data",...longPress,disabled,style:{margin:"8px",...style},sx:{bgcolor:theme.palette.primary.main,"&:hover":{bgcolor:theme.palette.primary.light}},children:!startIcon&&!noIcon&&icon}):"button"===type?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.A,{"aria-describedby":id,variant,color,onClick:e=>{e.preventDefault(),openOnDoubleClick||openPopover(e),onSingleClick&&onSingleClick(e)},size,className,style,startIcon:!noIcon&&startIcon,disabled,onDoubleClick:e=>{e.preventDefault(),openOnDoubleClick&&openPopover(e),onDoubleClick&&onDoubleClick(e)},children:[label,!startIcon&&!noIcon&&icon,children]}):"iconbutton"===type?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_9__.A,{color,style,onClick:e=>openPopover(e),disabled,children:!startIcon&&!noIcon&&icon}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_8__.A,{"aria-label":"clear-data",onClick:e=>{e.preventDefault(),openOnDoubleClick||openPopover(e),onSingleClick&&onSingleClick(e)},onDoubleClick:e=>{e.preventDefault(),openOnDoubleClick&&openPopover(e),onDoubleClick&&onDoubleClick(e)},disabled,style:{margin:"8px"},sx:{bgcolor:theme.palette.primary.main,"&:hover":{bgcolor:theme.palette.primary.light},...sx},children:[!startIcon&&!noIcon&&icon,children]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_10__.Ay,{id,open,anchorEl,onClose:()=>{setAnchorEl(null)},anchorOrigin:anchorOrigin||{vertical,horizontal},transformOrigin:transformOrigin||{vertical,horizontal:"center"===horizontal?"center":"right"},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div",{style:{display:"flex",...popoverStyle},children:[content||(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_11__.A,{sx:{padding:theme.spacing(2)},children:text}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.A,{disabled:confirmDisabled,"aria-describedby":id,variant:"contained",color:"primary",onClick:e=>{e.preventDefault(),onConfirm&&onConfirm(e),setAnchorEl(null)},children:confirmContent||(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_icons_material__WEBPACK_IMPORTED_MODULE_12__.A,{})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_7__.A,{"aria-describedby":id,color:"primary",onClick:e=>{e.preventDefault(),onCancel&&onCancel(e),setAnchorEl(null)},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_mui_icons_material__WEBPACK_IMPORTED_MODULE_13__.A,{})})]}),footer]})]})},__WEBPACK_DEFAULT_EXPORT__=Popover;try{Popover.displayName="Popover",Popover.__docgenInfo={description:"",displayName:"Popover",props:{type:{defaultValue:{value:"button"},description:"Render as [Button](https://mui.com/api/button/) or [MenuItem](https://mui.com/api/menu-item/) <br />\nexamples: [Button](https://mui.com/components/buttons/), [MenuItem](https://mui.com/components/menu-item/)",name:"type",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"menuItem"'},{value:'"fab"'},{value:'"iconbutton"'}]}},variant:{defaultValue:{value:"contained"},description:"Set the [variant](https://mui.com/components/buttons/#basic-button)",name:"variant",required:!1,type:{name:"enum",value:[{value:'"outlined"'},{value:'"contained"'},{value:'"text"'}]}},color:{defaultValue:{value:"secondary"},description:"Set the [color](https://mui.com/components/buttons/#color)",name:"color",required:!1,type:{name:"enum",value:[{value:'"inherit"'},{value:'"error"'},{value:'"success"'},{value:'"warning"'},{value:'"info"'},{value:'"primary"'},{value:'"secondary"'}]}},size:{defaultValue:{value:"small"},description:"Set the [size](https://mui.com/components/buttons/#sizes)",name:"size",required:!1,type:{name:"enum",value:[{value:'"small"'},{value:'"medium"'},{value:'"large"'}]}},openOnDoubleClick:{defaultValue:{value:"false"},description:"Should the popup open on doubleclick? Ignored if openOnLongPress is `true`",name:"openOnDoubleClick",required:!1,type:{name:"boolean"}},openOnLongPress:{defaultValue:{value:"false"},description:"Should the popup open on longpress? (openOnDoubleClick gets ignored if set)",name:"openOnLongPress",required:!1,type:{name:"boolean"}},vertical:{defaultValue:{value:"center"},description:"Set Popover [position](https://mui.com/components/popover/#anchor-playground)",name:"vertical",required:!1,type:{name:'number | "center" | "bottom" | "top"'}},horizontal:{defaultValue:{value:"left"},description:"Set Popover [position](https://mui.com/components/popover/#anchor-playground)",name:"horizontal",required:!1,type:{name:'number | "center" | "left" | "right"'}},anchorOrigin:{defaultValue:null,description:"Set Popover [position](https://mui.com/components/popover/#anchor-playground)",name:"anchorOrigin",required:!1,type:{name:"PopoverOrigin"}},transformOrigin:{defaultValue:null,description:"Set Popover [position](https://mui.com/components/popover/#anchor-playground)",name:"transformOrigin",required:!1,type:{name:"PopoverOrigin"}},onConfirm:{defaultValue:null,description:"Function to call when confirm is clicked",name:"onConfirm",required:!1,type:{name:"((e: any) => any)"}},onCancel:{defaultValue:null,description:"Function to call when cancel is clicked",name:"onCancel",required:!1,type:{name:"((e: any) => any)"}},onSingleClick:{defaultValue:null,description:"Function to call when button is clicked",name:"onSingleClick",required:!1,type:{name:"((e: any) => any)"}},onDoubleClick:{defaultValue:null,description:"Function to call when button is doubleclicked",name:"onDoubleClick",required:!1,type:{name:"((e: any) => any)"}},noIcon:{defaultValue:{value:"false"},description:"Remove Icon",name:"noIcon",required:!1,type:{name:"boolean"}},disabled:{defaultValue:{value:"false"},description:"Disabled state",name:"disabled",required:!1,type:{name:"boolean"}},confirmDisabled:{defaultValue:null,description:"flag indicator",name:"confirmDisabled",required:!1,type:{name:"boolean"}},confirmContent:{defaultValue:null,description:"flag indicator",name:"confirmContent",required:!1,type:{name:"any"}},text:{defaultValue:{value:"Are you sure?"},description:"Text to show in the popup",name:"text",required:!1,type:{name:"string"}},label:{defaultValue:{value:"undefined"},description:"[Label](https://mui.com/components/buttons/#buttons-with-icons-and-label)",name:"label",required:!1,type:{name:"string"}},startIcon:{defaultValue:null,description:"[startIcon](https://mui.com/components/buttons/#buttons-with-icons-and-label)",name:"startIcon",required:!1,type:{name:"ReactNode"}},icon:{defaultValue:{value:"<Delete />"},description:"[Icon](https://mui.com/components/material-icons/)",name:"icon",required:!1,type:{name:"ReactNode"}},content:{defaultValue:null,description:"Content of the Popover",name:"content",required:!1,type:{name:"ReactNode"}},children:{defaultValue:null,description:"Content",name:"children",required:!1,type:{name:"ReactNode"}},footer:{defaultValue:null,description:"Footer",name:"footer",required:!1,type:{name:"ReactNode"}},className:{defaultValue:null,description:"JSX className",name:"className",required:!1,type:{name:"string"}},sx:{defaultValue:null,description:"JSX style",name:"sx",required:!1,type:{name:"SxProps<Theme>"}},style:{defaultValue:{value:"{}"},description:"JSX style",name:"style",required:!1,type:{name:"Record<string, unknown>"}},popoverStyle:{defaultValue:null,description:"JSX style",name:"popoverStyle",required:!1,type:{name:"Record<string, unknown>"}},wrapperStyle:{defaultValue:null,description:"JSX style",name:"wrapperStyle",required:!1,type:{name:"Record<string, unknown>"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Popover/Popover.tsx#Popover"]={docgenInfo:Popover.__docgenInfo,name:"Popover",path:"src/components/Popover/Popover.tsx#Popover"})}catch(__react_docgen_typescript_loader_error){}}}]);