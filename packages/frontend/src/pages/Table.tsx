import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWallet } from "../components/wallet-provider";
import { useTableView } from "../hooks/useContract";
import { PokerTable } from "../components/PokerTable";
import { ActionPanel } from "../components/ActionPanel";
import { TableInfo } from "../components/TableInfo";
import type { TableConfig, TableState, SeatInfo, GameState } from "../types";
import "./Table.css";

export function Table() {
    const { address } = useParams<{ address: string }>();
    const { connected, account } = useWallet();
    const { getTableConfig, getTableState, getAllSeats, getFullGameState } = useTableView();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<TableConfig | null>(null);
    const [tableState, setTableState] = useState<TableState | null>(null);
    const [seats, setSeats] = useState<(SeatInfo | null)[]>([]);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [playerSeat, setPlayerSeat] = useState<number | null>(null);

    const loadTableData = async () => {
        if (!address) return;

        try {
            setLoading(true);
            setError(null);

            const [configData, stateData, seatsData, gameData] = await Promise.all([
                getTableConfig(address),
                getTableState(address),
                getAllSeats(address),
                getFullGameState(address),
            ]);

            setConfig(configData);
            setTableState(stateData);
            setSeats(seatsData);
            setGameState(gameData);

            // Find player's seat
            if (account?.address) {
                const accountAddr = account.address.toString().toLowerCase();
                const seatIdx = seatsData.findIndex(
                    (s) => s?.player?.toLowerCase() === accountAddr
                );
                setPlayerSeat(seatIdx >= 0 ? seatIdx : null);
            }
        } catch (err) {
            console.error("Failed to load table:", err);
            setError("Failed to load table data. Please check the address.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTableData();

        // Poll for updates every 3 seconds
        const interval = setInterval(loadTableData, 3000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, account?.address]);

    if (loading && !config) {
        return (
            <div className="table-page loading">
                <div className="spinner" />
                <p>Loading table...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="table-page error">
                <p>{error}</p>
                <button className="btn btn-primary" onClick={loadTableData}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="table-page">
            <div className="table-layout">
                <aside className="table-sidebar">
                    {config && tableState && (
                        <TableInfo config={config} state={tableState} address={address!} />
                    )}
                </aside>

                <main className="table-main">
                    <PokerTable
                        seats={seats}
                        gameState={gameState}
                        dealerSeat={tableState?.dealerSeat ?? 0}
                        playerSeat={playerSeat}
                    />

                    {connected && playerSeat !== null && gameState && (
                        <ActionPanel
                            tableAddress={address!}
                            seatIndex={playerSeat}
                            gameState={gameState}
                            seatInfo={seats[playerSeat]!}
                            onAction={loadTableData}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
