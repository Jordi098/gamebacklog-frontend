import {Link} from "react-router";

function Game({game}) {
    return (
        <Link
            to={`/games/${game.id}`}
            className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm
                       hover:shadow-md hover:border-sky-400 transition"
        >
            <h2 className="text-lg font-semibold text-gray-900">
                {game.title}
            </h2>

            <p className="mt-1 text-sm text-gray-600">
                Gespeeld: <strong>{game.hoursPlayed}</strong>
            </p>

            {game.status && (
                <span className="mt-2 inline-block text-sm font-medium text-yellow-500">
                    ★ Favoriet
                </span>
            )}
        </Link>
    );
}

export default Game;
