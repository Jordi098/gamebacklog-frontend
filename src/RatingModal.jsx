import {useState} from "react";

function RatingModal({open, title, onClose, onSubmit}) {
    const [rating, setRating] = useState("");

    if (!open) return null;

    const submit = () => {
        const value =
            rating === "" ? null : Math.max(1, Math.min(10, Number(rating)));
        onSubmit(value);
        setRating("");
    };

    const skip = () => {
        onSubmit(null);
        setRating("");
    };

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-lg bg-white p-6 shadow"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Wil je een rating achterlaten? (1 t/m 10)
                </p>

                <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="mt-4 w-full rounded border px-3 py-2"
                    placeholder="Laat leeg om over te slaan"
                />

                <div className="mt-5 flex gap-2 justify-end">
                    <button
                        onClick={onClose}
                        className="rounded border px-4 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={skip}
                        className="rounded border px-4 py-2"
                    >
                        Skip
                    </button>

                    <button
                        onClick={submit}
                        className="rounded bg-sky-500 px-4 py-2 font-semibold text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RatingModal;
