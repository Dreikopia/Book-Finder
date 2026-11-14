import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-screen p-2 bg-slate-100 dark:bg-slate-900">
            <Navbar />

            <main className="p-4">
                <Outlet />
            </main>

            <footer className="mt-auto text-center">
                <p>Book Finder &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

export default AppLayout;