import {useParams, useNavigate} from "react-router";
import {useEffect} from "react";

function GameDelete() {
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function deleteGame() {
            try {
                const res = await fetch(`http://145.24.237.41:8001/backlog/${id}`, {
                    method: "DELETE",
                    headers: {Accept: "application/json"},
                });

                if (!res.ok) {
                    throw new Error("Delete mislukt");
                }

                // Na delete terug naar overzicht
                navigate("/games");
            } catch (e) {
                console.error(e);
            }
        }

        deleteGame();
    }, [id, navigate]);

    return <p className="p-6">Game wordt verwijderd…</p>;
}

export default GameDelete;
