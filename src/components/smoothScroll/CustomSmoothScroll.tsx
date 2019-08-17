import * as React from "react";
import * as VirtualScroll from "virtual-scroll";
import { inject } from "mobx-react";
import { UIStore } from "../../stores/uiStore";
import { AppStore } from "../../stores/appStore";
import * as classNames from "classnames";
import { debounce } from "../../functions/debounce";
import { PerformanceSpeed } from "../../functions/sniffer";

interface IProps {
    className?: string;
    onScroll?: (options: ScrollData) => void;
    locked?: boolean;
}

interface IInjectedProps {
    uiStore: UIStore;
}

export interface ScrollData {
    ease: number, scrolling: boolean; direction: direction; current: number; target: number; last: number; fixed: number; max: number;
}

@inject("uiStore")
export default class CustomSmoothScroll extends React.Component<IProps> {
    rAFcb: number;
    cache: Array<[Element, Rect, boolean]>;
    fxs: Array<[Element, Rect, number]>;
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    private $scroll: React.RefObject<HTMLDivElement>;
    private $container: React.RefObject<HTMLDivElement>;
    private resizing = false;
    private disabled = false;

    threshold = 200;

    vs: VirtualScroll;
    options: ScrollData;

    contentHeight = 0;

    recalcDebounce = debounce(function() {
        console.log("recalc debounce");
        this.resizing = false;
        this.initElements();
    }, 600, false);

    constructor(props) {
        super(props);

        this.$scroll = React.createRef();
        this.$container = React.createRef();
        this.vs = new VirtualScroll({
            passive: true,
            touchMultiplier: 3,
            firefoxMultiplier: 60
        });

        this.options = {
            ease: this.injected.uiStore.deviceInfos.useNative ? 1 : this.injected.uiStore.deviceInfos.isDesktop ? .1 : .25,
            scrolling: false,
            direction: direction.none,
            current: 0,
            target: 0,
            last: 0,
            fixed: 0,
            max: 0
        }
        this.cache = new Array<[Element, Rect, boolean]>();
        this.fxs = new Array<[Element, Rect, number]>();
    }

    componentDidMount() {
        if (!this.injected.uiStore.deviceInfos.useNative) {
            this.vs.on(this.onVs);
        } else {
            this.$scroll.current.addEventListener("scroll", this.onNativeScroll);
        }

        this.contentHeight = this.$container.current.clientHeight;
        this.initElements();

        this.rAFcb = requestAnimationFrame(this.rAF);
        window.addEventListener("resize", this.onWindowResize);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAFcb);

        this.vs.destroy();

