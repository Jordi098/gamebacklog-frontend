import {Link, useLocation, useParams} from "react-router";
import {useCallback, useEffect, useState} from "react";

function GameDetail() {
    const {id} = useParams();
    const location = useLocation();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState("");

    const loadGame = useCallback(async () => {
        setLoading(true);
        setNotFound(false);
        setError("");

        try {
            const res = await fetch(`http://145.24.237.41:8001/backlog/${id}`, {
                headers: {Accept: "application/json"},
                cache: "no-store",
            });

            if (res.status === 404) {
                setNotFound(true);
                setItem(null);
                return;
            }

            if (!res.ok) {
                const text = await res.text();
                setError(text || `Server error (${res.status})`);
                setItem(null);
                return;
            }

            const data = await res.json();
            setItem(data);
        } catch (e) {
            setError("Netwerkfout: kan server niet bereiken.");
            setItem(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadGame();
    }, [loadGame, location.key]);

    if (loading) return <p className="p-6 text-gray-600">Laden…</p>;

    if (notFound) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-3xl font-bold">404</h1>
                <p className="mt-2 text-gray-700">Game niet gevonden.</p>
                <Link to="/" className="mt-4 inline-block text-sky-600 font-semibold hover:underline">
                    ← Terug naar Home
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">Er ging iets mis</h1>
                <Link to="/" className="mt-4 inline-block text-sky-600 font-semibold hover:underline">
                    ← Terug naar Home
                </Link>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>

            <p className="mt-2 text-gray-700">{item.status}</p>
            <p className="mt-2 text-gray-700">{item.description}</p>


            <p className="mt-2 text-gray-700">
                Gespeeld: <span className="font-semibold">{item.hoursPlayed ?? 0}</span>
            </p>

            <p className="mt-2 text-gray-700">
                Rating: <span className="font-semibold">{item.rating ?? 0}</span>
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
