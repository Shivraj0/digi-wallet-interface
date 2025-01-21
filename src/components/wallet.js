import { useState } from 'react';
import axios from 'axios';
import '../styles/wallet.css';

function Wallet() {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState(0);

    function createWallet() {
        const wallet = {
            name,
            balance,
        };

        axios.post('http://localhost:3000/setup', wallet)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                window.alert('Error creating wallet');
            });
    }

    return (
        <div className='wallet-form-wrapper'>
            <form className='wallet-form'>
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
                <button className='wallet-form-submit' onClick={createWallet}>Submit</button>
            </form>
        </div>
    )
}
export default Wallet;