import {Link} from "react-router";
import {useState} from "react";
import {useGames} from "./GamesContext.jsx";
import RatingModal from "./RatingModal.jsx";

function Game({game}) {
    const {patchGame} = useGames();
    const [open, setOpen] = useState(false);

    const statusColors = {
        backlog: "bg-gray-100 text-gray-700",
        playing: "bg-blue-100 text-blue-700",
        finished: "bg-green-100 text-green-700",
        dropped: "bg-red-100 text-red-700",
    };
    const statusClass = statusColors[game.status] || "bg-gray-100 text-gray-700";

    const onMarkFinished = () => {
        // als hij al finished is: niets
        if (game.status === "finished") return;
        setOpen(true);
    };

    const handleSubmitRating = async (ratingValue) => {
        setOpen(false);

        // patch altijd naar finished, rating alleen als je iets invult
        const patch = {status: "finished"};
        if (ratingValue !== null) patch.rating = ratingValue;

        try {
            await patchGame(game.id, patch);
        } catch (e) {
            console.error(e);
            alert("Updaten mislukt");
        }
    };

    return (
        <div className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <Link to={`/games/${game.id}`} className="block">
                <h2 className="text-lg font-semibold text-gray-900">{game.title}</h2>

                <span className={`mt-2 inline-block rounded px-2 py-1 text-sm font-medium ${statusClass}`}>
          {game.status}
        </span>

                <p className="mt-2 text-sm text-gray-600">
                    Gespeeld: <strong>{game.hoursPlayed ?? 0}</strong>
                </p>

                {game.status === "finished" && game.rating != null && (
                    <p className="mt-1 text-sm text-gray-600">
                        Rating: <strong>{game.rating}</strong>
                    </p>
                )}
            </Link>

            <div className="mt-3">
                <button
                    onClick={onMarkFinished}
                    disabled={game.status === "finished"}
                    className="rounded border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    {game.status === "finished" ? "✓ Finished" : "Mark as finished"}
                </button>
            </div>

            <RatingModal
                open={open}
                title={`"${game.title}" finished`}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmitRating}
            />
        </div>
    );
}

export default Game;
