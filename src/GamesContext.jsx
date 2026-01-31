import {createContext, useContext, useEffect, useState, useCallback} from "react";

const GamesContext = createContext(null);

const API = "http://145.24.237.41:8001/backlog";

export function GamesProvider({children}) {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [status, setStatus] = useState("");
    const [query, setQuery] = useState("");

    const [loadingList, setLoadingList] = useState(false);

    const fetchList = useCallback(async () => {
        setLoadingList(true);
        try {
            const url =
                `${API}?page=${page}&limit=${limit}` + (status ? `&status=${status}` : "");

            const res = await fetch(url, {
                headers: {Accept: "application/json"},
                cache: "no-store",
            });

            const json = await res.json();

            setItems(json.items ?? []);
            setPagination(json.pagination ?? null);
        } finally {
            setLoadingList(false);
        }
    }, [page, limit, status]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    // detail ophalen (detail page)
    const fetchOne = useCallback(async (id) => {
        try {
            const res = await fetch(`${API}/${id}`, {
                headers: {Accept: "application/json"},
                cache: "no-store",
            });

            if (res.status === 404) return {notFound: true};

            const json = await res.json().catch(() => null);

            if (json?.message === "Failed to fetch game") {
                return {notFound: true};
            }

            if (!res.ok) {
                return {error: true, message: json?.message || "Laden mislukt"};
            }

            return {data: json};
        } catch (e) {
            return {error: true, message: e?.message || "API niet bereikbaar"};
        }
    }, []);


    const createGame = useCallback(async (payload) => {
        const res = await fetch(API, {
            method: "POST",
            headers: {Accept: "application/json", "Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        await fetchList();
        return await res.json();
    }, [fetchList]);

    const patchGame = useCallback(async (id, patch) => {
        const res = await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: {Accept: "application/json", "Content-Type": "application/json"},
            body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error(await res.text());
        await fetchList();
        return await res.json();
    }, [fetchList]);

    const deleteGame = useCallback(async (id) => {

        const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: {Accept: "application/json"},
        });

        if (!res.ok && res.status !== 204) {
            await fetchList();
            throw new Error(await res.text());
        }

        await fetchList();
    }, [fetchList]);


    // filter 2: client-side search over huidige pagina
    const visibleItems = items.filter(g =>
        !query ||
        (g.title ?? "").toLowerCase().includes(query.toLowerCase())
    );


    const value = {
        items: visibleItems,
        rawItems: items,
        pagination,
        loadingList,

        page, setPage,
        limit, setLimit,
        status, setStatus,
        query, setQuery,

        fetchList,
        fetchOne,
        createGame,
        patchGame,
        deleteGame,
    };

    return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>;
}

export function useGames() {
    const ctx = useContext(GamesContext);
    if (!ctx) throw new Error("useGames must be used inside GamesProvider");
    return ctx;
}
