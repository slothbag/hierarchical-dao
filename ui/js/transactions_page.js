var TransactionsPage = {}

TransactionsPage.route = "/transactions";

TransactionsPage.controller = function() {

    //update gasUsage for unchecked txs
    txHistory.collection.forEach(function(tx, idx) {
        //console.log(tx);
        if (tx != null && tx.gasUsed == null && tx.txid != null)
            var txReceipt = web3.eth.getTransactionReceipt(tx.txid);
            if (txReceipt != null) 
                var gasUsed = txReceipt.gasUsed;
            if (gasUsed > 0)
                txHistory.updateGasUsage(idx, gasUsed);
    });

    this.reversedCollection = txHistory.collection.slice();
    this.reversedCollection = this.reversedCollection.reverse();

}

TransactionsPage.view = function(ctrl) {

    return m("div", {style:"margin:10px;"},
        m("h3", {style:"margin-top:0px;"},"Transactions"),
        m("ul.list-group",
            ctrl.reversedCollection.map(function(tx) {
                return m("li.list-group-item",
                    m("div", {style:"-webkit-user-select: text;cursor:auto;"}, tx.txid),
                    m("div", m("b", "Proposal Type: "), tx.type, m("b",{style:"margin-left:20px;"} ," Gas Consumed: "), tx.gasUsed)
                );
            })
        )
    )
}
