import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Link } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { action, reaction } from "mobx";
import * as THREE from "three";
import { Hover } from "../hover/hover";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class MainFooter extends React.Component<IProps> {
    animHandle: number;
    refContainer: React.RefObject<HTMLDivElement>;

    previousContainerTransform: THREE.Vector2;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.refContainer = React.createRef();
        this.previousContainerTransform = new THREE.Vector2(0, 0);

        reaction(
            () => this.injected.uiStore.mountApp,
            (value, reaction) => {
                reaction.dispose();
                if (value) {
                    setTimeout(() => {
                        const elem = document.getElementsByClassName("main_footer__progress__scale")[0];
                        if (elem) {
                            elem.classList.add("end");
                            elem.addEventListener('transitionend', this.onTransitionEnd);
                        }
                    }, 1000)
                }
            }
        );
    }

    onTransitionEnd = () => {
        const elem = document.getElementsByClassName("main_footer__progress__scale")[0];
        if (elem) {
            elem.classList.remove("end");
            setTimeout(() => {
                elem.classList.add("end");
            })
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        const elem = document.getElementsByClassName("main_footer__progress__scale")[0];
        if (elem) {
            elem.removeEventListener('transitionend', this.onTransitionEnd);
        }
    }

    update = () => {
        const lengthX = this.previousContainerTransform.x + (0 + this.injected.uiStore.mouse.scx);
        const lengthY = this.previousContainerTransform.y + (0 + this.injected.uiStore.mouse.scy);

        this.previousContainerTransform.x = this.previousContainerTransform.x - (0.03 * lengthX);
        this.previousContainerTransform.y = this.previousContainerTransform.y - (0.03 * lengthY);
        this.refContainer.current.style.transform = `
      translate3d(${-this.previousContainerTransform.x * 5}px, ${-this.previousContainerTransform.y * 5}px, 0)
      `

        this.animHandle = requestAnimationFrame(this.update);
    }

    @action
    onContact = () => {
        this.injected.uiStore.contactVisible = true;
    };

    public render() {
        return (
            <div className="main_footer" ref={this.refContainer}>
                <div>
                    <a onClick={this.onContact} className="main_footer__start stagger"><Hover active={true}>Start a Project</Hover></a>
                    <div className="main_footer__progress stagger">
                        <div className="main_footer__progress__inner">
                            <div className="main_footer__progress__scale"></div>
                        </div>
                    </div>
                    <div className="main_footer__ar stagger">
                        <Link to="/armarker">
                            <img src="/images/icn_ar.svg"/>
                        </Link>

                    </div>
                </div>
            </div>
        );
    }
}
import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Link } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { action, reaction } from "mobx";
import * as THREE from "three";
import { Hover } from "../hover/hover";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class MainFooter extends React.Component<IProps> {
    animHandle: number;
    refContainer: React.RefObject<HTMLDivElement>;

    previousContainerTransform: THREE.Vector2;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.refContainer = React.createRef();
        this.previousContainerTransform = new THREE.Vector2(0, 0);

        reaction(
            () => this.injected.uiStore.mountApp,
            (value, reaction) => {
                reaction.dispose();
                if (value) {
                    setTimeout(() => {
                        const elem = document.getElementsByClassName("main_footer__progress__scale")[0];
                        if (elem) {
                            elem.classList.add("end");
                            elem.addEventListener('transitionend', this.onTransitionEnd);
                        }
                    }, 1000)
                }
            }
        );
    }

    onTransitionEnd = () => {
        const elem = document.getElementsByClassName("main_footer__progress__scale")[0];
        if (elem) {
            elem.classList.remove("end");
            setTimeout(() => {
                elem.classList.add("end");
            })
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        const elem = document.getElementsByClassName("main_footer__progress__scale")[0];
        if (elem) {
            elem.removeEventListener('transitionend', this.onTransitionEnd);
        }
    }

    update = () => {
        const lengthX = this.previousContainerTransform.x + (0 + this.injected.uiStore.mouse.scx);
        const lengthY = this.previousContainerTransform.y + (0 + this.injected.uiStore.mouse.scy);

        this.previousContainerTransform.x = this.previousContainerTransform.x - (0.03 * lengthX);
        this.previousContainerTransform.y = this.previousContainerTransform.y - (0.03 * lengthY);
        this.refContainer.current.style.transform = `
      translate3d(${-this.previousContainerTransform.x * 5}px, ${-this.previousContainerTransform.y * 5}px, 0)
      `

        this.animHandle = requestAnimationFrame(this.update);
    }

    @action
    onContact = () => {
        this.injected.uiStore.contactVisible = true;
    };

    public render() {
        return (
            <div className="main_footer" ref={this.refContainer}>
                <div>
                    <a onClick={this.onContact} className="main_footer__start stagger"><Hover active={true}>Start a Project</Hover></a>
                    <div className="main_footer__progress stagger">
                        <div className="main_footer__progress__inner">
                            <div className="main_footer__progress__scale"></div>
                        </div>
                    </div>
                    <div className="main_footer__ar stagger">
                        <Link to="/armarker">
                            <img src="/images/icn_ar.svg"/>
                        </Link>

                    </div>
                </div>
            </div>
        );
    }
}
