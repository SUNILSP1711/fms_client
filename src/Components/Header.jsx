import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-xl font-bold">Infron</div>
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="hover:text-gray-200 transition duration-200">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-200 transition duration-200">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-gray-200 transition duration-200">
                            Contact
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
