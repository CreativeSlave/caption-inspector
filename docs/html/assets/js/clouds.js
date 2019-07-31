/**
 * # CloudGenerator
 * There are three parts to this.
 * 1) This file is the JavaScript part,
 * 2) you need also the CSS,
 * 3) and an element with an ID in the HTML.
 *
 * **The missing CSS**:
 * ```css
    html, body {margin: 0;}
    body:after {
      position: fixed;
      width: 100%;
    }
 
    #cloud {
      overflow: hidden;
      width: 1px; height: 1px;
      transform: translate(-100%, -100%);
      border-radius: 50%;
      filter: url(#filter);
    }
 * ```
 *
 * **Note:** The **element ID** in the CSS above ("#cloud") must be the same
 * element ID passed into the CloudGenerator Constructor, but without
 * the Hash symbol. Also the HTML element must exist within the HTML
 * like this: `<div id="cloud"></div>`
 * @usage
 * ```
 * let clouds = new CloudGenerator("cloud");
 * ```
 */
class CloudGenerator {
    /**
     * Cloud Generator
     * The individual clouds are achieved through the use of CSS box-shadow
     * with a <filter> element containing two SVG filters as its complement.
     *
     * Recreated from Yuan Chuan:
     * https://codepen.io/yuanchuan/pen/f70a1f9435dc90197b253b26b4d69d42
     *
     * But the filters are public:
     * Filter documentation available on MDN and w3.org.
     * A very informative page on feTurbulence and feDisplacement is freely available.
     * @param element
     * @param baseColor
     */
    constructor(elementId, filterId, baseColor = "#5579D2"){
        this.clouds = document.querySelector(elementId);
        this.filterId = filterId;
        this.baseColor = baseColor;
        CloudGenerator.insertDOMFilter(this.filterId);
        CloudGenerator.debounce(()=>{
            this.generate();
        }, 2500);
    }
    /**
     * ### nsert DOM Filter
     * Insert a one time DOM Filter for the CSS and SVG
     */
    static insertDOMFilter(filterId){
        if(!document.querySelector(`#${filterId}`)){
            document.body.appendChild(`
                <svg width="0">
                  <filter id="${filterId}">
                    <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="10" />
                    <feDisplacementMap in="SourceGraphic" scale="240" />
                  </filter>
                </svg>`);
        }
    }
    segment() {
        return arguments[CloudGenerator.randomize(1, arguments.length) - 1];
    }
    static randomize(from, to) {
        return ~~(Math.random() * (to - from + 1)) + from;
    }
    static boxShadows(max, baseColor) {
        let ret = [];
        for (let i = 0; i < max; ++i) {
            /** DO NOT REFORMAT! */
            ret.push(`
      ${ CloudGenerator.randomize(1, 100) }vw ${ CloudGenerator.randomize(1, 100) }vh ${ CloudGenerator.randomize(20, 40) }vmin ${ CloudGenerator.randomize(1, 20) }vmin
      ${ this.segment('#11cbd7', '#c6f1e7', '#f0fff3', baseColor) }
    `)
        }
        return ret.join(',');
    }
    static debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    }
    generate(){
        if(this.clouds){
            
            this.clouds.style.boxShadow =
                CloudGenerator.boxShadows(60, this.baseColor);
        } else {
            console.warn("Could not find document.querySelector('element [this.clouds] ')")
        }
    }
}


