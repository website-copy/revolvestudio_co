import * as React from "react";
import { Route, Link } from "react-router-dom";
import * as classNames from "classnames";

interface IProps {
    active?: boolean;
    className?: string;
}

export class Hover extends React.Component<IProps> {
    ref: React.RefObject<HTMLSpanElement>;

    hover = false;

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
    }

    onMouseEnter = () => {
        if (!this.hover) {
            this.hover = true;
            this.ref.current.classList.add("hovered");
        }
    };

    onMouseLeave = () => {
        if (this.hover) {
            this.ref.current.classList.add("leave");
            setTimeout(() => {
                this.hover = false;
                this.ref.current.classList.remove("hovered", "leave");
            }, 500);
        }
    };

    public render() {
        return (
            <span
                ref={this.ref}
                className={classNames({"hover": true, "active": this.props.active}, this.props.className)}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >
        {this.props.children}
      </span>
        );
    }
}

interface IHoverNavProps {
    className?: string;
    activeClassName?: string;
    to?: string;
    exact?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export class HoverNavLink extends React.Component<IHoverNavProps> {
    public render() {
        return (
            <Route
                path={this.props.to}
                exact={this.props.exact}
                children={({ match }) => {
                    const isActive = !!match;
                    return (
                        <Link
                            onMouseEnter={this.props.onMouseEnter}
                            onMouseLeave={this.props.onMouseLeave}
                            to={this.props.to}
                            className={
                                isActive
                                    ? [this.props.className, this.props.activeClassName]
                                        .filter(i => i)
                                        .join(" ")
                                    : this.props.className
                            }
                        >
                            <Hover active={isActive}>{this.props.children}</Hover>
                        </Link>
                    );
                }}
            />
        );
    }
}

// const NavLink = ({
//   to,
//   children,
//   className,
//   activeClassName,
//   ...rest
// }) => {
//   const path = typeof to === "object" ? to.pathname : to;
//   return (
//     <Route
//       path={path}
//       children={({ match }) => {
//         const isActive = !!match;
//         return (
//           <Link
//             {...rest}
//             className={
//               isActive
//                ? [className, activeClassName].filter(i => i).join(" ")
//                : className
//             }
//             to={to}
//           >
//             {typeof children === 'function' ? children(isActive) : children}
//           </Link>
//         );
//       }}
//     />
//   );
// };

//export default NavLink;
