import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {useGames} from "./GamesContext";
import * as router from "react-router";

function GameDetail() {
    const {id} = useParams();
    const {fetchOne} = useGames();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError("");
            setNotFound(false);

            try {
                const result = await fetchOne(id);

                if (result.notFound) {
                    navigate("/404", {replace: true});
                    return;
                }

                if (result.error) {
                    setError(result.message || "Laden mislukt");
                    setItem(null);
                    return;
                }

                setItem(result?.data ?? null);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Laden mislukt");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, fetchOne, router]);

    if (loading) return <p className="p-6 text-gray-600">Laden…</p>;

    if (notFound) {
        return <p className="p-6 text-gray-600">Game niet gevonden.</p>;
    }

    if (error) {
        return <p className="p-6 text-red-600">{error}</p>;
    }

    if (!item) {
        return <p className="p-6 text-gray-600">Geen data.</p>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>

            <p className="mt-2 text-gray-700">{item.status}</p>
            <p className="mt-2 text-gray-700">{item.description}</p>

            <p className="mt-2 text-gray-700">
                Gespeeld:{" "}
                <span className="font-semibold">{item.hoursPlayed ?? 0}</span>
            </p>

            <p className="mt-2 text-gray-700">
                Rating:{" "}
                <span className="font-semibold">
          {item.rating == null ? "" : item.rating}
        </span>
            </p>

            <div className="mt-6 flex gap-3">
                <Link
                    to={`/games/delete/${id}`}
                    className="inline-flex items-center rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                >
                    Delete
                </Link>

                <Link
                    to={`/games/edit/${id}`}
                    className="inline-flex items-center rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 transition"
                >
                    Edit
                </Link>
            </div>
        </>
    );
}

export default GameDetail;
