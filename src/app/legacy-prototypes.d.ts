// What the legacy code adds to the built-in prototypes and to `window`, declared
// so the ported classes type-check; each line names where the legacy code does it.
// The implementations still load from those files. Written by scaffold-units.
export {};

declare global {
  interface Window {
    /** assigned at src/app/api/widget.service.js:64 */
    $: any;
    /** assigned at src/app/app.run.js:22 */
    Flow: any;
    /** assigned at src/app/api/widget.service.js:73 */
    TbAnalogueCompass: any;
    /** assigned at src/app/api/widget.service.js:71 */
    TbAnalogueLinearGauge: any;
    /** assigned at src/app/api/widget.service.js:72 */
    TbAnalogueRadialGauge: any;
    /** assigned at src/app/api/widget.service.js:74 */
    TbCanvasDigitalGauge: any;
    /** assigned at src/app/api/widget.service.js:70 */
    TbFlot: any;
    /** assigned at src/app/api/widget.service.js:75 */
    TbMapWidget: any;
    /** assigned at src/app/api/widget.service.js:76 */
    TbMapWidgetV2: any;
    /** read at src/app/import-export/import-export.service.js:933; never assigned in this repo, so a script outside it sets it */
    URL: any;
    /** read at src/app/api/device.service.js:193; never assigned in this repo, so a script outside it sets it */
    XMLHttpRequest: any;
    /** read at src/app/components/gateway/gateway-form.directive.js:403; never assigned in this repo, so a script outside it sets it */
    atob: any;
    /** read at src/app/components/gateway/gateway-form.directive.js:196; never assigned in this repo, so a script outside it sets it */
    btoa: any;
    /** read at src/app/common/raf.provider.js:26; never assigned in this repo, so a script outside it sets it */
    cancelAnimationFrame: any;
    /** assigned at src/app/api/widget.service.js:78 */
    cssjs: any;
    /** assigned at src/app/widget/lib/google-map.js:84 */
    gm_authFailure: any;
    /** assigned at src/app/api/widget.service.js:65 */
    jQuery: any;
    /** assigned at src/app/api/widget.service.js:68 */
    lazyLoad: any;
    /** read at src/app/api/telemetry-websocket.service.js:47; never assigned in this repo, so a script outside it sets it */
    location: any;
    /** assigned at src/app/api/widget.service.js:66 */
    moment: any;
    /** assigned at src/app/components/confirm-on-exit.directive.js:25 */
    onbeforeunload: any;
    /** read at src/app/api/data-aggregator.js:221; never assigned in this repo, so a script outside it sets it */
    performance: any;
    /** read at src/app/common/raf.provider.js:23; never assigned in this repo, so a script outside it sets it */
    requestAnimationFrame: any;
    /** read at src/app/widget/lib/date-range-navigator/date-range-navigator.js:219; never assigned in this repo, so a script outside it sets it */
    sessionStorage: any;
    /** assigned at src/app/api/widget.service.js:67 */
    tinycolor: any;
    /** assigned at src/app/widget/lib/tencent-map.js:86 */
    tm_authFailure: any;
    /** read at src/app/common/raf.provider.js:27; never assigned in this repo, so a script outside it sets it */
    webkitCancelAnimationFrame: any;
    /** read at src/app/common/raf.provider.js:28; never assigned in this repo, so a script outside it sets it */
    webkitCancelRequestAnimationFrame: any;
    /** read at src/app/common/raf.provider.js:24; never assigned in this repo, so a script outside it sets it */
    webkitRequestAnimationFrame: any;
  }
}
