import TonConnect from '@tonconnect/sdk';

export const connector = new TonConnect();

connector.restoreConnection();

export const walletConnectionSource = {
    universalLink: 'https://app.tonkeeper.com/ton-connect',
    bridgeUrl: 'https://bridge.tonapi.io/bridge'
}
