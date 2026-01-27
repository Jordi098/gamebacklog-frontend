import Game from "./Game.jsx";
import {useGames} from "./GamesContext.jsx";

function Home() {
    const {
        items, loadingList, pagination,
        page, setPage,
        status, setStatus,
        query, setQuery,
    } = useGames();

    const hasPrev = pagination?._links?.previous;
    const hasNext = pagination?._links?.next;

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="rounded border px-3 py-2"
                >
                    <option value="">All</option>
                    <option value="backlog">backlog</option>
                    <option value="playing">playing</option>
                    <option value="finished">finished</option>
                    <option value="dropped">dropped</option>
                </select>

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Zoek op title…"
                    className="rounded border px-3 py-2"
                />
            </div>

            {loadingList && <p className="p-2">Loading…</p>}

            {items.map((g) => (
                <Game key={g.id} game={g}/>
            ))}

            <div className="mt-6 flex items-center gap-3">
                <button
                    disabled={!hasPrev}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="rounded border px-3 py-2 disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm">
          Page {pagination?.currentPage ?? page} / {pagination?.totalPages ?? "?"}
        </span>

                <button
                    disabled={!hasNext}
                    onClick={() => setPage(p => p + 1)}
                    className="rounded border px-3 py-2 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
