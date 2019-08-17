import { set } from "mobx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import AppWrapper from "./appWrapper";
import { AppStore } from "./stores/appStore";
import "./styles/index.scss";

const rootElId = "app";
const store = new AppStore();

function renderApp() {
    if (store && window[store.name]) {
        Object.keys(window[store.name]).forEach(key => {
            if (window[store.name][key]) {
                set(store[key], window[store.name][key]);
            }
        });
    }

    render(
        <AppWrapper store={store}/>,
        rootElId
    );

    // hydrate(
    //   <AppContainer>
    //     <Provider {...store}>
    //       <App />
    //     </Provider>
    //   </AppContainer>,
    //   rootElId
    // );
}

function hydrate(element: React.ReactElement<any>, domID: string) {
    const domElement = document.getElementById(domID);
    if (domElement) {
        ReactDOM.hydrate(element, domElement);
    }
}

function render(element: React.ReactElement<any>, domID: string) {
    const domElement = document.getElementById(domID);
    if (domElement) {
        ReactDOM.render(element, domElement);
    }
}

setTimeout(renderApp, 300);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
    module.hot.accept("./appWrapper", () => {
        const NewApp = require("./appWrapper").default;

        ReactDOM.render(
            <NewApp store={store} />,
            document.getElementById(rootElId)
        );
    });
}
