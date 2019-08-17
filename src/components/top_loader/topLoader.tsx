import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Link } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";

interface IMatchParams {}

interface IProps {

}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class TopLoader extends React.Component<IProps> {
    rAFcb: number;

    ref: React.RefObject<HTMLDivElement>;
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.rAFcb = requestAnimationFrame(this.rAF);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAFcb);
    }

    rAF = () => {
        this.ref.current.style["transform"] = `translateX(${-100*(1 - this.injected.uiStore.scrollTop)}%)`;
        this.rAFcb = requestAnimationFrame(this.rAF);
    }


    public render() {
        return (
            <div className="top_loader">
                <div className="top_loader__progress">
                    <div className="top_loader__progress__inner">
                        <div ref={this.ref} className="top_loader__progress__scale"></div>
                    </div>
                </div>
            </div>
        );
    }
}
