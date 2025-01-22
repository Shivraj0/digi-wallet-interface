import './App.css';
import SetupWallet from './components/setupWallet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WalletTransactions from './components/walletTransactions';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SetupWallet />} />
          <Route path="/transactions" element={<WalletTransactions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
