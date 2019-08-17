import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import * as THREE from "three";
import * as classNames from "classnames";
import { action } from "mobx";
import { Hover, HoverNavLink } from "../hover/hover";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Header extends React.Component<IProps> {
    ref: React.RefObject<HTMLElement>;
    auidioRef: React.RefObject<HTMLAudioElement>;
    audioIcnRef: React.RefObject<HTMLDivElement>;

    animHandle: number;
    previousContainerTransform: THREE.Vector2;
    refContainer: React.RefObject<HTMLDivElement>;

    isPlaying = false;
    isFullscreen = false;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
        this.refContainer = React.createRef();
        this.auidioRef = React.createRef();
        this.audioIcnRef = React.createRef();
        this.previousContainerTransform = new THREE.Vector2(0, 0);
    }

    componentDidMount() {
        // requestAnimationFrame(() => {
        //   this.audioIcnRef.current.classList.add("animated");
        // })

    }

    onFullScreen = () => {
        const elem = document.getElementById("app");

        if (!this.isFullscreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
                //@ts-ignore
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                //@ts-ignore
                elem.mozRequestFullScreen();
                //@ts-ignore
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                //@ts-ignore
                elem.webkitRequestFullscreen();
                //@ts-ignore
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                //@ts-ignore
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                //@ts-ignore
            } else if (document.mozCancelFullScreen) { /* Firefox */
                //@ts-ignore
                document.mozCancelFullScreen();
                //@ts-ignore
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                //@ts-ignore
                document.webkitExitFullscreen();
                //@ts-ignore
            } else if (document.msExitFullscreen) { /* IE/Edge */
                //@ts-ignore
                document.msExitFullscreen();
            }
        }

        this.isFullscreen = !this.isFullscreen;
    };

    @action
    onShowMobileMenu = () => {
        this.injected.uiStore.mobileMenuVisible = true;
    }

    @action
    onWork = () => {
        this.injected.uiStore.portfolioVisible = true;
        this.injected.uiStore.artstelVisible = true;
    }

    onMouseEnter = () => {
        this.injected.uiStore.menuHover = true;
    };

    onMouseLeave = () => {
        this.injected.uiStore.menuHover = false;
    };

    onAudio = () => {
        if (this.isPlaying) {
            this.auidioRef.current.pause();
        } else {
            this.auidioRef.current.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    update = () => {
        const lengthX =
            this.previousContainerTransform.x + (0 + this.injected.uiStore.mouse.scx);
        const lengthY =
            this.previousContainerTransform.y + (0 + this.injected.uiStore.mouse.scy);


        this.previousContainerTransform.x =
            this.previousContainerTransform.x - 0.03 * lengthX;
        this.previousContainerTransform.y =
            this.previousContainerTransform.y - 0.03 * lengthY;
        this.refContainer.current.style.transform = `
      translate3d(${-this.previousContainerTransform.x * 5}px, ${-this
            .previousContainerTransform.y * 5}px, 0)
      `;

        this.animHandle = requestAnimationFrame(this.update);
    };

    public render() {
        return (
            <header ref={this.ref}>
                <div ref={this.refContainer} className="zoom_out">
                    <div className="logo stagger">Revølve.</div>
                    <div className="menu">
                        <HoverNavLink
                            exact
                            className={classNames({
                                menu__link: true,
                                stagger: true,
                                "enter-done": this.injected.uiStore.staggerDone
                            })}
                            activeClassName="menu__link--active"
                            to="/"
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        >
                            Home
                        </HoverNavLink>
                        <HoverNavLink
                            exact
                            className={classNames({
                                menu__link: true,
                                stagger: true,
                                "enter-done": this.injected.uiStore.staggerDone
                            })}
                            activeClassName="menu__link--active"
                            to="/about"
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        >
                            About
                        </HoverNavLink>
                        <a
                            href="https://medium.com/thinking-design/ux-first-aesthetics-second-andrew-baygulov-shares-his-advice-for-creating-beautiful-effective-2edcc72b6aec"
                            target="_blank"
                            className={classNames({
                                menu__link: true,
                                stagger: true,
                                "enter-done": this.injected.uiStore.staggerDone
                            })}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        >
                            <Hover>Press</Hover>
                        </a>
                        <a
                            href="https://dribbble.com/revolve"
                            target="_blank"
                            className={classNames({
                                menu__link: true,
                                stagger: true,
                                "enter-done": this.injected.uiStore.staggerDone
                            })}
                            onMouseEnter={this.onMouseEnter}
                            onMouseLeave={this.onMouseLeave}
                        >
                            <Hover>Social</Hover>
                        </a>
                    </div>
                    <div className="icons">
                        {/* <div ref={this.audioIcnRef} className="stagger icn_audio" onClick={this.onAudio}>
              <div className="inner">
                <div className="bar first"/>
                <div className="bar second"/>
                <div className="bar third"/>
                <div className="bar fourth"/>
                <div className="bar fifth"/>
              </div>
            </div> */}
                        <img className="stagger icn_audio_svg" src="/images/icn_player.svg" onClick={this.onAudio}/>
                        <img
                            className="stagger tablet_hide last"
                            src="/images/icn_fullscreen.svg"
                            onClick={this.onFullScreen}
                        />
                        <img
                            className="stagger tablet_show last"
                            src="/images/icn_ham.svg"
                            onClick={this.onShowMobileMenu}
                        />
                    </div>
                </div>
                <audio ref={this.auidioRef} src="/music.mp3" loop/>
            </header>
        );
    }
}
