import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { Footer } from "../../components/mainFooter/footer";
import { action, reaction, observable } from "mobx";
import { Location } from "history";
import { TopLoader } from "../../components/top_loader/topLoader";
import { Carousel } from "../../components/carousel/carousel";
import { Hover } from "../../components/hover/hover";
import CustomSmoothScroll, {
    ScrollData
} from "../../components/smoothScroll/CustomSmoothScroll";
import { getWrappedRef } from "../../functions/getWrappedRef";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class About extends React.Component<IProps> {
    header: HTMLElement;

    ref: React.RefObject<CustomSmoothScroll>;
    refPixelFix: React.RefObject<HTMLDivElement>;
    refServices: React.RefObject<HTMLDivElement>;
    refWork: React.RefObject<HTMLDivElement>;
    refFooter: React.RefObject<HTMLDivElement>;
    refFixedFooter2: React.RefObject<HTMLDivElement>;
    refFixedFooter: React.RefObject<HTMLDivElement>;

    currentLocation = "";
    unregisterHistoryListen: any;
    //disposer: any;
    headerOffset = 0;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
        this.refPixelFix = React.createRef();
        this.refServices = React.createRef();
        this.refWork = React.createRef();
        this.refFooter = React.createRef();
        this.refFixedFooter = React.createRef();
        this.refFixedFooter2 = React.createRef();

        // this.disposer = reaction(
        //   () => this.injected.uiStore.wheelDelta,
        //   delta => {
        //     this.ref.current.scrollTop(this.ref.current.getScrollTop() + delta);
        //   }
        // );
    }

    componentWillMount() {
        this.unregisterHistoryListen = this.props.history.listen(
            (location, action) => {
                this.disableScrollIfNeeded(location);
                this.scrollIfNeeded(location);
            }
        );
        if (this.props.location.pathname !== "/about") {
            setTimeout(() => {
                this.scrollIfNeeded(this.props.location);
            }, 500);
        }
    }

    componentDidMount() {
        this.header = document.getElementsByTagName("header")[0];
    }

    componentWillUnmount() {
        //this.disposer();

        this.unregisterHistoryListen();
    }

    disableScrollIfNeeded = (location: Location<any>) => {
        if (location.pathname === "/") {
            getWrappedRef(this.ref).disable();

            this.injected.uiStore.scrollPosition = 0;
            this.injected.uiStore.scrollTop = 0;
        }
    }

    scrollIfNeeded = (location: Location<any>) => {
        if (location.pathname === "/") {
            document
                .getElementsByClassName("top_loader")[0]
                .setAttribute("style", "opacity: 0");
            this.header.setAttribute(
                "style",
                `transform: translateY(${
                    this.headerOffset < -155 ? -155 : this.headerOffset
                }px)`
            );
            setTimeout(() => {
                this.header.classList.add("transitioning");
                this.header.setAttribute("style", "transform: translateY(0)");
                setTimeout(() => {
                    this.header.classList.remove("transitioning");
                }, 1300);
            });
        } else {
            if (this.currentLocation !== location.pathname) {
                const el = document.getElementById(location.pathname);
                if (el) {
                    // const rect = el.getBoundingClientRect();
                    // console.log(rect, this.ref.current.getScrollTop());
                    // this.ref.current.view.scroll({
                    //   top: rect.top + this.ref.current.getScrollTop(),
                    //   left: 0,
                    //   behavior: "smooth"
                    // });
                }
            }
        }
        this.currentLocation = location.pathname;
    };

    @action
    onContact = () => {
        this.injected.uiStore.contactVisible = true;
    };

    adjustHeader = (scrollTop: number) => {
        let trs = window.innerHeight < 880 ? 340 : 440;
        if (window.innerWidth < 720) {
            trs = 416;
        }

        if (scrollTop < trs) {
            this.headerOffset = 0;
            this.header.setAttribute("style", "transform: translateY(0)");
        } else {
            const offset = (trs - scrollTop) / 2;
            if (offset < -23) {
                this.headerOffset = trs - scrollTop + 23;
                this.header.setAttribute(
                    "style",
                    `transform: translateY(${trs - scrollTop + 23}px)`
                );
            } else {
                this.headerOffset = offset;
                this.header.setAttribute("style", `transform: translateY(${offset}px)`);
            }
        }
    };

    onSmoothScroll = (status: ScrollData) => {
        this.injected.uiStore.scrollPosition = status.current;
        this.injected.uiStore.scrollTop = (status.current * 100) / status.max / 100;

        this.handleScroll({
            scrollTop: this.injected.uiStore.scrollPosition,
            top: this.injected.uiStore.scrollTop
        });
    };

    handleScroll = (values: any) => {
        this.adjustHeader(values.scrollTop);

        if (window.innerWidth > 1024) {
            const scrollRef = getWrappedRef(this.ref);
            const isServicesVisible = scrollRef.isInViewStrict({
                top:
                    this.refServices.current.offsetTop +
                    this.refPixelFix.current.offsetTop,
                left: this.refServices.current.offsetLeft,
                right:
                    this.refServices.current.offsetLeft +
                    this.refServices.current.clientWidth,
                bottom:
                    this.refServices.current.offsetTop +
                    this.refPixelFix.current.offsetTop +
                    this.refServices.current.clientHeight
            });
            const isWorkVisible = scrollRef.isInViewStrict({
                top: this.refWork.current.offsetTop,
                left: this.refWork.current.offsetLeft,
                right:
                    this.refWork.current.offsetLeft + this.refWork.current.clientWidth,
                bottom:
                    this.refWork.current.offsetTop + this.refWork.current.clientHeight
            });

            if (isServicesVisible.inView) {
                this.refFooter.current.classList.add("hidden");
                this.refFixedFooter.current.classList.remove("hidden");
                this.refFixedFooter.current.classList.add("fixed");

                if (isWorkVisible.inView) {
                    this.refFixedFooter2.current.classList.remove("hidden");
                    this.refFixedFooter.current.classList.add("hidden");
                } else {
                    this.refFixedFooter.current.classList.remove("hidden");
                    this.refFixedFooter2.current.classList.add("hidden");
                }
            } else {
                this.refFooter.current.classList.remove("hidden");
                this.refFixedFooter.current.classList.add("hidden");
                this.refFixedFooter.current.classList.remove("fixed");
            }
        }
    };

    public render() {
        return (
            <React.Fragment>
                <div className="page">
                    {/* <Scrollbars
            ref={this.ref}
            className="scrollbars"
            style={{ width: "100%", flex: 1 }}
            autoHide={true}
            universal={true}
            onScrollFrame={this.handleScroll}

          > */}
                    <CustomSmoothScroll
                        ref={this.ref}
                        className="scrollbars zoom_out"
                        locked={this.injected.uiStore.portfolioVisible}
                        onScroll={this.onSmoothScroll}
                    >
                        <div className="page__wrapper">
                            <div ref={this.refPixelFix} className="pixel_fix">
                                <div
                                    className="page__block page__block--white page__block--two_columns"
                                    id="/about"
                                >
                                    <div className="page__block__grid">
                                        <div className="w_400 tablet_portrait_hide">
                                            <div className="page__block__title page__block__title--no_name  ">
                                                01 /
                                            </div>
                                            <div className="about_left_text">
                                                We love being an integral part of the creative process,
                                                and rising to the challenge of making complex software
                                                approachable to the masses.{" "}
                                                <span>
                          With all of our work, we hope to empower users
                        </span>{" "}
                                                and simplify their everyday lives.
                                            </div>
                                        </div>
                                        <div className="w_410">
                                            <div className="page__block__name appear_on_scroll">
                                                About
                                            </div>
                                            <div className="page__block__title appear_on_scroll">
                                                We believe in forward-thinking design
                                            </div>
                                            <div className="line appear_on_scroll" />
                                            <div className="about_right_text appear_on_scroll">
                                                <div className="about_left_text">
                                                    We love being an integral part of the creative
                                                    process, and rising to the challenge of making complex
                                                    software approachable to the masses.{" "}
                                                    <span>
                            With all of our work, we hope to empower users
                          </span>{" "}
                                                    and simplify their everyday lives.
                                                </div>
                                                We believe that forward-thinking design can be a driving
                                                force behind technological progress. In the various
                                                projects we were a part of, our team have worked to
                                                advance user experience. To stay current by staying
                                                ahead of the current. To infuse the simplest
                                                interactions with beauty and a sense of ergonomics.
                                                <br />
                                                <br />
                                                The only constant in this world is change, and that's
                                                especially evident in the way we design and the way we
                                                build. We’re excited to see the challenges presented by
                                                new technologies, and apply our skills toward solving
                                                the problems that come with those changes.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="page__block__footer" />
                                    <div
                                        ref={this.refFooter}
                                        className="page__block__footer page__block__footer--fixed"
                                    >
                                        <div>
                                            <div className="start">
                                                <a onClick={this.onContact}>
                                                    <Hover active={true} className="black">
                                                        Start a Project
                                                    </Hover>
                                                </a>
                                            </div>
                                            <div className="est">
                                                <span>Est. 02 — 08</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    ref={this.refServices}
                                    className="page__block page__block--grey page__block--two_columns"
                                    id="/services"
                                >
                                    <div className="page__block__grid">
                                        <div className="w_400 tablet_portrait_hide appear_on_scroll">
                                            <div className="page__block__title page__block__title--no_name">
                                                02 /
                                            </div>
                                        </div>
                                        <div className="w_410 appear_on_scroll">
                                            <div className="page__block__name">Services</div>
                                            <div className="page__block__title">
                                                Designed for today and built for tomorrow
                                            </div>
                                        </div>
                                    </div>
                                    <div className="line appear_on_scroll" />
                                    <div className="page__block__grid page__block__grid--services appear_on_scroll">
                                        <div className="w_400">
                                            <div className="page__block__subtitle">Design</div>
                                            <div className="page__block__services">
                                                Creative Direction
                                                <br />
                                                Brand Identity
                                                <br />
                                                UI/UX Design
                                                <br />
                                                Interaction Design
                                                <br />
                                                Websites and Mobile Apps
                                                <br />
                                                Product Design
                                                <br />
                                                Prototyping and Testing
                                                <br />
                                                Iconography
                                                <br />
                                                Illustrations
                                            </div>
                                        </div>
                                        <div className="w_410 development">
                                            <div className="page__block__subtitle">Development</div>
                                            <div className="page__block__services">
                                                HTML/CSS/JS
                                                <br />
                                                Full Stack Web/Mobile Development
                                                <br />
                                                Backend Development
                                                <br />
                                                REST API Development/Integration <br />
                                                SQL/NoSQL Database Development <br />
                                                Native iOS Development (Swift) <br />
                                                React Native Development for iOS/Android <br />
                                                React Web/Web Apps Development <br />
                                                Azure Cloud Development
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        ref={this.refFixedFooter2}
                                        className="page__block__footer hidden"
                                    >
                                        <div className="start">
                                            <a onClick={this.onContact}>
                                                <Hover active={true} className="black">
                                                    Start a Project
                                                </Hover>
                                            </a>
                                        </div>
                                        <div className="est">
                                            <span>Est. 02 — 08</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                ref={this.refWork}
                                className="page__block page__block--dark mobile_hide"
                            >
                                <div className="page__block__logo_grid appear_on_scroll">
                                    <img src="/images/logo_google.png" />
                                    <img src="/images/logo_adobe.png" />
                                    <img src="/images/logo_artstel.png" />
                                    <img src="/images/logo_sandisk.png" />
                                    <img src="/images/logo_huawei.png" />
                                    <img src="/images/logo_paypal.png" />
                                    <img src="/images/logo_bloom.png" />
                                    <img src="/images/logo_stubhub.png" />
                                    <img src="/images/logo_vmware.png" />
                                </div>
                                <div className="page__block__footer">
                                    {/* <div className="start">
                    <a onClick={this.onContact}>Start a Project</a>
                  </div>
                  <div>
                    <a href="#">Share This</a>
                  </div> */}
                                </div>
                            </div>
                            <div
                                className="page__block page__block--white page__block--two_columns"
                                id="/work"
                            >
                                <Carousel {...this.props} />
                                <div className="page__block__footer page__block__footer--gallery">
                                    <div className="start">
                                        <a onClick={this.onContact}>
                                            <Hover active={true} className="black">
                                                Start a Project
                                            </Hover>
                                        </a>
                                    </div>
                                    <div className="est">
                                        <span>Est. 02 — 08</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={this.onContact}
                                className="page__block page__block--hero"
                            >
                                <div className="img image--parallax" />
                                {/* <img src="/images/img_together.jpg" /> */}
                                <div className="div">
                                    Let's make something together{" "}
                                    <img src="/images/icn_arrow.svg" />
                                </div>
                            </div>
                            <Footer {...this.props} />
                        </div>
                    </CustomSmoothScroll>
                    {/* </Scrollbars> */}
                </div>
                <TopLoader />
                <div
                    ref={this.refFixedFooter}
                    className="page__block__footer page__block__footer--fixed hidden"
                >
                    <div>
                        <div className="start">
                            <a onClick={this.onContact}>
                                <Hover active={true} className="black">
                                    Start a Project
                                </Hover>
                            </a>
                        </div>
                        <div className="est">
                            <span>Est. 02 — 08</span>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
