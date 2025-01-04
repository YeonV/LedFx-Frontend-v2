"use strict";(self.webpackChunkledfx=self.webpackChunkledfx||[]).push([[208],{"./src/components/SchemaForm/components/BladeFrame.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js");const Root=(0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.Ay)("div")((_ref=>{let{theme}=_ref;return{minWidth:"23.5%",padding:"16px 1.2rem 6px 1.2rem",border:"1px solid",borderColor:theme.palette.divider,borderRadius:"10px",position:"relative",display:"flex",alignItems:"center",height:"auto",margin:"0.5rem 0","@media (max-width: 580px)":{width:"100% !important",margin:"0.5rem 0"},"& > label":{top:"-0.75rem",display:"flex",alignItems:"center",left:"1rem",padding:"0 0.3rem",position:"absolute",fontVariant:"all-small-caps",fontSize:"0.9rem",letterSpacing:"0.1rem",color:theme.palette.text.secondary,backgroundColor:theme.palette.background.paper,boxSizing:"border-box"}}})),BladeFrame=_ref2=>{let{index,title,children,full=!1,style={width:"unset",order:0},required=!1,variant="outlined",className,disabled,labelStyle,onClick}=_ref2;return"outlined"===variant?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Root,{className:className||"",style:(0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.A)((0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.A)({},style),{},{width:full?"100%":style.width}),onClick,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label",{style:(0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_2__.A)({},labelStyle),className:"MuiFormLabel-root".concat(disabled?" Mui-disabled":"","  step-effect-").concat(index),children:[title,required?"*":""]}),children]}):children},__WEBPACK_DEFAULT_EXPORT__=BladeFrame;BladeFrame.__docgenInfo={description:"",methods:[],displayName:"BladeFrame",props:{title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"undefined",computed:!0}},index:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"undefined",computed:!0}},children:{required:!1,tsType:{name:"any"},description:"",defaultValue:{value:"undefined",computed:!0}},full:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},style:{required:!1,tsType:{name:"any"},description:"",defaultValue:{value:"{\n  width: 'unset',\n  order: 0\n}",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'outlined' | 'contained' | 'inherit'",elements:[{name:"literal",value:"'outlined'"},{name:"literal",value:"'contained'"},{name:"literal",value:"'inherit'"}]},description:"",defaultValue:{value:"'outlined'",computed:!1}},className:{required:!1,tsType:{name:"union",raw:"string | undefined",elements:[{name:"string"},{name:"undefined"}]},description:"",defaultValue:{value:"undefined",computed:!0}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"undefined",computed:!0}},labelStyle:{required:!1,tsType:{name:"any"},description:"",defaultValue:{value:"undefined",computed:!0}},onClick:{required:!1,tsType:{name:"union",raw:"any | undefined",elements:[{name:"any"},{name:"undefined"}]},description:"",defaultValue:{value:"undefined",computed:!0}}}}},"./src/components/SchemaForm/components/String/BladeSelect.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>String_BladeSelect});var objectSpread2=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),Select=__webpack_require__("./node_modules/@mui/material/Select/Select.js"),MenuItem=__webpack_require__("./node_modules/@mui/material/MenuItem/MenuItem.js"),TextField=__webpack_require__("./node_modules/@mui/material/TextField/TextField.js"),InputAdornment=__webpack_require__("./node_modules/@mui/material/InputAdornment/InputAdornment.js"),Alert=__webpack_require__("./node_modules/@mui/material/Alert/Alert.js"),Typography=__webpack_require__("./node_modules/@mui/material/Typography/Typography.js"),Tooltip=__webpack_require__("./node_modules/@mui/material/Tooltip/Tooltip.js"),Button=__webpack_require__("./node_modules/@mui/material/Button/Button.js"),react=__webpack_require__("./node_modules/react/index.js"),BladeIcon=__webpack_require__("./src/components/Icons/BladeIcon/BladeIcon.tsx"),BladeFrame=__webpack_require__("./src/components/SchemaForm/components/BladeFrame.tsx"),ledfx=__webpack_require__("./src/api/ledfx.ts"),Dialog=__webpack_require__("./node_modules/@mui/material/Dialog/Dialog.js"),DialogContent=__webpack_require__("./node_modules/@mui/material/DialogContent/DialogContent.js"),DialogTitle=__webpack_require__("./node_modules/@mui/material/DialogTitle/DialogTitle.js"),useTheme=__webpack_require__("./node_modules/@mui/material/styles/useTheme.js"),DialogActions=__webpack_require__("./node_modules/@mui/material/DialogActions/DialogActions.js");const FX=__webpack_require__.p+"static/media/FX.2e579a36c78155284df077b2f54cc84b.svg";var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const GifPicker=_ref=>{let{onChange}=_ref;const theme=(0,useTheme.A)(),[gifs,setGifs]=(0,react.useState)([]),[filter,setFilter]=(0,react.useState)(""),[open,setOpen]=(0,react.useState)(!1),[selectedGif,setSelectedGif]=(0,react.useState)(null),handleClose=()=>{setOpen(!1)},baseUrl="https://assets.ledfx.app/gifs/";return(0,react.useEffect)((()=>{open&&fetch(baseUrl).then((response=>response.text())).then((data=>{const links=(new DOMParser).parseFromString(data,"text/html").querySelectorAll("pre a"),files=Array.from(links).filter((link=>{var _link$textContent;return null===(_link$textContent=link.textContent)||void 0===_link$textContent?void 0:_link$textContent.endsWith(".gif")})).map((link=>{var _link$textContent2;return{name:null===(_link$textContent2=link.textContent)||void 0===_link$textContent2?void 0:_link$textContent2.replace(".gif",""),url:baseUrl+link.href.split("/").pop()}}));setGifs(files)}))}),[open]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Button.A,{onClick:()=>{setOpen(!0)},sx:{alignSelf:"center"},children:(0,jsx_runtime.jsx)("img",{width:50,height:"24px",src:FX,alt:"wled",style:{filter:"invert(".concat("dark"===theme.palette.mode?1:0,") brightness(2)"),objectFit:"cover"}})}),(0,jsx_runtime.jsxs)(Dialog.A,{open,onClose:handleClose,children:[(0,jsx_runtime.jsx)(DialogTitle.A,{children:"GIF Picker"}),(0,jsx_runtime.jsxs)(DialogContent.A,{children:[(0,jsx_runtime.jsx)(TextField.A,{fullWidth:!0,sx:{marginBottom:"20px",minWidth:"522px"},onChange:e=>setFilter(e.target.value),placeholder:"Filter GIFs..."}),gifs.filter((gif=>gif.name.includes(filter))).map(((gif,i)=>(0,jsx_runtime.jsx)("img",{src:gif.url,alt:gif.name,style:{height:"100px",marginRight:"10px",border:"2px solid",cursor:"pointer",borderColor:selectedGif===gif.url?theme.palette.primary.main:"transparent"},tabIndex:i+1,onKeyDown:e=>{"Enter"===e.key&&handleClose()},onClick:()=>{selectedGif!==gif.url?setSelectedGif(gif.url):setSelectedGif(null),onChange(gif.url)}},gif.name)))]}),(0,jsx_runtime.jsx)(DialogActions.A,{children:(0,jsx_runtime.jsx)(Button.A,{onClick:handleClose,children:"OK"})})]})]})},Gif_GifPicker=GifPicker;GifPicker.__docgenInfo={description:"",methods:[],displayName:"GifPicker",props:{onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(_url: string) => void",signature:{arguments:[{type:{name:"string"},name:"_url"}],return:{name:"void"}}},description:""}}};var Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),Stack=__webpack_require__("./node_modules/@mui/material/Stack/Stack.js"),IconButton=__webpack_require__("./node_modules/@mui/material/IconButton/IconButton.js"),Slider=__webpack_require__("./node_modules/@mui/material/Slider/Slider.js"),Colorize=__webpack_require__("./node_modules/@mui/icons-material/esm/Colorize.js"),ArrowLeft=__webpack_require__("./node_modules/@mui/icons-material/esm/ArrowLeft.js"),ArrowRight=__webpack_require__("./node_modules/@mui/icons-material/esm/ArrowRight.js"),useStore=__webpack_require__("./src/store/useStore.ts");const GifFrame=_ref=>{let{image,onClick,selected}=_ref;const theme=(0,useTheme.A)();return(0,jsx_runtime.jsx)("div",{style:{height:void 0===onClick?292:300,width:"min(100% - 32px, ".concat(void 0===onClick?292:300,"px)"),minWidth:void 0===onClick?292:300,maxWidth:void 0===onClick?292:300,backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center",backgroundImage:'url("data:image/png;base64,'.concat(image,'")'),border:void 0===onClick?0:"4px solid",cursor:void 0===onClick?"default":"pointer",borderColor:selected?theme.palette.primary.main:"#9999",opacity:void 0===onClick?.5:1},onClick})},Gif_GifFrame=GifFrame;GifFrame.__docgenInfo={description:"",methods:[],displayName:"GifFrame",props:{onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void | undefined",signature:{arguments:[],return:{name:"union",raw:"void | undefined",elements:[{name:"void"},{name:"undefined"}]}}},description:"",defaultValue:{value:"undefined",computed:!0}},image:{required:!0,tsType:{name:"string"},description:""},selected:{required:!1,tsType:{name:"union",raw:"boolean | undefined",elements:[{name:"boolean"},{name:"undefined"}]},description:"",defaultValue:{value:"undefined",computed:!0}}}};const GifFramePicker=_ref=>{let{onChange,model}=_ref;const[open,setOpen]=(0,react.useState)(!1),[imageData,setImageData]=(0,react.useState)([]),getGifFrames=(0,useStore.A)((state=>state.getGifFrames)),[currentFrame,setCurrentFrame]=(0,react.useState)(0),handleClose=()=>{setOpen(!1)},fetchImage=(0,react.useCallback)((async ic=>{const result=await getGifFrames(ic);setImageData(result.frames)}),[]);return(0,react.useEffect)((()=>{fetchImage(model.image_location)}),[]),(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Button.A,{onClick:()=>{setOpen(!0)},sx:{alignSelf:"center"},children:(0,jsx_runtime.jsx)(Colorize.A,{})}),(0,jsx_runtime.jsxs)(Dialog.A,{open,onClose:handleClose,PaperProps:{sx:{width:"960px",maxWidth:"unset"}},children:[(0,jsx_runtime.jsx)(DialogTitle.A,{children:"GIF Frame Picker"}),(0,jsx_runtime.jsx)(DialogContent.A,{sx:{minWidth:332,width:"100%"},children:imageData&&(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[!1,(0,jsx_runtime.jsx)(Box.A,{children:(0,jsx_runtime.jsx)(Typography.A,{variant:"h6",color:"GrayText",align:"center",mb:1,children:"Click on image to select/deselect"})}),(0,jsx_runtime.jsxs)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center"},children:[(0,jsx_runtime.jsx)(Gif_GifFrame,{image:imageData[currentFrame-1]}),(0,jsx_runtime.jsx)(Gif_GifFrame,{image:imageData[currentFrame],selected:model.beat_frames.split(" ").includes(currentFrame.toString()),onClick:()=>{let output="";output=model.beat_frames.split(" ").includes(currentFrame.toString())?model.beat_frames.split(" ").filter((b=>b!==currentFrame.toString())).join(" "):model.beat_frames.concat([" ".concat(currentFrame.toString())]).split(" ").sort(((a,b)=>parseInt(a,10)-parseInt(b,10))).join(" "),onChange(output)}}),(0,jsx_runtime.jsx)(Gif_GifFrame,{image:imageData[currentFrame+1]})]}),(0,jsx_runtime.jsxs)(Stack.A,{direction:"row",spacing:1,justifyContent:"center",alignItems:"center",children:[(0,jsx_runtime.jsx)(IconButton.A,{onClick:()=>setCurrentFrame(currentFrame-1),disabled:0===currentFrame,children:(0,jsx_runtime.jsx)(ArrowLeft.A,{})}),(0,jsx_runtime.jsx)(Typography.A,{variant:"h5",align:"center",mt:1,children:currentFrame}),(0,jsx_runtime.jsx)(IconButton.A,{size:"large",onClick:()=>setCurrentFrame(currentFrame+1),disabled:currentFrame===imageData.length-1,children:(0,jsx_runtime.jsx)(ArrowRight.A,{fontSize:"inherit"})})]}),(0,jsx_runtime.jsx)(Box.A,{sx:{maxWidth:860,mt:2,ml:3},children:(0,jsx_runtime.jsx)(Slider.Ay,{value:currentFrame,"aria-label":"Default",valueLabelDisplay:"auto",step:1,marks:model.beat_frames.split(" ").map((b=>({value:b,label:b.toString()}))),min:0,max:imageData.length-1||0,onChange:(e,v)=>{setCurrentFrame(v)}})})]})}),(0,jsx_runtime.jsx)(DialogActions.A,{children:(0,jsx_runtime.jsx)(Button.A,{onClick:handleClose,children:"Close"})})]})]})},Gif_GifFramePicker=GifFramePicker;GifFramePicker.__docgenInfo={description:"",methods:[],displayName:"GifFramePicker",props:{onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(_url: string) => void",signature:{arguments:[{type:{name:"string"},name:"_url"}],return:{name:"void"}}},description:""},model:{required:!0,tsType:{name:"any"},description:""}}};const BladeSelect=_ref=>{var _schema$description;let{variant="outlined",disabled=!1,schema,model,model_id,onChange,index=0,required=!1,wrapperStyle={margin:"0.5rem",flexBasis:"49%",width:"unset"},selectStyle={},textStyle={},menuItemStyle={},hideDesc=!1,children,type}=_ref;const inputRef=(0,react.useRef)(null),[showReserved,setShowReserved]=(0,react.useState)(!1),[icon,setIcon]=(0,react.useState)("icon_name"===schema.id?model&&model_id&&model[model_id]||schema.enum&&schema.enum[0]:"");return(0,react.useEffect)((()=>{model&&model_id&&model[model_id]&&inputRef.current&&(inputRef.current.value=model[model_id])}),[model,model_id]),(0,jsx_runtime.jsx)(BladeFrame.A,{title:schema.title,className:"step-effect-".concat(index),full:!(schema.enum&&schema.enum.length&&Object.values(schema.enum).every((a=>(null==a?void 0:a.length)<20))),required,style:(0,objectSpread2.A)((0,objectSpread2.A)({},wrapperStyle),{},{flexBasis:"Name"===schema.title?"100%":"49%"}),children:"contained"===variant?schema.enum?(0,jsx_runtime.jsx)(Select.A,{variant:"filled",disabled,style:(0,objectSpread2.A)({flexGrow:"unset"},selectStyle),defaultValue:schema.default,value:model&&model_id&&model[model_id]||schema.default||schema.enum[0],onChange:e=>onChange(model_id,e.target.value),children:children||schema.enum.map(((item,i)=>(0,jsx_runtime.jsx)(MenuItem.A,{value:item,children:item},"".concat(i,"-").concat(i))))}):(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{children:(0,jsx_runtime.jsx)(TextField.A,{variant:"standard",helperText:!hideDesc&&schema.description,slotProps:{input:{disableUnderline:!0}},defaultValue:model&&model_id&&model[model_id]||schema.enum&&schema.enum[0]||schema.default||"",onBlur:e=>onChange(model_id,e.target.value),style:textStyle})}):schema.enum&&Array.isArray(schema.enum)?(0,jsx_runtime.jsx)(Select.A,{variant:"standard",disableUnderline:!0,disabled,style:(0,objectSpread2.A)({flexGrow:"outlined"===variant?1:"unset"},selectStyle),defaultValue:schema.default,value:model&&model_id&&model[model_id]||schema.default||schema.enum[0],onChange:e=>onChange(model_id,e.target.value),children:schema.enum.map(((item,i)=>(0,jsx_runtime.jsx)(MenuItem.A,{value:item,style:menuItemStyle,children:item},i)))}):schema.enum&&!Array.isArray(schema.enum)?(0,jsx_runtime.jsx)(Select.A,{variant:"standard",disableUnderline:!0,disabled,style:(0,objectSpread2.A)({flexGrow:"outlined"===variant?1:"unset"},selectStyle),defaultValue:schema.default,value:model&&model_id&&schema.enum[model[model_id]]||schema.default||schema.enum[0],onChange:e=>onChange(model_id,parseInt(Object.keys(schema.enum).find((en=>schema.enum[en]===e.target.value))||"0",10)),children:Object.keys(schema.enum).map(((item,i)=>(0,jsx_runtime.jsx)(MenuItem.A,{value:schema.enum[item],children:schema.enum[item]},i)))}):(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(TextField.A,{variant:"standard",inputRef,type:null!==(_schema$description=schema.description)&&void 0!==_schema$description&&_schema$description.includes("password")?"password":"unset",helperText:!hideDesc&&schema.description,slotProps:{input:"icon_name"===schema.id?{startAdornment:(0,jsx_runtime.jsx)(InputAdornment.A,{position:"start",children:(0,jsx_runtime.jsx)(BladeIcon.A,{name:icon,style:{color:"#eee"}})}),disableUnderline:!0}:{disableUnderline:!0}},defaultValue:model&&model_id&&model[model_id]||schema.enum&&schema.enum[0]||schema.default||"",onBlur:e=>onChange(model_id,e.target.value),onChange:e=>{"icon_name"===schema.id&&setIcon(e.target.value);"Name"===schema.title&&["gap-","-background","-foreground","-mask"].some((part=>e.target.value.startsWith(part)||e.target.value.endsWith(part)))?(setShowReserved(!0),inputRef.current.value=e.target.value.replace(/(gap-|-background|-foreground|-mask)/g,"")):(setShowReserved(!1),inputRef.current.value=e.target.value)},style:textStyle}),showReserved&&(0,jsx_runtime.jsx)(Alert.A,{severity:"warning",onClick:()=>setShowReserved(!showReserved),sx:{marginTop:1,width:"400px"},children:(0,jsx_runtime.jsx)(Typography.A,{variant:"caption",children:"Reserved word removed"})}),"image_location"===schema.id&&(0,jsx_runtime.jsx)(Gif_GifPicker,{onChange:gif=>{onChange(model_id,gif),inputRef.current.value=gif}}),"beat_frames"===schema.id&&model.image_location&&""!==model.image_location&&(0,jsx_runtime.jsx)(Gif_GifFramePicker,{model,onChange:gif=>{onChange(model_id,gif),inputRef.current.value=gif}}),"auth_token"===model_id&&"nanoleaf"===type&&(0,jsx_runtime.jsx)(Tooltip.A,{title:void 0===model.ip_address||""===model.ip_address?"please enter ip address of nanoleaf controller":"please hold power on nanoleaf controller for 7 seconds until white leds scan left to right and then press this button to acquire auth token",children:(0,jsx_runtime.jsx)(Button.A,{sx:{fontSize:10,height:56,color:void 0===model.ip_address||""===model.ip_address?"grey":"inherit"},onClick:async()=>{if(void 0===model.ip_address||""===model.ip_address)return;const{auth_token}=await(0,ledfx.U)("/api/get_nanoleaf_token","POST",{ip_address:model.ip_address,port:model.port||16021});onChange(model_id,auth_token),inputRef.current.value=auth_token},children:"Get Token"})})]})})},String_BladeSelect=BladeSelect;BladeSelect.__docgenInfo={description:"## String\n### render as `input field` or `select`\nRenders select if schema.enum is defined properly",methods:[],displayName:"BladeSelect",props:{variant:{required:!1,tsType:{name:"union",raw:"'outlined' | 'contained'",elements:[{name:"literal",value:"'outlined'"},{name:"literal",value:"'contained'"}]},description:"",defaultValue:{value:"'outlined'",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},schema:{required:!1,tsType:{name:"any"},description:""},model:{required:!1,tsType:{name:"any"},description:""},model_id:{required:!1,tsType:{name:"string"},description:""},onChange:{required:!1,tsType:{name:"any"},description:""},index:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},required:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},wrapperStyle:{required:!1,tsType:{name:"CSSProperties"},description:"",defaultValue:{value:"{ margin: '0.5rem', flexBasis: '49%', width: 'unset' }",computed:!1}},selectStyle:{required:!1,tsType:{name:"CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}},textStyle:{required:!1,tsType:{name:"CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}},menuItemStyle:{required:!1,tsType:{name:"CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}},hideDesc:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"JsxElement"},description:""},type:{required:!1,tsType:{name:"string"},description:""}}}}}]);