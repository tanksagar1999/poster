import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import * as serviceWorker from "./serviceWorker";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// import swDev from "./swDev";
ReactDOM.render(<App />, document.getElementById("root"));
// swDev();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
serviceWorkerRegistration.register();
