import { WalletButton } from "./WalletButton";
import { Link } from "react-router-dom";
import { Spade } from "lucide-react";
import "./Header.css";

export function Header() {
    return (
        <header className="header">
            <Link to="/" className="logo">
                <Spade className="logo-icon" size={28} />
                <span className="logo-text">5-Seat Hold'em</span>
            </Link>

            <nav className="nav">
                <Link to="/" className="nav-link">Tables</Link>
            </nav>

            <WalletButton />
        </header>
    );
}
