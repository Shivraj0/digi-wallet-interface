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

          {/*
            [Approach]:

            We can also implement conditional routing here, wherein if walletId
            is absent in local storage we can navigate the user to homepage.
            I find this less user friendly than current implementation which
            educates the user and ask them to setup their wallet first.

            <Route 
              path="/transactions" 
              element={walletId ? <WalletTransactions /> : <Navigate to="/" 
            />} 
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
