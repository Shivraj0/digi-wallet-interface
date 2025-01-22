import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UpdateWallet from './updateWallet';
import { config } from '../config';
import '../styles/setupWallet.css';

function SetupWallet() {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState(0);
    const [walletData, setWalletData] = useState(null);
    const isMounted = useRef(true);
    
    let walletId = localStorage.getItem('walletId');
    const SETUP_WALLET_URL = config.setupWalletUrl();
    const WALLET_DETAILS_URL = config.walletDetailsUrl(walletId);

    useEffect(() => {
        async function fetchData() {
            try {
                if(walletId && isMounted.current) {
                    const walletDetails = await axios.get(WALLET_DETAILS_URL);
                    setWalletData(walletDetails.data);
                }
            } catch (error) {
                window.alert('Error fetching wallet data !');
                console.error('Error fetching wallet data:', error);
            }
        }

        fetchData();

        return () => {
            isMounted.current = false;
        };
    }, [walletId]); // walletId will not change here, but added for completeness


    async function createWallet() {
        try {
            const wallet = {
                name,
                balance,
            };
    
            const newWallet = await axios.post(SETUP_WALLET_URL, wallet);
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