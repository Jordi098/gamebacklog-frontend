import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useGames} from "./GamesContext.jsx";

function GameEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {fetchOne, patchGame} = useGames();

    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("backlog");
    const [description, setDescription] = useState("");
    const [hoursPlayed, setHoursPlayed] = useState(0);
    const [rating, setRating] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            setError("");

            try {
                const result = await fetchOne(id);
                if (cancelled) return;

                if (result?.notFound) {
                    navigate("/", {replace: true});
                    return;
                }

                if (result?.error) {
                    setError(result.message || "Laden mislukt");
                    return;
                }

                const game = result?.data;

                setTitle(game?.title ?? "");
                setStatus(game?.status ?? "backlog");
                setDescription(game?.description ?? "");
                setHoursPlayed(game?.hoursPlayed ?? 0);
                setRating(game?.rating == null ? "" : String(game.rating));
            } catch (e) {
                if (!cancelled) setError(e?.message || "Laden mislukt");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, fetchOne, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await patchGame(id, {
                title: title.trim(),
                status,
                description,
                hoursPlayed: Number(hoursPlayed) || 0,
                rating:
                    rating === ""
                        ? null
                        : Math.max(1, Math.min(10, Number(rating))),
            });

            navigate(`/games/${id}`);
        } catch (e) {
            console.error(e);
            setError(e?.message || "Opslaan mislukt");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="p-6 text-gray-600">Loading…</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-xl rounded border bg-white p-6"
        >
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

            <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded border px-3 py-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium">Hours played</label>
                <input
                    type="number"
                    min="0"
                    value={hoursPlayed}
                    onChange={(e) => setHoursPlayed(e.target.value)}
                    className="mt-1 w-full rounded border px-3 py-2"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium">
                    Rating (1–10, optioneel)
                </label>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="mt-1 w-full rounded border px-3 py-2"
                    placeholder="laat leeg voor null"
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
