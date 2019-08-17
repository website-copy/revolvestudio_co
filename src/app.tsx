import * as bodyScrollLock from "body-scroll-lock";
import { observable, reaction, runInAction } from "mobx";
import { inject, Observer } from "mobx-react";
import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Contact } from "./components/contact/contact";
import { Header } from "./components/header/header";
import { MainFooter } from "./components/mainFooter/mainFooter";
import { MobileMenu } from "./components/mobileMenu/mobileMenu";
import { observerWithRouter } from "./functions/observerWithRouter";
import { About } from "./screens/about/about";
import { Home } from "./screens/home/home";
import { Artstel } from "./screens/work/artstel";
import { Bloom } from "./screens/work/bloom";
import { Brava } from "./screens/work/brava";
import { UIStore } from "./stores/uiStore";

interface IProps extends RouteComponentProps {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export default class App extends React.Component<IProps> {
    header: HTMLElement;

    @observable loaded = false;

    isTouch = false;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        const startTime = new Date();
        //this.parallax();

        reaction(
            () => this.injected.uiStore.sceneLoaded,
            (value, reaction) => {
                reaction.dispose();

                const endTime = new Date();
                const delta = startTime.getTime() - endTime.getTime();
                if (delta > 2000) {
                    this.outroAnimation();
                } else {
                    setTimeout(this.outroAnimation, 2000 - delta);
                }

                this.injected.uiStore.preloadSequenceTriggered = true;
            }
        );
    }

    componentDidMount() {
        this.header = document.getElementsByTagName("header")[0];
        this.props.history.listen((location, action) => {
            this.injected.uiStore.pushHomeIfNeeded(location);
        });

        window.addEventListener("resize", this.onWindowResize);
        //window.addEventListener("devicemotion", this.onMotionMove);
        document.documentElement.addEventListener("mousemove", this.onMouseMove);
        document.documentElement.addEventListener("touchstart", this.onTouch);
        document.documentElement.addEventListener("mouseup", this.offTouch);

        this.onWindowResize(null);

        setTimeout(this.introAnimation, 100);
        // setTimeout(this.outroAnimation, 2000);
    }

    onTouch = () => {
        this.isTouch = true;
    };

    offTouch = () => {
        this.isTouch = false;
    };

    introAnimation = () => {
        const spans = document.getElementsByClassName(`main_loader__text`)[0];
        if (spans) {
            //spans.classList.add("middle");

            setTimeout(() => {
                const bar = document.querySelectorAll(`.main_loader__bar`)[0];
                bar.setAttribute("style", "opacity: 1");
            }, 100);
        }
    };

    outroAnimation = () => {
        const spans = document.getElementsByClassName(`main_loader__text`)[0];
        if (spans) {
            spans.classList.remove("middle");
            spans.classList.add("up");

            const bar = document.querySelectorAll(`.main_loader__bar`)[0];
            bar.setAttribute("style", "opacity: 0");
        }

        runInAction(() => {
            this.loaded = true;
        });

        setTimeout(() => {
            runInAction(() => {
                this.injected.uiStore.mountApp = true;
            });
        }, 700);
    };

    onWindowResize = e => {
        this.injected.uiStore.windowWidth = window.innerWidth;
        this.injected.uiStore.windowHeight = window.innerHeight;
        this.injected.uiStore.windowWidthHalf =
            this.injected.uiStore.windowWidth / 2;
        this.injected.uiStore.windowHeightHalf =
            this.injected.uiStore.windowHeight / 2;
        this.injected.uiStore.pushHomeIfNeeded(this.props.location);
    };

    onMotionMove = (e: DeviceMotionEvent) => {
        if (e.rotationRate.alpha || e.rotationRate.beta || e.rotationRate.gamma) {
            let alpha = e.rotationRate.alpha;
            let beta = e.rotationRate.beta;
            if (window.orientation === 0) {
            } else if (window.orientation === -90) {
                alpha = e.rotationRate.beta;
                beta = -e.rotationRate.alpha;
            } else if (window.orientation === 90) {
                alpha = -e.rotationRate.beta;
                beta = e.rotationRate.alpha;
            } else if (window.orientation === 180) {
                alpha = -e.rotationRate.beta;
                beta = -e.rotationRate.alpha;
            }

            this.injected.uiStore.mouse.scx = beta / 100;
            this.injected.uiStore.mouse.scy = alpha / 100;

            this.injected.uiStore.mouse.shx = beta * 20;
            this.injected.uiStore.mouse.shy = alpha * 20;
        }
    };

    onMouseMove = e => {
        if (!this.isTouch) {
            var x = e.clientX;
            var y = e.clientY;
            var cx =
                (x - this.injected.uiStore.windowWidthHalf) /
                this.injected.uiStore.windowWidthHalf;
            var cy =
                (y - this.injected.uiStore.windowHeightHalf) /
                this.injected.uiStore.windowHeightHalf;
            var fx = x / this.injected.uiStore.windowWidth;
            var fy = y / this.injected.uiStore.windowHeight;

            this.injected.uiStore.mouse.sx = x;
            this.injected.uiStore.mouse.sy = y;
            this.injected.uiStore.mouse.shx =
                x - this.injected.uiStore.windowWidthHalf;
            this.injected.uiStore.mouse.shy =
                y - this.injected.uiStore.windowHeightHalf;
            this.injected.uiStore.mouse.scx = cx;
            this.injected.uiStore.mouse.scy = cy;
        }
    };

