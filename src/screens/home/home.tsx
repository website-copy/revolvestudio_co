import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Switch, Route } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { HomeScene } from "../../components/three/homeScene";
import * as THREE from "three";
import { runInAction, reaction } from "mobx";
import { ARMarker } from "./arMarker";
import { ARSceneComponent } from "../../components/three/arScene";
import { ARBackSceneComponent } from "../../components/three/arBackScene";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Home extends React.Component<IProps> {
    animHandle: number;

    refTitleContainer: React.RefObject<HTMLDivElement>;

    previousTitleContainerTransform: THREE.Vector2;
    currentTitleIndex = 0;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.refTitleContainer = React.createRef();

        this.previousTitleContainerTransform = new THREE.Vector2(0, 0);

        reaction(
            () => this.injected.uiStore.mountApp,
            (value, reaction) => {
                reaction.dispose();
                if (value) {
                    this.introAnimation();
                    setTimeout(() => {
                        this.showTitle(0);
                        setInterval(() => {
                            this.cycleTitle();
                        }, 6000);
                    }, 1000);
                }
            }
        );
    }

    cycleTitle = () => {
        this.hideTitle(this.currentTitleIndex);
        this.currentTitleIndex =
            this.currentTitleIndex === 2 ? 0 : this.currentTitleIndex + 1;
        this.showTitle(this.currentTitleIndex);
    };

    componentDidMount() {
        this.animHandle = requestAnimationFrame(this.update);
        this.injected.uiStore.pushHomeIfNeeded(this.props.location);
    }

    showTitle(index: number) {
        const span = document.querySelectorAll(`.home__title--${index}`)[0];
        const subtitle = document.querySelectorAll(
            `.home__title--${index} .home__title__sub div`
        );
        if (span) {
            span.classList.add("middle");

            if (subtitle.length > 0) {
                subtitle[0].setAttribute("class", "middle");
            }
        }
    }

    hideTitle(index: number) {
        const span = document.querySelectorAll(`.home__title--${index}`)[0];
        const subtitle = document.querySelectorAll(
            `.home__title--${index} .home__title__sub div`
        );
        if (span) {
            span.classList.remove("middle");
            span.classList.add("up");

            subtitle[0].setAttribute("class", "up");
            setTimeout(() => {
                span.classList.remove("up");
                subtitle[0].setAttribute("class", "");
            }, 2000);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.animHandle);
    }

    introAnimation = () => {
        const elements = document.querySelectorAll(`.stagger`);
        elements.forEach((span, index) => {
            setTimeout(() => {
                span.classList.add("enter-done");
            }, index * 25);
        });

        setTimeout(() => {
            runInAction(() => {
                this.injected.uiStore.staggerDone = true;
            });
        }, 2000 + elements.length * 25);
    };

    update = () => {
        let lengthX = 0;
        let lengthY = 0;

        if (this.injected.uiStore.isUp) {
            lengthX =
                this.previousTitleContainerTransform.x +
                (0 + this.injected.uiStore.mouse.scx * 0.5);
            lengthY =
                this.previousTitleContainerTransform.y +
                (0 + this.injected.uiStore.mouse.scy * 0.5);
        } else {
            lengthX =
                this.previousTitleContainerTransform.x +
                (0 + this.injected.uiStore.mouse.scx * 2);
            lengthY =
                this.previousTitleContainerTransform.y +
                (0 + this.injected.uiStore.mouse.scy * 2);
        }

        this.previousTitleContainerTransform.x =
            this.previousTitleContainerTransform.x - 0.035 * lengthX;
        this.previousTitleContainerTransform.y =
            this.previousTitleContainerTransform.y - 0.035 * lengthY;

        if (this.refTitleContainer.current) {
            this.refTitleContainer.current.style.transform = `
          translate3d(${-this.previousTitleContainerTransform.x * 30}px, ${-this
                .previousTitleContainerTransform.y * 30}px, 0)
        `;
        }

        this.animHandle = requestAnimationFrame(this.update);
    };

    public render() {
        return (
            <div className="home zoom_out">
                <HomeScene {...this.props} />
                {/* <Switch>
          <Route path="/armarker" exact component={ARBackSceneComponent} />
          <Route path="/" component={HomeScene} />
        </Switch> */}
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={
                            this.props.location.pathname
                        }
                        appear={true}
                        timeout={500}
                        classNames="ar_marker-"
                    >
                        <Switch location={this.props.location}>
                            <Route
                                path="/armarker"
                                exact
                                render={() => (
                                    <div className="ar_marker">
                                        <img src="/images/pattern-ar_pattern_1.png" />
                                        <div className="text">
                                            Enter url into your phone’s browser and point your device
                                            this way
                                        </div>
                                        <a href="/ar" className="link">revolvestudio.co/ar</a>
                                    </div>
                                )}
                            />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>

                <div className="home__content">
                    <Switch>
                        <Route
                            path="/"
                            render={() => (
                                <div
                                    className="home__content__inner"
                                    ref={this.refTitleContainer}
                                >
                                    <div className="home__title home__title--0">
                                        <div className="home__title__head">
                                            <span>c</span>
                                            <span>r</span>
                                            <span>e</span>
                                            <span>a</span>
                                            <span>t</span>
                                            <span>i</span>
                                            <span>v</span>
                                            <span>i</span>
                                            <span>t</span>
                                            <span>y</span>
                                        </div>
                                        <div className="home__title__sub">
                                            <div>
                                                we believe creativity begins with an observation
                                            </div>
                                        </div>
                                    </div>
                                    <div className="home__title home__title--1">
                                        <div className="home__title__head">
                                            <span>i</span>
                                            <span>n</span>
                                            <span>s</span>
                                            <span>p</span>
                                            <span>i</span>
                                            <span>r</span>
                                            <span>a</span>
                                            <span>t</span>
                                            <span>i</span>
                                            <span>o</span>
                                            <span>n</span>
                                        </div>
                                        <div className="home__title__sub">
                                            <div>we see the world through the prism of design</div>
                                        </div>
                                    </div>
                                    <div className="home__title home__title--2">
                                        <div className="home__title__head">
                                            <span>s</span>
                                            <span>i</span>
                                            <span>m</span>
                                            <span>p</span>
                                            <span>l</span>
                                            <span>i</span>
                                            <span>c</span>
                                            <span>i</span>
                                            <span>t</span>
                                            <span>y</span>
                                        </div>
                                        <div className="home__title__sub">
                                            <div>we build approachable and usable products</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </Switch>
                </div>
            </div>
        );
    }
}
