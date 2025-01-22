import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/updateWallet.css';
import { config } from '../config';

function UpdateWallet({walletData}) {
    const [amount, setAmount] = useState(0);
    const [credit, setCredit] = useState(true);
    const [balance, updateBalance] = useState(walletData.balance);
    const ENDPOINT_URL = config.updateWalletUrl(walletData._id);

    async function depositAmount() {
        try {
            if(!amount) {
                window.alert('Please enter amount to deposit !');
                return;
            }
            const depositPayload = {
                amount: credit ? amount : -amount,
            };

            const transactWallet = await axios.post(ENDPOINT_URL, depositPayload);
            updateBalance(transactWallet.data.balance);
            
            // Reset amount input state back to default value once transaction is complete
            setAmount(0);
        } catch (error) {
            window.alert(error?.response?.data?.message);
            console.error('Error depositing amount:', error);
        }
    }

    return (
        <div>
            <div className='wallet-data'>
                <h1>{walletData.name}'s wallet</h1>
                <div className='wallet-data__item'>
                    <span>Balance: </span>
                    <span>&#8377;{balance}</span>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); depositAmount(); }}>
                    <label htmlFor='depositAmount'>Enter Deposit Amount: </label>
                    <input
                        id="depositAmount"
                        type='number'
                        placeholder='Enter Deposit Amount'
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        min={0}
                    />
                    <div>
                        <input type="checkbox" id="type" value={credit} onChange={() => { setCredit(!credit)} } />
                        <label htmlFor="type">DEBIT (Default: CREDIT)</label>
                    </div>
                    <button>Deposit</button>
                </form>
                <div className='wallet-data__item'>
                    <Link to="/transactions">View Transactions</Link>
                </div>
            </div>
        </div>
    )
}
export default UpdateWallet;