        window.removeEventListener("resize", this.onWindowResize);
        this.$scroll.current.removeEventListener("scroll", this.onNativeScroll);
    }

    initElements = () => {
        this.contentHeight = this.$container.current.clientHeight;
        this.options.max = this.$container.current.clientHeight - window.innerHeight;

        this.cache = new Array<[Element, Rect, boolean]>();
        this.fxs = new Array<[Element, Rect, number]>();

        const appearElements = this.$container.current.getElementsByClassName("appear_on_scroll");
        const parentRect = this.$container.current.getBoundingClientRect();
        Array.prototype.forEach.call(appearElements, (element) => {
            const bounds = this.getBounds(element, parentRect);
            const inView = this.isInView(bounds);
            const el = [element, bounds, false] as [Element, Rect, boolean];
            this.cache.push(el);

            if (!inView.inView) {
                this.outView(el, inView.direction);
            }
        })

        const fxElements = this.$container.current.getElementsByClassName("image--parallax");
        Array.prototype.forEach.call(fxElements, (element) => {
            const bounds = this.getBounds(element, parentRect);
            this.fxs.push([element, bounds, -0.05]);
            //this.rAFFXs();
        })
    }

    public scrollToTop = () => {
        if (!this.injected.uiStore.deviceInfos.useNative) {
            this.options.target = 0;
        } else {
            this.$scroll.current.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    onWindowResize = () => {
        this.resizing = true;
        this.recalcDebounce();
    }

    onNativeScroll = (e: any) => {
        if (!this.props.locked && !this.disabled) {
            const n = this.$scroll.current.scrollTop
            if (this.options.current !== this.options.last) {
                this.options.direction = this.options.current >= this.options.last ? direction.down : direction.up;
            }
            this.options.target = n;
            this.clamp();
            this.options.last = this.options.current;
        }
    }

    onVs = (e: {x: number, y: number, deltaX: number, deltaY: number, originalEvent: WheelEvent}) => {
        if (!this.props.locked && !this.disabled) {
            this.options.direction = this.options.current >= this.options.last ? direction.down : direction.up;
            this.options.target += Math.round(e.deltaY * -.5);
            this.clamp();
            this.options.last = this.options.current
        }
    }

    rAF = () => {
        this.options.scrolling = this.E(this.options.target, 0) !== this.E(this.options.current, 0);

        if (this.options.scrolling) {

            this.options.current += (this.options.target - this.options.current) * this.options.ease;
            this.options.fixed = this.options.scrolling ? 3 : 0;

            if (!this.injected.uiStore.deviceInfos.useNative) {
                const e = this.getTranslate3d();
                this.$container.current.style["transform"] = e;
            }

            if (!this.props.locked && !this.disabled) {
                if (this.props.onScroll) {
                    this.props.onScroll(this.options);
                }
            }

            this.rAFElements();
            this.rAFFXs();
        }

        if (this.contentHeight !== this.$container.current.clientHeight && !this.resizing) {
            this.initElements();
        }

        if (this.options.current > window.innerHeight) {
            this.$scroll.current.classList.add("hide-overscroll")
        } else {
            this.$scroll.current.classList.remove("hide-overscroll")
        }

        this.rAFcb = requestAnimationFrame(this.rAF);
    }

    rAFElements = () => {
        if (this.injected.uiStore.deviceInfos.isDesktop && this.injected.uiStore.deviceInfos.perf >= PerformanceSpeed.PERF_HIGH) {
            const n = this.threshold - 50;
            const i = this.$scroll.current.clientHeight;

            this.cache.forEach(item => {
                const inView = this.isInView(item[1]);
                !item[2] && inView.start > -n && i + n > inView.end || (inView.inView ? this.inView(item, inView.direction) : this.outView(item, inView.direction))
            })
        }
    }

    rAFFXs = () => {
        if (this.injected.uiStore.deviceInfos.isDesktop && this.injected.uiStore.deviceInfos.perf >= PerformanceSpeed.PERF_HIGH) {
            this.fxs.forEach(item => {
                const inView = this.isInView(item[1]);
                const start = inView.top + (inView.bottom - inView.top) / 2;
                const r = this.E(this.options.current, this.options.fixed);
                const o = r - (start - (this.$scroll.current.clientHeight * 0.5))
                const speed = o * item[2];
                const l = this.E(speed, this.options.fixed);

                (item[0] as HTMLElement).style["transform"] = "translate3d(0, " + l + "px, 0)";
            })
        }
    }

    getBounds = (e: Element, parentRect?: ClientRect) => {
        const bRect = e.getBoundingClientRect();
        if (parentRect) {
            return {
                top: bRect.top - parentRect.top,
                right: bRect.right - parentRect.left,
                bottom: bRect.bottom - parentRect.top,
                left: bRect.left  - parentRect.left
                // top: bRect.top + this.options.current - parentRect.top,
                // right: bRect.right + this.options.current - parentRect.left,
                // bottom: bRect.bottom + this.options.current - parentRect.top,
                // left: bRect.left + this.options.current - parentRect.left
            } as Rect
        } else {
            return {
                top: bRect.top + this.options.current,
                right: bRect.right + this.options.current,
                bottom: bRect.bottom + this.options.current,
                left: bRect.left + this.options.current
            } as Rect
        }
    }

    public disable = () => {
        this.disabled = true;
    }

    public enable = () => {
        this.disabled = false;
    }

    public isInView = (e: Rect) => {
        const o = this.options.current;
        const s = this.threshold;
        const l = this.$scroll.current.clientHeight;
        const u = e.top - o
            , c = e.bottom - o
            , h = l + s > u && c > -s
            , d = 0 > u ? "top" : "bottom";

        return {
            top: e.top,
            right: e.right,
            bottom: e.bottom,
            left: e.left,
            start: u,
            end: c,
            inView: h,
            direction: d
        } as InViewRect
    }

    public isInViewStrict = (e: Rect) => {
        const o = this.options.current;
        const s = 0
        const l = this.$scroll.current.clientHeight;
        const u = e.top - o
            , c = e.bottom - o
            , h = l + s > u && c > -s
            , d = 0 > u ? "top" : "bottom";

        return {
            top: e.top,
            right: e.right,
            bottom: e.bottom,
            left: e.left,
            start: u,
            end: c,
            inView: h,
            direction: d
        } as InViewRect
    }

    inView = (e: [Element, Rect, boolean], d: string) => {
        if (!e[2]) {
            e[2] = true;
            e[0].classList.remove("out_view", "out_" + d);
            e[0].classList.add("in_view");
        }
    }

    outView = (e: [Element, Rect, boolean], d: string) => {
        if (e[2]) {
            e[2] = false;
            e[0].classList.remove("in_view");
            e[0].classList.add("out_view", "out_" + d);
        }
    }

    getTranslate3d = () => {
        const e = (this.options.fixed, this.E(this.options.current, this.options.fixed));
        return "translate3d(0,-" + e + "px,0)";
    }

    clamp = () => {
        //this.options.max = this.$container.current.clientHeight - window.innerHeight;
        this.options.target = Math.round(Math.min(Math.max(this.options.target, 0), this.options.max))
    }

    E = (e, t) => {
        const _t = 0 !== t ? Math.pow(10, t) : 1e3;
        return Math.round(e * _t) / _t
    }

    render() {
        return (
            <section
                ref={this.$scroll}
                className={ classNames({"scroll-native": this.injected.uiStore.deviceInfos.useNative},this.props.className)}
            >
                <div ref={this.$container}>{this.props.children}</div>
            </section>
        );
    }
}

enum direction {
    none,
    up,
    down
}

interface Rect {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

interface InViewRect extends Rect {
    start: number;
    end: number;
    inView: boolean;
    direction: string;
}
