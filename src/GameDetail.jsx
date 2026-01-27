import {Link, useLocation, useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";

function GameDetail() {
    const {id} = useParams();
    const location = useLocation();

    const [item, setItem] = useState(null);

    const loadGame = useCallback(async () => {
        try {
            const result = await fetch(`http://145.24.237.41:8001/backlog/${id}`, {
                headers: {Accept: "application/json"},
                cache: "no-store",
            });

            if (!result.ok) {
                const text = await result.text();
                throw new Error(text || "Kon game niet ophalen");
            }

            const data = await result.json();
            setItem(data);
        } catch (e) {
            console.log(e);
        }
    }, [id]);

    useEffect(() => {
        loadGame();
    }, [loadGame, location.key]);

    if (!item) return <p>Laden...</p>;

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>

            <p className="mt-2 text-gray-700">{item.status}</p>

            <p className="mt-2 text-gray-700">
                Gespeeld: <span className="font-semibold">{item.hoursPlayed ?? 0}</span>
            </p>

            <div className="mt-6 flex gap-3">
                <Link
                    to={`/games/delete/${id}`}
                    className="inline-flex items-center rounded-md border border-red-300
                     px-4 py-2 text-sm font-semibold text-red-600
                     hover:bg-red-50 transition"
                >
                    Delete
                </Link>

                <Link
                    to={`/games/edit/${id}`}
                    className="inline-flex items-center rounded-md bg-sky-500
                     px-4 py-2 text-sm font-semibold text-white
                     hover:bg-sky-600 transition"
                >
                    Edit
                </Link>
            </div>
        </>
    );
}

export default GameDetail;
