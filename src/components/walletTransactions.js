import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { downloadFile } from '../utils/download.utils';
import { config } from '../config';
import { constants } from '../constants';
import '../styles/walletTransactions.css';

const { LIMIT, FILENAME } = constants;
const ENDPOINT_URL = config.walletTransactionsUrl();

function WalletTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [sort, setSort] = useState('date');
    const [skip, setSkip] = useState(0);
    const isMounted = useRef({});

    useEffect(() => {
        if (!isMounted.current) return;

        async function fetchData() {
            try {
                let walletId = localStorage.getItem('walletId');
                if(walletId) {
                    const query = {
                        walletId,
                        skip
                    }

                    if(sort === 'date') query.date = 1;
                    else query.amount = 1;

                    const walletTransactions = await axios.get(ENDPOINT_URL, { params: query });
                    setTransactions(walletTransactions.data);
                }
            } catch (error) {
                window.alert('Error fetching wallet data !');
                console.error('Error fetching wallet data:', error);
            }
        }

        fetchData();

    }, [sort, skip]);

    // This is implemented to avoid hook execution multiple times on mount
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    
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

            if(walletId) {
                let response = await axios.get(ENDPOINT_URL, { params: { walletId, skip } });
                
                // until response is empty fetch all transactions,
                // since at the backend we are limiting the no. of
                // transactions per response to 10
                while(response.data.length) {
                    allTransactions = allTransactions.concat(response.data);
                    skip += LIMIT;
                    response = await axios.get(ENDPOINT_URL, { params: { walletId, skip } });
                }
            }

            return allTransactions;
        } catch (error) {
            window.alert('Error fetching all transactions !');
            console.error('Error fetching all transactions:', error);
        }
    }

    async function downloadCSV() {
        const allTransactions = await fetchAllTransactions();
        
        const csvRows = [
            ['Sr No.', 'ID', 'Amount', 'Balance', 'Date'],
            ...allTransactions.map((transaction, index) => [
                index + 1,
                transaction._id,
                transaction.amount,
                transaction.balance,
                transaction.date,
            ])
        ];

        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        downloadFile(csvContent, FILENAME);
    }

    return (
        <div className='transactions-wrapper'>
            <h1>Transactions</h1>
            {/* { below skip = 0 check added to check if
                first set of transactions data is null in that
                case `walletId` is null  } */}
            {transactions.length === 0 && skip === 0
                ?   <div>
                        <p>No transactions found !</p>
                        <Link to="/">Setup Wallet</Link>
                    </div>
                :   <div>
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
            }
        </div>
    )
}

export default WalletTransactions;