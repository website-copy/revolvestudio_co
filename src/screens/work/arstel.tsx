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
import CustomSmoothScroll from "../../components/smoothScroll/CustomSmoothScroll";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Artstel extends React.Component<IProps> {
    private wrapperRef: React.RefObject<HTMLDivElement>;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.wrapperRef = React.createRef();
    }

    @action
    onClose = () => {
        this.injected.uiStore.portfolioVisible = false;
        this.injected.uiStore.artstelVisible = false;
    };

    @action
    onNext = () => {
        this.injected.uiStore.bloomVisible = true;
        this.injected.uiStore.zoomOutElement(this.wrapperRef.current);

        setTimeout(() => {
            runInAction(() => {
                this.injected.uiStore.artstelVisible = false;
            });
        }, 850);
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
            className="scrollbars project project--artstel"
            style={{ width: "100%", flex: 1 }}
            autoHide={true}
            universal={true}
            renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
          > */}
                    <CustomSmoothScroll className="scrollbars project project--artstel">
                        <div className="project__wrapper">
                            <div className="project__block">
                                <h2>Artstél</h2>
                                <div className="project__subtitle">
                                    <div>
                                        Find and connect with the top creative talent in the{" "}
                                        <span>photography and fashion</span> industries.
                                    </div>
                                    <div className="date">March, 2017</div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth">
                                <div
                                    style={{ backgroundImage: "url(/images/img_artstel.jpg)" }}
                                    className="project__title_image"
                                />
                            </div>
                            <div className="project__block">
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Artstél is built around a dynamic search feature that makes
                                        it easy to find vetted photographers. Our challenge was to
                                        highlight this feature through design, and show how easy it
                                        was to use.
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth project__block--image">
                                <div>
                                    <img className="image1" src="/images/img_artstel_2.jpg" />
                                </div>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Colors</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Artstél’s primary color is gold. Without getting in the way,
                                        gold is warm, inviting and adds a touch of luxury.
                                    </div>
                                </div>
                                <Colors>
                                    <ColorsPalette
                                        color="#C8B17F"
                                        rgb="R 200 / G 177 / B 127"
                                        cmyk="C 0 / M 9 / Y 29 / K 22"
                                        hex="#C8B17F"
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
                                        color="#111111"
                                        rgb="R 17 / G 17 / B 17"
                                        cmyk="C 0 / M 0 / Y 0 / K 93"
                                        hex="#C8B17F"
                                        title="Black"
                                    />
                                    <ColorsPalette
                                        color="#969696"
                                        rgb="R 200 / G 177 / B 127"
                                        cmyk="C 0 / M 0 / Y 0 / K 41"
                                        hex="#C8B17F"
                                        title="Grey"
                                    />
                                </Colors>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Branding</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        Artstél isn’t built around likes or followers. Simplicity
                                        and quality are the heart of the brand, and its visual
                                        identity.
                                    </div>
                                </div>
                                <div className="project__logo appear_on_scroll">
                                    <div>
                                        <img
                                            className="logo_grid"
                                            src="/images/img_artstel_logogrid.png"
                                        />
                                    </div>
                                    <div className="logo_column">
                                        <img className="logo" src="/images/img_artstel_logo.png" />
                                        <div>
                                            The Artstel visual identity has been built around one
                                            primary color—gold. This reflects an expression of
                                            elegance and sophistication.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth">
                                <div
                                    // style={{ backgroundImage: "url(/images/img_project_0.jpg)" }}
                                    className="project__inline_image"
                                >
                                    <img
                                        className="image--parallax"
                                        src="/images/img_project_0.jpg"
                                    />
                                </div>
                            </div>
                            <div className="project__block project__block--fullwidth">
                                <div className="project__inline_image_2">
                                    <div
                                        // style={{
                                        //   backgroundImage: "url(/images/img_artstel_3.jpg)"
                                        // }}
                                        className="project__inline_image"
                                    >
                                        <img
                                            className="image--parallax"
                                            src="/images/img_artstel_3.jpg"
                                        />
                                    </div>
                                    <div
                                        // style={{
                                        //   backgroundImage: "url(/images/img_artstel_4.jpg)"
                                        // }}
                                        className="project__inline_image"
                                    >
                                        <img
                                            className="image--parallax"
                                            src="/images/img_artstel_4.jpg"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="project__block">
                                <h2 className="appear_on_scroll">Fonts</h2>
                                <div className="project__subtitle appear_on_scroll">
                                    <div>
                                        We chose tofino because of its versatility across screens,
                                        devices, and websites. It limits distractions and it’s very
                                        easy to read.
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
                            <div className="project__block project__block--fullwidth project__block--image project__block--image--right">
                                <div>
                                    <img className="image2" src="/images/img_artstel_5.jpg" />
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
