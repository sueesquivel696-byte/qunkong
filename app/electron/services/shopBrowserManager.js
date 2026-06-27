const{BrowserWindow:Ue,BrowserView:Be,shell:Le,Menu:Pe,dialog:qe,clipboard:De}=require("electron"),L=require("path"),{pathToFileURL:Fe}=require("url"),{createProductSplitImageFileService:Ge}=require("./products/productSplitImageFileService.js"),w="https://store.weixin.qq.com/",He=new Set(["store.weixin.qq.com","channels.weixin.qq.com"]);function I(o){try{const a=new URL(o);return a.protocol==="https:"&&He.has(a.hostname)}catch{return!1}}function P(o=""){const a=String(o||"").trim();return a?/^https?:\/\//i.test(a)?a:a.startsWith("/")?`${w.replace(/\/$/,"")}${a}`:w:w}function Oe(o,a={}){const s=new URL(o);for(const[m,p]of Object.entries(a))p!=null&&p!==""&&s.searchParams.set(m,String(p));return s.toString()}function $e(o={}){return{x:Math.max(0,Math.round(Number(o.x)||0)),y:Math.max(0,Math.round(Number(o.y)||0)),width:Math.max(0,Math.round(Number(o.width)||0)),height:Math.max(0,Math.round(Number(o.height)||0))}}function ze(o={}){const a=String(o.mediaType||"").toLowerCase(),s=String(o.srcURL||o.srcUrl||"").trim();return a!=="image"||!s||/^blob:/i.test(s)?"":s}function Ve(o=""){try{const a=new URL(o),s=decodeURIComponent(a.pathname||"");return L.basename(s).replace(/\.(png|jpe?g|webp|gif|bmp|avif)$/i,"").trim()||`shop-image-${Date.now()}`}catch{return`shop-image-${Date.now()}`}}function We(o){const a=o?.session?.fetch;return typeof a=="function"?(s,m)=>a.call(o.session,s,m):globalThis.fetch}function je(o={}){return{ok:!0,data:o,error:null}}function T(o,a,s={}){return{ok:!1,data:null,error:{code:o,message:a,details:s,retryable:!1}}}const Je=new Set(["AI_SPLIT_IMAGE_DATA_INVALID","AI_SPLIT_IMAGE_DOWNLOAD_FAILED","AI_SPLIT_IMAGE_FETCH_UNAVAILABLE"]);function Ye(o){return Je.has(o?.error?.code)}function Xe(o={}){const a=Math.max(0,Math.floor(Number(o.x)||0)),s=Math.max(0,Math.floor(Number(o.y)||0)),m=Math.max(1,Math.ceil(Number(o.width)||0)),p=Math.max(1,Math.ceil(Number(o.height)||0));return{x:a,y:s,width:m,height:p}}function Qe(o={},a=""){const s=Number.isFinite(Number(o.x))?Number(o.x):null,m=Number.isFinite(Number(o.y))?Number(o.y):null;return`
    (() => {
      const targetUrl = ${JSON.stringify(a)};
      const pointX = ${s===null?"null":String(s)};
      const pointY = ${m===null?"null":String(m)};
      const normalizeUrl = value => {
        try {
          return new URL(String(value || ''), window.location.href).href;
        } catch (err) {
          return String(value || '');
        }
      };
      const decodeSafe = value => {
        try { return decodeURIComponent(value); } catch (err) { return value; }
      };
      const urlsMatch = (a, b) => {
        const left = normalizeUrl(a);
        const right = normalizeUrl(b);
        return Boolean(left && right && (left === right || decodeSafe(left) === decodeSafe(right)));
      };
      const getImageUrl = el => {
        if (!el) return '';
        if (el.tagName === 'IMG') return el.currentSrc || el.src || '';
        const backgroundImage = window.getComputedStyle(el).backgroundImage || '';
        const match = backgroundImage.match(/url\\(["']?(.+?)["']?\\)/);
        return match ? normalizeUrl(match[1]) : '';
      };
      const validRect = el => {
        const rect = el?.getBoundingClientRect?.();
        return rect && rect.width > 0 && rect.height > 0 ? rect : null;
      };
      const pointElements = Number.isFinite(pointX) && Number.isFinite(pointY)
        ? Array.from(document.elementsFromPoint(pointX, pointY))
        : [];
      const imageElements = Array.from(document.images || []);
      const candidates = [...pointElements, ...imageElements];
      const matched = candidates.find(el => validRect(el) && urlsMatch(getImageUrl(el), targetUrl));
      const fallback = pointElements.find(el => validRect(el) && getImageUrl(el)) ||
        imageElements.find(el => validRect(el) && urlsMatch(getImageUrl(el), targetUrl));
      const element = matched || fallback;
      const rect = validRect(element);
      if (!rect) return null;
      const left = Math.max(0, rect.left);
      const top = Math.max(0, rect.top);
      const right = Math.min(window.innerWidth || rect.right, rect.right);
      const bottom = Math.min(window.innerHeight || rect.bottom, rect.bottom);
      return {
        x: Math.floor(left),
        y: Math.floor(top),
        width: Math.max(1, Math.ceil(right - left)),
        height: Math.max(1, Math.ceil(bottom - top))
      };
    })()
  `}function Ke({BrowserWindowImpl:o=Ue,BrowserViewImpl:a=Be,MenuImpl:s=Pe,dialogImpl:m=qe,clipboardImpl:p=De,shellImpl:ne=Le,createImageFileService:re=Ge,getShops:q,restoreCookiesFromDisk:D,clearPartitionCache:F,markShopAuthInvalid:G,markShopAuthValid:H,refreshShopAuthorization:O,pageReadyCheckDelayMs:oe=700,pageReadyCheckAttempts:ie=10,pageReadyAutoReloads:N=1,pageReadyRawShellChecksBeforeReload:$=2,preloadPath:z=L.join(__dirname,"../preload.js"),indexPath:V=L.join(__dirname,"../../dist/index.html"),devServerUrl:E=process.env.VITE_DEV_SERVER_URL||""}){let u=null,f=[],g="",ae=0,A={x:0,y:0,width:0,height:0},v=[];function ce(e){return(typeof q=="function"?q():[]).find(t=>t.id===e)}function se(e){const t=ce(e)||{id:e};return{shop:t,shopId:e,title:t.name||"\u672A\u547D\u540D\u5E97\u94FA",partition:t.partition||`persist:${e}`}}function M(){return!!(u&&!u.isDestroyed())}function W(e){if(!(!e||typeof e.isDestroyed=="function"&&e.isDestroyed())){try{typeof e.isMinimized=="function"&&e.isMinimized()&&typeof e.restore=="function"&&e.restore()}catch{}try{typeof e.show=="function"&&e.show()}catch{}try{typeof e.focus=="function"&&e.focus()}catch{}}}function ue(e){if(E){const t=E.includes("?")?"&":"?";return e.loadURL(`${E}${t}window=shop-browser`)}return e.loadFile(V,{query:{window:"shop-browser"}})}function le(e,t={}){const r=E||Fe(V).toString();return Oe(r,{window:e,...t})}function j(e){if(e?.ok)return;const t=e?.error?.message||"\u56FE\u7247\u64CD\u4F5C\u5931\u8D25";if(m?.showErrorBox){m.showErrorBox("\u56FE\u7247\u64CD\u4F5C\u5931\u8D25",t);return}console.warn("[shopBrowserManager] image context menu action failed:",t)}function J(e){return re({fetchImpl:We(e?.view?.webContents)})}async function fe(e,t,r={}){const n=await J(e).copyImage({imageDataUrl:t});if(n?.ok)return n;if(Ye(n)){const i=await de(e,t,r);if(i?.ok)return i}return j(n),n}async function de(e,t,r={}){const n=e?.view?.webContents;if(!n?.executeJavaScript||!n?.capturePage||!p?.writeImage)return T("SHOP_IMAGE_RENDER_COPY_UNAVAILABLE","\u5F53\u524D\u9875\u9762\u4E0D\u652F\u6301\u622A\u56FE\u590D\u5236\uFF0C\u8BF7\u8BD5\u8BD5\u56FE\u7247\u53E6\u5B58\u4E3A\u3002");let i=null;try{const c=await n.executeJavaScript(Qe(r,t));if(!c||typeof c!="object")return T("SHOP_IMAGE_RENDER_RECT_MISSING","\u6CA1\u6709\u627E\u5230\u53EF\u590D\u5236\u7684\u9875\u9762\u56FE\u7247\uFF0C\u8BF7\u8BD5\u8BD5\u56FE\u7247\u53E6\u5B58\u4E3A\u3002");i=Xe(c)}catch(c){return T("SHOP_IMAGE_RENDER_RECT_FAILED",c?.message||"\u8BFB\u53D6\u9875\u9762\u56FE\u7247\u4F4D\u7F6E\u5931\u8D25\u3002")}try{const c=await n.capturePage(i);return!c||typeof c.isEmpty=="function"&&c.isEmpty()?T("SHOP_IMAGE_RENDER_CAPTURE_EMPTY","\u9875\u9762\u56FE\u7247\u622A\u56FE\u4E3A\u7A7A\uFF0C\u8BF7\u8BD5\u8BD5\u56FE\u7247\u53E6\u5B58\u4E3A\u3002"):(p.writeImage(c),je({copied:!0,source:"rendered-capture"}))}catch(c){return T("SHOP_IMAGE_RENDER_CAPTURE_FAILED",c?.message||"\u9875\u9762\u56FE\u7247\u622A\u56FE\u590D\u5236\u5931\u8D25\u3002")}}async function me(e,t){const r=await J(e).saveImageAs({imageDataUrl:t,defaultName:Ve(t)});return j(r),r}function he(e){const t=e?.view?.webContents;!t?.on||!s?.buildFromTemplate||t.on("context-menu",(r,n={})=>{const i=ze(n);if(!i)return;s.buildFromTemplate([{label:"\u590D\u5236\u56FE\u7247",click:()=>fe(e,i,n)},{label:"\u56FE\u7247\u53E6\u5B58\u4E3A...",click:()=>me(e,i)}])?.popup?.({window:u})})}function Y(){if(M())return W(u),u;u=new o({width:1400,height:900,minWidth:960,minHeight:640,title:"\u5E97\u94FA\u7BA1\u7406\u5668",frame:!1,autoHideMenuBar:!0,backgroundColor:"#f3f7fb",webPreferences:{preload:z,contextIsolation:!0,nodeIntegration:!1}}),u.on("closed",()=>{for(const e of f)try{e.view.webContents.destroy()}catch{}f=[],g="",u=null}),ue(u);try{typeof u.maximize=="function"&&u.maximize()}catch{}return W(u),u}function X(e){const t=e.view.webContents;return{id:e.id,shopId:e.shopId,title:e.title,url:t.getURL()||e.url||"",loading:t.isLoading()||!!e.appReadyPending,canGoBack:t.canGoBack(),canGoForward:t.canGoForward()}}function l(){const e=f.find(t=>t.id===g);return{tabs:f.map(X),activeTabId:g,activeTab:e?X(e):null}}function y(){M()&&u.webContents.send("shop-browser:state-updated",l())}function k(){return A.width>80&&A.height>80}function pe(){if(!k()||v.length===0)return;const e=v;v=[];for(const t of e)t.resolve(!0)}function ge(e=5e3){return k()?Promise.resolve(!0):new Promise(t=>{const r={timer:null,resolve:n=>{r.timer&&clearTimeout(r.timer),t(n)}};r.timer=setTimeout(()=>{v=v.filter(n=>n!==r),t(!1)},e),v.push(r)})}function U(){if(!M()||!k())return;const e=f.find(t=>t.id===g);if(e){e.view.setBounds(A);try{u.setTopBrowserView(e.view)}catch{}}}function Q(e){if(!(!M()||!e))try{u.removeBrowserView(e.view)}catch{}}function we(e){if(!(!M()||!e)){try{u.addBrowserView(e.view)}catch{}U()}}function x(e){const t=f.find(n=>n.id===e);if(!t)return l();const r=f.find(n=>n.id===g);return r&&r.id!==t.id&&Q(r),g=t.id,we(t),y(),l()}function C(e){e&&(e.url=e.view.webContents.getURL()||e.url,y())}function ye(e,t){if(!t)return;const r=JSON.stringify(String(t));e.view.webContents.once("did-finish-load",()=>{const n=`
        setTimeout(() => {
          const targetTabName = ${r};
          const tabs = Array.from(document.querySelectorAll('.weui-desktop-tab, .ant-tabs-tab, div, li, span'))
            .filter(el => el.innerText && el.innerText.trim() === targetTabName);
          if (tabs.length > 0) {
            tabs[tabs.length - 1].click();
          }
        }, 1500);
      `;e.view.webContents.executeJavaScript(n).catch(()=>{})})}function be(e){return new Promise(t=>setTimeout(t,Math.max(0,Number(e)||0)))}function Se(){return`
      (() => {
        const body = document.body;
        if (!body) return { ready: false, rawShell: false, reason: 'no-body' };

        const text = (body.innerText || '').replace(/\\s+/g, '');
        const loginRequired = text.includes('\\u626b\\u7801\\u8fdb\\u5165\\u6211\\u7684\\u5c0f\\u5e97') ||
          (text.includes('\\u5fae\\u4fe1\\u5c0f\\u5e97') && text.includes('\\u626b\\u7801')) ||
          (text.includes('\\u767b\\u5f55') && text.includes('\\u626b\\u7801'));
        const style = window.getComputedStyle(body);
        const rawNavTerms = [
          '\\u6210\\u957f\\u4e2d\\u5fc3',
          '\\u5f00\\u53d1\\u6587\\u6863',
          '\\u5546\\u5bb6\\u793e\\u533a',
          '\\u4e0b\\u8f7d\\u5ba2\\u6237\\u7aef',
          '\\u5e73\\u53f0\\u5ba2\\u670d'
        ];
        const matchedRawNavTerms = rawNavTerms.filter(term => text.includes(term)).length;
        const defaultBodyMargin = style.marginTop === '8px' && style.marginLeft === '8px';
        const nativeLookingControl = Array.from(document.querySelectorAll('button,input,select')).some(el => {
          const controlStyle = window.getComputedStyle(el);
          return controlStyle.borderTopStyle === 'outset' ||
            controlStyle.borderTopStyle === 'inset' ||
            controlStyle.backgroundColor === 'rgb(239, 239, 239)';
        });
        const styledAppMarker = document.querySelector([
          '[class*="weui"]',
          '[class*="ant-"]',
          '[class*="semi-"]',
          '[class*="dui"]',
          '[class*="tdesign"]',
          '[class*="store"]',
          '[class*="shop"]',
          '[class*="layout"]',
          '[class*="sidebar"]'
        ].join(','));
        const rawShell = matchedRawNavTerms >= 4 && (defaultBodyMargin || nativeLookingControl);
        const readyStateComplete = document.readyState === 'complete';
        const mostlyBlank = text.length < 8 && !styledAppMarker;
        if (loginRequired) {
          return {
            ready: false,
            rawShell: false,
            loginRequired: true,
            reason: 'login-required',
            textLength: text.length
          };
        }

        return {
          ready: readyStateComplete && !rawShell && !mostlyBlank,
          rawShell,
          reason: rawShell ? 'unstyled-wechat-shell' : (mostlyBlank ? 'mostly-blank' : document.readyState),
          matchedRawNavTerms,
          defaultBodyMargin,
          nativeLookingControl,
          hasStyledAppMarker: Boolean(styledAppMarker),
          textLength: text.length
        };
      })()
    `}async function ve(e){try{const t=await e.view.webContents.executeJavaScript(Se());return t&&typeof t=="object"?t:{ready:!1,rawShell:!1,reason:"invalid-health-result"}}catch{return{ready:!1,rawShell:!1,reason:"health-check-failed"}}}async function K(e,t){if(!(!I(t)||typeof F!="function"))try{await F(e.partition)}catch{}}async function Z(e,t){try{return await e.loadURL(t),!0}catch(r){const n=String(r?.message||r||"");if(n.includes("ERR_ABORTED")||n.includes("(-3)")||n.includes("(-401)"))return!1;throw r}}function xe(e,t="browser-login-required"){if(!e?.shopId||typeof G!="function"||e.authInvalidReported)return!1;e.authInvalidReported=!0;try{return G(e.shopId,{code:"AUTH_REQUIRED",reason:t,offlineConfirmed:!0})}catch{return!1}}function Me(e,t="browser-page-ready"){if(!e?.shopId)return!1;e.authInvalidReported=!1;let r=!1;if(typeof H=="function")try{r=H(e.shopId)!==!1}catch{r=!1}if(typeof O=="function")try{const n=O(e.shopId,{reason:t,source:"shop-browser"});n&&typeof n.catch=="function"&&n.catch(()=>{})}catch{}return r}async function Re(e,t,r){if(!I(t))return!0;for(let n=0;n<=N;n+=1){let i=0;for(let c=0;c<ie;c+=1){if(e.loadSeq!==r||(await be(oe),e.loadSeq!==r))return!1;const d=await ve(e);if(e.lastPageHealth=d,d.loginRequired)return xe(e),!0;if(d.ready)return Me(e),!0;if(d.rawShell&&(i+=1,i>=$&&n<N)){await K(e,t),await Z(e.view.webContents,t);break}}if(i<$||n>=N)break}return!1}function ee({shopId:e="",title:t,partition:r,initialUrl:n,kind:i="shop"}){const c=`shop-tab-${Date.now()}-${++ae}`,d={partition:r,nodeIntegration:!1,contextIsolation:!0};i==="app"&&(d.preload=z);const h=new a({webPreferences:d});try{typeof h.setAutoResize=="function"&&h.setAutoResize({width:!0,height:!0})}catch{}const b={id:c,shopId:e,title:t,partition:r,kind:i,view:h,url:n,loadSeq:0,appReadyPending:!1,lastPageHealth:null,authInvalidReported:!1},B=h.webContents;he(b),B.setWindowOpenHandler(S=>(Promise.resolve().then(()=>{I(S.url)?te(e,S.url,"",{forceNew:!0}):/^https?:\/\//i.test(S.url)&&ne.openExternal(S.url).catch(()=>{})}),{action:"deny"}));for(const S of["did-start-loading","did-stop-loading","did-navigate","did-navigate-in-page"])B.on(S,()=>C(b));return B.on("did-fail-load",()=>C(b)),f.push(b),b}async function _(e,t="",r=""){const n=e.kind==="app"?String(t||e.url||""):P(t||e.url||w),i=e.loadSeq+1;e.loadSeq=i,e.appReadyPending=e.kind!=="app"&&I(n),C(e),ye(e,r),await ge(),U(),e.kind!=="app"&&await K(e,n),await Z(e.view.webContents,n),e.url=n,e.kind!=="app"&&await Re(e,n,i),e.loadSeq===i&&(e.appReadyPending=!1),C(e)}async function te(e,t="",r="",n={}){if(!e)return l();Y();const i=t?P(t):"",c=!n.forceNew&&!i&&!r?[...f].reverse().find(b=>b.shopId===e):null;if(c)return x(c.id),y(),l();const d=se(e);typeof D=="function"&&await D(d.partition,e).catch(()=>0);const h=ee({shopId:e,title:d.title,partition:d.partition,initialUrl:i||w});return x(h.id),await _(h,i||w,r),y(),l()}async function Ie({windowName:e="product-editor",title:t="\u5546\u54C1\u7F16\u8F91",query:r={},forceNew:n=!1}={}){Y();const i=le(e,r),c=n?null:[...f].reverse().find(h=>h.kind==="app"&&h.url===i);if(c)return x(c.id),y(),l();const d=ee({shopId:"",title:t,partition:`persist:local-app-${e}`,initialUrl:i,kind:"app"});return x(d.id),await _(d,i),y(),l()}function Te(e){const t=f.findIndex(n=>n.id===e);if(t<0)return l();const[r]=f.splice(t,1);Q(r);try{r.view.webContents.destroy()}catch{}if(g===e){g="";const n=f[Math.max(0,t-1)]||f[0];n&&x(n.id)}return y(),l()}function R(){return f.find(e=>e.id===g)||null}function Ee(){const e=R();return e?.view.webContents.canGoBack()&&e.view.webContents.goBack(),l()}function Ae(){const e=R();return e?.view.webContents.canGoForward()&&e.view.webContents.goForward(),l()}async function Ce(){const e=R();return e&&await _(e,e.view.webContents.getURL()||e.url||w),l()}function _e(){const e=R();return e&&(e.loadSeq+=1,e.appReadyPending=!1,e.view.webContents.stop()),l()}async function Ne(){const e=R();return e&&await _(e,w),l()}function ke(e){return A=$e(e),pe(),U(),l()}return{openShopPage:te,openAppPage:Ie,activateTab:x,closeTab:Te,goBack:Ee,goForward:Ae,reload:Ce,stop:_e,goHome:Ne,setContentBounds:ke,getState:l}}module.exports={SHOP_HOME_URL:w,createShopBrowserManager:Ke,isManagedUrl:I,normalizeShopUrl:P};
