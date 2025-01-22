import { useEffect, useState } from 'react';
import axios from 'axios';
import { downloadFile } from '../utils/download.utils';
import '../styles/walletTransactions.css';

function WalletTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [sort, setSort] = useState('date');
    const [skip, setSkip] = useState(0);
    const LIMIT = 10;

    useEffect(() => {

        async function fetchData() {
            try {
                let walletId = localStorage.getItem('walletId');
                if(walletId) {
                    const query = sort === 'date' ? `date=1` : `amount=1`;
                    const walletTransactions = await axios.get(`http://localhost:3000/transactions?walletId=${walletId}&skip=${skip}&${query}`);
                    setTransactions(walletTransactions.data);
                    console.log('transactions', transactions);
                }
            } catch (error) {
                window.alert('Error fetching wallet data !');
                console.error('Error fetching wallet data:', error);
            }
        }

        fetchData();
    }, [sort, skip]);
    
    function handlePrevious() {
        if(skip > 0) {
            setSkip(skip - LIMIT);
        }
    }

    function handleNext() {
        if(transactions.length === 10) {
            setSkip(skip + 10);
        }
    }

    async function fetchAllTransactions() {
        try {
            let allTransactions = [];
            let skip = 0;
            const walletId = localStorage.getItem('walletId');
            let response = await axios.get(`http://localhost:3000/transactions?walletId=${walletId}&skip=${skip}&limit=${LIMIT}`);
            
            while(response.data.length) {
                allTransactions = allTransactions.concat(response.data);
                skip += LIMIT;
                response = await axios.get(`http://localhost:3000/transactions?walletId=${walletId}&skip=${skip}&limit=${LIMIT}`);
            }

            return allTransactions;
        } catch (error) {
            window.alert('Error fetching all transactions !');
        }
    }

    async function downloadCSV() {
        const allTransactions = await fetchAllTransactions();
        
        const csvRows = [
            ['Sr No.', 'ID', 'Amount', 'Balance', 'Date'],
            ...allTransactions.map((transaction, index) => [
                skip + index + 1,
                transaction._id,
                transaction.amount,
                transaction.balance,
                transaction.date,
            ])
        ];

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        downloadFile(csvContent, 'transactions.csv');
    }

    return (
        <div>
            <h1>Transactions</h1>
            <div className='transactions-header'>
                <div className='transaction-filters'>
                    Sort by:
                    <input 
                        type="radio" 
                        id="date" 
                        name="sort" 
                        value="date" 
                        checked={sort === 'date'} 
                        onChange={(e) => setSort(e.target.value)} 
                    />
                    <label htmlFor="date">Date</label>
                    <input 
                        type="radio" 
                        id="amount" 
                        name="sort" 
                        value="amount" 
                        checked={sort === 'amount'} 
                        onChange={(e) => setSort(e.target.value)} 
                    />
                    <label htmlFor="amount">Amount</label>
                </div>
                <button onClick={downloadCSV}>Download CSV</button>
            </div>
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>Sr No.</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Balance</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={transaction._id}>
                            <td>{skip + index + 1}</td>
                            <td>{transaction._id}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.balance}</td>
                            <td>{transaction.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevious} disabled={skip === 0}>
                    Prev
                </button>
                <span>Page {skip/10 + 1}</span>
                <button onClick={handleNext} disabled={transactions.length < 10}>
                    Next
                </button>
            </div>
        </div>
    )
}

export default WalletTransactions;