    componentWillMount() {}

    componentWillUnmount() {
        bodyScrollLock.clearAllBodyScrollLocks();

        window.removeEventListener("resize", this.onWindowResize);
        //window.removeEventListener("devicemotion", this.onMotionMove);

        document.documentElement.removeEventListener("mousemove", this.onMouseMove);
        document.documentElement.removeEventListener("touchstart", this.onTouch);
        document.documentElement.removeEventListener("mouseup", this.offTouch);
    }

    zoomOut = () => {
        this.injected.uiStore.zoomOut();
    };

    zoomIn = () => {
        this.injected.uiStore.zoomIn();
    };

    parallax = () => {
        const windowHeight = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );

        //const scTop = (document.scrollingElement || document.documentElement).scrollTop;

        document.querySelectorAll("[data-parallax]").forEach(function(el, index) {
            const bRect = el.getBoundingClientRect();
            const elTotalHeight = windowHeight + bRect.height;
            const parallaxValue = parseInt(el.getAttribute("data-parallax"));
            const scrollPos = windowHeight / 2 - (bRect.top + bRect.height / 2);
            const scrollPercent = scrollPos / elTotalHeight;

            if (parallaxValue !== 0) {
                if (scrollPercent >= -1 && scrollPercent <= 1) {
                    let value = Math.floor(scrollPercent * parallaxValue * 100);

                    if (value > 0) {
                        //@ts-ignore
                        el.style["transform"] = "translate3d(0, " + value + "px, 0)";
                    } else {
                        //@ts-ignore
                        el.style["transform"] = "translate3d(0, " + value / 2 + "px, 0)";
                    }
                }
            }

            if (scrollPercent >= -1 && scrollPercent <= 1) {
                if (el.classList.contains("parallax_background")) {
                    const bgScrollPos = windowHeight - bRect.top;
                    var bgScrollPercent = bgScrollPos / elTotalHeight;
                    bgScrollPercent =
                        bgScrollPercent < 0 ? 0 : bgScrollPercent > 1 ? 1 : bgScrollPercent;

                    //@ts-ignore
                    el.style["backgroundPosition"] =
                        "50% " + (100 - bgScrollPercent * 100) + "%";
                }
            }
        });

        requestAnimationFrame(this.parallax);
    };

    _app = () => (
        <Observer>
            {() => (
                <div className="app__background">
                    <CSSTransition
                        in={this.injected.uiStore.mountApp}
                        timeout={2500}
                        classNames="app__wrapper-"
                    >
                        <div className="app__wrapper">
                            <Header {...this.props} />
                            <MainFooter {...this.props} />
                            <Home {...this.props} />
                            <TransitionGroup component={null}>
                                <CSSTransition
                                    key={
                                        this.props.location.pathname === "/"
                                            ? this.props.location.key
                                            : "page"
                                    }
                                    appear={true}
                                    timeout={1300}
                                    classNames="page-"
                                >
                                    <Switch location={this.props.location}>
                                        <Route path="/about" exact component={About} />
                                        <Route path="/services" exact component={About} />
                                        <Route path="/work" exact component={About} />
                                    </Switch>
                                </CSSTransition>
                            </TransitionGroup>

                            <CSSTransition
                                in={this.injected.uiStore.contactVisible}
                                unmountOnExit
                                timeout={850}
                                onEnter={this.zoomOut}
                                onExit={this.zoomIn}
                                classNames="full_screen-"
                            >
                                <Contact {...this.props} />
                            </CSSTransition>

                            <CSSTransition
                                in={this.injected.uiStore.artstelVisible}
                                unmountOnExit
                                timeout={850}
                                onEnter={this.zoomOut}
                                onExit={this.zoomIn}
                                classNames="full_screen-"
                            >
                                <Artstel {...this.props} />
                            </CSSTransition>
                            <CSSTransition
                                in={this.injected.uiStore.bloomVisible}
                                unmountOnExit
                                timeout={850}
                                onEnter={this.zoomOut}
                                onExit={this.zoomIn}
                                classNames="full_screen-"
                            >
                                <Bloom {...this.props} />
                            </CSSTransition>
                            <CSSTransition
                                in={this.injected.uiStore.bravaVisible}
                                unmountOnExit
                                timeout={850}
                                onEnter={this.zoomOut}
                                onExit={this.zoomIn}
                                classNames="full_screen-"
                            >
                                <Brava {...this.props} />
                            </CSSTransition>
                            <CSSTransition
                                in={this.injected.uiStore.mobileMenuVisible}
                                unmountOnExit
                                timeout={850}
                                classNames="full_screen-"
                            >
                                <MobileMenu />
                            </CSSTransition>
                        </div>
                    </CSSTransition>

                    <CSSTransition
                        in={!this.injected.uiStore.mountApp}
                        unmountOnExit
                        timeout={1500}
                        classNames="main_loader-"
                    >
                        <div className="main_loader">
                            <div className="main_loader__text middle">
                                <span>R</span>
                                <span>e</span>
                                <span>v</span>
                                <span>ø</span>
                                <span>l</span>
                                <span>v</span>
                                <span>e</span>
                            </div>
                            <div className="main_loader__bar">
                                <div className="main_loader__bar__scale" />
                            </div>
                        </div>
                    </CSSTransition>
                </div>
            )}
        </Observer>

    );

    public render() {
        return (
            //this._app()
            <Switch>
                <Route path="/" render={this._app} />
            </Switch>
        );
    }
}
