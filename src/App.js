import './App.css';
import Wallet from './components/wallet';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListTransactions from './components/listTransactions';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Wallet />} />
          <Route path="/transactions" element={<ListTransactions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
