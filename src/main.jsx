import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {GamesProvider} from "./GamesContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <GamesProvider>
        <App/>
    </GamesProvider>
);
