var txHistory = {}

txHistory.collection = []

txHistory.add = function(type, txid) {
    txHistory.collection.push({
        type: type,
        txid: txid,
        gasUsed: null
    });

    localStorage.setItem('txs', JSON.stringify(txHistory));
}

txHistory.updateGasUsage = function(idx, gasUsed) {
    txHistory.collection[idx].gasUsed = gasUsed;
    localStorage.setItem('txs', JSON.stringify(txHistory));
}