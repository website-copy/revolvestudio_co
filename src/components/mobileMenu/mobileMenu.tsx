import * as React from "react";
import { inject, observer } from "mobx-react";
import { UIStore } from "../../stores/uiStore";
import * as classNames from "classnames";
import { NavLink } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";

interface IProps {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class MobileMenu extends React.Component<IProps> {
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);
    }

    showMobileMenu = () => {
        this.injected.uiStore.mobileMenuVisible = true;
    };

    closeMobileMenu = () => {
        this.injected.uiStore.mobileMenuVisible = false;
    };

    public render() {
        return (
            <div className="full_screen">
                <div className="full_screen__wrapper mobile_menu">
                    <div className="close" onClick={this.closeMobileMenu} />
                    <div className="mobile_menu__links">
                        <NavLink
                            exact
                            className={classNames({
                                link: true,
                                menu__link: true
                            })}
                            onClick={this.closeMobileMenu}
                            activeClassName="menu__link--active"
                            to="/"
                        >
                            Home
                        </NavLink>
                        <NavLink
                            exact
                            className={classNames({
                                link: true,
                                menu__link: true
                            })}
                            onClick={this.closeMobileMenu}
                            activeClassName="menu__link--active"
                            to="/about"
                        >
                            About
                        </NavLink>
                        <a
                            href="https://medium.com/thinking-design/ux-first-aesthetics-second-andrew-baygulov-shares-his-advice-for-creating-beautiful-effective-2edcc72b6aec"
                            target="_blank"
                            className={classNames({
                                link: true,
                                menu__link: true
                            })}
                            onClick={this.closeMobileMenu}
                        >
                            Press
                        </a>
                        <a
                            href="https://dribbble.com/revolve"
                            target="_blank"
                            className={classNames({
                                link: true,
                                menu__link: true
                            })}
                            onClick={this.closeMobileMenu}
                        >
                            Social
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
