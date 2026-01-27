import {Link} from "react-router";

function NotFound() {
    return (
        <div className="p-6 text-center">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="mt-2 text-gray-700">Pagina niet gevonden.</p>

            <Link
                to="/"
                className="mt-4 inline-block text-sky-600 font-semibold hover:underline"
            >
                ← Terug naar Home
            </Link>
        </div>
    );
}

export default NotFound;
