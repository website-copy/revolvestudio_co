import { observable, runInAction, computed } from "mobx";
import { pageOffset } from "../functions/pageOffset";
import { Location } from "history";
import { getDeviceInfos, DeviceInfo } from "../functions/sniffer";

export class UIStore {
    @observable mountApp = false;
    @observable staggerDone = false;
    @observable mobileMenuVisible: boolean = false;

    @observable portfolioVisible = false;
    @observable contactVisible = false;
    @observable artstelVisible = false;
    @observable bloomVisible = false;
    @observable bravaVisible = false;

    scrollPosition: number = 0;
    scrollTop: number = 0;
    menuHover: boolean;
    windowWidth: number;
    windowHeight: number;
    windowWidthHalf: number;
    windowHeightHalf: number;
    mouse: Mouse;

    preloadSequenceTriggered = false;
    @observable sceneLoaded = false;
    isUp: boolean;

    deviceInfos: DeviceInfo;

    constructor() {
        this.mouse = new Mouse();

        this.deviceInfos = getDeviceInfos();
    }

    pushHomeIfNeeded = (location: Location<any>) => {
        if (location.pathname === "/" || location.pathname === "/ar" || location.pathname === "/armarker") {
            const home = document.getElementsByClassName("home__content")[0];
            const footer = document.getElementsByClassName("main_footer")[0];
            const mainFooterProgress = document.getElementsByClassName("main_footer__progress")[0];
            if (home) {
                home.setAttribute("style", "transform: translateY(0)");
            }
            if (footer) {
                footer.setAttribute("opacity", "0");
            }

            if (location.pathname === "/armarker") {
                home.setAttribute("style", "opacity: 0");
                mainFooterProgress.setAttribute("style", "opacity: 0");
            } else {
                mainFooterProgress.setAttribute("style", "opacity: 1");
            }
        } else if (location.pathname !== "/contact") {
            const offset = pageOffset(window.innerHeight);
            const home = document.getElementsByClassName("home__content")[0];
            const footer = document.getElementsByClassName("main_footer")[0];
            const mainFooterProgress = document.getElementsByClassName("main_footer__progress")[0];

            if (home) {
                home.setAttribute("style", `transform: translateY(-${offset}px); opacity: 1`);
                mainFooterProgress.setAttribute("style", "opacity: 1");
            }
            if (footer) {
                footer.setAttribute("opacity", "1");
            }
        } else {
            const home = document.getElementsByClassName("home__content")[0];
            const mainFooterProgress = document.getElementsByClassName("main_footer__progress")[0];
            home.setAttribute("style", "opacity: 1");
            mainFooterProgress.setAttribute("style", "opacity: 1");
        }
    };

    zoomOutElement = (element: HTMLElement) => {
        element.classList.add("zoom_out", "enter");
    }

    zoomOut = () => {
        const docs = document.querySelectorAll(".zoom_out");
        docs.forEach(element => {
            element.classList.add("enter");
        });
    }

    zoomIn = () => {
        if (!this.portfolioVisible) {
            const docs = document.querySelectorAll(".zoom_out");
            docs.forEach(element => {
                element.classList.remove("enter");
            });
        }
    }
}

export class Mouse {
    sx: number;
    sy: number;
    shx: number;
    shy: number;
    scx: number;
    scy: number;

    constructor() {
        this.sx = 0;
        this.sy = 0;
        this.shx = 0;
        this.shy = 0;
        this.scx = 0;
        this.scy = 0;
    }
}
