import {useParams, useNavigate} from "react-router";
import {useEffect} from "react";
import {useGames} from "./GamesContext";

export default function GameDelete() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {deleteGame} = useGames();

    useEffect(() => {
        (async () => {
            try {
                await deleteGame(id);
                navigate("/", {replace: true});
            } catch (e) {
                console.error(e);
            }
        })();
    }, [id, deleteGame, navigate]);

    return <p className="p-6">Game wordt verwijderd…</p>;
}
