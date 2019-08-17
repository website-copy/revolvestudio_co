import { action } from "mobx";
import { inject } from "mobx-react";
import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { RouteComponentProps } from "react-router-dom";
import { observerWithRouter } from "../../../functions/observerWithRouter";
import { UIStore } from "../../../stores/uiStore";
import { any } from "prop-types";

interface IProps {
}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Colors extends React.Component<IProps> {
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="colors">
                {this.props.children}
            </div>
        );
    }
}

interface IColorsPaletteProps {
    color: string;
    rgb: string;
    cmyk: string;
    hex: string;
    title: string;
}

export class ColorsPalette extends React.Component<IColorsPaletteProps> {
    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="colors__block appear_on_scroll">
                <div className="colors__swatches">
                    <div className="colors__swatch" style={{backgroundColor: this.props.color}}></div>
                    <div className="colors__swatch" style={{backgroundColor: this.props.color}}></div>
                    <div className="colors__swatch" style={{backgroundColor: this.props.color}}></div>
                    <div className="colors__swatch" style={{backgroundColor: this.props.color}}></div>
                    <div className="colors__swatch" style={{backgroundColor: this.props.color}}></div>
                </div>
                <div className="colors__info">
                    <div className="colors__info__title"><span>{this.props.title}</span></div>
                    <div className="colors__info__colors">
                        <div>
                            <div className="colors__system">
                                RGB:
                            </div>
                            {this.props.rgb}
                        </div>
                        <div>
                            <div className="colors__system">
                                CMYK:
                            </div>
                            {this.props.cmyk}
                        </div>
                        <div>
                            <div className="colors__system">
                                HEX:
                            </div>
                            {this.props.hex}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
