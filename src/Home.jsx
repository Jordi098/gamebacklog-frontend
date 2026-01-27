import {useEffect, useState} from "react";
import Game from "./Game.jsx";

function Home() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await fetch("http://145.24.237.41:8001/backlog/", {
                    headers: {Accept: "application/json"},
                });
                const json = await response.json();
                setGames(json.items ?? []);
            } catch (error) {
                console.error(error);
            }
        }

        fetchGames();
    }, []);

    return (
        <div>
            {games.map((game) => (
                <Game key={game.id || game._id} game={game}/>
            ))}
        </div>
    );
}

export default Home;
