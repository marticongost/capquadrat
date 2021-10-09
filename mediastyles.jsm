export default class MediaStyles {
    #media;

    constructor(media) {
        this.#media = media;
    }

    appendMediaStyles(mediaQuery, styles) {
        mediaQuery = "@media " + mediaQuery;
        const currentStylesForMediaQuery = this[mediaQuery];
        if (!currentStylesForMediaQuery) {
            this[mediaQuery] = styles;
        } else if (currentStylesForMediaQuery instanceof Array) {
            currentStylesForMediaQuery.push(styles);
        } else {
            this[mediaQuery] = [currentStylesForMediaQuery, styles];
        }
        return this;
    }

    any(styles) {
        this.appendMediaStyles("", styles);
        return this;
    }

    is(breakpoint, styles) {
        if (typeof breakpoint == "object" && breakpoint instanceof Array) {
            for (let bp of breakpoint) {
                this.appendMediaStyles(this.#media.resolveBreakpoint(bp), styles);
            }
        } else {
            this.appendMediaStyles(
                this.#media.resolveBreakpoint(breakpoint).mediaQuery,
                styles
            );
        }
        return this;
    }

    not(breakpoint, styles) {
        this.appendMediaStyles(
            this.#media.resolveBreakpoint(breakpoint).notMediaQuery,
            styles
        );
        return this;
    }

    inRange(start, end, styles) {
        this.appendMediaStyles(
            this.#media.resolveBreakpoint(start).getRangeMediaQuery(end),
            styles
        );
        return this;
    }

    gt(breakpoint, styles) {
        this.appendMediaStyles(
            this.#media.resolveBreakpoint(breakpoint).gtMediaQuery,
            styles
        );
        return this;
    }

    ge(breakpoint, styles) {
        this.appendMediaStyles(
            this.#media.resolveBreakpoint(breakpoint).geMediaQuery,
            styles
        );
        return this;
    }

    lt(breakpoint, styles) {
        this.appendMediaStyles(
            this.#media.resolveBreakpoint(breakpoint).ltMediaQuery,
            styles
        );
        return this;
    }

    le(breakpoint, styles) {
        this.appendMediaStyles(
            this.#media.resolveBreakpoint(breakpoint).leMediaQuery,
            styles
        );
        return this;
    }
}
