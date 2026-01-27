import Home from "./Home.jsx";
import GameCreate from "./GameCreate.jsx";
import GameDetail from "./GameDetail.jsx";
import GameDelete from "./GameDelete.jsx";
import GameEdit from "./GameEdit.jsx";
import {useState} from "react";
import {createBrowserRouter, RouterProvider} from "react-router";
import Layout from "./Layout.jsx";

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },
            {
                path: "/create",
                element: <GameCreate/>,
            },

            {
                path: "/games/:id",
                element: <GameDetail/>,
            },
            {
                path: "/games/delete/:id",
                element: <GameDelete/>,
            },
            {
                path: "/games/edit/:id",
                element: <GameEdit/>,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router}/>;
}

export default App;