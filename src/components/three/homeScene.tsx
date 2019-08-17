import { Location } from "history";
import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { IndexScene2 } from "../../scenes/indexScene2";
import { UIStore } from "../../stores/uiStore";
import { Three } from "./three";

interface IProps extends RouteComponentProps {
}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
export class HomeScene extends React.Component<IProps> {
    scene: IndexScene2;
    //scene: PlaceholderScene;
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: IProps) {
        super(props);

        this.injected.uiStore.isUp = location.pathname !== "/" && location.pathname !== "/contact" &&  location.pathname !== "/armarker";
        var hideSphere = location.pathname === "/armarker";
        this.scene = new IndexScene2(this.injected.uiStore, this.injected.uiStore.isUp, hideSphere);
        //this.scene = new PlaceholderScene(this.injected.uiStore, location.pathname !== "/" && location.pathname !== "/contact" );
    }

    componentDidMount() {
        this.props.history.listen((location, action) => {
            this.pushHomeIfNeeded(location)
        })
    }

    pushHomeIfNeeded = (location: Location<any>) => {
        if (location.pathname === "/") {
            this.scene.slideDown();
            this.injected.uiStore.isUp = false;
        } else if (location.pathname !== "/contact" && location.pathname !== "/armarker") {
            this.scene.slideUp();
            this.injected.uiStore.isUp = true;
        }

        if (location.pathname === "/armarker") {
            this.scene.hideSphere();
        } else {
            this.scene.showSphere();
        }
    }

    render () {
        return (
            <React.Fragment>
                <Three className="home_scene" scene={this.scene} />
                <div className="home_effects">
                    <div className="home_overlay"></div>
                    <div className="home_overlay_2"></div>
                </div>

            </React.Fragment>
        );
    }
}
