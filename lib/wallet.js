/** E-wallet used for booking deposits. Stored in the `gcash` settings key for backwards compatibility. */
export const WALLETS = {
  maya: { key: 'maya', name: 'Maya', paymongoMethod: 'paymaya', sampleQr: '/art/maya-qr-sample.svg' },
  gcash: { key: 'gcash', name: 'GCash', paymongoMethod: 'gcash', sampleQr: '/art/gcash-qr-sample.svg' },
};

export function getWallet(walletSettings = {}) {
  const w = WALLETS[walletSettings.provider] || WALLETS.maya;
  const isSample = !walletSettings.qrUrl || /\/art\/(gcash|maya)-qr-sample\.svg$/.test(walletSettings.qrUrl);
  return { ...w, accountName: walletSettings.accountName || '', number: walletSettings.number || '', qrUrl: isSample ? w.sampleQr : walletSettings.qrUrl };
}
