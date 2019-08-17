import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Link } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { Hover } from "../hover/hover";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Footer extends React.Component<IProps> {
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <footer>
                <div className="logo">Revølve.</div>
                <div className="wrapper">
                    <div className="info_wrapper">
                        <div className="info">
                            <div>Locations<br />San Francisco — Portland</div>
                        </div>
                        <div className="info">
                            <div>Get in touch<br /><a href="mailto:info@revolvestudio.co">info@revolvestudio.co</a></div>
                        </div>
                    </div>

                    <div className="links">
                        <a href="https://dribbble.com/revolve" target="_blank" className="links__link"><Hover className="dark">Dribbble</Hover></a>
                        <a href="https://www.instagram.com/revolvestudioco/" target="_blank" className="links__link"><Hover className="dark">Instagram</Hover></a>
                        <a href="https://www.linkedin.com/company/revolvestudioco/" target="_blank" className="links__link"><Hover className="dark">LinkedIn</Hover></a>
                    </div>
                </div>
            </footer>
        );
    }
}
