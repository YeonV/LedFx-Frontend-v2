"use strict";(self.webpackChunkledfx=self.webpackChunkledfx||[]).push([[482],{"./src/components/SchemaForm/SchemaForm/SchemaForm.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_mui_material_styles__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),_mui_material__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/@mui/material/Select/Select.js"),_mui_material__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/@mui/material/ListSubheader/ListSubheader.js"),_mui_material__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/@mui/material/MenuItem/MenuItem.js"),_mui_material__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__("./node_modules/@mui/material/Divider/Divider.js"),_mui_material__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__("./node_modules/@mui/material/FormControlLabel/FormControlLabel.js"),_mui_material__WEBPACK_IMPORTED_MODULE_15__=__webpack_require__("./node_modules/@mui/material/Switch/Switch.js"),_mui_material__WEBPACK_IMPORTED_MODULE_16__=__webpack_require__("./node_modules/@mui/material/DialogContentText/DialogContentText.js"),_mui_icons_material__WEBPACK_IMPORTED_MODULE_17__=__webpack_require__("./node_modules/@mui/icons-material/esm/Info.js"),_mui_icons_material_Mic__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./node_modules/@mui/icons-material/esm/Mic.js"),_mui_icons_material_Speaker__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./node_modules/@mui/icons-material/esm/Speaker.js"),_components_Boolean_BladeBoolean__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/SchemaForm/components/Boolean/BladeBoolean.tsx"),_components_String_BladeSelect__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/SchemaForm/components/String/BladeSelect.tsx"),_components_Number_BladeSlider__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/SchemaForm/components/Number/BladeSlider.tsx"),_components_BladeFrame__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/components/SchemaForm/components/BladeFrame.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/react/jsx-runtime.js");const classes={bladeSchemaForm:"".concat("SchemaForm","-bladeSchemaForm"),FormListHeaders:"".concat("SchemaForm","-FormListHeaders"),bladeSelect:"".concat("SchemaForm","-bladeSelect")},Root=(0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_6__.Ay)("div")((_ref=>{let{theme}=_ref;return{["& .".concat(classes.bladeSchemaForm)]:{display:"flex",flexWrap:"wrap",justifyContent:"space-between"},["& .".concat(classes.FormListHeaders)]:{background:theme.palette.secondary.main,color:"#fff"},["& .".concat(classes.bladeSelect)]:{"& .MuiSelect-select":{display:"flex",alignItems:"center"}}}})),SchemaForm=_ref2=>{let{schema,model,hideToggle,onModelChange,type}=_ref2;const[hideDesc,setHideDesc]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!0),yzSchema=schema&&schema.properties&&Object.keys(schema.properties).map((sk=>(0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_7__.A)((0,_home_runner_work_LedFx_Frontend_v2_LedFx_Frontend_v2_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_7__.A)({},schema.properties[sk]),{},{id:sk,required:schema.required&&-1!==schema.required.indexOf(sk),permitted:!schema.permitted_keys||schema.permitted_keys.indexOf(sk)>-1}))).sort(((a,_b)=>a.required?-1:1)).sort(((a,_b)=>"name"===a.id?-1:1));function onlyUnique(value,index,self){return self.indexOf(value)===index}return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(Root,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div",{className:classes.bladeSchemaForm,children:yzSchema&&yzSchema.map(((s,i)=>{var _s$enum;switch(s.type){case"boolean":return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Boolean_BladeBoolean__WEBPACK_IMPORTED_MODULE_1__.A,{hideDesc,index:i,model,model_id:s.id,required:s.required,style:{margin:"0.5rem 0",flexBasis:"49%"},schema:s,onClick:(model_id,value)=>{const c={};return c[model_id]=value,onModelChange?onModelChange(c):null}},i);case"string":{var _audio_groups,_audio_groups2;const group={};let audio_groups=[];if("audio_device"===s.id){var _schema$properties$au2;for(const[key,value]of Object.entries(null===(_schema$properties$au=schema.properties.audio_device)||void 0===_schema$properties$au?void 0:_schema$properties$au.enum)){var _schema$properties$au;"string"==typeof value&&(group[null==value?void 0:value.split(":")[0]]||(group[value.split(":")[0]]={}),group[value.split(":")[0]][key]=value.split(":")[1])}audio_groups=Object.values(null===(_schema$properties$au2=schema.properties.audio_device)||void 0===_schema$properties$au2?void 0:_schema$properties$au2.enum).map((d=>d.split(":")[0])).filter(onlyUnique)}return null!==(_audio_groups=audio_groups)&&void 0!==_audio_groups&&_audio_groups.length?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_BladeFrame__WEBPACK_IMPORTED_MODULE_4__.A,{style:{order:-1},title:"Audio Device",full:!0,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_8__.A,{value:model&&model.audio_device||0,fullWidth:!0,onChange:e=>{const c={};return c.audio_device=parseInt(e.target.value,10),onModelChange?onModelChange(c):null},className:classes.bladeSelect,id:"grouped-select",children:null===(_audio_groups2=audio_groups)||void 0===_audio_groups2?void 0:_audio_groups2.map(((c,ind)=>[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_9__.A,{className:classes.FormListHeaders,color:"primary",children:c},ind),Object.keys(group[c]).map((e=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_10__.A,{value:e,children:[group[c][e].indexOf("[Loopback]")>-1?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_icons_material_Speaker__WEBPACK_IMPORTED_MODULE_11__.A,{style:{marginRight:"10px"}}):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_icons_material_Mic__WEBPACK_IMPORTED_MODULE_12__.A,{style:{marginRight:"10px"}}),group[c][e].replace("[Loopback]","")]})))]))})},i):!("mqtt_hass"===type&&"name"===s.id||"mqtt_hass"===type&&"description"===s.id)&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_String_BladeSelect__WEBPACK_IMPORTED_MODULE_2__.A,{children:void 0,hideDesc,type,model,disabled:!s.permitted,wrapperStyle:{margin:"0.5rem 0",width:"49%",flexBasis:"unset"},textStyle:{width:"100%"},schema:s,required:s.required,model_id:s.id,index:i,onChange:(model_id,value)=>{const c={};return c[model_id]=value,onModelChange?onModelChange(c):null}},i)}case"number":return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Number_BladeSlider__WEBPACK_IMPORTED_MODULE_3__.A,{step:void 0,hideDesc,disabled:!s.permitted,model_id:s.id,model,required:s.required,schema:s,onChange:(model_id,value)=>{const c={};return c[model_id]=value,onModelChange?onModelChange(c):null}},i);case"integer":return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Number_BladeSlider__WEBPACK_IMPORTED_MODULE_3__.A,{full:"delay_ms"===s.id,hideDesc,disabled:!s.permitted,step:1,model_id:s.id,model,required:s.required,schema:s,textfield:!1,marks:void 0,index:void 0,style:{margin:"0.5rem 0",width:"49%"},onChange:(model_id,value)=>{const c={};return c[model_id]=value,onModelChange?onModelChange(c):null}},i);case"int":return(null==s||null===(_s$enum=s.enum)||void 0===_s$enum?void 0:_s$enum.length)>10?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Number_BladeSlider__WEBPACK_IMPORTED_MODULE_3__.A,{hideDesc,disabled:!s.permitted,marks:null==s?void 0:s.enum,step:void 0,model_id:s.id,model,required:s.required,schema:s,textfield:!1,style:{margin:"0.5rem 0",width:"49%"},onChange:(model_id,value)=>{const c={};return c[model_id]=value,onModelChange?onModelChange(c):null}},i):(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_Number_BladeSlider__WEBPACK_IMPORTED_MODULE_3__.A,{hideDesc,disabled:!s.permitted,marks:null==s?void 0:s.enum,step:void 0,model_id:s.id,model,required:s.required,schema:s,textfield:!1,style:{margin:"0.5rem 0",width:"49%"},onChange:(model_id,value)=>{const c={};return c[model_id]=value,onModelChange?onModelChange(c):null}},i);default:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment,{children:["Unsupported type:",s.type]})}}))}),!hideToggle&&(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment,{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_13__.A,{style:{margin:"1rem 0 0.5rem 0"}}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_14__.A,{value:"start",control:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_15__.A,{checked:!hideDesc,onChange:_e=>setHideDesc(!hideDesc)}),label:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_16__.A,{style:{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:0},children:["Show help text for fields",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_mui_icons_material__WEBPACK_IMPORTED_MODULE_17__.A,{style:{marginLeft:"0.5rem"}})]}),labelPlacement:"end"})]})]})},__WEBPACK_DEFAULT_EXPORT__=SchemaForm;SchemaForm.__docgenInfo={description:"Dynamically render Forms based on a `schema` <br />\nmost schemas retrived from ledfx/api/schema are read-only <br />\nto enable write, please provide the key `permitted_keys`",methods:[],displayName:"SchemaForm",props:{schema:{required:!0,tsType:{name:"Schema"},description:"Schema to generate Form from. <br />\nin production this is provided by <br />\nan external api or a store-management. <br />\nSee examples, for manual usage..."},model:{required:!0,tsType:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>"},description:"Model is the current value of the schema"},hideToggle:{required:!1,tsType:{name:"boolean"},description:"Hide Field-Description Toggle"},onModelChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: any) => typeof e",signature:{arguments:[{type:{name:"any"},name:"e"}],return:{name:"e"}}},description:"onChange function for the given model"},type:{required:!1,tsType:{name:"string"},description:"internal"}}}},"./src/components/SchemaForm/components/Boolean/BBolean.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _mui_material__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@mui/material/Switch/Switch.js"),_mui_material__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@mui/material/Typography/Typography.js"),_mui_material__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@mui/material/Checkbox/Checkbox.js"),_mui_material__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@mui/material/Button/Button.js"),_BladeFrame__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/SchemaForm/components/BladeFrame.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const BBoolean=_ref=>{let{index,required,style,type="switch",onChange,defaultValue,value,title="",description="",hideDesc=!1}=_ref;switch(type){case"switch":return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_BladeFrame__WEBPACK_IMPORTED_MODULE_0__.A,{index,required,style,title,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_2__.A,{defaultValue:defaultValue||value,checked:value,onChange,name:title,color:"primary"}),!hideDesc&&description?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(_mui_material__WEBPACK_IMPORTED_MODULE_3__.A,{variant:"body2",className:"MuiFormHelperText-root",children:[description," "]}):null]});case"checkbox":return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_BladeFrame__WEBPACK_IMPORTED_MODULE_0__.A,{index,title,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_4__.A,{defaultValue:defaultValue||value,checked:value,onChange,name:title,color:"primary"})});case"button":return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_mui_material__WEBPACK_IMPORTED_MODULE_5__.A,{color:"primary",variant:value?"contained":"outlined",onClick:onChange,children:title});default:return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div",{children:"unset"})}},__WEBPACK_DEFAULT_EXPORT__=BBoolean;BBoolean.__docgenInfo={description:"## Boolean\n### render as `switch`,`checkbox` or `button`",methods:[],displayName:"BBoolean",props:{index:{required:!1,tsType:{name:"number"},description:""},required:{required:!1,tsType:{name:"boolean"},description:""},style:{required:!1,tsType:{name:"any"},description:""},type:{required:!1,tsType:{name:"union",raw:"'switch' | 'checkbox' | 'button'",elements:[{name:"literal",value:"'switch'"},{name:"literal",value:"'checkbox'"},{name:"literal",value:"'button'"}]},description:"",defaultValue:{value:"'switch'",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(_e: any) => void",signature:{arguments:[{type:{name:"any"},name:"_e"}],return:{name:"void"}}},description:""},defaultValue:{required:!1,tsType:{name:"any"},description:""},value:{required:!0,tsType:{name:"boolean"},description:""},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},description:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},hideDesc:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}}},"./src/components/SchemaForm/components/Boolean/BladeBoolean.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _BBolean__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/SchemaForm/components/Boolean/BBolean.tsx"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");const BladeBoolean=_ref=>{let{onClick,index,required,style,type="switch",schema,model,hideDesc=!1,model_id}=_ref;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_BBolean__WEBPACK_IMPORTED_MODULE_0__.A,{index,required,style,type,onChange:()=>onClick(model_id,model&&!model[model_id]),defaultValue:model&&model[model_id]||schema.default,value:!!model&&!!model[model_id],title:schema.title.replaceAll("_"," ").replaceAll("Color","c"),description:schema.description,hideDesc})},__WEBPACK_DEFAULT_EXPORT__=BladeBoolean;BladeBoolean.__docgenInfo={description:"## Boolean for SchemaForm\n### render as `switch`,`checkbox` or `button`",methods:[],displayName:"BladeBoolean",props:{index:{required:!1,tsType:{name:"number"},description:""},required:{required:!1,tsType:{name:"boolean"},description:""},style:{required:!1,tsType:{name:"any"},description:""},onClick:{required:!1,tsType:{name:"any"},description:""},type:{required:!1,tsType:{name:"union",raw:"'switch' | 'checkbox' | 'button'",elements:[{name:"literal",value:"'switch'"},{name:"literal",value:"'checkbox'"},{name:"literal",value:"'button'"}]},description:"",defaultValue:{value:"'switch'",computed:!1}},schema:{required:!1,tsType:{name:"any"},description:""},model:{required:!1,tsType:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>"},description:""},hideDesc:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},model_id:{required:!0,tsType:{name:"string"},description:""}}}},"./src/components/SchemaForm/components/Number/BladeSlider.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>Number_BladeSlider});var objectSpread2=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectSpread2.js"),react=__webpack_require__("./node_modules/react/index.js"),useTheme=__webpack_require__("./node_modules/@mui/material/styles/useTheme.js"),Slider=__webpack_require__("./node_modules/@mui/material/Slider/Slider.js"),Typography=__webpack_require__("./node_modules/@mui/material/Typography/Typography.js"),Input=__webpack_require__("./node_modules/@mui/material/Input/Input.js"),TextField=__webpack_require__("./node_modules/@mui/material/TextField/TextField.js"),Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js");const BladeSlider_styles=(0,__webpack_require__("./node_modules/@mui/styles/makeStyles/makeStyles.js").A)((()=>({input:{marginLeft:"1rem",paddingLeft:"0.5rem",borderRadius:"5px",paddingTop:"3px"},wrapper:{width:"49%",padding:"16px 1.2rem 6px 1.2rem",borderRadius:"10px",position:"relative",display:"flex",margin:"0.5rem 0","@media (max-width: 580px)":{width:"100% !important"},"& > label":{top:"-0.75rem",display:"flex",alignItems:"center",left:"1rem",padding:"0 0.3rem",position:"absolute",fontVariant:"all-small-caps",fontSize:"0.9rem",letterSpacing:"0.1rem",boxSizing:"border-box"},"& .sortable-handler":{touchAction:"none"}}})));var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const BladeSliderInner=_ref=>{let{schema,model,model_id="",step,onChange,textfield,style,disabled,marks,hideDesc,full}=_ref;const classes=BladeSlider_styles(),theme=(0,useTheme.A)(),[value,setValue]=(0,react.useState)("number"===(model_id&&typeof model[model_id])?model_id&&model[model_id]:"number"==typeof schema.default?schema.default:1),handleSliderChange=(_event,newValue)=>{newValue!==value&&setValue(newValue)};return(0,react.useEffect)((()=>{setValue(model_id&&"number"==typeof model[model_id]?model[model_id]:"number"==typeof schema.default?schema.default:1)}),[model,model_id,schema.default]),schema.maximum&&!textfield?(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsxs)("div",{style:{width:"100%"},children:[(0,jsx_runtime.jsx)(Slider.Ay,{"aria-labelledby":"input-slider",valueLabelDisplay:"auto",disabled,step:step||(schema.maximum>1?.1:.01),valueLabelFormat:"delay_ms"===model_id?"".concat("number"==typeof value?value:0," ms"):"".concat("number"==typeof value?value:0),min:schema.minimum||0,max:schema.maximum,value:"number"==typeof value?value:0,onChange:handleSliderChange,className:"slider-".concat(full?"full":"half"),onChangeCommitted:(e,b)=>onChange(model_id,b),style:(0,objectSpread2.A)((0,objectSpread2.A)({color:"#aaa"},style),{},{width:"100%"})}),!hideDesc&&schema.description?(0,jsx_runtime.jsxs)(Typography.A,{variant:"body2",className:"MuiFormHelperText-root",children:[schema.description," "]}):null]}),(0,jsx_runtime.jsx)(Input.A,{disableUnderline:!0,disabled,className:classes.input,style:"delay_ms"===model_id?{minWidth:90,textAlign:"right",paddingTop:0,backgroundColor:theme.palette.divider}:{backgroundColor:theme.palette.divider,minWidth:75},value,margin:"dense",onChange:event=>{value!==event.target.value&&(setValue(""===event.target.value?"":Number(event.target.value)),event.target.value<schema.minimum?setValue(schema.minimum):event.target.value>schema.maximum&&setValue(schema.maximum),onChange(model_id,Number(event.target.value)))},onBlur:()=>{value<schema.minimum?setValue(schema.minimum):value>schema.maximum&&setValue(schema.maximum)},endAdornment:"delay_ms"===model_id?"ms ":null,inputProps:{step:step||(schema.maximum>1?.1:.01),min:schema.minimum||0,max:schema.maximum,type:"number","aria-labelledby":"input-slider"}})]}):schema.enum&&!textfield?(0,jsx_runtime.jsx)(Slider.Ay,{"aria-labelledby":"input-slider",valueLabelDisplay:"auto",disabled,marks:marks.map(((m,i)=>({value:m,label:0===i||i===marks.length-1?m:""}))),step:null,min:marks[0],max:marks[marks.length-1],value:"number"==typeof value?value:0,onChange:handleSliderChange,onChangeCommitted:(e,b)=>onChange(model_id,b),style:(0,objectSpread2.A)((0,objectSpread2.A)({},style),{},{width:"100%"})}):(0,jsx_runtime.jsx)(TextField.A,{disabled,variant:"standard",slotProps:{input:{disableUnderline:!0,endAdornment:"delay_ms"===model_id?"ms":null}},type:"number",value,onChange:event=>{value<schema.minimum?setValue(schema.minimum):value>schema.maximum&&setValue(schema.maximum),onChange(model_id,Number(event.target.value))},helperText:!hideDesc&&schema.description,style:(0,objectSpread2.A)((0,objectSpread2.A)({},style),{},{width:"100%",backgroundColor:theme.palette.background.paper})})},BladeSlider=_ref2=>{let{variant="outlined",schema={title:"Slide me"},model,model_id="",step,onChange,marks,index,required=!1,textfield=!1,disabled=!1,hideDesc=!1,style={},full=!1}=_ref2;const classes=BladeSlider_styles(),theme=(0,useTheme.A)();return"outlined"===variant?(0,jsx_runtime.jsxs)(Box.A,{className:"".concat(classes.wrapper," step-effect-").concat(index),sx:(0,objectSpread2.A)((0,objectSpread2.A)({},style),{},{border:"1px solid",borderColor:theme.palette.divider,width:full?"100%":style.width,"& > label":{backgroundColor:theme.palette.background.paper},"& .MuiSliderValueLabel > span":{backgroundColor:theme.palette.background.paper}}),children:[(0,jsx_runtime.jsxs)("label",{style:{color:disabled?theme.palette.text.disabled:theme.palette.text.primary},className:"MuiFormLabel-root",children:[schema.title,required?"*":""]}),(0,jsx_runtime.jsx)(BladeSliderInner,{style,schema,model,model_id,disabled,step,onChange,textfield,marks,hideDesc})]}):(0,jsx_runtime.jsx)(BladeSliderInner,{style,step,schema,model,model_id,onChange,disabled,textfield,marks,hideDesc})},Number_BladeSlider=BladeSlider;BladeSlider.__docgenInfo={description:"## Number\n### render as `input fields` or `sliders`\nRenders slider if:\n\n - schema.maximum && !textfield\n - schema.enum && !textfield",methods:[],displayName:"BladeSlider",props:{variant:{required:!1,tsType:{name:"string"},description:"`outlined` or not. More might come",defaultValue:{value:"'outlined'",computed:!1}},schema:{required:!1,tsType:{name:"any"},description:"Renders slider if:\n\n - schema.maximum && !textfield\n - schema.enum && !textfield\n\nElse: renders input field",defaultValue:{value:"{\n  title: 'Slide me'\n}",computed:!1}},model:{required:!1,tsType:{name:"any"},description:"current value representation of schema",defaultValue:{value:"undefined",computed:!0}},model_id:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},step:{required:!1,tsType:{name:"number"},description:"if steps not provided it will be calculated like:\n`schema.maximum > 1 ? 0.1 : 0.01`",defaultValue:{value:"undefined",computed:!0}},onChange:{required:!1,tsType:{name:"any"},description:"",defaultValue:{value:"undefined",computed:!0}},marks:{required:!1,tsType:{name:"any"},description:"",defaultValue:{value:"undefined",computed:!0}},index:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"undefined",computed:!0}},required:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},textfield:{required:!1,tsType:{name:"boolean"},description:"Forces input field rendering.\nno slider",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},hideDesc:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},style:{required:!1,tsType:{name:"any"},description:"",defaultValue:{value:"{}",computed:!1}},full:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}}}}]);