export default class Breakpoint {
    // Data passed in at configuration time
    #media;
    #name;
    #index;
    #minWidth;

    // Cache adjacent breakpoints
    #previous;
    #next;

    // Cache media queries
    #mediaQuery;
    #notMediaQuery;
    #gtMediaQuery;
    #geMediaQuery;
    #ltMediaQuery;
    #leMediaQuery;

    constructor(params) {
        this.#media = params.media;
        this.#name = params.name;
        this.#index = params.index;
        this.#minWidth = params.minWidth;
    }

    get name() {
        return this.#name;
    }

    get minWidth() {
        return this.#minWidth;
    }

    get maxWidth() {
        const next = this.next;
        return next ? next.minWidth - 1 : null;
    }

    get contentWidth() {
        return this.#minWidth ? this.#minWidth - this.#media.minMargin : null;
    }

    get index() {
        return this.#index;
    }

    get previous() {
        if (this.#previous === undefined) {
            this.#previous = this.#index
                ? this.#media.getNthBreakpoint(this.#index - 1)
                : null;
        }
        return this.#previous;
    }

    get next() {
        if (this.#next === undefined) {
            this.#next = this.#media.getNthBreakpoint(this.#index + 1);
        }
        return this.#next;
    }

    get mediaQuery() {
        if (!this.#mediaQuery) {
            const rules = [];

            if (this.minWidth) {
                rules.push(`(min-width: ${this.minWidth}px)`);
            }

            if (this.maxWidth) {
                rules.push(`(max-width: ${this.maxWidth}px)`);
            }

            this.#mediaQuery = rules.join(" and ");
        }
        return this.#mediaQuery;
    }

    get notMediaQuery() {
        if (!this.#notMediaQuery) {
            const rules = [];

            if (this.previous) {
                rules.push(this.previous.leMediaQuery);
            }

            if (this.next) {
                rules.push(this.next.geMediaQuery);
            }

            this.#notMediaQuery = rules.join(" or ");
        }
        return this.#notMediaQuery;
    }

    get gtMediaQuery() {
        if (!this.#gtMediaQuery) {
            if (!this.next) {
                throw new Error(`There is no breakpoint bigger than ${this.name}`);
            }
            this.#gtMediaQuery = `(min-width: ${this.next.minWidth}px)`;
        }
        return this.#gtMediaQuery;
    }

    get geMediaQuery() {
        if (!this.#geMediaQuery) {
            this.#geMediaQuery = `(min-width: ${this.minWidth}px)`;
        }
        return this.#geMediaQuery;
    }

    get ltMediaQuery() {
        if (!this.#ltMediaQuery) {
            if (!this.previous) {
                throw new Error(`There is no breakpoint smaller than ${this.name}`);
            }
            this.#ltMediaQuery = `(max-width: ${this.previous.maxWidth}px)`;
        }
        return this.#ltMediaQuery;
    }

    get leMediaQuery() {
        if (!this.#leMediaQuery) {
            this.#leMediaQuery = `(max-width: ${this.maxWidth}px)`;
        }
        return this.#leMediaQuery;
    }

    getRangeMediaQuery(other) {
        other = this.#media.resolveBreakpoint(other);
        if (this === other) {
            return this.mediaQuery;
        }
        let start, end;
        if (this.#index < other.#index) {
            start = this;
            end = other;
        } else {
            start = other;
            end = this;
        }
        return `${start.geMediaQuery} and ${end.leMediaQuery}`;
    }
}
