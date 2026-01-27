import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";

function GameEdit() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("backlog");
    const [hoursPlayed, setHoursPlayed] = useState(0);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchGame() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch(`http://145.24.237.41:8001/backlog/${id}`, {
                    headers: {Accept: "application/json"},
                    cache: "no-store",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Ophalen mislukt");
                }

                const game = await res.json();
                setTitle(game.title ?? "");
                setStatus(game.status ?? "backlog");
                setHoursPlayed(game.hoursPlayed ?? 0);
            } catch (e) {
                console.error(e);
                setError(e.message || "Er ging iets mis");
            } finally {
                setLoading(false);
            }
        }

        fetchGame();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            const res = await fetch(`http://145.24.237.41:8001/backlog/${id}`, {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    status,
                    hoursPlayed: Number(hoursPlayed) || 0,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Opslaan mislukt");
            }

            navigate(`/games/${id}`);
        } catch (e) {
            console.error(e);
            setError(e.message || "Opslaan mislukt");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-6 text-gray-600">Loading…</p>;

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl rounded border bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Edit game</h2>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded border px-3 py-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 w-full rounded border px-3 py-2"
                >
                    <option value="backlog">backlog</option>
                    <option value="playing">playing</option>
                    <option value="finished">finished</option>
                    <option value="dropped">dropped</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium">Hours played</label>
                <input
                    type="number"
                    min="0"
                    value={hoursPlayed}
                    onChange={(e) => setHoursPlayed(e.target.value)}
                    className="mt-1 w-full rounded border px-3 py-2"
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => navigate(`/games/${id}`)}
                    className="rounded border px-4 py-2 font-semibold"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded bg-sky-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                    {submitting ? "Saving…" : "Save"}
                </button>
            </div>
        </form>
    );
}

export default GameEdit;
