"use strict";(self.webpackChunktenk_template_gatsby=self.webpackChunktenk_template_gatsby||[]).push([[691],{2755:function(e,n,t){t.d(n,{Z:function(){return c}});var r=t(7294),a=t(5444),i=function(e){var n=e.siteTitle,t=void 0===n?"":n;return r.createElement("header",{style:{background:"rebeccapurple",marginBottom:"1.45rem"}},r.createElement("div",{style:{margin:"0 auto",maxWidth:960,padding:"1.45rem 1.0875rem"}},r.createElement("h1",{style:{margin:0}},r.createElement(a.Link,{to:"/",style:{color:"white",textDecoration:"none"}},t))))},l=t(1452),c=function(e){var n=e.title,t=e.children,c=(0,l.Z)(),u=c.find((function(e){return e.current}));return r.createElement(r.Fragment,null,r.createElement(i,{siteTitle:n}),r.createElement("div",{style:{margin:"0 auto",maxWidth:960,padding:"0 1.0875rem 1.45rem"}},r.createElement("main",null,t),u&&r.createElement("footer",{style:{marginTop:"2rem",display:"flex",alignItems:"center"}},r.createElement("div",{role:"img",style:{marginRight:"0.5em"},"aria-label":"globe"},"🌐",r.createElement("span",{className:"visuallyHidden"},c.map((function(e){return e.i18n.viewIn})).join(" | "))),r.createElement("select",{defaultValue:u.id,onChange:function(e){return(0,a.navigate)("../"+e.target.value)}},c.map((function(e){return r.createElement("option",{key:e.id,value:e.id},e.id," - ",e.i18n.langPicker)}))))))}},1452:function(e,n,t){t.d(n,{Z:function(){return i}});var r=t(5444),a=t(9499);function i(){var e=(0,r.useStaticQuery)("3545471372").allFile,n=(0,a.useLocation)().pathname;return e.nodes.map((function(e){return{current:new RegExp("/"+e.name).test(n),id:e.name,i18n:e.childI18NJson}}))}},6738:function(e,n,t){t.r(n);var r=t(7294),a=t(5444),i=t(1452),l=t(2755);n.default=function(){var e=(0,i.Z)();return r.useEffect((function(){var n=window.navigator.language,t=e.find((function(e){return e.id.replace("_","-")===n}));t||(t=e.find((function(e){return e.id===n.replace(/-[A-Z]{2}/,"")}))),t&&(console.log({locales:e,preferredLocale:n,matchingLocale:t}),(0,a.navigate)("/"+t.id+"/"))}),[]),r.createElement(l.Z,null,e.map((function(e){var n=e.id,t=e.i18n;return r.createElement("p",{key:n},r.createElement(a.Link,{to:"/"+n+"/"},t.viewIn))})))}}}]);
//# sourceMappingURL=component---src-pages-index-tsx-07a63f8b339374fd4c28.js.map