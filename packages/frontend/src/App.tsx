import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./components/wallet-provider";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Table } from "./pages/Table";
import "./App.css";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/table/:address" element={<Table />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
