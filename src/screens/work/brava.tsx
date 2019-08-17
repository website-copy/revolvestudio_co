import { action, runInAction } from "mobx";
import { inject } from "mobx-react";
import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { RouteComponentProps } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { Colors, ColorsPalette } from "./components/colors";
import { Footer } from "../../components/mainFooter/footer";
import SmoothScroll from "../../components/smoothScroll/SmoothScroll";
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
export class Brava extends React.Component<IProps> {
    private ref: React.RefObject<CustomSmoothScroll>;
    private wrapperRef: React.RefObject<HTMLDivElement>;

    private firstWrapperRef: React.RefObject<HTMLDivElement>;
    private secondWrapperRef: React.RefObject<HTMLDivElement>;
    private firstVidRef: React.RefObject<HTMLVideoElement>;
    private secondVidRef: React.RefObject<HTMLVideoElement>;

    private firstVidPlayed = false;
    private secondVidPlayed = false;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
        this.wrapperRef = React.createRef();
        this.firstVidRef = React.createRef();
        this.secondVidRef = React.createRef();
        this.firstWrapperRef = React.createRef();
        this.secondWrapperRef = React.createRef();
    }

    @action
    onClose = () => {
        this.injected.uiStore.portfolioVisible = false;
        this.injected.uiStore.bravaVisible = false;
    };

    @action
    onNext = () => {
        this.injected.uiStore.artstelVisible = true;
        this.injected.uiStore.zoomOutElement(this.wrapperRef.current);

        setTimeout(() => {
            runInAction(() => {
                this.injected.uiStore.bravaVisible = false;
            });
        }, 850);
    };

    componentDidMount() {
        // var options = {
        //   root: document.querySelector('.scrollbars'),
        //   rootMargin: '0px',
        //   threshold: 1.0 // trigger only when element comes into view completely
        // };
        // var ob = new IntersectionObserver((entries, observer) => {
        //     console.log("IN VIEW")
        // }, options);
        // // observe all targets, when coming into view, change color
        // document.querySelectorAll('video').forEach((item) => {
        //     ob.observe(item);
        // });
    }

    onSmoothScroll = (status: ScrollData) => {
        this.handleScroll({
            scrollTop: status.current,
            top: (status.current * 100) / status.max / 100
        });
    };

    handleScroll = (values: any) => {
        const scrollRef = getWrappedRef(this.ref);
        const isVideo1Visible = scrollRef.isInViewStrict({
            top: this.firstWrapperRef.current.offsetTop,
            left: this.firstWrapperRef.current.offsetLeft,
            right:
                this.firstWrapperRef.current.offsetLeft +
                this.firstWrapperRef.current.clientWidth,
            bottom:
                this.firstWrapperRef.current.offsetTop +
                this.firstWrapperRef.current.clientHeight
        });

        const isVideo2Visible = scrollRef.isInViewStrict({
            top: this.secondWrapperRef.current.offsetTop,
            left: this.secondWrapperRef.current.offsetLeft,
            right:
                this.secondWrapperRef.current.offsetLeft +
                this.secondWrapperRef.current.clientWidth,
            bottom:
                this.secondWrapperRef.current.offsetTop +
                this.secondWrapperRef.current.clientHeight
        });

        if (!this.firstVidPlayed && isVideo1Visible.inView) {
            console.log("in view");
            this.firstVidPlayed = true;
            this.firstVidRef.current.play();
        }

        if (!this.secondVidPlayed && isVideo2Visible.inView) {
            this.secondVidPlayed = true;
            this.secondVidRef.current.play();
        }
    };

    public render() {
        return (
            <div
                className="full_screen"
                ref={this.wrapperRef}
                style={{ transformOrigin: "50% 0" }}
            >
                <div className="full_screen__wrapper">
                    <div className="close" onClick={this.onClose} />
                    {/* <Scrollbars
            className="scrollbars project project--brava"
            style={{ width: "100%", flex: 1 }}
            autoHide={true}
            universal={true}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
          > */}
                    <CustomSmoothScroll
                        ref={this.ref}
                        className="scrollbars project project--brava"
                        onScroll={this.onSmoothScroll}
                    >
                        <div className="project__wrapper">
                            <div className="project__block">
                                <h2>Brava</h2>
                                <div className="project__subtitle">
                                    <div>
                                        A smart oven <span>that empowers you</span> to make
                                        healthier and great tasting food.
                                    </div>
                                    <div className="date">February, 2017</div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth">
                                <div
                                    style={{ backgroundImage: "url(/images/img_brava.jpg)" }}
                                    className="project__title_image"
                                />
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Colors</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        To match the beauty of the product design, the UI is set in
                                        a matte black background. Red, off-white and grey make an
                                        excellent contrast.
                                    </div>
                                </div>
                                <Colors>
                                    <ColorsPalette
                                        color="#FF3630"
                                        rgb="R 255 / G 54 / B 48"
                                        cmyk="C 0 / M 79 / Y 81 / K 0"
                                        hex="#FF3630"
                                        title="Primary Color"
                                    />
                                    <ColorsPalette
                                        color="#E8E8E8"
                                        rgb="R 255 / G 255 / B 255"
                                        cmyk="C 0 / M 0 / Y 0 / K 0"
                                        hex="#FFFFFF"
                                        title="White"
                                    />
                                    <ColorsPalette
                                        color="#222222"
                                        rgb="R 34 / G 34 / B 34"
                                        cmyk="C 0 / M 0 / Y 0 / K 87"
                                        hex="#222222"
                                        title="Black"
                                    />
                                    <ColorsPalette
                                        color="#4B4D54"
                                        rgb="R 75 / G 77 / B 84"
                                        cmyk="C 4 / M 3 / Y 0 / K 67"
                                        hex="#4B4D54"
                                        title="Grey"
                                    />
                                </Colors>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Iconography</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Instantly recognizable, these new custom icons made this
                                        smart technology feel more human.
                                    </div>
                                </div>
                                <div className="icons_grid appear_on_scroll">
                                    <img src="/images/icons/brava/1.svg" />
                                    <img src="/images/icons/brava/2.svg" />
                                    <img src="/images/icons/brava/3.svg" />
                                    <img src="/images/icons/brava/4.svg" />
                                    <img src="/images/icons/brava/5.svg" />
                                    <img src="/images/icons/brava/6.svg" />
                                    <img src="/images/icons/brava/7.svg" />
                                    <img src="/images/icons/brava/8.svg" />
                                    <img src="/images/icons/brava/9.svg" />
                                    <img src="/images/icons/brava/10.svg" />
                                    <img src="/images/icons/brava/11.svg" />
                                    <img src="/images/icons/brava/12.svg" />
                                    <img src="/images/icons/brava/13.svg" />
                                    <img src="/images/icons/brava/14.svg" />
                                    <img src="/images/icons/brava/15.svg" />
                                    <img src="/images/icons/brava/16.svg" />
                                    <img src="/images/icons/brava/17.svg" />
                                    <img src="/images/icons/brava/18.svg" />
                                </div>
                            </div>
                            <div className="brava_pixel_fix">
                                <div
                                    ref={this.firstWrapperRef}
                                    className="project__block project__block--fullwidth"
                                >
                                    <div className="project__inline_image image1">
                                        <video
                                            ref={this.firstVidRef}
                                            src="/images/brava_1.mp4"
                                            poster="/images/brava_poster_1.jpeg"
                                            preload="auto"
                                            playsInline
                                            muted
                                        />
                                    </div>
                                </div>
                                <div
                                    ref={this.secondWrapperRef}
                                    className="project__block project__block--fullwidth"
                                >
                                    <div className="project__inline_image image2">
                                        <video
                                            ref={this.secondVidRef}
                                            src="/images/brava_2.mp4"
                                            poster="/images/brava_poster_2.jpeg"
                                            preload="auto"
                                            playsInline
                                            muted
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Branding</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Despite keeping the same brandmark, we leveraged other
                                        elements to give Brava a refresh.
                                    </div>
                                </div>
                                <div className="project__logo appear_on_scroll">
                                    <div>
                                        <img
                                            className="logo_grid"
                                            src="/images/img_brava_logogrid.png"
                                        />
                                    </div>
                                    <div className="logo_column">
                                        <img className="logo" src="/images/img_brava_logo.png" />
                                        <div>
                                            Black and red work well with the steel look of the
                                            hardware. These colors also transfer nicely to the UI, to
                                            create a recognizable and readable interface.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth">
                                <div
                                    // style={{ backgroundImage: "url(/images/img_brava_3.jpg)" }}
                                    className="project__inline_image image3"
                                >
                                    <img
                                        className="image--parallax"
                                        src="/images/img_brava_3.jpg"
                                    />
                                </div>
                            </div>

                            <div className="project__block">
                                <h2 className="appear_on_scroll">Fonts</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Tofino font complements brava’s design perfectly, and works
                                        well across all devices and platforms.
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fonts appear_on_scroll">
                                <div>
                                    <img
                                        className="fonts_1"
                                        src="/images/img_artstel_fonts.png"
                                    />
                                    <img
                                        className="fonts_2"
                                        src="/images/img_artstel_fonts_2.png"
                                    />
                                </div>
                            </div>
                            <div
                                className="project__block project__block--fullwidth project__block--next"
                                onClick={this.onNext}
                            >
                                <div className="img">
                                    <img
                                        className="image--parallax"
                                        src="/images/img_together.jpg"
                                    />
                                </div>

                                <div className="div">
                                    Next Project <img src="/images/icn_arrow.svg" />
                                </div>
                            </div>
                        </div>
                        <Footer {...this.props} />
                        {/* </Scrollbars> */}
                    </CustomSmoothScroll>
                </div>
            </div>
        );
    }
}
