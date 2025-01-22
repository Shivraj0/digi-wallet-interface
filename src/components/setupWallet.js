import { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateWallet from './updateWallet';
import '../styles/setupWallet.css';

function SetupWallet() {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState(0);
    const [walletData, setWalletData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                let walletId = localStorage.getItem('walletId');
                if(walletId) {
                    const walletDetails = await axios.get(`http://localhost:3000/wallet/${walletId}`);
                    setWalletData(walletDetails.data);
                }
            } catch (error) {
                window.alert('Error fetching wallet data !');
                console.error('Error fetching wallet data:', error);
            }
        }

        fetchData();
    }, []);


    async function createWallet() {
        try {
            const wallet = {
                name,
                balance,
            };
    
            const newWallet = await axios.post('http://localhost:3000/setup', wallet);
            window.alert('Wallet successfully created !');
            localStorage.setItem('walletId', newWallet.data._id);
            setWalletData(newWallet.data);
        } catch (error) {
            window.alert(error?.response?.data?.message);
            console.error('Error creating wallet:', error);
        }
    }

    return (
        <div className='wallet-form-wrapper'>
            {walletData ? (
                <UpdateWallet walletData={walletData} />
            ) : (
                <form className='wallet-form' onSubmit={e => { e.preventDefault(); createWallet(); }}>
                    <h1>Create Wallet</h1>
                    <div className='wallet-form-inputs'>
                        <input
                            type="text"
                            placeholder='Enter wallet name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                        <input
                            type="number"
                            placeholder='Enter balance'
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            min={0} // Negative balance not allowed
                        ></input>
                    </div>
                    <button className='wallet-form-submit'>Submit</button>
                </form>
            )}
        </div>
    )
}
export default SetupWallet;