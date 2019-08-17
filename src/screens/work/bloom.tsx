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
import CustomSmoothScroll, { ScrollData } from "../../components/smoothScroll/CustomSmoothScroll";
import { getWrappedRef } from "../../functions/getWrappedRef";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Bloom extends React.Component<IProps> {
    private ref: React.RefObject<CustomSmoothScroll>;
    private wrapperRef: React.RefObject<HTMLDivElement>;

    private firstWrapperRef: React.RefObject<HTMLDivElement>;
    private firstVidRef: React.RefObject<HTMLVideoElement>;

    private firstVidPlayed = false;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
        this.wrapperRef = React.createRef();
        this.firstWrapperRef = React.createRef();
        this.firstVidRef = React.createRef();
    }

    @action
    onClose = () => {
        this.injected.uiStore.portfolioVisible = false;
        this.injected.uiStore.bloomVisible = false;
    };

    @action
    onNext = () => {
        this.injected.uiStore.bravaVisible = true;
        this.injected.uiStore.zoomOutElement(this.wrapperRef.current);

        setTimeout(() => {
            runInAction(() => {
                this.injected.uiStore.bloomVisible = false;
            });
        }, 850);
    };

    componentDidMount() {
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

        if (!this.firstVidPlayed && isVideo1Visible.inView) {
            this.firstVidPlayed = true;
            this.firstVidRef.current.play();
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
                    <CustomSmoothScroll ref={this.ref} className="scrollbars project project--bloom" onScroll={this.onSmoothScroll}>
                        <div className="project__wrapper">
                            <div className="project__block">
                                <h2>Bloom</h2>
                                <div className="project__subtitle">
                                    <div>
                                        Bloom is the first modern studio that allows you to{" "}
                                        <span>fully manage your business</span> in one place.
                                    </div>
                                    <div className="date">February, 2016</div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth">
                                <div
                                    style={{ backgroundImage: "url(/images/img_bloom.jpg)" }}
                                    className="project__title_image"
                                />
                            </div>
                            <div className="project__block">
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Because of its possibilities, bloom can be quite
                                        complicated. In this rebrand, we needed to update bloom’s
                                        look and feel with an energetic system that could match its
                                        innovative product.
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth project__block--image project__block--bloom-0">
                                <div className="image1 appear_on_scroll">
                                    <img src="/images/img_bloom_1.png" />
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth project__block--bloom-1">
                                <div>
                                    <div className="appear_on_scroll">
                                        <img src="/images/img_bloom_2.png" />
                                    </div>
                                    <div>
                                        <div className="text appear_on_scroll">
                                            With new colors, new icons and an updated logo, we helped
                                            bloom reclaim an identity that simplified their product,
                                            and leveraged their unique advantages.
                                        </div>
                                        <img
                                            src="/images/img_bloom_3.png"
                                            className="appear_on_scroll"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Colors</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        To create something fresh, we set bloom in orange and cyan,
                                        next to black and grey. Bright colors help communicate a
                                        youthful feel.
                                    </div>
                                </div>
                                <Colors>
                                    <ColorsPalette
                                        color="#FEA143"
                                        rgb="R 27 / G 172 / B 148"
                                        cmyk="C 0 / M 36 / Y 73 / K 0"
                                        hex="#FEA143"
                                        title="Primary Color"
                                    />
                                    <ColorsPalette
                                        color="#2FCDE7"
                                        rgb="R 255 / G 255 / B 255"
                                        cmyk="C 72 / M 10 / Y 0 / K 9"
                                        hex="#2FCDE7"
                                        title="Cyan"
                                    />
                                    <ColorsPalette
                                        color="#404547"
                                        rgb="R 17 / G 17 / B 17"
                                        cmyk="C 3 / M 1 / Y 0 / K 72"
                                        hex="#404547"
                                        title="Black"
                                    />
                                    <ColorsPalette
                                        color="#A1A8A2"
                                        rgb="R 200 / G 177 / B 127"
                                        cmyk="C 3 / M 0 / Y 2 / K 34"
                                        hex="#A1A8A2"
                                        title="Grey"
                                    />
                                </Colors>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Iconography</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        In line with the new branding, new icons helped make complex
                                        features easy to identify and understand.
                                    </div>
                                </div>
                                <div className="icons_grid appear_on_scroll">
                                    <img src="/images/icons/bloom/1.svg" />
                                    <img src="/images/icons/bloom/2.svg" />
                                    <img src="/images/icons/bloom/3.svg" />
                                    <img src="/images/icons/bloom/4.svg" />
                                    <img src="/images/icons/bloom/5.svg" />
                                    <img src="/images/icons/bloom/6.svg" />
                                    <img src="/images/icons/bloom/7.svg" />
                                    <img src="/images/icons/bloom/8.svg" />
                                </div>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Branding</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        The updated logo is youthful and friendly. Without being too
                                        busy, the bright orange and rounded edges make it stand out.
                                    </div>
                                </div>
                                <div className="project__logo appear_on_scroll">
                                    <div>
                                        <img
                                            className="logo_grid"
                                            src="/images/img_bloom_logogrid.png"
                                        />
                                    </div>
                                    <div className="logo_column">
                                        <img className="logo" src="/images/img_bloom_logo.png" />
                                        <div>
                                            The bright lowercase ‘b’ has a magnetic quality. It’s
                                            eye-catching and might even be something you’d want to
                                            touch. This makes it easy to recognize, and enjoyable to
                                            interact with.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth project__block--image project__block--bloom-2">
                                <div className="image2 mobile_hide">
                                    <img src="/images/img_bloom_4.png" />
                                </div>
                                <div className="image2 mobile_show">
                                    <img src="/images/img_bloom_4_1.png" />
                                    <img src="/images/img_bloom_4_2.png" />
                                </div>
                            </div>
                            <div ref={this.firstWrapperRef} className="project__block project__block--fullwidth project__block--image project__block--bloom-3">
                                <div className="image3">
                                    <video
                                        ref={this.firstVidRef}
                                        src="/images/bloom.mp4"
                                        preload="auto"
                                        autoPlay
                                        playsInline
                                        muted
                                        loop
                                    />
                                    {/* <img src="/images/img_bloom_5.png" /> */}
                                </div>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Fonts</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        To resemble and work well next to the new logo, we chose
                                        gotham rounded font for its rounded edges.
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fonts appear_on_scroll">
                                <div>
                                    <img className="fonts_1" src="/images/img_bloom_fonts.png" />
                                    <img
                                        className="fonts_2"
                                        src="/images/img_bloom_fonts_2.png"
                                    />
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth project__block--image project__block--image--right">
                                <div>
                                    <img className="image4" src="/images/img_bloom_6.png" />
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
                    </CustomSmoothScroll>
                </div>
            </div>
        );
    }
}
