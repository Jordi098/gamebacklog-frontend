import {Link, Outlet} from "react-router";

function Layout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-slate-900 shadow">
                <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
                    <Link
                        to="/"
                        className="text-slate-200 font-medium hover:text-white transition-colors"
                    >
                        Home
                    </Link>

                    <Link
                        to="/create"
                        className="text-slate-200 font-medium hover:text-white transition-colors"
                    >
                        Create New Game
                    </Link>
                </nav>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                <Outlet/>
            </main>
        </div>
    );
}

export default Layout;
