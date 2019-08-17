import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Provider } from "mobx-react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

import App from "./app";

interface IProps {
    store: any;
}

export default class AppWrapper extends React.Component<IProps> {
    render() {
        return (
            <AppContainer>
                <BrowserRouter>
                    <Provider {...this.props.store}>
                        <Switch>
                            <Route path="/" component={App} />
                        </Switch>
                    </Provider>
                </BrowserRouter>
            </AppContainer>
        );
    }
}
