import {useState} from "react";
import {useNavigate} from "react-router";

function GameCreate({onCreated}) {
    const [formData, setFormData] = useState({
        title: "",
        status: "backlog",
        hoursPlayed: 0,
        rating: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.title || !formData.status) {
            setError("Vul title en status in.");
            return;
        }
        const payload = {
            title: formData.title.trim(),
            status: formData.status,
            hoursPlayed: Number(formData.hoursPlayed) || 0,
            rating:
                formData.rating === "" ? null : Math.max(1, Math.min(10, Number(formData.rating))),
        };

        setSubmitting(true);

        try {
            // ⚠️ Zet dit naar jouw eigen backend URL
            const response = await fetch("http://145.24.237.41:8001/backlog/", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`POST mislukt (${response.status}): ${text}`);
            }

            const created = await response.json();

            onCreated?.(created);


            const id = created.id || created._id;
            navigate(`/games/${id}`);

        } catch (err) {
            console.error(err);
            setError("Toevoegen mislukt. Check console.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-xl rounded-lg border bg-white p-6 shadow-sm"
        >
            <h2 className="mb-4 text-xl font-bold">Nieuwe game</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                >
                    <option value="backlog">backlog</option>
                    <option value="playing">playing</option>
                    <option value="finished">finished</option>
                    <option value="dropped">dropped</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium">Hours played</label>
                <input
                    type="number"
                    name="hoursPlayed"
                    value={formData.hoursPlayed}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                    min={0}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium">Rating (1-10, optioneel)</label>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                    min={1}
                    max={10}
                    placeholder="laat leeg voor null"
                />
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="rounded bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
            >
                {submitting ? "Bezig..." : "Toevoegen"}
            </button>
        </form>
    );
}

export default GameCreate;
