import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../components/wallet-provider";
import { Plus, Users, Coins, ArrowRight } from "lucide-react";
import "./Home.css";

export function Home() {
    const { connected } = useWallet();
    const navigate = useNavigate();
    const [tableAddress, setTableAddress] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleJoinTable = (e: React.FormEvent) => {
        e.preventDefault();
        if (tableAddress.trim()) {
            navigate(`/table/${tableAddress.trim()}`);
        }
    };

    return (
        <div className="home">
            <section className="hero">
                <h1 className="hero-title">
                    On-Chain <span className="text-accent">Texas Hold'em</span>
                </h1>
                <p className="hero-subtitle">
                    Fully decentralized 5-seat poker on Cedra blockchain.
                    Provably fair, trustless, and transparent.
                </p>
            </section>

            <section className="actions-section">
                <div className="action-card join-card">
                    <div className="action-header">
                        <Users size={24} />
                        <h2>Join a Table</h2>
                    </div>
                    <p className="action-desc">Enter a table address to join an existing game</p>
                    <form onSubmit={handleJoinTable} className="join-form">
                        <input
                            type="text"
                            placeholder="0x..."
                            value={tableAddress}
                            onChange={(e) => setTableAddress(e.target.value)}
                            className="table-input"
                        />
                        <button type="submit" className="btn btn-primary" disabled={!tableAddress.trim()}>
                            <ArrowRight size={18} />
                            Join
                        </button>
                    </form>
                </div>

                <div className="action-card create-card">
                    <div className="action-header">
                        <Plus size={24} />
                        <h2>Create Table</h2>
                    </div>
                    <p className="action-desc">Start a new poker table with custom blinds and limits</p>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowCreateModal(true)}
                        disabled={!connected}
                    >
                        <Coins size={18} />
                        {connected ? "Create New Table" : "Connect Wallet First"}
                    </button>
                </div>
            </section>

            <section className="info-section">
                <h2>How It Works</h2>
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-number">1</div>
                        <h3>Buy Chips</h3>
                        <p>Exchange CEDRA tokens for poker chips at 1:1000 rate</p>
                    </div>
                    <div className="info-card">
                        <div className="info-number">2</div>
                        <h3>Join Table</h3>
                        <p>Pick a seat and buy in with your chips</p>
                    </div>
                    <div className="info-card">
                        <div className="info-number">3</div>
                        <h3>Play Poker</h3>
                        <p>Standard Texas Hold'em rules with commit-reveal randomness</p>
                    </div>
                    <div className="info-card">
                        <div className="info-number">4</div>
                        <h3>Cash Out</h3>
                        <p>Convert chips back to CEDRA anytime</p>
                    </div>
                </div>
            </section>

            {showCreateModal && (
                <CreateTableModal onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    );
}

function CreateTableModal({ onClose }: { onClose: () => void }) {
    const [config, setConfig] = useState({
        smallBlind: 5,
        bigBlind: 10,
        minBuyIn: 100,
        maxBuyIn: 10000,
        ante: 0,
        straddleEnabled: true,
    });

    const handleCreate = async () => {
        // TODO: Implement table creation
        console.log("Creating table with config:", config);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>Create New Table</h2>

                <div className="form-group">
                    <label>Small Blind</label>
                    <input
                        type="number"
                        value={config.smallBlind}
                        onChange={(e) => setConfig({ ...config, smallBlind: Number(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label>Big Blind</label>
                    <input
                        type="number"
                        value={config.bigBlind}
                        onChange={(e) => setConfig({ ...config, bigBlind: Number(e.target.value) })}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Min Buy-In</label>
                        <input
                            type="number"
                            value={config.minBuyIn}
                            onChange={(e) => setConfig({ ...config, minBuyIn: Number(e.target.value) })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Max Buy-In</label>
                        <input
                            type="number"
                            value={config.maxBuyIn}
                            onChange={(e) => setConfig({ ...config, maxBuyIn: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Ante (optional)</label>
                    <input
                        type="number"
                        value={config.ante}
                        onChange={(e) => setConfig({ ...config, ante: Number(e.target.value) })}
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={config.straddleEnabled}
                            onChange={(e) => setConfig({ ...config, straddleEnabled: e.target.checked })}
                        />
                        Allow Straddle
                    </label>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleCreate}>Create Table</button>
                </div>
            </div>
        </div>
    );
}
