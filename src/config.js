const DIGI_WALLET_SERVICE_BASE_URL = `http://localhost:3000`;

const config = {
    setupWalletUrl: () => `${DIGI_WALLET_SERVICE_BASE_URL}/setup`,
    updateWalletUrl: walletId => `${DIGI_WALLET_SERVICE_BASE_URL}/transact/${walletId}`,
    walletDetailsUrl: walletId => `${DIGI_WALLET_SERVICE_BASE_URL}/wallet/${walletId}`,
    walletTransactionsUrl: () => `${DIGI_WALLET_SERVICE_BASE_URL}/transactions`,
};

export { config };