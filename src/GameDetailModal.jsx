import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";

function GameDetailModal() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setNotFound(false);

            const res = await fetch(`http://145.24.237.41:8001/backlog/${id}`, {
                headers: {Accept: "application/json"},
                cache: "no-store",
            });

            if (res.status === 404) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setItem(data);
            setLoading(false);
        }

        load();
    }, [id]);

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
            onClick={() => navigate(-1)}
        >
            <div
                className="w-full max-w-xl rounded-lg bg-white p-6 shadow"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Game</h2>
                    <button onClick={() => navigate(-1)} className="rounded border px-3 py-1">
                        Close
                    </button>
                </div>

                {loading && <p className="mt-4">Loading…</p>}
                {notFound && <p className="mt-4">404 Game niet gevonden.</p>}

                {item && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-gray-700">{item.status}</p>
                        {item.description && <p className="mt-3 text-gray-700">{item.description}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GameDetailModal;
