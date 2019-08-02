/**
 * # CloudGenerator
 * There are three parts to this.
 * 1) This file is the JavaScript part,
 * 2) you need also the CSS,
 * 3) and an element with an ID (cloud) in the HTML.
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
    static colors = [
        'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.6)', 'rgba(67, 96, 255, 0.7)',
        'rgba(205,205,215,0.7)'
    ];
    /**
     * Cloud Generator
     * The individual clouds are achieved through the use of CSS box-shadow
     * with a <filter> element containing two SVG filters as its complement.
     * @param elementId
     * @param colorsArray [@type:[]]
     */
    constructor(elementId = "body", colorsArray = null) {
        CloudGenerator.colors = colorsArray || [
            'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.6)', 'rgba(67, 96, 255, 0.7)',
            'rgba(205,205,215,0.7)'
        ];
        console.log(this.constructor.name, elementId, CloudGenerator.colors);
        this.elementId = elementId;
        this.prefill = {
            appendedElements: false, elements: [], success: false
        };
        this.generate();
    }
    static getRandomColor() {
        return CloudGenerator.colors[CloudGenerator.randomize(1, CloudGenerator.colors.length) - 1];
    }
    static randomize(from, to) {
        return ~~(Math.random() * (to - from + 1)) + from;
    }
    static boxShadows(max) {
        let ret = [];
        const fn = CloudGenerator.randomize;
        let colors = this.colors;
        for (let i = 0; i < max; ++i) {
            /**Random Color Segments*/
            let color = CloudGenerator.getRandomColor();
            /** DO NOT REFORMAT! */
            ret.push(`${fn(1, 100)}vw ${fn(1, 100)}vh ${fn(20, 40)}vmin ${fn(1, 20)}vmin ${color}`)
        }
        return ret.join(',');
    }
    appendElements(elementSelector) {
        const body = document.querySelector("body");
        let elements = ["cloud", "filter"];
        this.prefill.appendedElements = true;
        const appendChild = (name, elementObject) => {
            try {
                body.append(elementObject);
                let exists = document.getElementById(name);
                this.prefill.elements.push({
                                               name     : name,
                                               reference: exists,
                                               exists   : !!exists,
                                               result   : (!!exists) ? "[ ✓ ] PASSED" : "[ x ] FAILED"
                                           });
                if (!exists) {
                    this.prefill.appendedElements = false;
                }
            } catch (er) {
                console.warn(er, body);
            }
        }
        if (body) {
            let successful = 0;
            /**language=HTML*/
            const cloud = document.createElement("div");
            cloud.innerHTML = `<div id="cloud"></div>`;
            appendChild("cloud", cloud);
            /**language=HTML*/
            const filter = document.createElement("svg");
            filter.innerHTML = `<svg width="0">
  <filter id="filter">
    <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="9" />
    <feDisplacementMap in="SourceGraphic" scale="280" />
  </filter>
</svg>`;
            appendChild("filter", filter);
            this.prefill.elements.forEach((element) => {
                if (element.exists) {
                    successful++;
                }
            })
            let ca = this.prefill.elements;
            this.prefill.success = (successful === this.prefill.elements.length);
            let result = (this.prefill.success) ? "[ ✓ ] PASSED" : "[ x ] FAILED";
            this.prefill.elements.forEach(e => {
                console.log(` ${e.name} : ${e.exists} \t ${e.result}`);
            })
            console.info(`Total successful: ${successful} of ${this.prefill.elements.length} ${result}`);
        }
    }
    static debounce(func, wait, immediate) {
        let timeout;
        return function () {
            let context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait);
            if (immediate && !timeout) {
                func.apply(context, args);
            }
        };
    }
    generate() {
        console.log("Generating Clouds now!");
        try {
            let cloud = document.getElementById("cloud");
            cloud.style.boxShadow = CloudGenerator.boxShadows(60);
            console.info(cloud);
        } catch (er) {
            console.warn(er);
        }
    }
}


