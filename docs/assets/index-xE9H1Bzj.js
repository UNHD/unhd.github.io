(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Tu="modulepreload",Au=function(s){return"/"+s},Il={},wu=function(e,t,n){let i=Promise.resolve();if(t&&t.length>0){let c=function(l){return Promise.all(l.map(h=>Promise.resolve(h).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=a?.nonce||a?.getAttribute("nonce");i=c(t.map(l=>{if(l=Au(l),l in Il)return;Il[l]=!0;const h=l.endsWith(".css"),u=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${u}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":Tu,h||(d.as="script"),d.crossOrigin="",d.href=l,o&&d.setAttribute("nonce",o),document.head.appendChild(d),h)return new Promise((f,g)=>{d.addEventListener("load",f),d.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return i.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};var Cu=["0","1","2","3","4","5","6","7","8","9"],ds=new Map,Ru=/[\u0590-\u08ff\u200e\u200f\u202a-\u202e\u2066-\u2069\ufb1d-\ufeff]/u;function Pu(s={}){let e=Intl.getCanonicalLocales(s.locales),t=Object.fromEntries(Object.entries(s.format??{}).sort(([r],[a])=>r.localeCompare(a))),n=JSON.stringify([e,t]),i=ds.get(n);if(!i){i=new Intl.NumberFormat(e,t);let r=ds.keys().next().value;ds.size>=64&&r!==void 0&&ds.delete(r),ds.set(n,i)}return i}function Du(s,e={}){let t=Pu(e),n=t.formatToParts(s),i=n.map(g=>g.value).join(""),r=t.resolvedOptions(),a=r.numberingSystem==="latn"&&r.notation==="standard"&&!Ru.test(i)&&!n.some(g=>g.type==="nan"||g.type==="infinity"),o=JSON.stringify(r);if(!a)return{text:i,tokens:[],rollable:a,signature:o,magnitude:""};let c=n.filter(g=>g.type==="integer").reduce((g,_)=>g+_.value.length,0),l=-1,h=new Map,u=[],d="",f="";for(let g of n)if(g.type==="integer"||g.type==="fraction"){g.type==="integer"?d+=g.value:f+=g.value;for(let _ of g.value){let m=`digit:${g.type==="integer"?--c:l--}`;u.push({key:m,identity:m,text:_,wheel:Cu,index:Number(_)})}}else if(g.type==="group"){let _=`group:${c}`;u.push({key:`${_}:${g.value}`,identity:_,text:g.value})}else{let _=h.get(g.type)??0;h.set(g.type,_+1);let m=g.type==="plusSign"||g.type==="minusSign"?"sign":g.type;u.push({key:`${g.type}:${_}:${g.value}`,identity:`${m}:${_}`,text:g.value})}return{text:i,tokens:u,rollable:a,signature:o,magnitude:`${d.replace(/^0+(?=\d)/u,"")}.${f}`}}function Iu(s,e){let[t="",n=""]=s.magnitude.split("."),[i="",r=""]=e.magnitude.split(".");if(t.length!==i.length)return i.length>t.length?1:-1;if(t!==i)return i>t?1:-1;let a=Math.max(n.length,r.length),o=n.padEnd(a,"0"),c=r.padEnd(a,"0");return c===o?0:c>o?1:-1}function Nu(s,e,t=.14){return{target:0,duration:e,points:Array.from({length:49},(n,i)=>{if(i===48)return 0;let r=Math.max(0,Math.min(1,(i/48-t)/(1-t)));return s*(1+10*r)*Math.exp(-10*r)})}}function Ys(s,e){if(e<=0||s.duration<=0)return s;let t=s.duration+e,n=Math.round((s.points.length-1)*t/s.duration)+1,i=s.points[0]??s.target;return{target:s.target,duration:t,points:Array.from({length:n},(r,a)=>{if(a===n-1)return s.target;let o=a/(n-1)*t-e;return o<=0?i:Eh(s,o).position})}}function Yn(s,e,t,n){if(n<=0)return{points:[e,e],duration:0,target:e};let i=n/1e3,r=s-e,a=Math.max(Math.abs(r),1)*12/i,o=Math.max(-a,Math.min(a,t))*i;return{points:Array.from({length:49},(c,l)=>{if(l===48)return e;let h=l/48;return e+(r+(o+10*r)*h)*Math.exp(-10*h)}),duration:n,target:e}}function Uu(s,e=0,t=24){if(s.duration<=0)return{points:[0,0],duration:0,target:0};let n=s.duration/(s.points.length-1)/1e3;return{duration:s.duration,target:0,points:s.points.map((i,r,a)=>{if(r===0)return Math.max(0,Math.min(1,e));if(r===a.length-1)return 0;let o=Math.abs((a[r+1]-a[r-1])/(2*n)),c=t/6;return Math.max(0,Math.min(1,(o-c)/(t-c)))})}}function Eh(s,e){if(e>=s.duration||s.duration===0)return{position:s.target,velocity:0};let t=Math.max(0,e)/s.duration*(s.points.length-1),n=Math.min(Math.floor(t),s.points.length-2),i=s.points[n]??s.target,r=s.points[n+1]??s.target;return{position:i+(r-i)*(t-n),velocity:(r-i)*(s.points.length-1)*1e3/s.duration}}function Nl(s,e,t,n=10){let i=Math.floor(s/n)*n+e;return t>0&&i<s-.001?i+=n:t<0&&i>s+.001?i-=n:t===0&&(i+=Math.round((s-i)/n)*n),i}var Rr=(s,e)=>s[(e%s.length+s.length)%s.length];function Fu(s,e,t){let n=Math.floor(e),i=e-n,r=[Rr(s,n)];return i>1e-5&&r.push(Rr(s,n+1)),r.at(-1)!==t&&r.push(t),{wheel:r,from:i,target:r.length-1}}function Ou(s,e="outward"){if(e!=="outward"){let i=s.map((a,o)=>a?-1:o).filter(a=>a>=0);e==="end"&&i.reverse();let r=s.map(a=>a?0:1);return e!=="none"&&i.forEach((a,o)=>{r[a]=o+1}),r}let t=s.map((i,r)=>i?0:r+1);if(!s.includes(!0))return t;let n=-1/0;for(let i=0;i<s.length;i++)s[i]?n=i:t[i]=i-n;n=1/0;for(let i=s.length-1;i>=0;i--)s[i]?n=i:t[i]=Math.min(t[i],n-i);return t}function Ul(s,e){let t=new Map,n=[],i=0;for(let r of s){let a=e.get(r);if(!a){n.push(r);continue}for(let o of n)t.set(o,a.x);n.length=0,i=a.x+a.width}for(let r of n)t.set(r,i);return t}var qr=new WeakMap;class jo{view;media;members=new Set;pending=new Set;sizes=new WeakMap;intersections=new WeakMap;resize;intersection;frame=0;static for(e){let t=qr.get(e);return t||(t=new jo(e),qr.set(e,t)),t}constructor(e){this.view=e,this.media=e.matchMedia("(prefers-reduced-motion: reduce)"),this.media.addEventListener("change",this.refresh),e.document.addEventListener("visibilitychange",this.refresh),e.document.fonts?.addEventListener("loadingdone",this.refresh),e.document.fonts?.ready.then(this.refresh),e.ResizeObserver&&(this.resize=new e.ResizeObserver(t=>{for(let n of t){let i=this.sizes.get(n.target);i?.sizeChanged(n.target,n.contentRect.width,n.contentRect.height)&&i.refresh()}})),e.IntersectionObserver&&(this.intersection=new e.IntersectionObserver(t=>{for(let n of t)this.intersections.get(n.target)?.visibility(n.isIntersecting)},{rootMargin:"64px"}))}refresh=()=>{for(let e of this.members)e.refresh()};add(e,t){this.members.add(e),this.intersections.set(t,e),this.intersection?.observe(t)}watch(e,t){this.sizes.set(e,t),this.resize?.observe(e)}unwatch(e){this.resize?.unobserve(e),this.sizes.delete(e)}enqueue(e){this.pending.add(e),!this.frame&&(this.frame=this.view.requestAnimationFrame(()=>{this.frame=0;let t=[...this.pending];this.pending.clear();let n=t.map(r=>r.stage());for(let r of n)r?.();let i=t.map(r=>r.measure());for(let r of i)r?.()}))}remove(e,t){this.pending.delete(e),this.members.delete(e),this.intersection?.unobserve(t),this.intersections.delete(t),!this.members.size&&(this.view.cancelAnimationFrame(this.frame),this.resize?.disconnect(),this.intersection?.disconnect(),this.media.removeEventListener("change",this.refresh),this.view.document.removeEventListener("visibilitychange",this.refresh),this.view.document.fonts?.removeEventListener("loadingdone",this.refresh),qr.delete(this.view))}}var Fl=new WeakMap;function zi(s,e,t){let n=s.animate(e,t),i=s.ownerDocument.timeline?.currentTime;return typeof i=="number"&&n.playState==="running"&&(n.startTime=i),n}function Ol(s){let e=s.ownerDocument.defaultView;if(!e)return!1;let t=Fl.get(e);return t===void 0&&(t=e.CSS?.supports("animation-timing-function","linear(0, 1)")??!1,Fl.set(e,t)),t}class Vi{element;property;animation;motion;value=0;constructor(e,t){this.element=e,this.property=t}read(){let e=this.animation?.currentTime;return this.animation&&this.motion?Eh(this.motion,typeof e=="number"?e:0):{position:this.value,velocity:0}}set(e,t){this.cancel(),this.value=e,this.element.style.setProperty(this.property,t(e))}play(e,t,n){if(this.cancel(),this.value=e.target,this.element.style.setProperty(this.property,t(e.target)),!e.duration||e.points.every(u=>u===e.target)){n?.();return}let i=e.points[0]??e.target,r=e.target-i,a=this.property==="opacity"&&Ol(this.element),o=this.property==="transform"&&Math.abs(r)>1e-5&&Ol(this.element),c=a?[{opacity:0},{opacity:1}]:o?[{[this.property]:t(i)},{[this.property]:t(e.target)}]:e.points.map(u=>({[this.property]:t(u)})),l=a?`linear(${e.points.map(t).join(",")})`:o?`linear(${e.points.map(u=>Number(((u-i)/r).toFixed(6))).join(",")})`:"linear",h=zi(this.element,c,{duration:e.duration,easing:l});this.animation=h,this.motion=e,h.onfinish=()=>{this.animation===h&&(this.animation=void 0,this.motion=void 0,h.onfinish=null,h.cancel(),n?.())}}cancel(){this.animation&&(this.animation.onfinish=null,this.animation.cancel(),this.animation=void 0),this.motion=void 0}}var jr="http://www.w3.org/2000/svg",Bu=0;class Kr{host;layers=new Map;filter;intensity=1;constructor(e){this.host=e}filterUrl(e){if(!this.filter){let n=this.host.ownerDocument,i=n.createElementNS(jr,"svg");i.classList.add("rn-blur-defs"),i.setAttribute("aria-hidden","true"),i.setAttribute("focusable","false");let r=n.createElementNS(jr,"filter"),a;do a=`rn-vertical-blur-${++Bu}`;while(n.getElementById(a));r.id=a,r.setAttribute("x","-15%"),r.setAttribute("width","130%"),r.setAttribute("color-interpolation-filters","sRGB");let o=n.createElementNS(jr,"feGaussianBlur");r.append(o),i.append(r),this.host.append(i),this.filter={svg:i,blur:o,id:a,height:0}}let t=e*.035*this.intensity;return this.filter.height!==t&&(this.filter.blur.setAttribute("stdDeviation",`0 ${t}`),this.filter.height=t),`url("#${this.filter.id}")`}apply(e,t,n,i,r="roll"){let a=Uu(t,i,r==="entry"?6:24);if(a.points.every(u=>u===0))return!1;let o=this.host.ownerDocument.createElement("span");o.className="rn-sharp",o.append(...e.childNodes);let c=o.cloneNode(!0);c.className="rn-smear",c.style.filter=this.filterUrl(n),e.append(o,c);let l=new Vi(o,"opacity"),h=new Vi(c,"opacity");return this.layers.set(e,{sharp:o,sharpOpacity:l,smearOpacity:h}),l.play(a,u=>String(1-u)),h.play(a,String),!0}remove(e){let t=this.layers.get(e);if(!t)return 0;let n=t.smearOpacity.read().position;return t.sharpOpacity.cancel(),t.smearOpacity.cancel(),e.replaceChildren(...t.sharp.childNodes),this.layers.delete(e),n}destroy(){for(let e of this.layers.keys())this.remove(e);this.filter?.svg.remove(),this.filter=void 0}}function ku(s){return Math.max(45,Math.min(110,s/7))}function zu(s,e,t){let n=Math.abs(e-s);return{points:[s,e],target:e,duration:n*t}}function Vu(s){let e=Array.from({length:s+1},(i,r)=>({"--rn-flap-step":String(r),offset:r/s,easing:"steps(1, end)"})),t=[],n=[];for(let i=0;i<s;i++){let r=i/s,a=(i+.5)/s,o=(i+1)/s;t.push({transform:"perspective(5em) rotateX(0deg)",filter:"brightness(1)",offset:r,easing:"cubic-bezier(.6, 0, 1, .5)"},{transform:"perspective(5em) rotateX(-90deg)",filter:"brightness(.45)",offset:a},{transform:"perspective(5em) rotateX(-90deg)",filter:"brightness(.45)",offset:o}),n.push({transform:"perspective(5em) rotateX(90deg)",filter:"brightness(.45)",offset:r},{transform:"perspective(5em) rotateX(90deg)",filter:"brightness(.45)",offset:a,easing:"linear(0, 0.58, 0.9, 1, 1.045 78%, 1)"},{transform:"perspective(5em) rotateX(0deg)",filter:"brightness(1)",offset:o})}return{index:e,falls:t,lands:n}}function Hu(s){for(let e of s.querySelectorAll(".rn-flap-smear")){for(let t of e.getAnimations())t.cancel();e.remove()}for(let e of s.querySelectorAll(".rn-flap-sharp")){for(let t of e.getAnimations())t.cancel();e.classList.remove("rn-flap-sharp")}}function Gu(s,e,t,n,i,r,a,o){let c=s.ownerDocument,l=Math.abs(n-t),h=n>=t?1:-1;if(!l){s.replaceChildren();return}let u=Vu(l),d=Array.from({length:l+1},(b,T)=>Rr(e,t+T*h)),f=[...d.slice(1),d.at(-1)],g=d.some(b=>/[\r\n\f\u2028\u2029]/u.test(b)),_=c.createElement("span");_.style.cssText=`display:block;position:relative;height:${i}px`,zi(_,u.index,{delay:a,duration:l*r,fill:"both"});let m=(b,T)=>{let C=c.createElement("span");C.className=`rn-face rn-flap rn-flap-${b}`,C.style.height=`${i}px`,C.style.overflow="hidden";let x=c.createElement("span");x.style.cssText=`display:block;white-space:pre;line-height:${i}px`;let S=T?f:d;if(g)for(let D of S){let w=c.createElement("span");w.style.cssText=`display:block;height:${i}px`,w.textContent=D,x.append(w)}else x.textContent=S.join(`
`);return C.append(x),x.style.transform=`translateY(calc(var(--rn-flap-step) * ${-i}px))`,C},p=m("bottom",!1),M=m("top",!0),E=m("top",!1),v=m("bottom",!0);if(o){let b=(T,C)=>{let x=T.firstElementChild,S=x.cloneNode(!0);x.classList.add("rn-flap-sharp");let D=c.createElement("span");D.className="rn-flap-smear",D.style.cssText="display:block;position:absolute;inset:0;overflow:hidden",D.style.filter=o,D.append(S),T.append(D);let w=C.map(B=>({offset:B.offset,easing:B.easing??"linear",opacity:B.filter==="brightness(1)"?0:1})),F={delay:a,duration:l*r,fill:"both"};zi(D,w,F),zi(x,w.map(B=>({...B,opacity:1-B.opacity})),F)};b(E,u.falls),b(v,u.lands)}E.style.transform="perspective(5em) rotateX(-90deg)",zi(E,u.falls,{delay:a,duration:l*r,fill:"backwards"}),v.style.transform="perspective(5em) rotateX(90deg)",zi(v,u.lands,{delay:a,duration:l*r,fill:"forwards"}),s.style.height=`${i}px`,_.append(p,M,v,E),s.replaceChildren(_)}var Wu=new WeakMap,Wa=new WeakSet,$r=s=>`translateX(${s}px)`,Zr=s=>`scale(${s})`,Jr=s=>String(Math.max(0,Math.min(1,s))),Qr=s=>"transition"in s&&s.transition==="direct";function Xu(s){if(s.duration!==void 0&&(!Number.isFinite(s.duration)||s.duration<0||s.duration>1e4))throw RangeError("duration must be between 0 and 10000 milliseconds");if(s.flipDuration!==void 0&&(!Number.isFinite(s.flipDuration)||s.flipDuration<1||s.flipDuration>1e4))throw RangeError("flipDuration must be between 1 and 10000 milliseconds")}var Yu={validate(s){if(typeof s.value!="number"&&typeof s.value!="bigint")throw TypeError("value must be a number or bigint");Xu(s)},model:s=>Du(s.value,s),direction:Iu};class qu{host;source;options;target;displayed;semantic;measurement;visual;measures=new Map;columns=new Map;sizes=new Map;scheduler;enhanced=!1;destroyed=!1;visible=!0;reset=!0;measurementPending=!1;hadClass;previousLeft;blur;blurIntensity=1;constructor(e,t,n){this.host=e,this.source=n,n.validate(t),this.options={...t},this.target=this.displayed=n.model(t);let i=e.ownerDocument,r=o=>{let c=i.createElement("span");return c.className=o,c};this.semantic=r("rn-value"),this.measurement=r("rn-measure"),this.visual=r("rn-visual"),this.measurement.setAttribute("aria-hidden","true"),this.visual.setAttribute("aria-hidden","true"),this.semantic.textContent=this.target.text,this.hadClass=e.classList.contains("rn-root"),e.classList.add("rn-root"),e.replaceChildren(this.semantic,this.measurement,this.visual);let a=i.defaultView;a&&typeof a.matchMedia=="function"&&typeof a.requestAnimationFrame=="function"&&typeof e.animate=="function"&&(this.scheduler=jo.for(a),this.scheduler.add(this,e),this.scheduler.watch(this.measurement,this)),this.prepare()}canAnimate(){return!!this.scheduler&&this.options.animated!==!1&&(this.options.duration??500)>0&&!this.scheduler.media.matches&&!this.host.ownerDocument.hidden&&(this.visible||this.options.pauseOffscreen===!1)&&this.target.rollable&&this.host.isConnected}update(e){if(this.destroyed)return;let t={...this.options,...e};this.source.validate(t);let n=this.source.model(t),i=n.text===this.target.text&&n.signature===this.target.signature;if(this.options.motionBlur&&!t.motionBlur&&(this.blur?.destroy(),this.blur=void 0,Hu(this.visual)),Qr(this.options)!==Qr(t)&&(this.reset=!0),this.options=t,this.target=n,!this.canAnimate()){this.finish();return}i&&this.enhanced&&!this.reset||(this.semantic.textContent=n.text,this.prepare())}prepare(){if(!this.canAnimate()){this.finish();return}this.measurementPending=!0,this.scheduler?.enqueue(this)}stage(){if(!this.destroyed)return this.canAnimate()?(this.previousLeft=this.enhanced&&!this.reset?this.measurement.getBoundingClientRect().left:void 0,()=>this.stageMeasurement()):()=>this.finish()}stageMeasurement(){let e=new Set(this.target.tokens.map(n=>n.key));for(let[n,i]of this.measures)e.has(n)||(this.scheduler?.unwatch(i),this.sizes.delete(i),i.remove(),this.measures.delete(n));let t=null;for(let n of this.target.tokens){let i=this.measures.get(n.key);i||(i=this.host.ownerDocument.createElement("span"),i.className="rn-token",this.measures.set(n.key,i),this.scheduler?.watch(i,this)),i.textContent!==n.text&&(i.textContent=n.text);let r=t?t.nextSibling:this.measurement.firstChild;i!==r&&this.measurement.insertBefore(i,r),t=i}this.host.dataset.rnMeasuring=""}measure(){if(this.destroyed)return;if(!this.canAnimate())return()=>this.finish();let e=this.measurement.getBoundingClientRect(),t=this.host.ownerDocument.defaultView;if(!t)return()=>this.finish();let n=t.getComputedStyle(this.measurement);if(n.direction==="rtl")return()=>this.finish();let i=parseFloat(n.width),r=parseFloat(n.height);if(!i||!r||!e.width||!e.height)return()=>this.finish();let a=e.width/i,o=e.height/r,c=parseFloat(n.getPropertyValue("--rn-blur"));this.blurIntensity=Number.isFinite(c)?Math.max(0,c):1,this.sizes.set(this.measurement,{width:i,height:r});let l=new Map;for(let[u,d]of this.measures){let f=d.getBoundingClientRect(),g={width:f.width/a,height:f.height/o};this.sizes.set(d,g),l.set(u,{...g,x:(f.left-e.left)/a,y:(f.top-e.top)/o})}let h=this.previousLeft===void 0?0:(this.previousLeft-e.left)/a;return()=>this.commit(l,h)}makeColumn(e){let t=this.host.ownerDocument.createElement("span");t.className="rn-slot",t.dataset.rnKey=e.key,e.index!==void 0&&(t.dataset.rnWheel=""),this.options.mode==="flap"&&(t.dataset.rnFlap="");let n=this.host.ownerDocument.createElement("span");return n.className="rn-reel",t.append(n),this.visual.append(t),{token:e,element:t,reel:n,x:new Vi(t,"transform"),opacity:new Vi(t,"opacity"),roll:new Vi(n,"transform"),exiting:!1,height:0,width:0}}face(e,t){let n=this.host.ownerDocument.createElement("span");n.className="rn-face",n.textContent=t,n.style.height=`${e.height}px`;let i=e.reel.children.length;n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.transform=`translateY(${i*e.height}px)`,e.reel.style.height=`${(i+1)*e.height}px`,e.reel.append(n)}rest(e){this.blur?.remove(e.reel),e.reel.replaceChildren(),e.reel.style.removeProperty("height"),this.face(e,e.token.text),this.wrapInk(e),e.token.index===void 0?e.roll.set(1,Zr):e.roll.set(e.token.index,()=>"translateY(0px)")}wrapInk(e){if(this.options.mode==="flap")return;let t=this.host.ownerDocument.createElement("span");t.className="rn-ink",t.append(...e.reel.childNodes),e.reel.append(t)}finishEntry(e){e.entry&&(e.entry.blurred&&this.blur?.remove(e.reel),e.entry.track.cancel(),e.entry.element.replaceWith(e.reel),e.entry=void 0)}enter(e,t,n,i){let r=this.host.ownerDocument.createElement("span");r.className="rn-enter",e.reel.replaceWith(r),r.append(e.reel);let a=new Vi(r,"transform");e.entry={element:r,track:a,blurred:!1};let o=Ys(Nu(e.height*(i?.entryDistance??1),i?.entryDuration??t,i?.entryHold),n);if(this.options.motionBlur&&e.token.text.trim()){this.blur??=new Kr(this.host),this.blur.intensity=this.blurIntensity;let c={...o,points:o.points.map(l=>l/e.height)};e.entry.blurred=this.blur.apply(e.reel,c,e.height,0,"entry")}a.play(o,c=>`translateY(${c}px)`,()=>this.finishEntry(e))}commit(e,t){if(this.destroyed)return;this.measurementPending=!1;let n=this.enhanced&&!this.reset,i=n?this.options.duration??500:0,r=Wu.get(this.host),a=i?r?.widthDuration??i:0,o=this.options.mode==="flap",c=this.options.direction==="up"?1:this.options.direction==="down"?-1:this.source.direction(this.displayed,this.target);this.target.text!==this.displayed.text&&(this.host.dataset.rnTrend=c>0?"up":c<0?"down":"none");let l=new Map([...this.columns].map(([v,b])=>{let T=b.x.read();return[v,{...T,x:T.position,width:b.width}]})),h=Ul(this.target.tokens.map(v=>v.key),l),u=[...l.keys()].sort((v,b)=>l.get(v).x-l.get(b).x),d=Ul(u,e),f=new Map(this.displayed.tokens.filter(v=>v.index===void 0).map(v=>[v.identity,v.key])),g=new Map(this.target.tokens.filter(v=>v.index===void 0).map(v=>[v.identity,v.key])),_=this.options.stagger==="start"||this.options.stagger==="end",m=this.target.tokens.map(v=>{let b=this.columns.get(v.key);return!b||b.exiting||_&&v.index!==void 0&&b.token.text!==v.text}),p=Ou(this.target.tokens.map((v,b)=>v.index!==void 0&&!m[b]),this.options.stagger),M=Math.max(0,...this.target.tokens.map((v,b)=>m[b]?p[b]-1:0)),E=Math.min(i*.045,i*.3/Math.max(1,M));for(let[v,b]of this.target.tokens.entries()){let T=e.get(b.key);if(!T)continue;let C=Math.max(0,p[v]-1)*E,x=f.get(b.identity),S=x!==void 0&&x!==b.key?l.get(x):void 0,D=this.columns.get(b.key),w=!D;if(!D){D=this.makeColumn(b),this.columns.set(b.key,D);let O=(S?.x??h.get(b.key)??T.x)+t;D.x.set(n?O+(T.x-O)*(S?0:r?.entryOrigin??0):T.x,$r),D.opacity.set(n?0:1,Jr)}let F=D.token.text!==b.text,B=Math.abs(D.height-T.height)>.1,G=D.exiting;D.exiting=!1,D.element.style.width=`${T.width}px`,D.element.style.height=`${T.height}px`,D.element.style.top=`${T.y}px`;let H=l.get(b.key);if(D.x.play(Yn(H?H.position+t:D.x.read().position,T.x,H?.velocity??0,a),$r),w||G||!n){let O=D.opacity.read(),k=Yn(O.position,1,O.velocity,b.index===void 0?Math.min(i,180):i?r?.fadeDuration??i:0),Z=!o&&b.identity.startsWith("group:")&&!S?(r?.entryDuration??i)*(r?.entryHold??.14):0;D.opacity.play(w?Ys(k,C+Z):k,Jr)}if(D.height=T.height,D.width=T.width,(!n||B)&&this.finishEntry(D),w&&o&&b.wheel&&i&&D.roll.set(Math.max(0,b.wheel.indexOf(" ")),()=>"translateY(0px)"),o&&!B&&(F||w)&&b.index!==void 0&&b.wheel&&i&&D.roll.read().position!==b.index){let O=D.roll.read(),k=Math.round(O.position),Z=Nl(k,b.index,c,b.wheel.length),$=this.options.flipDuration??ku(i);this.blur?.remove(D.reel);let oe;this.options.motionBlur&&this.blurIntensity>0&&(this.blur??=new Kr(this.host),this.blur.intensity=this.blurIntensity,oe=this.blur.filterUrl(T.height)),Gu(D.reel,b.wheel,k,Z,T.height,$,C,oe),D.token=b;let de=D;D.roll.play(Ys(zu(k,Z,$),C),()=>"translateY(0px)",()=>this.rest(de))}else if(!w&&!B&&F&&b.index!==void 0&&b.wheel&&D.token.index!==void 0&&i){let O=D.roll.read(),k=Qr(this.options)?Fu(D.token.wheel,O.position,b.text):void 0,Z=k?.from??O.position,$=k?.target??Nl(O.position,b.index,c,b.wheel.length),oe=k?.wheel??b.wheel,de=k?Math.min(Math.max(0,O.velocity),($-Z)*1e4/i):O.velocity,he=_?Ys(Yn(Z,$,de,i),C):Yn(Z,$,de,i),Ie=Math.floor(Math.min(...he.points)),ot=Math.ceil(Math.max(...he.points));D.entry&&(D.entry.blurred=!1);let it=this.blur?.remove(D.reel)??0;D.reel.replaceChildren();for(let ee=Ie;ee<=ot;ee++)this.face(D,Rr(oe,ee));this.wrapInk(D),this.options.motionBlur&&(this.blur??=new Kr(this.host),this.blur.intensity=this.blurIntensity,this.blur.apply(D.reel,he,T.height,it)),D.token=k?{...b,wheel:oe,index:$}:b;let j=D;D.roll.play(he,ee=>`translateY(${(Ie-ee)*T.height}px)`,()=>this.rest(j))}else(w||B||F||!n)&&(D.token=b,this.rest(D));if(w&&i&&b.index!==void 0&&!o&&this.enter(D,i,C,r),S&&i&&(w||G)){let O=D.roll.read(),k=D;D.roll.play(Yn(w?.96:O.position,1,O.velocity,Math.min(i,180)),Zr,()=>this.rest(k))}}for(let[v,b]of this.columns){if(e.has(v))continue;let T=l.get(v),C=g.get(b.token.identity),x=C?e.get(C):void 0;if(b.x.play(Yn(T.position+t,x?.x??d.get(v)??T.position,T.velocity,a),$r),b.exiting)continue;if(b.exiting=!0,x&&i){let D=b.roll.read();b.roll.play(Yn(D.position,1.04,D.velocity,Math.min(i,180)),Zr)}let S=b.opacity.read();b.opacity.play(Yn(S.position,0,S.velocity,b.token.index===void 0?Math.min(i,180):i*.65),Jr,()=>{b.exiting&&(this.removeColumn(b),this.columns.delete(v))})}this.enhanced=!0,this.reset=!1,this.displayed=this.target,this.host.dataset.rnReady=""}removeColumn(e){this.blur?.remove(e.reel),this.finishEntry(e),e.x.cancel(),e.roll.cancel(),e.opacity.cancel(),e.element.remove()}refresh(){this.destroyed||(this.reset=!0,this.prepare())}sizeChanged(e,t,n){if(this.measurementPending||!this.host.hasAttribute("data-rn-measuring"))return!1;let i=this.sizes.get(e);return!i||Math.abs(i.width-t)>.2||Math.abs(i.height-n)>.2}visibility(e){this.visible!==e&&(this.visible=e,(e||this.options.pauseOffscreen!==!1)&&this.refresh())}finish(){if(!this.destroyed){this.measurementPending=!1;for(let e of this.columns.values())this.removeColumn(e);this.columns.clear(),this.blur?.destroy(),this.blur=void 0,this.semantic.textContent=this.target.text,delete this.host.dataset.rnReady,delete this.host.dataset.rnMeasuring,delete this.host.dataset.rnTrend,this.enhanced=!1,this.reset=!0,this.displayed=this.target}}destroy(){if(!this.destroyed){this.finish(),this.destroyed=!0;for(let e of this.measures.values())this.scheduler?.unwatch(e);this.scheduler?.unwatch(this.measurement),this.scheduler?.remove(this,this.host),this.host.replaceChildren(this.host.ownerDocument.createTextNode(this.target.text)),!this.hadClass&&this.host.classList.remove("rn-root"),Wa.delete(this.host)}}}function ju(s,e){if(Wa.has(s))throw Error("A rolling number is already mounted on this element");let t=new qu(s,e,Yu);return Wa.add(s),t}const Ku={"LY-001":{summary:"暮色落到花葶的一半，红仍悬在高处。细长的花丝向四面伸去，像一句迟迟没有说完的话。",paragraphs:["雨停以后，泥土的气味贴着地面。它从那片湿暗里站起来，空着两侧，把全部的红举向夜色。","走近些，花瓣正一寸寸向后弯。花丝却越过它们，探到更远的地方；最细的末梢，留着将落未落的一点光。","我在这里停了片刻。身后的路已经暗了，眼里还有一小簇红，走出很远，才慢慢散去。"],tags:["暮色","长花丝","雨后"]},"LY-002":{summary:"小路转弯的时候，忽然看见一朵花。那天原本没有什么值得记下的事。",paragraphs:["午后的风很轻，树影在鞋面上挪动。我走得漫不经心，直到路旁的花把这一刻留住。","它的名字叫忽地笑。念到第二遍，连名字里的那个停顿，也像有人刚刚抬起头来。","回去时没有采花，只把那条绕远的小路记住了。后来经过这里，脚步总会比别处慢一点。"],tags:["偶遇","小路","午后"]},"LY-003":{summary:"夜色一层层深下去，白便渐渐有了轮廓。像月光经过这里，落下一小片未曾带走的衣角。",paragraphs:["天还亮时，它几乎融在身后的薄光里。待树木变成深色，几瓣安静的白才从枝影间浮出来。","花瓣的边缘并不齐整，光沿着细小的起伏停停走走。那些看似空白的地方，也藏着很浅的阴影。","我没有再把灯举近。隔着一点距离看它，夜晚仿佛因此多出了一扇开着的窗。"],tags:["白花","月色","薄光"]},"LY-004":{summary:"一段细长的花筒，将风引向深处。花口微微张着，像山谷里尚未响起的第一声。",paragraphs:["从侧面看，花的线条收得很长。目光顺着它走进去，到了最窄的地方，才发觉自己也屏住了呼吸。","外面的风已经经过好几次，花口仍保持着那个轻微的弧度。明处向外舒展，深处留着一点凉。","若把这一朵画在纸上，我想先空出它的中心。余下的笔画，从那一小处寂静慢慢生长。"],tags:["花筒","风声","侧影"]},"LY-005":{summary:"有些名字很远，有些花却像开在旧屋门前。俯身时，忽然想起故乡傍晚晾着的衣裳。",paragraphs:["给这页写下花名时，窗外正有人收衣服。竹竿碰着檐角，发出很轻的一声，像许多年前听过的声音。","眼前的花在斜光里展开。背景渐渐退去，只剩一根花葶，以及它投在地上的窄影。","我把地名那一栏暂且空着。那一刻想起的院子已经很久没有回去，门前的土，却还记得颜色。"],tags:["故乡","门前","斜光"]},"LY-006":{summary:"换季的光掠过花瓣，像有人翻动一匹旧锦。颜色在褶皱间醒来，衣袖上还留着去年的风。",paragraphs:["花瓣展开时，我想起一件收在箱底的衣裳。它在黑暗里放了很久，摊到窗前，仍能接住满满一身光。","同一片花瓣，迎光与背光的地方各有颜色。稍稍转过一个角度，原先看清的纹理便隐进另一层薄影。","这页没有替它选定一种颜色。我让纸边保持空白，等下一次光落下来，再添一笔。"],tags:["换锦","褶皱","换季"]},"LY-007":{summary:"把花名轻轻念过，仿佛翻开一册久置的书。窗边有风，某个熟悉的午后从页缝里回来。",paragraphs:["那天下午没有急着记录。我把本子搁在膝上，看窗帘向花的方向鼓起，又轻轻垂下。","花在几步之外，名字已经来到嘴边。一个香字，让人想起木柜、干净的手帕，还有阳光晒暖的纸。","离开后才发觉，记得最清楚的是那阵风。它曾经过花，也经过我没有写字的那一页。"],tags:["花名","书页","窗风"]},"LY-008":{summary:"坡上的草向一边伏下，花仍站在原处。远远看去，像有什么轻巧的东西刚刚停住脚步。",paragraphs:["小径在坡背后消失，鞋底带着湿草。越过最后一丛低枝时，风恰好把眼前的花让了出来。","鹿葱。这个名字念起来，有草叶擦过衣角的轻响。花与周围的绿挨得很近，各自留着细细的空隙。","我沿原路下坡，回头只看见草在动。那几朵花藏回去了，刚才停留的地方却仍找得到。"],tags:["草坡","小径","回望"]},"LY-009":{summary:"花瓣向来处弯回，将花心让给空气。一朵花盛开时，原来会做出这样轻的退让。",paragraphs:["指尖停在花瓣以外，顺着它的弧度慢慢移动。线条先向外伸，再折回去，末端几乎碰到身后的光。","弯曲处聚着更深的颜色，边缘却薄得透亮。同一片花瓣，在这道转折里同时有了轻与重。","画到最后，我擦去了几笔。纸上留下的弧线稀疏了一些，花心周围才终于透进风来。"],tags:["反卷","弧线","花被"]},"LY-010":{summary:"一朵花最远的地方，细得几乎不占据夜色。几枚小小的花药，悬在弧线将尽之处。",paragraphs:["先看见末端，再找到托住它的细丝。有时背景稍亮一点，那根线就消失了，花药像独自浮在空中。","花丝彼此交错，却没有织成密网。空隙足够风穿过去，也足够目光越过这一朵，看到后面的另一朵。","想描下全部线条，笔尖反而显得太重。于是只记住它们伸向何处，余下的，让纸上的空处接续。"],tags:["花丝","花药","悬停"]},"LY-011":{summary:"所有繁复都举在上端，下方只有一根安静的绿线。从泥土到花，一路没有多余的转折。",paragraphs:["把目光从花冠移下来，忽然觉得周围宽了。花葶穿过这片空处，一头入土，一头接着盛放。","光照向一侧，另一侧便留出窄窄的暗。圆润的茎身借这点明暗站住，不需要更响亮的轮廓。","整页画满之后，最难落笔的仍是这一根线。稍重便失了轻，稍短便托不住上方的红。"],tags:["花葶","绿线","支撑"]},"LY-012":{summary:"花开过的地方，地下仍有一盏未熄的暗灯。层层收起的鳞片，把漫长的日子抱在里面。",paragraphs:["地面已经安静下来，土里还有没有写完的部分。落下的花、走过的雨，都在这里留下了很慢的回音。","试着想象鳞片一层层向内合拢的样子，像冬夜有人掖好被角。最深处没有颜色，只有尚未来到的生长。","这一页画不出地下的黑。我便在花葶下方多留了一些纸，好让眼前的盛放有地方回去。"],tags:["鳞茎","地下","蓄藏"]},"LY-013":{summary:"几朵小花从同一处出发，朝各自的方向打开。远处看是一团红，近处看，每一朵都有自己的风。",paragraphs:["目光绕着花序走了一圈，总有一朵背向我。它看着我看不见的地方，只把花瓣的背面留在光里。","花梗聚合的那一点很小，却容下了这么多方向。长长短短的弧线从那里散开，相遇，又彼此让过。","挑不出哪一面更像正面。我把标本缓缓转回起处，起处也已经和最初看见的不同。"],tags:["伞形花序","相聚","方向"]},"LY-014":{summary:"红有很深的地方，也有薄得近乎透明的地方。让光慢慢走过，便能看见一朵花里的远近。",paragraphs:["靠近花心的颜色沉着，像被折叠过几次。越往边缘，红越轻，最后只剩贴在轮廓上的一线亮。","阴影移来时，先前鲜明的几瓣退到后面。没有一处颜色离开过，整朵花却换了神情。","调色盘上留下了许多相近的红。我没有把它们混在一起，花的深处还需要那些分得很细的暗。"],tags:["花色","深红","透光"]},"LY-015":{summary:"再靠近一点，平滑便显出细小的起伏。光在那里放慢，像水经过一片低低的沙。",paragraphs:["远看时，花瓣只是一抹颜色。凑近才发现，那抹颜色有边、有薄厚，也有几乎看不清的纹路。","斜光沿着表面擦过去，亮处一闪便停。原来最柔软的部分，也有自己的地形。","我把这一小片放大到满页。花的名字退到了页脚，眼前只剩光走过之后留下的细纹。"],tags:["花瓣","纹理","微光"]},"LY-016":{summary:"将一朵花缓缓展开，让相邻的曲线暂别。空隙里显出的，是它们如何共同托住这一次盛放。",paragraphs:["花被与花丝移向两边，花梗和花葶各自站定。护罩退远一些，底座也让出距离；原先紧密的一体，忽然有了六处停顿。","隔着这些空处再看，才知道哪一条线从哪里开始。细的接着更细的，所有向外伸展的部分，都有自己的来处。","再让它们慢慢归位。最后一处空隙合上时，刚才看见的连接藏了回去，花重新完整地站在眼前。"],tags:["六组结构","展开","归位"]},"LY-017":{summary:"第一滴雨落下时，院子还带着夏天的热。等到檐水连成线，泥土里已经有了秋天的气味。",paragraphs:["雨先落在树叶上，再从叶尖落到地面。同一滴水走了两段路，到达花旁时，声音已经很轻。","石阶一点点变深，白日积下的灰顺着缝隙退去。我站在檐下，看那根花葶在雨里比晴天更清楚。","这天没有写下温度，只在日期旁画了一条短线。后来翻到这里，总觉得纸页有一点潮。"],tags:["秋雨","檐水","湿土"]},"LY-018":{summary:"昨天的泥土还是平的，今早多出一小截绿。季节换了方向，只留下这样细微的证据。",paragraphs:["起初以为是落在地上的草茎。蹲下来才看清，它正从土里出来，顶着一点还没抖落的碎屑。","旁边的石头没有动，墙上的影子也照常经过。只有这根新生的花葶，悄悄改变了昨日的空处。","我用铅笔在页边记下它的高度。第二天再来，先看昨天那道刻痕，然后才抬起目光。"],tags:["初现","清晨","刻痕"]},"LY-019":{summary:"花还收着，周围的风已经来过许多次。将开未开的这一刻，比盛放更适合长久地看。",paragraphs:["花苞合拢在高处，轮廓紧紧的。偶尔换一个角度，才能从缝隙里看见很少的一点颜色。","我一度以为它会在眼前打开，便把回去的时间往后推了推。树影走过鞋尖，花仍安静地收着。","离开时没有替它约定明天。那一点尚未展开的红，已经足够把这一天留住。"],tags:["花苞","将开","等待"]},"LY-020":{summary:"我在纸上借给这朵花七天。第一天只写相逢，最后一天，笔停在一片落下的花瓣旁边。",paragraphs:["七天，是这册手记的页数。花并不照着它开落，有时一夜便换了样子，有时两页之间几乎没有不同。","到第四页，某片花瓣的边缘开始收紧。我记下那一道细折，也记下它旁边仍然伸向风里的花丝。","最后一页没有画完整的花。几条向下的线、一处空白，还有那根仍站着的花葶，已经够了。"],tags:["七日手记","花期","落瓣"]},"LY-021":{summary:"红色渐渐退场，泥土边缘添上新绿。来晚的叶片展开时，花留下的位置还在风中。",paragraphs:["先前总抬头看的地方，如今可以把视线放低。细长的叶片沿着地面铺开，一片挨着一片。","它们没有见过我记下的那朵花。我把两页并在一起，纸上的红与绿，这才有了短暂的相邻。","合上本子后，叶仍在夜里慢慢舒展。花葶旁那一小圈土，被新的影子轻轻盖住了。"],tags:["花后","叶生","相邻"]},"LY-022":{summary:"冬日把许多颜色收远，叶丛仍贴着地面。清晨的一点露光，沿长叶滑向还没醒的土。",paragraphs:["院子比秋天疏了，脚步声也显得清楚。经过石阶时，那丛绿仍在旧位置，低低地接着天空的亮。","叶片相互搭着，深浅便一层层分开。风从上面走过，先动的是叶尖，随后整丛叶才轻轻伏下。","我在冬季这一页少用了许多颜色。留下一点绿，纸面便有了继续往后翻的理由。"],tags:["冬叶","露光","长叶"]},"LY-023":{summary:"夏日的地面空下来，蝉声把午后拉得很长。花庭歇在看不见的地方，容许一季没有红。",paragraphs:["日光越过矮墙，在旧花位上停了很久。那里只剩几粒土、一截细枝，和偶尔走过的蚂蚁。","翻看秋天留下的画，才知道这片空处曾经那么热闹。纸上的花丝伸得很远，眼前却连影子也没有。","午后合上窗，桌面暗下来。我给这一页留了更多空白，等日子慢慢从地下经过。"],tags:["休眠","蝉声","空处"]},"LY-024":{summary:"翻到去年画花的那一页，窗外又落起雨。纸边已经微黄，院子正沿着熟悉的次序醒来。",paragraphs:["从花到叶，再从叶到一片安静的土，记录薄薄地叠成一册。每页都有自己的天气，也有几处忘了写完。","这一年的圆并不规整。某场雨来早了，某次回家晚了，夹在纸里的叶片比记忆中更窄。","新日期写在旧日期下面，笔迹稍有不同。窗外那朵花还没有开，我已经知道该把椅子搬到哪里。"],tags:["年轮","旧页","重逢"]},"LY-025":{summary:"树影到这里忽然变薄，一线红沿着林缘延伸。再往前是旷处，再往后，是叶片层层叠起的暗。",paragraphs:["走在林子里面时，只能从枝叶的空隙看见它们。几步之后，红色连了起来，像有人在地面轻轻划过一笔。","光没有照遍每一朵。有些花仍靠着树影，有些已经迎向开阔处，长花丝将两边的明暗牵在一起。","我沿这条边界走了一段。脚下的路时明时暗，花始终在身旁，保持着不远不近的距离。"],tags:["林缘","红线","树影"]},"LY-026":{summary:"四个角围起一小片河岸，水声却从边界外不断进来。花立在其中，替流动的日子留了一个位置。",paragraphs:["绳线落到草上时，一只小虫从下面穿过去。河岸被暂时划成方正的一块，周围的一切仍照自己的方向行走。","水面把细碎的亮送到花旁，亮又随波移开。我记下花葶、石块和斜向河面的坡，也记下这阵不停的声音。","收起绳线，四个角很快隐回草里。本子上仍留着那个方框，水声却装不进去。"],tags:["河岸","样方","水声"]},"LY-027":{summary:"石阶没有为花预留位置。雨水走过的那条细缝，却攒下了一点土，和一次向上的生长。",paragraphs:["阶沿被许多脚步磨圆，缝隙里积着深色的细土。那根花葶贴着石面出来，窄窄的一线绿。","下午，花的影子先落在下一级台阶上。再过一会儿，影子跨过阶沿，红色的花仍在原处迎着光。","下山时，我绕开了那道缝。台阶依旧够宽，留给一朵花的地方，其实不需要很多。"],tags:["石阶","缝隙","向上"]},"LY-028":{summary:"山背面的早晨来得稍晚。花先醒在凉意里，等第一缕光翻过坡顶，露水还没有离开。",paragraphs:["转过山脊，风忽然凉了一些。脚下的枯叶湿着，几朵花从深处显出来，颜色比沿途看见的更沉。","光缓缓往下移，先碰到一根花丝，再触到花瓣的边。明亮只停在少数地方，整个坡面仍很安静。","我把手记摊在膝上，等纸面也晒到一点暖。写完最后一行时，鞋尖上的露痕还在。"],tags:["阴坡","露水","迟来的光"]},"LY-029":{summary:"旧门的漆掉了一块，檐下空着一把椅子。花照常开在墙边，仿佛屋里的人只是暂时出去了。",paragraphs:["推门时，门轴还是从前的声音。院里积着薄薄的落叶，墙根那几朵花，把空了很久的地方映得有些暖。","我在椅子上坐下，看影子从井沿挪到石砖。没人催着开灯，花瓣的红也就一点点留到了傍晚。","离开前把椅子往檐里收了收。门重新合上，花还在那边，接着我没有看完的夜色。"],tags:["旧院","空椅","墙根"]},"LY-030":{summary:"循水声往上走，村庄渐渐听不见了。溪边的花立在石头后面，水从它身旁一刻不停地经过。",paragraphs:["上游的路比想象中窄，树枝常常拦到肩头。拨开最后一丛叶子，水声突然近了，花也近了。","水流绕着石头分开，又在下方合到一处。花的倒影被带散几次，每次平静下来，红仍在那里。","我没有再向前。把这段溪流记好，沿来路往下走，鞋边带着一点刚才岸上的泥。"],tags:["上游","溪石","倒影"]},"LY-031":{summary:"把目光放到花的下方，土壤也有层次与纹理。细根穿过深浅不同的暗，将一朵花接回地面。",paragraphs:["剖面露出几层不同的褐色，夹着碎石和腐叶。地面上很短的一段距离，向下看，竟容着这么多细节。","一条根从松软处穿入更深的土里，到纸上只能画成很细的一笔。旁边还有更细的，几乎与底色合在一起。","画完这一页，再看上方的花葶，才觉得它站得稳了。原先没有画出的部分，一直在安静地托着它。"],tags:["土层","细根","腐叶"]},"LY-032":{summary:"一朵花恰好站在明暗之间。太阳移过一寸，花瓣的一半便走进白昼，另一半仍留在夜里。",paragraphs:["墙影在地面划出清楚的边，到了花上，却被曲面折弯了。同一条边界经过花瓣与花丝，变得断断续续。","最亮的一处慢慢挪向侧面，先前藏着的细纹露出来。只站在原地看，也像绕着花走了一小圈。","等影子完全越过去，我合上了本子。纸上留着半明半暗的一朵，窗外的光已经走远。"],tags:["光照","边界","移动的影"]},"LY-033":{summary:"花庭深处，留着一盏青色的小灯。旧站的那句问候还亮着，几行代码也仍在原处。",paragraphs:["hello there ! —— 旧首页曾用这句话迎接来人。如今门前多了一片花海，这句短短的问候，仍留在翻开此页就能看见的地方。","那份 Directory.Build.props 保持着原样：版本、规则与注释都留在旧位置。曾经替代码检查细处的约定，如今也替这个小站保管着它的来处。","青色花体旁留着原文和下载入口，旧首页也可以再次打开。若你曾从那扇门来过，愿这里仍有一处熟悉的灯光。"],tags:["个人站点归档","C#","MSBuild"]},"LY-034":{summary:"信纸铺开很久，只写好一个称呼。窗外的花动了一下，我便在下一行添上：这里入秋了。",paragraphs:["原本想写的事情很多，落笔时却只记得今天的天气。雨从上午下到傍晚，屋后的花刚刚开。","写到花的颜色，停了一会儿。调不出合适的字，便画了几条细线，让它们伸到行与行之间。","信没有立刻封口。我把它放在窗边，等纸上的墨干，也等想说的下一句话。"],tags:["来信","称呼","未封口"]},"LY-035":{summary:"九月夹在两页纸之间，一边是雨声，一边是渐凉的晚风。红色停在中间，还带着初见时的光。",paragraphs:["在页角写下九月的时候，笔尖划过了一道旧折痕。去年也是这样一个傍晚，窗外的花隔着雨，看不十分清楚。","这次把细节记得更慢些：花瓣朝哪边弯，花丝越过了哪一条影子。还有袖口碰到窗沿时，那一点凉。","合页之前，吹了吹尚未干的墨。纸上的九月安静下来，外面的雨却仍在继续。"],tags:["九月","折痕","初见"]},"LY-036":{summary:"灯暗下来以后，眼睛才慢慢学会看花。白日里清楚的边缘退去，深红从夜色里一点点浮起。",paragraphs:["最初几乎什么也看不见，只听见草丛里断续的虫声。站了一会儿，花葶有了轮廓，花丝也逐渐分开。","一阵风经过，几处微光轻轻挪动。我顺着它们认出白天看过的那朵花，它比记忆中安静许多。","回屋时没有马上开灯，让眼睛里的夜多停一会儿。桌上的本子还摊着，字可以明早再写。"],tags:["夜观","虫声","暗中显影"]},"LY-037":{summary:"隔着一层玻璃，花停在伸手可及的地方。指尖映在外面，花丝留在里面，中间是一小段清澈的距离。",paragraphs:["灯光在护罩上画出一条窄亮，稍一移动，亮线便从花前退开。里面的红于是重新完整地显出来。","我看见自己的倒影淡淡地叠在花旁。凝望的这一刻，也短暂地被玻璃收了进去。","离开时，表面留下的一点指痕还没有擦去。花安静地站着，玻璃外的脚步已经走远。"],tags:["玻璃","倒影","指痕"]},"LY-038":{summary:"两个数字在纸上相交，落成一个很小的点。到了那里，才知道点里有一条小路，和路边的一朵红花。",paragraphs:["地图把距离收得很短，手指轻轻一划，就从住处到了花旁。真正走过去，却经过了一段上坡和两次避雨。","我在坐标后面补写了几句话：左边有一块平石，下午的树影会越过它，花开在石头靠里的那一侧。","下次再找这里，也许先认出的是那块石头。数字留在纸上，走过的路已经留在脚下。"],tags:["坐标","寻路","平石"]},"LY-039":{summary:"快门落下，风还没有停。花丝在下一瞬换了位置，这一页却永远留着它刚才伸向的地方。",paragraphs:["拍下它之前，看了很久。光总在挪动，花也总有轻微的偏转，最后留下的那一刻，几乎没有预先选定。","照片里有一根花丝恰好与背景的亮缝重合。后来再去找，无论站在哪个位置，都没能见到同样的一条线。","于是保留这一张，连同边缘那处微小的模糊。翻到它时，还能想起按下快门以后，风吹向了哪边。"],tags:["快门","瞬间","风向"]},"LY-040":{summary:"今夜先合上这册手记。椅子留在檐下，小路留在草间；等花再开，就沿着旧日的方向走来。",paragraphs:["最后一次经过花庭，地面已经落了几片枯叶。我把脚步放轻，让它们留在各自落下的位置。","本子还剩几页，没有急着填满。纸夹里放着一支削好的铅笔，窗边也空出了一小块桌面。","下一次花开时，先去看看那道石阶缝。若有新的花葶，就坐下来，从第一根花丝慢慢看起。"],tags:["再来","空页","下一次花开"]}},Fs=[{id:"botany",name:"植物档案",en:"BOTANICAL",code:"01"},{id:"morphology",name:"形态研究",en:"MORPHOLOGY",code:"02"},{id:"phenology",name:"物候观测",en:"PHENOLOGY",code:"03"},{id:"habitat",name:"生境记录",en:"HABITAT",code:"04"},{id:"memory",name:"彼岸手记",en:"FIELD NOTES",code:"05"}],$u=[["赤色石蒜","忽地笑","白花石蒜","长筒石蒜","中国石蒜","换锦花","香石蒜","鹿葱"],["反卷的花被","花丝与花药","花葶的几何","地下鳞茎","伞形花序","花色的层次","花瓣表面","标本的六个切面"],["第一场秋雨","花葶初现","盛放之前","七日花期","花后叶生","冬季叶丛","夏日休眠","一个完整的年轮"],["林缘的红线","河岸样方","石阶缝隙","山地阴坡","旧庭院","溪流上游","土壤切片","光照的边界"],["花叶不相见","彼岸来信","九月的标本","夜间观察","保存在玻璃中","红色的坐标","时间的切片","下一次花开"]],Zu=[["Lycoris radiata","Lycoris aurea","Lycoris albiflora","Lycoris longituba","Lycoris chinensis","Lycoris sprengeri","Lycoris incarnata","Lycoris squamigera"],["Recurved tepals","Filament & anther","Scape geometry","Subterranean bulb","Umbel structure","Chromatic layers","Petal surface","Six sections"],["First autumn rain","Scape emergence","Before the bloom","Seven days in red","Leaves after flowers","Winter foliage","Summer dormancy","An annual cycle"],["At the forest edge","Riverbank transect","Between the stones","The shaded slope","An old courtyard","Upstream","Soil profile","A boundary of light"],["Never in the same season","Letters from beyond","A September specimen","After dark","Held in glass","Coordinates in red","A slice of time","Until the next bloom"]],hn=$u.flatMap((s,e)=>s.map((t,n)=>{const i=`LY-${String(e*8+n+1).padStart(3,"0")}`,r=Ku[i];return{id:i,title:t,en:Zu[e][n],category:e,number:n+1,date:`2026.09.${String(8-n).padStart(2,"0")}`,summary:r.summary,paragraphs:r.paragraphs,tags:[Fs[e].name,...r.tags]}}));hn[32]={...hn[32],title:"C# Analyzers",en:"Directory.Build.props",flowerColor:"cyan",attachment:"Directory.Build.props"};function Pr(s,e){return(s%e+e)%e}function Rs(s,e,t){return s+Math.floor((e-s+t/2)/t)*t}function ZL(s,e=-1,t){const n=s.trim().toLocaleLowerCase();return hn.filter(i=>(e<0||i.category===e)&&(!t||t.has(i.id))&&`${i.id} ${i.title} ${i.en} ${Fs[i.category].name} ${i.tags.join(" ")}`.toLocaleLowerCase().includes(n))}class Ju{category=0;memory=[0,0,0,0,0];rowTravel=0;laneTravel=0;get index(){return this.category*8+this.memory[this.category]}get record(){return hn[this.index]}stepRow(e){this.memory[this.category]=Pr(this.memory[this.category]+e,8),this.rowTravel+=e}stepCategory(e){this.category=Pr(this.category+e,5),this.laneTravel+=e,this.rowTravel=Rs(this.memory[this.category],this.rowTravel,8)}select(e,t){this.category=Math.floor(e/8),this.memory[this.category]=e%8,this.laneTravel=t?.lane??Rs(this.category,this.laneTravel,5),this.rowTravel=t?.row??Rs(e%8,this.rowTravel,8)}}const Bl=[{id:"petals",name:"花被",en:"RECURVED TEPALS",offset:[0,1.05,0]},{id:"stamens",name:"雄蕊",en:"FILAMENTS & ANTHERS",offset:[0,2.05,0]},{id:"pedicels",name:"花梗",en:"PEDICEL ARRAY",offset:[0,.38,0]},{id:"stem",name:"花葶",en:"FLOWERING SCAPE",offset:[0,-.32,0]},{id:"chamber",name:"光学护罩",en:"OPTICAL CHAMBER",offset:[2.95,.1,0]},{id:"base",name:"标本底座",en:"SPECIMEN PLATFORM",offset:[0,-1.2,0]}];function Ko(s=8){const e=[3,96,18,82,9,91,31,69,42,58,24,76],t=[`4C
59
43
00
01`,`36
06
..
A9
↓`,`01
10
01
..
LY`];return`<div class="signal-fall" aria-hidden="true">${e.slice(0,s).map((n,i)=>`<i style="left:${n}%;--fall-duration:${12+i*7%11}s;--fall-delay:${-(i*3.7%19)}s"><span>${t[i%t.length]}</span></i>`).join("")}</div>`}function Qu(s){const e=s.replace(/data-delay="([\d.]+)"/g,'style="--trace-delay:$1"');return`
    <header class="topbar">
      <a class="brand" href="/" aria-label="彼岸夜间花庭首页"><b>彼岸</b><span>夜间花庭<small>LYCORIS</small></span></a>
      <nav aria-label="主导航"><button class="nav-active" data-action="archive">花海</button><button data-action="search">馆藏目录</button><button data-action="saved">收藏 <span id="saved-count">00</span></button><button class="garden-cyan-link" data-result="32">青色手记 ↗</button></nav>
      <div class="top-status"><span>秋 / 夜间观测</span><button class="icon-button" data-action="settings" aria-label="偏好设置">☷</button></div>
    </header>
    <div class="workspace">
      <section class="specimen-stage" aria-label="三维花海，点击标本选择，双击抽取">
        <div id="scene"></div>
        <div class="garden-shade" aria-hidden="true"></div>
        <div class="stage-topline"><span>花叶错落，各有其时。</span><span class="stage-index">01 — 40</span></div>
        <div class="specimen-label"><span class="micro" id="specimen-code">LY-001</span><span id="specimen-title">赤色石蒜</span></div>
        <div class="stage-bottomline"><span id="stage-hint">点击花海中的标本 · 双击抽取</span><button data-action="rotate" aria-label="抽取标本并切换自动旋转" aria-pressed="false"><i class="rotate-indicator"></i> 自动旋转</button><span id="model-status">载入花海…</span></div>
        <div class="stage-loading" id="model-loading">${Ko(6)}<div class="loading-cross">${e}</div><span>花海正在显影</span><small id="load-progress">LYCORIS / NIGHT GARDEN</small></div>
      </section>
      <aside class="dossier" aria-label="当前标本题签">
        <div class="dossier-top"><span id="record-category">其一 · 植物档案</span><div class="file-code"><span>№</span><span id="record-number">001</span></div></div>
        <div class="record-heading"><h1 id="record-title">赤色石蒜</h1><p id="record-en">Lycoris radiata</p></div>
        <div class="title-rule signal-rule" aria-hidden="true"></div>
        <p class="record-summary" id="record-summary"></p>
        <div class="record-actions"><button class="primary-button" data-action="open">展开手记 <b>↗</b></button><button class="text-button" data-action="inspect">观察结构</button><button class="bookmark" data-action="bookmark" aria-label="收藏当前档案">＋</button></div>
        <time class="garden-record-date" id="record-date">2026.09.08</time>
      </aside>
      <section class="archive-rail" aria-label="花海章节与快速翻阅">
        <nav class="category-list" aria-label="馆藏章节">${Fs.map((t,n)=>`<button data-category="${n}" class="${n===0?"active":""}" aria-pressed="${n===0}"><span class="category-code">${["一","二","三","四","五"][n]}</span><span>${["植物","形态","物候","生境","手记"][n]}</span><small>${t.en}</small></button>`).join("")}</nav>
        <div class="chapter-progress" aria-hidden="true"><i></i></div>
        <div class="rail-heading"><span id="rail-category">植物档案</span><div id="file-rail" class="file-rail"></div><span class="rail-nav"><button data-action="prev" aria-label="上一个档案">←</button><span id="rail-number">01 / 08</span><button data-action="next" aria-label="下一个档案">→</button></span></div>
      </section>
    </div>
    <footer class="footer"><span>一片花海，四十份记录。</span><span class="keyboard-hint">↑ ↓ 翻阅 <i>·</i> ← → 切类 <i>·</i> ENTER 读取</span><button data-action="replay">重看花海显影 ↗</button><time id="clock"></time></footer>
    <div id="overlay-root"></div><div id="toast" role="status"></div>
  `}const $o="183",Gi={ROTATE:0,DOLLY:1,PAN:2},Hi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ed=0,kl=1,td=2,Mr=1,nd=2,Es=3,fn=0,kt=1,Gt=2,An=0,Wi=1,zl=2,Vl=3,Hl=4,id=5,pi=100,sd=101,rd=102,ad=103,od=104,ld=200,cd=201,hd=202,ud=203,Xa=204,Ya=205,dd=206,fd=207,pd=208,md=209,gd=210,Ld=211,_d=212,xd=213,vd=214,qa=0,ja=1,Ka=2,qi=3,$a=4,Za=5,Ja=6,Qa=7,Zo=0,yd=1,Md=2,wn=0,Th=1,Ah=2,wh=3,Jo=4,Ch=5,Rh=6,Ph=7,Gl="attached",Sd="detached",Dh=300,_i=301,ji=302,ea=303,ta=304,Br=306,Ki=1e3,bn=1001,Dr=1002,vt=1003,Ih=1004,Ts=1005,yt=1006,Sr=1007,zn=1008,jt=1009,Nh=1010,Uh=1011,Os=1012,Qo=1013,pn=1014,Jt=1015,Cn=1016,el=1017,tl=1018,Bs=1020,Fh=35902,Oh=35899,Bh=1021,kh=1022,Qt=1023,Gn=1026,gi=1027,nl=1028,il=1029,$i=1030,sl=1031,rl=1033,br=33776,Er=33777,Tr=33778,Ar=33779,eo=35840,to=35841,no=35842,io=35843,so=36196,ro=37492,ao=37496,oo=37488,lo=37489,co=37490,ho=37491,uo=37808,fo=37809,po=37810,mo=37811,go=37812,Lo=37813,_o=37814,xo=37815,vo=37816,yo=37817,Mo=37818,So=37819,bo=37820,Eo=37821,To=36492,Ao=36494,wo=36495,Co=36283,Ro=36284,Po=36285,Do=36286,ks=2300,zs=2301,na=2302,Wl=2303,Xl=2400,Yl=2401,ql=2402,bd=2500,Ed=0,zh=1,Io=2,Td=3200,al=0,Ad=1,ni="",xt="srgb",Vt="srgb-linear",Ir="linear",Ze="srgb",Si=7680,jl=519,wd=512,Cd=513,Rd=514,ol=515,Pd=516,Dd=517,ll=518,Id=519,No=35044,ia=35048,Kl="300 es",En=2e3,Vs=2001;function Nd(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Ud(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Hs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Fd(){const s=Hs("canvas");return s.style.display="block",s}const $l={};function Nr(...s){const e="THREE."+s.shift();console.log(e,...s)}function Vh(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Me(...s){s=Vh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ce(...s){s=Vh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Ur(...s){const e=s.join(" ");e in $l||($l[e]=!0,Me(...s))}function Od(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Bd={[qa]:ja,[Ka]:Ja,[$a]:Qa,[qi]:Za,[ja]:qa,[Ja]:Ka,[Qa]:$a,[Za]:qi};class vi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const It=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Zl=1234567;const Ps=Math.PI/180,Zi=180/Math.PI;function un(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(It[s&255]+It[s>>8&255]+It[s>>16&255]+It[s>>24&255]+"-"+It[e&255]+It[e>>8&255]+"-"+It[e>>16&15|64]+It[e>>24&255]+"-"+It[t&63|128]+It[t>>8&255]+"-"+It[t>>16&255]+It[t>>24&255]+It[n&255]+It[n>>8&255]+It[n>>16&255]+It[n>>24&255]).toLowerCase()}function He(s,e,t){return Math.max(e,Math.min(t,s))}function cl(s,e){return(s%e+e)%e}function kd(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function zd(s,e,t){return s!==e?(t-s)/(e-s):0}function Ds(s,e,t){return(1-t)*s+t*e}function Vd(s,e,t,n){return Ds(s,e,1-Math.exp(-t*n))}function Hd(s,e=1){return e-Math.abs(cl(s,e*2)-e)}function Gd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Wd(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function Xd(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Yd(s,e){return s+Math.random()*(e-s)}function qd(s){return s*(.5-Math.random())}function jd(s){s!==void 0&&(Zl=s);let e=Zl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Kd(s){return s*Ps}function $d(s){return s*Zi}function Zd(s){return(s&s-1)===0&&s!==0}function Jd(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Qd(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function ef(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),g=a((n-e)/2);switch(i){case"XYX":s.set(o*h,c*u,c*d,o*l);break;case"YZY":s.set(c*d,o*h,c*u,o*l);break;case"ZXZ":s.set(c*u,c*d,o*h,o*l);break;case"XZX":s.set(o*h,c*g,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*g,o*l);break;case"ZYZ":s.set(c*g,c*f,o*h,o*l);break;default:Me("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ln(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Je(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const en={DEG2RAD:Ps,RAD2DEG:Zi,generateUUID:un,clamp:He,euclideanModulo:cl,mapLinear:kd,inverseLerp:zd,lerp:Ds,damp:Vd,pingpong:Hd,smoothstep:Gd,smootherstep:Wd,randInt:Xd,randFloat:Yd,randFloatSpread:qd,seededRandom:jd,degToRad:Kd,radToDeg:$d,isPowerOfTwo:Zd,ceilPowerOfTwo:Jd,floorPowerOfTwo:Qd,setQuaternionFromProperEuler:ef,normalize:Je,denormalize:ln};class Ee{constructor(e=0,t=0){Ee.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(u!==_||c!==d||l!==f||h!==g){let m=c*d+l*f+h*g+u*_;m<0&&(d=-d,f=-f,g=-g,_=-_,m=-m);let p=1-o;if(m<.9995){const M=Math.acos(m),E=Math.sin(M);p=Math.sin(p*M)/E,o=Math.sin(o*M)/E,c=c*p+d*o,l=l*p+f*o,h=h*p+g*o,u=u*p+_*o}else{c=c*p+d*o,l=l*p+f*o,h=h*p+g*o,u=u*p+_*o;const M=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=M,l*=M,h*=M,u*=M}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+h*u+c*f-l*d,e[t+1]=c*g+h*d+l*u-o*f,e[t+2]=l*g+h*f+o*d-c*u,e[t+3]=h*g-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(r/2),d=c(n/2),f=c(i/2),g=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:Me("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+i*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Jl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Jl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=i+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return sa.copy(this).projectOnVector(e),this.sub(sa)}reflect(e){return this.sub(sa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const sa=new P,Jl=new mn;class Ue{constructor(e,t,n,i,r,a,o,c,l){Ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l)}set(e,t,n,i,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],M=i[1],E=i[4],v=i[7],b=i[2],T=i[5],C=i[8];return r[0]=a*_+o*M+c*b,r[3]=a*m+o*E+c*T,r[6]=a*p+o*v+c*C,r[1]=l*_+h*M+u*b,r[4]=l*m+h*E+u*T,r[7]=l*p+h*v+u*C,r[2]=d*_+f*M+g*b,r[5]=d*m+f*E+g*T,r[8]=d*p+f*v+g*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=u*_,e[1]=(i*l-h*n)*_,e[2]=(o*n-i*a)*_,e[3]=d*_,e[4]=(h*t-i*c)*_,e[5]=(i*r-o*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(a*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(ra.makeScale(e,t)),this}rotate(e){return this.premultiply(ra.makeRotation(-e)),this}translate(e,t){return this.premultiply(ra.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ra=new Ue,Ql=new Ue().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ec=new Ue().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tf(){const s={enabled:!0,workingColorSpace:Vt,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Ze&&(i.r=Hn(i.r),i.g=Hn(i.g),i.b=Hn(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Ze&&(i.r=Xi(i.r),i.g=Xi(i.g),i.b=Xi(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ni?Ir:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return Ur("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return Ur("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Vt]:{primaries:e,whitePoint:n,transfer:Ir,toXYZ:Ql,fromXYZ:ec,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:xt},outputColorSpaceConfig:{drawingBufferColorSpace:xt}},[xt]:{primaries:e,whitePoint:n,transfer:Ze,toXYZ:Ql,fromXYZ:ec,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:xt}}}),s}const Xe=tf();function Hn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Xi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let bi;class nf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{bi===void 0&&(bi=Hs("canvas")),bi.width=e.width,bi.height=e.height;const i=bi.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=bi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Hs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Hn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Hn(t[n]/255)*255):t[n]=Hn(t[n]);return{data:t,width:e.width,height:e.height}}else return Me("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let sf=0;class hl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=un(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(aa(i[a].image)):r.push(aa(i[a]))}else r=aa(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function aa(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?nf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Me("Texture: Unable to serialize Texture."),{})}let rf=0;const oa=new P;class St extends vi{constructor(e=St.DEFAULT_IMAGE,t=St.DEFAULT_MAPPING,n=bn,i=bn,r=yt,a=zn,o=Qt,c=jt,l=St.DEFAULT_ANISOTROPY,h=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=un(),this.name="",this.source=new hl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ee(0,0),this.repeat=new Ee(1,1),this.center=new Ee(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(oa).x}get height(){return this.source.getSize(oa).y}get depth(){return this.source.getSize(oa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Me(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Me(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ki:e.x=e.x-Math.floor(e.x);break;case bn:e.x=e.x<0?0:1;break;case Dr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ki:e.y=e.y-Math.floor(e.y);break;case bn:e.y=e.y<0?0:1;break;case Dr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}St.DEFAULT_IMAGE=null;St.DEFAULT_MAPPING=Dh;St.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,t=0,n=0,i=1){at.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const E=(l+1)/2,v=(f+1)/2,b=(p+1)/2,T=(h+d)/4,C=(u+_)/4,x=(g+m)/4;return E>v&&E>b?E<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(E),i=T/n,r=C/n):v>b?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=T/i,r=x/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=C/r,i=x/r),this.set(n,i,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class af extends vi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new St(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:yt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new hl(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class tn extends af{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Hh extends St{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=vt,this.minFilter=vt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class of extends St{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=vt,this.minFilter=vt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fe{constructor(e,t,n,i,r,a,o,c,l,h,u,d,f,g,_,m){Fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l,h,u,d,f,g,_,m)}set(e,t,n,i,r,a,o,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Fe().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,n=e.elements,i=1/Ei.setFromMatrixColumn(e,0).length(),r=1/Ei.setFromMatrixColumn(e,1).length(),a=1/Ei.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+g*l,t[5]=d-_*l,t[9]=-o*c,t[2]=_-d*l,t[6]=g+f*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;t[0]=d+_*o,t[4]=g*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-g,t[6]=_+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;t[0]=d-_*o,t[4]=-a*u,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*h,t[9]=_-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;t[0]=c*h,t[4]=g*l-f,t[8]=d*l+_,t[1]=c*u,t[5]=_*l+d,t[9]=f*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,g=o*c,_=o*l;t[0]=c*h,t[4]=_-d*u,t[8]=g*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+g,t[10]=d-_*u}else if(e.order==="XZY"){const d=a*c,f=a*l,g=o*c,_=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+_,t[5]=a*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=o*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(lf,e,cf)}lookAt(e,t,n){const i=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),qn.crossVectors(n,Yt),qn.lengthSq()===0&&(Math.abs(n.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),qn.crossVectors(n,Yt)),qn.normalize(),qs.crossVectors(Yt,qn),i[0]=qn.x,i[4]=qs.x,i[8]=Yt.x,i[1]=qn.y,i[5]=qs.y,i[9]=Yt.y,i[2]=qn.z,i[6]=qs.z,i[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],M=n[3],E=n[7],v=n[11],b=n[15],T=i[0],C=i[4],x=i[8],S=i[12],D=i[1],w=i[5],F=i[9],B=i[13],G=i[2],H=i[6],O=i[10],k=i[14],Z=i[3],$=i[7],oe=i[11],de=i[15];return r[0]=a*T+o*D+c*G+l*Z,r[4]=a*C+o*w+c*H+l*$,r[8]=a*x+o*F+c*O+l*oe,r[12]=a*S+o*B+c*k+l*de,r[1]=h*T+u*D+d*G+f*Z,r[5]=h*C+u*w+d*H+f*$,r[9]=h*x+u*F+d*O+f*oe,r[13]=h*S+u*B+d*k+f*de,r[2]=g*T+_*D+m*G+p*Z,r[6]=g*C+_*w+m*H+p*$,r[10]=g*x+_*F+m*O+p*oe,r[14]=g*S+_*B+m*k+p*de,r[3]=M*T+E*D+v*G+b*Z,r[7]=M*C+E*w+v*H+b*$,r[11]=M*x+E*F+v*O+b*oe,r[15]=M*S+E*B+v*k+b*de,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15],M=c*f-l*d,E=o*f-l*u,v=o*d-c*u,b=a*f-l*h,T=a*d-c*h,C=a*u-o*h;return t*(_*M-m*E+p*v)-n*(g*M-m*b+p*T)+i*(g*E-_*b+p*C)-r*(g*v-_*T+m*C)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],M=t*o-n*a,E=t*c-i*a,v=t*l-r*a,b=n*c-i*o,T=n*l-r*o,C=i*l-r*c,x=h*_-u*g,S=h*m-d*g,D=h*p-f*g,w=u*m-d*_,F=u*p-f*_,B=d*p-f*m,G=M*B-E*F+v*w+b*D-T*S+C*x;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/G;return e[0]=(o*B-c*F+l*w)*H,e[1]=(i*F-n*B-r*w)*H,e[2]=(_*C-m*T+p*b)*H,e[3]=(d*T-u*C-f*b)*H,e[4]=(c*D-a*B-l*S)*H,e[5]=(t*B-i*D+r*S)*H,e[6]=(m*v-g*C-p*E)*H,e[7]=(h*C-d*v+f*E)*H,e[8]=(a*F-o*D+l*x)*H,e[9]=(n*D-t*F-r*x)*H,e[10]=(g*T-_*v+p*M)*H,e[11]=(u*v-h*T-f*M)*H,e[12]=(o*S-a*w-c*x)*H,e[13]=(t*w-n*S+i*x)*H,e[14]=(_*E-g*b-m*M)*H,e[15]=(h*b-u*E+d*M)*H,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,M=c*l,E=c*h,v=c*u,b=n.x,T=n.y,C=n.z;return i[0]=(1-(_+p))*b,i[1]=(f+v)*b,i[2]=(g-E)*b,i[3]=0,i[4]=(f-v)*T,i[5]=(1-(d+p))*T,i[6]=(m+M)*T,i[7]=0,i[8]=(g+E)*C,i[9]=(m-M)*C,i[10]=(1-(d+_))*C,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinant();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ei.set(i[0],i[1],i[2]).length();const o=Ei.set(i[4],i[5],i[6]).length(),c=Ei.set(i[8],i[9],i[10]).length();r<0&&(a=-a),rn.copy(this);const l=1/a,h=1/o,u=1/c;return rn.elements[0]*=l,rn.elements[1]*=l,rn.elements[2]*=l,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=u,rn.elements[9]*=u,rn.elements[10]*=u,t.setFromRotationMatrix(rn),n.x=a,n.y=o,n.z=c,this}makePerspective(e,t,n,i,r,a,o=En,c=!1){const l=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let g,_;if(c)g=r/(a-r),_=a*r/(a-r);else if(o===En)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===Vs)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=En,c=!1){const l=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let g,_;if(c)g=1/(a-r),_=a/(a-r);else if(o===En)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===Vs)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Ei=new P,rn=new Fe,lf=new P(0,0,0),cf=new P(1,1,1),qn=new P,qs=new P,Yt=new P,tc=new Fe,nc=new mn;class gn{constructor(e=0,t=0,n=0,i=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(He(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-He(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(He(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Me("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return tc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return nc.setFromEuler(this),this.setFromQuaternion(nc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class ul{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let hf=0;const ic=new P,Ti=new mn,In=new Fe,js=new P,fs=new P,uf=new P,df=new mn,sc=new P(1,0,0),rc=new P(0,1,0),ac=new P(0,0,1),oc={type:"added"},ff={type:"removed"},Ai={type:"childadded",child:null},la={type:"childremoved",child:null};class ht extends vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=un(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ht.DEFAULT_UP.clone();const e=new P,t=new gn,n=new mn,i=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Fe},normalMatrix:{value:new Ue}}),this.matrix=new Fe,this.matrixWorld=new Fe,this.matrixAutoUpdate=ht.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ul,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ti.setFromAxisAngle(e,t),this.quaternion.multiply(Ti),this}rotateOnWorldAxis(e,t){return Ti.setFromAxisAngle(e,t),this.quaternion.premultiply(Ti),this}rotateX(e){return this.rotateOnAxis(sc,e)}rotateY(e){return this.rotateOnAxis(rc,e)}rotateZ(e){return this.rotateOnAxis(ac,e)}translateOnAxis(e,t){return ic.copy(e).applyQuaternion(this.quaternion),this.position.add(ic.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(sc,e)}translateY(e){return this.translateOnAxis(rc,e)}translateZ(e){return this.translateOnAxis(ac,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?js.copy(e):js.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(fs,js,this.up):In.lookAt(js,fs,this.up),this.quaternion.setFromRotationMatrix(In),i&&(In.extractRotation(i.matrixWorld),Ti.setFromRotationMatrix(In),this.quaternion.premultiply(Ti.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ce("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(oc),Ai.child=e,this.dispatchEvent(Ai),Ai.child=null):Ce("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ff),la.child=e,this.dispatchEvent(la),la.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(oc),Ai.child=e,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,e,uf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,df,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),e.pivot!==null&&(this.pivot=e.pivot.clone()),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ht.DEFAULT_UP=new P(0,1,0);ht.DEFAULT_MATRIX_AUTO_UPDATE=!0;ht.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Kt extends ht{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pf={type:"move"};class ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pf)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Kt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Gh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Ks={h:0,s:0,l:0};function ha(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ae{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=xt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=cl(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=ha(a,r,e+1/3),this.g=ha(a,r,e),this.b=ha(a,r,e-1/3)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t=xt){function n(r){r!==void 0&&parseFloat(r)<1&&Me("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Me("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Me("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=xt){const n=Gh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Me("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Hn(e.r),this.g=Hn(e.g),this.b=Hn(e.b),this}copyLinearToSRGB(e){return this.r=Xi(e.r),this.g=Xi(e.g),this.b=Xi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=xt){return Xe.workingToColorSpace(Nt.copy(this),e),Math.round(He(Nt.r*255,0,255))*65536+Math.round(He(Nt.g*255,0,255))*256+Math.round(He(Nt.b*255,0,255))}getHexString(e=xt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(Nt.copy(this),t);const n=Nt.r,i=Nt.g,r=Nt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=xt){Xe.workingToColorSpace(Nt.copy(this),e);const t=Nt.r,n=Nt.g,i=Nt.b;return e!==xt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Ks);const n=Ds(jn.h,Ks.h,t),i=Ds(jn.s,Ks.s,t),r=Ds(jn.l,Ks.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new Ae;Ae.NAMES=Gh;class dl{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ae(e),this.near=t,this.far=n}clone(){return new dl(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class fl extends ht{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const an=new P,Nn=new P,ua=new P,Un=new P,wi=new P,Ci=new P,lc=new P,da=new P,fa=new P,pa=new P,ma=new at,ga=new at,La=new at;class cn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),an.subVectors(e,t),i.cross(an);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){an.subVectors(i,t),Nn.subVectors(n,t),ua.subVectors(e,t);const a=an.dot(an),o=an.dot(Nn),c=an.dot(ua),l=Nn.dot(Nn),h=Nn.dot(ua),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,g=(a*h-o*c)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,Un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Un.x),c.addScaledVector(a,Un.y),c.addScaledVector(o,Un.z),c)}static getInterpolatedAttribute(e,t,n,i,r,a){return ma.setScalar(0),ga.setScalar(0),La.setScalar(0),ma.fromBufferAttribute(e,t),ga.fromBufferAttribute(e,n),La.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ma,r.x),a.addScaledVector(ga,r.y),a.addScaledVector(La,r.z),a}static isFrontFacing(e,t,n,i){return an.subVectors(n,t),Nn.subVectors(e,t),an.cross(Nn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return an.subVectors(this.c,this.b),Nn.subVectors(this.a,this.b),an.cross(Nn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return cn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;wi.subVectors(i,n),Ci.subVectors(r,n),da.subVectors(e,n);const c=wi.dot(da),l=Ci.dot(da);if(c<=0&&l<=0)return t.copy(n);fa.subVectors(e,i);const h=wi.dot(fa),u=Ci.dot(fa);if(h>=0&&u<=h)return t.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(wi,a);pa.subVectors(e,r);const f=wi.dot(pa),g=Ci.dot(pa);if(g>=0&&f<=g)return t.copy(r);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(Ci,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return lc.subVectors(r,i),o=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(lc,o);const p=1/(m+_+d);return a=_*p,o=d*p,t.copy(n).addScaledVector(wi,a).addScaledVector(Ci,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Mt{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(on.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(on.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=on.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,on):on.fromBufferAttribute(r,a),on.applyMatrix4(e.matrixWorld),this.expandByPoint(on);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$s.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$s.copy(n.boundingBox)),$s.applyMatrix4(e.matrixWorld),this.union($s)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,on),on.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ps),Zs.subVectors(this.max,ps),Ri.subVectors(e.a,ps),Pi.subVectors(e.b,ps),Di.subVectors(e.c,ps),Kn.subVectors(Pi,Ri),$n.subVectors(Di,Pi),ai.subVectors(Ri,Di);let t=[0,-Kn.z,Kn.y,0,-$n.z,$n.y,0,-ai.z,ai.y,Kn.z,0,-Kn.x,$n.z,0,-$n.x,ai.z,0,-ai.x,-Kn.y,Kn.x,0,-$n.y,$n.x,0,-ai.y,ai.x,0];return!_a(t,Ri,Pi,Di,Zs)||(t=[1,0,0,0,1,0,0,0,1],!_a(t,Ri,Pi,Di,Zs))?!1:(Js.crossVectors(Kn,$n),t=[Js.x,Js.y,Js.z],_a(t,Ri,Pi,Di,Zs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,on).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(on).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Fn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Fn=[new P,new P,new P,new P,new P,new P,new P,new P],on=new P,$s=new Mt,Ri=new P,Pi=new P,Di=new P,Kn=new P,$n=new P,ai=new P,ps=new P,Zs=new P,Js=new P,oi=new P;function _a(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){oi.fromArray(s,r);const o=i.x*Math.abs(oi.x)+i.y*Math.abs(oi.y)+i.z*Math.abs(oi.z),c=e.dot(oi),l=t.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Lt=new P,Qs=new Ee;let mf=0;class zt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:mf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=No,this.updateRanges=[],this.gpuType=Jt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Qs.fromBufferAttribute(this,t),Qs.applyMatrix3(e),this.setXY(t,Qs.x,Qs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Je(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ln(t,this.array)),t}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ln(t,this.array)),t}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ln(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ln(t,this.array)),t}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),i=Je(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==No&&(e.usage=this.usage),e}}class Wh extends zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Xh extends zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Rt extends zt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const gf=new Mt,ms=new P,xa=new P;class Rn{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):gf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ms.subVectors(e,this.center);const t=ms.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ms,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(xa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ms.copy(e.center).add(xa)),this.expandByPoint(ms.copy(e.center).sub(xa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Lf=0;const $t=new Fe,va=new ht,Ii=new P,qt=new Mt,gs=new Mt,wt=new P;class Ut extends vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=un(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Nd(e)?Xh:Wh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ue().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return va.lookAt(e),va.updateMatrix(),this.applyMatrix4(va.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Rt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Me("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Mt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ce("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];qt.setFromBufferAttribute(r),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,qt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,qt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(qt.min),this.boundingBox.expandByPoint(qt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ce('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Rn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ce("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(qt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];gs.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(qt.min,gs.min),qt.expandByPoint(wt),wt.addVectors(qt.max,gs.max),qt.expandByPoint(wt)):(qt.expandByPoint(gs.min),qt.expandByPoint(gs.max))}qt.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)wt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(wt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)wt.fromBufferAttribute(o,l),c&&(Ii.fromBufferAttribute(e,l),wt.add(Ii)),i=Math.max(i,n.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ce('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ce("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new zt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let x=0;x<n.count;x++)o[x]=new P,c[x]=new P;const l=new P,h=new P,u=new P,d=new Ee,f=new Ee,g=new Ee,_=new P,m=new P;function p(x,S,D){l.fromBufferAttribute(n,x),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,D),d.fromBufferAttribute(r,x),f.fromBufferAttribute(r,S),g.fromBufferAttribute(r,D),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const w=1/(f.x*g.y-g.x*f.y);isFinite(w)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(w),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(w),o[x].add(_),o[S].add(_),o[D].add(_),c[x].add(m),c[S].add(m),c[D].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let x=0,S=M.length;x<S;++x){const D=M[x],w=D.start,F=D.count;for(let B=w,G=w+F;B<G;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const E=new P,v=new P,b=new P,T=new P;function C(x){b.fromBufferAttribute(i,x),T.copy(b);const S=o[x];E.copy(S),E.sub(b.multiplyScalar(b.dot(S))).normalize(),v.crossVectors(T,S);const w=v.dot(c[x])<0?-1:1;a.setXYZW(x,E.x,E.y,E.z,w)}for(let x=0,S=M.length;x<S;++x){const D=M[x],w=D.start,F=D.count;for(let B=w,G=w+F;B<G;B+=3)C(e.getX(B+0)),C(e.getX(B+1)),C(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new P,r=new P,a=new P,o=new P,c=new P,l=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){o.isInterleavedBufferAttribute?f=c[_]*o.data.stride+o.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new zt(d,h,u)}if(this.index===null)return Me("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ut,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _f{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=No,this.updateRanges=[],this.version=0,this.uuid=un()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=un()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ft=new P;class pl{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=ln(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Je(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Je(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ln(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ln(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ln(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ln(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),i=Je(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Je(t,this.array),n=Je(n,this.array),i=Je(i,this.array),r=Je(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Nr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new zt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new pl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Nr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let xf=0;class dn extends vi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=un(),this.name="",this.type="Material",this.blending=Wi,this.side=fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xa,this.blendDst=Ya,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Si,this.stencilZFail=Si,this.stencilZPass=Si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Me(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Me(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Wi&&(n.blending=this.blending),this.side!==fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ya&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Si&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Si&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Si&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const On=new P,ya=new P,er=new P,Zn=new P,Ma=new P,tr=new P,Sa=new P;class rs{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,On)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=On.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(On.copy(this.origin).addScaledVector(this.direction,t),On.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ya.copy(e).add(t).multiplyScalar(.5),er.copy(t).sub(e).normalize(),Zn.copy(this.origin).sub(ya);const r=e.distanceTo(t)*.5,a=-this.direction.dot(er),o=Zn.dot(this.direction),c=-Zn.dot(er),l=Zn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-o,d=a*o-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ya).addScaledVector(er,d),f}intersectSphere(e,t){On.subVectors(e.center,this.origin);const n=On.dot(this.direction),i=On.dot(On)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,On)!==null}intersectTriangle(e,t,n,i,r){Ma.subVectors(t,e),tr.subVectors(n,e),Sa.crossVectors(Ma,tr);let a=this.direction.dot(Sa),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,e);const c=o*this.direction.dot(tr.crossVectors(Zn,tr));if(c<0)return null;const l=o*this.direction.dot(Ma.cross(Zn));if(l<0||c+l>a)return null;const h=-o*Zn.dot(Sa);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Tn extends dn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=Zo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const cc=new Fe,li=new rs,nr=new Rn,hc=new P,ir=new P,sr=new P,rr=new P,ba=new P,ar=new P,uc=new P,or=new P;class Ge extends ht{constructor(e=new Ut,t=new Tn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){ar.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(ba.fromBufferAttribute(u,e),a?ar.addScaledVector(ba,h):ar.addScaledVector(ba.sub(t),h))}t.add(ar)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(r),li.copy(e.ray).recast(e.near),!(nr.containsPoint(li.origin)===!1&&(li.intersectSphere(nr,hc)===null||li.origin.distanceToSquared(hc)>(e.far-e.near)**2))&&(cc.copy(r).invert(),li.copy(e.ray).applyMatrix4(cc),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,li)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),E=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let v=M,b=E;v<b;v+=3){const T=o.getX(v),C=o.getX(v+1),x=o.getX(v+2);i=lr(this,p,e,n,l,h,u,T,C,x),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const M=o.getX(m),E=o.getX(m+1),v=o.getX(m+2);i=lr(this,a,e,n,l,h,u,M,E,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),E=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=M,b=E;v<b;v+=3){const T=v,C=v+1,x=v+2;i=lr(this,p,e,n,l,h,u,T,C,x),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const M=m,E=m+1,v=m+2;i=lr(this,a,e,n,l,h,u,M,E,v),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function vf(s,e,t,n,i,r,a,o){let c;if(e.side===kt?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===fn,o),c===null)return null;or.copy(o),or.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(or);return l<t.near||l>t.far?null:{distance:l,point:or.clone(),object:s}}function lr(s,e,t,n,i,r,a,o,c,l){s.getVertexPosition(o,ir),s.getVertexPosition(c,sr),s.getVertexPosition(l,rr);const h=vf(s,e,t,n,ir,sr,rr,uc);if(h){const u=new P;cn.getBarycoord(uc,ir,sr,rr,u),i&&(h.uv=cn.getInterpolatedAttribute(i,o,c,l,u,new Ee)),r&&(h.uv1=cn.getInterpolatedAttribute(r,o,c,l,u,new Ee)),a&&(h.normal=cn.getInterpolatedAttribute(a,o,c,l,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new P,materialIndex:0};cn.getNormal(ir,sr,rr,d.normal),h.face=d,h.barycoord=u}return h}const dc=new P,fc=new at,pc=new at,yf=new P,mc=new Fe,cr=new P,Ea=new Rn,gc=new Fe,Ta=new rs;class Mf extends Ge{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Gl,this.bindMatrix=new Fe,this.bindMatrixInverse=new Fe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Mt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,cr),this.boundingBox.expandByPoint(cr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Rn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,cr),this.boundingSphere.expandByPoint(cr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ea.copy(this.boundingSphere),Ea.applyMatrix4(i),e.ray.intersectsSphere(Ea)!==!1&&(gc.copy(i).invert(),Ta.copy(e.ray).applyMatrix4(gc),!(this.boundingBox!==null&&Ta.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ta)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new at,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Gl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Sd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Me("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;fc.fromBufferAttribute(i.attributes.skinIndex,e),pc.fromBufferAttribute(i.attributes.skinWeight,e),dc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=pc.getComponent(r);if(a!==0){const o=fc.getComponent(r);mc.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(yf.copy(dc).applyMatrix4(mc),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class Yh extends ht{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ml extends St{constructor(e=null,t=1,n=1,i,r,a,o,c,l=vt,h=vt,u,d){super(null,a,o,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Lc=new Fe,Sf=new Fe;class gl{constructor(e=[],t=[]){this.uuid=un(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Me("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Fe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Fe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Sf;Lc.multiplyMatrices(o,t[r]),Lc.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new gl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new ml(t,e,e,Qt,Jt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Me("Skeleton: No bone found with UUID:",r),a=new Yh),this.bones.push(a),this.boneInverses.push(new Fe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Uo extends zt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ni=new Fe,_c=new Fe,hr=[],xc=new Mt,bf=new Fe,Ls=new Ge,_s=new Rn;class Is extends Ge{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Uo(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,bf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Mt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ni),xc.copy(e.boundingBox).applyMatrix4(Ni),this.boundingBox.union(xc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Rn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ni),_s.copy(e.boundingSphere).applyMatrix4(Ni),this.boundingSphere.union(_s)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=e.previousInstanceMatrix.clone()),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ls.geometry=this.geometry,Ls.material=this.material,Ls.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_s.copy(this.boundingSphere),_s.applyMatrix4(n),e.ray.intersectsSphere(_s)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ni),_c.multiplyMatrices(n,Ni),Ls.matrixWorld=_c,Ls.raycast(e,hr);for(let a=0,o=hr.length;a<o;a++){const c=hr[a];c.instanceId=r,c.object=this,t.push(c)}hr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Uo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ml(new Float32Array(i*this.count),i,this.count,nl,Jt));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Aa=new P,Ef=new P,Tf=new Ue;class ei{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Aa.subVectors(n,t).cross(Ef.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Aa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Tf.getNormalMatrix(e),i=this.coplanarPoint(Aa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Rn,Af=new Ee(.5,.5),ur=new P;class kr{constructor(e=new ei,t=new ei,n=new ei,i=new ei,r=new ei,a=new ei){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],M=r[12],E=r[13],v=r[14],b=r[15];if(i[0].setComponents(l-a,f-h,p-g,b-M).normalize(),i[1].setComponents(l+a,f+h,p+g,b+M).normalize(),i[2].setComponents(l+o,f+u,p+_,b+E).normalize(),i[3].setComponents(l-o,f-u,p-_,b-E).normalize(),n)i[4].setComponents(c,d,m,v).normalize(),i[5].setComponents(l-c,f-d,p-m,b-v).normalize();else if(i[4].setComponents(l-c,f-d,p-m,b-v).normalize(),t===En)i[5].setComponents(l+c,f+d,p+m,b+v).normalize();else if(t===Vs)i[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(e){ci.center.set(0,0,0);const t=Af.distanceTo(e.center);return ci.radius=.7071067811865476+t,ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(ur.x=i.normal.x>0?e.max.x:e.min.x,ur.y=i.normal.y>0?e.max.y:e.min.y,ur.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ur)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class zr extends dn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Fr=new P,Or=new P,vc=new Fe,xs=new rs,dr=new Rn,wa=new P,yc=new P;class Vr extends ht{constructor(e=new Ut,t=new zr){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Fr.fromBufferAttribute(t,i-1),Or.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Fr.distanceTo(Or);e.setAttribute("lineDistance",new Rt(n,1))}else Me("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(i),dr.radius+=r,e.ray.intersectsSphere(dr)===!1)return;vc.copy(i).invert(),xs.copy(e.ray).applyMatrix4(vc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=h.getX(_),M=h.getX(_+1),E=fr(this,e,xs,c,p,M,_);E&&t.push(E)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=fr(this,e,xs,c,_,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=fr(this,e,xs,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){const _=fr(this,e,xs,c,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function fr(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(Fr.fromBufferAttribute(o,i),Or.fromBufferAttribute(o,r),t.distanceSqToSegment(Fr,Or,wa,yc)>n)return;wa.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(wa);if(!(l<e.near||l>e.far))return{distance:l,point:yc.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const Mc=new P,Sc=new P;class qh extends Vr{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Mc.fromBufferAttribute(t,i),Sc.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Mc.distanceTo(Sc);e.setAttribute("lineDistance",new Rt(n,1))}else Me("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jh extends Vr{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Kh extends dn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ae(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const bc=new Fe,Fo=new rs,pr=new Rn,mr=new P;class wf extends ht{constructor(e=new Ut,t=new Kh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),pr.copy(n.boundingSphere),pr.applyMatrix4(i),pr.radius+=r,e.ray.intersectsSphere(pr)===!1)return;bc.copy(i).invert(),Fo.copy(e.ray).applyMatrix4(bc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let g=d,_=f;g<_;g++){const m=l.getX(g);mr.fromBufferAttribute(u,m),Ec(mr,m,c,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,_=f;g<_;g++)mr.fromBufferAttribute(u,g),Ec(mr,g,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Ec(s,e,t,n,i,r,a){const o=Fo.distanceSqToPoint(s);if(o<t){const c=new P;Fo.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class $h extends St{constructor(e=[],t=_i,n,i,r,a,o,c,l,h){super(e,t,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Cf extends St{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ji extends St{constructor(e,t,n=pn,i,r,a,o=vt,c=vt,l,h=Gn,u=1){if(h!==Gn&&h!==gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new hl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Rf extends Ji{constructor(e,t=pn,n=_i,i,r,a=vt,o=vt,c,l=Gn){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,c,l),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Zh extends St{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class as extends Ut{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,i,a,2),g("x","z","y",1,-1,e,n,-t,i,a,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Rt(l,3)),this.setAttribute("normal",new Rt(h,3)),this.setAttribute("uv",new Rt(u,2));function g(_,m,p,M,E,v,b,T,C,x,S){const D=v/C,w=b/x,F=v/2,B=b/2,G=T/2,H=C+1,O=x+1;let k=0,Z=0;const $=new P;for(let oe=0;oe<O;oe++){const de=oe*w-B;for(let he=0;he<H;he++){const Ie=he*D-F;$[_]=Ie*M,$[m]=de*E,$[p]=G,l.push($.x,$.y,$.z),$[_]=0,$[m]=0,$[p]=T>0?1:-1,h.push($.x,$.y,$.z),u.push(he/C),u.push(1-oe/x),k+=1}}for(let oe=0;oe<x;oe++)for(let de=0;de<C;de++){const he=d+de+H*oe,Ie=d+de+H*(oe+1),ot=d+(de+1)+H*(oe+1),it=d+(de+1)+H*oe;c.push(he,Ie,it),c.push(Ie,ot,it),Z+=6}o.addGroup(f,Z,S),f+=Z,d+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new as(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ll extends Ut{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;M(),a===!1&&(e>0&&E(!0),t>0&&E(!1)),this.setIndex(h),this.setAttribute("position",new Rt(u,3)),this.setAttribute("normal",new Rt(d,3)),this.setAttribute("uv",new Rt(f,2));function M(){const v=new P,b=new P;let T=0;const C=(t-e)/n;for(let x=0;x<=r;x++){const S=[],D=x/r,w=D*(t-e)+e;for(let F=0;F<=i;F++){const B=F/i,G=B*c+o,H=Math.sin(G),O=Math.cos(G);b.x=w*H,b.y=-D*n+m,b.z=w*O,u.push(b.x,b.y,b.z),v.set(H,C,O).normalize(),d.push(v.x,v.y,v.z),f.push(B,1-D),S.push(g++)}_.push(S)}for(let x=0;x<i;x++)for(let S=0;S<r;S++){const D=_[S][x],w=_[S+1][x],F=_[S+1][x+1],B=_[S][x+1];(e>0||S!==0)&&(h.push(D,w,B),T+=3),(t>0||S!==r-1)&&(h.push(w,F,B),T+=3)}l.addGroup(p,T,0),p+=T}function E(v){const b=g,T=new Ee,C=new P;let x=0;const S=v===!0?e:t,D=v===!0?1:-1;for(let F=1;F<=i;F++)u.push(0,m*D,0),d.push(0,D,0),f.push(.5,.5),g++;const w=g;for(let F=0;F<=i;F++){const G=F/i*c+o,H=Math.cos(G),O=Math.sin(G);C.x=S*O,C.y=m*D,C.z=S*H,u.push(C.x,C.y,C.z),d.push(0,D,0),T.x=H*.5+.5,T.y=O*.5*D+.5,f.push(T.x,T.y),g++}for(let F=0;F<i;F++){const B=b+F,G=w+F;v===!0?h.push(G,G+1,B):h.push(G+1,G,B),x+=3}l.addGroup(p,x,v===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ll(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qi extends Ut{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=e/o,d=t/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const M=p*d-a;for(let E=0;E<l;E++){const v=E*u-r;g.push(v,-M,0),_.push(0,0,1),m.push(E/o),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<o;M++){const E=M+l*p,v=M+l*(p+1),b=M+1+l*(p+1),T=M+1+l*p;f.push(E,v,T),f.push(v,b,T)}this.setIndex(f),this.setAttribute("position",new Rt(g,3)),this.setAttribute("normal",new Rt(_,3)),this.setAttribute("uv",new Rt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qi(e.width,e.height,e.widthSegments,e.heightSegments)}}function es(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(Me("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Ot(s){const e={};for(let t=0;t<s.length;t++){const n=es(s[t]);for(const i in n)e[i]=n[i]}return e}function Pf(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Jh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Xe.workingColorSpace}const Df={clone:es,merge:Ot};var If=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Nf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ln extends dn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=If,this.fragmentShader=Nf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=es(e.uniforms),this.uniformsGroups=Pf(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Uf extends Ln{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class xi extends dn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Wt extends xi{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ee(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return He(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Ff extends dn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=al,this.normalScale=new Ee(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=Zo,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Of extends dn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Td,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Bf extends dn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function gr(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function kf(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Tc(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let c=0;c!==e;++c)i[a++]=s[o+c]}return i}function Qh(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class os{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class zf extends os{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Xl,endingEnd:Xl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Yl:r=e,o=2*t-n;break;case ql:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Yl:a=e,c=2*n-t;break;case ql:a=1,c=n+i[1]-i[0];break;default:a=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,M=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,E=(-1-f)*m+(1.5+f)*_+.5*g,v=f*m-f*_;for(let b=0;b!==o;++b)r[b]=p*a[h+b]+M*a[l+b]+E*a[c+b]+v*a[u+b];return r}}class Vf extends os{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}}class Hf extends os{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Gf extends os{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this.settings||this.DefaultSettings_,u=h.inTangents,d=h.outTangents;if(!u||!d){const _=(n-t)/(i-t),m=1-_;for(let p=0;p!==o;++p)r[p]=a[l+p]*m+a[c+p]*_;return r}const f=o*2,g=e-1;for(let _=0;_!==o;++_){const m=a[l+_],p=a[c+_],M=g*f+_*2,E=d[M],v=d[M+1],b=e*f+_*2,T=u[b],C=u[b+1];let x=(n-t)/(i-t),S,D,w,F,B;for(let G=0;G<8;G++){S=x*x,D=S*x,w=1-x,F=w*w,B=F*w;const O=B*t+3*F*x*E+3*w*S*T+D*i-n;if(Math.abs(O)<1e-10)break;const k=3*F*(E-t)+6*w*x*(T-E)+3*S*(i-T);if(Math.abs(k)<1e-10)break;x=x-O/k,x=Math.max(0,Math.min(1,x))}r[_]=B*m+3*F*x*v+3*w*S*C+D*p}return r}}class _n{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=gr(t,this.TimeBufferType),this.values=gr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:gr(e.times,Array),values:gr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Hf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Vf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new zf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Gf(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.settings=this.settings),t}setInterpolation(e){let t;switch(e){case ks:t=this.InterpolantFactoryMethodDiscrete;break;case zs:t=this.InterpolantFactoryMethodLinear;break;case na:t=this.InterpolantFactoryMethodSmooth;break;case Wl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Me("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ks;case this.InterpolantFactoryMethodLinear:return zs;case this.InterpolantFactoryMethodSmooth:return na;case this.InterpolantFactoryMethodBezier:return Wl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ce("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(Ce("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){Ce("KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){Ce("KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(i!==void 0&&Ud(i))for(let o=0,c=i.length;o!==c;++o){const l=i[o];if(isNaN(l)){Ce("KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===na,r=e.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(i)c=!0;else{const u=o*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){const _=t[u+g];if(_!==t[d+g]||_!==t[f+g]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=zs;class ls extends _n{constructor(e,t,n){super(e,t,n)}}ls.prototype.ValueTypeName="bool";ls.prototype.ValueBufferType=Array;ls.prototype.DefaultInterpolation=ks;ls.prototype.InterpolantFactoryMethodLinear=void 0;ls.prototype.InterpolantFactoryMethodSmooth=void 0;class eu extends _n{constructor(e,t,n,i){super(e,t,n,i)}}eu.prototype.ValueTypeName="color";class ts extends _n{constructor(e,t,n,i){super(e,t,n,i)}}ts.prototype.ValueTypeName="number";class Wf extends os{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(i-t);let l=e*o;for(let h=l+o;l!==h;l+=4)mn.slerpFlat(r,0,a,l-o,a,l,c);return r}}class ns extends _n{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Wf(this.times,this.values,this.getValueSize(),e)}}ns.prototype.ValueTypeName="quaternion";ns.prototype.InterpolantFactoryMethodSmooth=void 0;class cs extends _n{constructor(e,t,n){super(e,t,n)}}cs.prototype.ValueTypeName="string";cs.prototype.ValueBufferType=Array;cs.prototype.DefaultInterpolation=ks;cs.prototype.InterpolantFactoryMethodLinear=void 0;cs.prototype.InterpolantFactoryMethodSmooth=void 0;class is extends _n{constructor(e,t,n,i){super(e,t,n,i)}}is.prototype.ValueTypeName="vector";class Xf{constructor(e="",t=-1,n=[],i=bd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=un(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(qf(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(_n.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const h=kf(c);c=Tc(c,1,h),l=Tc(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new ts(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(l)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(Me("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return Ce("AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,g,_){if(f.length!==0){const m=[],p=[];Qh(f,m,p,g),m.length!==0&&_.push(new u(d,m,p))}},i=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let g;for(g=0;g<d.length;g++)if(d[g].morphTargets)for(let _=0;_<d[g].morphTargets.length;_++)f[d[g].morphTargets[_]]=-1;for(const _ in f){const m=[],p=[];for(let M=0;M!==d[g].morphTargets.length;++M){const E=d[g];m.push(E.time),p.push(E.morphTarget===_?1:0)}i.push(new ts(".morphTargetInfluence["+_+"]",m,p))}c=f.length*a}else{const f=".bones["+t[u].name+"]";n(is,f+".position",d,"pos",i),n(ns,f+".quaternion",d,"rot",i),n(is,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Yf(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ts;case"vector":case"vector2":case"vector3":case"vector4":return is;case"color":return eu;case"quaternion":return ns;case"bool":case"boolean":return ls;case"string":return cs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function qf(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Yf(s.type);if(s.times===void 0){const t=[],n=[];Qh(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const Vn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Ac(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Ac(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Ac(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class jf{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const f=l[u],g=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Kf=new jf;class hs{constructor(e){this.manager=e!==void 0?e:Kf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}hs.DEFAULT_MATERIAL_NAME="__DEFAULT";const Bn={};class $f extends Error{constructor(e,t){super(e),this.response=t}}class tu extends hs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Vn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Bn[e]!==void 0){Bn[e].push({onLoad:t,onProgress:n,onError:i});return}Bn[e]=[],Bn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Me("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Bn[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0;let _=0;const m=new ReadableStream({start(p){M();function M(){u.read().then(({done:E,value:v})=>{if(E)p.close();else{_+=v.byteLength;const b=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let T=0,C=h.length;T<C;T++){const x=h[T];x.onProgress&&x.onProgress(b)}p.enqueue(v),M()}},E=>{p.error(E)})}}});return new Response(m)}else throw new $f(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o==="")return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(g=>f.decode(g))}}}).then(l=>{Vn.add(`file:${e}`,l);const h=Bn[e];delete Bn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=Bn[e];if(h===void 0)throw this.manager.itemError(e),l;delete Bn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ui=new WeakMap;class Zf extends hs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Vn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=Ui.get(a);u===void 0&&(u=[],Ui.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=Hs("img");function c(){h(),t&&t(this);const u=Ui.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}Ui.delete(this),r.manager.itemEnd(e)}function l(u){h(),i&&i(u),Vn.remove(`image:${e}`);const d=Ui.get(this)||[];for(let f=0;f<d.length;f++){const g=d[f];g.onError&&g.onError(u)}Ui.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Vn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Jf extends hs{constructor(e){super(e)}load(e,t,n,i){const r=new St,a=new Zf(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Hr extends ht{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Qf extends Hr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ae(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ca=new Fe,wc=new P,Cc=new P;class _l{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ee(512,512),this.mapType=jt,this.map=null,this.mapPass=null,this.matrix=new Fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new kr,this._frameExtents=new Ee(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;wc.setFromMatrixPosition(e.matrixWorld),t.position.copy(wc),Cc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Cc),t.updateMatrixWorld(),Ca.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ca,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Vs||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ca)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Lr=new P,_r=new mn,vn=new P;class xl extends ht{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Fe,this.projectionMatrix=new Fe,this.projectionMatrixInverse=new Fe,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Lr,_r,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lr,_r,vn.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Lr,_r,vn),vn.x===1&&vn.y===1&&vn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lr,_r,vn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new P,Rc=new Ee,Pc=new Ee;class Bt extends xl{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Zi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ps*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Zi*2*Math.atan(Math.tan(Ps*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-e/Jn.z)}getViewSize(e,t){return this.getViewBounds(e,Rc,Pc),t.subVectors(Pc,Rc)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ps*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ep extends _l{constructor(){super(new Bt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Zi*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class tp extends Hr{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new ep}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class np extends _l{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0}}class nu extends Hr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new np}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Gs extends xl{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class ip extends _l{constructor(){super(new Gs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wr extends Hr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ht.DEFAULT_UP),this.updateMatrix(),this.target=new ht,this.shadow=new ip}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Ns{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Ra=new WeakMap;class sp extends hs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Me("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Me("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Vn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{if(Ra.has(a)===!0)i&&i(Ra.get(a)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(l),r.manager.itemEnd(e),l});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Vn.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){i&&i(l),Ra.set(c,l),Vn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Vn.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Fi=-90,Oi=1;class rp extends ht{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Bt(Fi,Oi,e,t);i.layers=this.layers,this.add(i);const r=new Bt(Fi,Oi,e,t);r.layers=this.layers,this.add(r);const a=new Bt(Fi,Oi,e,t);a.layers=this.layers,this.add(a);const o=new Bt(Fi,Oi,e,t);o.layers=this.layers,this.add(o);const c=new Bt(Fi,Oi,e,t);c.layers=this.layers,this.add(c);const l=new Bt(Fi,Oi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Vs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ap extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const vl="\\[\\]\\.:\\/",op=new RegExp("["+vl+"]","g"),yl="[^"+vl+"]",lp="[^"+vl.replace("\\.","")+"]",cp=/((?:WC+[\/:])*)/.source.replace("WC",yl),hp=/(WCOD+)?/.source.replace("WCOD",lp),up=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",yl),dp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",yl),fp=new RegExp("^"+cp+hp+up+dp+"$"),pp=["material","materials","bones","map"];class mp{constructor(e,t,n){const i=n||Qe.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Qe{constructor(e,t,n){this.path=t,this.parsedPath=n||Qe.parseTrackName(t),this.node=Qe.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Qe.Composite(e,t,n):new Qe(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(op,"")}static parseTrackName(e){const t=fp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);pp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=Qe.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Me("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ce("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ce("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ce("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ce("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ce("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ce("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ce("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[i];if(a===void 0){const l=t.nodeName;Ce("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ce("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ce("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Qe.Composite=mp;Qe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Qe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Qe.prototype.GetterByBindingType=[Qe.prototype._getValue_direct,Qe.prototype._getValue_array,Qe.prototype._getValue_arrayElement,Qe.prototype._getValue_toArray];Qe.prototype.SetterByBindingTypeAndVersioning=[[Qe.prototype._setValue_direct,Qe.prototype._setValue_direct_setNeedsUpdate,Qe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Qe.prototype._setValue_array,Qe.prototype._setValue_array_setNeedsUpdate,Qe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Qe.prototype._setValue_arrayElement,Qe.prototype._setValue_arrayElement_setNeedsUpdate,Qe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Qe.prototype._setValue_fromArray,Qe.prototype._setValue_fromArray_setNeedsUpdate,Qe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Dc=new Fe;class gp{constructor(e,t,n=0,i=1/0){this.ray=new rs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new ul,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ce("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Dc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Dc),this}intersectObject(e,t=!0,n=[]){return Oo(e,this,n,t),n.sort(Ic),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Oo(e[i],this,n,t);return n.sort(Ic),n}}function Ic(s,e){return s.distance-e.distance}function Oo(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Oo(r[a],e,t,!0)}}class Lp{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Me("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class Nc{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=He(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(He(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Uc=new Ee;class _p{constructor(e=new Ee(1/0,1/0),t=new Ee(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Uc.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Uc).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}class xp extends qh{constructor(e=10,t=10,n=4473924,i=8947848){n=new Ae(n),i=new Ae(i);const r=t/2,a=e/t,o=e/2,c=[],l=[];for(let d=0,f=0,g=-o;d<=t;d++,g+=a){c.push(-o,0,g,o,0,g),c.push(g,0,-o,g,0,o);const _=d===r?n:i;_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3,_.toArray(l,f),f+=3}const h=new Ut;h.setAttribute("position",new Rt(c,3)),h.setAttribute("color",new Rt(l,3));const u=new zr({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class vp extends vi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Me("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Fc(s,e,t,n){const i=yp(n);switch(t){case Bh:return s*e;case nl:return s*e/i.components*i.byteLength;case il:return s*e/i.components*i.byteLength;case $i:return s*e*2/i.components*i.byteLength;case sl:return s*e*2/i.components*i.byteLength;case kh:return s*e*3/i.components*i.byteLength;case Qt:return s*e*4/i.components*i.byteLength;case rl:return s*e*4/i.components*i.byteLength;case br:case Er:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Tr:case Ar:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case to:case io:return Math.max(s,16)*Math.max(e,8)/4;case eo:case no:return Math.max(s,8)*Math.max(e,8)/2;case so:case ro:case oo:case lo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ao:case co:case ho:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case uo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case fo:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case po:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case mo:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case go:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Lo:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case _o:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case xo:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case vo:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case yo:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Mo:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case So:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case bo:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Eo:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case To:case Ao:case wo:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Co:case Ro:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Po:case Do:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function yp(s){switch(s){case jt:case Nh:return{byteLength:1,components:1};case Os:case Uh:case Cn:return{byteLength:2,components:1};case el:case tl:return{byteLength:2,components:4};case pn:case Qo:case Jt:return{byteLength:4,components:1};case Fh:case Oh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$o}}));typeof window<"u"&&(window.__THREE__?Me("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$o);function iu(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Mp(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=s.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(s.bindBuffer(l,o),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}var Sp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Tp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ap=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Cp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Rp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Pp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Dp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ip=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Np=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Up=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Op=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Bp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,kp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Gp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Xp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Yp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,qp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,jp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Kp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$p=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Zp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qp="gl_FragColor = linearToOutputTexel( gl_FragColor );",em=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,tm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,nm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,im=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,am=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,om=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,lm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,um=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,fm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,pm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,mm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,gm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_m=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,xm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ym=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Mm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Sm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Em=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Am=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Cm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Rm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Dm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Im=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Nm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Um=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Om=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,km=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Vm=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Wm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Xm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ym=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,qm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Km=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$m=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Zm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Jm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Qm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,e0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,t0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,n0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,i0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,s0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,r0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,a0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,o0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,l0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,c0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,h0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,u0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,d0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,f0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,p0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,m0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,g0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,L0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,x0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,v0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,y0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const M0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,S0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,E0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,T0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,A0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,C0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,R0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,P0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,D0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,I0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,U0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,F0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,O0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,k0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,V0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,H0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,G0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,W0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,X0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Y0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,q0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Z0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,J0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Q0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,e1=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,t1=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Be={alphahash_fragment:Sp,alphahash_pars_fragment:bp,alphamap_fragment:Ep,alphamap_pars_fragment:Tp,alphatest_fragment:Ap,alphatest_pars_fragment:wp,aomap_fragment:Cp,aomap_pars_fragment:Rp,batching_pars_vertex:Pp,batching_vertex:Dp,begin_vertex:Ip,beginnormal_vertex:Np,bsdfs:Up,iridescence_fragment:Fp,bumpmap_pars_fragment:Op,clipping_planes_fragment:Bp,clipping_planes_pars_fragment:kp,clipping_planes_pars_vertex:zp,clipping_planes_vertex:Vp,color_fragment:Hp,color_pars_fragment:Gp,color_pars_vertex:Wp,color_vertex:Xp,common:Yp,cube_uv_reflection_fragment:qp,defaultnormal_vertex:jp,displacementmap_pars_vertex:Kp,displacementmap_vertex:$p,emissivemap_fragment:Zp,emissivemap_pars_fragment:Jp,colorspace_fragment:Qp,colorspace_pars_fragment:em,envmap_fragment:tm,envmap_common_pars_fragment:nm,envmap_pars_fragment:im,envmap_pars_vertex:sm,envmap_physical_pars_fragment:mm,envmap_vertex:rm,fog_vertex:am,fog_pars_vertex:om,fog_fragment:lm,fog_pars_fragment:cm,gradientmap_pars_fragment:hm,lightmap_pars_fragment:um,lights_lambert_fragment:dm,lights_lambert_pars_fragment:fm,lights_pars_begin:pm,lights_toon_fragment:gm,lights_toon_pars_fragment:Lm,lights_phong_fragment:_m,lights_phong_pars_fragment:xm,lights_physical_fragment:vm,lights_physical_pars_fragment:ym,lights_fragment_begin:Mm,lights_fragment_maps:Sm,lights_fragment_end:bm,logdepthbuf_fragment:Em,logdepthbuf_pars_fragment:Tm,logdepthbuf_pars_vertex:Am,logdepthbuf_vertex:wm,map_fragment:Cm,map_pars_fragment:Rm,map_particle_fragment:Pm,map_particle_pars_fragment:Dm,metalnessmap_fragment:Im,metalnessmap_pars_fragment:Nm,morphinstance_vertex:Um,morphcolor_vertex:Fm,morphnormal_vertex:Om,morphtarget_pars_vertex:Bm,morphtarget_vertex:km,normal_fragment_begin:zm,normal_fragment_maps:Vm,normal_pars_fragment:Hm,normal_pars_vertex:Gm,normal_vertex:Wm,normalmap_pars_fragment:Xm,clearcoat_normal_fragment_begin:Ym,clearcoat_normal_fragment_maps:qm,clearcoat_pars_fragment:jm,iridescence_pars_fragment:Km,opaque_fragment:$m,packing:Zm,premultiplied_alpha_fragment:Jm,project_vertex:Qm,dithering_fragment:e0,dithering_pars_fragment:t0,roughnessmap_fragment:n0,roughnessmap_pars_fragment:i0,shadowmap_pars_fragment:s0,shadowmap_pars_vertex:r0,shadowmap_vertex:a0,shadowmask_pars_fragment:o0,skinbase_vertex:l0,skinning_pars_vertex:c0,skinning_vertex:h0,skinnormal_vertex:u0,specularmap_fragment:d0,specularmap_pars_fragment:f0,tonemapping_fragment:p0,tonemapping_pars_fragment:m0,transmission_fragment:g0,transmission_pars_fragment:L0,uv_pars_fragment:_0,uv_pars_vertex:x0,uv_vertex:v0,worldpos_vertex:y0,background_vert:M0,background_frag:S0,backgroundCube_vert:b0,backgroundCube_frag:E0,cube_vert:T0,cube_frag:A0,depth_vert:w0,depth_frag:C0,distance_vert:R0,distance_frag:P0,equirect_vert:D0,equirect_frag:I0,linedashed_vert:N0,linedashed_frag:U0,meshbasic_vert:F0,meshbasic_frag:O0,meshlambert_vert:B0,meshlambert_frag:k0,meshmatcap_vert:z0,meshmatcap_frag:V0,meshnormal_vert:H0,meshnormal_frag:G0,meshphong_vert:W0,meshphong_frag:X0,meshphysical_vert:Y0,meshphysical_frag:q0,meshtoon_vert:j0,meshtoon_frag:K0,points_vert:$0,points_frag:Z0,shadow_vert:J0,shadow_frag:Q0,sprite_vert:e1,sprite_frag:t1},ae={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new Ee(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new Ee(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},Sn={basic:{uniforms:Ot([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:Ot([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Ae(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:Ot([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:Ot([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:Ot([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Ae(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:Ot([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:Ot([ae.points,ae.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:Ot([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:Ot([ae.common,ae.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:Ot([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:Ot([ae.sprite,ae.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:Ot([ae.common,ae.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:Ot([ae.lights,ae.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};Sn.physical={uniforms:Ot([Sn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new Ee(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new Ee},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new Ee},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const xr={r:0,b:0,g:0},hi=new gn,n1=new Fe;function i1(s,e,t,n,i,r){const a=new Ae(0);let o=i===!0?0:1,c,l,h=null,u=0,d=null;function f(M){let E=M.isScene===!0?M.background:null;if(E&&E.isTexture){const v=M.backgroundBlurriness>0;E=e.get(E,v)}return E}function g(M){let E=!1;const v=f(M);v===null?m(a,o):v&&v.isColor&&(m(v,1),E=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?t.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||E)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(M,E){const v=f(E);v&&(v.isCubeTexture||v.mapping===Br)?(l===void 0&&(l=new Ge(new as(1,1,1),new Ln({name:"BackgroundCubeMaterial",uniforms:es(Sn.backgroundCube.uniforms),vertexShader:Sn.backgroundCube.vertexShader,fragmentShader:Sn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(b,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),hi.copy(E.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),l.material.uniforms.envMap.value=v,l.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,l.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(n1.makeRotationFromEuler(hi)),l.material.toneMapped=Xe.getTransfer(v.colorSpace)!==Ze,(h!==v||u!==v.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=v,u=v.version,d=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new Ge(new Qi(2,2),new Ln({name:"BackgroundMaterial",uniforms:es(Sn.background.uniforms),vertexShader:Sn.background.vertexShader,fragmentShader:Sn.background.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Xe.getTransfer(v.colorSpace)!==Ze,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(h!==v||u!==v.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=v,u=v.version,d=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function m(M,E){M.getRGB(xr,Jh(s)),t.buffers.color.setClear(xr.r,xr.g,xr.b,E,r)}function p(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,E=1){a.set(M),o=E,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:g,addToRenderList:_,dispose:p}}function s1(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(w,F,B,G,H){let O=!1;const k=u(w,G,B,F);r!==k&&(r=k,l(r.object)),O=f(w,G,B,H),O&&g(w,G,B,H),H!==null&&e.update(H,s.ELEMENT_ARRAY_BUFFER),(O||a)&&(a=!1,v(w,F,B,G),H!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function c(){return s.createVertexArray()}function l(w){return s.bindVertexArray(w)}function h(w){return s.deleteVertexArray(w)}function u(w,F,B,G){const H=G.wireframe===!0;let O=n[F.id];O===void 0&&(O={},n[F.id]=O);const k=w.isInstancedMesh===!0?w.id:0;let Z=O[k];Z===void 0&&(Z={},O[k]=Z);let $=Z[B.id];$===void 0&&($={},Z[B.id]=$);let oe=$[H];return oe===void 0&&(oe=d(c()),$[H]=oe),oe}function d(w){const F=[],B=[],G=[];for(let H=0;H<t;H++)F[H]=0,B[H]=0,G[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:B,attributeDivisors:G,object:w,attributes:{},index:null}}function f(w,F,B,G){const H=r.attributes,O=F.attributes;let k=0;const Z=B.getAttributes();for(const $ in Z)if(Z[$].location>=0){const de=H[$];let he=O[$];if(he===void 0&&($==="instanceMatrix"&&w.instanceMatrix&&(he=w.instanceMatrix),$==="instanceColor"&&w.instanceColor&&(he=w.instanceColor)),de===void 0||de.attribute!==he||he&&de.data!==he.data)return!0;k++}return r.attributesNum!==k||r.index!==G}function g(w,F,B,G){const H={},O=F.attributes;let k=0;const Z=B.getAttributes();for(const $ in Z)if(Z[$].location>=0){let de=O[$];de===void 0&&($==="instanceMatrix"&&w.instanceMatrix&&(de=w.instanceMatrix),$==="instanceColor"&&w.instanceColor&&(de=w.instanceColor));const he={};he.attribute=de,de&&de.data&&(he.data=de.data),H[$]=he,k++}r.attributes=H,r.attributesNum=k,r.index=G}function _(){const w=r.newAttributes;for(let F=0,B=w.length;F<B;F++)w[F]=0}function m(w){p(w,0)}function p(w,F){const B=r.newAttributes,G=r.enabledAttributes,H=r.attributeDivisors;B[w]=1,G[w]===0&&(s.enableVertexAttribArray(w),G[w]=1),H[w]!==F&&(s.vertexAttribDivisor(w,F),H[w]=F)}function M(){const w=r.newAttributes,F=r.enabledAttributes;for(let B=0,G=F.length;B<G;B++)F[B]!==w[B]&&(s.disableVertexAttribArray(B),F[B]=0)}function E(w,F,B,G,H,O,k){k===!0?s.vertexAttribIPointer(w,F,B,H,O):s.vertexAttribPointer(w,F,B,G,H,O)}function v(w,F,B,G){_();const H=G.attributes,O=B.getAttributes(),k=F.defaultAttributeValues;for(const Z in O){const $=O[Z];if($.location>=0){let oe=H[Z];if(oe===void 0&&(Z==="instanceMatrix"&&w.instanceMatrix&&(oe=w.instanceMatrix),Z==="instanceColor"&&w.instanceColor&&(oe=w.instanceColor)),oe!==void 0){const de=oe.normalized,he=oe.itemSize,Ie=e.get(oe);if(Ie===void 0)continue;const ot=Ie.buffer,it=Ie.type,j=Ie.bytesPerElement,ee=it===s.INT||it===s.UNSIGNED_INT||oe.gpuType===Qo;if(oe.isInterleavedBufferAttribute){const re=oe.data,Oe=re.stride,we=oe.offset;if(re.isInstancedInterleavedBuffer){for(let Pe=0;Pe<$.locationSize;Pe++)p($.location+Pe,re.meshPerAttribute);w.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=re.meshPerAttribute*re.count)}else for(let Pe=0;Pe<$.locationSize;Pe++)m($.location+Pe);s.bindBuffer(s.ARRAY_BUFFER,ot);for(let Pe=0;Pe<$.locationSize;Pe++)E($.location+Pe,he/$.locationSize,it,de,Oe*j,(we+he/$.locationSize*Pe)*j,ee)}else{if(oe.isInstancedBufferAttribute){for(let re=0;re<$.locationSize;re++)p($.location+re,oe.meshPerAttribute);w.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let re=0;re<$.locationSize;re++)m($.location+re);s.bindBuffer(s.ARRAY_BUFFER,ot);for(let re=0;re<$.locationSize;re++)E($.location+re,he/$.locationSize,it,de,he*j,he/$.locationSize*re*j,ee)}}else if(k!==void 0){const de=k[Z];if(de!==void 0)switch(de.length){case 2:s.vertexAttrib2fv($.location,de);break;case 3:s.vertexAttrib3fv($.location,de);break;case 4:s.vertexAttrib4fv($.location,de);break;default:s.vertexAttrib1fv($.location,de)}}}}M()}function b(){S();for(const w in n){const F=n[w];for(const B in F){const G=F[B];for(const H in G){const O=G[H];for(const k in O)h(O[k].object),delete O[k];delete G[H]}}delete n[w]}}function T(w){if(n[w.id]===void 0)return;const F=n[w.id];for(const B in F){const G=F[B];for(const H in G){const O=G[H];for(const k in O)h(O[k].object),delete O[k];delete G[H]}}delete n[w.id]}function C(w){for(const F in n){const B=n[F];for(const G in B){const H=B[G];if(H[w.id]===void 0)continue;const O=H[w.id];for(const k in O)h(O[k].object),delete O[k];delete H[w.id]}}}function x(w){for(const F in n){const B=n[F],G=w.isInstancedMesh===!0?w.id:0,H=B[G];if(H!==void 0){for(const O in H){const k=H[O];for(const Z in k)h(k[Z].object),delete k[Z];delete H[O]}delete B[G],Object.keys(B).length===0&&delete n[F]}}}function S(){D(),a=!0,r!==i&&(r=i,l(r.object))}function D(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:S,resetDefaultState:D,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function r1(s,e,t){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function a1(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(C){return!(C!==Qt&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const x=C===Cn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==jt&&n.convert(C)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Jt&&!x)}function c(C){if(C==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Me("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),E=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:E,maxFragmentUniforms:v,maxSamples:b,samples:T}}function o1(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new ei,o=new Ue,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,E=M*4;let v=p.clippingState||null;c.value=v,v=h(g,d,E,f);for(let b=0;b!==E;++b)v[b]=t[b];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let E=0,v=f;E!==_;++E,v+=4)a.copy(u[E]).applyMatrix4(M,o),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}const ii=4,Oc=[.125,.215,.35,.446,.526,.582],mi=20,l1=256,vs=new Gs,Bc=new Ae;let Pa=null,Da=0,Ia=0,Na=!1;const c1=new P;class Bo{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=c1}=r;Pa=this._renderer.getRenderTarget(),Da=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),Na=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,i,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Vc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=zc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Pa,Da,Ia),this._renderer.xr.enabled=Na,e.scissorTest=!1,Bi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===_i||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pa=this._renderer.getRenderTarget(),Da=this._renderer.getActiveCubeFace(),Ia=this._renderer.getActiveMipmapLevel(),Na=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:yt,minFilter:yt,generateMipmaps:!1,type:Cn,format:Qt,colorSpace:Vt,depthBuffer:!1},i=kc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=kc(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=h1(r)),this._blurMaterial=d1(r,e,t),this._ggxMaterial=u1(r,e,t)}return i}_compileMaterial(e){const t=new Ge(new Ut,e);this._renderer.compile(t,vs)}_sceneToCubeUV(e,t,n,i,r){const c=new Bt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Bc),u.toneMapping=wn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ge(new as,new Tn({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let p=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,p=!0):(m.color.copy(Bc),p=!0);for(let E=0;E<6;E++){const v=E%3;v===0?(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[E],r.y,r.z)):v===1?(c.up.set(0,0,l[E]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[E],r.z)):(c.up.set(0,l[E],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[E]));const b=this._cubeSize;Bi(i,v*b,E>2?b:0,b,b),u.setRenderTarget(i),p&&u.render(_,c),u.render(e,c)}u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===_i||e.mapping===ji;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Vc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=zc());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Bi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,vs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(l*l-h*h),d=0+l*1.25,f=u*d,{_lodMax:g}=this,_=this._sizeLods[n],m=3*_*(n>g-ii?n-g+ii:0),p=4*(this._cubeSize-_);c.envMap.value=e.texture,c.roughness.value=f,c.mipInt.value=g-t,Bi(r,m,p,3*_,2*_),i.setRenderTarget(r),i.render(o,vs),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Bi(e,m,p,3*_,2*_),i.setRenderTarget(e),i.render(o,vs)}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ce("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=l;const d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*mi-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):mi;m>mi&&Me(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${mi}`);const p=[];let M=0;for(let C=0;C<mi;++C){const x=C/_,S=Math.exp(-x*x/2);p.push(S),C===0?M+=S:C<m&&(M+=2*S)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:E}=this;d.dTheta.value=g,d.mipInt.value=E-n;const v=this._sizeLods[i],b=3*v*(i>E-ii?i-E+ii:0),T=4*(this._cubeSize-v);Bi(t,b,T,3*v,2*v),c.setRenderTarget(t),c.render(u,vs)}}function h1(s){const e=[],t=[],n=[];let i=s;const r=s-ii+1+Oc.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let c=1/o;a>s-ii?c=Oc[a-s+ii-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,M=new Float32Array(_*g*f),E=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let T=0;T<f;T++){const C=T%3*2/3-1,x=T>2?0:-1,S=[C,x,0,C+2/3,x,0,C+2/3,x+1,0,C,x,0,C+2/3,x+1,0,C,x+1,0];M.set(S,_*g*T),E.set(d,m*g*T);const D=[T,T,T,T,T,T];v.set(D,p*g*T)}const b=new Ut;b.setAttribute("position",new zt(M,_)),b.setAttribute("uv",new zt(E,m)),b.setAttribute("faceIndex",new zt(v,p)),n.push(new Ge(b,null)),i>ii&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function kc(s,e,t){const n=new tn(s,e,t);return n.texture.mapping=Br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Bi(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function u1(s,e,t){return new Ln({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:l1,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Gr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function d1(s,e,t){const n=new Float32Array(mi),i=new P(0,1,0);return new Ln({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Gr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function zc(){return new Ln({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Vc(){return new Ln({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Gr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class su extends tn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new $h(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new as(5,5,5),r=new Ln({name:"CubemapFromEquirect",uniforms:es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:kt,blending:An});r.uniforms.tEquirect.value=t;const a=new Ge(i,r),o=t.minFilter;return t.minFilter===zn&&(t.minFilter=yt),new rp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function f1(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===ea||f===ta)if(e.has(d)){const g=e.get(d).texture;return o(g,d.mapping)}else{const g=d.image;if(g&&g.height>0){const _=new su(g.height);return _.fromEquirectangularTexture(s,d),e.set(d,_),d.addEventListener("dispose",l),o(_.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,g=f===ea||f===ta,_=f===_i||f===ji;if(g||_){let m=t.get(d);const p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new Bo(s)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const M=d.image;return g&&M&&M.height>0||_&&M&&c(M)?(n===null&&(n=new Bo(s)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===ea?d.mapping=_i:f===ta&&(d.mapping=ji),d}function c(d){let f=0;const g=6;for(let _=0;_<g;_++)d[_]!==void 0&&f++;return f===g}function l(d){const f=d.target;f.removeEventListener("dispose",l);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function p1(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&Ur("WebGLRenderer: "+n+" extension not supported."),i}}}function m1(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(g===void 0)return;if(f!==null){const M=f.array;_=f.version;for(let E=0,v=M.length;E<v;E+=3){const b=M[E+0],T=M[E+1],C=M[E+2];d.push(b,T,T,C,C,b)}}else{const M=g.array;_=g.version;for(let E=0,v=M.length/3-1;E<v;E+=3){const b=E+0,T=E+1,C=E+2;d.push(b,T,T,C,C,b)}}const m=new(g.count>=65535?Xh:Wh)(d,1);m.version=_;const p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function g1(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*a),t.update(f,n,1)}function l(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*a,g),t.update(f,n,g))}function h(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M]*_[M];t.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function L1(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Ce("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function _1(s,e,t){const n=new WeakMap,i=new at;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let E=0;f===!0&&(E=1),g===!0&&(E=2),_===!0&&(E=3);let v=o.attributes.position.count*E,b=1;v>e.maxTextureSize&&(b=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);const T=new Float32Array(v*b*4*u),C=new Hh(T,v,b,u);C.type=Jt,C.needsUpdate=!0;const x=E*4;for(let D=0;D<u;D++){const w=m[D],F=p[D],B=M[D],G=v*b*4*D;for(let H=0;H<w.count;H++){const O=H*x;f===!0&&(i.fromBufferAttribute(w,H),T[G+O+0]=i.x,T[G+O+1]=i.y,T[G+O+2]=i.z,T[G+O+3]=0),g===!0&&(i.fromBufferAttribute(F,H),T[G+O+4]=i.x,T[G+O+5]=i.y,T[G+O+6]=i.z,T[G+O+7]=0),_===!0&&(i.fromBufferAttribute(B,H),T[G+O+8]=i.x,T[G+O+9]=i.y,T[G+O+10]=i.z,T[G+O+11]=B.itemSize===4?i.w:1)}}d={count:u,texture:C,size:new Ee(v,b)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];const g=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",g),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function x1(s,e,t,n,i){let r=new WeakMap;function a(l){const h=i.render.frame,u=l.geometry,d=e.get(l,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,s.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const v1={[Th]:"LINEAR_TONE_MAPPING",[Ah]:"REINHARD_TONE_MAPPING",[wh]:"CINEON_TONE_MAPPING",[Jo]:"ACES_FILMIC_TONE_MAPPING",[Rh]:"AGX_TONE_MAPPING",[Ph]:"NEUTRAL_TONE_MAPPING",[Ch]:"CUSTOM_TONE_MAPPING"};function y1(s,e,t,n,i){const r=new tn(e,t,{type:s,depthBuffer:n,stencilBuffer:i}),a=new tn(e,t,{type:Cn,depthBuffer:!1,stencilBuffer:!1}),o=new Ut;o.setAttribute("position",new Rt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Rt([0,2,0,0,2,0],2));const c=new Uf({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),l=new Ge(o,c),h=new Gs(-1,1,1,-1,0,1);let u=null,d=null,f=!1,g,_=null,m=[],p=!1;this.setSize=function(M,E){r.setSize(M,E),a.setSize(M,E);for(let v=0;v<m.length;v++){const b=m[v];b.setSize&&b.setSize(M,E)}},this.setEffects=function(M){m=M,p=m.length>0&&m[0].isRenderPass===!0;const E=r.width,v=r.height;for(let b=0;b<m.length;b++){const T=m[b];T.setSize&&T.setSize(E,v)}},this.begin=function(M,E){if(f||M.toneMapping===wn&&m.length===0)return!1;if(_=E,E!==null){const v=E.width,b=E.height;(r.width!==v||r.height!==b)&&this.setSize(v,b)}return p===!1&&M.setRenderTarget(r),g=M.toneMapping,M.toneMapping=wn,!0},this.hasRenderPass=function(){return p},this.end=function(M,E){M.toneMapping=g,f=!0;let v=r,b=a;for(let T=0;T<m.length;T++){const C=m[T];if(C.enabled!==!1&&(C.render(M,b,v,E),C.needsSwap!==!1)){const x=v;v=b,b=x}}if(u!==M.outputColorSpace||d!==M.toneMapping){u=M.outputColorSpace,d=M.toneMapping,c.defines={},Xe.getTransfer(u)===Ze&&(c.defines.SRGB_TRANSFER="");const T=v1[d];T&&(c.defines[T]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=v.texture,M.setRenderTarget(_),M.render(l,h),_=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),c.dispose()}}const ru=new St,ko=new Ji(1,1),au=new Hh,ou=new of,lu=new $h,Hc=[],Gc=[],Wc=new Float32Array(16),Xc=new Float32Array(9),Yc=new Float32Array(4);function us(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Hc[i];if(r===void 0&&(r=new Float32Array(i),Hc[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function bt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Et(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Wr(s,e){let t=Gc[e];t===void 0&&(t=new Int32Array(e),Gc[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function M1(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function S1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;s.uniform2fv(this.addr,e),Et(t,e)}}function b1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;s.uniform3fv(this.addr,e),Et(t,e)}}function E1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;s.uniform4fv(this.addr,e),Et(t,e)}}function T1(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Et(t,e)}else{if(bt(t,n))return;Yc.set(n),s.uniformMatrix2fv(this.addr,!1,Yc),Et(t,n)}}function A1(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Et(t,e)}else{if(bt(t,n))return;Xc.set(n),s.uniformMatrix3fv(this.addr,!1,Xc),Et(t,n)}}function w1(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(bt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Et(t,e)}else{if(bt(t,n))return;Wc.set(n),s.uniformMatrix4fv(this.addr,!1,Wc),Et(t,n)}}function C1(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function R1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;s.uniform2iv(this.addr,e),Et(t,e)}}function P1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;s.uniform3iv(this.addr,e),Et(t,e)}}function D1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;s.uniform4iv(this.addr,e),Et(t,e)}}function I1(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function N1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;s.uniform2uiv(this.addr,e),Et(t,e)}}function U1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;s.uniform3uiv(this.addr,e),Et(t,e)}}function F1(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;s.uniform4uiv(this.addr,e),Et(t,e)}}function O1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ko.compareFunction=t.isReversedDepthBuffer()?ll:ol,r=ko):r=ru,t.setTexture2D(e||r,i)}function B1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||ou,i)}function k1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||lu,i)}function z1(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||au,i)}function V1(s){switch(s){case 5126:return M1;case 35664:return S1;case 35665:return b1;case 35666:return E1;case 35674:return T1;case 35675:return A1;case 35676:return w1;case 5124:case 35670:return C1;case 35667:case 35671:return R1;case 35668:case 35672:return P1;case 35669:case 35673:return D1;case 5125:return I1;case 36294:return N1;case 36295:return U1;case 36296:return F1;case 35678:case 36198:case 36298:case 36306:case 35682:return O1;case 35679:case 36299:case 36307:return B1;case 35680:case 36300:case 36308:case 36293:return k1;case 36289:case 36303:case 36311:case 36292:return z1}}function H1(s,e){s.uniform1fv(this.addr,e)}function G1(s,e){const t=us(e,this.size,2);s.uniform2fv(this.addr,t)}function W1(s,e){const t=us(e,this.size,3);s.uniform3fv(this.addr,t)}function X1(s,e){const t=us(e,this.size,4);s.uniform4fv(this.addr,t)}function Y1(s,e){const t=us(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function q1(s,e){const t=us(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function j1(s,e){const t=us(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function K1(s,e){s.uniform1iv(this.addr,e)}function $1(s,e){s.uniform2iv(this.addr,e)}function Z1(s,e){s.uniform3iv(this.addr,e)}function J1(s,e){s.uniform4iv(this.addr,e)}function Q1(s,e){s.uniform1uiv(this.addr,e)}function eg(s,e){s.uniform2uiv(this.addr,e)}function tg(s,e){s.uniform3uiv(this.addr,e)}function ng(s,e){s.uniform4uiv(this.addr,e)}function ig(s,e,t){const n=this.cache,i=e.length,r=Wr(t,i);bt(n,r)||(s.uniform1iv(this.addr,r),Et(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=ko:a=ru;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function sg(s,e,t){const n=this.cache,i=e.length,r=Wr(t,i);bt(n,r)||(s.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||ou,r[a])}function rg(s,e,t){const n=this.cache,i=e.length,r=Wr(t,i);bt(n,r)||(s.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||lu,r[a])}function ag(s,e,t){const n=this.cache,i=e.length,r=Wr(t,i);bt(n,r)||(s.uniform1iv(this.addr,r),Et(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||au,r[a])}function og(s){switch(s){case 5126:return H1;case 35664:return G1;case 35665:return W1;case 35666:return X1;case 35674:return Y1;case 35675:return q1;case 35676:return j1;case 5124:case 35670:return K1;case 35667:case 35671:return $1;case 35668:case 35672:return Z1;case 35669:case 35673:return J1;case 5125:return Q1;case 36294:return eg;case 36295:return tg;case 36296:return ng;case 35678:case 36198:case 36298:case 36306:case 35682:return ig;case 35679:case 36299:case 36307:return sg;case 35680:case 36300:case 36308:case 36293:return rg;case 36289:case 36303:case 36311:case 36292:return ag}}class lg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=V1(t.type)}}class cg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=og(t.type)}}class hg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const Ua=/(\w+)(\])?(\[|\.)?/g;function qc(s,e){s.seq.push(e),s.map[e.id]=e}function ug(s,e,t){const n=s.name,i=n.length;for(Ua.lastIndex=0;;){const r=Ua.exec(n),a=Ua.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){qc(t,l===void 0?new lg(o,s,e):new cg(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new hg(o),qc(t,u)),t=u}}}class Cr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),c=e.getUniformLocation(t,o.name);ug(o,c,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function jc(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const dg=37297;let fg=0;function pg(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const Kc=new Ue;function mg(s){Xe._getMatrix(Kc,Xe.workingColorSpace,s);const e=`mat3( ${Kc.elements.map(t=>t.toFixed(4))} )`;switch(Xe.getTransfer(s)){case Ir:return[e,"LinearTransferOETF"];case Ze:return[e,"sRGBTransferOETF"];default:return Me("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function $c(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+pg(s.getShaderSource(e),o)}else return r}function gg(s,e){const t=mg(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Lg={[Th]:"Linear",[Ah]:"Reinhard",[wh]:"Cineon",[Jo]:"ACESFilmic",[Rh]:"AgX",[Ph]:"Neutral",[Ch]:"Custom"};function _g(s,e){const t=Lg[e];return t===void 0?(Me("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const vr=new P;function xg(){Xe.getLuminanceCoefficients(vr);const s=vr.x.toFixed(4),e=vr.y.toFixed(4),t=vr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function vg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(As).join(`
`)}function yg(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Mg(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function As(s){return s!==""}function Zc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Jc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Sg=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(s){return s.replace(Sg,Eg)}const bg=new Map;function Eg(s,e){let t=Be[e];if(t===void 0){const n=bg.get(e);if(n!==void 0)t=Be[n],Me('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return zo(t)}const Tg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qc(s){return s.replace(Tg,Ag)}function Ag(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function eh(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const wg={[Mr]:"SHADOWMAP_TYPE_PCF",[Es]:"SHADOWMAP_TYPE_VSM"};function Cg(s){return wg[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Rg={[_i]:"ENVMAP_TYPE_CUBE",[ji]:"ENVMAP_TYPE_CUBE",[Br]:"ENVMAP_TYPE_CUBE_UV"};function Pg(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Rg[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Dg={[ji]:"ENVMAP_MODE_REFRACTION"};function Ig(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Dg[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Ng={[Zo]:"ENVMAP_BLENDING_MULTIPLY",[yd]:"ENVMAP_BLENDING_MIX",[Md]:"ENVMAP_BLENDING_ADD"};function Ug(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Ng[s.combine]||"ENVMAP_BLENDING_NONE"}function Fg(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Og(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Cg(t),l=Pg(t),h=Ig(t),u=Ug(t),d=Fg(t),f=vg(t),g=yg(r),_=i.createProgram();let m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(As).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(As).join(`
`),p.length>0&&(p+=`
`)):(m=[eh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(As).join(`
`),p=[eh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==wn?"#define TONE_MAPPING":"",t.toneMapping!==wn?Be.tonemapping_pars_fragment:"",t.toneMapping!==wn?_g("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,gg("linearToOutputTexel",t.outputColorSpace),xg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(As).join(`
`)),a=zo(a),a=Zc(a,t),a=Jc(a,t),o=zo(o),o=Zc(o,t),o=Jc(o,t),a=Qc(a),o=Qc(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Kl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Kl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const E=M+m+a,v=M+p+o,b=jc(i,i.VERTEX_SHADER,E),T=jc(i,i.FRAGMENT_SHADER,v);i.attachShader(_,b),i.attachShader(_,T),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function C(w){if(s.debug.checkShaderErrors){const F=i.getProgramInfoLog(_)||"",B=i.getShaderInfoLog(b)||"",G=i.getShaderInfoLog(T)||"",H=F.trim(),O=B.trim(),k=G.trim();let Z=!0,$=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(Z=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,b,T);else{const oe=$c(i,b,"vertex"),de=$c(i,T,"fragment");Ce("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+H+`
`+oe+`
`+de)}else H!==""?Me("WebGLProgram: Program Info Log:",H):(O===""||k==="")&&($=!1);$&&(w.diagnostics={runnable:Z,programLog:H,vertexShader:{log:O,prefix:m},fragmentShader:{log:k,prefix:p}})}i.deleteShader(b),i.deleteShader(T),x=new Cr(i,_),S=Mg(i,_)}let x;this.getUniforms=function(){return x===void 0&&C(this),x};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(_,dg)),D},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=fg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=T,this}let Bg=0;class kg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new zg(e),t.set(e,n)),n}}class zg{constructor(e){this.id=Bg++,this.code=e,this.usedTimes=0}}function Vg(s,e,t,n,i,r){const a=new ul,o=new kg,c=new Set,l=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function _(x,S,D,w,F){const B=w.fog,G=F.geometry,H=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?w.environment:null,O=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,k=e.get(x.envMap||H,O),Z=k&&k.mapping===Br?k.image.height:null,$=f[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Me("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const oe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,de=oe!==void 0?oe.length:0;let he=0;G.morphAttributes.position!==void 0&&(he=1),G.morphAttributes.normal!==void 0&&(he=2),G.morphAttributes.color!==void 0&&(he=3);let Ie,ot,it,j;if($){const $e=Sn[$];Ie=$e.vertexShader,ot=$e.fragmentShader}else Ie=x.vertexShader,ot=x.fragmentShader,o.update(x),it=o.getVertexShaderID(x),j=o.getFragmentShaderID(x);const ee=s.getRenderTarget(),re=s.state.buffers.depth.getReversed(),Oe=F.isInstancedMesh===!0,we=F.isBatchedMesh===!0,Pe=!!x.map,Tt=!!x.matcap,Ye=!!k,Ke=!!x.aoMap,st=!!x.lightMap,ke=!!x.bumpMap,ft=!!x.normalMap,R=!!x.displacementMap,gt=!!x.emissiveMap,je=!!x.metalnessMap,lt=!!x.roughnessMap,ve=x.anisotropy>0,A=x.clearcoat>0,L=x.dispersion>0,N=x.iridescence>0,q=x.sheen>0,K=x.transmission>0,Y=ve&&!!x.anisotropyMap,me=A&&!!x.clearcoatMap,ie=A&&!!x.clearcoatNormalMap,Te=A&&!!x.clearcoatRoughnessMap,Re=N&&!!x.iridescenceMap,J=N&&!!x.iridescenceThicknessMap,te=q&&!!x.sheenColorMap,ge=q&&!!x.sheenRoughnessMap,_e=!!x.specularMap,ue=!!x.specularColorMap,ze=!!x.specularIntensityMap,I=K&&!!x.transmissionMap,se=K&&!!x.thicknessMap,ne=!!x.gradientMap,pe=!!x.alphaMap,Q=x.alphaTest>0,X=!!x.alphaHash,Le=!!x.extensions;let De=wn;x.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(De=s.toneMapping);const ct={shaderID:$,shaderType:x.type,shaderName:x.name,vertexShader:Ie,fragmentShader:ot,defines:x.defines,customVertexShaderID:it,customFragmentShaderID:j,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:we,batchingColor:we&&F._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&F.instanceColor!==null,instancingMorph:Oe&&F.morphTexture!==null,outputColorSpace:ee===null?s.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Vt,alphaToCoverage:!!x.alphaToCoverage,map:Pe,matcap:Tt,envMap:Ye,envMapMode:Ye&&k.mapping,envMapCubeUVHeight:Z,aoMap:Ke,lightMap:st,bumpMap:ke,normalMap:ft,displacementMap:R,emissiveMap:gt,normalMapObjectSpace:ft&&x.normalMapType===Ad,normalMapTangentSpace:ft&&x.normalMapType===al,metalnessMap:je,roughnessMap:lt,anisotropy:ve,anisotropyMap:Y,clearcoat:A,clearcoatMap:me,clearcoatNormalMap:ie,clearcoatRoughnessMap:Te,dispersion:L,iridescence:N,iridescenceMap:Re,iridescenceThicknessMap:J,sheen:q,sheenColorMap:te,sheenRoughnessMap:ge,specularMap:_e,specularColorMap:ue,specularIntensityMap:ze,transmission:K,transmissionMap:I,thicknessMap:se,gradientMap:ne,opaque:x.transparent===!1&&x.blending===Wi&&x.alphaToCoverage===!1,alphaMap:pe,alphaTest:Q,alphaHash:X,combine:x.combine,mapUv:Pe&&g(x.map.channel),aoMapUv:Ke&&g(x.aoMap.channel),lightMapUv:st&&g(x.lightMap.channel),bumpMapUv:ke&&g(x.bumpMap.channel),normalMapUv:ft&&g(x.normalMap.channel),displacementMapUv:R&&g(x.displacementMap.channel),emissiveMapUv:gt&&g(x.emissiveMap.channel),metalnessMapUv:je&&g(x.metalnessMap.channel),roughnessMapUv:lt&&g(x.roughnessMap.channel),anisotropyMapUv:Y&&g(x.anisotropyMap.channel),clearcoatMapUv:me&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:Re&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:J&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:te&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:ge&&g(x.sheenRoughnessMap.channel),specularMapUv:_e&&g(x.specularMap.channel),specularColorMapUv:ue&&g(x.specularColorMap.channel),specularIntensityMapUv:ze&&g(x.specularIntensityMap.channel),transmissionMapUv:I&&g(x.transmissionMap.channel),thicknessMapUv:se&&g(x.thicknessMap.channel),alphaMapUv:pe&&g(x.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ft||ve),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!G.attributes.uv&&(Pe||pe),fog:!!B,useFog:x.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||G.attributes.normal===void 0&&ft===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:re,skinning:F.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:he,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:De,decodeVideoTexture:Pe&&x.map.isVideoTexture===!0&&Xe.getTransfer(x.map.colorSpace)===Ze,decodeVideoTextureEmissive:gt&&x.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(x.emissiveMap.colorSpace)===Ze,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Gt,flipSided:x.side===kt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Le&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Le&&x.extensions.multiDraw===!0||we)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ct.vertexUv1s=c.has(1),ct.vertexUv2s=c.has(2),ct.vertexUv3s=c.has(3),c.clear(),ct}function m(x){const S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(const D in x.defines)S.push(D),S.push(x.defines[D]);return x.isRawShaderMaterial===!1&&(p(S,x),M(S,x),S.push(s.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function p(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function M(x,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),x.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),x.push(a.mask)}function E(x){const S=f[x.type];let D;if(S){const w=Sn[S];D=Df.clone(w.uniforms)}else D=x.uniforms;return D}function v(x,S){let D=h.get(S);return D!==void 0?++D.usedTimes:(D=new Og(s,S,x,i),l.push(D),h.set(S,D)),D}function b(x){if(--x.usedTimes===0){const S=l.indexOf(x);l[S]=l[l.length-1],l.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function C(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:E,acquireProgram:v,releaseProgram:b,releaseShaderCache:T,programs:l,dispose:C}}function Hg(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Gg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function th(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function nh(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,g,_,m,p){let M=s[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:g,materialVariant:a(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:p},s[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=g,M.materialVariant=a(d),M.groupOrder=_,M.renderOrder=d.renderOrder,M.z=m,M.group=p),e++,M}function c(d,f,g,_,m,p){const M=o(d,f,g,_,m,p);g.transmission>0?n.push(M):g.transparent===!0?i.push(M):t.push(M)}function l(d,f,g,_,m,p){const M=o(d,f,g,_,m,p);g.transmission>0?n.unshift(M):g.transparent===!0?i.unshift(M):t.unshift(M)}function h(d,f){t.length>1&&t.sort(d||Gg),n.length>1&&n.sort(f||th),i.length>1&&i.sort(f||th)}function u(){for(let d=e,f=s.length;d<f;d++){const g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:c,unshift:l,finish:u,sort:h}}function Wg(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new nh,s.set(n,[a])):i>=r.length?(a=new nh,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Xg(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Ae};break;case"SpotLight":t={position:new P,direction:new P,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":t={color:new Ae,position:new P,halfWidth:new P,halfHeight:new P};break}return s[e.id]=t,t}}}function Yg(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ee,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let qg=0;function jg(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Kg(s){const e=new Xg,t=Yg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);const i=new P,r=new Fe,a=new Fe;function o(l){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,M=0,E=0,v=0,b=0,T=0,C=0;l.sort(jg);for(let S=0,D=l.length;S<D;S++){const w=l[S],F=w.color,B=w.intensity,G=w.distance;let H=null;if(w.shadow&&w.shadow.map&&(w.shadow.map.texture.format===$i?H=w.shadow.map.texture:H=w.shadow.map.depthTexture||w.shadow.map.texture),w.isAmbientLight)h+=F.r*B,u+=F.g*B,d+=F.b*B;else if(w.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(w.sh.coefficients[O],B);C++}else if(w.isDirectionalLight){const O=e.get(w);if(O.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const k=w.shadow,Z=t.get(w);Z.shadowIntensity=k.intensity,Z.shadowBias=k.bias,Z.shadowNormalBias=k.normalBias,Z.shadowRadius=k.radius,Z.shadowMapSize=k.mapSize,n.directionalShadow[f]=Z,n.directionalShadowMap[f]=H,n.directionalShadowMatrix[f]=w.shadow.matrix,M++}n.directional[f]=O,f++}else if(w.isSpotLight){const O=e.get(w);O.position.setFromMatrixPosition(w.matrixWorld),O.color.copy(F).multiplyScalar(B),O.distance=G,O.coneCos=Math.cos(w.angle),O.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),O.decay=w.decay,n.spot[_]=O;const k=w.shadow;if(w.map&&(n.spotLightMap[b]=w.map,b++,k.updateMatrices(w),w.castShadow&&T++),n.spotLightMatrix[_]=k.matrix,w.castShadow){const Z=t.get(w);Z.shadowIntensity=k.intensity,Z.shadowBias=k.bias,Z.shadowNormalBias=k.normalBias,Z.shadowRadius=k.radius,Z.shadowMapSize=k.mapSize,n.spotShadow[_]=Z,n.spotShadowMap[_]=H,v++}_++}else if(w.isRectAreaLight){const O=e.get(w);O.color.copy(F).multiplyScalar(B),O.halfWidth.set(w.width*.5,0,0),O.halfHeight.set(0,w.height*.5,0),n.rectArea[m]=O,m++}else if(w.isPointLight){const O=e.get(w);if(O.color.copy(w.color).multiplyScalar(w.intensity),O.distance=w.distance,O.decay=w.decay,w.castShadow){const k=w.shadow,Z=t.get(w);Z.shadowIntensity=k.intensity,Z.shadowBias=k.bias,Z.shadowNormalBias=k.normalBias,Z.shadowRadius=k.radius,Z.shadowMapSize=k.mapSize,Z.shadowCameraNear=k.camera.near,Z.shadowCameraFar=k.camera.far,n.pointShadow[g]=Z,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=w.shadow.matrix,E++}n.point[g]=O,g++}else if(w.isHemisphereLight){const O=e.get(w);O.skyColor.copy(w.color).multiplyScalar(B),O.groundColor.copy(w.groundColor).multiplyScalar(B),n.hemi[p]=O,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ae.LTC_FLOAT_1,n.rectAreaLTC2=ae.LTC_FLOAT_2):(n.rectAreaLTC1=ae.LTC_HALF_1,n.rectAreaLTC2=ae.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==f||x.pointLength!==g||x.spotLength!==_||x.rectAreaLength!==m||x.hemiLength!==p||x.numDirectionalShadows!==M||x.numPointShadows!==E||x.numSpotShadows!==v||x.numSpotMaps!==b||x.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=E,n.pointShadowMap.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=E,n.spotLightMatrix.length=v+b-T,n.spotLightMap.length=b,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=C,x.directionalLength=f,x.pointLength=g,x.spotLength=_,x.rectAreaLength=m,x.hemiLength=p,x.numDirectionalShadows=M,x.numPointShadows=E,x.numSpotShadows=v,x.numSpotMaps=b,x.numLightProbes=C,n.version=qg++)}function c(l,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){const E=l[p];if(E.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(E.isSpotLight){const v=n.spot[f];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(E.matrixWorld),i.setFromMatrixPosition(E.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),f++}else if(E.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(E.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(E.width*.5,0,0),v.halfHeight.set(0,E.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(E.isPointLight){const v=n.point[d];v.position.setFromMatrixPosition(E.matrixWorld),v.position.applyMatrix4(m),d++}else if(E.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(E.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:c,state:n}}function ih(s){const e=new Kg(s),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function $g(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new ih(s),e.set(i,[o])):r>=a.length?(o=new ih(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Qg=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],e2=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],sh=new Fe,ys=new P,Fa=new P;function t2(s,e,t){let n=new kr;const i=new Ee,r=new Ee,a=new at,o=new Of,c=new Bf,l={},h=t.maxTextureSize,u={[fn]:kt,[kt]:fn,[Gt]:Gt},d=new Ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ee},radius:{value:4}},vertexShader:Zg,fragmentShader:Jg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ut;g.setAttribute("position",new zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ge(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mr;let p=this.type;this.render=function(T,C,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===nd&&(Me("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Mr);const S=s.getRenderTarget(),D=s.getActiveCubeFace(),w=s.getActiveMipmapLevel(),F=s.state;F.setBlending(An),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const B=p!==this.type;B&&C.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(H=>H.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,H=T.length;G<H;G++){const O=T[G],k=O.shadow;if(k===void 0){Me("WebGLShadowMap:",O,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);const Z=k.getFrameExtents();i.multiply(Z),r.copy(k.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Z.x),i.x=r.x*Z.x,k.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Z.y),i.y=r.y*Z.y,k.mapSize.y=r.y));const $=s.state.buffers.depth.getReversed();if(k.camera._reversedDepth=$,k.map===null||B===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Es){if(O.isPointLight){Me("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new tn(i.x,i.y,{format:$i,type:Cn,minFilter:yt,magFilter:yt,generateMipmaps:!1}),k.map.texture.name=O.name+".shadowMap",k.map.depthTexture=new Ji(i.x,i.y,Jt),k.map.depthTexture.name=O.name+".shadowMapDepth",k.map.depthTexture.format=Gn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=vt,k.map.depthTexture.magFilter=vt}else O.isPointLight?(k.map=new su(i.x),k.map.depthTexture=new Rf(i.x,pn)):(k.map=new tn(i.x,i.y),k.map.depthTexture=new Ji(i.x,i.y,pn)),k.map.depthTexture.name=O.name+".shadowMap",k.map.depthTexture.format=Gn,this.type===Mr?(k.map.depthTexture.compareFunction=$?ll:ol,k.map.depthTexture.minFilter=yt,k.map.depthTexture.magFilter=yt):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=vt,k.map.depthTexture.magFilter=vt);k.camera.updateProjectionMatrix()}const oe=k.map.isWebGLCubeRenderTarget?6:1;for(let de=0;de<oe;de++){if(k.map.isWebGLCubeRenderTarget)s.setRenderTarget(k.map,de),s.clear();else{de===0&&(s.setRenderTarget(k.map),s.clear());const he=k.getViewport(de);a.set(r.x*he.x,r.y*he.y,r.x*he.z,r.y*he.w),F.viewport(a)}if(O.isPointLight){const he=k.camera,Ie=k.matrix,ot=O.distance||he.far;ot!==he.far&&(he.far=ot,he.updateProjectionMatrix()),ys.setFromMatrixPosition(O.matrixWorld),he.position.copy(ys),Fa.copy(he.position),Fa.add(Qg[de]),he.up.copy(e2[de]),he.lookAt(Fa),he.updateMatrixWorld(),Ie.makeTranslation(-ys.x,-ys.y,-ys.z),sh.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),k._frustum.setFromProjectionMatrix(sh,he.coordinateSystem,he.reversedDepth)}else k.updateMatrices(O);n=k.getFrustum(),v(C,x,k.camera,O,this.type)}k.isPointLightShadow!==!0&&this.type===Es&&M(k,x),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(S,D,w)};function M(T,C){const x=e.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new tn(i.x,i.y,{format:$i,type:Cn})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(C,null,x,d,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(C,null,x,f,_,null)}function E(T,C,x,S){let D=null;const w=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(w!==void 0)D=w;else if(D=x.isPointLight===!0?c:o,s.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=D.uuid,B=C.uuid;let G=l[F];G===void 0&&(G={},l[F]=G);let H=G[B];H===void 0&&(H=D.clone(),G[B]=H,C.addEventListener("dispose",b)),D=H}if(D.visible=C.visible,D.wireframe=C.wireframe,S===Es?D.side=C.shadowSide!==null?C.shadowSide:C.side:D.side=C.shadowSide!==null?C.shadowSide:u[C.side],D.alphaMap=C.alphaMap,D.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,D.map=C.map,D.clipShadows=C.clipShadows,D.clippingPlanes=C.clippingPlanes,D.clipIntersection=C.clipIntersection,D.displacementMap=C.displacementMap,D.displacementScale=C.displacementScale,D.displacementBias=C.displacementBias,D.wireframeLinewidth=C.wireframeLinewidth,D.linewidth=C.linewidth,x.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const F=s.properties.get(D);F.light=x}return D}function v(T,C,x,S,D){if(T.visible===!1)return;if(T.layers.test(C.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===Es)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const B=e.update(T),G=T.material;if(Array.isArray(G)){const H=B.groups;for(let O=0,k=H.length;O<k;O++){const Z=H[O],$=G[Z.materialIndex];if($&&$.visible){const oe=E(T,$,S,D);T.onBeforeShadow(s,T,C,x,B,oe,Z),s.renderBufferDirect(x,null,B,oe,T,Z),T.onAfterShadow(s,T,C,x,B,oe,Z)}}}else if(G.visible){const H=E(T,G,S,D);T.onBeforeShadow(s,T,C,x,B,H,null),s.renderBufferDirect(x,null,B,H,T,null),T.onAfterShadow(s,T,C,x,B,H,null)}}const F=T.children;for(let B=0,G=F.length;B<G;B++)v(F[B],C,x,S,D)}function b(T){T.target.removeEventListener("dispose",b);for(const x in l){const S=l[x],D=T.target.uuid;D in S&&(S[D].dispose(),delete S[D])}}}function n2(s,e){function t(){let I=!1;const se=new at;let ne=null;const pe=new at(0,0,0,0);return{setMask:function(Q){ne!==Q&&!I&&(s.colorMask(Q,Q,Q,Q),ne=Q)},setLocked:function(Q){I=Q},setClear:function(Q,X,Le,De,ct){ct===!0&&(Q*=De,X*=De,Le*=De),se.set(Q,X,Le,De),pe.equals(se)===!1&&(s.clearColor(Q,X,Le,De),pe.copy(se))},reset:function(){I=!1,ne=null,pe.set(-1,0,0,0)}}}function n(){let I=!1,se=!1,ne=null,pe=null,Q=null;return{setReversed:function(X){if(se!==X){const Le=e.get("EXT_clip_control");X?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),se=X;const De=Q;Q=null,this.setClear(De)}},getReversed:function(){return se},setTest:function(X){X?ee(s.DEPTH_TEST):re(s.DEPTH_TEST)},setMask:function(X){ne!==X&&!I&&(s.depthMask(X),ne=X)},setFunc:function(X){if(se&&(X=Bd[X]),pe!==X){switch(X){case qa:s.depthFunc(s.NEVER);break;case ja:s.depthFunc(s.ALWAYS);break;case Ka:s.depthFunc(s.LESS);break;case qi:s.depthFunc(s.LEQUAL);break;case $a:s.depthFunc(s.EQUAL);break;case Za:s.depthFunc(s.GEQUAL);break;case Ja:s.depthFunc(s.GREATER);break;case Qa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pe=X}},setLocked:function(X){I=X},setClear:function(X){Q!==X&&(Q=X,se&&(X=1-X),s.clearDepth(X))},reset:function(){I=!1,ne=null,pe=null,Q=null,se=!1}}}function i(){let I=!1,se=null,ne=null,pe=null,Q=null,X=null,Le=null,De=null,ct=null;return{setTest:function($e){I||($e?ee(s.STENCIL_TEST):re(s.STENCIL_TEST))},setMask:function($e){se!==$e&&!I&&(s.stencilMask($e),se=$e)},setFunc:function($e,Pn,Dn){(ne!==$e||pe!==Pn||Q!==Dn)&&(s.stencilFunc($e,Pn,Dn),ne=$e,pe=Pn,Q=Dn)},setOp:function($e,Pn,Dn){(X!==$e||Le!==Pn||De!==Dn)&&(s.stencilOp($e,Pn,Dn),X=$e,Le=Pn,De=Dn)},setLocked:function($e){I=$e},setClear:function($e){ct!==$e&&(s.clearStencil($e),ct=$e)},reset:function(){I=!1,se=null,ne=null,pe=null,Q=null,X=null,Le=null,De=null,ct=null}}}const r=new t,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,M=null,E=null,v=null,b=null,T=null,C=new Ae(0,0,0),x=0,S=!1,D=null,w=null,F=null,B=null,G=null;const H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,k=0;const Z=s.getParameter(s.VERSION);Z.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(Z)[1]),O=k>=1):Z.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),O=k>=2);let $=null,oe={};const de=s.getParameter(s.SCISSOR_BOX),he=s.getParameter(s.VIEWPORT),Ie=new at().fromArray(de),ot=new at().fromArray(he);function it(I,se,ne,pe){const Q=new Uint8Array(4),X=s.createTexture();s.bindTexture(I,X),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Le=0;Le<ne;Le++)I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY?s.texImage3D(se,0,s.RGBA,1,1,pe,0,s.RGBA,s.UNSIGNED_BYTE,Q):s.texImage2D(se+Le,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Q);return X}const j={};j[s.TEXTURE_2D]=it(s.TEXTURE_2D,s.TEXTURE_2D,1),j[s.TEXTURE_CUBE_MAP]=it(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[s.TEXTURE_2D_ARRAY]=it(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),j[s.TEXTURE_3D]=it(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ee(s.DEPTH_TEST),a.setFunc(qi),ke(!1),ft(kl),ee(s.CULL_FACE),Ke(An);function ee(I){h[I]!==!0&&(s.enable(I),h[I]=!0)}function re(I){h[I]!==!1&&(s.disable(I),h[I]=!1)}function Oe(I,se){return u[I]!==se?(s.bindFramebuffer(I,se),u[I]=se,I===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=se),I===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=se),!0):!1}function we(I,se){let ne=f,pe=!1;if(I){ne=d.get(se),ne===void 0&&(ne=[],d.set(se,ne));const Q=I.textures;if(ne.length!==Q.length||ne[0]!==s.COLOR_ATTACHMENT0){for(let X=0,Le=Q.length;X<Le;X++)ne[X]=s.COLOR_ATTACHMENT0+X;ne.length=Q.length,pe=!0}}else ne[0]!==s.BACK&&(ne[0]=s.BACK,pe=!0);pe&&s.drawBuffers(ne)}function Pe(I){return g!==I?(s.useProgram(I),g=I,!0):!1}const Tt={[pi]:s.FUNC_ADD,[sd]:s.FUNC_SUBTRACT,[rd]:s.FUNC_REVERSE_SUBTRACT};Tt[ad]=s.MIN,Tt[od]=s.MAX;const Ye={[ld]:s.ZERO,[cd]:s.ONE,[hd]:s.SRC_COLOR,[Xa]:s.SRC_ALPHA,[gd]:s.SRC_ALPHA_SATURATE,[pd]:s.DST_COLOR,[dd]:s.DST_ALPHA,[ud]:s.ONE_MINUS_SRC_COLOR,[Ya]:s.ONE_MINUS_SRC_ALPHA,[md]:s.ONE_MINUS_DST_COLOR,[fd]:s.ONE_MINUS_DST_ALPHA,[Ld]:s.CONSTANT_COLOR,[_d]:s.ONE_MINUS_CONSTANT_COLOR,[xd]:s.CONSTANT_ALPHA,[vd]:s.ONE_MINUS_CONSTANT_ALPHA};function Ke(I,se,ne,pe,Q,X,Le,De,ct,$e){if(I===An){_===!0&&(re(s.BLEND),_=!1);return}if(_===!1&&(ee(s.BLEND),_=!0),I!==id){if(I!==m||$e!==S){if((p!==pi||v!==pi)&&(s.blendEquation(s.FUNC_ADD),p=pi,v=pi),$e)switch(I){case Wi:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zl:s.blendFunc(s.ONE,s.ONE);break;case Vl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Hl:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ce("WebGLState: Invalid blending: ",I);break}else switch(I){case Wi:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case zl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Vl:Ce("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Hl:Ce("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ce("WebGLState: Invalid blending: ",I);break}M=null,E=null,b=null,T=null,C.set(0,0,0),x=0,m=I,S=$e}return}Q=Q||se,X=X||ne,Le=Le||pe,(se!==p||Q!==v)&&(s.blendEquationSeparate(Tt[se],Tt[Q]),p=se,v=Q),(ne!==M||pe!==E||X!==b||Le!==T)&&(s.blendFuncSeparate(Ye[ne],Ye[pe],Ye[X],Ye[Le]),M=ne,E=pe,b=X,T=Le),(De.equals(C)===!1||ct!==x)&&(s.blendColor(De.r,De.g,De.b,ct),C.copy(De),x=ct),m=I,S=!1}function st(I,se){I.side===Gt?re(s.CULL_FACE):ee(s.CULL_FACE);let ne=I.side===kt;se&&(ne=!ne),ke(ne),I.blending===Wi&&I.transparent===!1?Ke(An):Ke(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const pe=I.stencilWrite;o.setTest(pe),pe&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),gt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ee(s.SAMPLE_ALPHA_TO_COVERAGE):re(s.SAMPLE_ALPHA_TO_COVERAGE)}function ke(I){D!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),D=I)}function ft(I){I!==ed?(ee(s.CULL_FACE),I!==w&&(I===kl?s.cullFace(s.BACK):I===td?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):re(s.CULL_FACE),w=I}function R(I){I!==F&&(O&&s.lineWidth(I),F=I)}function gt(I,se,ne){I?(ee(s.POLYGON_OFFSET_FILL),(B!==se||G!==ne)&&(B=se,G=ne,a.getReversed()&&(se=-se),s.polygonOffset(se,ne))):re(s.POLYGON_OFFSET_FILL)}function je(I){I?ee(s.SCISSOR_TEST):re(s.SCISSOR_TEST)}function lt(I){I===void 0&&(I=s.TEXTURE0+H-1),$!==I&&(s.activeTexture(I),$=I)}function ve(I,se,ne){ne===void 0&&($===null?ne=s.TEXTURE0+H-1:ne=$);let pe=oe[ne];pe===void 0&&(pe={type:void 0,texture:void 0},oe[ne]=pe),(pe.type!==I||pe.texture!==se)&&($!==ne&&(s.activeTexture(ne),$=ne),s.bindTexture(I,se||j[I]),pe.type=I,pe.texture=se)}function A(){const I=oe[$];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function L(){try{s.compressedTexImage2D(...arguments)}catch(I){Ce("WebGLState:",I)}}function N(){try{s.compressedTexImage3D(...arguments)}catch(I){Ce("WebGLState:",I)}}function q(){try{s.texSubImage2D(...arguments)}catch(I){Ce("WebGLState:",I)}}function K(){try{s.texSubImage3D(...arguments)}catch(I){Ce("WebGLState:",I)}}function Y(){try{s.compressedTexSubImage2D(...arguments)}catch(I){Ce("WebGLState:",I)}}function me(){try{s.compressedTexSubImage3D(...arguments)}catch(I){Ce("WebGLState:",I)}}function ie(){try{s.texStorage2D(...arguments)}catch(I){Ce("WebGLState:",I)}}function Te(){try{s.texStorage3D(...arguments)}catch(I){Ce("WebGLState:",I)}}function Re(){try{s.texImage2D(...arguments)}catch(I){Ce("WebGLState:",I)}}function J(){try{s.texImage3D(...arguments)}catch(I){Ce("WebGLState:",I)}}function te(I){Ie.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),Ie.copy(I))}function ge(I){ot.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),ot.copy(I))}function _e(I,se){let ne=l.get(se);ne===void 0&&(ne=new WeakMap,l.set(se,ne));let pe=ne.get(I);pe===void 0&&(pe=s.getUniformBlockIndex(se,I.name),ne.set(I,pe))}function ue(I,se){const pe=l.get(se).get(I);c.get(se)!==pe&&(s.uniformBlockBinding(se,pe,I.__bindingPointIndex),c.set(se,pe))}function ze(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},$=null,oe={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,M=null,E=null,v=null,b=null,T=null,C=new Ae(0,0,0),x=0,S=!1,D=null,w=null,F=null,B=null,G=null,Ie.set(0,0,s.canvas.width,s.canvas.height),ot.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ee,disable:re,bindFramebuffer:Oe,drawBuffers:we,useProgram:Pe,setBlending:Ke,setMaterial:st,setFlipSided:ke,setCullFace:ft,setLineWidth:R,setPolygonOffset:gt,setScissorTest:je,activeTexture:lt,bindTexture:ve,unbindTexture:A,compressedTexImage2D:L,compressedTexImage3D:N,texImage2D:Re,texImage3D:J,updateUBOMapping:_e,uniformBlockBinding:ue,texStorage2D:ie,texStorage3D:Te,texSubImage2D:q,texSubImage3D:K,compressedTexSubImage2D:Y,compressedTexSubImage3D:me,scissor:te,viewport:ge,reset:ze}}function i2(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ee,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,L){return f?new OffscreenCanvas(A,L):Hs("canvas")}function _(A,L,N){let q=1;const K=ve(A);if((K.width>N||K.height>N)&&(q=N/Math.max(K.width,K.height)),q<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const Y=Math.floor(q*K.width),me=Math.floor(q*K.height);u===void 0&&(u=g(Y,me));const ie=L?g(Y,me):u;return ie.width=Y,ie.height=me,ie.getContext("2d").drawImage(A,0,0,Y,me),Me("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+Y+"x"+me+")."),ie}else return"data"in A&&Me("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){s.generateMipmap(A)}function M(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function E(A,L,N,q,K=!1){if(A!==null){if(s[A]!==void 0)return s[A];Me("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Y=L;if(L===s.RED&&(N===s.FLOAT&&(Y=s.R32F),N===s.HALF_FLOAT&&(Y=s.R16F),N===s.UNSIGNED_BYTE&&(Y=s.R8)),L===s.RED_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.R8UI),N===s.UNSIGNED_SHORT&&(Y=s.R16UI),N===s.UNSIGNED_INT&&(Y=s.R32UI),N===s.BYTE&&(Y=s.R8I),N===s.SHORT&&(Y=s.R16I),N===s.INT&&(Y=s.R32I)),L===s.RG&&(N===s.FLOAT&&(Y=s.RG32F),N===s.HALF_FLOAT&&(Y=s.RG16F),N===s.UNSIGNED_BYTE&&(Y=s.RG8)),L===s.RG_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.RG8UI),N===s.UNSIGNED_SHORT&&(Y=s.RG16UI),N===s.UNSIGNED_INT&&(Y=s.RG32UI),N===s.BYTE&&(Y=s.RG8I),N===s.SHORT&&(Y=s.RG16I),N===s.INT&&(Y=s.RG32I)),L===s.RGB_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.RGB8UI),N===s.UNSIGNED_SHORT&&(Y=s.RGB16UI),N===s.UNSIGNED_INT&&(Y=s.RGB32UI),N===s.BYTE&&(Y=s.RGB8I),N===s.SHORT&&(Y=s.RGB16I),N===s.INT&&(Y=s.RGB32I)),L===s.RGBA_INTEGER&&(N===s.UNSIGNED_BYTE&&(Y=s.RGBA8UI),N===s.UNSIGNED_SHORT&&(Y=s.RGBA16UI),N===s.UNSIGNED_INT&&(Y=s.RGBA32UI),N===s.BYTE&&(Y=s.RGBA8I),N===s.SHORT&&(Y=s.RGBA16I),N===s.INT&&(Y=s.RGBA32I)),L===s.RGB&&(N===s.UNSIGNED_INT_5_9_9_9_REV&&(Y=s.RGB9_E5),N===s.UNSIGNED_INT_10F_11F_11F_REV&&(Y=s.R11F_G11F_B10F)),L===s.RGBA){const me=K?Ir:Xe.getTransfer(q);N===s.FLOAT&&(Y=s.RGBA32F),N===s.HALF_FLOAT&&(Y=s.RGBA16F),N===s.UNSIGNED_BYTE&&(Y=me===Ze?s.SRGB8_ALPHA8:s.RGBA8),N===s.UNSIGNED_SHORT_4_4_4_4&&(Y=s.RGBA4),N===s.UNSIGNED_SHORT_5_5_5_1&&(Y=s.RGB5_A1)}return(Y===s.R16F||Y===s.R32F||Y===s.RG16F||Y===s.RG32F||Y===s.RGBA16F||Y===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function v(A,L){let N;return A?L===null||L===pn||L===Bs?N=s.DEPTH24_STENCIL8:L===Jt?N=s.DEPTH32F_STENCIL8:L===Os&&(N=s.DEPTH24_STENCIL8,Me("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):L===null||L===pn||L===Bs?N=s.DEPTH_COMPONENT24:L===Jt?N=s.DEPTH_COMPONENT32F:L===Os&&(N=s.DEPTH_COMPONENT16),N}function b(A,L){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==vt&&A.minFilter!==yt?Math.log2(Math.max(L.width,L.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?L.mipmaps.length:1}function T(A){const L=A.target;L.removeEventListener("dispose",T),x(L),L.isVideoTexture&&h.delete(L)}function C(A){const L=A.target;L.removeEventListener("dispose",C),D(L)}function x(A){const L=n.get(A);if(L.__webglInit===void 0)return;const N=A.source,q=d.get(N);if(q){const K=q[L.__cacheKey];K.usedTimes--,K.usedTimes===0&&S(A),Object.keys(q).length===0&&d.delete(N)}n.remove(A)}function S(A){const L=n.get(A);s.deleteTexture(L.__webglTexture);const N=A.source,q=d.get(N);delete q[L.__cacheKey],a.memory.textures--}function D(A){const L=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(L.__webglFramebuffer[q]))for(let K=0;K<L.__webglFramebuffer[q].length;K++)s.deleteFramebuffer(L.__webglFramebuffer[q][K]);else s.deleteFramebuffer(L.__webglFramebuffer[q]);L.__webglDepthbuffer&&s.deleteRenderbuffer(L.__webglDepthbuffer[q])}else{if(Array.isArray(L.__webglFramebuffer))for(let q=0;q<L.__webglFramebuffer.length;q++)s.deleteFramebuffer(L.__webglFramebuffer[q]);else s.deleteFramebuffer(L.__webglFramebuffer);if(L.__webglDepthbuffer&&s.deleteRenderbuffer(L.__webglDepthbuffer),L.__webglMultisampledFramebuffer&&s.deleteFramebuffer(L.__webglMultisampledFramebuffer),L.__webglColorRenderbuffer)for(let q=0;q<L.__webglColorRenderbuffer.length;q++)L.__webglColorRenderbuffer[q]&&s.deleteRenderbuffer(L.__webglColorRenderbuffer[q]);L.__webglDepthRenderbuffer&&s.deleteRenderbuffer(L.__webglDepthRenderbuffer)}const N=A.textures;for(let q=0,K=N.length;q<K;q++){const Y=n.get(N[q]);Y.__webglTexture&&(s.deleteTexture(Y.__webglTexture),a.memory.textures--),n.remove(N[q])}n.remove(A)}let w=0;function F(){w=0}function B(){const A=w;return A>=i.maxTextures&&Me("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),w+=1,A}function G(A){const L=[];return L.push(A.wrapS),L.push(A.wrapT),L.push(A.wrapR||0),L.push(A.magFilter),L.push(A.minFilter),L.push(A.anisotropy),L.push(A.internalFormat),L.push(A.format),L.push(A.type),L.push(A.generateMipmaps),L.push(A.premultiplyAlpha),L.push(A.flipY),L.push(A.unpackAlignment),L.push(A.colorSpace),L.join()}function H(A,L){const N=n.get(A);if(A.isVideoTexture&&je(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&N.__version!==A.version){const q=A.image;if(q===null)Me("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Me("WebGLRenderer: Texture marked for update but image is incomplete");else{j(N,A,L);return}}else A.isExternalTexture&&(N.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,N.__webglTexture,s.TEXTURE0+L)}function O(A,L){const N=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&N.__version!==A.version){j(N,A,L);return}else A.isExternalTexture&&(N.__webglTexture=A.sourceTexture?A.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,N.__webglTexture,s.TEXTURE0+L)}function k(A,L){const N=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&N.__version!==A.version){j(N,A,L);return}t.bindTexture(s.TEXTURE_3D,N.__webglTexture,s.TEXTURE0+L)}function Z(A,L){const N=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&N.__version!==A.version){ee(N,A,L);return}t.bindTexture(s.TEXTURE_CUBE_MAP,N.__webglTexture,s.TEXTURE0+L)}const $={[Ki]:s.REPEAT,[bn]:s.CLAMP_TO_EDGE,[Dr]:s.MIRRORED_REPEAT},oe={[vt]:s.NEAREST,[Ih]:s.NEAREST_MIPMAP_NEAREST,[Ts]:s.NEAREST_MIPMAP_LINEAR,[yt]:s.LINEAR,[Sr]:s.LINEAR_MIPMAP_NEAREST,[zn]:s.LINEAR_MIPMAP_LINEAR},de={[wd]:s.NEVER,[Id]:s.ALWAYS,[Cd]:s.LESS,[ol]:s.LEQUAL,[Rd]:s.EQUAL,[ll]:s.GEQUAL,[Pd]:s.GREATER,[Dd]:s.NOTEQUAL};function he(A,L){if(L.type===Jt&&e.has("OES_texture_float_linear")===!1&&(L.magFilter===yt||L.magFilter===Sr||L.magFilter===Ts||L.magFilter===zn||L.minFilter===yt||L.minFilter===Sr||L.minFilter===Ts||L.minFilter===zn)&&Me("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,$[L.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,$[L.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,$[L.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,oe[L.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,oe[L.minFilter]),L.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,de[L.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(L.magFilter===vt||L.minFilter!==Ts&&L.minFilter!==zn||L.type===Jt&&e.has("OES_texture_float_linear")===!1)return;if(L.anisotropy>1||n.get(L).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");s.texParameterf(A,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,i.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy}}}function Ie(A,L){let N=!1;A.__webglInit===void 0&&(A.__webglInit=!0,L.addEventListener("dispose",T));const q=L.source;let K=d.get(q);K===void 0&&(K={},d.set(q,K));const Y=G(L);if(Y!==A.__cacheKey){K[Y]===void 0&&(K[Y]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,N=!0),K[Y].usedTimes++;const me=K[A.__cacheKey];me!==void 0&&(K[A.__cacheKey].usedTimes--,me.usedTimes===0&&S(L)),A.__cacheKey=Y,A.__webglTexture=K[Y].texture}return N}function ot(A,L,N){return Math.floor(Math.floor(A/N)/L)}function it(A,L,N,q){const Y=A.updateRanges;if(Y.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,L.width,L.height,N,q,L.data);else{Y.sort((J,te)=>J.start-te.start);let me=0;for(let J=1;J<Y.length;J++){const te=Y[me],ge=Y[J],_e=te.start+te.count,ue=ot(ge.start,L.width,4),ze=ot(te.start,L.width,4);ge.start<=_e+1&&ue===ze&&ot(ge.start+ge.count-1,L.width,4)===ue?te.count=Math.max(te.count,ge.start+ge.count-te.start):(++me,Y[me]=ge)}Y.length=me+1;const ie=s.getParameter(s.UNPACK_ROW_LENGTH),Te=s.getParameter(s.UNPACK_SKIP_PIXELS),Re=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,L.width);for(let J=0,te=Y.length;J<te;J++){const ge=Y[J],_e=Math.floor(ge.start/4),ue=Math.ceil(ge.count/4),ze=_e%L.width,I=Math.floor(_e/L.width),se=ue,ne=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,ze),s.pixelStorei(s.UNPACK_SKIP_ROWS,I),t.texSubImage2D(s.TEXTURE_2D,0,ze,I,se,ne,N,q,L.data)}A.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ie),s.pixelStorei(s.UNPACK_SKIP_PIXELS,Te),s.pixelStorei(s.UNPACK_SKIP_ROWS,Re)}}function j(A,L,N){let q=s.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(q=s.TEXTURE_2D_ARRAY),L.isData3DTexture&&(q=s.TEXTURE_3D);const K=Ie(A,L),Y=L.source;t.bindTexture(q,A.__webglTexture,s.TEXTURE0+N);const me=n.get(Y);if(Y.version!==me.__version||K===!0){t.activeTexture(s.TEXTURE0+N);const ie=Xe.getPrimaries(Xe.workingColorSpace),Te=L.colorSpace===ni?null:Xe.getPrimaries(L.colorSpace),Re=L.colorSpace===ni||ie===Te?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,L.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,L.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let J=_(L.image,!1,i.maxTextureSize);J=lt(L,J);const te=r.convert(L.format,L.colorSpace),ge=r.convert(L.type);let _e=E(L.internalFormat,te,ge,L.colorSpace,L.isVideoTexture);he(q,L);let ue;const ze=L.mipmaps,I=L.isVideoTexture!==!0,se=me.__version===void 0||K===!0,ne=Y.dataReady,pe=b(L,J);if(L.isDepthTexture)_e=v(L.format===gi,L.type),se&&(I?t.texStorage2D(s.TEXTURE_2D,1,_e,J.width,J.height):t.texImage2D(s.TEXTURE_2D,0,_e,J.width,J.height,0,te,ge,null));else if(L.isDataTexture)if(ze.length>0){I&&se&&t.texStorage2D(s.TEXTURE_2D,pe,_e,ze[0].width,ze[0].height);for(let Q=0,X=ze.length;Q<X;Q++)ue=ze[Q],I?ne&&t.texSubImage2D(s.TEXTURE_2D,Q,0,0,ue.width,ue.height,te,ge,ue.data):t.texImage2D(s.TEXTURE_2D,Q,_e,ue.width,ue.height,0,te,ge,ue.data);L.generateMipmaps=!1}else I?(se&&t.texStorage2D(s.TEXTURE_2D,pe,_e,J.width,J.height),ne&&it(L,J,te,ge)):t.texImage2D(s.TEXTURE_2D,0,_e,J.width,J.height,0,te,ge,J.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){I&&se&&t.texStorage3D(s.TEXTURE_2D_ARRAY,pe,_e,ze[0].width,ze[0].height,J.depth);for(let Q=0,X=ze.length;Q<X;Q++)if(ue=ze[Q],L.format!==Qt)if(te!==null)if(I){if(ne)if(L.layerUpdates.size>0){const Le=Fc(ue.width,ue.height,L.format,L.type);for(const De of L.layerUpdates){const ct=ue.data.subarray(De*Le/ue.data.BYTES_PER_ELEMENT,(De+1)*Le/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,De,ue.width,ue.height,1,te,ct)}L.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,ue.width,ue.height,J.depth,te,ue.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,Q,_e,ue.width,ue.height,J.depth,0,ue.data,0,0);else Me("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else I?ne&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,Q,0,0,0,ue.width,ue.height,J.depth,te,ge,ue.data):t.texImage3D(s.TEXTURE_2D_ARRAY,Q,_e,ue.width,ue.height,J.depth,0,te,ge,ue.data)}else{I&&se&&t.texStorage2D(s.TEXTURE_2D,pe,_e,ze[0].width,ze[0].height);for(let Q=0,X=ze.length;Q<X;Q++)ue=ze[Q],L.format!==Qt?te!==null?I?ne&&t.compressedTexSubImage2D(s.TEXTURE_2D,Q,0,0,ue.width,ue.height,te,ue.data):t.compressedTexImage2D(s.TEXTURE_2D,Q,_e,ue.width,ue.height,0,ue.data):Me("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?ne&&t.texSubImage2D(s.TEXTURE_2D,Q,0,0,ue.width,ue.height,te,ge,ue.data):t.texImage2D(s.TEXTURE_2D,Q,_e,ue.width,ue.height,0,te,ge,ue.data)}else if(L.isDataArrayTexture)if(I){if(se&&t.texStorage3D(s.TEXTURE_2D_ARRAY,pe,_e,J.width,J.height,J.depth),ne)if(L.layerUpdates.size>0){const Q=Fc(J.width,J.height,L.format,L.type);for(const X of L.layerUpdates){const Le=J.data.subarray(X*Q/J.data.BYTES_PER_ELEMENT,(X+1)*Q/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,X,J.width,J.height,1,te,ge,Le)}L.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,te,ge,J.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,_e,J.width,J.height,J.depth,0,te,ge,J.data);else if(L.isData3DTexture)I?(se&&t.texStorage3D(s.TEXTURE_3D,pe,_e,J.width,J.height,J.depth),ne&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,te,ge,J.data)):t.texImage3D(s.TEXTURE_3D,0,_e,J.width,J.height,J.depth,0,te,ge,J.data);else if(L.isFramebufferTexture){if(se)if(I)t.texStorage2D(s.TEXTURE_2D,pe,_e,J.width,J.height);else{let Q=J.width,X=J.height;for(let Le=0;Le<pe;Le++)t.texImage2D(s.TEXTURE_2D,Le,_e,Q,X,0,te,ge,null),Q>>=1,X>>=1}}else if(ze.length>0){if(I&&se){const Q=ve(ze[0]);t.texStorage2D(s.TEXTURE_2D,pe,_e,Q.width,Q.height)}for(let Q=0,X=ze.length;Q<X;Q++)ue=ze[Q],I?ne&&t.texSubImage2D(s.TEXTURE_2D,Q,0,0,te,ge,ue):t.texImage2D(s.TEXTURE_2D,Q,_e,te,ge,ue);L.generateMipmaps=!1}else if(I){if(se){const Q=ve(J);t.texStorage2D(s.TEXTURE_2D,pe,_e,Q.width,Q.height)}ne&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,te,ge,J)}else t.texImage2D(s.TEXTURE_2D,0,_e,te,ge,J);m(L)&&p(q),me.__version=Y.version,L.onUpdate&&L.onUpdate(L)}A.__version=L.version}function ee(A,L,N){if(L.image.length!==6)return;const q=Ie(A,L),K=L.source;t.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+N);const Y=n.get(K);if(K.version!==Y.__version||q===!0){t.activeTexture(s.TEXTURE0+N);const me=Xe.getPrimaries(Xe.workingColorSpace),ie=L.colorSpace===ni?null:Xe.getPrimaries(L.colorSpace),Te=L.colorSpace===ni||me===ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,L.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,L.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);const Re=L.isCompressedTexture||L.image[0].isCompressedTexture,J=L.image[0]&&L.image[0].isDataTexture,te=[];for(let X=0;X<6;X++)!Re&&!J?te[X]=_(L.image[X],!0,i.maxCubemapSize):te[X]=J?L.image[X].image:L.image[X],te[X]=lt(L,te[X]);const ge=te[0],_e=r.convert(L.format,L.colorSpace),ue=r.convert(L.type),ze=E(L.internalFormat,_e,ue,L.colorSpace),I=L.isVideoTexture!==!0,se=Y.__version===void 0||q===!0,ne=K.dataReady;let pe=b(L,ge);he(s.TEXTURE_CUBE_MAP,L);let Q;if(Re){I&&se&&t.texStorage2D(s.TEXTURE_CUBE_MAP,pe,ze,ge.width,ge.height);for(let X=0;X<6;X++){Q=te[X].mipmaps;for(let Le=0;Le<Q.length;Le++){const De=Q[Le];L.format!==Qt?_e!==null?I?ne&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le,0,0,De.width,De.height,_e,De.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le,ze,De.width,De.height,0,De.data):Me("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):I?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le,0,0,De.width,De.height,_e,ue,De.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le,ze,De.width,De.height,0,_e,ue,De.data)}}}else{if(Q=L.mipmaps,I&&se){Q.length>0&&pe++;const X=ve(te[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,pe,ze,X.width,X.height)}for(let X=0;X<6;X++)if(J){I?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,te[X].width,te[X].height,_e,ue,te[X].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,ze,te[X].width,te[X].height,0,_e,ue,te[X].data);for(let Le=0;Le<Q.length;Le++){const ct=Q[Le].image[X].image;I?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le+1,0,0,ct.width,ct.height,_e,ue,ct.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le+1,ze,ct.width,ct.height,0,_e,ue,ct.data)}}else{I?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,_e,ue,te[X]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,ze,_e,ue,te[X]);for(let Le=0;Le<Q.length;Le++){const De=Q[Le];I?ne&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le+1,0,0,_e,ue,De.image[X]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+X,Le+1,ze,_e,ue,De.image[X])}}}m(L)&&p(s.TEXTURE_CUBE_MAP),Y.__version=K.version,L.onUpdate&&L.onUpdate(L)}A.__version=L.version}function re(A,L,N,q,K,Y){const me=r.convert(N.format,N.colorSpace),ie=r.convert(N.type),Te=E(N.internalFormat,me,ie,N.colorSpace),Re=n.get(L),J=n.get(N);if(J.__renderTarget=L,!Re.__hasExternalTextures){const te=Math.max(1,L.width>>Y),ge=Math.max(1,L.height>>Y);K===s.TEXTURE_3D||K===s.TEXTURE_2D_ARRAY?t.texImage3D(K,Y,Te,te,ge,L.depth,0,me,ie,null):t.texImage2D(K,Y,Te,te,ge,0,me,ie,null)}t.bindFramebuffer(s.FRAMEBUFFER,A),gt(L)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,q,K,J.__webglTexture,0,R(L)):(K===s.TEXTURE_2D||K>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,q,K,J.__webglTexture,Y),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Oe(A,L,N){if(s.bindRenderbuffer(s.RENDERBUFFER,A),L.depthBuffer){const q=L.depthTexture,K=q&&q.isDepthTexture?q.type:null,Y=v(L.stencilBuffer,K),me=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;gt(L)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,R(L),Y,L.width,L.height):N?s.renderbufferStorageMultisample(s.RENDERBUFFER,R(L),Y,L.width,L.height):s.renderbufferStorage(s.RENDERBUFFER,Y,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,me,s.RENDERBUFFER,A)}else{const q=L.textures;for(let K=0;K<q.length;K++){const Y=q[K],me=r.convert(Y.format,Y.colorSpace),ie=r.convert(Y.type),Te=E(Y.internalFormat,me,ie,Y.colorSpace);gt(L)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,R(L),Te,L.width,L.height):N?s.renderbufferStorageMultisample(s.RENDERBUFFER,R(L),Te,L.width,L.height):s.renderbufferStorage(s.RENDERBUFFER,Te,L.width,L.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function we(A,L,N){const q=L.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,A),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=n.get(L.depthTexture);if(K.__renderTarget=L,(!K.__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),q){if(K.__webglInit===void 0&&(K.__webglInit=!0,L.depthTexture.addEventListener("dispose",T)),K.__webglTexture===void 0){K.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,K.__webglTexture),he(s.TEXTURE_CUBE_MAP,L.depthTexture);const Re=r.convert(L.depthTexture.format),J=r.convert(L.depthTexture.type);let te;L.depthTexture.format===Gn?te=s.DEPTH_COMPONENT24:L.depthTexture.format===gi&&(te=s.DEPTH24_STENCIL8);for(let ge=0;ge<6;ge++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,te,L.width,L.height,0,Re,J,null)}}else H(L.depthTexture,0);const Y=K.__webglTexture,me=R(L),ie=q?s.TEXTURE_CUBE_MAP_POSITIVE_X+N:s.TEXTURE_2D,Te=L.depthTexture.format===gi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(L.depthTexture.format===Gn)gt(L)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Te,ie,Y,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,Te,ie,Y,0);else if(L.depthTexture.format===gi)gt(L)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Te,ie,Y,0,me):s.framebufferTexture2D(s.FRAMEBUFFER,Te,ie,Y,0);else throw new Error("Unknown depthTexture format")}function Pe(A){const L=n.get(A),N=A.isWebGLCubeRenderTarget===!0;if(L.__boundDepthTexture!==A.depthTexture){const q=A.depthTexture;if(L.__depthDisposeCallback&&L.__depthDisposeCallback(),q){const K=()=>{delete L.__boundDepthTexture,delete L.__depthDisposeCallback,q.removeEventListener("dispose",K)};q.addEventListener("dispose",K),L.__depthDisposeCallback=K}L.__boundDepthTexture=q}if(A.depthTexture&&!L.__autoAllocateDepthBuffer)if(N)for(let q=0;q<6;q++)we(L.__webglFramebuffer[q],A,q);else{const q=A.texture.mipmaps;q&&q.length>0?we(L.__webglFramebuffer[0],A,0):we(L.__webglFramebuffer,A,0)}else if(N){L.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer[q]),L.__webglDepthbuffer[q]===void 0)L.__webglDepthbuffer[q]=s.createRenderbuffer(),Oe(L.__webglDepthbuffer[q],A,!1);else{const K=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Y=L.__webglDepthbuffer[q];s.bindRenderbuffer(s.RENDERBUFFER,Y),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,Y)}}else{const q=A.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer===void 0)L.__webglDepthbuffer=s.createRenderbuffer(),Oe(L.__webglDepthbuffer,A,!1);else{const K=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Y=L.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Y),s.framebufferRenderbuffer(s.FRAMEBUFFER,K,s.RENDERBUFFER,Y)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Tt(A,L,N){const q=n.get(A);L!==void 0&&re(q.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),N!==void 0&&Pe(A)}function Ye(A){const L=A.texture,N=n.get(A),q=n.get(L);A.addEventListener("dispose",C);const K=A.textures,Y=A.isWebGLCubeRenderTarget===!0,me=K.length>1;if(me||(q.__webglTexture===void 0&&(q.__webglTexture=s.createTexture()),q.__version=L.version,a.memory.textures++),Y){N.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(L.mipmaps&&L.mipmaps.length>0){N.__webglFramebuffer[ie]=[];for(let Te=0;Te<L.mipmaps.length;Te++)N.__webglFramebuffer[ie][Te]=s.createFramebuffer()}else N.__webglFramebuffer[ie]=s.createFramebuffer()}else{if(L.mipmaps&&L.mipmaps.length>0){N.__webglFramebuffer=[];for(let ie=0;ie<L.mipmaps.length;ie++)N.__webglFramebuffer[ie]=s.createFramebuffer()}else N.__webglFramebuffer=s.createFramebuffer();if(me)for(let ie=0,Te=K.length;ie<Te;ie++){const Re=n.get(K[ie]);Re.__webglTexture===void 0&&(Re.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&gt(A)===!1){N.__webglMultisampledFramebuffer=s.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let ie=0;ie<K.length;ie++){const Te=K[ie];N.__webglColorRenderbuffer[ie]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,N.__webglColorRenderbuffer[ie]);const Re=r.convert(Te.format,Te.colorSpace),J=r.convert(Te.type),te=E(Te.internalFormat,Re,J,Te.colorSpace,A.isXRRenderTarget===!0),ge=R(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,ge,te,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ie,s.RENDERBUFFER,N.__webglColorRenderbuffer[ie])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(N.__webglDepthRenderbuffer=s.createRenderbuffer(),Oe(N.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Y){t.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture),he(s.TEXTURE_CUBE_MAP,L);for(let ie=0;ie<6;ie++)if(L.mipmaps&&L.mipmaps.length>0)for(let Te=0;Te<L.mipmaps.length;Te++)re(N.__webglFramebuffer[ie][Te],A,L,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Te);else re(N.__webglFramebuffer[ie],A,L,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(L)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(me){for(let ie=0,Te=K.length;ie<Te;ie++){const Re=K[ie],J=n.get(Re);let te=s.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(te=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(te,J.__webglTexture),he(te,Re),re(N.__webglFramebuffer,A,Re,s.COLOR_ATTACHMENT0+ie,te,0),m(Re)&&p(te)}t.unbindTexture()}else{let ie=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ie=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ie,q.__webglTexture),he(ie,L),L.mipmaps&&L.mipmaps.length>0)for(let Te=0;Te<L.mipmaps.length;Te++)re(N.__webglFramebuffer[Te],A,L,s.COLOR_ATTACHMENT0,ie,Te);else re(N.__webglFramebuffer,A,L,s.COLOR_ATTACHMENT0,ie,0);m(L)&&p(ie),t.unbindTexture()}A.depthBuffer&&Pe(A)}function Ke(A){const L=A.textures;for(let N=0,q=L.length;N<q;N++){const K=L[N];if(m(K)){const Y=M(A),me=n.get(K).__webglTexture;t.bindTexture(Y,me),p(Y),t.unbindTexture()}}}const st=[],ke=[];function ft(A){if(A.samples>0){if(gt(A)===!1){const L=A.textures,N=A.width,q=A.height;let K=s.COLOR_BUFFER_BIT;const Y=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,me=n.get(A),ie=L.length>1;if(ie)for(let Re=0;Re<L.length;Re++)t.bindFramebuffer(s.FRAMEBUFFER,me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,me.__webglMultisampledFramebuffer);const Te=A.texture.mipmaps;Te&&Te.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglFramebuffer);for(let Re=0;Re<L.length;Re++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(K|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(K|=s.STENCIL_BUFFER_BIT)),ie){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,me.__webglColorRenderbuffer[Re]);const J=n.get(L[Re]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,J,0)}s.blitFramebuffer(0,0,N,q,0,0,N,q,K,s.NEAREST),c===!0&&(st.length=0,ke.length=0,st.push(s.COLOR_ATTACHMENT0+Re),A.depthBuffer&&A.resolveDepthBuffer===!1&&(st.push(Y),ke.push(Y),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ke)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,st))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ie)for(let Re=0;Re<L.length;Re++){t.bindFramebuffer(s.FRAMEBUFFER,me.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,me.__webglColorRenderbuffer[Re]);const J=n.get(L[Re]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,me.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,J,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,me.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const L=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[L])}}}function R(A){return Math.min(i.maxSamples,A.samples)}function gt(A){const L=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function je(A){const L=a.render.frame;h.get(A)!==L&&(h.set(A,L),A.update())}function lt(A,L){const N=A.colorSpace,q=A.format,K=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||N!==Vt&&N!==ni&&(Xe.getTransfer(N)===Ze?(q!==Qt||K!==jt)&&Me("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ce("WebGLTextures: Unsupported texture color space:",N)),L}function ve(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=F,this.setTexture2D=H,this.setTexture2DArray=O,this.setTexture3D=k,this.setTextureCube=Z,this.rebindTextures=Tt,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=Ke,this.updateMultisampleRenderTarget=ft,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=re,this.useMultisampledRTT=gt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function s2(s,e){function t(n,i=ni){let r;const a=Xe.getTransfer(i);if(n===jt)return s.UNSIGNED_BYTE;if(n===el)return s.UNSIGNED_SHORT_4_4_4_4;if(n===tl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Fh)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Oh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Nh)return s.BYTE;if(n===Uh)return s.SHORT;if(n===Os)return s.UNSIGNED_SHORT;if(n===Qo)return s.INT;if(n===pn)return s.UNSIGNED_INT;if(n===Jt)return s.FLOAT;if(n===Cn)return s.HALF_FLOAT;if(n===Bh)return s.ALPHA;if(n===kh)return s.RGB;if(n===Qt)return s.RGBA;if(n===Gn)return s.DEPTH_COMPONENT;if(n===gi)return s.DEPTH_STENCIL;if(n===nl)return s.RED;if(n===il)return s.RED_INTEGER;if(n===$i)return s.RG;if(n===sl)return s.RG_INTEGER;if(n===rl)return s.RGBA_INTEGER;if(n===br||n===Er||n===Tr||n===Ar)if(a===Ze)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===br)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Er)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===br)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Er)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===eo||n===to||n===no||n===io)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===eo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===to)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===io)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===so||n===ro)return a===Ze?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ao)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===oo)return r.COMPRESSED_R11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===co)return r.COMPRESSED_RG11_EAC;if(n===ho)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===uo||n===fo||n===po||n===mo||n===go||n===Lo||n===_o||n===xo||n===vo||n===yo||n===Mo||n===So||n===bo||n===Eo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===uo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===po)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===mo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===go)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Lo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===_o)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===yo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Mo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===So)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Eo)return a===Ze?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===To||n===Ao||n===wo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===To)return a===Ze?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===wo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Co||n===Ro||n===Po||n===Do)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Co)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Po)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Do)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const r2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,a2=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class o2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Zh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ln({vertexShader:r2,fragmentShader:a2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ge(new Qi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class l2 extends vi{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new o2,p={},M=t.getContextAttributes();let E=null,v=null;const b=[],T=[],C=new Ee;let x=null;const S=new Bt;S.viewport=new at;const D=new Bt;D.viewport=new at;const w=[S,D],F=new ap;let B=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ee=b[j];return ee===void 0&&(ee=new ca,b[j]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function(j){let ee=b[j];return ee===void 0&&(ee=new ca,b[j]=ee),ee.getGripSpace()},this.getHand=function(j){let ee=b[j];return ee===void 0&&(ee=new ca,b[j]=ee),ee.getHandSpace()};function H(j){const ee=T.indexOf(j.inputSource);if(ee===-1)return;const re=b[ee];re!==void 0&&(re.update(j.inputSource,j.frame,l||a),re.dispatchEvent({type:j.type,data:j.inputSource}))}function O(){i.removeEventListener("select",H),i.removeEventListener("selectstart",H),i.removeEventListener("selectend",H),i.removeEventListener("squeeze",H),i.removeEventListener("squeezestart",H),i.removeEventListener("squeezeend",H),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",k);for(let j=0;j<b.length;j++){const ee=T[j];ee!==null&&(T[j]=null,b[j].disconnect(ee))}B=null,G=null,m.reset();for(const j in p)delete p[j];e.setRenderTarget(E),f=null,d=null,u=null,i=null,v=null,it.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Me("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&Me("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(E=e.getRenderTarget(),i.addEventListener("select",H),i.addEventListener("selectstart",H),i.addEventListener("selectend",H),i.addEventListener("squeeze",H),i.addEventListener("squeezestart",H),i.addEventListener("squeezeend",H),i.addEventListener("end",O),i.addEventListener("inputsourceschange",k),M.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let re=null,Oe=null,we=null;M.depth&&(we=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=M.stencil?gi:Gn,Oe=M.stencil?Bs:pn);const Pe={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Pe),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new tn(d.textureWidth,d.textureHeight,{format:Qt,type:jt,depthTexture:new Ji(d.textureWidth,d.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const re={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new tn(f.framebufferWidth,f.framebufferHeight,{format:Qt,type:jt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),it.setContext(i),it.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function k(j){for(let ee=0;ee<j.removed.length;ee++){const re=j.removed[ee],Oe=T.indexOf(re);Oe>=0&&(T[Oe]=null,b[Oe].disconnect(re))}for(let ee=0;ee<j.added.length;ee++){const re=j.added[ee];let Oe=T.indexOf(re);if(Oe===-1){for(let Pe=0;Pe<b.length;Pe++)if(Pe>=T.length){T.push(re),Oe=Pe;break}else if(T[Pe]===null){T[Pe]=re,Oe=Pe;break}if(Oe===-1)break}const we=b[Oe];we&&we.connect(re)}}const Z=new P,$=new P;function oe(j,ee,re){Z.setFromMatrixPosition(ee.matrixWorld),$.setFromMatrixPosition(re.matrixWorld);const Oe=Z.distanceTo($),we=ee.projectionMatrix.elements,Pe=re.projectionMatrix.elements,Tt=we[14]/(we[10]-1),Ye=we[14]/(we[10]+1),Ke=(we[9]+1)/we[5],st=(we[9]-1)/we[5],ke=(we[8]-1)/we[0],ft=(Pe[8]+1)/Pe[0],R=Tt*ke,gt=Tt*ft,je=Oe/(-ke+ft),lt=je*-ke;if(ee.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(lt),j.translateZ(je),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),we[10]===-1)j.projectionMatrix.copy(ee.projectionMatrix),j.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{const ve=Tt+je,A=Ye+je,L=R-lt,N=gt+(Oe-lt),q=Ke*Ye/A*ve,K=st*Ye/A*ve;j.projectionMatrix.makePerspective(L,N,q,K,ve,A),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function de(j,ee){ee===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ee.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;let ee=j.near,re=j.far;m.texture!==null&&(m.depthNear>0&&(ee=m.depthNear),m.depthFar>0&&(re=m.depthFar)),F.near=D.near=S.near=ee,F.far=D.far=S.far=re,(B!==F.near||G!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),B=F.near,G=F.far),F.layers.mask=j.layers.mask|6,S.layers.mask=F.layers.mask&-5,D.layers.mask=F.layers.mask&-3;const Oe=j.parent,we=F.cameras;de(F,Oe);for(let Pe=0;Pe<we.length;Pe++)de(we[Pe],Oe);we.length===2?oe(F,S,D):F.projectionMatrix.copy(S.projectionMatrix),he(j,F,Oe)};function he(j,ee,re){re===null?j.matrix.copy(ee.matrixWorld):(j.matrix.copy(re.matrixWorld),j.matrix.invert(),j.matrix.multiply(ee.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ee.projectionMatrix),j.projectionMatrixInverse.copy(ee.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=Zi*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(j){return p[j]};let Ie=null;function ot(j,ee){if(h=ee.getViewerPose(l||a),g=ee,h!==null){const re=h.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let Oe=!1;re.length!==F.cameras.length&&(F.cameras.length=0,Oe=!0);for(let Ye=0;Ye<re.length;Ye++){const Ke=re[Ye];let st=null;if(f!==null)st=f.getViewport(Ke);else{const ft=u.getViewSubImage(d,Ke);st=ft.viewport,Ye===0&&(e.setRenderTargetTextures(v,ft.colorTexture,ft.depthStencilTexture),e.setRenderTarget(v))}let ke=w[Ye];ke===void 0&&(ke=new Bt,ke.layers.enable(Ye),ke.viewport=new at,w[Ye]=ke),ke.matrix.fromArray(Ke.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(Ke.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(st.x,st.y,st.width,st.height),Ye===0&&(F.matrix.copy(ke.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Oe===!0&&F.cameras.push(ke)}const we=i.enabledFeatures;if(we&&we.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const Ye=u.getDepthInformation(re[0]);Ye&&Ye.isValid&&Ye.texture&&m.init(Ye,i.renderState)}if(we&&we.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Ye=0;Ye<re.length;Ye++){const Ke=re[Ye].camera;if(Ke){let st=p[Ke];st||(st=new Zh,p[Ke]=st);const ke=u.getCameraImage(Ke);st.sourceTexture=ke}}}}for(let re=0;re<b.length;re++){const Oe=T[re],we=b[re];Oe!==null&&we!==void 0&&we.update(Oe,ee,l||a)}Ie&&Ie(j,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const it=new iu;it.setAnimationLoop(ot),this.setAnimationLoop=function(j){Ie=j},this.dispose=function(){}}}const ui=new gn,c2=new Fe;function h2(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Jh(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,M,E,v){p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?c(m,p,M,E):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===kt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===kt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=e.get(p),E=M.envMap,v=M.envMapRotation;E&&(m.envMap.value=E,ui.copy(v),ui.x*=-1,ui.y*=-1,ui.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(c2.makeRotationFromEuler(ui)),m.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,M,E){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=E*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===kt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function u2(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,E){const v=E.program;n.uniformBlockBinding(M,v)}function l(M,E){let v=i[M.id];v===void 0&&(g(M),v=h(M),i[M.id]=v,M.addEventListener("dispose",m));const b=E.program;n.updateUBOMapping(M,b);const T=e.render.frame;r[M.id]!==T&&(d(M),r[M.id]=T)}function h(M){const E=u();M.__bindingPointIndex=E;const v=s.createBuffer(),b=M.__size,T=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,v),s.bufferData(s.UNIFORM_BUFFER,b,T),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,v),v}function u(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return Ce("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const E=i[M.id],v=M.uniforms,b=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let T=0,C=v.length;T<C;T++){const x=Array.isArray(v[T])?v[T]:[v[T]];for(let S=0,D=x.length;S<D;S++){const w=x[S];if(f(w,T,S,b)===!0){const F=w.__offset,B=Array.isArray(w.value)?w.value:[w.value];let G=0;for(let H=0;H<B.length;H++){const O=B[H],k=_(O);typeof O=="number"||typeof O=="boolean"?(w.__data[0]=O,s.bufferSubData(s.UNIFORM_BUFFER,F+G,w.__data)):O.isMatrix3?(w.__data[0]=O.elements[0],w.__data[1]=O.elements[1],w.__data[2]=O.elements[2],w.__data[3]=0,w.__data[4]=O.elements[3],w.__data[5]=O.elements[4],w.__data[6]=O.elements[5],w.__data[7]=0,w.__data[8]=O.elements[6],w.__data[9]=O.elements[7],w.__data[10]=O.elements[8],w.__data[11]=0):(O.toArray(w.__data,G),G+=k.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,F,w.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(M,E,v,b){const T=M.value,C=E+"_"+v;if(b[C]===void 0)return typeof T=="number"||typeof T=="boolean"?b[C]=T:b[C]=T.clone(),!0;{const x=b[C];if(typeof T=="number"||typeof T=="boolean"){if(x!==T)return b[C]=T,!0}else if(x.equals(T)===!1)return x.copy(T),!0}return!1}function g(M){const E=M.uniforms;let v=0;const b=16;for(let C=0,x=E.length;C<x;C++){const S=Array.isArray(E[C])?E[C]:[E[C]];for(let D=0,w=S.length;D<w;D++){const F=S[D],B=Array.isArray(F.value)?F.value:[F.value];for(let G=0,H=B.length;G<H;G++){const O=B[G],k=_(O),Z=v%b,$=Z%k.boundary,oe=Z+$;v+=$,oe!==0&&b-oe<k.storage&&(v+=b-oe),F.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=k.storage}}}const T=v%b;return T>0&&(v+=b-T),M.__size=v,M.__cache={},this}function _(M){const E={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(E.boundary=4,E.storage=4):M.isVector2?(E.boundary=8,E.storage=8):M.isVector3||M.isColor?(E.boundary=16,E.storage=12):M.isVector4?(E.boundary=16,E.storage=16):M.isMatrix3?(E.boundary=48,E.storage=48):M.isMatrix4?(E.boundary=64,E.storage=64):M.isTexture?Me("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Me("WebGLRenderer: Unsupported uniform value type.",M),E}function m(M){const E=M.target;E.removeEventListener("dispose",m);const v=a.indexOf(E.__bindingPointIndex);a.splice(v,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function p(){for(const M in i)s.deleteBuffer(i[M]);a=[],i={},r={}}return{bind:c,update:l,dispose:p}}const d2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let yn=null;function f2(){return yn===null&&(yn=new ml(d2,16,16,$i,Cn),yn.name="DFG_LUT",yn.minFilter=yt,yn.magFilter=yt,yn.wrapS=bn,yn.wrapT=bn,yn.generateMipmaps=!1,yn.needsUpdate=!0),yn}class p2{constructor(e={}){const{canvas:t=Fd(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=jt}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const _=f,m=new Set([rl,sl,il]),p=new Set([jt,pn,Os,Bs,el,tl]),M=new Uint32Array(4),E=new Int32Array(4);let v=null,b=null;const T=[],C=[];let x=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=wn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let D=!1;this._outputColorSpace=xt;let w=0,F=0,B=null,G=-1,H=null;const O=new at,k=new at;let Z=null;const $=new Ae(0);let oe=0,de=t.width,he=t.height,Ie=1,ot=null,it=null;const j=new at(0,0,de,he),ee=new at(0,0,de,he);let re=!1;const Oe=new kr;let we=!1,Pe=!1;const Tt=new Fe,Ye=new P,Ke=new at,st={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function ft(){return B===null?Ie:1}let R=n;function gt(y,U){return t.getContext(y,U)}try{const y={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${$o}`),t.addEventListener("webglcontextlost",Le,!1),t.addEventListener("webglcontextrestored",De,!1),t.addEventListener("webglcontextcreationerror",ct,!1),R===null){const U="webgl2";if(R=gt(U,y),R===null)throw gt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw Ce("WebGLRenderer: "+y.message),y}let je,lt,ve,A,L,N,q,K,Y,me,ie,Te,Re,J,te,ge,_e,ue,ze,I,se,ne,pe;function Q(){je=new p1(R),je.init(),se=new s2(R,je),lt=new a1(R,je,e,se),ve=new n2(R,je),lt.reversedDepthBuffer&&d&&ve.buffers.depth.setReversed(!0),A=new L1(R),L=new Hg,N=new i2(R,je,ve,L,lt,se,A),q=new f1(S),K=new Mp(R),ne=new s1(R,K),Y=new m1(R,K,A,ne),me=new x1(R,Y,K,ne,A),ue=new _1(R,lt,N),te=new o1(L),ie=new Vg(S,q,je,lt,ne,te),Te=new h2(S,L),Re=new Wg,J=new $g(je),_e=new i1(S,q,ve,me,g,c),ge=new t2(S,me,lt),pe=new u2(R,A,lt,ve),ze=new r1(R,je,A),I=new g1(R,je,A),A.programs=ie.programs,S.capabilities=lt,S.extensions=je,S.properties=L,S.renderLists=Re,S.shadowMap=ge,S.state=ve,S.info=A}Q(),_!==jt&&(x=new y1(_,t.width,t.height,i,r));const X=new l2(S,R);this.xr=X,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const y=je.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=je.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return Ie},this.setPixelRatio=function(y){y!==void 0&&(Ie=y,this.setSize(de,he,!1))},this.getSize=function(y){return y.set(de,he)},this.setSize=function(y,U,W=!0){if(X.isPresenting){Me("WebGLRenderer: Can't change size while VR device is presenting.");return}de=y,he=U,t.width=Math.floor(y*Ie),t.height=Math.floor(U*Ie),W===!0&&(t.style.width=y+"px",t.style.height=U+"px"),x!==null&&x.setSize(t.width,t.height),this.setViewport(0,0,y,U)},this.getDrawingBufferSize=function(y){return y.set(de*Ie,he*Ie).floor()},this.setDrawingBufferSize=function(y,U,W){de=y,he=U,Ie=W,t.width=Math.floor(y*W),t.height=Math.floor(U*W),this.setViewport(0,0,y,U)},this.setEffects=function(y){if(_===jt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let U=0;U<y.length;U++)if(y[U].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}x.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(O)},this.getViewport=function(y){return y.copy(j)},this.setViewport=function(y,U,W,V){y.isVector4?j.set(y.x,y.y,y.z,y.w):j.set(y,U,W,V),ve.viewport(O.copy(j).multiplyScalar(Ie).round())},this.getScissor=function(y){return y.copy(ee)},this.setScissor=function(y,U,W,V){y.isVector4?ee.set(y.x,y.y,y.z,y.w):ee.set(y,U,W,V),ve.scissor(k.copy(ee).multiplyScalar(Ie).round())},this.getScissorTest=function(){return re},this.setScissorTest=function(y){ve.setScissorTest(re=y)},this.setOpaqueSort=function(y){ot=y},this.setTransparentSort=function(y){it=y},this.getClearColor=function(y){return y.copy(_e.getClearColor())},this.setClearColor=function(){_e.setClearColor(...arguments)},this.getClearAlpha=function(){return _e.getClearAlpha()},this.setClearAlpha=function(){_e.setClearAlpha(...arguments)},this.clear=function(y=!0,U=!0,W=!0){let V=0;if(y){let z=!1;if(B!==null){const le=B.texture.format;z=m.has(le)}if(z){const le=B.texture.type,fe=p.has(le),ce=_e.getClearColor(),xe=_e.getClearAlpha(),Se=ce.r,Ne=ce.g,Ve=ce.b;fe?(M[0]=Se,M[1]=Ne,M[2]=Ve,M[3]=xe,R.clearBufferuiv(R.COLOR,0,M)):(E[0]=Se,E[1]=Ne,E[2]=Ve,E[3]=xe,R.clearBufferiv(R.COLOR,0,E))}else V|=R.COLOR_BUFFER_BIT}U&&(V|=R.DEPTH_BUFFER_BIT),W&&(V|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&R.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Le,!1),t.removeEventListener("webglcontextrestored",De,!1),t.removeEventListener("webglcontextcreationerror",ct,!1),_e.dispose(),Re.dispose(),J.dispose(),L.dispose(),q.dispose(),me.dispose(),ne.dispose(),pe.dispose(),ie.dispose(),X.dispose(),X.removeEventListener("sessionstart",El),X.removeEventListener("sessionend",Tl),si.stop()};function Le(y){y.preventDefault(),Nr("WebGLRenderer: Context Lost."),D=!0}function De(){Nr("WebGLRenderer: Context Restored."),D=!1;const y=A.autoReset,U=ge.enabled,W=ge.autoUpdate,V=ge.needsUpdate,z=ge.type;Q(),A.autoReset=y,ge.enabled=U,ge.autoUpdate=W,ge.needsUpdate=V,ge.type=z}function ct(y){Ce("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function $e(y){const U=y.target;U.removeEventListener("dispose",$e),Pn(U)}function Pn(y){Dn(y),L.remove(y)}function Dn(y){const U=L.get(y).programs;U!==void 0&&(U.forEach(function(W){ie.releaseProgram(W)}),y.isShaderMaterial&&ie.releaseShaderCache(y))}this.renderBufferDirect=function(y,U,W,V,z,le){U===null&&(U=st);const fe=z.isMesh&&z.matrixWorld.determinant()<0,ce=vu(y,U,W,V,z);ve.setMaterial(V,fe);let xe=W.index,Se=1;if(V.wireframe===!0){if(xe=Y.getWireframeAttribute(W),xe===void 0)return;Se=2}const Ne=W.drawRange,Ve=W.attributes.position;let be=Ne.start*Se,et=(Ne.start+Ne.count)*Se;le!==null&&(be=Math.max(be,le.start*Se),et=Math.min(et,(le.start+le.count)*Se)),xe!==null?(be=Math.max(be,0),et=Math.min(et,xe.count)):Ve!=null&&(be=Math.max(be,0),et=Math.min(et,Ve.count));const pt=et-be;if(pt<0||pt===1/0)return;ne.setup(z,V,ce,W,xe);let dt,tt=ze;if(xe!==null&&(dt=K.get(xe),tt=I,tt.setIndex(dt)),z.isMesh)V.wireframe===!0?(ve.setLineWidth(V.wireframeLinewidth*ft()),tt.setMode(R.LINES)):tt.setMode(R.TRIANGLES);else if(z.isLine){let Dt=V.linewidth;Dt===void 0&&(Dt=1),ve.setLineWidth(Dt*ft()),z.isLineSegments?tt.setMode(R.LINES):z.isLineLoop?tt.setMode(R.LINE_LOOP):tt.setMode(R.LINE_STRIP)}else z.isPoints?tt.setMode(R.POINTS):z.isSprite&&tt.setMode(R.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)Ur("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),tt.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(je.get("WEBGL_multi_draw"))tt.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Dt=z._multiDrawStarts,ye=z._multiDrawCounts,Xt=z._multiDrawCount,qe=xe?K.get(xe).bytesPerElement:1,sn=L.get(V).currentProgram.getUniforms();for(let xn=0;xn<Xt;xn++)sn.setValue(R,"_gl_DrawID",xn),tt.render(Dt[xn]/qe,ye[xn])}else if(z.isInstancedMesh)tt.renderInstances(be,pt,z.count);else if(W.isInstancedBufferGeometry){const Dt=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,ye=Math.min(W.instanceCount,Dt);tt.renderInstances(be,pt,ye)}else tt.render(be,pt)};function bl(y,U,W){y.transparent===!0&&y.side===Gt&&y.forceSinglePass===!1?(y.side=kt,y.needsUpdate=!0,Xs(y,U,W),y.side=fn,y.needsUpdate=!0,Xs(y,U,W),y.side=Gt):Xs(y,U,W)}this.compile=function(y,U,W=null){W===null&&(W=y),b=J.get(W),b.init(U),C.push(b),W.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),y!==W&&y.traverseVisible(function(z){z.isLight&&z.layers.test(U.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),b.setupLights();const V=new Set;return y.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const le=z.material;if(le)if(Array.isArray(le))for(let fe=0;fe<le.length;fe++){const ce=le[fe];bl(ce,W,z),V.add(ce)}else bl(le,W,z),V.add(le)}),b=C.pop(),V},this.compileAsync=function(y,U,W=null){const V=this.compile(y,U,W);return new Promise(z=>{function le(){if(V.forEach(function(fe){L.get(fe).currentProgram.isReady()&&V.delete(fe)}),V.size===0){z(y);return}setTimeout(le,10)}je.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let Xr=null;function xu(y){Xr&&Xr(y)}function El(){si.stop()}function Tl(){si.start()}const si=new iu;si.setAnimationLoop(xu),typeof self<"u"&&si.setContext(self),this.setAnimationLoop=function(y){Xr=y,X.setAnimationLoop(y),y===null?si.stop():si.start()},X.addEventListener("sessionstart",El),X.addEventListener("sessionend",Tl),this.render=function(y,U){if(U!==void 0&&U.isCamera!==!0){Ce("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;const W=X.enabled===!0&&X.isPresenting===!0,V=x!==null&&(B===null||W)&&x.begin(S,B);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(x===null||x.isCompositing()===!1)&&(X.cameraAutoUpdate===!0&&X.updateCamera(U),U=X.getCamera()),y.isScene===!0&&y.onBeforeRender(S,y,U,B),b=J.get(y,C.length),b.init(U),C.push(b),Tt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Oe.setFromProjectionMatrix(Tt,En,U.reversedDepth),Pe=this.localClippingEnabled,we=te.init(this.clippingPlanes,Pe),v=Re.get(y,T.length),v.init(),T.push(v),X.enabled===!0&&X.isPresenting===!0){const fe=S.xr.getDepthSensingMesh();fe!==null&&Yr(fe,U,-1/0,S.sortObjects)}Yr(y,U,0,S.sortObjects),v.finish(),S.sortObjects===!0&&v.sort(ot,it),ke=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,ke&&_e.addToRenderList(v,y),this.info.render.frame++,we===!0&&te.beginShadows();const z=b.state.shadowsArray;if(ge.render(z,y,U),we===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset(),(V&&x.hasRenderPass())===!1){const fe=v.opaque,ce=v.transmissive;if(b.setupLights(),U.isArrayCamera){const xe=U.cameras;if(ce.length>0)for(let Se=0,Ne=xe.length;Se<Ne;Se++){const Ve=xe[Se];wl(fe,ce,y,Ve)}ke&&_e.render(y);for(let Se=0,Ne=xe.length;Se<Ne;Se++){const Ve=xe[Se];Al(v,y,Ve,Ve.viewport)}}else ce.length>0&&wl(fe,ce,y,U),ke&&_e.render(y),Al(v,y,U)}B!==null&&F===0&&(N.updateMultisampleRenderTarget(B),N.updateRenderTargetMipmap(B)),V&&x.end(S),y.isScene===!0&&y.onAfterRender(S,y,U),ne.resetDefaultState(),G=-1,H=null,C.pop(),C.length>0?(b=C[C.length-1],we===!0&&te.setGlobalState(S.clippingPlanes,b.state.camera)):b=null,T.pop(),T.length>0?v=T[T.length-1]:v=null};function Yr(y,U,W,V){if(y.visible===!1)return;if(y.layers.test(U.layers)){if(y.isGroup)W=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(U);else if(y.isLight)b.pushLight(y),y.castShadow&&b.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Oe.intersectsSprite(y)){V&&Ke.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Tt);const fe=me.update(y),ce=y.material;ce.visible&&v.push(y,fe,ce,W,Ke.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Oe.intersectsObject(y))){const fe=me.update(y),ce=y.material;if(V&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ke.copy(y.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Ke.copy(fe.boundingSphere.center)),Ke.applyMatrix4(y.matrixWorld).applyMatrix4(Tt)),Array.isArray(ce)){const xe=fe.groups;for(let Se=0,Ne=xe.length;Se<Ne;Se++){const Ve=xe[Se],be=ce[Ve.materialIndex];be&&be.visible&&v.push(y,fe,be,W,Ke.z,Ve)}}else ce.visible&&v.push(y,fe,ce,W,Ke.z,null)}}const le=y.children;for(let fe=0,ce=le.length;fe<ce;fe++)Yr(le[fe],U,W,V)}function Al(y,U,W,V){const{opaque:z,transmissive:le,transparent:fe}=y;b.setupLightsView(W),we===!0&&te.setGlobalState(S.clippingPlanes,W),V&&ve.viewport(O.copy(V)),z.length>0&&Ws(z,U,W),le.length>0&&Ws(le,U,W),fe.length>0&&Ws(fe,U,W),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function wl(y,U,W,V){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[V.id]===void 0){const be=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[V.id]=new tn(1,1,{generateMipmaps:!0,type:be?Cn:jt,minFilter:zn,samples:Math.max(4,lt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Xe.workingColorSpace})}const le=b.state.transmissionRenderTarget[V.id],fe=V.viewport||O;le.setSize(fe.z*S.transmissionResolutionScale,fe.w*S.transmissionResolutionScale);const ce=S.getRenderTarget(),xe=S.getActiveCubeFace(),Se=S.getActiveMipmapLevel();S.setRenderTarget(le),S.getClearColor($),oe=S.getClearAlpha(),oe<1&&S.setClearColor(16777215,.5),S.clear(),ke&&_e.render(W);const Ne=S.toneMapping;S.toneMapping=wn;const Ve=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),b.setupLightsView(V),we===!0&&te.setGlobalState(S.clippingPlanes,V),Ws(y,W,V),N.updateMultisampleRenderTarget(le),N.updateRenderTargetMipmap(le),je.has("WEBGL_multisampled_render_to_texture")===!1){let be=!1;for(let et=0,pt=U.length;et<pt;et++){const dt=U[et],{object:tt,geometry:Dt,material:ye,group:Xt}=dt;if(ye.side===Gt&&tt.layers.test(V.layers)){const qe=ye.side;ye.side=kt,ye.needsUpdate=!0,Cl(tt,W,V,Dt,ye,Xt),ye.side=qe,ye.needsUpdate=!0,be=!0}}be===!0&&(N.updateMultisampleRenderTarget(le),N.updateRenderTargetMipmap(le))}S.setRenderTarget(ce,xe,Se),S.setClearColor($,oe),Ve!==void 0&&(V.viewport=Ve),S.toneMapping=Ne}function Ws(y,U,W){const V=U.isScene===!0?U.overrideMaterial:null;for(let z=0,le=y.length;z<le;z++){const fe=y[z],{object:ce,geometry:xe,group:Se}=fe;let Ne=fe.material;Ne.allowOverride===!0&&V!==null&&(Ne=V),ce.layers.test(W.layers)&&Cl(ce,U,W,xe,Ne,Se)}}function Cl(y,U,W,V,z,le){y.onBeforeRender(S,U,W,V,z,le),y.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),z.onBeforeRender(S,U,W,V,y,le),z.transparent===!0&&z.side===Gt&&z.forceSinglePass===!1?(z.side=kt,z.needsUpdate=!0,S.renderBufferDirect(W,U,V,z,y,le),z.side=fn,z.needsUpdate=!0,S.renderBufferDirect(W,U,V,z,y,le),z.side=Gt):S.renderBufferDirect(W,U,V,z,y,le),y.onAfterRender(S,U,W,V,z,le)}function Xs(y,U,W){U.isScene!==!0&&(U=st);const V=L.get(y),z=b.state.lights,le=b.state.shadowsArray,fe=z.state.version,ce=ie.getParameters(y,z.state,le,U,W),xe=ie.getProgramCacheKey(ce);let Se=V.programs;V.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?U.environment:null,V.fog=U.fog;const Ne=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;V.envMap=q.get(y.envMap||V.environment,Ne),V.envMapRotation=V.environment!==null&&y.envMap===null?U.environmentRotation:y.envMapRotation,Se===void 0&&(y.addEventListener("dispose",$e),Se=new Map,V.programs=Se);let Ve=Se.get(xe);if(Ve!==void 0){if(V.currentProgram===Ve&&V.lightsStateVersion===fe)return Pl(y,ce),Ve}else ce.uniforms=ie.getUniforms(y),y.onBeforeCompile(ce,S),Ve=ie.acquireProgram(ce,xe),Se.set(xe,Ve),V.uniforms=ce.uniforms;const be=V.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(be.clippingPlanes=te.uniform),Pl(y,ce),V.needsLights=Mu(y),V.lightsStateVersion=fe,V.needsLights&&(be.ambientLightColor.value=z.state.ambient,be.lightProbe.value=z.state.probe,be.directionalLights.value=z.state.directional,be.directionalLightShadows.value=z.state.directionalShadow,be.spotLights.value=z.state.spot,be.spotLightShadows.value=z.state.spotShadow,be.rectAreaLights.value=z.state.rectArea,be.ltc_1.value=z.state.rectAreaLTC1,be.ltc_2.value=z.state.rectAreaLTC2,be.pointLights.value=z.state.point,be.pointLightShadows.value=z.state.pointShadow,be.hemisphereLights.value=z.state.hemi,be.directionalShadowMatrix.value=z.state.directionalShadowMatrix,be.spotLightMatrix.value=z.state.spotLightMatrix,be.spotLightMap.value=z.state.spotLightMap,be.pointShadowMatrix.value=z.state.pointShadowMatrix),V.currentProgram=Ve,V.uniformsList=null,Ve}function Rl(y){if(y.uniformsList===null){const U=y.currentProgram.getUniforms();y.uniformsList=Cr.seqWithValue(U.seq,y.uniforms)}return y.uniformsList}function Pl(y,U){const W=L.get(y);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.batchingColor=U.batchingColor,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.instancingMorph=U.instancingMorph,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function vu(y,U,W,V,z){U.isScene!==!0&&(U=st),N.resetTextureUnits();const le=U.fog,fe=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?U.environment:null,ce=B===null?S.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:Vt,xe=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Se=q.get(V.envMap||fe,xe),Ne=V.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ve=!!W.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),be=!!W.morphAttributes.position,et=!!W.morphAttributes.normal,pt=!!W.morphAttributes.color;let dt=wn;V.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(dt=S.toneMapping);const tt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Dt=tt!==void 0?tt.length:0,ye=L.get(V),Xt=b.state.lights;if(we===!0&&(Pe===!0||y!==H)){const At=y===H&&V.id===G;te.setState(V,y,At)}let qe=!1;V.version===ye.__version?(ye.needsLights&&ye.lightsStateVersion!==Xt.state.version||ye.outputColorSpace!==ce||z.isBatchedMesh&&ye.batching===!1||!z.isBatchedMesh&&ye.batching===!0||z.isBatchedMesh&&ye.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&ye.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&ye.instancing===!1||!z.isInstancedMesh&&ye.instancing===!0||z.isSkinnedMesh&&ye.skinning===!1||!z.isSkinnedMesh&&ye.skinning===!0||z.isInstancedMesh&&ye.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&ye.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&ye.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&ye.instancingMorph===!1&&z.morphTexture!==null||ye.envMap!==Se||V.fog===!0&&ye.fog!==le||ye.numClippingPlanes!==void 0&&(ye.numClippingPlanes!==te.numPlanes||ye.numIntersection!==te.numIntersection)||ye.vertexAlphas!==Ne||ye.vertexTangents!==Ve||ye.morphTargets!==be||ye.morphNormals!==et||ye.morphColors!==pt||ye.toneMapping!==dt||ye.morphTargetsCount!==Dt)&&(qe=!0):(qe=!0,ye.__version=V.version);let sn=ye.currentProgram;qe===!0&&(sn=Xs(V,U,z));let xn=!1,ri=!1,yi=!1;const rt=sn.getUniforms(),Pt=ye.uniforms;if(ve.useProgram(sn.program)&&(xn=!0,ri=!0,yi=!0),V.id!==G&&(G=V.id,ri=!0),xn||H!==y){ve.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),rt.setValue(R,"projectionMatrix",y.projectionMatrix),rt.setValue(R,"viewMatrix",y.matrixWorldInverse);const Xn=rt.map.cameraPosition;Xn!==void 0&&Xn.setValue(R,Ye.setFromMatrixPosition(y.matrixWorld)),lt.logarithmicDepthBuffer&&rt.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&rt.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),H!==y&&(H=y,ri=!0,yi=!0)}if(ye.needsLights&&(Xt.state.directionalShadowMap.length>0&&rt.setValue(R,"directionalShadowMap",Xt.state.directionalShadowMap,N),Xt.state.spotShadowMap.length>0&&rt.setValue(R,"spotShadowMap",Xt.state.spotShadowMap,N),Xt.state.pointShadowMap.length>0&&rt.setValue(R,"pointShadowMap",Xt.state.pointShadowMap,N)),z.isSkinnedMesh){rt.setOptional(R,z,"bindMatrix"),rt.setOptional(R,z,"bindMatrixInverse");const At=z.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),rt.setValue(R,"boneTexture",At.boneTexture,N))}z.isBatchedMesh&&(rt.setOptional(R,z,"batchingTexture"),rt.setValue(R,"batchingTexture",z._matricesTexture,N),rt.setOptional(R,z,"batchingIdTexture"),rt.setValue(R,"batchingIdTexture",z._indirectTexture,N),rt.setOptional(R,z,"batchingColorTexture"),z._colorsTexture!==null&&rt.setValue(R,"batchingColorTexture",z._colorsTexture,N));const Wn=W.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&ue.update(z,W,sn),(ri||ye.receiveShadow!==z.receiveShadow)&&(ye.receiveShadow=z.receiveShadow,rt.setValue(R,"receiveShadow",z.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&U.environment!==null&&(Pt.envMapIntensity.value=U.environmentIntensity),Pt.dfgLUT!==void 0&&(Pt.dfgLUT.value=f2()),ri&&(rt.setValue(R,"toneMappingExposure",S.toneMappingExposure),ye.needsLights&&yu(Pt,yi),le&&V.fog===!0&&Te.refreshFogUniforms(Pt,le),Te.refreshMaterialUniforms(Pt,V,Ie,he,b.state.transmissionRenderTarget[y.id]),Cr.upload(R,Rl(ye),Pt,N)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Cr.upload(R,Rl(ye),Pt,N),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&rt.setValue(R,"center",z.center),rt.setValue(R,"modelViewMatrix",z.modelViewMatrix),rt.setValue(R,"normalMatrix",z.normalMatrix),rt.setValue(R,"modelMatrix",z.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const At=V.uniformsGroups;for(let Xn=0,Mi=At.length;Xn<Mi;Xn++){const Dl=At[Xn];pe.update(Dl,sn),pe.bind(Dl,sn)}}return sn}function yu(y,U){y.ambientLightColor.needsUpdate=U,y.lightProbe.needsUpdate=U,y.directionalLights.needsUpdate=U,y.directionalLightShadows.needsUpdate=U,y.pointLights.needsUpdate=U,y.pointLightShadows.needsUpdate=U,y.spotLights.needsUpdate=U,y.spotLightShadows.needsUpdate=U,y.rectAreaLights.needsUpdate=U,y.hemisphereLights.needsUpdate=U}function Mu(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(y,U,W){const V=L.get(y);V.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),L.get(y.texture).__webglTexture=U,L.get(y.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:W,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,U){const W=L.get(y);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0};const Su=R.createFramebuffer();this.setRenderTarget=function(y,U=0,W=0){B=y,w=U,F=W;let V=null,z=!1,le=!1;if(y){const ce=L.get(y);if(ce.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(R.FRAMEBUFFER,ce.__webglFramebuffer),O.copy(y.viewport),k.copy(y.scissor),Z=y.scissorTest,ve.viewport(O),ve.scissor(k),ve.setScissorTest(Z),G=-1;return}else if(ce.__webglFramebuffer===void 0)N.setupRenderTarget(y);else if(ce.__hasExternalTextures)N.rebindTextures(y,L.get(y.texture).__webglTexture,L.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ne=y.depthTexture;if(ce.__boundDepthTexture!==Ne){if(Ne!==null&&L.has(Ne)&&(y.width!==Ne.image.width||y.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");N.setupDepthRenderbuffer(y)}}const xe=y.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(le=!0);const Se=L.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Se[U])?V=Se[U][W]:V=Se[U],z=!0):y.samples>0&&N.useMultisampledRTT(y)===!1?V=L.get(y).__webglMultisampledFramebuffer:Array.isArray(Se)?V=Se[W]:V=Se,O.copy(y.viewport),k.copy(y.scissor),Z=y.scissorTest}else O.copy(j).multiplyScalar(Ie).floor(),k.copy(ee).multiplyScalar(Ie).floor(),Z=re;if(W!==0&&(V=Su),ve.bindFramebuffer(R.FRAMEBUFFER,V)&&ve.drawBuffers(y,V),ve.viewport(O),ve.scissor(k),ve.setScissorTest(Z),z){const ce=L.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+U,ce.__webglTexture,W)}else if(le){const ce=U;for(let xe=0;xe<y.textures.length;xe++){const Se=L.get(y.textures[xe]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+xe,Se.__webglTexture,W,ce)}}else if(y!==null&&W!==0){const ce=L.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,ce.__webglTexture,W)}G=-1},this.readRenderTargetPixels=function(y,U,W,V,z,le,fe,ce=0){if(!(y&&y.isWebGLRenderTarget)){Ce("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=L.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&fe!==void 0&&(xe=xe[fe]),xe){ve.bindFramebuffer(R.FRAMEBUFFER,xe);try{const Se=y.textures[ce],Ne=Se.format,Ve=Se.type;if(y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+ce),!lt.textureFormatReadable(Ne)){Ce("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!lt.textureTypeReadable(Ve)){Ce("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=y.width-V&&W>=0&&W<=y.height-z&&R.readPixels(U,W,V,z,se.convert(Ne),se.convert(Ve),le)}finally{const Se=B!==null?L.get(B).__webglFramebuffer:null;ve.bindFramebuffer(R.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(y,U,W,V,z,le,fe,ce=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=L.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&fe!==void 0&&(xe=xe[fe]),xe)if(U>=0&&U<=y.width-V&&W>=0&&W<=y.height-z){ve.bindFramebuffer(R.FRAMEBUFFER,xe);const Se=y.textures[ce],Ne=Se.format,Ve=Se.type;if(y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+ce),!lt.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!lt.textureTypeReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const be=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,be),R.bufferData(R.PIXEL_PACK_BUFFER,le.byteLength,R.STREAM_READ),R.readPixels(U,W,V,z,se.convert(Ne),se.convert(Ve),0);const et=B!==null?L.get(B).__webglFramebuffer:null;ve.bindFramebuffer(R.FRAMEBUFFER,et);const pt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Od(R,pt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,be),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,le),R.deleteBuffer(be),R.deleteSync(pt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,U=null,W=0){const V=Math.pow(2,-W),z=Math.floor(y.image.width*V),le=Math.floor(y.image.height*V),fe=U!==null?U.x:0,ce=U!==null?U.y:0;N.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,W,0,0,fe,ce,z,le),ve.unbindTexture()};const bu=R.createFramebuffer(),Eu=R.createFramebuffer();this.copyTextureToTexture=function(y,U,W=null,V=null,z=0,le=0){let fe,ce,xe,Se,Ne,Ve,be,et,pt;const dt=y.isCompressedTexture?y.mipmaps[le]:y.image;if(W!==null)fe=W.max.x-W.min.x,ce=W.max.y-W.min.y,xe=W.isBox3?W.max.z-W.min.z:1,Se=W.min.x,Ne=W.min.y,Ve=W.isBox3?W.min.z:0;else{const Pt=Math.pow(2,-z);fe=Math.floor(dt.width*Pt),ce=Math.floor(dt.height*Pt),y.isDataArrayTexture?xe=dt.depth:y.isData3DTexture?xe=Math.floor(dt.depth*Pt):xe=1,Se=0,Ne=0,Ve=0}V!==null?(be=V.x,et=V.y,pt=V.z):(be=0,et=0,pt=0);const tt=se.convert(U.format),Dt=se.convert(U.type);let ye;U.isData3DTexture?(N.setTexture3D(U,0),ye=R.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(N.setTexture2DArray(U,0),ye=R.TEXTURE_2D_ARRAY):(N.setTexture2D(U,0),ye=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,U.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,U.unpackAlignment);const Xt=R.getParameter(R.UNPACK_ROW_LENGTH),qe=R.getParameter(R.UNPACK_IMAGE_HEIGHT),sn=R.getParameter(R.UNPACK_SKIP_PIXELS),xn=R.getParameter(R.UNPACK_SKIP_ROWS),ri=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,dt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,dt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Se),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ne),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Ve);const yi=y.isDataArrayTexture||y.isData3DTexture,rt=U.isDataArrayTexture||U.isData3DTexture;if(y.isDepthTexture){const Pt=L.get(y),Wn=L.get(U),At=L.get(Pt.__renderTarget),Xn=L.get(Wn.__renderTarget);ve.bindFramebuffer(R.READ_FRAMEBUFFER,At.__webglFramebuffer),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let Mi=0;Mi<xe;Mi++)yi&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,L.get(y).__webglTexture,z,Ve+Mi),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,L.get(U).__webglTexture,le,pt+Mi)),R.blitFramebuffer(Se,Ne,fe,ce,be,et,fe,ce,R.DEPTH_BUFFER_BIT,R.NEAREST);ve.bindFramebuffer(R.READ_FRAMEBUFFER,null),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(z!==0||y.isRenderTargetTexture||L.has(y)){const Pt=L.get(y),Wn=L.get(U);ve.bindFramebuffer(R.READ_FRAMEBUFFER,bu),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,Eu);for(let At=0;At<xe;At++)yi?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Pt.__webglTexture,z,Ve+At):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Pt.__webglTexture,z),rt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Wn.__webglTexture,le,pt+At):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Wn.__webglTexture,le),z!==0?R.blitFramebuffer(Se,Ne,fe,ce,be,et,fe,ce,R.COLOR_BUFFER_BIT,R.NEAREST):rt?R.copyTexSubImage3D(ye,le,be,et,pt+At,Se,Ne,fe,ce):R.copyTexSubImage2D(ye,le,be,et,Se,Ne,fe,ce);ve.bindFramebuffer(R.READ_FRAMEBUFFER,null),ve.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else rt?y.isDataTexture||y.isData3DTexture?R.texSubImage3D(ye,le,be,et,pt,fe,ce,xe,tt,Dt,dt.data):U.isCompressedArrayTexture?R.compressedTexSubImage3D(ye,le,be,et,pt,fe,ce,xe,tt,dt.data):R.texSubImage3D(ye,le,be,et,pt,fe,ce,xe,tt,Dt,dt):y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,le,be,et,fe,ce,tt,Dt,dt.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,le,be,et,dt.width,dt.height,tt,dt.data):R.texSubImage2D(R.TEXTURE_2D,le,be,et,fe,ce,tt,Dt,dt);R.pixelStorei(R.UNPACK_ROW_LENGTH,Xt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,qe),R.pixelStorei(R.UNPACK_SKIP_PIXELS,sn),R.pixelStorei(R.UNPACK_SKIP_ROWS,xn),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ri),le===0&&U.generateMipmaps&&R.generateMipmap(ye),ve.unbindTexture()},this.initRenderTarget=function(y){L.get(y).__webglFramebuffer===void 0&&N.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?N.setTextureCube(y,0):y.isData3DTexture?N.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?N.setTexture2DArray(y,0):N.setTexture2D(y,0),ve.unbindTexture()},this.resetState=function(){w=0,F=0,B=null,ve.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}function rh(s,e){if(e===Ed)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Io||e===zh){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===Io)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function m2(s){const e=new Map,t=new Map,n=s.clone();return cu(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function cu(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)cu(s.children[n],e.children[n],t)}class g2 extends hs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new y2(t)}),this.register(function(t){return new M2(t)}),this.register(function(t){return new P2(t)}),this.register(function(t){return new D2(t)}),this.register(function(t){return new I2(t)}),this.register(function(t){return new b2(t)}),this.register(function(t){return new E2(t)}),this.register(function(t){return new T2(t)}),this.register(function(t){return new A2(t)}),this.register(function(t){return new v2(t)}),this.register(function(t){return new w2(t)}),this.register(function(t){return new S2(t)}),this.register(function(t){return new R2(t)}),this.register(function(t){return new C2(t)}),this.register(function(t){return new _2(t)}),this.register(function(t){return new ah(t,We.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ah(t,We.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new N2(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const l=Ns.extractUrlBase(e);a=Ns.resolveURL(l,this.path)}else a=Ns.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){i?i(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new tu(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===hu){try{a[We.KHR_BINARY_GLTF]=new U2(e)}catch(u){i&&i(u);return}r=JSON.parse(a[We.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new j2(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case We.KHR_MATERIALS_UNLIT:a[u]=new x2;break;case We.KHR_DRACO_MESH_COMPRESSION:a[u]=new F2(r,this.dracoLoader);break;case We.KHR_TEXTURE_TRANSFORM:a[u]=new O2;break;case We.KHR_MESH_QUANTIZATION:a[u]=new B2;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function L2(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function mt(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const We={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class _2{constructor(e){this.parser=e,this.name=We.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const h=new Ae(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Vt);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new wr(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new nu(h),l.distance=u;break;case"spot":l=new tp(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Mn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class x2{constructor(){this.name=We.KHR_MATERIALS_UNLIT}getMaterialType(){return Tn}extendParams(e,t,n){const i=[];e.color=new Ae(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Vt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,xt))}return Promise.all(i)}}class v2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class y2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ee(r,r)}return Promise.all(i)}}class M2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_DISPERSION}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class S2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class b2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_SHEEN}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Ae(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],Vt)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,xt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class E2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class T2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_VOLUME}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ae().setRGB(r[0],r[1],r[2],Vt),Promise.all(i)}}class A2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_IOR}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5),Promise.resolve()}}class w2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_SPECULAR}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ae().setRGB(r[0],r[1],r[2],Vt),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,xt)),Promise.all(i)}}class C2{constructor(e){this.parser=e,this.name=We.EXT_MATERIALS_BUMP}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class R2{constructor(e){this.parser=e,this.name=We.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return mt(this.parser,e,this.name)!==null?Wt:null}extendMaterialParams(e,t){const n=mt(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class P2{constructor(e){this.parser=e,this.name=We.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class D2{constructor(e){this.parser=e,this.name=We.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}}class I2{constructor(e){this.parser=e,this.name=We.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return n.loadTextureImage(e,a.source,c)}}class ah{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class N2{constructor(e){this.name=We.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==Zt.TRIANGLES&&l.mode!==Zt.TRIANGLE_STRIP&&l.mode!==Zt.TRIANGLE_FAN&&l.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],c={};for(const l in a)o.push(this.parser.getDependency("accessor",a[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(const g of u){const _=new Fe,m=new P,p=new mn,M=new P(1,1,1),E=new Is(g.geometry,g.material,d);for(let v=0;v<d;v++)c.TRANSLATION&&m.fromBufferAttribute(c.TRANSLATION,v),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,v),c.SCALE&&M.fromBufferAttribute(c.SCALE,v),E.setMatrixAt(v,_.compose(m,p,M));for(const v in c)if(v==="_COLOR_0"){const b=c[v];E.instanceColor=new Uo(b.array,b.itemSize,b.normalized)}else v!=="TRANSLATION"&&v!=="ROTATION"&&v!=="SCALE"&&g.geometry.setAttribute(v,c[v]);ht.prototype.copy.call(E,g),this.parser.assignFinalMaterial(E),f.push(E)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const hu="glTF",Ms=12,oh={JSON:1313821514,BIN:5130562};class U2{constructor(e){this.name=We.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ms),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==hu)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Ms,r=new DataView(e,Ms);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const c=r.getUint32(a,!0);if(a+=4,c===oh.JSON){const l=new Uint8Array(e,Ms+a,o);this.content=n.decode(l)}else if(c===oh.BIN){const l=Ms+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class F2{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=We.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(const h in a){const u=Vo[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=Vo[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=Yi[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const g in f.attributes){const _=f.attributes[g],m=c[g];m!==void 0&&(_.normalized=m)}u(f)},o,l,Vt,d)})})}}class O2{constructor(){this.name=We.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class B2{constructor(){this.name=We.KHR_MESH_QUANTIZATION}}class uu extends os{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,g=e*l,_=g-l,m=-2*f+3*d,p=f-d,M=1-m,E=p-d+u;for(let v=0;v!==o;v++){const b=a[_+v+o],T=a[_+v+c]*h,C=a[g+v+o],x=a[g+v]*h;r[v]=M*b+E*T+m*C+p*x}return r}}const k2=new mn;class z2 extends uu{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return k2.fromArray(r).normalize().toArray(r),r}}const Zt={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Yi={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},lh={9728:vt,9729:yt,9984:Ih,9985:Sr,9986:Ts,9987:zn},ch={33071:bn,33648:Dr,10497:Ki},Oa={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Vo={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Qn={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},V2={CUBICSPLINE:void 0,LINEAR:zs,STEP:ks},Ba={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function H2(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new xi({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:fn})),s.DefaultMaterial}function di(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Mn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function G2(s,e,t){let n=!1,i=!1,r=!1;for(let l=0,h=e.length;l<h;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const u=e[l];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function W2(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function X2(s){let e;const t=s.extensions&&s.extensions[We.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+ka(t.attributes):e=s.indices+":"+ka(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+ka(s.targets[n]);return e}function ka(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Ho(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Y2(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const q2=new Fe;class j2{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new L2,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Jf(this.options.manager):this.textureLoader=new sp(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new tu(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return di(r,o,i),Mn(o,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(const[l,h]of a.children.entries())r(h,o.children[l])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[We.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(Ns.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Oa[i.type],o=Yi[i.componentType],c=i.normalized===!0,l=new o(i.count*a);return Promise.resolve(new zt(l,a,c))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],c=Oa[i.type],l=Yi[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0;let _,m;if(f&&f!==u){const p=Math.floor(d/f),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count;let E=t.cache.get(M);E||(_=new l(o,p*f,i.count*f/h),E=new _f(_,f/h),t.cache.add(M,E)),m=new pl(E,c,d%f/h,g)}else o===null?_=new l(i.count*c):_=new l(o,d,i.count*c),m=new zt(_,c,g);if(i.sparse!==void 0){const p=Oa.SCALAR,M=Yi[i.sparse.indices.componentType],E=i.sparse.indices.byteOffset||0,v=i.sparse.values.byteOffset||0,b=new M(a[1],E,i.sparse.count*p),T=new l(a[2],v,i.sparse.count*c);o!==null&&(m=new zt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let C=0,x=b.length;C<x;C++){const S=b[C];if(m.setX(S,T[C*c]),c>=2&&m.setY(S,T[C*c+1]),c>=3&&m.setZ(S,T[C*c+2]),c>=4&&m.setW(S,T[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=lh[d.magFilter]||yt,h.minFilter=lh[d.minFilter]||zn,h.wrapS=ch[d.wrapS]||Ki,h.wrapT=ch[d.wrapT]||Ki,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==vt&&h.minFilter!==yt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let c=a.uri||"",l=!1;if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(u){l=!0;const d=new Blob([u],{type:a.mimeType});return c=o.createObjectURL(d),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){const m=new St(_);m.needsUpdate=!0,d(m)}),t.load(Ns.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return l===!0&&o.revokeObjectURL(c),Mn(u,a),u.userData.mimeType=a.mimeType||Y2(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[We.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[We.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=r.associations.get(a);a=r.extensions[We.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,c)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new Kh,dn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new zr,dn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),r&&(c.vertexColors=!0),a&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return xi}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},c=r.extensions||{},l=[];if(c[We.KHR_MATERIALS_UNLIT]){const u=i[We.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),l.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new Ae(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Vt),o.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",u.baseColorTexture,xt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Gt);const h=r.alphaMode||Ba.OPAQUE;if(h===Ba.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Ba.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Tn&&(l.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new Ee(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Tn&&(l.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Tn){const u=r.emissiveFactor;o.emissive=new Ae().setRGB(u[0],u[1],u[2],Vt)}return r.emissiveTexture!==void 0&&a!==Tn&&l.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,xt)),Promise.all(l).then(function(){const u=new a(o);return r.name&&(u.name=r.name),Mn(u,r),t.associations.set(u,{materials:e}),r.extensions&&di(i,u,r),u})}createUniqueName(e){const t=Qe.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[We.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return hh(c,o,t)})}const a=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=X2(l),u=i[h];if(u)a.push(u.promise);else{let d;l.extensions&&l.extensions[We.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=hh(new Ut,l,t),i[h]={primitive:l,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let c=0,l=a.length;c<l;c++){const h=a[c].material===void 0?H2(this.cache):this.getDependency("material",a[c].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,g=h.length;f<g;f++){const _=h[f],m=a[f];let p;const M=l[f];if(m.mode===Zt.TRIANGLES||m.mode===Zt.TRIANGLE_STRIP||m.mode===Zt.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new Mf(_,M):new Ge(_,M),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===Zt.TRIANGLE_STRIP?p.geometry=rh(p.geometry,zh):m.mode===Zt.TRIANGLE_FAN&&(p.geometry=rh(p.geometry,Io));else if(m.mode===Zt.LINES)p=new qh(_,M);else if(m.mode===Zt.LINE_STRIP)p=new Vr(_,M);else if(m.mode===Zt.LINE_LOOP)p=new jh(_,M);else if(m.mode===Zt.POINTS)p=new wf(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&W2(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Mn(p,r),m.extensions&&di(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&di(i,u[0],r),u[0];const d=new Kt;r.extensions&&di(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Bt(en.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Gs(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Mn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],c=[];for(let l=0,h=a.length;l<h;l++){const u=a[l];if(u){o.push(u);const d=new Fe;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new gl(o,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],g=i.samplers[f.sampler],_=f.target,m=_.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,M=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",M)),l.push(g),h.push(_))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],g=u[2],_=u[3],m=u[4],p=[];for(let E=0,v=d.length;E<v;E++){const b=d[E],T=f[E],C=g[E],x=_[E],S=m[E];if(b===void 0)continue;b.updateMatrix&&b.updateMatrix();const D=n._createAnimationTracks(b,T,C,x,S);if(D)for(let w=0;w<D.length;w++)p.push(D[w])}const M=new Xf(r,void 0,p);return Mn(M,i),M})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=i.weights.length;c<l;c++)o.morphTargetInfluences[c]=i.weights[c]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let l=0,h=o.length;l<h;l++)a.push(n.getDependency("node",o[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),c]).then(function(l){const h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,q2)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,g=u[0];h.pivot=new P().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(r.isBone===!0?h=new Yh:l.length>1?h=new Kt:l.length===1?h=l[0]:h=new ht,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Mn(h,r),r.extensions&&di(n,h,r),r.matrix!==void 0){const u=new Fe;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Kt;n.name&&(r.name=i.createUniqueName(n.name)),Mn(r,n),n.extensions&&di(t,r,n);const a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(i.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let h=0,u=c.length;h<u;h++){const d=c[h];d.parent!==null?r.add(m2(d)):r.add(d)}const l=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof dn||d instanceof St)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,c=[];Qn[r.path]===Qn.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(o);let l;switch(Qn[r.path]){case Qn.weights:l=ts;break;case Qn.rotation:l=ns;break;case Qn.translation:case Qn.scale:l=is;break;default:n.itemSize===1?l=ts:l=is;break}const h=i.interpolation!==void 0?V2[i.interpolation]:zs,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){const g=new l(c[d]+"."+Qn[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),a.push(g)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Ho(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof ns?z2:uu;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function K2(s,e,t){const n=e.attributes,i=new Mt;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(i.set(new P(c[0],c[1],c[2]),new P(l[0],l[1],l[2])),o.normalized){const h=Ho(Yi[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new P,c=new P;for(let l=0,h=r.length;l<h;l++){const u=r[l];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){const _=Ho(Yi[d.componentType]);c.multiplyScalar(_)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new Rn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function hh(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(c){s.setAttribute(o,c)})}for(const a in n){const o=Vo[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return Xe.workingColorSpace!==Vt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Xe.workingColorSpace}" not supported.`),Mn(s,e),K2(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?G2(s,e.targets,t):s})}const uh={type:"change"},Ml={type:"start"},du={type:"end"},yr=new rs,dh=new ei,$2=Math.cos(70*en.DEG2RAD),_t=new P,Ht=2*Math.PI,nt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},za=1e-6;class Z2 extends vp{constructor(e,t=null){super(e,t),this.state=nt.NONE,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gi.ROTATE,MIDDLE:Gi.DOLLY,RIGHT:Gi.PAN},this.touches={ONE:Hi.ROTATE,TWO:Hi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new P,this._lastQuaternion=new mn,this._lastTargetPosition=new P,this._quat=new mn().setFromUnitVectors(e.up,new P(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Nc,this._sphericalDelta=new Nc,this._scale=1,this._panOffset=new P,this._rotateStart=new Ee,this._rotateEnd=new Ee,this._rotateDelta=new Ee,this._panStart=new Ee,this._panEnd=new Ee,this._panDelta=new Ee,this._dollyStart=new Ee,this._dollyEnd=new Ee,this._dollyDelta=new Ee,this._dollyDirection=new P,this._mouse=new Ee,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Q2.bind(this),this._onPointerDown=J2.bind(this),this._onPointerUp=eL.bind(this),this._onContextMenu=oL.bind(this),this._onMouseWheel=iL.bind(this),this._onKeyDown=sL.bind(this),this._onTouchStart=rL.bind(this),this._onTouchMove=aL.bind(this),this._onMouseDown=tL.bind(this),this._onMouseMove=nL.bind(this),this._interceptControlDown=lL.bind(this),this._interceptControlUp=cL.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(uh),this.update(),this.state=nt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;_t.copy(t).sub(this.target),_t.applyQuaternion(this._quat),this._spherical.setFromVector3(_t),this.autoRotate&&this.state===nt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=Ht:n>Math.PI&&(n-=Ht),i<-Math.PI?i+=Ht:i>Math.PI&&(i-=Ht),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(_t.setFromSpherical(this._spherical),_t.applyQuaternion(this._quatInverse),t.copy(this.target).add(_t),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=_t.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){const o=new P(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;const l=new P(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(o),this.object.updateMatrixWorld(),a=_t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(yr.origin.copy(this.object.position),yr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(yr.direction))<$2?this.object.lookAt(this.target):(dh.setFromNormalAndCoplanarPoint(this.object.up,this.target),yr.intersectPlane(dh,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>za||8*(1-this._lastQuaternion.dot(this.object.quaternion))>za||this._lastTargetPosition.distanceToSquared(this.target)>za?(this.dispatchEvent(uh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Ht/60*this.autoRotateSpeed*e:Ht/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){_t.setFromMatrixColumn(t,0),_t.multiplyScalar(-e),this._panOffset.add(_t)}_panUp(e,t){this.screenSpacePanning===!0?_t.setFromMatrixColumn(t,1):(_t.setFromMatrixColumn(t,0),_t.crossVectors(this.object.up,_t)),_t.multiplyScalar(e),this._panOffset.add(_t)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;_t.copy(i).sub(this.target);let r=_t.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ht*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ht*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Ht*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Ht*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Ht*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Ht*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Ht*this._rotateDelta.x/t.clientHeight),this._rotateUp(Ht*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ee,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function J2(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Q2(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function eL(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(du),this.state=nt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function tL(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Gi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=nt.DOLLY;break;case Gi.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=nt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=nt.ROTATE}break;case Gi.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=nt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=nt.PAN}break;default:this.state=nt.NONE}this.state!==nt.NONE&&this.dispatchEvent(Ml)}function nL(s){switch(this.state){case nt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case nt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case nt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function iL(s){this.enabled===!1||this.enableZoom===!1||this.state!==nt.NONE||(s.preventDefault(),this.dispatchEvent(Ml),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(du))}function sL(s){this.enabled!==!1&&this._handleKeyDown(s)}function rL(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Hi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=nt.TOUCH_ROTATE;break;case Hi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=nt.TOUCH_PAN;break;default:this.state=nt.NONE}break;case 2:switch(this.touches.TWO){case Hi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=nt.TOUCH_DOLLY_PAN;break;case Hi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=nt.TOUCH_DOLLY_ROTATE;break;default:this.state=nt.NONE}break;default:this.state=nt.NONE}this.state!==nt.NONE&&this.dispatchEvent(Ml)}function aL(s){switch(this._trackPointer(s),this.state){case nt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case nt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case nt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case nt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=nt.NONE}}function oL(s){this.enabled!==!1&&s.preventDefault()}function lL(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function cL(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class hL extends fl{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new as;e.deleteAttribute("uv");const t=new xi({side:kt}),n=new xi,i=new nu(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);const r=new Ge(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new Is(e,n,6),o=new ht;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const c=new Ge(e,ki(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const l=new Ge(e,ki(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);const h=new Ge(e,ki(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const u=new Ge(e,ki(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);const d=new Ge(e,ki(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);const f=new Ge(e,ki(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function ki(s){return new Ff({color:0,emissive:16777215,emissiveIntensity:s})}const Go=7,ws=9,Wo=4.2,Xo=4,ti=.8,Ss=.4,Va=4.05,Yo=-2,uL=.56,dL=.001,Li=s=>`${s.lane}:${s.row}`,Sl=s=>Pr(s.lane,5)*8+Pr(s.row,8),Cs=s=>{const e=Math.max(0,Math.min(1,s));return e*e*e*(e*(e*6-15)+10)};function Ha(s,e,t,n){const i=s.value-e,r=s.velocity+t*i,a=Math.exp(-t*n);s.value=e+(i+r*n)*a,s.velocity=(s.velocity-t*r*n)*a}function fh(s,e,t=!1){const n=s*Math.exp(-e*(t?35:7));return Math.abs(n)<=dL?0:n}function fL(s,e){if(e<0||e>3.2)return 0;const t=s-e*8;return .8*Cs(e/.2)*Math.exp(-e*1.15)*Math.cos(t*.58)*Math.exp(-.5*(t/3.4)**2)}function ph(s){return{cell:{...s},index:Sl(s),lift:{value:0,velocity:0},rotation:0,returnY:null}}class pL{selected=ph({lane:0,row:0});outgoing=[];trackLane={value:0,velocity:0};trackRow={value:0,velocity:0};detail=0;detailRequested=!1;rotationTarget=0;reduced=!1;reveal=0;revealTarget=0;time=0;revealedAt=-100;pulses=[];pulseGain=1;focusStillness=0;minY=-2.11*ti;maxY=2.351*ti;setBounds(e,t){this.minY=e,this.maxY=t}revealScene(){this.revealTarget||(this.revealedAt=this.time),this.revealTarget=1}select(e){if(Li(e)===Li(this.selected.cell))return;const t=this.selected;(t.lift.value>1e-5||t.rotation!==0)&&(t.rotation!==0&&t.returnY===null&&(t.returnY=this.position(t)[1]),this.outgoing.push(t));const n=this.outgoing.findIndex(i=>Li(i.cell)===Li(e));this.selected=n<0?ph(e):this.outgoing.splice(n,1)[0],this.rotationTarget=0,this.pulses.push({...e,time:this.time}),this.pulses=this.pulses.slice(-6)}setDetail(e){this.detailRequested!==e&&(this.detailRequested=e,e?this.selected.returnY=null:(this.rotationTarget=0,this.selected.rotation!==0&&(this.selected.returnY=this.position(this.selected)[1])))}get cells(){return Array.from({length:Go*ws},(e,t)=>({lane:Rs(Math.floor(t/ws),this.trackLane.value,Go),row:Rs(t%ws,this.trackRow.value,ws)}))}field(e){const t=e.row-this.trackRow.value,n=e.lane-this.trackLane.value;let i=.65*Math.exp(-.5*(t/1.8)**2-(n/1.1)**2);if(this.reduced)return i;const r=this.time-this.revealedAt,a=t+n*.65-(r*9-5);i+=.65*Math.exp(-.5*(a/2.2)**2)*Cs(r/.25)*(1-Cs((r-2)/1.2));const o=Math.exp(-.5*(t/2.5)**2-.5*(n/1.8)**2),c=1-.84*this.focusStillness*o;i+=c*(uL*Math.sin(this.time*1.18-e.row*.92+e.lane*.66)+.18*Math.sin(this.time*1.73+e.row*.47+e.lane*1.21));let l=0;for(const h of this.pulses)l+=fL(Math.hypot(e.row-h.row,(e.lane-h.lane)*2.2),this.time-h.time);return i+=Math.max(-.6,Math.min(.6,l))*this.pulseGain,i}slotPosition(e){return[(e.lane-this.trackLane.value)*Wo,Yo+this.field(e),(e.row-this.trackRow.value)*Xo-14*(1-this.reveal)]}position(e){const t=this.slotPosition(e.cell);return t[1]+=e.lift.value,t}get clearance(){const{cell:e}=this.selected;let t=-1/0;for(let n=e.lane-1;n<=e.lane+1;n++)for(let i=e.row-2;i<=e.row+2;i++)n===e.lane&&i===e.row||(t=Math.max(t,this.slotPosition({lane:n,row:i})[1]+this.maxY));for(const n of this.outgoing)Math.abs(n.cell.lane-e.lane)<=1&&Math.abs(n.cell.row-e.row)<=2&&(t=Math.max(t,this.position(n)[1]+this.maxY));return this.position(this.selected)[1]+this.minY-t}get canRotate(){return this.detailRequested&&this.detail>.92&&this.clearance>.3&&this.selected.returnY===null}get phase(){return this.selected.returnY!==null?"aligning":this.detailRequested?this.canRotate?"ready":"extracting":this.selected.lift.value>Ss+.03||this.outgoing.length?"returning":"browsing"}get transitioning(){const e=(t,n)=>Math.abs(t.value-n)>1e-5||Math.abs(t.velocity)>1e-5;return Math.abs(this.reveal-this.revealTarget)>1e-5||Math.abs(this.detail-(this.detailRequested?1:0))>1e-5||e(this.trackLane,this.selected.cell.lane)||e(this.trackRow,this.selected.cell.row)||e(this.selected.lift,this.detailRequested?Va:Ss*this.reveal)||Math.abs(this.selected.rotation-(this.detailRequested?this.rotationTarget:0))>1e-5||this.selected.returnY!==null||this.outgoing.length>0}step(e){this.time+=e;const t=1-Math.exp(-e*(this.reduced?35:3.2));this.reveal+=(this.revealTarget-this.reveal)*(this.reduced?1:1-Math.exp(-e*2.5)),Ha(this.trackLane,this.selected.cell.lane,this.reduced?35:3.7,e),Ha(this.trackRow,this.selected.cell.row,this.reduced?35:3.7,e),this.pulses=this.pulses.filter(a=>this.time-a.time<3.2);const n=this.detailRequested||this.selected.returnY!==null||this.outgoing.some(a=>a.returnY!==null);this.focusStillness+=((n?1:0)-this.focusStillness)*(1-Math.exp(-e*5)),this.pulseGain+=((this.detailRequested||this.selected.returnY!==null||this.outgoing.some(a=>a.returnY!==null)?0:1)-this.pulseGain)*(1-Math.exp(-e*8));const i=this.selected;i.rotation=this.detailRequested&&i.returnY===null?i.rotation+(this.rotationTarget-i.rotation)*t:fh(i.rotation,e,this.reduced),this.advanceLift(i,this.detailRequested?Va:Ss*this.reveal,e);for(const a of this.outgoing)a.rotation=fh(a.rotation,e,this.reduced),this.advanceLift(a,0,e);this.outgoing=this.outgoing.filter(a=>a.returnY!==null||a.lift.value>1e-5||a.rotation!==0);const r=i.returnY!==null?this.detail:this.detailRequested?Cs((i.lift.value-.8)/2.4):Cs((i.lift.value-Ss)/(Va-Ss));this.detail+=(r-this.detail)*t}advanceLift(e,t,n){e.returnY!==null?(e.lift.value=e.returnY-this.slotPosition(e.cell)[1],e.lift.velocity=0,e.rotation===0&&(e.returnY=null)):Ha(e.lift,t,this.reduced?35:4.2,n)}}function fu(s,e){if(!["petals","stamens","pedicels","stem"].includes(e))return;const t=s.color.getHSL({h:0,s:0,l:0});s.color.setHSL(.49,Math.max(.8,t.s),t.l*.55)}function pu(s){const e=`
    #ifdef USE_FOG
      varying vec2 vDistanceFogXZ;
    #endif
  `;s.vertexShader=e+s.vertexShader,s.vertexShader=s.vertexShader.replace("#include <fog_vertex>",`#include <fog_vertex>
    #ifdef USE_FOG
      vDistanceFogXZ = mvPosition.xz;
    #endif`),s.fragmentShader=e+s.fragmentShader,s.fragmentShader=s.fragmentShader.replace("#include <fog_fragment>",`
    #ifdef USE_FOG
      float distanceFogDepth = length(vDistanceFogXZ);
    #endif
    ${Be.fog_fragment.replaceAll("vFogDepth","distanceFogDepth")}`)}function bs(s){return s.onBeforeCompile=pu,s.customProgramCacheKey=()=>"lycoris-distance-fog-xz-01",s}const Ga=.72,mh=.66,gh=.44,Lh=`
uniform float uArchiveTime;
uniform float uArchiveSelect;
uniform float uArchiveAge;
uniform float uArchiveFault;
uniform float uArchiveSeed;
uniform float uArchiveShell;
uniform float uArchiveOrganic;
uniform vec3 uArchiveFocus;
varying vec3 vArchiveLocal;
varying float vArchiveDepth;
varying float vArchiveFocusDistance;
varying float vArchiveCap;
float archiveHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
`;function mL(s,e){pu(s),Object.assign(s.uniforms,e),s.vertexShader=Lh+s.vertexShader,s.vertexShader=s.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
    vArchiveLocal = position;
    vArchiveCap = abs(normal.y);
    `),s.vertexShader=s.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
    vArchiveDepth = -mvPosition.z;
    vec4 archiveAnchor = vec4(0.0, 0.0, 0.0, 1.0);
    #ifdef USE_INSTANCING
      archiveAnchor = instanceMatrix * archiveAnchor;
    #endif
    vArchiveFocusDistance = distance((modelMatrix * archiveAnchor).xyz, uArchiveFocus);
    `),s.fragmentShader=Lh+s.fragmentShader,s.fragmentShader=s.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
    float focusDepth = -(viewMatrix * vec4(uArchiveFocus, 1.0)).z;
    float archiveDepth = smoothstep(-3.0, 18.0, vArchiveDepth - focusDepth);
    float archiveNeighborhood = 1.0 - smoothstep(3.0, 13.0, vArchiveFocusDistance);
    float archiveClarity = (1.0 - archiveDepth) * 0.45 + archiveNeighborhood * 0.55;
    float archivedLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    diffuseColor.rgb = mix(vec3(archivedLuma), diffuseColor.rgb, uArchiveSelect);
    `),s.fragmentShader=s.fragmentShader.replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
    float frostGrain = archiveHash(floor(vArchiveLocal.xy * 170.0) + vArchiveLocal.z * 43.0);
    float softFrost = mix(0.76, 0.58, archiveClarity) + frostGrain * 0.025;
    roughnessFactor = mix(roughnessFactor, softFrost, uArchiveShell * (1.0 - uArchiveSelect));
    `),s.fragmentShader=s.fragmentShader.replace("#include <opaque_fragment>",`#include <opaque_fragment>
    // Give the rough transmission enough blend weight to actually blur the
    // flower. The cap stays lighter without suppressing the entire glass wall.
    float archiveRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.3);
    float layerLight = mix(0.53, 0.90, archiveClarity);
    gl_FragColor.rgb *= mix(layerLight, 1.0, uArchiveSelect);
    // Desaturate after lighting as well, so the red rim light and emissive base
    // cannot color the dormant specimen. Selection restores the source color.
    float litLuma = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor.rgb = mix(vec3(litLuma), gl_FragColor.rgb, uArchiveSelect);
    if (uArchiveShell > 0.5) {
      float veil = mix(0.80, 1.0, archiveRim) * mix(1.0, 0.45, vArchiveCap);
      gl_FragColor.a *= mix(veil, 1.0, uArchiveSelect);
    }
    `)}class gL{lightweight=!1;focus={value:new P};sources=new Map;dormantMaterials=[];glassQuality(e){if(!(e instanceof Wt)||!e.name.includes("Glass"))return;const t=this.lightweight?0:.94;e.transmission!==t&&(e.transmission=t,e.needsUpdate=!0),e.opacity=this.lightweight?gh:Ga,e.color.setHex(this.lightweight?3489859:14081244)}setLightweight(e,t){if(this.lightweight!==e){this.lightweight=e;for(const n of this.dormantMaterials)this.glassQuality(n);for(const n of t)for(const i of n.materials)this.glassQuality(i)}}uniforms(e,t,n){return{uArchiveTime:{value:0},uArchiveSelect:{value:0},uArchiveAge:{value:0},uArchiveFault:{value:0},uArchiveSeed:{value:n},uArchiveShell:{value:t?1:0},uArchiveOrganic:{value:["petals","stamens","stem","pedicels"].includes(e)?1:0},uArchiveFocus:this.focus}}material(e,t,n=0){const i=e.name.includes("Glass"),r=i?new Wt({color:14081244,roughness:mh,metalness:0,transmission:.94,ior:1.43,thickness:.22,attenuationColor:new Ae(13883865),attenuationDistance:5,transparent:!0,opacity:Ga,depthWrite:!1,side:fn,clearcoat:.02,envMapIntensity:.32}):e.clone();r.name=e.name+"__ArchiveSurface",this.glassQuality(r),i||(r.roughness=Math.max(r.roughness,.35),r.envMapIntensity=.45);const a=this.uniforms(t,i,n);return r.onBeforeCompile=o=>mL(o,a),r.customProgramCacheKey=()=>"lycoris-static-frost-05-distance-fog",{material:r,uniforms:a}}dormant(e,t){const{material:n}=this.material(e,t);return this.sources.set(n,{source:e,part:t}),this.dormantMaterials.push(n),n}setFocus(e){this.focus.value.set(...e),this.focus.value.y+=.12}prepare(e,t,n){const i={cyan:hn[t]?.flowerColor==="cyan",amount:0,selected:!1,selectedAt:n,uniforms:[],materials:[]};for(const r of e.children){if(!(r instanceof Ge)||Array.isArray(r.material))continue;const a=this.sources.get(r.material);if(!a)continue;const o=this.material(a.source,a.part,t*1.618+.7);i.cyan&&fu(o.material,a.part),r.material=o.material,i.uniforms.push(o.uniforms),i.materials.push(o.material)}return i}update(e,t,n,i,r){t&&!e.selected&&(e.selectedAt=n),e.selected=t;const a=t?1:0;e.amount=r?a:en.lerp(e.amount,a,1-Math.exp(-i*(t?3.4:2.8)));const o=Math.max(0,n-e.selectedAt),c=(o+.6)%3.7,l=r?0:Math.max(Math.exp(-o*3.6),c<.23?Math.sin(c/.23*Math.PI)*.48:0);e.uniforms.forEach((h,u)=>{h.uArchiveTime.value=r?0:n,h.uArchiveSelect.value=e.amount,h.uArchiveAge.value=r?4:o,h.uArchiveFault.value=l;const d=e.materials[u];h.uArchiveShell.value&&(d.opacity=en.lerp(this.lightweight?gh:Ga,.028,e.amount),d.roughness=en.lerp(mh,.16,e.amount))})}release(e){for(const t of e.materials)t.dispose()}dispose(){for(const e of this.dormantMaterials)e.dispose();this.dormantMaterials=[],this.sources.clear()}}const LL=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];class _L{corners=Array.from({length:8},()=>new P);footprint=new Mt;cellBounds=new Mt;point=new P;center=new P;halfSize=new P;range="";candidates=[];visible=[];update(e,t,n,i,r){let a=0;for(const p of[!1,!0])for(const M of[-1,1])for(const E of[-1,1]){const v=this.corners[a++];v.set(E,M,p?1:-1).applyMatrix4(t.projectionMatrixInverse),p&&-v.z>i&&v.multiplyScalar(i/-v.z),v.applyMatrix4(t.matrixWorld)}const o=Yo+n.min.y-4,c=Yo+n.max.y+4;this.footprint.makeEmpty();for(const p of this.corners)p.y>=o&&p.y<=c&&this.footprint.expandByPoint(p);for(const[p,M]of LL)for(const E of[o,c]){const v=this.corners[p],b=this.corners[M];if(Math.abs(b.y-v.y)<1e-6)continue;const T=(E-v.y)/(b.y-v.y);T>=0&&T<=1&&this.footprint.expandByPoint(this.point.copy(v).lerp(b,T))}if(this.visible.length=0,this.footprint.isEmpty())return this.visible;const l=Math.max(Math.abs(n.min.x),n.max.x,Math.abs(n.min.z),n.max.z)+1;this.footprint.expandByScalar(l);const h=14*(1-e.reveal),u=Math.floor(this.footprint.min.x/Wo+e.trackLane.value),d=Math.ceil(this.footprint.max.x/Wo+e.trackLane.value),f=Math.floor((this.footprint.min.z+h)/Xo+e.trackRow.value),g=Math.ceil((this.footprint.max.z+h)/Xo+e.trackRow.value),_=`${u}:${d}:${f}:${g}`;if(_!==this.range){this.range=_,this.candidates=[];for(let p=u;p<=d;p++)for(let M=f;M<=g;M++)this.candidates.push({lane:p,row:M})}const m=t.matrixWorldInverse.elements;for(const p of this.candidates){if(this.point.set(...e.slotPosition(p)),this.cellBounds.copy(n).translate(this.point).expandByScalar(1),!r.intersectsBox(this.cellBounds))continue;this.cellBounds.getCenter(this.center),this.cellBounds.getSize(this.halfSize).multiplyScalar(.5);const M=-(m[2]*this.center.x+m[6]*this.center.y+m[10]*this.center.z+m[14])-Math.abs(m[2])*this.halfSize.x-Math.abs(m[6])*this.halfSize.y-Math.abs(m[10])*this.halfSize.z,E=Math.abs(m[0]*this.center.x+m[4]*this.center.y+m[8]*this.center.z+m[12])-Math.abs(m[0])*this.halfSize.x-Math.abs(m[4])*this.halfSize.y-Math.abs(m[8])*this.halfSize.z,v=Math.max(0,M),b=Math.max(0,E);v*v+b*b<i*i&&this.visible.push(p)}return this.visible}}const mu=[{name:"light",pixels:1e6,pixelRatio:1,samples:2,transmission:0,distantAt:17},{name:"balanced",pixels:2e6,pixelRatio:1.25,samples:2,transmission:.5,distantAt:23},{name:"fine",pixels:4e6,pixelRatio:1.75,samples:4,transmission:.75,distantAt:28}];function xL(s,e,t,n){return Math.min(n,s.pixelRatio,Math.sqrt(s.pixels/(e*t)))}class vL{tier;enabled=!0;initial;warmup=3;slow=0;constructor(e=8,t=8){this.initial=e<=4||t<=4?1:2,this.tier=this.initial}get profile(){return mu[this.tier]}setEnabled(e){e!==this.enabled&&(this.enabled=e,this.tier=e?this.initial:0,this.warmup=3,this.slow=0)}sample(e){return!this.enabled||this.tier===0?!1:!Number.isFinite(e)||e<=0||e>1?(this.slow=0,!1):(e=Math.min(e,.1),this.warmup>0?(this.warmup-=e,!1):(this.slow=Math.max(0,this.slow+e*(e>1/42?1:-.5)),this.slow<2.5?!1:(this.tier--,this.slow=0,this.warmup=4,!0)))}}class yL extends Kt{instances=[];distantInstances=[];distantCells=[];shells=[];models=new Map;surfaces=new Map;template=new Kt;bounds;cells=[];dummy=new ht;arrayLabels=[];label;appearance=new gL;lastTime=0;renderedCells=[];frustum=new kr;viewProjection=new Fe;cellBounds=new Mt;distantKeys=new Set;window=new _L;profile=mu[2];setQuality(e){this.profile=e,this.appearance.setLightweight(e.transmission===0,this.surfaces.values())}reserve(e){if(e<=this.shells.length)return;const t=Math.ceil(e/32)*32;for(const i of[this.instances,this.distantInstances])i.forEach((r,a)=>{const o=new Is(r.geometry,r.material,t);o.userData={...r.userData},o.count=0,o.frustumCulled=!1,o.instanceMatrix.setUsage(ia),this.remove(r),r.dispose(),this.add(o),i[a]=o});const n=this.shells[0];for(;this.shells.length<t;){const i=new Ge(n.geometry,n.material);if(i.visible=!1,this.shells.push(i),this.add(i),this.label){const r=new Kt;r.userData.record=-1,r.visible=!1,this.arrayLabels.push(r),this.add(r)}}}constructor(e,t){super(),this.label=t,e.updateMatrixWorld(!0);const n=Go*ws;if(e.traverse(i=>{if(!(i instanceof Ge))return;let r=i.geometry.clone().applyMatrix4(i.matrixWorld).scale(ti,ti,ti);const a=i.material;if(a.name.includes("Glass")){r.computeBoundingBox();const{min:l,max:h}=r.boundingBox,u=new Ll(h.x,h.x,h.y-l.y,64,12);u.translate(0,(l.y+h.y)/2,0),r.dispose(),r=u}const o=this.appearance.dormant(a,i.userData.assemblyPart),c=new Ge(r,o);if(c.userData={...i.userData},this.template.add(c),a.name.includes("Glass"))for(let l=0;l<n;l++){const h=new Ge(r,o);this.shells.push(h),this.add(h)}else{const l=new Is(r,o,n);l.userData={...i.userData},l.instanceMatrix.setUsage(ia),l.frustumCulled=!1,this.instances.push(l),this.add(l)}}),this.bounds=new Mt().setFromObject(this.template),t)for(let i=0;i<n;i++){const r=new Kt;r.userData.record=-1,this.arrayLabels.push(r),this.add(r)}}setDistantSource(e){e.updateMatrixWorld(!0);const t=n=>n.split("__")[0].replace(/\.\d+$/,"");e.traverse(n=>{if(!(n instanceof Ge)||Array.isArray(n.material))return;const i=this.instances.find(o=>o.userData.assemblyPart===n.userData.assemblyPart&&t(o.material.name)===t(n.material.name));if(!i)return;const r=n.geometry.clone().applyMatrix4(n.matrixWorld).scale(ti,ti,ti),a=new Is(r,i.material,this.shells.length);a.count=0,a.frustumCulled=!1,a.instanceMatrix.setUsage(ia),this.distantInstances.push(a),this.add(a)})}sync(e,t,n){const i=Math.min(.05,Math.max(0,e.time-this.lastTime));this.lastTime=e.time,this.visible=e.reveal>.001,this.appearance.setFocus(e.position(e.selected));const r=[e.selected,...e.outgoing],a=new Set(r);for(const[h,u]of this.models)a.has(h)||(this.appearance.release(this.surfaces.get(h)),this.surfaces.delete(h),this.remove(u),this.models.delete(h));for(const h of r){let u=this.models.get(h);u||(u=this.template.clone(!0),this.label&&u.add(this.label(h.index)),u.userData.archiveCard=h,this.models.set(h,u),this.surfaces.set(h,this.appearance.prepare(u,h.index,e.time)),this.add(u)),u.position.set(...e.position(h)),u.rotation.y=h.rotation,this.appearance.update(this.surfaces.get(h),h===e.selected&&e.revealTarget>0,e.time,i,e.reduced)}const o=new Set(r.map(h=>Li(h.cell)));this.renderedCells.length=0,this.distantCells.length=0;const c=new Set,l=e.slotPosition(e.selected.cell);t&&(t.updateMatrixWorld(),this.viewProjection.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.viewProjection)),this.cells=t&&n?this.window.update(e,t,this.bounds,n.far,this.frustum):e.cells,this.reserve(this.cells.length);for(let h=this.cells.length;h<this.shells.length;h++)this.shells[h].visible=!1,this.arrayLabels[h]&&(this.arrayLabels[h].visible=!1);this.cells.forEach((h,u)=>{const d=o.has(Li(h));this.dummy.position.set(...e.slotPosition(h));let f=!d;if(f&&t&&!n&&(this.cellBounds.copy(this.bounds).translate(this.dummy.position).expandByScalar(1),f=this.frustum.intersectsBox(this.cellBounds)),f){const m=Li(h),p=Math.hypot(this.dummy.position.x-l[0],this.dummy.position.z-l[2])<6.5,M=this.distantInstances.length===this.instances.length&&t&&!p&&this.dummy.position.distanceTo(t.position)>this.profile.distantAt-(this.distantKeys.has(m)?4:0),E=M?this.distantCells:this.renderedCells,v=M?this.distantInstances:this.instances;M&&c.add(m),this.dummy.updateMatrix();for(const b of v)b.setMatrixAt(E.length,this.dummy.matrix);E.push(h)}const g=this.shells[u];g.visible=f,g.position.copy(this.dummy.position),g.userData.archiveCell=h;const _=this.arrayLabels[u];if(_){const m=Sl(h);_.userData.record!==m&&(_.clear(),_.add(this.label(m)),_.userData.record=m),_.visible=f,_.position.copy(this.dummy.position)}}),this.distantKeys=c;for(const[h,u]of[[this.instances,this.renderedCells],[this.distantInstances,this.distantCells]])for(const d of h)d.count=u.length,d.instanceMatrix.clearUpdateRanges(),d.count&&d.instanceMatrix.addUpdateRange(0,d.count*16),d.instanceMatrix.needsUpdate=!0,d.boundingSphere=null}cellFromHit(e){if(e.instanceId!==void 0)return(this.distantInstances.includes(e.object)?this.distantCells:this.renderedCells)[e.instanceId];if(e.object.userData.archiveCell)return e.object.userData.archiveCell;let t=e.object;for(;t&&t!==this;){if(t.userData.archiveCard)return t.userData.archiveCard.cell;t=t.parent}}}function ML(s,e,t,n){const i=t.detail,r=new P(0,-.4,-1),a=new P(...t.position(t.selected));a.y+=.12,r.lerp(a,i);const o=new P(-.64-.25*(1-t.reveal),.55,.53).normalize().lerp(new P(-.277,.238,.931).normalize(),i).normalize(),l=en.lerp(Math.max(16,15/s.aspect),Math.max(6.2,6/s.aspect),i)/(2*Math.tan(en.degToRad(34/2))),h=r.clone().addScaledVector(o,l),u=t.reduced?1:1-Math.exp(-n*5);s.position.y+=r.y-e.y,e.y=r.y,s.position.lerp(h,u),e.lerp(r,u),s.lookAt(e),s.updateMatrixWorld()}const SL=new Gs(-1,1,1,-1,0,1);class bL extends Ut{constructor(){super(),this.setAttribute("position",new Rt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Rt([0,2,0,0,2,0],2))}}const EL=new bL;class TL{constructor(e){this._mesh=new Ge(EL,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,SL)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}const AL=new Set(["petals","stamens","pedicels","stem"]);class wL{scene=new fl;flowers=new Map;bounds=new Mt;root;white=new Tn({color:16777215,side:Gt,toneMapped:!1});covers=new Map;box=new Mt;sync(e,t=[]){if(e!==this.root){for(const i of this.flowers.values())this.scene.remove(i);this.flowers.clear(),this.root=e,e?.traverse(i=>{if(!(i instanceof Ge)||!AL.has(i.userData.assemblyPart))return;const r=new Ge(i.geometry,this.white);r.matrixAutoUpdate=!1,this.flowers.set(i,r),this.scene.add(r)})}this.bounds.makeEmpty();for(const[i,r]of this.flowers)i.updateWorldMatrix(!0,!1),r.matrix.copy(i.matrixWorld),r.matrixWorldNeedsUpdate=!0,i.geometry.boundingBox||i.geometry.computeBoundingBox(),this.box.copy(i.geometry.boundingBox).applyMatrix4(i.matrixWorld),this.bounds.union(this.box);const n=new Set(t);for(const[i,r]of this.covers)n.has(i)||(this.scene.remove(r),r.material.dispose(),this.covers.delete(i));for(const i of t){let r=this.covers.get(i);r||(r=new Ge(i.geometry,new Tn({color:0,transparent:!0,depthWrite:!1,toneMapped:!1,side:fn})),r.matrixAutoUpdate=!1,this.covers.set(i,r),this.scene.add(r)),i.updateWorldMatrix(!0,!1),r.matrix.copy(i.matrixWorld),r.matrixWorldNeedsUpdate=!0,r.visible=i.visible,r.material.opacity=i.material.opacity*.8}}dispose(){this.sync(void 0),this.white.dispose()}}const CL=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,RL=`
uniform sampler2D tScene;
uniform sampler2D tSceneDepth;
uniform sampler2D tFlower;
uniform sampler2D tFlowerDepth;
uniform vec2 uResolution;
uniform vec4 uBounds;
uniform vec4 uMaskRect;
uniform float uTime;
uniform float uAge;
uniform float uFault;
uniform float uDistortion;
uniform float uSeed;
uniform float uStrength;
uniform float uCyan;
uniform float uMotion;
varying vec2 vUv;

float signalHash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float signalNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(signalHash(i), signalHash(i + vec2(1.0, 0.0)), f.x),
    mix(signalHash(i + vec2(0.0, 1.0)), signalHash(i + vec2(1.0)), f.x), f.y);
}
float flowerCoverage(vec2 uv) {
  vec2 maskUV = (uv - uMaskRect.xy) / uMaskRect.zw;
  if (any(lessThan(maskUV, vec2(0.0))) || any(greaterThan(maskUV, vec2(1.0)))) return 0.0;
  float coverage = texture2D(tFlower, maskUV).r;
  float flowerDepth = texture2D(tFlowerDepth, maskUV).r;
  float sceneDepth = texture2D(tSceneDepth, uv).r;
  // Reject flower pixels hidden by another specimen, the frame, or the floor.
  return coverage * (1.0 - step(0.000003, flowerDepth - sceneDepth));
}
float signalBox(vec2 uv, vec2 center, vec2 halfSize) {
  vec2 edge = smoothstep(halfSize, halfSize + vec2(0.07), abs(uv - center));
  return (1.0 - edge.x) * (1.0 - edge.y);
}
float signalDigit(vec2 uv, float digit) {
  float zero = signalBox(uv, vec2(0.5), vec2(0.25, 0.38)) -
    signalBox(uv, vec2(0.5), vec2(0.12, 0.25));
  float one = max(signalBox(uv, vec2(0.5), vec2(0.07, 0.38)),
    signalBox(uv, vec2(0.5, 0.17), vec2(0.22, 0.05)));
  return mix(zero, one, digit);
}
void main() {
  vec4 sceneColor = texture2D(tScene, vUv);
  vec3 result = sceneColor.rgb;
  float alpha = sceneColor.a;
  vec2 pixel = 1.0 / uResolution;
  vec2 flowerSize = max(uBounds.zw, pixel);
  vec2 center = uBounds.xy + flowerSize * vec2(0.5, 0.55);
  vec2 radius = flowerSize * vec2(0.68, 0.58) + pixel * 24.0;
  vec2 fieldUV = (vUv - center) / radius;
  float field = 1.0 - smoothstep(0.55, 1.35, length(fieldUV));

  // The field includes air around the specimen. Warp the rendered image first,
  // so the actual silhouette, nearby glass and background bend together.
  if (field > 0.001) {
    float strength = field * uStrength;
    float tick = floor(uTime * 10.0);
    float band = floor((vUv.y - center.y) * uResolution.y / 11.0);
    float bandSeed = signalHash(vec2(band + uSeed, tick));
    float tear = step(0.73, bandSeed) *
      (signalHash(vec2(band + uSeed, tick + 23.0)) * 2.0 - 1.0) * uFault;
    vec2 local = (vUv - uBounds.xy) / flowerSize;
    // Screen UV runs bottom to top. Independent columns descend at different
    // phases, carrying fragments through the flower and into the surrounding air.
    vec2 cells = max(uBounds.zw * uResolution / vec2(10.0, 13.0), vec2(12.0, 16.0));
    vec2 packetUV = vec2(local.x, 1.0 - local.y) * cells;
    float column = floor(packetUV.x);
    float columnSeed = signalHash(vec2(column, uSeed));
    float cycle = fract(uTime * (0.10 + columnSeed * 0.065) + columnSeed);
    float leadY = cycle * (cells.y + 18.0) - 7.0;
    float behind = leadY - packetUV.y;
    float packet = smoothstep(-0.2, 0.45, behind) * (1.0 - smoothstep(2.0, 9.0, behind));
    float lane = step(0.53, columnSeed);
    float head = 1.0 - smoothstep(0.0, 1.4, max(0.0, behind));
    float dropout = packet * lane * uMotion;
    float bend = sin(fieldUV.y * 5.5 + uTime * 1.65 + uSeed) *
      (0.65 + 0.35 * cos(fieldUV.x * 3.0 - uTime));
    float reach = clamp(flowerSize.x * uResolution.x * 0.09, 16.0, 46.0);
    vec2 offset = vec2(
      bend * 2.0 * uDistortion +
        tear * reach + dropout * (columnSeed - 0.5) * 5.0 * uDistortion,
      sin(fieldUV.x * 5.0 - uTime * 1.1) * 0.7 * uDistortion +
        tear * 3.0 + dropout * 3.5 * uDistortion
    ) * pixel * strength;
    vec2 sourceUV = clamp(vUv + offset, pixel * 0.5, 1.0 - pixel * 0.5);
    vec4 warped = texture2D(tScene, sourceUV);
    result = warped.rgb;
    alpha = warped.a;

    // Separate the channels along the tear, including at the flower's edge.
    vec2 separation = vec2((1.1 + 7.0 * uFault) * uDistortion, 0.4 * uFault) * pixel * strength;
    vec3 split = vec3(
      texture2D(tScene, clamp(sourceUV + separation, pixel * 0.5, 1.0 - pixel * 0.5)).r,
      warped.g,
      texture2D(tScene, clamp(sourceUV - separation, pixel * 0.5, 1.0 - pixel * 0.5)).b
    );
    result = mix(result, split, uDistortion * 0.8);

    float coverage = flowerCoverage(sourceUV) * uStrength;
    float digit = step(0.5, signalHash(vec2(column + uSeed, floor(packetUV.y) + floor(uTime * 2.0))));
    float stream = signalDigit(vec2(fract(packetUV.x), 1.0 - fract(packetUV.y)), digit) * dropout;

    if (coverage > 0.001) {
      vec2 inkUV = local * vec2(4.0, 3.2) + uSeed;
      float warp = signalNoise(inkUV * 1.7 + vec2(uTime * 0.055, -uTime * 0.025));
      float ink = signalNoise(inkUV * 2.4 + warp * 1.4) * 0.68 + signalNoise(inkUV * 5.9 - warp) * 0.32;
      float frontier = 0.18 + 0.64 * (1.0 - exp(-uAge * 0.45));
      float wet = 1.0 - smoothstep(frontier - 0.04, frontier + 0.065, 1.0 - local.y + (ink - 0.5) * 0.33);
      float stain = wet * smoothstep(0.33, 0.68, ink);
      result = mix(result, mix(vec3(0.34, 0.003, 0.018), vec3(0.003, 0.28, 0.3), uCyan), stain * 0.3 * coverage);
    }

    // Detached signal fragments sample visible source flower pixels, but their
    // destination may lie outside the silhouette. Foreground occlusion remains
    // part of the source mask; no extra scene render or history buffer is needed.
    vec3 signalColor = mix(vec3(1.35, 0.035, 0.1), vec3(0.015, 0.95, 1.25), uCyan);
    // A lost packet briefly holds a coarse tile; the rest stays sharply resolved.
    vec2 rasterUV = (floor(sourceUV * uResolution / vec2(4.0, 3.0)) + 0.5) * vec2(4.0, 3.0) * pixel;
    vec3 raster = texture2D(tScene, clamp(rasterUV, pixel * 0.5, 1.0 - pixel * 0.5)).rgb;
    result = mix(result, raster, dropout * head * uFault * strength * 0.52);
    float echo = 0.0;
    if (uFault > 0.001) {
      float fragment = step(0.56, signalHash(vec2(band + 7.0, tick + uSeed)));
      float direction = bandSeed > 0.5 ? 1.0 : -1.0;
      vec2 echoUV = sourceUV + vec2(direction * reach * (0.55 + uFault), 4.0 + dropout * 9.0) * pixel;
      echo = flowerCoverage(echoUV) * fragment * uFault * strength * (1.0 - coverage * 0.8);
      vec3 echoColor = texture2D(tScene, clamp(echoUV, pixel * 0.5, 1.0 - pixel * 0.5)).rgb;
      float echoLuma = dot(echoColor, vec3(0.2126, 0.7152, 0.0722));
      result += (echoColor * 0.32 + signalColor * (0.2 + echoLuma)) * echo * 0.58;
    }

    vec3 streamColor = mix(vec3(2.2, 0.09, 0.065), vec3(0.01, 0.95, 1.2), uCyan);
    vec3 headColor = mix(vec3(3.0, 1.4, 0.95), vec3(0.25, 1.6, 1.8), uCyan);
    float stray = (1.0 - coverage) * step(0.72, columnSeed) *
      (0.16 + uFault * 0.16) * strength;
    result += mix(streamColor, headColor, head * 0.45) * stream * (coverage * 0.5 + stray);
    float hairline = pow(0.5 + 0.5 * sin(vUv.y * uResolution.y * 1.6), 14.0);
    result += signalColor * hairline * abs(tear) * strength * 0.11;
    // Emitted fragments also remain visible against the transparent scene sky.
    alpha = max(alpha, clamp(echo * 0.5 + stream * stray * 0.65, 0.0, 1.0));
  }
  gl_FragColor = vec4(result, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function PL(s,e,t){e.matrixAutoUpdate=!1,e.matrixWorldAutoUpdate=!1,e.matrixWorld.copy(s.matrixWorld),e.matrixWorldInverse.copy(s.matrixWorldInverse),e.projectionMatrix.makeScale(1/t.z,1/t.w,1),e.projectionMatrix.setPosition((1-2*t.x-t.z)/t.z,(1-2*t.y-t.w)/t.w,0),e.projectionMatrix.multiply(s.projectionMatrix),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}class DL{mask=new wL;uniforms={tScene:{value:null},tSceneDepth:{value:null},tFlower:{value:null},tFlowerDepth:{value:null},uResolution:{value:new Ee(1,1)},uBounds:{value:new at},uMaskRect:{value:new at(0,0,1,1)},uTime:{value:0},uAge:{value:0},uFault:{value:0},uDistortion:{value:0},uSeed:{value:0},uStrength:{value:0},uCyan:{value:0},uMotion:{value:1}};sceneTarget=new tn(1,1,{type:Cn});maskTarget=new tn(1,1);material=new Ln({name:"LycorisFlowerPost",uniforms:this.uniforms,vertexShader:CL,fragmentShader:RL,depthTest:!1,depthWrite:!1,blending:An});quad=new TL(this.material);state;root;activity=0;age=0;time=0;point=new P;clearColor=new Ae;maskCamera=new xl;constructor(){for(const e of[this.sceneTarget,this.maskTarget])e.depthTexture=new Ji(1,1,pn),e.samples=4;this.uniforms.tScene.value=this.sceneTarget.texture,this.uniforms.tSceneDepth.value=this.sceneTarget.depthTexture,this.uniforms.tFlower.value=this.maskTarget.texture,this.uniforms.tFlowerDepth.value=this.maskTarget.depthTexture}setSize(e,t){this.sceneTarget.setSize(e,t),(e!==this.uniforms.uResolution.value.x||t!==this.uniforms.uResolution.value.y)&&this.maskTarget.setSize(1,1),this.uniforms.uResolution.value.set(e,t)}setSamples(e){for(const t of[this.sceneTarget,this.maskTarget])t.samples!==e&&(t.samples=e,t.dispose())}update(e,t,n,i,r=[],a=t?.cyan??!1,o=0){this.uniforms.uCyan.value=a?1:0,this.uniforms.uMotion.value=i?0:1,this.mask.sync(e,r),(t!==this.state||e!==this.root)&&(this.state=t,this.root=e,this.age=0),i||(this.time+=n,this.age+=n);const c=(this.age+.6)%3.7;this.activity+=(en.clamp(o,0,1)-this.activity)*(1-Math.exp(-Math.max(0,n)*9)),this.uniforms.uTime.value=i?0:this.time,this.uniforms.uAge.value=i?4:this.age,this.uniforms.uFault.value=i?0:Math.max(Math.exp(-this.age*3.6),c<.23?Math.sin(c/.23*Math.PI)*.65:0,this.activity*.7),this.uniforms.uDistortion.value=i?0:.16+this.uniforms.uFault.value*.84,this.uniforms.uSeed.value=t?.uniforms[0].uArchiveSeed.value??0,this.uniforms.uStrength.value=e?t?.amount??1:0}render(e,t,n){if(this.mask.bounds.isEmpty()||this.uniforms.uStrength.value<.001){e.render(t,n);return}const i=this.mask.bounds;let r=1/0,a=1/0,o=-1/0,c=-1/0,l=!1;n.updateMatrixWorld();for(const v of[i.min.x,i.max.x])for(const b of[i.min.y,i.max.y])for(const T of[i.min.z,i.max.z])this.point.set(v,b,T).applyMatrix4(n.matrixWorldInverse),l||=this.point.z>=-.01,this.point.applyMatrix4(n.projectionMatrix),r=Math.min(r,this.point.x*.5+.5),a=Math.min(a,this.point.y*.5+.5),o=Math.max(o,this.point.x*.5+.5),c=Math.max(c,this.point.y*.5+.5);this.uniforms.uBounds.value.set(r,a,o-r,c-a),l&&(r=a=0,o=c=1);const{x:h,y:u}=this.uniforms.uResolution.value,d=Math.max(0,Math.floor(r*h)-10),f=Math.max(0,Math.floor(a*u)-10),g=Math.min(h,Math.ceil(o*h)+10),_=Math.min(u,Math.ceil(c*u)+10);if(g<=d||_<=f){e.render(t,n);return}const m=Math.min(h,Math.ceil((g-d)/64)*64),p=Math.min(u,Math.ceil((_-f)/64)*64);(m>this.maskTarget.width||p>this.maskTarget.height||m<this.maskTarget.width/2||p<this.maskTarget.height/2)&&this.maskTarget.setSize(m,p),this.uniforms.uMaskRect.value.set(Math.min(d,h-this.maskTarget.width)/h,Math.min(f,u-this.maskTarget.height)/u,this.maskTarget.width/h,this.maskTarget.height/u),PL(n,this.maskCamera,this.uniforms.uMaskRect.value);const M=e.getRenderTarget(),E=e.getClearAlpha();e.getClearColor(this.clearColor),e.setRenderTarget(this.sceneTarget),e.render(t,n),e.setClearColor(0,0),e.setRenderTarget(this.maskTarget),e.render(this.mask.scene,this.maskCamera),e.setClearColor(this.clearColor,E),e.setRenderTarget(M),this.quad.render(e)}dispose(){this.mask.dispose(),this.sceneTarget.dispose(),this.maskTarget.dispose(),this.material.dispose(),this.quad.dispose()}}function IL(s,e,t){if(t.isEmpty())return;const n=t.getCenter(new P),i=s.position.clone().sub(e).normalize(),r=new P(1,0,0).applyQuaternion(s.quaternion),a=new P(0,1,0).applyQuaternion(s.quaternion),o=Math.tan(en.degToRad(s.fov/2))/1.18,c=o*s.aspect;let l=s.position.distanceTo(e);for(const h of[t.min.x,t.max.x])for(const u of[t.min.y,t.max.y])for(const d of[t.min.z,t.max.z]){const f=new P(h,u,d).sub(n),g=f.dot(i);l=Math.max(l,g+Math.abs(f.dot(r))/c,g+Math.abs(f.dot(a))/o)}e.copy(n),s.position.copy(n).addScaledVector(i,l),s.lookAt(e),s.updateMatrixWorld()}const _h=(s,e,t,n=5)=>en.lerp(s,e,1-Math.exp(-n*t));class NL{constructor(e){this.host=e,this.renderer=new p2({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75)),this.renderer.transmissionResolutionScale=.75,this.renderer.setClearColor(593168,0),this.renderer.toneMapping=Jo,this.renderer.toneMappingExposure=1.25,this.renderer.outputColorSpace=xt;const t=this.renderer.domElement;t.setAttribute("aria-label","石蒜档案阵列，点击选择，双击抽取检视"),t.setAttribute("role","img"),e.appendChild(t);const n=new Bo(this.renderer),i=new hL;this.environment=n.fromScene(i,.04),this.scene.environment=this.environment.texture,i.dispose(),n.dispose(),this.scene.environmentIntensity=.6,this.scene.fog=new dl(593168,29,52),this.scene.add(new Qf(10993880,2630435,1.6));const r=new wr(16774131,3.2);r.position.set(3,6,5);const a=new wr(16763861,1.2);a.position.set(-4,3,-3);const o=new wr(15201005,1.8);o.position.set(-3,1,4),this.scene.add(r,a,o),this.camera.position.set(-16.8,14,14.5),this.camera.lookAt(this.cameraAim),this.controls=new Z2(this.camera,t),this.controls.enableDamping=!0,this.controls.dampingFactor=.065,this.controls.minDistance=4.2,this.controls.maxDistance=22,this.controls.maxPolarAngle=Math.PI*.92,this.controls.enabled=!1,this.controls.enablePan=!1,this.controls.addEventListener("change",this.invalidate);const c=new Ge(new Qi(160,160),bs(new xi({color:659476,roughness:.82,metalness:.25})));c.rotation.x=-Math.PI/2,c.position.y=-5.45;const l=new xp(120,60,2633780,1515814);bs(l.material),l.position.y=-5.43,this.ground.add(c,l),this.scene.add(this.ground),this.ring=new jh(new Ut().setFromPoints(Array.from({length:96},(h,u)=>new P(1.93*Math.cos(u/96*Math.PI*2),0,1.93*Math.sin(u/96*Math.PI*2)))),bs(new zr({color:14376017,transparent:!0,opacity:.65}))),this.scene.add(this.ring),this.labelMaterial=this.createLabels(),this.inspector.visible=!1,this.scene.add(this.inspector),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.intersectionObserver=new IntersectionObserver(([h])=>{this.inViewport=h.isIntersecting,this.inViewport&&this.invalidate()},{rootMargin:"64px"}),this.intersectionObserver.observe(e),document.addEventListener("visibilitychange",this.invalidate),this.bindPointer(),this.ready=this.load(),this.renderer.setAnimationLoop(()=>this.frame())}host;renderer;scene=new fl;camera=new Bt(34,1,.1,150);controls;ready;motion=new pL;mode="archive";reducedMotion=!1;get reduced(){return this.reducedMotion}set reduced(e){this.reducedMotion!==e&&(this.reducedMotion=e,this.invalidate())}autorotate=!1;onSelect;onOpen;onReady;onPhaseChange;archive;flowerPost=new DL;quality=new vL(navigator.hardwareConcurrency,navigator.deviceMemory);inspector=new Kt;inspectorMaterials=[];exploded=new Set;partMeshes=[];raycaster=new gp;pointerDown={x:0,y:0};lastPointerX=0;dragging=!1;clock=new Lp;cameraAim=new P(0,-.4,-1);temp=new P;resizeObserver;intersectionObserver;inViewport=!0;disposed=!1;presented=!1;get hasPresentedScene(){return this.presented}needsRender=!0;invalidate=()=>{this.needsRender=!0};ground=new Kt;ring;labelMaterial;labelGeometries=[];environment;lastPhase="";inspectorRotation=.3;inspectorTarget=.3;archiveCamera;createLabels(){const e=document.createElement("canvas");e.width=2048,e.height=640;const t=e.getContext("2d");for(let i=0;i<hn.length;i++){const r=i%8*256,a=Math.floor(i/8)*128;t.fillStyle="#161e21",t.fillRect(r,a,256,128),t.fillStyle="#ee5d55",t.fillRect(r+12,a+12,7,104),t.fillStyle="#ced4ce",t.font="bold 39px monospace",t.fillText(hn[i].id,r+31,a+64),t.fillStyle="#95a3a4",t.font="16px monospace",t.fillText("LYCORIS / ARCHIVE",r+31,a+99);const o=new Qi(1.05,.525),c=o.attributes.uv;for(let l=0;l<c.count;l++)c.setXY(l,(c.getX(l)+i%8)/8,(c.getY(l)+4-Math.floor(i/8))/5);this.labelGeometries.push(o)}const n=new Cf(e);return n.colorSpace=xt,n.anisotropy=this.renderer.capabilities.getMaxAnisotropy(),bs(new Tn({map:n,side:Gt,toneMapped:!1}))}async load(){const e=new g2,t=await e.loadAsync("/assets/lycoris-specimen.glb?v=photo-study-04");if(this.disposed){this.disposeSource(t.scene);return}t.scene.traverse(n=>{if(!(n instanceof Ge))return;const i=Array.isArray(n.material)?n.material:[n.material];for(const r of i)r instanceof xi&&(r.envMapIntensity=.7,/Petals|Scarlet|Filaments|Anthers|Green_Scape/.test(r.name)&&(r.metalness=0,r.envMapIntensity=.2),r.name.includes("Glass")&&(r.transparent=!0,r.opacity=.018,r.depthWrite=!1,r.side=Gt),/Petals|Scarlet/.test(r.name)&&(r.side=Gt))}),this.archive=new yL(t.scene,n=>{const i=new Ge(this.labelGeometries[n],this.labelMaterial);return i.position.set(0,-1.57,.93),i}),this.motion.setBounds(this.archive.bounds.min.y,this.archive.bounds.max.y),this.scene.add(this.archive),this.inspector.add(t.scene),t.scene.traverse(n=>{if(!(n instanceof Ge))return;const i=r=>{const a=bs(r.clone());return this.inspectorMaterials.push({material:a,originalColor:a.color.clone(),transmission:a instanceof Wt?a.transmission:0,part:n.userData.assemblyPart}),a};n.material=Array.isArray(n.material)?n.material.map(i):i(n.material),this.partMeshes.push({mesh:n,part:n.userData.assemblyPart,origin:n.position.clone(),progress:0})}),this.tintInspector(this.motion.selected.index),this.applyQuality(),this.archive.sync(this.motion),this.resize(),this.onReady?.(),this.loadDistant(e)}async loadDistant(e){const t=await e.loadAsync("/assets/lycoris-distant.glb?v=photo-study-04-lod1").catch(()=>{});t&&(this.disposed||(this.archive.setDistantSource(t.scene),this.invalidate()),this.disposeSource(t.scene))}disposeSource(e){e.traverse(t=>{if(t instanceof Ge){t.geometry.dispose();for(const n of Array.isArray(t.material)?t.material:[t.material])n.dispose()}})}bindPointer(){const e=this.renderer.domElement;e.addEventListener("pointerdown",t=>{this.pointerDown={x:t.clientX,y:t.clientY},this.lastPointerX=t.clientX,this.dragging=t.button===0&&this.mode==="detail"&&this.motion.canRotate,this.dragging&&e.setPointerCapture(t.pointerId)}),e.addEventListener("pointermove",t=>{this.dragging&&t.buttons===1&&this.motion.canRotate&&(this.motion.rotationTarget+=(t.clientX-this.lastPointerX)*.008,this.invalidate()),this.lastPointerX=t.clientX}),e.addEventListener("pointerup",t=>{if(this.dragging=!1,e.hasPointerCapture(t.pointerId)&&e.releasePointerCapture(t.pointerId),this.mode!=="archive"||t.button!==0||Math.hypot(t.clientX-this.pointerDown.x,t.clientY-this.pointerDown.y)>5)return;const n=this.pick(t);n&&this.onSelect?.(Sl(n),{...n})}),e.addEventListener("pointercancel",()=>{this.dragging=!1}),e.addEventListener("dblclick",t=>{this.mode==="archive"&&this.pick(t)&&this.onOpen?.()})}pick(e){if(!this.archive||!this.archive.visible)return;const t=this.renderer.domElement.getBoundingClientRect();this.raycaster.setFromCamera(new Ee((e.clientX-t.left)/t.width*2-1,-(e.clientY-t.top)/t.height*2+1),this.camera);const n=this.archive.shells.filter(r=>r.visible);for(const r of this.archive.models.values())n.push(r);const i=this.raycaster.intersectObjects(n,!0)[0];return i?this.archive.cellFromHit(i):void 0}resize(e=!0){this.invalidate();const t=this.host.clientWidth,n=this.host.clientHeight;if(!t||!n)return;this.renderer.setPixelRatio(xL(this.quality.profile,t,n,devicePixelRatio)),this.renderer.setSize(t,n);const i=this.renderer.getDrawingBufferSize(new Ee);this.flowerPost.setSize(i.x,i.y),this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.mode==="inspect"&&e&&this.fitInspector()}revealScene(){this.motion.revealScene(),this.invalidate()}hideScene(){this.presented=!1,this.motion.revealTarget=0,this.invalidate()}flowerScreenAnchor(){const e=this.archive?.models.get(this.motion.selected);if(!e||!this.archive?.visible)return;e.updateWorldMatrix(!0,!0);const t=new Mt;if(e.traverse(a=>{a instanceof Ge&&["petals","stamens","pedicels"].includes(a.userData.assemblyPart)&&t.union(new Mt().setFromObject(a))}),t.isEmpty())return;const n=new _p;for(const a of[t.min.x,t.max.x])for(const o of[t.min.y,t.max.y])for(const c of[t.min.z,t.max.z]){const l=new P(a,o,c).project(this.camera);n.expandByPoint(new Ee(l.x,l.y))}const i=this.host.getBoundingClientRect(),r=n.getCenter(new Ee);return{x:i.left+(r.x+1)*i.width/2,y:i.top+(1-r.y)*i.height/2,width:(n.max.x-n.min.x)*i.width/2}}tintInspector(e){for(const t of this.inspectorMaterials)t.material.color.copy(t.originalColor),hn[e]?.flowerColor==="cyan"&&fu(t.material,t.part)}select(e,t,n){this.motion.select({lane:t,row:n}),this.tintInspector(e),this.invalidate()}setMode(e){if(this.mode!==e){if(this.invalidate(),e==="inspect"){this.tintInspector(this.motion.selected.index),this.archiveCamera={position:this.camera.position.clone(),aim:this.cameraAim.clone(),fov:this.camera.fov},this.exploded.clear();for(const t of this.partMeshes)t.progress=0,t.mesh.position.copy(t.origin);this.mode=e,this.controls.enabled=!0,this.controls.enablePan=!0,this.resetView()}else this.controls.enabled=!1,this.controls.enablePan=!1,this.mode==="inspect"&&this.archiveCamera&&(this.camera.position.copy(this.archiveCamera.position),this.cameraAim.copy(this.archiveCamera.aim),this.camera.fov=this.archiveCamera.fov,this.camera.lookAt(this.cameraAim),this.camera.updateProjectionMatrix(),this.archiveCamera=void 0),this.mode=e,this.motion.setDetail(e==="detail"),e==="archive"&&(this.autorotate=!1);this.dragging=!1,this.inspector.visible=e==="inspect",this.ground.visible=e!=="inspect",this.ring.visible=e!=="inspect",this.archive&&(this.archive.visible=e!=="inspect"&&this.motion.reveal>.001)}}setExploded(e){this.invalidate(),this.exploded=new Set(e),this.mode==="inspect"&&e.length&&this.fitInspector()}fitInspector(){this.inspector.updateWorldMatrix(!0,!0);const e=new Mt;for(const t of this.partMeshes){const n=new Mt().setFromObject(t.mesh);e.union(n);const i=t.origin.clone(),r=Bl.find(o=>o.id===t.part);r&&this.exploded.has(t.part)&&i.add(new P().fromArray(r.offset));const a=i.sub(t.mesh.position).applyMatrix3(new Ue().setFromMatrix4(t.mesh.parent.matrixWorld));e.union(n.translate(a))}IL(this.camera,this.controls.target,e),this.controls.maxDistance=Math.max(22,this.camera.position.distanceTo(this.controls.target)*1.3),this.controls.update()}getExploded(){return[...this.exploded]}rotate(e){this.invalidate(),this.mode==="inspect"?this.inspectorTarget+=e:this.motion.canRotate&&(this.motion.rotationTarget+=e)}resetView(){if(this.invalidate(),this.mode!=="inspect"){this.motion.rotationTarget=0;return}this.camera.position.set(5.3,2.5,9.8),this.camera.fov=34,this.camera.updateProjectionMatrix(),this.controls.target.set(0,0,0),this.controls.update(),this.inspectorRotation=this.inspectorTarget=.3,this.inspector.rotation.y=.3,this.fitInspector()}zoom(e){this.invalidate(),this.temp.copy(this.camera.position).sub(this.controls.target).multiplyScalar(e>0?.85:1.18).clampLength(this.controls.minDistance,this.controls.maxDistance),this.camera.position.copy(this.controls.target).add(this.temp),this.controls.update()}pan(e,t){this.invalidate();const n=new P().setFromMatrixColumn(this.camera.matrix,0).multiplyScalar(e*.18),i=new P().setFromMatrixColumn(this.camera.matrix,1).multiplyScalar(t*.18);n.add(i),this.camera.position.add(n),this.controls.target.add(n),this.controls.update()}setQuality(e){this.quality.setEnabled(e),this.applyQuality()}applyQuality(){const e=this.quality.profile;this.renderer.transmissionResolutionScale=e.transmission,this.flowerPost.setSamples(e.samples),this.archive?.setQuality(e);for(const t of this.inspectorMaterials){if(!(t.material instanceof Wt))continue;const n=e.transmission===0?0:t.transmission;t.material.transmission!==n&&(t.material.transmission=n,t.material.needsUpdate=!0)}this.host.dataset.renderQuality=e.name,this.resize(!1)}frame(){const e=this.clock.getDelta(),t=Math.min(e,.05);if(document.hidden||!this.inViewport||!this.archive||!this.needsRender&&(this.reduced&&(this.mode==="inspect"||!this.motion.transitioning)||this.mode!=="inspect"&&this.motion.revealTarget===0&&this.motion.reveal<.001))return;if(!this.reduced&&this.quality.sample(e)&&this.applyQuality(),this.needsRender=!1,this.motion.reduced=this.reduced,this.mode==="inspect"){this.archive.visible=!1,this.autorotate&&!this.reduced&&(this.inspectorTarget+=t*.17),this.inspectorRotation=this.reduced?this.inspectorTarget:_h(this.inspectorRotation,this.inspectorTarget,t),this.inspector.rotation.y=this.inspectorRotation;for(const a of this.partMeshes){const o=this.exploded.has(a.part)?1:0;a.progress=this.reduced?o:_h(a.progress,o,t,3.7);const c=Bl.find(l=>l.id===a.part);c&&a.mesh.position.copy(a.origin).addScaledVector(this.temp.fromArray(c.offset),a.progress)}this.controls.update();const r=this.scene.fog;r.near=35,r.far=70}else{this.autorotate&&!this.reduced&&this.motion.canRotate&&(this.motion.rotationTarget+=t*.22),this.motion.step(t),this.updateArchiveCamera(t),this.archive.sync(this.motion,this.camera,this.scene.fog),this.ring.visible=this.motion.reveal>.05,this.ring.position.set(...this.motion.slotPosition(this.motion.selected.cell)),this.ring.position.y+=this.archive.bounds.min.y-.02;const r=this.motion.phase,a=r+":"+this.reduced;a!==this.lastPhase&&(this.lastPhase=a,this.host.dataset.inspection=r,this.host.dataset.motion=this.reduced?"reduced":"full",this.renderer.domElement.style.cursor=this.motion.canRotate?"grab":"pointer",this.onPhaseChange?.(r))}const n=this.mode==="inspect"?this.inspector:this.archive.visible?this.archive.models.get(this.motion.selected):void 0,i=this.mode==="inspect"?[]:this.archive.shells.filter(r=>r.visible);if(this.mode!=="inspect")for(const r of this.archive.models.values())for(const a of r.children)a instanceof Ge&&!Array.isArray(a.material)&&a.material.name.includes("Glass")&&i.push(a);this.flowerPost.update(n,this.archive.surfaces.get(this.motion.selected),t,this.reduced,i,hn[this.motion.selected.index]?.flowerColor==="cyan",this.mode==="inspect"?Math.max(Math.abs(this.inspectorTarget-this.inspectorRotation),this.partMeshes.reduce((r,a)=>Math.max(r,Math.abs((this.exploded.has(a.part)?1:0)-a.progress)),0)):Math.abs(this.motion.selected.lift.velocity)*.2+Math.abs(this.motion.trackLane.velocity)*.3+Math.abs(this.motion.trackRow.velocity)*.3+Math.abs(this.motion.rotationTarget-this.motion.selected.rotation)*.25),this.flowerPost.render(this.renderer,this.scene,this.camera),this.motion.revealTarget>0&&this.archive.visible&&(this.presented=!0)}updateArchiveCamera(e){ML(this.camera,this.cameraAim,this.motion,e);const t=this.motion.detail,n=this.camera.position.distanceTo(this.cameraAim),i=this.scene.fog;i.near=n+en.lerp(-3,-2,t),i.far=n+en.lerp(18,15,t)}dispose(){this.disposed=!0,this.renderer.setAnimationLoop(null),this.controls.dispose(),this.resizeObserver.disconnect(),this.intersectionObserver.disconnect(),document.removeEventListener("visibilitychange",this.invalidate),this.labelMaterial.map?.dispose(),this.labelMaterial.dispose();for(const n of this.labelGeometries)n.dispose();const e=new Set,t=new Set;this.scene.traverse(n=>{if(n instanceof Ge||n instanceof Vr){e.add(n.geometry);for(const i of Array.isArray(n.material)?n.material:[n.material])t.add(i)}});for(const n of e)n.dispose();for(const n of t)n.dispose();this.environment.dispose(),this.flowerPost.dispose(),this.renderer.dispose()}}class UL{constructor(e){this.host=e,this.value=e.textContent??"",this.text=document.createElement("span"),this.text.textContent=this.value,e.replaceChildren(this.text),e.classList.add("scrub-title")}host;text;value;lastChange=-1/0;timer;animation;obscured=!1;update(e,t){if(!t){this.reset(),this.value=this.text.textContent=e,this.lastChange=-1/0;return}if(e===this.value)return;const n=performance.now(),i=n-this.lastChange<240;if(this.lastChange=n,this.value=e,clearTimeout(this.timer),!this.obscured&&!i){this.text.textContent=e;return}this.obscured||(this.host.style.width=`${Math.max(88,this.host.offsetWidth)}px`,this.obscured=!0,this.host.dataset.scrubbing="true",this.text.style.opacity="0",this.animation?.cancel(),this.animation=this.text.animate([{opacity:1},{opacity:.28,offset:.35},{opacity:1,offset:.7},{opacity:0}],{duration:140,easing:"steps(1, end)"})),this.text.textContent=e,this.timer=setTimeout(()=>this.reveal(),260)}reveal(){this.animation?.cancel(),this.obscured=!1,delete this.host.dataset.scrubbing,this.host.style.width="",this.text.style.opacity="",this.animation=this.host.animate([{opacity:.2},{opacity:1,offset:.35},{opacity:.5,offset:.6},{opacity:1}],{duration:180,easing:"steps(1, end)"})}reset(){clearTimeout(this.timer),this.animation?.cancel(),this.animation=void 0,this.obscured=!1,delete this.host.dataset.scrubbing,this.host.style.width="",this.text.style.opacity="",this.lastChange=-1/0}}const FL=[".brand b","#record-title","#specimen-code","#record-number",".stage-index","#rail-number",".top-status > span",".category-code",".file-chip.selected > span",".detail-identity h1",".detail-identity .micro",".viewer-record",".viewer-header b",".dialog-header h2","#part-count",".footer time"].join(","),OL=".title-rule, .mini-rule, .chapter-progress, .signal-rule";class BL{constructor(e){this.root=e,this.layer.className="ui-signal-layer",this.layer.setAttribute("aria-hidden","true"),this.downlink.className="ui-downlink",this.downlink.setAttribute("aria-hidden","true"),this.downlink.innerHTML=Ko(4),e.appendChild(this.downlink),e.dataset.uiPaused=String(document.hidden),e.appendChild(this.layer),e.addEventListener("pointerover",this.onInteraction),e.addEventListener("focusin",this.onInteraction),document.addEventListener("lycoris:selection",this.onSelection),document.addEventListener("visibilitychange",this.onVisibility),this.schedule()}root;layer=document.createElement("div");downlink=document.createElement("div");active=new Set;timer;reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;lastInput=-1/0;lastSelection=-1/0;lastTarget;setReduced(e){this.reduced=e,this.root.dataset.uiMotion=e?"reduced":"full",this.stop(),this.schedule()}get paused(){return this.reduced||document.hidden||this.root.inert}available(e){const t=this.root.querySelector("dialog[open]")??this.root;return Array.from(t.querySelectorAll(e)).filter(n=>{const i=n.getBoundingClientRect();return i.width>0&&i.height>0&&i.bottom>0&&i.top<innerHeight&&!n.closest("[inert]")})}schedule(){this.reduced||document.hidden||(this.timer=setTimeout(()=>{if(!this.paused&&this.active.size<2){const e=Math.random()<.24,t=this.available(e?OL:FL).filter(i=>i!==this.lastTarget),n=t[Math.floor(Math.random()*t.length)];n&&(this.lastTarget=n,this.pulse(n,e),Math.random()<.45&&this.scratch(n))}this.schedule()},2100+Math.random()*3200))}track(e,t=()=>{}){this.active.add(e);const n=()=>{this.active.delete(e),t()};e.onfinish=n,e.oncancel=n}pulse(e,t=!1){if(this.paused||this.active.size>=2)return;const i=this.root.dataset.flowerColor==="cyan"?"rgb(93 221 224 / .30)":"rgb(232 97 83 / .28)",r="rgb(139 207 215 / .23)",a=t?[{opacity:1,translate:"0 0",clipPath:"inset(0 0 0 0)"},{opacity:.7,translate:"1px 0",clipPath:"inset(0 16% 0 34%)",offset:.28},{opacity:.9,translate:"-.5px 0",clipPath:"inset(0 7% 0 0)",offset:.54},{opacity:1,translate:"0 0",clipPath:"inset(0 0 0 0)"}]:[{textShadow:"none",translate:"0 0",opacity:1},{textShadow:`.7px 0 ${i}, -.7px 0 ${r}`,translate:"-.35px 0",opacity:.97,offset:.25},{textShadow:`-.5px 0 ${i}, .5px 0 ${r}`,translate:".4px 0",opacity:1,offset:.52},{textShadow:"none",translate:"0 0",opacity:1,offset:.76},{textShadow:".25px 0 "+r,translate:"0 0",opacity:1,offset:.88},{textShadow:"none",translate:"0 0",opacity:1}];this.track(e.animate(a,{duration:140+Math.random()*70,easing:"steps(1,end)"}))}scratch(e){if(this.paused||this.active.size>=4)return;const t=e.getBoundingClientRect(),n=this.root.getBoundingClientRect(),i=document.createElement("span");i.className="ui-signal-fragment",i.style.left=`${Math.max(8,t.left-n.left-24)}px`,i.style.top=`${Math.max(0,t.top-n.top-48)}px`,i.textContent=`4C
59
..
01
↓`,this.layer.appendChild(i),this.track(i.animate([{opacity:0,transform:"translateY(-12px)"},{opacity:.52,transform:"translateY(8px)",offset:.16},{opacity:.26,transform:"translateY(68px)",offset:.66},{opacity:0,transform:"translateY(118px)"}],{duration:1500,easing:"linear"}),()=>i.remove())}onInteraction=e=>{const t=e.target.closest("button, .brand"),n=performance.now();!t||n-this.lastInput<850||this.paused||e instanceof PointerEvent&&t.contains(e.relatedTarget)||(this.lastInput=n,this.pulse(t))};textEcho(e){if(this.paused||this.active.size>=4)return;const t=e.getBoundingClientRect(),n=this.root.getBoundingClientRect(),i=getComputedStyle(e),r=document.createElement("span");r.className="ui-text-echo",r.textContent=e.textContent,Object.assign(r.style,{left:`${t.left-n.left}px`,top:`${t.top-n.top}px`,width:`${t.width}px`,height:`${t.height}px`,font:i.font,letterSpacing:i.letterSpacing,textAlign:i.textAlign,overflowWrap:i.overflowWrap}),this.layer.appendChild(r),this.track(r.animate([{opacity:0,transform:"translate(0,0)",clipPath:"inset(15% 0 68%)"},{opacity:.5,transform:"translate(4px,1px)",clipPath:"inset(15% 0 68%)",offset:.2},{opacity:.3,transform:"translate(-2px,3px)",clipPath:"inset(48% 0 38%)",offset:.45},{opacity:.22,transform:"translate(3px,4px)",clipPath:"inset(75% 0 12%)",offset:.7},{opacity:0,transform:"translate(0,6px)",clipPath:"inset(90% 0 0)"}],{duration:380,easing:"steps(1,end)"}),()=>r.remove())}revealContent(e){this.paused||this.active.size>=4||(this.track(e.animate([{opacity:.25,transform:"translateY(-8px)",clipPath:"inset(0 0 65%)"},{opacity:.82,transform:"translateY(-2px)",clipPath:"inset(0 0 12%)",offset:.5},{opacity:1,transform:"translateY(0)",clipPath:"inset(0)"}],{duration:620,easing:"cubic-bezier(.2,.7,.2,1)"})),this.scratch(e))}onSelection=()=>{const e=performance.now();if(this.paused||e-this.lastSelection<160)return;this.lastSelection=e;for(const n of this.active)n.cancel();const t=this.available("#record-title, .detail-identity h1")[0];t&&(this.pulse(t),this.textEcho(t),this.scratch(t))};onVisibility=()=>{this.root.dataset.uiPaused=String(document.hidden),this.stop(),this.schedule()};stop(){clearTimeout(this.timer),this.timer=void 0;for(const e of this.active)e.cancel();this.active.clear(),this.layer.replaceChildren()}dispose(){this.stop(),this.layer.remove(),this.downlink.remove(),this.root.removeEventListener("pointerover",this.onInteraction),this.root.removeEventListener("focusin",this.onInteraction),document.removeEventListener("lycoris:selection",this.onSelection),document.removeEventListener("visibilitychange",this.onVisibility)}}const kL=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-319.62 -197.74 667.79 325.78" fill="none" aria-hidden="true">\r
<defs><linearGradient id="bloom-petal-ink" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#ffa895"/><stop offset=".32" stop-color="#ff3353"/><stop offset="1" stop-color="#7f122d"/></linearGradient>\r
<radialGradient id="bloom-filament-ink" gradientUnits="userSpaceOnUse" cx="0" cy="45" r="310"><stop class="bloom-ink-core"/><stop class="bloom-ink-middle" offset=".5"/><stop class="bloom-ink-edge" offset="1"/></radialGradient>\r
<filter id="bloom-halo" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>\r
<g id="bloom-umbel"><g><path class="bloom-pedicel" d="M0.00 101.98 C1.54 96.16 6.02 77.59 9.22 67.04 C12.42 56.49 17.54 43.42 19.20 38.70"/><path class="bloom-petal" data-delay="0.210" pathLength="1" d="M19.08 38.82 L19.22 37.31 L19.13 34.88 L18.74 32.09 L18.46 29.20 L18.42 26.33 L19.17 23.82 L20.23 21.57 L20.02 18.66 L19.74 15.90 L20.18 13.53 L20.11 11.01 L19.50 8.43 L18.29 5.90 L15.93 3.70 L14.24 1.72 L13.54 -0.67 L11.78 -2.66 L9.24 -3.74 L6.89 -4.63 L4.58 -5.10 L2.36 -6.06 L-0.20 -8.00 L-2.69 -8.13 L-4.45 -6.53 L-6.52 -6.02 L-8.92 -5.98 L-11.26 -5.67 L-13.76 -5.37 L-14.89 -3.63 L-14.85 -1.09 L-16.30 0.06 L-18.31 0.90 L-18.96 2.60 L-19.04 4.48 L-18.44 6.48 L-17.42 8.41 L-17.58 9.96 L-17.68 11.60 L-16.23 13.24 L-14.51 14.65 L-13.06 15.97 L-11.54 17.15 L-10.08 18.39 L-8.39 19.45 L-6.43 19.91 L-4.56 20.24 L-2.70 20.59 L-0.63 20.43 L-0.40 20.19 L-1.44 19.25 L-2.78 18.31 L-4.26 17.48 L-5.89 16.58 L-7.33 15.11 L-8.59 13.46 L-9.97 11.86 L-11.31 10.12 L-12.96 8.29 L-14.38 6.20 L-14.27 4.09 L-14.12 2.06 L-15.15 -0.36 L-15.77 -2.86 L-15.70 -5.26 L-15.04 -7.47 L-13.00 -8.82 L-11.49 -10.48 L-11.42 -13.49 L-10.14 -15.69 L-7.43 -16.40 L-4.80 -17.08 L-2.05 -17.41 L0.45 -18.14 L2.71 -19.85 L5.75 -19.72 L8.91 -17.66 L11.75 -16.45 L14.66 -15.60 L17.57 -14.23 L20.57 -12.58 L22.68 -9.97 L23.59 -6.93 L25.36 -4.31 L27.65 -1.49 L28.67 1.60 L28.96 4.71 L28.61 7.70 L27.66 10.49 L27.37 13.63 L26.94 16.89 L25.27 19.31 L23.88 21.97 L23.20 25.17 L22.68 28.56 L22.20 32.01 L21.27 35.30 L19.32 38.57 Z"/><path class="bloom-petal" data-delay="0.280" pathLength="1" d="M18.99 38.67 L18.59 35.92 L18.92 32.77 L19.43 29.54 L20.00 26.27 L20.52 22.76 L21.10 19.61 L21.87 17.21 L22.89 14.12 L23.93 10.78 L24.89 6.96 L25.54 2.54 L26.20 -1.45 L27.18 -5.17 L27.90 -9.10 L28.22 -12.77 L28.37 -16.01 L28.16 -18.40 L28.22 -20.94 L28.67 -24.50 L28.41 -26.28 L27.58 -25.91 L26.99 -25.99 L26.43 -26.07 L25.87 -26.20 L25.28 -26.61 L24.39 -24.62 L23.48 -21.06 L22.69 -19.18 L21.84 -17.75 L20.99 -15.35 L20.17 -12.64 L19.55 -9.29 L19.14 -5.92 L18.44 -3.41 L17.63 -0.85 L17.33 1.90 L17.25 4.31 L17.22 6.40 L17.28 8.20 L17.14 10.31 L17.16 12.29 L17.69 13.06 L18.30 13.58 L18.86 14.41 L19.57 14.97 L20.44 15.26 L21.50 15.20 L23.07 15.10 L23.42 15.37 L23.56 16.81 L23.35 17.58 L23.18 17.82 L23.09 17.64 L23.11 17.05 L23.07 16.64 L23.10 15.82 L23.66 13.66 L24.40 11.28 L24.95 9.14 L25.62 6.70 L26.34 3.96 L27.26 0.94 L28.68 -1.82 L29.96 -4.44 L30.90 -7.85 L32.02 -11.15 L33.28 -13.74 L34.51 -15.96 L35.69 -17.16 L36.75 -18.76 L37.87 -22.01 L38.89 -23.69 L39.56 -22.95 L40.15 -22.53 L40.68 -22.18 L41.19 -21.90 L41.89 -22.15 L42.00 -20.35 L41.36 -16.89 L41.11 -14.55 L41.12 -12.46 L40.76 -9.59 L40.21 -6.31 L39.26 -2.79 L38.01 0.55 L37.05 4.21 L36.04 8.34 L34.66 11.92 L33.15 15.07 L31.58 18.02 L30.09 20.46 L28.68 23.71 L27.27 27.22 L25.68 30.40 L23.99 33.47 L22.12 36.40 L19.41 38.73 Z"/><path class="bloom-petal" data-delay="0.350" pathLength="1" d="M19.11 38.52 L20.05 35.14 L21.95 32.20 L24.22 29.30 L26.42 26.45 L28.56 23.65 L30.31 21.01 L31.89 18.47 L34.37 15.65 L36.55 13.01 L38.37 10.37 L40.89 7.68 L43.78 5.17 L46.67 2.89 L49.47 1.02 L52.14 -1.11 L55.09 -3.76 L57.66 -5.21 L59.42 -5.57 L61.31 -6.31 L63.16 -7.01 L65.16 -7.77 L67.36 -8.52 L67.55 -7.53 L66.50 -5.72 L67.13 -5.05 L68.00 -4.36 L67.70 -2.87 L66.94 -1.06 L65.01 1.21 L62.83 3.48 L62.01 5.51 L60.89 7.82 L58.59 10.12 L56.26 12.25 L54.10 14.27 L52.02 16.18 L49.95 18.44 L47.79 20.47 L46.09 21.42 L44.64 22.22 L43.03 23.33 L41.63 24.15 L40.41 24.73 L39.63 24.89 L39.49 24.54 L39.37 24.23 L39.33 23.95 L39.96 23.74 L40.20 24.09 L40.65 25.90 L41.28 27.03 L41.91 28.03 L42.50 28.99 L43.70 29.39 L45.30 29.34 L47.06 29.02 L49.01 28.39 L50.79 28.05 L52.80 27.54 L55.28 25.93 L57.66 24.04 L60.06 22.49 L62.57 20.78 L65.25 18.92 L67.92 16.83 L69.42 14.69 L70.64 12.76 L73.21 10.53 L75.52 8.25 L76.64 6.38 L77.26 4.78 L76.67 3.94 L76.26 3.10 L77.43 1.11 L77.29 -0.07 L75.03 0.52 L72.87 1.13 L70.75 1.73 L68.49 2.41 L66.28 2.74 L63.18 4.22 L59.65 6.93 L56.37 9.14 L52.94 11.10 L49.45 13.47 L45.98 16.04 L42.93 18.74 L40.64 21.32 L38.04 23.81 L35.21 26.38 L33.49 28.30 L31.67 30.12 L29.33 32.13 L26.79 34.18 L24.05 36.18 L21.50 37.96 L19.29 38.88 Z"/><path class="bloom-petal" data-delay="0.420" pathLength="1" d="M19.34 38.59 L21.90 35.89 L24.59 34.14 L27.35 32.54 L29.88 30.69 L32.43 28.90 L34.75 26.95 L36.72 24.86 L39.07 23.30 L40.82 21.33 L42.27 19.01 L44.84 17.93 L47.83 17.65 L50.48 17.17 L53.08 16.88 L55.49 16.13 L58.05 15.39 L60.71 16.60 L62.90 18.36 L65.29 18.94 L67.83 19.69 L70.16 21.01 L72.29 22.68 L72.94 24.93 L73.21 27.06 L75.43 29.13 L77.36 31.56 L77.32 33.90 L76.92 36.17 L76.05 38.26 L75.29 40.38 L75.98 43.30 L75.69 45.88 L73.28 47.11 L71.23 48.42 L69.84 50.17 L68.30 51.76 L66.91 53.51 L64.92 54.52 L62.26 54.30 L60.14 54.55 L58.37 55.37 L56.40 55.59 L54.42 55.39 L52.53 54.94 L50.81 54.24 L49.14 53.74 L47.47 53.24 L45.75 52.86 L45.52 53.16 L46.11 55.17 L47.25 56.54 L48.52 57.74 L49.89 59.01 L51.44 59.97 L53.10 60.62 L54.74 60.80 L56.17 60.34 L57.96 60.44 L60.28 60.98 L61.94 60.29 L63.01 58.85 L64.25 57.57 L65.37 56.13 L67.18 55.13 L69.38 54.20 L69.50 51.92 L68.67 49.29 L69.34 47.44 L70.17 45.59 L70.56 43.54 L70.62 41.37 L68.75 39.07 L66.59 37.07 L66.40 34.94 L65.82 32.62 L63.73 30.80 L61.40 29.27 L58.81 28.25 L56.33 27.34 L54.01 25.23 L51.18 23.65 L48.45 24.03 L45.87 24.41 L43.12 24.37 L40.37 24.53 L37.33 24.50 L34.78 25.30 L33.42 27.34 L31.85 29.03 L29.77 30.30 L28.31 31.90 L26.70 33.23 L24.85 34.47 L23.03 35.76 L21.07 36.76 L19.41 37.76 L19.06 38.80 Z"/><path class="bloom-petal" data-delay="0.490" pathLength="1" d="M19.41 38.76 L22.31 37.36 L24.32 36.47 L26.13 35.87 L27.86 35.02 L29.51 33.96 L31.11 32.31 L32.63 30.47 L34.16 29.85 L35.59 29.16 L37.06 27.76 L38.47 27.44 L39.72 28.19 L40.82 29.57 L41.63 31.90 L42.63 33.44 L44.00 34.26 L44.73 36.81 L44.86 40.28 L45.16 43.27 L45.41 46.23 L45.76 49.23 L46.17 52.52 L45.72 55.72 L44.85 58.21 L44.42 61.15 L43.97 64.47 L43.19 67.30 L42.25 69.86 L41.09 70.97 L39.92 71.20 L38.72 73.28 L37.35 75.47 L36.05 75.45 L34.83 74.78 L33.65 73.85 L32.53 72.70 L31.12 72.47 L29.80 71.64 L29.08 69.21 L28.44 66.83 L27.65 64.85 L26.99 62.70 L26.41 60.46 L26.04 58.09 L25.94 55.79 L25.81 53.63 L25.61 51.50 L25.02 49.49 L24.59 49.42 L22.82 51.06 L21.76 53.02 L20.85 55.05 L20.02 57.24 L19.54 59.52 L19.32 61.70 L19.22 63.81 L19.29 65.78 L19.25 68.18 L19.33 70.67 L20.04 71.58 L20.88 71.94 L21.48 73.23 L22.18 74.33 L22.99 75.16 L23.92 75.34 L24.98 73.29 L25.93 71.30 L26.91 71.12 L27.94 69.99 L28.82 67.33 L29.58 64.31 L30.06 60.72 L30.56 57.40 L31.54 54.44 L32.12 50.68 L31.86 46.76 L31.66 43.10 L31.55 39.45 L31.40 35.80 L31.40 31.72 L30.79 28.65 L29.54 27.42 L28.66 25.61 L27.98 23.16 L27.04 21.81 L26.00 21.24 L24.85 21.88 L23.71 23.71 L22.70 24.91 L21.70 26.12 L20.97 28.34 L20.36 30.33 L19.73 31.87 L19.13 33.27 L18.64 34.49 L18.35 36.11 L18.99 38.64 Z"/><path class="bloom-petal" data-delay="0.560" pathLength="1" d="M19.35 38.85 L21.60 38.10 L22.74 36.88 L23.38 35.65 L23.67 34.46 L23.78 33.26 L24.75 31.55 L26.49 29.41 L27.01 27.60 L26.63 26.23 L26.12 24.95 L25.19 23.91 L24.52 22.62 L23.52 21.46 L20.70 21.89 L17.59 22.79 L15.40 22.79 L13.00 22.98 L10.26 23.63 L7.32 24.66 L4.19 26.77 L1.42 28.73 L-1.38 29.79 L-4.27 31.32 L-6.60 33.44 L-8.60 35.50 L-10.07 37.50 L-11.56 39.39 L-14.20 41.52 L-15.93 43.61 L-15.59 44.98 L-15.57 46.31 L-16.11 47.86 L-16.47 49.32 L-17.08 50.96 L-16.54 51.83 L-14.61 51.55 L-13.57 51.79 L-13.15 52.55 L-12.04 52.63 L-10.60 52.26 L-8.95 51.49 L-7.18 50.31 L-5.67 49.41 L-4.17 48.50 L-2.58 47.07 L-1.09 45.43 L0.28 43.72 L1.35 41.60 L1.17 41.29 L-0.90 41.95 L-2.92 43.01 L-5.05 44.18 L-7.31 45.27 L-9.52 45.92 L-11.76 46.60 L-14.29 47.59 L-16.72 48.18 L-18.94 48.36 L-20.81 48.07 L-21.96 47.07 L-23.69 46.53 L-26.24 46.46 L-27.32 45.17 L-27.15 43.05 L-27.12 41.05 L-26.79 38.90 L-26.90 36.90 L-27.19 34.84 L-25.30 32.04 L-22.40 29.19 L-20.56 26.61 L-18.66 23.96 L-16.19 21.30 L-13.37 18.68 L-9.99 16.74 L-6.73 15.37 L-3.54 13.22 L-0.05 11.05 L3.18 10.05 L6.14 9.57 L8.68 9.64 L10.95 10.00 L14.08 9.54 L16.87 9.61 L17.83 11.31 L18.45 13.18 L19.37 14.82 L19.91 16.71 L20.40 18.69 L20.07 21.12 L18.61 23.97 L18.00 26.51 L18.37 28.58 L18.72 30.70 L18.90 32.94 L18.90 35.37 L19.05 38.54 Z"/><path class="bloom-filament" data-delay="0.460" pathLength="1" d="M24.11 30.11 C31.55 31.78 49.69 45.20 68.74 40.16 C87.78 35.13 120.85 24.84 138.40 -0.12 C155.94 -25.07 168.07 -91.34 174.00 -109.58"/><path class="bloom-filament" data-delay="0.555" pathLength="1" d="M24.11 30.11 C30.63 30.45 46.38 39.46 63.22 32.16 C80.05 24.87 109.53 16.09 125.12 -13.66 C140.71 -43.41 151.48 -124.22 156.76 -146.33"/><path class="bloom-filament" data-delay="0.650" pathLength="1" d="M24.11 30.11 C28.32 29.51 38.10 35.11 49.39 26.50 C60.68 17.89 81.16 0.79 91.85 -21.56 C102.54 -43.92 109.93 -93.30 113.55 -107.64"/><path class="bloom-filament" data-delay="0.745" pathLength="1" d="M24.11 30.11 C26.58 28.61 31.82 30.92 38.91 21.09 C46.00 11.26 59.65 -6.44 66.63 -28.87 C73.61 -51.31 78.43 -99.43 80.79 -113.54"/><path class="bloom-filament" data-delay="0.840" pathLength="1" d="M24.11 30.11 C24.71 27.42 25.12 25.70 27.72 13.96 C30.32 2.22 36.69 -20.05 39.71 -40.32 C42.73 -60.58 44.82 -96.39 45.84 -107.61"/><path class="bloom-filament" data-delay="0.935" pathLength="1" d="M24.11 30.11 C22.99 26.91 18.93 22.92 17.38 10.92 C15.83 -1.08 15.47 -27.13 14.82 -41.91 C14.18 -56.70 13.73 -71.81 13.51 -77.79"/><path class="bloom-filament bloom-style" data-delay="0.640" pathLength="1" d="M19.20 38.70 C25.39 36.26 44.83 32.76 56.32 24.06 C67.81 15.37 78.68 5.37 88.14 -13.45 C97.60 -32.28 108.91 -76.31 113.06 -88.88"/></g><g><path class="bloom-pedicel" d="M0.00 101.98 C-2.99 96.47 -11.71 77.68 -17.93 68.90 C-24.16 60.13 -34.12 52.59 -37.36 49.33"/><path class="bloom-petal" data-delay="0.315" pathLength="1" d="M-37.53 49.45 L-41.40 48.19 L-44.62 45.95 L-47.70 43.33 L-50.73 40.63 L-53.73 37.94 L-56.67 35.58 L-59.52 33.40 L-62.43 30.40 L-65.12 27.58 L-67.87 25.07 L-70.47 22.28 L-72.77 19.40 L-74.69 16.62 L-75.82 14.21 L-77.24 11.88 L-79.52 9.05 L-80.65 6.86 L-80.50 5.74 L-80.47 4.68 L-80.23 3.90 L-80.34 2.74 L-80.85 0.95 L-79.70 1.16 L-77.53 2.95 L-76.24 3.47 L-75.06 3.60 L-73.44 4.31 L-71.60 5.25 L-69.33 7.43 L-67.12 10.03 L-64.99 11.50 L-62.58 12.97 L-60.35 15.15 L-58.30 17.36 L-56.50 19.47 L-54.94 21.38 L-52.77 23.37 L-50.67 25.43 L-49.75 26.86 L-49.14 27.95 L-48.30 29.12 L-47.66 30.11 L-47.07 31.05 L-46.87 31.61 L-47.29 31.42 L-47.70 31.15 L-48.04 30.83 L-48.21 29.86 L-47.88 29.61 L-45.89 29.20 L-44.57 28.79 L-43.34 28.48 L-42.18 28.14 L-41.68 27.11 L-41.61 25.72 L-41.63 24.31 L-41.87 22.72 L-41.92 21.22 L-42.31 19.37 L-43.94 16.86 L-45.68 14.41 L-46.88 12.01 L-48.39 9.39 L-50.21 6.64 L-52.31 3.90 L-54.65 1.85 L-56.81 -0.20 L-59.11 -3.38 L-61.54 -6.12 L-63.61 -7.58 L-65.50 -8.76 L-66.99 -9.30 L-68.61 -10.13 L-71.10 -12.12 L-72.56 -12.42 L-72.32 -10.59 L-72.41 -9.26 L-72.80 -8.17 L-72.91 -6.68 L-73.05 -5.01 L-71.85 -2.18 L-69.43 1.35 L-67.83 4.41 L-66.51 7.58 L-64.41 11.10 L-61.95 14.69 L-59.25 18.13 L-56.49 21.26 L-53.89 24.62 L-51.20 28.11 L-49.00 30.52 L-46.91 33.02 L-44.71 36.08 L-42.50 39.34 L-40.38 42.72 L-38.40 45.96 L-37.19 49.21 Z"/><path class="bloom-petal" data-delay="0.385" pathLength="1" d="M-37.49 49.31 L-40.72 46.82 L-43.24 43.85 L-45.76 40.81 L-48.24 37.74 L-50.25 34.40 L-52.48 31.37 L-55.48 29.14 L-58.63 26.34 L-61.60 23.36 L-63.94 19.84 L-64.71 15.51 L-65.44 11.55 L-67.09 7.96 L-67.76 4.07 L-67.24 0.21 L-66.07 -3.37 L-63.86 -6.25 L-62.16 -9.16 L-61.20 -13.05 L-58.76 -15.68 L-55.35 -16.39 L-52.25 -17.26 L-49.18 -18.02 L-46.07 -18.99 L-42.72 -20.56 L-39.45 -19.66 L-36.81 -16.80 L-33.93 -15.57 L-30.75 -14.94 L-27.96 -13.36 L-25.41 -11.43 L-23.88 -8.40 L-23.24 -4.94 L-21.45 -2.71 L-19.37 -0.57 L-18.84 2.34 L-18.93 5.21 L-19.24 7.86 L-19.80 10.28 L-19.73 12.71 L-19.93 15.17 L-21.26 16.97 L-22.67 18.44 L-23.83 20.04 L-25.11 21.46 L-26.48 22.70 L-27.93 23.62 L-29.22 24.44 L-28.99 24.69 L-26.60 24.92 L-24.39 24.44 L-22.29 23.45 L-20.30 22.13 L-18.47 20.50 L-16.44 18.90 L-14.56 16.90 L-13.90 14.18 L-13.58 11.47 L-12.74 8.80 L-12.22 5.92 L-11.99 2.87 L-12.44 -0.16 L-14.49 -2.35 L-16.28 -4.57 L-16.93 -7.96 L-18.49 -10.85 L-21.07 -12.60 L-23.87 -13.96 L-27.05 -14.34 L-29.91 -15.29 L-32.49 -17.87 L-35.66 -18.49 L-38.88 -16.68 L-41.84 -15.50 L-44.72 -14.59 L-47.60 -13.63 L-50.81 -12.91 L-53.04 -10.36 L-53.84 -6.63 L-55.42 -3.94 L-57.58 -1.34 L-58.77 1.94 L-59.41 5.49 L-58.93 9.09 L-57.54 12.41 L-57.14 16.15 L-56.75 20.29 L-54.85 23.68 L-52.35 26.58 L-49.70 29.33 L-47.13 31.64 L-45.35 34.79 L-43.90 38.18 L-42.08 41.24 L-40.32 44.22 L-38.73 47.09 L-37.23 49.35 Z"/><path class="bloom-petal" data-delay="0.455" pathLength="1" d="M-37.36 49.17 L-39.59 45.55 L-41.48 42.38 L-43.25 39.27 L-44.75 36.23 L-45.79 33.27 L-47.53 30.57 L-50.39 28.19 L-52.90 25.45 L-54.68 22.68 L-55.75 19.98 L-55.74 17.46 L-56.39 15.12 L-57.74 12.70 L-57.02 10.71 L-54.89 9.36 L-53.13 8.15 L-51.19 7.19 L-49.60 6.08 L-47.95 4.82 L-44.74 5.17 L-41.33 6.43 L-38.65 6.62 L-35.82 6.70 L-32.80 7.33 L-29.71 8.22 L-27.19 10.14 L-25.16 12.21 L-22.11 13.16 L-18.89 14.23 L-17.00 16.09 L-15.56 17.98 L-14.53 19.82 L-13.64 21.54 L-11.43 23.06 L-9.81 24.70 L-10.43 26.23 L-11.03 27.58 L-10.94 28.95 L-11.08 30.27 L-11.17 31.66 L-11.92 32.83 L-13.64 33.45 L-15.03 34.19 L-16.15 35.25 L-17.66 36.07 L-19.41 36.70 L-21.28 37.30 L-23.33 38.33 L-23.41 38.77 L-21.57 40.09 L-19.55 40.75 L-17.50 41.12 L-15.59 41.15 L-14.03 40.80 L-12.19 40.64 L-10.05 40.50 L-8.94 39.69 L-8.60 38.60 L-8.30 37.50 L-8.35 36.31 L-7.81 35.11 L-7.36 33.70 L-9.25 32.18 L-11.81 30.79 L-13.12 29.21 L-14.63 27.53 L-16.60 25.82 L-19.03 24.15 L-22.81 23.31 L-26.40 22.61 L-28.94 20.82 L-31.92 19.19 L-35.41 18.62 L-38.74 18.30 L-41.77 18.54 L-44.54 18.64 L-47.93 17.65 L-51.00 17.51 L-52.40 18.90 L-53.67 20.06 L-55.23 20.96 L-56.60 22.01 L-58.37 23.09 L-58.75 24.71 L-57.12 26.68 L-56.26 28.50 L-56.12 30.42 L-54.97 32.47 L-53.17 34.56 L-50.68 36.55 L-47.68 38.34 L-45.73 40.50 L-44.61 42.73 L-43.10 44.85 L-41.38 46.83 L-39.58 48.56 L-37.37 49.49 Z"/><path class="bloom-petal" data-delay="0.525" pathLength="1" d="M-37.19 49.22 L-38.46 46.70 L-40.15 45.13 L-41.97 43.70 L-44.04 42.03 L-46.10 40.44 L-48.23 38.70 L-50.32 36.83 L-51.97 35.57 L-53.77 33.93 L-55.81 32.00 L-56.94 31.46 L-57.39 31.75 L-57.98 31.80 L-58.39 32.06 L-59.15 32.00 L-59.89 32.09 L-58.80 33.96 L-57.15 36.25 L-56.78 37.53 L-56.36 38.98 L-55.37 40.95 L-54.08 43.19 L-51.80 45.88 L-49.65 48.39 L-48.55 50.79 L-47.09 53.46 L-45.02 55.93 L-43.07 58.20 L-41.26 60.22 L-39.61 62.20 L-37.76 64.99 L-35.96 67.28 L-34.93 67.93 L-33.99 68.68 L-32.78 69.95 L-31.70 70.96 L-30.53 72.03 L-29.95 72.26 L-30.36 71.32 L-30.37 70.89 L-29.87 70.96 L-29.91 70.41 L-30.33 69.50 L-30.99 68.40 L-31.89 67.16 L-32.66 66.08 L-33.56 65.03 L-35.04 64.22 L-35.32 64.52 L-35.31 66.93 L-35.24 68.83 L-35.18 70.60 L-34.95 72.44 L-34.93 74.06 L-35.12 75.44 L-35.67 76.40 L-36.74 76.71 L-37.28 77.48 L-37.37 78.74 L-38.42 78.80 L-40.03 78.02 L-41.50 77.30 L-43.06 76.32 L-44.32 75.85 L-45.62 75.50 L-47.66 73.51 L-49.72 71.00 L-51.57 69.30 L-53.56 67.55 L-55.69 65.50 L-57.94 63.23 L-59.57 60.70 L-60.85 58.40 L-63.17 55.92 L-65.63 53.21 L-67.09 50.88 L-68.23 48.76 L-68.78 47.09 L-69.24 45.56 L-70.94 42.96 L-72.02 40.74 L-71.20 40.29 L-70.31 39.96 L-69.67 39.32 L-68.76 38.88 L-67.91 38.22 L-66.28 38.42 L-63.66 40.02 L-61.17 41.36 L-58.78 42.32 L-56.10 43.73 L-53.46 44.87 L-50.69 45.90 L-47.69 47.00 L-44.71 47.80 L-41.55 48.59 L-37.53 49.44 Z"/><path class="bloom-petal" data-delay="0.595" pathLength="1" d="M-37.23 49.35 L-39.07 47.76 L-41.75 46.74 L-44.76 46.16 L-47.90 45.68 L-51.06 45.07 L-53.87 43.48 L-56.38 41.38 L-59.55 40.73 L-62.70 40.60 L-65.59 39.93 L-68.50 39.62 L-71.43 39.49 L-74.29 40.07 L-76.59 42.57 L-78.61 44.71 L-81.25 45.35 L-83.56 46.83 L-85.01 49.33 L-86.03 51.99 L-86.10 54.94 L-86.60 57.48 L-88.61 59.88 L-89.13 62.75 L-87.62 65.37 L-86.60 67.85 L-85.82 70.37 L-85.18 73.03 L-85.01 76.27 L-83.34 78.40 L-80.48 78.95 L-78.70 80.53 L-77.36 82.93 L-75.52 84.52 L-73.53 85.75 L-71.30 85.83 L-69.13 84.93 L-67.24 85.43 L-65.28 86.38 L-63.43 85.74 L-61.84 84.51 L-60.41 83.27 L-59.18 81.87 L-57.81 80.78 L-56.54 79.47 L-55.95 77.58 L-55.59 75.67 L-55.24 73.82 L-55.31 71.87 L-55.49 71.81 L-56.27 73.58 L-57.05 75.41 L-57.78 77.38 L-58.71 79.39 L-60.32 80.87 L-62.05 82.17 L-63.65 83.81 L-65.48 85.32 L-67.51 86.81 L-69.83 87.72 L-72.31 87.02 L-74.74 86.74 L-77.47 87.83 L-80.29 87.87 L-82.88 86.71 L-85.32 85.11 L-87.25 82.64 L-89.60 80.90 L-93.01 80.10 L-95.18 77.63 L-95.80 73.96 L-96.82 70.80 L-97.88 67.71 L-99.08 64.59 L-100.68 61.30 L-100.12 57.74 L-97.95 54.67 L-97.17 51.51 L-96.73 47.99 L-95.23 44.88 L-93.25 42.04 L-90.35 40.36 L-87.13 39.66 L-84.52 37.58 L-81.66 35.27 L-78.27 34.98 L-74.88 35.47 L-71.54 36.20 L-68.27 37.32 L-64.78 37.91 L-61.30 39.01 L-58.57 41.48 L-55.49 43.41 L-51.93 44.39 L-48.26 45.22 L-44.61 46.11 L-41.09 47.41 L-37.49 49.31 Z"/><path class="bloom-petal" data-delay="0.665" pathLength="1" d="M-37.43 49.52 L-40.66 48.82 L-44.18 47.67 L-47.93 46.48 L-51.65 45.13 L-55.26 43.60 L-58.40 41.78 L-61.27 39.88 L-65.03 38.47 L-68.60 37.22 L-71.94 35.67 L-75.61 34.52 L-79.39 33.88 L-83.05 33.76 L-86.17 34.53 L-89.34 34.95 L-93.32 34.66 L-96.40 35.48 L-98.07 37.31 L-99.66 39.03 L-100.84 40.86 L-102.48 42.48 L-104.91 43.96 L-104.83 46.17 L-102.76 48.53 L-102.10 50.53 L-101.84 52.52 L-100.86 54.53 L-99.54 56.54 L-96.77 57.99 L-93.54 58.80 L-91.31 60.25 L-88.87 61.91 L-85.83 62.61 L-82.78 62.85 L-79.89 62.65 L-77.24 62.14 L-74.18 62.28 L-71.03 62.21 L-69.00 60.97 L-67.40 59.53 L-65.66 58.30 L-64.18 56.95 L-62.75 55.59 L-61.85 54.05 L-61.92 52.29 L-62.09 50.61 L-62.25 48.93 L-62.73 46.93 L-62.61 46.56 L-61.55 46.91 L-61.06 47.72 L-60.61 48.71 L-60.29 49.86 L-60.95 50.87 L-62.16 51.74 L-63.43 52.66 L-64.98 53.50 L-66.41 54.58 L-68.32 55.51 L-71.38 55.29 L-74.42 54.89 L-77.10 55.15 L-80.10 55.12 L-83.32 54.65 L-86.61 53.70 L-89.36 51.78 L-91.97 50.04 L-95.62 48.92 L-98.83 47.11 L-100.58 44.71 L-101.96 42.30 L-102.58 39.88 L-103.51 37.47 L-105.77 34.71 L-105.93 32.11 L-103.48 30.30 L-101.72 28.41 L-100.32 26.36 L-98.42 24.51 L-96.36 22.64 L-92.83 21.85 L-88.37 22.28 L-84.68 22.09 L-81.05 21.64 L-76.90 22.19 L-72.69 23.33 L-68.66 25.06 L-65.07 27.27 L-61.35 29.23 L-57.58 31.40 L-55.10 33.91 L-52.52 36.33 L-49.35 38.64 L-46.01 40.94 L-42.64 43.24 L-39.58 45.79 L-37.29 49.14 Z"/><path class="bloom-filament" data-delay="0.690" pathLength="1" d="M-47.51 41.42 C-50.25 42.50 -54.99 54.19 -63.96 47.87 C-72.94 41.55 -91.95 23.62 -101.38 3.48 C-110.80 -16.66 -117.31 -60.21 -120.50 -72.95"/><path class="bloom-filament" data-delay="0.785" pathLength="1" d="M-47.51 41.42 C-53.74 41.63 -67.54 50.12 -84.92 42.66 C-102.30 35.19 -134.96 24.75 -151.80 -3.36 C-168.65 -31.46 -180.29 -105.54 -185.99 -125.98"/><path class="bloom-filament" data-delay="0.880" pathLength="1" d="M-47.51 41.42 C-54.19 41.08 -69.14 47.21 -87.60 39.39 C-106.06 31.58 -140.46 21.33 -158.25 -5.49 C-176.05 -32.31 -188.34 -102.18 -194.36 -121.52"/><path class="bloom-filament" data-delay="0.975" pathLength="1" d="M-47.51 41.42 C-55.99 40.69 -75.63 44.86 -98.43 37.05 C-121.23 29.25 -162.68 9.74 -184.30 -5.41 C-205.93 -20.57 -220.88 -45.80 -228.20 -53.88"/><path class="bloom-filament" data-delay="1.070" pathLength="1" d="M-47.51 41.42 C-57.03 40.45 -79.34 43.04 -104.63 35.60 C-129.91 28.17 -175.40 10.03 -199.22 -3.19 C-223.04 -16.41 -239.51 -36.96 -247.57 -43.72"/><path class="bloom-filament" data-delay="1.165" pathLength="1" d="M-47.51 41.42 C-57.77 39.98 -82.00 40.38 -109.07 32.76 C-136.14 25.13 -184.51 18.82 -209.91 -4.32 C-235.31 -27.46 -252.86 -89.14 -261.45 -106.10"/><path class="bloom-filament bloom-style" data-delay="0.870" pathLength="1" d="M-37.36 49.33 C-50.21 47.96 -90.60 47.82 -114.47 41.11 C-138.34 34.40 -160.92 26.28 -180.56 9.09 C-200.21 -8.10 -223.71 -50.18 -232.34 -62.03"/></g><g><path class="bloom-pedicel" d="M0.00 101.98 C5.03 97.17 19.70 81.69 30.18 73.12 C40.65 64.55 57.42 54.32 62.87 50.56"/><path class="bloom-petal" data-delay="0.105" pathLength="1" d="M62.96 50.75 L67.21 50.71 L71.13 49.65 L75.00 48.33 L78.70 46.82 L82.09 45.13 L85.65 43.74 L89.58 42.80 L93.89 41.11 L97.82 39.01 L101.24 36.64 L103.80 34.10 L106.60 31.67 L109.83 29.12 L111.26 26.52 L111.16 24.25 L111.18 22.07 L110.82 20.05 L110.72 17.88 L110.57 15.57 L107.96 14.71 L104.43 14.76 L102.30 13.84 L100.12 12.87 L97.27 12.57 L94.16 12.66 L90.62 13.97 L87.38 15.56 L84.33 15.96 L81.05 16.62 L78.22 18.36 L75.77 20.21 L73.72 22.07 L71.92 23.84 L69.25 25.44 L67.05 27.24 L66.80 28.92 L66.65 30.38 L65.93 31.87 L65.51 33.24 L65.11 34.61 L65.42 35.63 L66.78 35.94 L67.82 36.28 L68.56 36.80 L69.75 36.89 L71.19 36.60 L72.72 36.02 L74.11 35.02 L73.92 34.83 L71.45 34.94 L69.15 35.07 L66.92 34.98 L64.94 34.51 L63.44 33.57 L61.66 32.75 L59.65 31.91 L58.77 30.29 L58.71 28.26 L58.79 26.17 L59.30 23.92 L59.36 21.68 L59.64 19.22 L61.98 16.65 L64.86 14.31 L66.95 11.86 L69.33 9.38 L72.12 6.99 L75.30 4.79 L78.90 3.77 L82.23 3.10 L85.71 1.34 L89.41 -0.05 L92.60 -0.13 L95.45 0.24 L97.55 1.36 L99.52 2.47 L102.84 2.65 L105.19 3.76 L105.06 6.31 L104.91 8.71 L105.04 10.95 L104.86 13.33 L104.88 15.78 L103.47 18.54 L100.35 21.26 L97.78 23.87 L95.53 26.64 L92.51 29.27 L89.05 31.71 L85.25 33.82 L81.57 35.42 L78.13 37.64 L75.06 40.20 L71.85 42.65 L68.65 45.04 L65.57 47.46 L62.78 50.36 Z"/><path class="bloom-petal" data-delay="0.175" pathLength="1" d="M62.90 50.57 L66.58 48.85 L69.92 46.52 L73.27 44.05 L76.47 41.43 L79.20 38.46 L82.24 36.06 L85.92 34.82 L89.47 33.09 L92.70 30.91 L95.32 28.15 L96.72 24.63 L98.47 21.66 L101.19 19.15 L102.44 15.95 L102.15 12.55 L101.63 9.40 L100.49 6.55 L100.07 3.66 L100.31 0.25 L98.21 -2.08 L94.82 -3.00 L92.51 -4.58 L90.34 -6.41 L87.92 -8.08 L85.31 -9.80 L82.12 -9.26 L79.11 -7.48 L76.30 -7.93 L73.26 -8.79 L70.44 -7.99 L67.84 -6.68 L65.77 -4.60 L64.08 -2.34 L61.42 -1.61 L58.74 -0.66 L57.69 1.76 L57.05 4.16 L56.16 6.18 L55.41 8.14 L54.22 9.96 L53.52 11.93 L54.21 13.85 L54.78 15.57 L54.85 17.37 L55.26 19.09 L55.95 20.69 L56.87 22.14 L57.77 23.68 L57.60 23.89 L55.70 23.28 L54.10 22.11 L52.77 20.58 L51.80 18.75 L51.24 16.71 L50.27 14.66 L49.29 12.35 L49.81 9.95 L50.95 7.71 L51.73 5.36 L52.74 2.99 L53.59 0.31 L54.89 -2.32 L57.87 -3.40 L60.86 -4.19 L62.88 -6.41 L65.29 -8.38 L68.20 -9.49 L71.30 -10.04 L74.58 -8.87 L77.56 -8.07 L80.69 -9.47 L83.91 -9.61 L86.48 -7.52 L88.78 -5.49 L90.75 -3.35 L92.81 -1.55 L95.91 -0.49 L97.69 1.88 L97.14 5.23 L97.28 7.95 L98.21 10.57 L98.58 13.42 L98.81 16.49 L97.58 19.36 L94.97 21.55 L93.39 24.23 L92.23 27.51 L89.89 30.07 L86.98 32.12 L83.77 33.78 L80.18 35.15 L77.14 37.78 L74.57 40.92 L71.65 43.64 L68.68 46.18 L65.80 48.59 L62.83 50.54 Z"/><path class="bloom-petal" data-delay="0.245" pathLength="1" d="M62.82 50.39 L65.88 47.42 L68.98 44.80 L72.04 42.20 L74.93 39.62 L77.55 37.06 L80.61 34.91 L84.19 33.29 L87.58 31.32 L90.49 29.20 L92.99 27.09 L94.86 25.02 L97.21 23.20 L100.01 21.42 L100.86 19.67 L100.40 18.24 L100.57 16.93 L100.63 15.73 L100.87 14.49 L100.95 13.21 L98.65 13.06 L95.79 13.48 L94.63 12.87 L93.30 12.19 L91.09 12.16 L88.60 12.39 L85.66 13.47 L82.91 14.57 L80.43 14.42 L77.64 14.54 L74.97 15.80 L72.50 17.06 L70.17 18.23 L67.89 19.32 L65.04 20.03 L62.57 21.08 L61.56 22.59 L60.48 23.89 L58.79 25.05 L57.42 26.27 L56.18 27.55 L55.61 28.81 L56.06 29.89 L56.10 31.03 L55.76 32.36 L56.07 33.57 L56.81 34.67 L57.73 35.80 L58.79 37.36 L58.76 37.80 L57.47 38.31 L56.29 38.23 L55.28 37.92 L54.71 37.35 L54.85 36.52 L54.66 35.79 L54.15 35.04 L54.75 34.04 L56.10 32.98 L57.68 31.94 L59.65 30.94 L61.09 29.79 L62.53 28.43 L65.48 27.54 L68.85 27.00 L71.67 26.10 L74.57 25.14 L77.61 24.11 L80.83 23.10 L84.16 23.26 L87.12 23.72 L90.30 22.95 L93.61 22.21 L96.38 22.34 L98.77 22.72 L100.17 23.75 L101.29 24.68 L104.01 24.55 L106.06 24.93 L105.66 26.36 L105.05 27.67 L104.61 28.84 L104.05 30.02 L104.15 31.23 L102.98 32.66 L99.93 34.04 L97.36 35.38 L95.34 36.91 L92.73 38.43 L89.75 39.91 L86.31 41.20 L82.46 42.21 L78.98 43.78 L76.06 45.62 L72.97 47.33 L69.74 48.89 L66.48 50.20 L62.91 50.72 Z"/><path class="bloom-petal" data-delay="0.315" pathLength="1" d="M62.78 50.37 L65.63 47.64 L68.89 45.90 L72.30 44.33 L75.71 42.95 L78.92 42.01 L82.17 40.74 L85.41 38.76 L88.67 37.15 L91.91 35.94 L94.95 35.34 L97.37 35.73 L99.91 35.78 L103.16 35.19 L105.53 35.72 L106.79 37.21 L107.83 38.77 L108.31 40.62 L109.46 42.12 L111.43 43.43 L111.07 45.72 L109.02 48.31 L108.21 50.49 L107.67 52.64 L106.87 54.87 L105.96 57.18 L103.45 59.11 L100.43 60.52 L98.76 62.44 L97.10 64.59 L94.73 66.06 L92.27 67.20 L89.83 67.74 L87.60 67.98 L85.28 69.27 L82.79 70.48 L80.89 70.25 L79.29 69.80 L77.63 69.62 L76.08 69.39 L74.22 69.47 L72.69 69.23 L72.28 68.25 L71.88 67.43 L71.07 66.93 L70.58 66.32 L70.42 65.66 L70.56 65.01 L70.87 64.74 L70.82 65.06 L70.25 67.06 L69.98 68.76 L70.08 70.38 L70.60 71.89 L71.52 73.26 L72.12 74.89 L72.82 76.63 L74.72 77.57 L77.03 78.12 L79.09 78.91 L81.30 79.57 L83.49 80.43 L85.99 81.00 L89.07 80.04 L91.95 78.95 L94.70 78.85 L97.60 78.39 L100.44 77.31 L103.11 75.86 L104.99 73.71 L106.78 71.78 L109.82 70.38 L112.27 68.46 L113.03 66.17 L113.62 64.00 L113.90 61.91 L114.42 59.83 L116.16 57.34 L116.23 55.17 L113.98 53.96 L112.60 52.54 L111.93 50.74 L110.76 49.17 L109.43 47.62 L107.03 46.95 L103.79 47.32 L101.28 46.96 L98.92 46.17 L95.92 46.30 L92.70 46.94 L89.42 47.89 L85.84 49.21 L82.05 49.79 L78.41 49.88 L74.62 50.27 L70.82 50.66 L67.04 50.90 L62.96 50.74 Z"/><path class="bloom-petal" data-delay="0.385" pathLength="1" d="M62.82 50.51 L66.15 49.14 L69.92 48.44 L73.84 48.02 L77.78 47.95 L81.65 48.28 L85.32 47.66 L88.61 45.83 L92.22 44.93 L95.90 44.93 L99.45 45.45 L102.74 46.71 L106.07 47.19 L109.68 47.27 L112.36 49.40 L114.05 52.46 L116.00 54.77 L117.82 57.07 L119.83 59.29 L121.83 61.70 L121.30 64.87 L119.77 67.76 L120.35 70.36 L120.96 73.19 L120.28 75.87 L119.12 78.38 L116.60 80.02 L114.10 81.32 L113.38 84.15 L112.12 86.85 L109.38 87.62 L106.71 88.11 L104.20 88.58 L101.82 89.09 L99.61 90.80 L97.15 91.59 L94.82 90.19 L92.72 89.21 L90.50 89.14 L88.37 88.71 L86.27 88.15 L84.56 87.00 L83.61 85.16 L82.43 83.75 L80.89 82.57 L79.89 81.03 L79.30 79.33 L78.89 77.61 L78.46 75.84 L78.32 75.81 L77.97 77.64 L78.00 79.62 L78.33 81.68 L79.18 83.67 L80.68 85.34 L81.93 87.27 L83.07 89.62 L85.08 91.25 L87.55 92.25 L90.14 93.05 L92.87 93.42 L95.53 94.60 L98.45 96.12 L101.52 95.33 L104.31 93.53 L107.26 92.84 L110.28 92.09 L113.41 91.24 L116.54 90.04 L118.10 86.85 L119.02 83.49 L121.61 81.64 L124.13 79.46 L125.17 76.42 L125.64 73.26 L124.72 70.03 L123.77 67.11 L124.88 64.01 L124.98 60.75 L122.54 58.35 L120.13 56.25 L117.97 54.15 L115.74 52.12 L113.85 49.38 L111.07 47.57 L107.42 47.81 L104.12 47.62 L100.92 46.60 L97.49 46.25 L93.95 46.37 L90.47 47.30 L87.02 49.17 L82.97 49.81 L78.83 49.41 L74.74 49.34 L70.71 49.54 L66.81 49.91 L62.91 50.60 Z"/><path class="bloom-petal" data-delay="0.455" pathLength="1" d="M62.92 50.73 L66.94 50.80 L70.99 50.57 L75.12 50.22 L79.24 49.86 L83.24 49.80 L87.13 49.46 L90.89 48.43 L95.12 47.41 L99.39 46.55 L103.60 46.15 L107.31 46.77 L110.81 47.16 L114.77 46.82 L118.17 47.20 L120.58 48.35 L122.42 49.69 L123.19 51.42 L124.47 52.71 L126.90 53.65 L127.09 55.36 L125.13 57.36 L123.85 59.06 L122.66 60.70 L121.48 62.37 L120.43 64.22 L117.46 65.66 L113.54 66.47 L110.92 67.76 L108.49 69.36 L105.46 70.50 L102.30 71.41 L99.05 71.61 L96.07 71.34 L93.18 72.10 L90.14 73.00 L87.63 72.71 L85.56 72.09 L83.69 71.50 L82.09 70.83 L80.06 70.52 L78.27 69.97 L77.79 68.73 L77.53 67.49 L76.90 66.38 L76.54 65.13 L76.44 63.74 L76.65 62.20 L76.86 60.25 L76.58 59.92 L74.99 60.39 L74.01 61.26 L73.52 62.16 L73.42 63.02 L73.70 63.79 L73.75 64.71 L74.12 65.62 L75.91 65.82 L78.02 65.74 L79.78 65.99 L81.83 66.12 L84.10 66.25 L86.81 66.03 L90.05 64.59 L93.08 63.29 L96.17 63.02 L99.49 62.30 L102.65 60.90 L105.63 59.31 L107.94 57.30 L110.39 55.66 L114.09 54.57 L116.81 52.92 L117.57 50.93 L118.46 49.20 L119.35 47.58 L120.37 45.98 L122.11 44.14 L121.77 42.65 L119.26 41.98 L117.99 40.98 L117.32 39.56 L115.67 38.52 L113.51 37.68 L110.41 37.60 L106.80 38.24 L103.67 38.13 L100.33 37.81 L96.49 38.52 L92.57 39.72 L88.67 41.12 L85.00 42.67 L81.12 43.61 L77.28 44.31 L73.43 45.41 L69.66 46.65 L66.06 48.04 L62.82 50.38 Z"/><path class="bloom-filament" data-delay="0.230" pathLength="1" d="M76.65 44.95 C86.53 49.80 108.92 70.77 135.93 74.08 C162.93 77.39 212.79 81.64 238.67 64.82 C264.54 47.99 282.43 -11.59 291.18 -26.87"/><path class="bloom-filament" data-delay="0.325" pathLength="1" d="M76.65 44.95 C86.17 48.15 107.63 63.86 133.77 64.14 C159.91 64.42 208.36 64.19 233.48 46.63 C258.59 29.06 275.94 -26.60 284.44 -41.24"/><path class="bloom-filament" data-delay="0.420" pathLength="1" d="M76.65 44.95 C87.05 47.11 110.79 59.17 139.04 57.89 C167.29 56.61 219.18 59.60 246.16 37.29 C273.14 14.98 291.79 -57.11 300.91 -75.99"/><path class="bloom-filament" data-delay="0.515" pathLength="1" d="M76.65 44.95 C86.16 45.51 107.59 52.48 133.69 48.32 C159.80 44.16 208.21 38.16 233.29 19.98 C258.37 1.79 275.71 -47.32 284.20 -60.78"/><path class="bloom-filament" data-delay="0.610" pathLength="1" d="M76.65 44.95 C86.30 44.18 108.12 46.73 134.59 40.31 C161.05 33.88 210.04 23.60 235.44 6.40 C260.84 -10.79 278.40 -51.31 286.99 -62.85"/><path class="bloom-filament" data-delay="0.705" pathLength="1" d="M76.65 44.95 C86.71 43.05 109.59 41.72 137.04 33.53 C164.49 25.34 215.07 11.83 241.34 -4.18 C267.61 -20.19 285.77 -52.81 294.65 -62.54"/><path class="bloom-filament bloom-style" data-delay="0.410" pathLength="1" d="M62.87 50.56 C80.35 52.17 135.31 61.42 167.79 60.26 C200.27 59.09 230.99 56.22 257.72 43.59 C284.45 30.97 316.43 -5.65 328.17 -15.50"/></g><g><path class="bloom-pedicel" d="M0.00 101.98 C0.84 97.11 3.28 88.42 5.02 72.74 C6.76 57.06 9.55 18.72 10.46 7.92"/><path class="bloom-petal" data-delay="0.525" pathLength="1" d="M10.41 7.85 L11.82 4.10 L12.65 0.25 L13.16 -3.73 L13.90 -7.70 L14.85 -11.63 L16.40 -15.30 L18.08 -18.69 L18.36 -22.31 L18.77 -25.66 L19.98 -28.92 L20.18 -32.35 L19.37 -35.65 L17.97 -38.72 L15.65 -41.24 L14.15 -44.05 L13.47 -47.71 L11.07 -50.11 L7.64 -51.10 L4.72 -52.41 L1.85 -53.64 L-0.92 -55.26 L-3.81 -57.37 L-7.06 -56.94 L-9.94 -54.93 L-12.82 -54.75 L-15.97 -54.96 L-18.87 -54.16 L-21.64 -52.94 L-23.25 -50.40 L-24.07 -47.53 L-26.49 -45.92 L-29.16 -44.08 L-29.86 -41.29 L-29.95 -38.45 L-29.75 -35.71 L-29.34 -33.06 L-29.98 -30.23 L-30.10 -27.30 L-28.33 -25.06 L-26.51 -23.07 L-25.21 -20.85 L-23.69 -18.82 L-22.07 -16.88 L-20.13 -15.37 L-17.86 -14.61 L-15.75 -13.85 L-13.71 -13.06 L-11.60 -12.57 L-11.56 -12.44 L-13.48 -12.35 L-15.44 -12.85 L-17.49 -13.36 L-19.71 -13.91 L-21.61 -15.22 L-23.22 -16.97 L-24.74 -18.82 L-26.07 -20.87 L-27.94 -22.72 L-29.78 -24.84 L-29.76 -27.67 L-29.22 -30.45 L-29.77 -33.09 L-30.09 -35.88 L-30.12 -38.82 L-29.51 -41.76 L-26.91 -43.81 L-24.50 -45.67 L-23.65 -48.84 L-21.92 -51.70 L-18.98 -53.25 L-15.82 -54.37 L-12.36 -54.46 L-9.10 -54.90 L-5.79 -57.12 L-2.06 -57.70 L1.33 -55.67 L4.59 -54.04 L7.95 -52.72 L11.34 -51.24 L15.19 -50.02 L17.94 -47.30 L18.90 -43.28 L20.58 -40.05 L22.99 -37.10 L24.36 -33.59 L25.04 -29.87 L24.61 -26.07 L23.06 -22.50 L22.24 -18.93 L21.49 -15.20 L19.49 -12.14 L17.66 -9.06 L16.33 -5.55 L15.15 -1.90 L14.15 1.76 L12.77 5.20 L10.51 7.99 Z"/><path class="bloom-petal" data-delay="0.595" pathLength="1" d="M10.27 7.79 L10.80 3.74 L11.76 0.26 L12.75 -3.10 L13.99 -6.51 L15.40 -9.94 L17.10 -13.41 L18.95 -16.90 L20.41 -20.49 L21.88 -23.89 L23.69 -27.41 L24.84 -30.57 L25.28 -33.16 L25.29 -35.29 L24.60 -36.63 L24.42 -38.41 L24.79 -40.95 L23.68 -41.72 L21.61 -40.96 L19.98 -40.75 L18.33 -40.49 L16.66 -40.32 L14.83 -40.11 L12.42 -38.02 L10.05 -35.18 L7.83 -33.36 L5.45 -31.45 L3.14 -28.89 L0.94 -26.10 L-0.71 -23.06 L-1.94 -20.16 L-3.90 -17.22 L-5.88 -14.06 L-6.67 -11.31 L-7.05 -8.87 L-7.24 -6.63 L-7.22 -4.60 L-7.76 -2.06 L-7.86 0.14 L-6.64 0.85 L-5.38 1.35 L-4.47 2.25 L-3.34 2.80 L-2.05 3.09 L-0.50 2.87 L1.29 2.02 L3.03 1.23 L4.82 0.45 L7.07 -0.31 L7.41 -0.05 L7.02 2.12 L6.20 3.64 L5.27 5.04 L4.19 6.44 L3.29 7.17 L2.60 7.35 L2.02 7.26 L1.62 6.80 L0.83 6.72 L0.03 6.42 L0.53 4.60 L1.43 2.41 L1.76 0.70 L2.26 -1.26 L2.93 -3.47 L4.00 -6.04 L6.25 -9.07 L8.48 -11.96 L9.98 -14.86 L11.90 -17.97 L14.39 -20.91 L17.00 -23.66 L19.71 -25.85 L22.28 -28.00 L25.01 -31.21 L27.81 -33.70 L30.03 -34.31 L32.07 -34.86 L34.05 -35.44 L35.95 -35.87 L38.19 -36.74 L39.34 -35.98 L38.88 -33.33 L38.84 -31.38 L39.17 -29.81 L38.69 -27.45 L37.68 -24.65 L35.87 -21.31 L33.34 -17.68 L31.08 -14.25 L28.77 -10.72 L26.26 -7.78 L23.88 -5.07 L21.58 -2.26 L19.23 0.58 L16.91 3.31 L14.30 5.95 L10.64 8.04 Z"/><path class="bloom-petal" data-delay="0.665" pathLength="1" d="M10.33 7.87 L11.64 4.64 L13.81 2.08 L16.21 -0.38 L18.64 -3.12 L21.09 -5.86 L23.42 -8.78 L25.59 -11.81 L28.03 -14.29 L30.19 -16.99 L32.34 -20.07 L34.79 -21.73 L37.12 -22.24 L39.28 -22.71 L41.27 -22.74 L43.42 -23.29 L45.79 -23.85 L46.95 -21.96 L47.26 -19.19 L48.44 -17.64 L49.67 -15.91 L50.50 -13.61 L51.00 -10.90 L49.82 -7.52 L48.32 -4.36 L48.49 -1.28 L48.34 2.14 L46.82 5.25 L45.08 8.07 L43.09 10.38 L41.25 12.51 L39.93 15.81 L38.19 18.54 L36.13 19.08 L34.34 19.51 L32.65 20.39 L31.02 21.00 L29.28 21.82 L27.84 21.61 L27.27 19.85 L26.62 18.57 L25.58 17.83 L24.98 16.50 L24.78 14.83 L24.94 12.97 L25.51 11.03 L25.99 9.22 L26.63 7.43 L27.96 5.86 L28.24 6.00 L28.39 8.35 L28.58 10.60 L28.82 12.80 L28.93 15.07 L29.40 17.22 L30.20 19.13 L31.37 20.66 L32.94 21.58 L34.09 23.01 L35.11 24.91 L36.97 25.26 L39.09 24.59 L41.06 24.13 L43.07 23.42 L45.16 23.18 L47.50 22.83 L49.52 20.31 L51.10 17.21 L53.22 15.27 L55.49 13.12 L57.51 10.42 L59.31 7.40 L59.75 4.00 L59.84 0.88 L61.59 -2.39 L62.99 -5.96 L62.66 -8.93 L61.93 -11.54 L60.73 -13.63 L59.49 -15.57 L59.02 -18.72 L57.61 -20.99 L54.88 -20.77 L52.28 -20.50 L49.76 -20.67 L47.00 -20.35 L44.01 -19.90 L40.88 -18.23 L38.03 -15.09 L35.15 -12.28 L32.01 -9.68 L29.40 -6.89 L26.75 -4.40 L23.78 -1.92 L20.64 0.65 L17.33 2.97 L14.00 5.35 L10.58 7.97 Z"/><path class="bloom-petal" data-delay="0.735" pathLength="1" d="M10.49 7.98 L13.09 5.56 L16.15 3.35 L19.29 1.01 L22.34 -1.56 L25.58 -3.79 L28.65 -6.13 L31.07 -8.91 L33.66 -11.37 L36.05 -14.10 L38.81 -16.61 L42.53 -17.25 L46.19 -17.35 L49.54 -18.43 L53.06 -19.16 L56.69 -19.39 L60.29 -18.90 L63.14 -16.43 L65.75 -14.23 L69.44 -13.74 L72.73 -12.26 L74.66 -9.41 L76.16 -6.45 L76.77 -3.22 L77.73 -0.35 L80.35 2.20 L81.20 5.31 L79.42 8.36 L78.28 11.12 L77.65 13.88 L76.86 16.61 L76.36 19.64 L74.32 21.79 L70.97 22.51 L68.75 23.98 L67.03 26.20 L64.66 27.52 L62.08 28.33 L59.39 28.35 L56.79 27.60 L54.38 27.82 L51.87 28.35 L49.58 27.61 L47.57 26.40 L45.67 25.28 L43.92 24.06 L42.17 22.88 L40.62 21.50 L39.25 19.88 L39.11 19.87 L39.84 21.52 L41.22 22.95 L42.94 24.15 L44.76 25.36 L46.79 26.42 L48.95 27.51 L51.41 28.08 L54.07 27.32 L56.61 26.82 L59.30 27.26 L62.05 26.91 L64.62 25.77 L66.93 24.11 L68.55 21.58 L70.61 19.84 L73.76 18.90 L75.59 16.58 L75.85 13.45 L76.41 10.67 L76.83 7.93 L77.79 5.23 L79.43 2.29 L78.49 -0.67 L75.84 -3.05 L74.90 -5.74 L74.37 -8.80 L72.99 -11.62 L71.23 -14.36 L68.14 -15.75 L64.65 -16.21 L62.25 -18.41 L59.60 -20.94 L56.17 -21.51 L52.67 -21.38 L49.25 -20.77 L45.94 -19.80 L42.27 -19.81 L38.50 -19.24 L35.66 -16.75 L33.16 -14.00 L30.46 -11.45 L27.97 -8.60 L24.92 -6.18 L21.71 -3.81 L18.70 -1.00 L15.61 1.69 L12.63 4.42 L10.43 7.86 Z"/><path class="bloom-petal" data-delay="0.805" pathLength="1" d="M10.64 8.04 L14.17 5.94 L17.17 3.44 L20.12 0.83 L23.02 -2.02 L25.86 -4.93 L28.59 -7.94 L31.12 -10.80 L33.68 -13.15 L36.08 -15.53 L38.53 -18.24 L41.13 -20.27 L43.59 -21.56 L45.97 -22.69 L48.18 -23.42 L50.66 -24.73 L53.43 -26.42 L55.10 -26.01 L55.97 -24.49 L57.50 -24.13 L59.07 -23.86 L60.42 -23.31 L61.55 -22.51 L61.04 -20.05 L59.99 -17.34 L60.38 -16.09 L60.59 -14.66 L59.55 -12.37 L58.15 -10.00 L56.23 -7.63 L54.31 -5.49 L53.00 -3.28 L51.21 -0.92 L48.81 0.80 L46.51 2.26 L44.30 3.79 L42.08 5.22 L39.74 7.01 L37.48 8.23 L35.78 8.10 L34.10 8.18 L32.18 8.83 L30.52 9.04 L29.12 8.87 L28.02 8.31 L27.30 7.32 L26.50 6.47 L25.69 5.56 L24.77 4.05 L24.40 3.83 L23.36 4.08 L23.16 4.28 L23.15 4.52 L23.17 4.95 L23.63 4.98 L24.45 4.63 L25.55 3.95 L26.93 2.85 L28.10 2.35 L29.31 2.10 L31.08 0.53 L32.97 -1.57 L34.75 -3.29 L36.55 -5.09 L38.48 -6.79 L40.56 -8.74 L42.06 -11.34 L43.15 -13.79 L44.90 -16.18 L46.70 -18.82 L48.05 -21.47 L49.07 -24.07 L48.89 -25.83 L48.56 -27.40 L49.70 -30.44 L50.32 -33.21 L49.30 -34.28 L48.08 -35.08 L46.62 -35.54 L45.20 -36.02 L44.42 -37.59 L42.83 -37.95 L40.12 -36.13 L37.70 -34.58 L35.53 -33.51 L33.20 -31.93 L30.81 -30.10 L28.32 -27.43 L26.02 -24.00 L23.86 -20.84 L21.63 -17.67 L19.82 -14.33 L18.09 -11.05 L16.20 -7.59 L14.28 -3.95 L12.42 -0.34 L10.81 3.43 L10.27 7.79 Z"/><path class="bloom-petal" data-delay="0.875" pathLength="1" d="M10.59 7.98 L13.26 5.08 L15.07 1.70 L16.79 -1.83 L18.72 -5.41 L20.53 -8.99 L22.43 -12.48 L24.52 -15.76 L26.26 -19.08 L28.31 -22.25 L30.48 -25.55 L31.36 -28.84 L31.51 -31.78 L31.99 -34.70 L32.29 -37.52 L32.70 -40.54 L32.82 -43.52 L31.23 -44.70 L29.34 -45.21 L28.49 -47.26 L27.33 -49.15 L25.50 -49.96 L23.38 -50.20 L20.84 -48.75 L18.46 -47.37 L16.17 -48.04 L13.58 -47.77 L11.16 -45.45 L8.89 -43.12 L6.76 -40.81 L4.62 -38.64 L1.88 -36.95 L-0.30 -34.53 L-1.07 -31.55 L-2.05 -28.97 L-3.53 -26.50 L-4.68 -23.99 L-5.72 -21.44 L-5.98 -19.19 L-5.25 -17.64 L-5.06 -15.89 L-5.27 -13.76 L-4.81 -12.23 L-3.96 -11.20 L-2.99 -10.46 L-1.91 -10.06 L-0.96 -9.57 L-0.00 -9.28 L0.73 -9.55 L0.40 -9.63 L-1.87 -9.75 L-3.68 -10.33 L-5.33 -11.13 L-7.01 -11.85 L-8.51 -12.92 L-9.82 -14.29 L-10.70 -16.14 L-10.86 -18.58 L-11.39 -20.62 L-12.41 -22.42 L-12.44 -24.89 L-11.67 -27.61 L-10.78 -30.26 L-9.55 -32.84 L-8.83 -35.50 L-8.32 -38.54 L-6.40 -41.00 L-3.92 -42.72 L-2.04 -44.92 L-0.16 -47.28 L1.88 -49.66 L4.09 -52.06 L6.50 -52.42 L8.65 -51.88 L10.94 -53.39 L13.44 -54.99 L15.57 -54.91 L17.47 -54.24 L18.76 -52.48 L19.79 -50.53 L21.90 -50.08 L23.76 -48.90 L23.94 -45.87 L23.85 -42.73 L23.89 -39.73 L23.76 -36.56 L23.96 -33.31 L23.43 -29.67 L21.60 -25.97 L19.90 -22.39 L18.52 -18.63 L16.94 -15.15 L15.66 -11.60 L14.47 -7.82 L13.17 -3.91 L12.15 0.09 L11.20 4.04 L10.32 7.86 Z"/><path class="bloom-filament" data-delay="1.150" pathLength="1" d="M18.60 -4.47 C30.17 0.96 58.28 25.00 88.04 28.11 C117.80 31.21 169.66 35.71 197.14 14.15 C224.62 -7.41 243.61 -82.03 252.90 -101.26"/><path class="bloom-filament" data-delay="1.245" pathLength="1" d="M18.60 -4.47 C30.17 -0.18 58.28 19.95 88.04 21.26 C117.80 22.58 169.66 26.12 197.14 3.40 C224.61 -19.31 243.60 -95.31 252.90 -115.05"/><path class="bloom-filament" data-delay="1.340" pathLength="1" d="M18.60 -4.47 C29.77 -1.73 56.83 13.45 85.61 11.99 C114.39 10.54 164.67 12.33 191.28 -13.19 C217.90 -38.72 236.29 -119.84 245.30 -141.17"/><path class="bloom-filament" data-delay="1.435" pathLength="1" d="M18.60 -4.47 C30.53 -3.17 59.56 7.30 90.18 3.33 C120.79 -0.65 174.05 1.24 202.28 -28.33 C230.52 -57.90 250.03 -149.80 259.58 -174.10"/><path class="bloom-filament" data-delay="1.530" pathLength="1" d="M18.60 -4.47 C29.47 -4.49 55.77 1.62 83.84 -4.57 C111.91 -10.76 161.03 -12.75 187.02 -41.62 C213.01 -70.48 230.97 -155.05 239.76 -177.74"/><path class="bloom-filament" data-delay="1.625" pathLength="1" d="M18.60 -4.47 C27.50 -5.75 48.68 -3.86 72.00 -12.14 C95.32 -20.41 136.74 -30.20 158.54 -54.11 C180.34 -78.02 195.40 -138.68 202.77 -155.59"/><path class="bloom-filament bloom-style" data-delay="1.330" pathLength="1" d="M10.46 7.92 C27.89 9.00 82.67 16.58 115.04 14.43 C147.41 12.29 178.04 8.48 204.68 -4.96 C231.33 -18.39 263.20 -55.98 274.90 -66.18"/></g><g><path class="bloom-pedicel" d="M0.00 101.98 C-4.12 97.72 -16.12 83.85 -24.70 76.39 C-33.27 68.93 -46.99 60.41 -51.45 57.22"/><path class="bloom-petal" data-delay="0.420" pathLength="1" d="M-51.36 57.32 L-53.57 56.80 L-55.71 55.39 L-57.99 53.89 L-60.46 52.47 L-62.60 50.78 L-64.83 49.26 L-67.50 48.39 L-69.94 47.25 L-72.56 46.23 L-74.91 44.74 L-75.46 41.97 L-75.52 39.13 L-76.53 36.70 L-77.12 33.97 L-77.12 30.97 L-76.40 27.81 L-73.88 24.83 L-71.69 22.04 L-71.04 18.67 L-69.38 15.44 L-66.43 13.09 L-63.45 11.04 L-60.32 9.60 L-57.53 7.93 L-54.95 5.01 L-51.92 3.57 L-49.17 4.33 L-46.67 4.54 L-44.14 4.30 L-41.66 4.30 L-38.94 4.16 L-37.27 5.48 L-37.08 8.01 L-35.98 9.51 L-34.14 10.61 L-33.33 12.44 L-33.10 14.53 L-33.58 16.78 L-34.71 19.01 L-34.93 21.06 L-34.96 23.20 L-36.17 25.21 L-37.76 26.98 L-39.23 28.65 L-40.77 30.16 L-42.31 31.59 L-44.01 32.77 L-45.98 33.50 L-46.09 33.40 L-44.57 32.10 L-43.03 30.47 L-41.62 28.57 L-40.20 26.57 L-38.88 24.40 L-37.47 22.12 L-36.48 19.62 L-36.71 17.02 L-36.79 14.55 L-35.99 11.94 L-35.85 9.36 L-36.45 6.99 L-37.62 4.95 L-39.81 3.69 L-41.24 2.09 L-41.72 -0.50 L-43.63 -1.84 L-46.53 -1.69 L-49.12 -1.68 L-51.72 -1.42 L-54.21 -1.62 L-56.91 -2.39 L-59.84 -0.99 L-62.31 1.86 L-64.96 3.45 L-67.94 4.78 L-70.78 6.70 L-73.61 8.92 L-75.17 12.01 L-75.75 15.27 L-77.89 17.97 L-80.40 20.89 L-81.13 24.03 L-81.15 27.08 L-80.59 29.90 L-79.61 32.49 L-79.56 35.56 L-79.00 38.61 L-76.60 40.44 L-73.87 41.86 L-71.27 43.44 L-68.40 44.76 L-65.95 46.75 L-63.53 48.94 L-60.69 50.91 L-57.92 53.05 L-55.11 55.22 L-51.55 57.12 Z"/><path class="bloom-petal" data-delay="0.490" pathLength="1" d="M-51.32 57.11 L-53.36 55.11 L-55.92 52.91 L-58.66 50.73 L-61.51 48.65 L-64.21 46.24 L-66.91 44.08 L-69.68 42.75 L-72.62 41.11 L-75.62 39.52 L-78.58 37.39 L-80.85 33.93 L-82.88 30.58 L-85.49 27.87 L-87.84 24.78 L-89.67 21.37 L-90.97 17.87 L-90.92 14.48 L-91.22 11.35 L-93.03 7.84 L-93.61 4.54 L-92.45 2.19 L-91.32 0.09 L-89.93 -1.60 L-88.92 -3.51 L-88.62 -6.37 L-86.86 -7.54 L-83.98 -6.56 L-81.84 -6.50 L-79.98 -7.05 L-77.88 -7.11 L-75.69 -7.12 L-73.31 -5.59 L-71.16 -2.86 L-69.04 -1.58 L-66.70 -0.81 L-64.68 1.08 L-62.94 3.33 L-61.52 5.75 L-60.48 8.22 L-58.93 10.25 L-57.31 12.34 L-56.70 14.69 L-56.48 16.91 L-56.15 19.04 L-55.98 21.12 L-55.92 23.19 L-56.20 25.18 L-56.93 27.32 L-57.03 27.60 L-56.84 26.77 L-56.91 25.31 L-57.34 23.57 L-57.91 21.71 L-58.70 19.73 L-59.43 17.61 L-60.57 15.37 L-62.76 13.38 L-64.90 11.47 L-66.53 9.16 L-68.52 6.94 L-70.81 4.93 L-73.35 3.33 L-76.15 2.89 L-78.65 1.97 L-81.13 -0.36 L-83.77 -1.50 L-86.14 -1.09 L-88.35 -0.64 L-90.26 0.26 L-92.38 0.50 L-95.21 -0.22 L-96.87 1.14 L-97.05 4.12 L-97.94 6.07 L-99.20 7.72 L-100.22 9.72 L-101.28 11.91 L-100.64 14.98 L-98.79 18.24 L-98.47 21.08 L-98.53 24.17 L-97.24 27.38 L-95.43 30.50 L-93.07 33.32 L-90.43 35.79 L-88.33 38.93 L-85.94 42.19 L-82.78 44.15 L-79.51 45.57 L-76.23 47.02 L-72.97 48.17 L-69.72 50.08 L-66.43 52.16 L-62.91 53.82 L-59.35 55.46 L-55.73 56.93 L-51.58 57.32 Z"/><path class="bloom-petal" data-delay="0.560" pathLength="1" d="M-51.39 57.00 L-54.21 54.36 L-57.64 52.51 L-61.28 50.84 L-65.01 49.31 L-68.78 47.94 L-72.18 46.60 L-75.02 45.27 L-78.57 44.01 L-82.42 42.91 L-86.34 41.98 L-90.15 41.30 L-93.90 40.62 L-97.94 39.89 L-101.43 39.62 L-104.08 39.74 L-106.74 39.84 L-109.16 40.05 L-111.86 40.21 L-114.74 40.38 L-115.18 41.15 L-114.29 42.16 L-115.17 42.77 L-116.18 43.35 L-116.13 44.10 L-115.56 44.89 L-113.22 45.85 L-110.61 46.73 L-109.98 47.39 L-108.96 48.09 L-106.30 48.79 L-103.55 49.41 L-100.85 49.94 L-98.28 50.41 L-95.96 51.02 L-93.31 51.57 L-90.74 51.78 L-88.42 52.00 L-86.01 52.36 L-83.68 52.70 L-81.31 53.08 L-79.33 53.37 L-78.23 53.45 L-76.99 53.66 L-75.39 54.05 L-74.32 54.38 L-73.69 54.70 L-73.32 55.12 L-73.01 56.02 L-72.87 56.44 L-72.48 57.64 L-72.51 58.36 L-72.91 58.99 L-73.87 59.51 L-75.46 59.91 L-76.80 60.42 L-78.11 61.01 L-80.40 61.36 L-83.17 61.56 L-85.99 61.77 L-88.95 61.92 L-91.88 62.18 L-95.08 62.40 L-98.37 62.25 L-101.31 62.01 L-104.46 61.88 L-107.68 61.66 L-110.87 61.34 L-113.86 60.92 L-115.10 60.48 L-115.83 60.06 L-118.42 59.41 L-120.64 58.67 L-120.99 58.07 L-120.75 57.50 L-119.38 57.07 L-118.11 56.58 L-118.60 55.66 L-117.78 54.93 L-114.55 54.76 L-111.55 54.55 L-108.89 54.24 L-106.08 53.97 L-103.35 53.61 L-99.86 53.57 L-95.89 53.92 L-92.26 54.15 L-88.60 54.31 L-84.85 54.63 L-81.16 55.07 L-77.73 55.58 L-74.70 56.15 L-70.87 56.69 L-66.77 57.13 L-62.79 57.55 L-58.92 57.90 L-55.20 58.07 L-51.52 57.43 Z"/><path class="bloom-petal" data-delay="0.630" pathLength="1" d="M-51.52 57.07 L-55.42 55.34 L-59.34 54.65 L-63.33 54.28 L-67.30 54.25 L-71.21 54.66 L-74.81 54.32 L-78.02 52.87 L-81.86 52.16 L-85.82 52.25 L-89.70 52.97 L-93.38 54.50 L-96.90 55.40 L-100.57 55.89 L-103.65 58.07 L-105.87 61.12 L-108.03 63.71 L-109.92 66.33 L-112.03 68.82 L-114.28 71.48 L-114.22 74.59 L-112.93 77.36 L-113.35 80.08 L-113.91 82.99 L-113.48 85.69 L-112.60 88.22 L-110.17 89.70 L-107.54 90.71 L-106.72 93.25 L-105.57 95.74 L-102.94 96.45 L-100.23 96.79 L-97.56 96.89 L-95.03 96.96 L-92.89 98.23 L-90.45 98.81 L-87.82 97.40 L-85.46 96.22 L-83.16 95.74 L-80.91 95.07 L-78.64 94.40 L-76.62 93.25 L-75.25 91.52 L-73.78 90.14 L-71.99 89.00 L-70.58 87.64 L-69.50 86.22 L-68.56 84.85 L-67.37 83.68 L-67.02 83.84 L-66.44 85.97 L-66.50 88.07 L-66.94 90.23 L-67.88 92.38 L-69.34 94.33 L-70.62 96.52 L-71.92 99.03 L-73.96 100.93 L-76.34 102.29 L-78.75 103.59 L-81.26 104.61 L-83.84 106.26 L-86.70 108.04 L-89.37 107.74 L-91.71 106.66 L-94.41 106.69 L-97.21 106.61 L-99.99 106.21 L-102.65 105.36 L-103.75 102.68 L-104.45 99.90 L-106.90 98.61 L-109.09 96.83 L-109.66 93.98 L-109.73 90.99 L-108.78 87.83 L-107.96 84.90 L-108.84 81.99 L-108.55 78.80 L-106.00 76.14 L-103.67 73.70 L-101.66 71.19 L-99.48 68.72 L-97.36 65.79 L-94.48 63.71 L-91.08 63.27 L-87.91 62.35 L-84.65 60.74 L-81.21 59.85 L-77.73 59.49 L-74.38 59.84 L-71.41 60.88 L-67.91 60.70 L-64.27 59.67 L-60.72 58.96 L-57.30 58.44 L-54.10 57.97 L-51.39 57.37 Z"/><path class="bloom-petal" data-delay="0.700" pathLength="1" d="M-51.58 57.35 L-55.46 57.81 L-58.67 58.50 L-61.70 59.42 L-64.80 60.08 L-67.95 60.52 L-71.21 60.42 L-74.55 60.06 L-77.82 60.77 L-80.96 61.23 L-84.33 61.02 L-87.20 61.85 L-89.38 63.59 L-91.07 65.71 L-91.94 68.39 L-93.33 70.40 L-95.49 72.05 L-95.79 74.87 L-94.64 77.97 L-94.03 80.73 L-93.37 83.48 L-92.76 86.43 L-92.05 89.78 L-89.73 92.17 L-86.87 93.56 L-84.76 96.05 L-82.51 98.92 L-79.78 100.95 L-76.89 102.57 L-74.01 102.74 L-71.35 102.24 L-68.34 103.57 L-65.13 104.81 L-62.66 103.92 L-60.54 102.56 L-58.62 101.11 L-56.92 99.55 L-54.62 98.69 L-52.72 97.28 L-52.41 94.69 L-52.27 92.28 L-51.71 90.19 L-51.50 87.98 L-51.55 85.71 L-52.07 83.45 L-53.15 81.43 L-54.15 79.47 L-55.15 77.50 L-56.06 75.54 L-55.80 75.33 L-53.47 76.21 L-51.73 77.63 L-50.10 79.14 L-48.47 80.77 L-47.43 82.68 L-46.90 84.63 L-46.65 86.55 L-46.76 88.38 L-46.46 90.57 L-46.35 92.97 L-47.85 94.24 L-49.77 94.99 L-51.13 96.48 L-52.74 97.89 L-54.58 99.24 L-56.84 100.15 L-59.87 98.94 L-62.78 97.65 L-65.39 98.19 L-68.30 98.05 L-71.29 96.43 L-74.18 94.37 L-76.68 91.41 L-79.09 88.78 L-82.32 87.16 L-85.04 84.46 L-86.19 80.71 L-87.22 77.27 L-88.27 73.96 L-89.19 70.61 L-90.57 66.92 L-90.38 63.57 L-88.24 61.49 L-86.79 59.17 L-85.79 56.33 L-83.95 54.20 L-81.60 52.59 L-78.60 52.02 L-75.14 52.62 L-71.97 52.65 L-68.74 52.54 L-65.90 53.50 L-63.33 54.29 L-60.74 54.62 L-58.17 54.82 L-55.73 54.87 L-53.33 55.35 L-51.33 57.09 Z"/><path class="bloom-petal" data-delay="0.770" pathLength="1" d="M-51.52 57.43 L-54.87 58.21 L-57.71 58.29 L-60.43 58.21 L-62.91 58.07 L-64.91 57.91 L-67.45 57.64 L-70.80 57.27 L-73.59 56.86 L-75.79 56.44 L-77.32 56.02 L-77.78 55.69 L-78.88 55.21 L-80.80 54.49 L-80.80 54.04 L-79.33 53.82 L-78.14 53.51 L-76.72 53.21 L-75.82 52.75 L-75.14 52.17 L-72.34 52.16 L-68.78 52.42 L-66.50 52.31 L-64.31 52.15 L-61.72 52.16 L-58.97 52.27 L-55.97 52.68 L-53.31 53.15 L-50.66 53.39 L-47.76 53.72 L-45.38 54.23 L-43.33 54.75 L-41.69 55.27 L-40.24 55.78 L-37.72 56.39 L-35.48 57.01 L-35.12 57.43 L-34.88 57.79 L-34.04 58.21 L-33.36 58.57 L-32.48 58.95 L-32.24 59.17 L-33.19 59.09 L-33.81 59.00 L-33.93 58.95 L-34.48 58.74 L-35.33 58.35 L-36.32 57.79 L-37.21 56.81 L-37.00 56.47 L-35.10 55.97 L-33.46 55.75 L-32.01 55.48 L-30.91 55.10 L-30.29 54.58 L-29.22 54.11 L-27.90 53.65 L-27.84 52.88 L-28.50 51.95 L-29.05 51.02 L-29.85 50.04 L-30.14 49.12 L-30.62 48.16 L-33.06 46.99 L-35.84 45.85 L-37.59 44.83 L-39.57 43.83 L-41.97 42.85 L-44.70 41.93 L-47.91 41.23 L-50.84 40.67 L-53.73 39.93 L-56.88 39.31 L-59.72 39.05 L-62.33 38.94 L-64.46 39.05 L-66.62 39.18 L-70.00 38.97 L-72.58 39.09 L-73.00 39.82 L-73.64 40.47 L-74.83 40.98 L-75.80 41.55 L-77.09 42.05 L-76.98 42.82 L-75.01 43.88 L-73.94 44.74 L-73.59 45.48 L-72.24 46.35 L-70.28 47.27 L-67.80 48.23 L-64.61 49.28 L-62.14 50.34 L-60.36 51.35 L-58.23 52.44 L-55.96 53.62 L-53.71 54.94 L-51.38 57.00 Z"/><path class="bloom-filament" data-delay="0.920" pathLength="1" d="M-63.52 53.95 C-73.39 57.33 -96.17 73.91 -122.75 74.22 C-149.33 74.52 -197.76 75.45 -223.01 55.78 C-248.26 36.11 -265.71 -27.20 -274.25 -43.80"/><path class="bloom-filament" data-delay="1.015" pathLength="1" d="M-63.52 53.95 C-74.74 56.83 -101.03 71.16 -130.87 71.21 C-160.70 71.27 -214.42 68.19 -242.54 54.27 C-270.67 40.35 -290.11 -1.21 -299.62 -12.31"/><path class="bloom-filament" data-delay="1.110" pathLength="1" d="M-63.52 53.95 C-73.40 56.60 -96.20 69.40 -122.81 69.86 C-149.41 70.32 -197.88 75.86 -223.15 56.73 C-248.42 37.60 -265.89 -27.98 -274.44 -44.92"/><path class="bloom-filament" data-delay="1.205" pathLength="1" d="M-63.52 53.95 C-71.61 56.18 -89.79 66.93 -112.09 67.32 C-134.40 67.72 -175.90 75.44 -197.37 56.34 C-218.85 37.23 -233.69 -30.04 -240.96 -47.31"/><path class="bloom-filament" data-delay="1.300" pathLength="1" d="M-63.52 53.95 C-70.39 55.76 -85.38 64.46 -104.74 64.79 C-124.09 65.12 -160.79 64.24 -179.67 55.95 C-198.54 47.66 -211.58 21.87 -217.96 15.06"/><path class="bloom-filament" data-delay="1.395" pathLength="1" d="M-63.52 53.95 C-69.29 55.11 -81.43 61.18 -98.14 60.92 C-114.85 60.65 -147.25 64.46 -163.79 52.34 C-180.32 40.23 -191.75 -1.10 -197.34 -11.78"/><path class="bloom-filament bloom-style" data-delay="1.100" pathLength="1" d="M-51.45 57.22 C-66.44 60.83 -113.53 76.33 -141.36 78.87 C-169.19 81.40 -195.52 82.03 -218.43 72.45 C-241.33 62.87 -268.73 29.89 -278.79 21.38"/></g><g><path class="bloom-pedicel" d="M0.00 101.98 C0.81 98.09 3.16 86.90 4.83 78.60 C6.51 70.30 9.20 56.59 10.07 52.19"/><path class="bloom-petal" data-delay="0.000" pathLength="1" d="M10.08 52.41 L11.21 53.49 L13.06 53.62 L15.37 53.52 L17.72 53.25 L19.89 52.86 L21.18 52.35 L22.00 51.78 L24.27 51.14 L26.62 50.52 L28.18 49.87 L30.08 49.26 L32.26 48.70 L34.86 48.25 L38.22 48.08 L40.89 47.93 L42.92 47.57 L45.42 47.44 L47.91 47.66 L50.09 47.96 L51.84 48.42 L53.84 48.77 L57.00 48.93 L58.96 49.48 L59.07 50.35 L59.99 51.06 L61.43 51.71 L62.84 52.37 L64.62 53.01 L64.37 53.75 L62.48 54.48 L62.48 55.07 L63.25 55.59 L62.69 56.06 L61.63 56.45 L59.80 56.71 L57.56 56.82 L56.57 56.94 L55.65 57.03 L53.56 56.88 L51.35 56.60 L49.38 56.26 L47.46 55.86 L45.60 55.47 L43.66 55.00 L41.90 54.33 L40.28 53.60 L38.65 52.81 L37.13 51.45 L37.08 51.02 L38.35 50.06 L39.88 49.63 L41.47 49.37 L43.27 49.16 L45.30 48.83 L47.30 48.47 L49.43 48.18 L51.65 47.85 L54.16 47.51 L56.58 47.06 L57.85 46.40 L59.21 45.74 L61.82 45.11 L64.03 44.37 L65.47 43.52 L66.39 42.61 L65.95 41.67 L66.25 40.70 L68.39 39.60 L68.84 38.52 L67.17 37.56 L65.78 36.61 L64.26 35.70 L63.13 34.76 L62.66 33.69 L60.20 32.98 L56.37 32.72 L53.55 32.32 L50.90 31.88 L47.77 31.67 L44.38 31.62 L41.07 31.97 L38.38 32.62 L35.22 33.11 L31.54 33.67 L28.79 34.55 L26.60 35.59 L24.81 36.74 L23.45 37.97 L21.38 39.25 L19.45 40.61 L19.08 41.94 L18.25 43.30 L16.48 44.71 L14.47 46.18 L12.45 47.72 L10.88 49.42 L10.06 51.96 Z"/><path class="bloom-petal" data-delay="0.070" pathLength="1" d="M10.27 52.30 L12.73 52.21 L14.65 50.99 L16.54 49.22 L18.34 47.26 L19.98 45.33 L21.15 44.24 L22.00 43.67 L23.46 41.61 L25.00 39.14 L26.28 37.10 L27.61 34.82 L28.94 32.42 L30.38 29.65 L31.89 26.30 L33.16 23.45 L34.49 20.86 L35.84 18.11 L36.93 15.66 L37.85 13.57 L38.31 12.34 L38.96 10.90 L40.41 8.01 L41.18 6.38 L40.91 6.84 L40.82 6.98 L40.82 6.97 L40.87 6.81 L41.19 6.00 L40.64 7.03 L39.34 9.77 L38.56 11.22 L37.99 12.01 L37.08 13.48 L36.02 15.18 L34.75 17.39 L33.48 19.68 L32.27 21.42 L30.90 23.27 L29.59 25.15 L28.42 26.77 L27.29 28.20 L26.25 29.39 L25.04 30.80 L23.88 32.10 L23.13 32.57 L22.48 32.74 L21.74 32.88 L20.64 32.58 L20.21 32.45 L19.00 32.11 L18.50 31.65 L18.12 31.23 L17.96 30.53 L18.31 28.97 L18.80 27.25 L19.20 25.68 L19.78 23.79 L20.50 21.61 L21.45 19.07 L22.54 16.50 L23.54 13.99 L24.66 10.90 L25.82 7.90 L26.80 5.43 L27.66 3.23 L28.19 1.77 L28.94 -0.28 L30.21 -3.54 L30.72 -5.00 L30.35 -4.52 L30.22 -4.58 L30.12 -4.66 L30.07 -4.77 L30.18 -5.04 L29.20 -3.08 L27.49 0.29 L26.54 2.35 L25.75 4.33 L24.49 7.25 L23.06 10.56 L21.42 14.15 L19.87 17.50 L18.48 20.99 L16.97 24.84 L15.67 27.97 L14.59 30.61 L13.65 33.05 L12.89 35.16 L11.98 37.68 L11.26 39.78 L11.28 40.38 L11.08 41.57 L10.48 43.71 L9.85 46.03 L9.32 48.31 L9.09 50.26 L9.88 52.07 Z"/><path class="bloom-petal" data-delay="0.140" pathLength="1" d="M10.28 52.11 L12.63 50.31 L13.79 48.34 L14.56 46.20 L15.00 43.90 L15.15 41.45 L15.82 39.84 L17.15 39.24 L17.84 37.73 L17.87 35.58 L17.55 33.24 L16.77 30.62 L16.35 28.54 L15.99 26.58 L14.33 23.66 L12.17 20.70 L10.49 18.24 L8.79 15.86 L7.02 13.46 L5.09 10.98 L3.01 9.44 L1.25 8.59 L-0.66 6.62 L-2.71 4.54 L-4.42 3.44 L-5.92 2.73 L-6.76 3.18 L-7.46 3.67 L-9.26 2.27 L-10.74 1.44 L-10.80 2.71 L-10.76 4.00 L-10.81 5.07 L-10.87 6.06 L-11.55 6.35 L-11.58 7.43 L-10.38 9.75 L-9.57 11.58 L-9.33 12.92 L-8.87 14.50 L-8.31 16.19 L-7.53 18.01 L-6.58 19.76 L-5.88 21.46 L-5.25 23.35 L-4.56 25.12 L-3.93 26.75 L-3.41 28.38 L-3.28 30.40 L-3.55 30.76 L-5.27 30.65 L-6.77 29.89 L-8.33 28.83 L-9.96 27.42 L-11.55 25.70 L-13.21 24.02 L-15.13 22.18 L-16.85 20.18 L-18.31 18.25 L-19.62 16.44 L-20.64 14.87 L-22.15 12.84 L-23.98 10.38 L-24.50 9.21 L-24.29 8.91 L-24.61 7.97 L-24.87 7.03 L-25.15 5.94 L-25.24 4.94 L-23.83 6.11 L-22.05 7.93 L-21.29 7.91 L-20.35 7.99 L-18.69 9.27 L-16.78 10.96 L-14.51 13.64 L-12.36 16.18 L-10.38 17.55 L-8.12 19.53 L-6.03 22.32 L-4.15 24.89 L-2.36 27.28 L-0.61 29.62 L1.61 32.32 L3.37 34.86 L3.87 36.36 L4.50 37.91 L5.57 39.97 L6.28 41.73 L6.73 43.30 L6.64 44.23 L5.98 44.33 L6.11 45.50 L6.90 47.46 L7.57 49.19 L8.14 50.66 L8.72 51.83 L9.87 52.26 Z"/><path class="bloom-petal" data-delay="0.210" pathLength="1" d="M10.11 51.97 L10.67 49.60 L10.47 48.01 L9.79 46.63 L8.82 45.41 L7.80 44.31 L7.91 43.29 L8.95 42.35 L8.52 41.44 L7.24 40.66 L6.08 39.98 L4.60 39.40 L3.40 38.85 L1.78 38.37 L-1.68 38.23 L-5.20 38.24 L-7.66 38.03 L-10.39 37.86 L-13.51 37.84 L-16.78 37.91 L-19.96 38.31 L-22.77 38.63 L-26.09 38.53 L-29.41 38.58 L-31.75 38.96 L-33.82 39.30 L-35.48 39.66 L-37.33 39.93 L-40.53 40.09 L-42.43 40.40 L-41.90 40.83 L-42.02 41.20 L-42.92 41.57 L-43.48 41.99 L-44.16 42.47 L-43.45 42.94 L-41.24 43.32 L-40.17 43.82 L-39.80 44.47 L-38.45 45.07 L-36.64 45.63 L-34.58 46.17 L-32.36 46.67 L-30.44 47.31 L-28.45 48.01 L-26.25 48.58 L-24.09 49.14 L-21.99 49.78 L-19.88 50.85 L-19.83 51.29 L-21.78 52.27 L-23.94 52.71 L-26.25 53.05 L-28.69 53.27 L-30.99 53.28 L-33.29 53.29 L-35.94 53.38 L-38.45 53.38 L-40.73 53.31 L-42.55 53.17 L-43.37 52.93 L-44.85 52.81 L-47.43 52.77 L-48.43 52.61 L-47.98 52.41 L-47.57 52.24 L-46.72 52.10 L-46.57 51.94 L-46.95 51.70 L-44.83 51.57 L-41.29 51.58 L-39.02 51.45 L-36.86 51.24 L-34.23 51.03 L-31.27 50.78 L-27.32 50.84 L-23.37 51.06 L-19.95 50.83 L-16.23 50.51 L-12.52 50.50 L-9.05 50.56 L-6.09 50.72 L-3.54 50.88 L-0.03 50.77 L3.32 50.73 L4.74 50.98 L5.69 51.22 L6.88 51.41 L7.74 51.63 L8.72 51.86 L8.88 52.14 L7.62 52.36 L7.34 52.59 L8.24 52.79 L9.14 52.97 L9.83 53.11 L10.15 53.12 L10.04 52.40 Z"/><path class="bloom-petal" data-delay="0.280" pathLength="1" d="M9.87 52.08 L8.77 50.88 L8.10 50.66 L7.57 50.50 L7.14 50.29 L6.48 50.56 L6.00 50.57 L6.02 49.74 L5.92 49.19 L5.86 48.65 L5.49 48.74 L4.14 50.52 L2.84 52.30 L2.16 53.21 L1.18 54.76 L-0.17 57.00 L-1.72 59.66 L-3.63 62.90 L-5.22 65.80 L-6.44 68.44 L-7.97 71.56 L-9.59 74.70 L-11.02 77.65 L-12.30 80.40 L-13.54 83.24 L-15.01 86.66 L-16.06 89.13 L-16.35 90.11 L-16.89 91.68 L-17.69 93.75 L-18.29 95.38 L-18.87 96.93 L-18.67 97.01 L-17.77 95.83 L-17.74 96.11 L-18.07 96.92 L-17.63 96.36 L-16.89 95.24 L-15.99 93.83 L-14.96 92.20 L-14.37 91.22 L-13.75 90.17 L-12.60 88.37 L-11.38 86.52 L-10.26 84.87 L-9.08 83.24 L-7.83 81.65 L-6.45 80.11 L-4.61 78.84 L-4.25 79.01 L-4.30 81.34 L-4.77 83.62 L-5.29 85.92 L-5.83 88.24 L-6.36 90.55 L-7.01 93.02 L-7.59 95.40 L-7.65 96.96 L-7.67 98.39 L-8.12 100.39 L-8.44 102.10 L-8.59 103.43 L-8.44 104.15 L-7.52 103.41 L-6.99 103.16 L-7.35 104.32 L-7.04 104.21 L-6.00 102.61 L-4.99 100.93 L-3.84 98.83 L-3.01 97.24 L-2.50 96.29 L-1.30 93.88 L0.26 90.57 L1.52 87.87 L2.77 85.28 L4.11 82.51 L5.60 79.57 L6.95 76.63 L7.96 74.15 L9.31 71.39 L10.97 68.23 L12.25 65.61 L13.31 63.33 L14.00 61.68 L14.35 60.58 L15.31 58.53 L16.29 56.42 L16.25 55.92 L15.85 55.99 L15.43 56.01 L14.78 56.28 L14.56 55.65 L14.39 54.73 L13.84 54.22 L13.19 53.58 L12.32 52.85 L10.27 52.29 Z"/><path class="bloom-petal" data-delay="0.350" pathLength="1" d="M9.91 52.33 L9.77 52.91 L10.63 53.73 L11.75 54.68 L12.82 55.30 L13.90 55.84 L14.81 56.03 L15.62 55.97 L16.97 56.73 L18.05 57.13 L18.92 57.11 L20.38 58.53 L22.12 60.93 L23.76 63.39 L25.37 66.14 L26.87 68.48 L28.50 70.89 L29.99 74.34 L31.05 77.80 L32.31 80.94 L33.65 84.18 L34.95 87.54 L36.22 90.96 L36.33 93.24 L35.99 94.76 L36.87 97.64 L37.76 100.57 L37.65 102.03 L37.26 102.90 L36.37 102.73 L35.48 102.31 L35.49 103.47 L35.14 103.92 L33.80 102.05 L32.55 100.08 L31.51 98.43 L30.47 96.65 L29.49 95.12 L28.36 92.93 L27.32 90.00 L26.42 87.42 L25.43 85.06 L24.55 82.60 L23.82 80.17 L23.30 77.90 L23.09 75.94 L22.88 74.02 L22.79 72.14 L23.35 70.38 L23.71 70.14 L24.86 70.83 L25.89 72.18 L26.90 73.69 L27.83 75.29 L29.01 77.22 L30.36 79.34 L31.81 81.49 L33.33 83.55 L34.72 85.82 L36.23 88.47 L37.80 90.39 L39.21 91.67 L40.65 93.24 L42.07 94.70 L43.70 96.53 L45.41 98.29 L46.12 97.77 L46.46 96.56 L47.68 96.96 L48.89 97.12 L49.58 96.26 L49.97 94.82 L49.32 91.89 L48.63 88.98 L49.12 87.40 L49.09 85.03 L47.84 81.46 L46.47 77.90 L44.98 74.39 L43.49 70.95 L42.10 67.18 L40.23 63.41 L38.15 60.71 L36.16 58.13 L34.03 55.22 L31.85 52.69 L29.56 50.33 L27.55 49.06 L26.13 49.32 L24.50 49.28 L22.60 48.97 L21.31 49.53 L19.93 49.93 L18.26 50.07 L16.44 50.21 L14.41 50.15 L12.39 50.45 L10.23 52.04 Z"/><path class="bloom-filament" data-delay="0.000" pathLength="1" d="M12.76 49.46 C10.09 55.28 2.56 78.08 -3.21 84.39 C-8.99 90.70 -17.19 106.81 -21.89 87.33 C-26.60 67.85 -29.85 -12.52 -31.44 -32.49"/><path class="bloom-filament" data-delay="0.095" pathLength="1" d="M12.76 49.46 C12.17 54.47 10.01 74.22 9.23 79.54 C8.44 84.86 8.34 92.41 8.04 81.38 C7.74 70.35 7.53 24.71 7.43 13.37"/><path class="bloom-filament" data-delay="0.190" pathLength="1" d="M12.76 49.46 C14.04 53.52 16.72 69.84 20.43 73.82 C24.14 77.80 31.33 91.36 35.00 73.34 C38.67 55.32 41.20 -16.36 42.44 -34.30"/><path class="bloom-filament" data-delay="0.285" pathLength="1" d="M12.76 49.46 C15.05 52.53 20.35 65.34 26.49 67.90 C32.63 70.45 43.76 73.10 49.58 64.79 C55.39 56.48 59.41 25.83 61.38 18.04"/><path class="bloom-filament" data-delay="0.380" pathLength="1" d="M12.76 49.46 C17.70 51.79 29.91 61.73 42.44 63.45 C54.98 65.17 76.50 64.29 87.96 59.80 C99.43 55.32 107.35 40.41 111.23 36.53"/><path class="bloom-filament" data-delay="0.475" pathLength="1" d="M12.76 49.46 C20.42 50.63 39.67 56.59 58.75 56.46 C77.82 56.33 109.96 59.59 127.20 48.70 C144.44 37.81 156.35 0.72 162.19 -8.88"/><path class="bloom-filament bloom-style" data-delay="0.180" pathLength="1" d="M10.07 52.19 C13.50 57.73 24.28 79.30 30.64 85.43 C37.01 91.56 43.03 95.58 48.27 88.95 C53.52 82.33 59.78 52.89 62.09 45.67"/></g></g></defs>\r
<use href="#bloom-umbel" class="bloom-flower-halo" filter="url(#bloom-halo)"/>\r
<use href="#bloom-umbel"/>\r
<g class="bloom-trace-tips"/>\r
</svg>`,gu=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-326.65 -275.13 672.29 526.45" fill="none" aria-hidden="true" class="lycoris-mark">\r
<g stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path class="bloom-petal" data-delay="0.210" pathLength="1" d="M23.67 -6.59 L24.35 -18.00 L25.75 -29.89 L27.18 -40.87 L27.71 -50.87 L22.83 -58.06 L18.17 -64.01 L11.22 -65.30 L4.17 -64.26 L-3.03 -61.27 L-7.25 -54.18 L-12.01 -47.49 L-11.08 -39.56 L-10.48 -32.31 L-6.12 -27.38 L-1.21 -24.07 L4.59 -23.42 L2.25 -23.55 L-2.36 -25.32 L-6.13 -30.14 L-8.68 -36.87 L-9.61 -45.26 L-6.16 -53.67 L-2.57 -63.00 L6.04 -67.28 L14.38 -72.21 L23.31 -69.29 L31.19 -64.47 L35.65 -55.32 L35.86 -44.28 L33.35 -32.74 L28.79 -22.03 L26.06 -10.09 Z"/><path class="bloom-petal" data-delay="0.350" pathLength="1" d="M23.68 -6.67 L29.45 -16.87 L36.28 -26.92 L43.21 -36.51 L50.91 -44.37 L59.14 -47.12 L66.00 -46.68 L71.05 -43.02 L71.50 -35.43 L71.78 -27.21 L66.30 -19.19 L61.45 -11.03 L54.90 -7.55 L49.12 -5.57 L45.14 -7.37 L43.60 -11.42 L44.68 -16.10 L45.64 -11.47 L47.46 -5.67 L52.30 -2.84 L58.18 -1.43 L65.48 -4.47 L72.67 -10.31 L79.36 -18.30 L81.48 -27.68 L83.16 -37.48 L77.46 -42.55 L70.69 -46.79 L60.54 -43.52 L50.24 -37.18 L41.71 -27.07 L35.00 -17.90 L26.40 -9.22 Z"/><path class="bloom-petal" data-delay="0.490" pathLength="1" d="M23.98 -6.49 L31.58 -14.15 L37.56 -23.12 L43.01 -31.66 L48.04 -38.34 L51.56 -39.14 L54.17 -37.43 L55.13 -32.11 L53.84 -23.87 L51.75 -15.16 L47.70 -7.47 L43.11 0.11 L38.98 2.35 L35.05 3.39 L32.81 0.23 L31.87 -4.87 L31.28 -11.26 L27.91 -8.41 L25.56 -3.51 L25.52 -1.00 L26.63 0.20 L29.43 -2.55 L33.04 -8.77 L36.92 -17.06 L39.71 -27.50 L42.46 -38.55 L41.84 -45.29 L40.88 -50.76 L37.25 -48.64 L33.08 -42.35 L28.77 -31.79 L25.80 -21.29 L23.30 -10.88 Z"/><path class="bloom-filament" data-delay="0.460" pathLength="1" d="M29.86 -19.92 C37.91 -22.79 57.36 -22.67 78.15 -37.15 C98.94 -51.64 135.36 -79.95 154.62 -106.84 C173.87 -133.73 187.19 -183.22 193.70 -198.49"/><path class="bloom-filament" data-delay="0.555" pathLength="1" d="M29.86 -19.92 C37.18 -25.00 54.74 -31.18 73.77 -50.37 C92.81 -69.56 126.38 -102.24 144.08 -135.04 C161.79 -167.84 174.03 -228.50 180.02 -247.20"/><path class="bloom-filament" data-delay="0.650" pathLength="1" d="M29.86 -19.92 C34.92 -26.01 46.62 -35.42 60.22 -56.45 C73.82 -77.47 98.57 -117.02 111.47 -146.06 C124.38 -175.09 133.30 -216.54 137.67 -230.64"/><path class="bloom-filament" data-delay="0.745" pathLength="1" d="M29.86 -19.92 C33.20 -26.84 40.44 -39.03 49.90 -61.46 C59.37 -83.89 77.39 -124.86 86.65 -154.51 C95.90 -184.16 102.30 -225.21 105.43 -239.35"/><path class="bloom-filament" data-delay="0.840" pathLength="1" d="M29.86 -19.92 C31.47 -28.63 34.24 -46.06 39.55 -72.20 C44.86 -98.34 56.14 -146.26 61.73 -176.75 C67.31 -207.24 71.17 -242.07 73.06 -255.13"/><path class="bloom-filament" data-delay="0.935" pathLength="1" d="M29.86 -19.92 C29.62 -28.16 27.59 -44.95 28.45 -69.35 C29.32 -93.74 33.38 -140.94 35.03 -166.29 C36.69 -191.64 37.83 -212.24 38.40 -221.43"/><path class="bloom-filament bloom-style" data-delay="0.640" pathLength="1" d="M23.78 -6.58 C31.44 -18.10 55.52 -51.69 69.74 -75.71 C83.97 -99.73 97.43 -123.57 109.15 -150.70 C120.86 -177.83 134.87 -223.84 140.01 -238.47"/><path class="bloom-petal" data-delay="0.315" pathLength="1" d="M-34.21 6.53 L-44.04 -0.17 L-52.57 -8.57 L-60.58 -16.98 L-67.97 -24.26 L-72.78 -26.83 L-76.50 -27.64 L-77.09 -24.34 L-75.09 -18.47 L-71.81 -11.79 L-65.99 -4.49 L-59.69 2.41 L-54.18 5.81 L-48.82 8.32 L-46.21 6.82 L-45.24 3.52 L-45.53 -1.91 L-42.15 -0.62 L-39.79 2.12 L-40.43 2.52 L-42.86 1.22 L-47.41 -2.97 L-53.36 -10.19 L-59.78 -18.78 L-64.30 -27.49 L-68.88 -36.55 L-68.20 -40.24 L-66.45 -42.01 L-60.82 -37.67 L-53.73 -29.55 L-46.25 -18.88 L-40.47 -8.67 L-34.76 2.01 Z"/><path class="bloom-petal" data-delay="0.455" pathLength="1" d="M-34.04 6.36 L-39.25 -4.87 L-42.70 -16.34 L-49.09 -26.96 L-49.83 -38.51 L-47.44 -48.26 L-41.44 -55.01 L-32.87 -56.50 L-24.12 -57.12 L-16.89 -50.89 L-9.03 -46.00 L-6.35 -37.63 L-3.75 -30.33 L-4.99 -23.73 L-8.00 -18.70 L-12.34 -15.00 L-18.12 -13.10 L-14.33 -11.51 L-8.48 -13.43 L-2.89 -17.45 L-1.53 -24.89 L-1.59 -33.39 L-6.19 -41.94 L-13.80 -48.88 L-22.50 -54.79 L-32.55 -54.21 L-41.99 -53.74 L-47.02 -46.22 L-51.37 -38.25 L-49.68 -28.00 L-45.15 -17.59 L-39.98 -7.19 L-35.92 3.46 Z"/><path class="bloom-petal" data-delay="0.595" pathLength="1" d="M-33.90 6.30 L-40.52 -2.26 L-48.89 -9.58 L-57.05 -16.39 L-65.22 -21.36 L-72.17 -20.02 L-78.33 -19.03 L-80.06 -12.95 L-81.22 -7.04 L-79.12 0.20 L-74.84 7.11 L-70.36 14.14 L-64.41 17.74 L-59.18 21.81 L-55.21 21.46 L-52.20 20.49 L-51.67 17.63 L-53.62 21.23 L-56.95 24.95 L-61.99 26.69 L-68.51 25.30 L-76.10 22.84 L-82.56 15.77 L-89.98 8.65 L-92.30 -0.31 L-94.18 -9.25 L-90.71 -15.73 L-84.46 -19.43 L-76.05 -20.31 L-66.45 -15.65 L-56.76 -9.56 L-47.97 -1.79 L-37.67 4.30 Z"/><path class="bloom-filament" data-delay="0.690" pathLength="1" d="M-43.28 -5.31 C-45.13 -10.98 -47.75 -18.52 -54.36 -39.37 C-60.96 -60.22 -75.73 -101.84 -82.93 -130.42 C-90.13 -159.00 -95.10 -197.43 -97.53 -210.84"/><path class="bloom-filament" data-delay="0.785" pathLength="1" d="M-43.28 -5.31 C-48.60 -11.84 -60.22 -22.19 -75.18 -44.49 C-90.14 -66.80 -118.46 -104.88 -133.04 -139.13 C-147.61 -173.38 -157.68 -231.51 -162.61 -249.98"/><path class="bloom-filament" data-delay="0.880" pathLength="1" d="M-43.28 -5.31 C-49.16 -11.39 -62.24 -21.19 -78.56 -41.82 C-94.87 -62.45 -125.40 -97.34 -141.16 -129.10 C-156.93 -160.87 -167.83 -215.18 -173.16 -232.40"/><path class="bloom-filament" data-delay="0.975" pathLength="1" d="M-43.28 -5.31 C-51.13 -10.54 -69.34 -18.72 -90.40 -36.70 C-111.46 -54.68 -149.70 -91.10 -169.66 -113.18 C-189.62 -135.25 -203.42 -159.81 -210.17 -169.14"/><path class="bloom-filament" data-delay="1.070" pathLength="1" d="M-43.28 -5.31 C-52.40 -9.14 -73.88 -14.29 -97.98 -28.30 C-122.08 -42.31 -165.25 -71.81 -187.89 -89.36 C-210.54 -106.91 -226.19 -126.24 -233.85 -133.62"/><path class="bloom-filament" data-delay="1.165" pathLength="1" d="M-43.28 -5.31 C-53.28 -8.48 -77.05 -12.54 -103.27 -24.37 C-129.49 -36.21 -176.11 -54.53 -200.63 -76.32 C-225.15 -98.10 -242.10 -141.96 -250.39 -155.09"/><path class="bloom-filament bloom-style" data-delay="0.870" pathLength="1" d="M-34.04 6.39 C-45.75 -2.97 -82.55 -29.78 -104.29 -49.79 C-126.03 -69.81 -146.61 -89.87 -164.51 -113.70 C-182.40 -137.53 -203.81 -179.60 -211.68 -192.78"/><path class="bloom-petal" data-delay="0.105" pathLength="1" d="M62.47 38.09 L74.69 35.88 L85.66 31.21 L97.92 28.11 L107.35 19.31 L112.78 8.79 L113.32 -2.06 L107.87 -10.09 L101.46 -16.96 L91.69 -16.38 L82.70 -16.18 L75.95 -9.88 L70.38 -3.77 L68.45 3.32 L69.10 9.42 L71.50 14.08 L75.43 16.05 L70.54 15.38 L65.32 10.81 L61.31 3.92 L62.59 -5.21 L65.98 -14.67 L73.73 -21.72 L83.35 -25.11 L93.64 -25.58 L100.98 -18.82 L107.81 -11.26 L106.68 0.07 L104.18 11.24 L95.68 19.85 L85.15 25.72 L74.82 30.25 L65.09 36.07 Z"/><path class="bloom-petal" data-delay="0.245" pathLength="1" d="M62.35 37.74 L71.58 32.91 L79.91 30.34 L89.67 27.97 L95.96 27.56 L98.56 28.64 L98.40 30.66 L92.78 33.57 L87.54 36.27 L79.22 38.40 L71.06 40.36 L64.16 41.06 L58.00 41.59 L54.17 41.67 L53.14 41.57 L53.44 41.85 L56.37 42.92 L53.58 45.40 L51.66 47.57 L51.00 49.87 L55.44 51.35 L60.77 52.89 L69.68 53.07 L79.24 52.47 L88.89 50.87 L95.98 48.40 L102.45 45.40 L101.68 43.08 L100.74 40.61 L93.55 39.79 L84.89 39.58 L74.95 39.78 L65.81 39.17 Z"/><path class="bloom-petal" data-delay="0.385" pathLength="1" d="M62.32 38.06 L72.87 40.21 L84.01 42.85 L94.38 43.03 L104.32 46.47 L112.11 51.46 L117.74 57.05 L117.61 62.92 L118.03 68.69 L111.88 71.63 L107.12 75.65 L99.64 75.72 L92.71 75.60 L86.40 73.47 L81.82 69.73 L78.34 65.31 L77.25 59.64 L76.87 61.41 L79.49 65.52 L83.82 69.90 L91.60 71.76 L100.23 73.45 L109.06 71.29 L116.97 67.72 L123.10 62.62 L123.85 55.60 L124.21 49.04 L117.32 43.72 L110.53 38.55 L100.43 37.13 L90.02 36.83 L78.42 37.40 L66.43 36.98 Z"/><path class="bloom-filament" data-delay="0.230" pathLength="1" d="M76.06 35.77 C85.33 43.48 106.17 68.46 131.69 82.07 C157.20 95.67 204.60 117.63 229.14 117.39 C253.69 117.15 270.65 86.75 278.96 80.62"/><path class="bloom-filament" data-delay="0.325" pathLength="1" d="M76.06 35.77 C85.28 40.26 106.00 56.26 131.40 62.70 C156.80 69.14 204.01 79.74 228.45 74.39 C252.90 69.04 269.79 37.91 278.06 30.61"/><path class="bloom-filament" data-delay="0.420" pathLength="1" d="M76.06 35.77 C86.23 39.15 109.41 51.68 137.09 56.05 C164.78 60.42 215.70 71.29 242.16 61.99 C268.62 52.68 286.90 10.53 295.85 0.24"/><path class="bloom-filament" data-delay="0.515" pathLength="1" d="M76.06 35.77 C85.63 36.08 107.25 40.06 133.49 37.65 C159.73 35.25 208.30 32.40 233.48 21.33 C258.67 10.25 276.07 -20.45 284.59 -28.80"/><path class="bloom-filament" data-delay="0.610" pathLength="1" d="M76.06 35.77 C85.96 33.95 108.46 31.80 135.50 24.86 C162.55 17.92 212.43 7.34 238.33 -5.86 C264.22 -19.05 282.12 -46.22 290.88 -54.30"/><path class="bloom-filament" data-delay="0.705" pathLength="1" d="M76.06 35.77 C86.48 32.52 110.31 26.06 138.59 16.28 C166.87 6.51 218.76 -8.92 245.75 -22.89 C272.74 -36.87 291.40 -60.11 300.53 -67.56"/><path class="bloom-filament bloom-style" data-delay="0.410" pathLength="1" d="M62.38 37.97 C79.73 40.68 134.27 51.84 166.49 54.25 C198.72 56.67 229.21 57.83 255.73 52.46 C282.26 47.10 313.99 27.11 325.64 22.04"/><path class="bloom-petal" data-delay="0.420" pathLength="1" d="M-54.00 52.32 L-61.37 54.98 L-68.88 56.37 L-77.23 58.46 L-80.76 57.85 L-82.88 56.23 L-77.64 52.19 L-72.50 47.64 L-63.36 43.04 L-54.65 38.77 L-46.68 35.80 L-41.60 34.91 L-37.40 34.70 L-38.49 36.74 L-39.70 38.88 L-44.24 41.32 L-49.35 42.62 L-46.15 39.06 L-41.87 34.46 L-39.73 30.12 L-39.02 26.38 L-43.32 24.97 L-47.53 24.07 L-56.00 26.62 L-64.52 29.34 L-72.80 33.86 L-80.08 38.47 L-85.17 42.89 L-84.99 45.96 L-82.96 48.49 L-74.73 48.43 L-66.55 49.11 L-57.75 50.80 Z"/><path class="bloom-petal" data-delay="0.560" pathLength="1" d="M-54.01 51.97 L-64.12 49.15 L-75.11 46.63 L-85.67 46.11 L-96.96 42.86 L-106.68 38.67 L-113.78 33.83 L-115.36 29.10 L-116.40 24.66 L-110.32 22.66 L-105.43 20.09 L-97.32 20.88 L-89.73 21.68 L-82.93 24.37 L-77.90 28.05 L-74.51 32.39 L-73.80 37.66 L-72.99 37.00 L-75.38 33.93 L-79.73 30.60 L-88.02 28.68 L-97.25 27.24 L-106.83 28.28 L-114.78 30.96 L-121.03 34.50 L-120.67 39.85 L-119.98 44.81 L-111.72 49.13 L-103.27 53.14 L-92.07 54.55 L-81.02 54.55 L-69.75 53.87 L-57.97 53.50 Z"/><path class="bloom-petal" data-delay="0.700" pathLength="1" d="M-54.20 52.14 L-64.85 56.73 L-75.02 61.51 L-85.47 66.41 L-94.59 72.42 L-99.23 81.42 L-101.09 89.91 L-99.59 97.97 L-93.71 102.83 L-86.65 107.92 L-77.73 105.76 L-68.66 104.55 L-62.35 98.02 L-57.34 91.73 L-56.06 84.92 L-57.51 79.38 L-60.46 75.77 L-56.28 78.39 L-52.24 83.49 L-52.04 90.41 L-53.69 97.98 L-59.23 104.58 L-66.99 109.27 L-76.02 112.54 L-84.59 109.28 L-93.14 105.83 L-95.89 95.80 L-97.42 85.13 L-91.95 74.60 L-83.83 65.74 L-73.13 60.70 L-64.48 57.77 L-56.23 52.73 Z"/><path class="bloom-filament" data-delay="0.920" pathLength="1" d="M-66.76 53.83 C-76.64 55.55 -99.28 64.08 -126.01 64.18 C-152.74 64.28 -201.69 66.36 -227.16 54.43 C-252.64 42.51 -270.25 2.92 -278.86 -7.38"/><path class="bloom-filament" data-delay="1.015" pathLength="1" d="M-66.76 53.83 C-78.12 56.07 -104.60 65.35 -134.90 67.31 C-165.20 69.27 -219.94 72.10 -248.56 65.58 C-277.18 59.06 -296.97 34.41 -306.65 28.18"/><path class="bloom-filament" data-delay="1.110" pathLength="1" d="M-66.76 53.83 C-77.02 57.70 -100.66 70.60 -128.32 77.07 C-155.98 83.55 -206.43 98.72 -232.72 92.67 C-259.02 86.63 -277.19 49.44 -286.08 40.80"/><path class="bloom-filament" data-delay="1.205" pathLength="1" d="M-66.76 53.83 C-75.41 58.71 -94.86 73.61 -118.64 83.11 C-142.42 92.60 -186.56 114.12 -209.43 110.80 C-232.29 107.47 -248.10 71.09 -255.83 63.15"/><path class="bloom-filament" data-delay="1.300" pathLength="1" d="M-66.76 53.83 C-74.35 59.67 -91.07 76.49 -112.30 88.91 C-133.54 101.33 -173.55 122.25 -194.17 128.36 C-214.79 134.48 -229.04 126.06 -236.02 125.59"/><path class="bloom-filament" data-delay="1.395" pathLength="1" d="M-66.76 53.83 C-73.33 59.89 -87.41 76.68 -106.20 90.23 C-124.99 103.78 -161.04 130.11 -179.50 135.14 C-197.96 140.17 -210.72 122.88 -216.96 120.42"/><path class="bloom-filament bloom-style" data-delay="1.100" pathLength="1" d="M-54.08 52.12 C-69.83 59.07 -119.33 83.53 -148.58 93.81 C-177.83 104.09 -205.51 112.70 -229.58 113.80 C-253.66 114.91 -282.46 102.67 -293.04 100.44"/><path class="bloom-petal" data-delay="0.525" pathLength="1" d="M10.47 4.97 L13.47 -3.90 L16.79 -11.61 L19.20 -18.38 L19.85 -25.00 L14.68 -30.88 L8.24 -36.08 L-0.25 -39.56 L-9.21 -40.12 L-18.13 -40.12 L-23.35 -35.98 L-29.23 -31.68 L-28.82 -25.68 L-27.96 -19.62 L-23.45 -14.58 L-17.74 -10.86 L-11.64 -8.15 L-15.69 -7.00 L-21.99 -7.92 L-26.50 -11.29 L-30.21 -15.57 L-30.55 -20.73 L-27.38 -25.54 L-22.42 -30.08 L-12.90 -31.12 L-2.65 -32.33 L7.31 -28.42 L17.28 -24.43 L22.34 -17.85 L24.01 -11.23 L20.99 -5.20 L15.97 -0.35 L12.64 4.75 Z"/><path class="bloom-petal" data-delay="0.665" pathLength="1" d="M10.36 5.22 L15.83 3.11 L22.73 0.30 L29.22 -2.67 L35.64 -2.11 L41.19 2.69 L44.19 11.26 L46.60 20.67 L43.97 29.60 L42.01 38.75 L36.64 41.72 L31.79 43.80 L27.28 40.57 L24.20 35.01 L22.56 28.32 L23.57 21.54 L26.39 15.83 L26.99 19.01 L27.50 25.30 L30.53 31.78 L33.96 38.44 L39.57 40.95 L45.56 42.44 L51.41 39.04 L55.88 31.98 L59.54 22.96 L58.11 12.22 L55.90 1.18 L48.86 -4.63 L40.68 -8.34 L32.00 -4.67 L23.84 -0.61 L14.17 2.82 Z"/><path class="bloom-petal" data-delay="0.805" pathLength="1" d="M10.68 5.28 L20.37 -0.30 L29.10 -7.28 L36.83 -13.43 L44.75 -19.78 L52.48 -26.04 L58.55 -30.90 L63.76 -35.34 L63.88 -35.41 L64.05 -36.51 L58.86 -32.80 L53.44 -29.64 L46.39 -24.83 L39.64 -20.21 L33.85 -16.16 L30.11 -13.77 L27.19 -13.22 L26.01 -16.05 L27.10 -19.93 L31.02 -25.49 L35.80 -31.11 L41.63 -36.94 L47.41 -42.50 L52.02 -46.80 L53.81 -48.41 L54.74 -49.48 L50.19 -45.23 L45.51 -40.68 L37.40 -32.60 L29.46 -23.99 L22.44 -15.79 L16.74 -7.89 L10.95 1.69 Z"/><path class="bloom-filament" data-delay="1.150" pathLength="1" d="M18.67 -2.53 C29.83 4.32 56.84 28.32 85.59 38.55 C114.34 48.77 164.59 65.08 191.19 58.81 C217.78 52.53 236.16 10.55 245.16 0.90"/><path class="bloom-filament" data-delay="1.245" pathLength="1" d="M18.67 -2.53 C29.94 2.82 57.24 22.35 86.26 29.57 C115.28 36.79 165.97 49.46 192.80 40.81 C219.63 32.15 238.18 -11.84 247.25 -22.37"/><path class="bloom-filament" data-delay="1.340" pathLength="1" d="M18.67 -2.53 C29.80 -0.05 56.75 11.44 85.45 12.37 C114.14 13.30 164.30 17.48 190.84 3.03 C217.38 -11.42 235.73 -61.43 244.71 -74.32"/><path class="bloom-filament" data-delay="1.435" pathLength="1" d="M18.67 -2.53 C30.79 -2.49 60.30 2.05 91.37 -2.31 C122.44 -6.66 176.45 -8.42 205.10 -28.68 C233.74 -48.94 253.53 -108.00 263.22 -123.86"/><path class="bloom-filament" data-delay="1.530" pathLength="1" d="M18.67 -2.53 C29.92 -4.65 57.16 -6.29 86.13 -15.23 C115.10 -24.18 165.71 -33.56 192.49 -56.19 C219.28 -78.82 237.79 -135.20 246.85 -151.01"/><path class="bloom-filament" data-delay="1.625" pathLength="1" d="M18.67 -2.53 C28.11 -6.69 50.67 -14.22 75.30 -27.47 C99.92 -40.73 143.47 -59.89 166.42 -82.04 C189.37 -104.19 205.23 -147.32 212.99 -160.38"/><path class="bloom-filament bloom-style" data-delay="1.330" pathLength="1" d="M10.50 5.15 C28.00 6.11 83.00 11.73 115.50 10.88 C148.00 10.03 178.75 8.10 205.50 0.04 C232.25 -8.01 264.25 -31.22 276.00 -37.47"/><path class="bloom-petal" data-delay="0.000" pathLength="1" d="M5.41 65.95 L9.69 73.91 L14.56 79.96 L19.06 85.49 L23.91 90.14 L32.26 92.03 L39.04 93.74 L45.24 92.89 L50.85 91.46 L55.22 88.71 L55.61 84.84 L56.61 80.34 L52.10 76.28 L48.71 71.91 L42.86 69.26 L37.41 67.22 L32.55 65.90 L35.55 63.13 L41.12 61.75 L47.35 62.31 L53.15 64.37 L58.77 67.31 L59.89 71.29 L61.93 75.30 L56.60 78.56 L51.79 81.84 L42.23 82.61 L32.39 82.31 L23.27 80.12 L17.31 76.34 L12.88 72.15 L10.77 68.55 L5.98 65.69 Z"/><path class="bloom-petal" data-delay="0.140" pathLength="1" d="M5.62 65.68 L9.10 67.71 L9.59 69.05 L10.70 73.03 L8.50 73.24 L4.05 70.04 L-1.13 65.43 L-6.37 58.42 L-11.52 51.34 L-13.76 45.79 L-16.31 39.50 L-15.71 37.01 L-14.68 35.61 L-12.85 36.45 L-10.56 39.83 L-8.66 44.20 L-7.79 50.41 L-11.00 47.97 L-15.50 43.17 L-20.66 38.44 L-24.81 37.44 L-29.14 37.04 L-30.39 41.73 L-30.30 47.79 L-27.78 55.85 L-22.69 64.83 L-16.91 73.07 L-11.06 77.63 L-5.17 81.51 L-2.20 79.46 L-0.21 75.81 L1.01 71.18 L3.72 67.86 Z"/><path class="bloom-petal" data-delay="0.280" pathLength="1" d="M5.21 65.67 L1.89 71.65 L-0.75 79.04 L-1.85 84.53 L-5.83 93.35 L-9.77 102.65 L-15.29 111.27 L-20.06 119.52 L-23.90 123.88 L-26.34 125.56 L-27.76 125.20 L-26.50 120.29 L-25.65 115.71 L-22.37 108.94 L-19.44 102.68 L-15.60 97.41 L-10.92 93.42 L-11.10 96.48 L-12.99 102.91 L-14.80 110.53 L-16.28 118.50 L-16.14 124.76 L-16.45 130.82 L-13.74 130.95 L-11.75 131.84 L-7.65 126.32 L-3.37 120.38 L1.15 111.79 L4.94 102.45 L8.13 92.99 L8.25 85.90 L8.27 77.65 L7.31 68.69 Z"/><path class="bloom-filament" data-delay="0.000" pathLength="1" d="M6.85 72.79 C3.27 82.71 -6.34 111.24 -14.61 132.31 C-22.88 153.38 -35.67 195.10 -42.76 199.20 C-49.86 203.30 -54.76 163.95 -57.15 156.90"/><path class="bloom-filament" data-delay="0.095" pathLength="1" d="M6.85 72.79 C5.32 82.47 1.02 109.75 -2.32 130.83 C-5.66 151.91 -10.46 189.26 -13.19 199.25 C-15.93 209.24 -17.82 192.17 -18.75 190.75"/><path class="bloom-filament" data-delay="0.190" pathLength="1" d="M6.85 72.79 C7.22 81.73 7.84 106.49 9.07 126.38 C10.30 146.27 12.93 186.87 14.23 192.15 C15.52 197.43 16.42 163.74 16.86 158.05"/><path class="bloom-filament" data-delay="0.285" pathLength="1" d="M6.85 72.79 C8.28 80.81 11.65 102.59 15.42 120.87 C19.20 139.15 25.96 171.71 29.51 182.48 C33.06 193.25 35.51 184.99 36.71 185.49"/><path class="bloom-filament" data-delay="0.380" pathLength="1" d="M6.85 72.79 C10.88 80.82 21.01 102.05 31.06 120.97 C41.11 139.89 58.05 172.11 67.13 186.32 C76.21 200.53 82.49 202.91 85.57 206.23"/><path class="bloom-filament" data-delay="0.475" pathLength="1" d="M6.85 72.79 C13.71 79.44 31.17 96.48 48.02 112.68 C64.87 128.88 92.86 161.19 107.95 169.99 C123.05 178.79 133.48 166.23 138.58 165.48"/><path class="bloom-filament bloom-style" data-delay="0.180" pathLength="1" d="M5.41 65.76 C7.25 80.43 13.04 129.18 16.45 153.82 C19.87 178.45 23.11 200.64 25.92 213.55 C28.74 226.47 32.10 228.36 33.34 231.32"/></g>\r
<g class="bloom-trace-tips"/>\r
</svg>`,qo=17.6,xh=11;class vh{elapsed=0;ambientTime=0;skipAt=null;revealed=!1;skip(){this.skipAt??=this.ambientTime}advance(e,t,n){this.ambientTime+=e;const i=t==="loading"||t==="ready"&&(!this.revealed||!n);this.elapsed=i?Math.min(this.elapsed+e,xh):this.elapsed+e;const r=!this.revealed&&(this.elapsed>=xh&&t!=="loading"||this.skipAt!==null);r&&(this.revealed=!0);const a=this.skipAt===null?0:Ct(this.ambientTime-this.skipAt,0,.65);return{time:this.elapsed,skip:a,requestReveal:r,complete:this.elapsed>=qo||a===1}}}function Ct(s,e,t){const n=Math.max(0,Math.min(1,(s-e)/(t-e)));return Math.max(0,Math.min(1,n*n*n*(n*(n*6-15)+10)))}function kn(s,e,t,n,i){return Ct(s,e,t)*(1-Ct(s,n,i))}function zL(s){return{phase:s<5.2?"signal":s<10.8?"identity":"garden",signal:kn(s,0,.8,4.1,6.2),heart:Ct(s,6.15,9.25),ink:1-Ct(s,11.2,16.5),pattern:kn(s,3.3,7.8,12.6,16.4),patternTravel:Ct(s,4,16.4),flower:kn(s,4.5,6.4,11.6,14.2),title:kn(s,5.9,8,10.7,13.3),titleIn:Ct(s,5.9,8),titleOut:Ct(s,10.7,13.3),identityOut:Ct(s,11.2,14.2),subtitle:kn(s,7.05,8.65,10.6,12.6),chrome:kn(s,.35,1.4,15,17.25),ui:Ct(s,14,qo),progress:Math.max(0,Math.min(1,s/qo)),captions:[kn(s,.9,1.9,4.05,5.35),kn(s,5.4,6.8,9.8,11.3),kn(s,11.1,12.5,14.7,16.3)]}}const yh=["LY-001   /   35.42 N   139.46 E   /   AUTUMN","COROLLA.06  ::  FILAMENT.36  ::  STYLE.06","[ MEMORY FRAGMENTS / PETAL BY PETAL ]","FLOWER : PRESENT      LEAF : ABSENT","L Y C O R I S","R E C A L L I N G   T H E   O T H E R   S H O R E","01001100  01011001  01000011  01001111","HERBARIUM / 040     PHENOLOGY / AUTUMN","[ THE NIGHT REMEMBERS WHAT BLOOMS ]"];function Lu(s,e){const t=e,n=.12+t*.14,i=4.05+e*.1,r=Ct(s,n,n+1),a=Ct(s,i,i+1.25);return{opacity:r*(1-a),reveal:r,dissolve:a,resolve:Ct(s,n+.4,3.2+t*.07)}}const Mh="01/:._+*#<>[]-";function VL(s,e,t){const n=Lu(e,t),i=Math.floor(e*13);return Array.from(s,(r,a)=>{if(r===" ")return r;const o=(a*17+t*11)%43/43;return n.resolve>=1||o<n.resolve?r:Mh[(a*7+t*3+i*(a%3+1))%Mh.length]}).join("")}function HL(s,e){return Ct(s,4.25+e*.6,6.8+e*.6)}function GL(){const s=new DOMParser().parseFromString(kL,"image/svg+xml"),t=Array.from(s.querySelectorAll("#bloom-umbel path")).map(r=>`<path d="${r.getAttribute("d")}"/>`).join(""),n=[[110,185,.68,.55],[405,155,.48,.42],[755,110,.38,.38],[1080,210,.52,.5],[1380,315,.68,.65],[180,510,.62,.55],[1175,535,.64,.58],[710,565,.34,.35],[40,790,1,.88],[430,770,.78,.78],[860,865,.86,.85],[1370,855,1.1,.9]],i=(r,a)=>n.slice(r,a).map(([o,c,l,h],u)=>`<use href="#bloom-dark-umbel" transform="translate(${o} ${c}) rotate(${u%2?-8:5}) scale(${l})" opacity="${h}"/>`).join("");return`<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><g id="bloom-dark-umbel" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">${t}<path d="M0 102 C-8 202 12 326 -10 465"/></g><clipPath id="bloom-fault-window"><path d="M0 155h440v16H0z M1030 300h410v22h-410z M0 736h580v12H0z"/></clipPath></defs><g class="bloom-pattern-far">${i(0,8)}</g><g class="bloom-pattern-near">${i(8,12)}</g><g class="bloom-pattern-echo" clip-path="url(#bloom-fault-window)">${i(0,12)}</g></svg>`}class WL{constructor(e){this.scene=e}scene;running=!1;element;root=document.querySelector("#stage");traces=[];petals=[];captions=[];signals=[];signalTick=-1;signalsComplete=!1;frame=0;playback=new vh;lastTime=0;readiness="loading";previousFocus=null;start(){if(this.running)return;if(this.scene.reduced){this.scene.revealScene();return}this.playback=new vh,this.signalTick=-1,this.signalsComplete=!1,this.readiness="loading",this.previousFocus=document.activeElement,this.running=!0,this.scene.hideScene(),this.element=document.createElement("section"),this.element.id="boot-sequence",this.element.className="bloom-opening",this.element.setAttribute("aria-label","彼岸开场：文字解码、石蒜显影、夜间花庭"),this.element.innerHTML=`
      <div class="bloom-veil" aria-hidden="true"></div>
      <div class="bloom-pattern" aria-hidden="true">${GL()}</div>
      <div class="bloom-atmosphere" aria-hidden="true"></div>
      <div class="bloom-downlink">${Ko(12)}</div>
      <div class="bloom-dust" aria-hidden="true">${Array.from({length:18},(n,i)=>`<i style="left:${8+i*41%84}%;top:${12+i*23%67}%;--dust-index:${i}"></i>`).join("")}</div>
      <div class="bloom-top"><span>LY <i>/</i> 001</span><span>NIGHT GARDEN</span><span>秋 · 夜间观测</span></div>
      <div class="bloom-signal" aria-hidden="true"><div class="bloom-signal-heading"><i></i><span>RECONSTRUCTING A MEMORY</span><i></i></div><div class="bloom-signal-lines">${yh.map((n,i)=>`<p class="bloom-signal-row${i===4?" bloom-signal-major":""}"><span></span></p>`).join("")}</div><div class="bloom-signal-foot"><span>花开时不见叶，叶生时不见花。</span><b></b></div></div>
      <div class="bloom-marginalia" aria-hidden="true"><span>SPECIMEN / 001<br>LYCORIS RADIATA</span><span>06 / COROLLA<br>36 / FILAMENTS</span><span>MEMORY FRAGMENTS<br>35°42′ / 139°46′</span><span>AUTUMN / 09<br>ARCHIVE.040</span></div>
      <div class="bloom-identity">
        <div class="bloom-flower" aria-hidden="true">${gu}</div>
        <div class="bloom-title"><p class="bloom-latin">LYCORIS RADIATA</p><h1 aria-label="彼岸"><span aria-hidden="true"><i>彼</i></span><span aria-hidden="true"><i>岸</i></span></h1></div>
        <div class="bloom-subtitle"><p>夜间花庭</p><span>THE OTHER SHORE</span><i></i></div>
      </div>
      <div class="bloom-captions" aria-hidden="true"><p><small>01 / RECOLLECTION</small><span>拾起盛放的片段</span></p><p><small>02 / RECOGNITION</small><span>花叶错落，各有其时</span></p><p><small>03 / IMMERSION</small><span>循一缕花丝，走入夜色</span></p></div>
      <div class="bloom-bottom"><span class="bloom-edition">LYCORIS <i>—</i> A NOCTURNAL HERBARIUM</span><div class="bloom-progress" aria-hidden="true"><i></i></div><button id="boot-skip"><span>进入花海</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16 15 5M5 5h10v10" stroke="currentColor" stroke-width="1.2"/></svg></button></div>
      <p class="bloom-announcement" role="status">拾起盛放的片段</p>`,document.body.appendChild(this.element),this.root.inert=!0,this.root.dataset.opening="true",this.root.scrollIntoView({block:"start",behavior:"instant"});const e=this.element.querySelector(".bloom-trace-tips");this.traces=Array.from(this.element.querySelectorAll(".bloom-filament")).map(n=>{const i=document.createElementNS("http://www.w3.org/2000/svg","circle");i.setAttribute("r",".8"),e.appendChild(i);const r=n.getTotalLength();return{path:n,tip:i,complete:!1,delay:Number(n.dataset.delay),samples:Array.from({length:65},(a,o)=>{const c=n.getPointAtLength(r*o/64);return{x:c.x,y:c.y}})}}),this.petals=Array.from(this.element.querySelectorAll(".bloom-petal")).map(n=>({path:n,delay:Number(n.dataset.delay),complete:!1})),this.captions=Array.from(this.element.querySelectorAll(".bloom-captions p")),this.signals=Array.from(this.element.querySelectorAll(".bloom-signal-row")).map(n=>({line:n,text:n.querySelector("span")}));const t=this.element.querySelector("#boot-skip");t.addEventListener("click",()=>this.finish()),t.focus({preventScroll:!0}),this.scene.ready.then(()=>{this.readiness="ready"},()=>{this.readiness="failed"}),document.addEventListener("visibilitychange",this.onVisibility),window.addEventListener("keydown",this.onKeyDown),this.lastTime=performance.now(),this.update()}update=()=>{if(!this.running||!this.element||document.hidden)return;const e=performance.now(),t=Math.min((e-this.lastTime)/1e3,.1);this.lastTime=e;const n=this.playback.advance(t,this.readiness,this.scene.hasPresentedScene),i=n.time,r=zL(i),a=n.skip;n.requestReveal&&this.scene.revealScene();const o=this.element.style;o.setProperty("--bloom-heart",String(r.heart)),o.setProperty("--bloom-ink",String(r.ink*(1-a))),o.setProperty("--bloom-chrome",String(r.chrome*(1-a))),o.setProperty("--bloom-title",String(r.title*(1-a))),o.setProperty("--bloom-title-in",String(r.titleIn)),o.setProperty("--bloom-title-out",String(r.titleOut)),o.setProperty("--bloom-identity-out",String(r.identityOut)),o.setProperty("--bloom-flower",String(r.flower*(1-a))),o.setProperty("--bloom-subtitle",String(r.subtitle*(1-a))),o.setProperty("--bloom-signal",String(r.signal*(1-a))),o.setProperty("--bloom-pattern",String(r.pattern*(1-a))),o.setProperty("--bloom-pattern-travel",String(r.patternTravel)),o.setProperty("--bloom-progress",String(r.progress)),o.setProperty("--bloom-breath",String((1+Math.sin(this.playback.ambientTime*1.7-1.1))/2)),this.root.style.setProperty("--opening-ui",String(Math.max(r.ui,a))),this.element.dataset.phase!==r.phase&&(this.element.dataset.phase=r.phase,this.element.querySelector(".bloom-announcement").textContent={signal:"拾起盛放的片段",identity:"彼岸，夜间花庭",garden:"循一缕花丝，走入夜色"}[r.phase]),this.captions.forEach((l,h)=>{const u=r.captions[h]*(1-a);l.style.opacity=String(u),l.style.translate=`0 ${(1-u)*-8}px`,l.style.filter=`blur(${(1-u)*4}px)`});const c=Math.floor(i*13);this.signalsComplete||this.signals.forEach(({line:l,text:h},u)=>{const d=Lu(i,u),f=i<4&&(c+u*7)%23===0?u%2?1:-1:0;if(l.style.opacity=String(d.opacity),l.style.transform=`translate(${f*2}px, ${(1-d.reveal)*-14+d.dissolve*(20+u*2)}px)`,l.style.filter=`blur(${(1-d.reveal)*3+d.dissolve*4}px)`,l.style.setProperty("--signal-fault",String(f)),c!==this.signalTick&&i<6.2){const g=VL(yh[u],i,u);h.textContent!==g&&(h.textContent=g,h.dataset.echo=g)}}),i>=6.2&&(this.signalsComplete=!0),this.signalTick=c;for(const l of this.traces){if(l.complete)continue;const h=HL(i,l.delay);l.path.style.strokeDashoffset=String(1-h);const u=Math.min(63,Math.floor(h*64)),d=h*64-u,f=l.samples[u],g=l.samples[u+1];l.tip.setAttribute("cx",String(f.x+(g.x-f.x)*d)),l.tip.setAttribute("cy",String(f.y+(g.y-f.y)*d)),l.tip.style.opacity=String(Ct(h,0,.08)*(1-Ct(h,.8,1))*.75),l.complete=h===1}for(const l of this.petals){if(l.complete)continue;const h=Ct(i,4.9+l.delay*.5,7.05+l.delay*.5),u=Ct(i,6+l.delay*.5,8.25+l.delay*.5);l.path.style.strokeDashoffset=String(1-h),l.path.style.fillOpacity=String(u*.38),l.complete=h===1&&u===1}if(n.complete){this.complete();return}this.frame=requestAnimationFrame(this.update)};onVisibility=()=>{this.element&&(this.element.dataset.paused=String(document.hidden)),cancelAnimationFrame(this.frame),this.lastTime=performance.now(),!document.hidden&&this.running&&this.update()};onKeyDown=e=>{this.running&&(e.key==="Enter"||e.key==="Escape")&&(e.preventDefault(),e.repeat||this.finish())};finish(){this.running&&this.playback.skip()}complete(){this.running=!1,cancelAnimationFrame(this.frame),document.removeEventListener("visibilitychange",this.onVisibility),window.removeEventListener("keydown",this.onKeyDown),this.scene.revealScene(),this.root.inert=!1,delete this.root.dataset.opening,this.root.style.removeProperty("--opening-ui"),this.element?.remove(),this.element=void 0,this.traces=[],this.petals=[],this.signals=[],this.captions=[],this.previousFocus?.isConnected?this.previousFocus.focus({preventScroll:!0}):this.root.querySelector('[data-action="open"]')?.focus({preventScroll:!0})}dispose(){this.running&&this.complete()}}function XL(s){try{return JSON.parse(localStorage.getItem(s)??"null")}catch{return null}}const ss={sound:!1,reduced:matchMedia("(prefers-reduced-motion: reduce)").matches,quality:!0},Sh=XL("lycoris.preferences");for(const s of Object.keys(ss))typeof Sh?.[s]=="boolean"&&(ss[s]=Sh[s]);const Us=document.querySelector("#stage"),YL=gu;Us.innerHTML=Qu(YL);const ut=s=>document.querySelector(s),fi=new Ju,nn=new NL(ut("#scene")),qL=ju(ut("#record-number"),{value:1,format:{minimumIntegerDigits:3,useGrouping:!1},duration:550,motionBlur:!0}),jL=new UL(ut("#record-title")),KL=new BL(Us),$L=new WL(nn);nn.reduced=ss.reduced;nn.setQuality(ss.quality);KL.setReduced(ss.reduced);document.body.classList.toggle("reduce-motion",ss.reduced);["archive","detail","inspect"].includes(new URLSearchParams(location.search).get("scene")??"")||$L.start();let bh;function JL(s){ut("#toast").textContent=s,ut("#toast").classList.add("visible"),clearTimeout(bh),bh=setTimeout(()=>ut("#toast").classList.remove("visible"),2300)}function _u(s=!nn.reduced){const e=fi.record;Us.dataset.flowerColor=e.flowerColor??"red",ut("#specimen-code").textContent=e.id,ut("#specimen-title").textContent=e.title,ut(".stage-index").textContent=`${String(fi.index+1).padStart(2,"0")} — 40`,qL.update({value:fi.index+1,animated:s}),jL.update(e.title,s),ut("#record-en").textContent=e.en,ut("#record-date").textContent=e.date,ut("#record-category").textContent="其"+["一","二","三","四","五"][e.category]+" · "+Fs[e.category].name,Us.dataset.longTitle=String(e.title.length>4),Us.style.setProperty("--chapter-index",String(e.category)),ut("#record-summary").textContent=e.summary,ut("#rail-category").textContent=Fs[e.category].name,ut("#rail-number").textContent=String(e.number).padStart(2,"0")+" / 08",document.querySelectorAll("[data-category]").forEach(t=>{t.classList.toggle("active",Number(t.dataset.category)===e.category),t.setAttribute("aria-pressed",String(Number(t.dataset.category)===e.category))}),ut("#file-rail").innerHTML=hn.filter(t=>t.category===e.category).map(t=>`<button class="file-chip ${t.id===e.id?"selected":""}" data-record="${hn.indexOf(t)}" aria-label="${t.id} ${t.title}" aria-pressed="${t.id===e.id}" title="${t.title}"><span>${String(t.number).padStart(2,"0")}</span></button>`).join(""),nn.select(fi.index,fi.laneTravel,fi.rowTravel),document.dispatchEvent(new CustomEvent("lycoris:selection"))}nn.onSelect=(s,e)=>{fi.select(s,e),_u()};nn.onOpen=()=>ut("[data-action='open']").click();nn.onPhaseChange=s=>{const t={browsing:["点击选择 · 双击抽取检视","ARRAY / READY"],extracting:["标本升起 · 镜头跟随","EXTRACTING"],ready:["拖动旋转 · ESC 归位","INSPECTION"],aligning:["标本转正 · 即将归位","ALIGNING"],returning:["标本归位 · 可继续翻阅","RETURNING"]}[s];if(t&&(ut("#stage-hint").textContent=nn.reduced?"动态效果已暂停 · 可在偏好设置中开启":t[0],ut("#model-status").textContent=t[1]),nn.mode==="archive"){const n=ut("[data-action='rotate']");n.classList.remove("active"),n.setAttribute("aria-pressed","false")}};nn.ready.then(()=>{ut("#model-status").textContent="3D / CONNECTED";const s=ut("#model-loading");nn.reduced?s.hidden=!0:(s.style.pointerEvents="none",s.animate([{opacity:1},{opacity:0}],{duration:650,easing:"ease-out",fill:"forwards"}).onfinish=()=>{s.hidden=!0})}).catch(s=>{ut("#model-status").textContent="MODEL UNAVAILABLE",ut("#load-progress").textContent="模型载入失败，请刷新重试。档案仍可读取。",console.error(s)});_u(!1);setInterval(()=>{ut("#clock").textContent=new Date().toLocaleTimeString("en-GB",{hour12:!1})},1e3);wu(()=>import("./interactions-lhSt857x.js"),[]).then(s=>s.installInteractions());export{ut as $,nn as a,$L as b,ss as c,_u as d,Fs as e,YL as f,ZL as g,XL as h,Bl as p,hn as r,fi as s,JL as t,KL as u};
