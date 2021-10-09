import Breakpoint from "./breakpoint.jsm";
import MediaStyles from "./mediastyles.jsm";

export default class Media {
    #minMargin;

    constructor(params) {
        this.#minMargin = params.minMargin || 30;
        const breakpoints = {};
        let index = 0;
        for (let breakpointParams of params.breakpoints) {
            breakpoints[breakpointParams.name] = new Breakpoint({
                media: this,
                index: index++,
                ...breakpointParams,
            });
        }
        breakpoints[Symbol.iterator] = function* () {
            yield* Object.values(breakpoints);
        };
        Object.defineProperty(this, "breakpoints", {
            value: Object.freeze(breakpoints),
        });
    }

    get minMargin() {
        return this.#minMargin;
    }

    getNthBreakpoint(index) {
        for (let breakpoint of this.breakpoints) {
            if (!index) {
                return breakpoint;
            }
            index--;
        }
        return null;
    }

    resolveBreakpoint(designator) {
        const breakpoint =
            typeof designator == "string" ? this.breakpoints[designator] : designator;
        if (!breakpoint) {
            throw new Error(`${designator} is not a valid breakpoint`);
        }
        return breakpoint;
    }

    any(styles) {
        return new MediaStyles(this).any(styles);
    }

    is(breakpoint, styles) {
        return new MediaStyles(this).is(breakpoint, styles);
    }

    not(breakpoint, styles) {
        return new MediaStyles(this).not(breakpoint, styles);
    }

    inRange(start, end, styles) {
        return new MediaStyles(this).inRange(start, end, styles);
    }

    gt(breakpoint, styles) {
        return new MediaStyles(this).gt(breakpoint, styles);
    }

    ge(breakpoint, styles) {
        return new MediaStyles(this).ge(breakpoint, styles);
    }

    lt(breakpoint, styles) {
        return new MediaStyles(this).lt(breakpoint, styles);
    }

    le(breakpoint, styles) {
        return new MediaStyles(this).le(breakpoint, styles);
    }

    globalStyles() {
        const css = {"--cq-min-margin": `${this.#minMargin}px`};
        for (let breakpoint of this.breakpoints) {
            css[`@media ${breakpoint.mediaQuery}`] = {
                "--cq-min-width": `${breakpoint.minWidth || 0}px`,
                "--cq-max-width": `${breakpoint.maxWidth || 0}px`,
                "--cq-content-width": `${breakpoint.contentWidth}px`,
            };
        }
        return css;
    }
}
