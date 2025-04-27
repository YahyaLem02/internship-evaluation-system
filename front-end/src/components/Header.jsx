import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-blue-500 text-white p-4">
            <nav className="flex justify-between">
                <h1 className="text-xl font-bold">My App</h1>
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;