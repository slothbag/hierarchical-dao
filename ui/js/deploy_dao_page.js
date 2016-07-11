var DeployDAOPage = {}

DeployDAOPage.route = "/deploy";

DeployDAOPage.controller = function() {
    this.deployClick = function() {

        var account = web3.eth.accounts[0];
        var gasPrice = web3.eth.gasPrice.toNumber();
        var contract = web3.eth.contract(HierarchicalDAO_abi);

        $('#new_dao_address').html("waiting...");
        contract.new({from: account, gas:3100000, gasPrice: gasPrice, data: HierarchicalDAO_bin}, function(err, myContract) {
            if (err) {
                alert(err);
                return;
            }

            if(myContract.address == null) {
                txHistory.add("DeployDAO", myContract.transactionHash);
                $('#new_dao_tx').html('tx: ' + myContract.transactionHash);
            }

            if (myContract.address != null) {
                $('#new_dao_address').html(myContract.address);
            }
		
	    });	
    }
}

DeployDAOPage.view = function(ctrl) {
    return m("div", {style:"margin:10px;"},
        m("h3", {style:"margin-top:0px;"},"Deploy DAO"),
        m("button.btn.btn-large.btn-primary", {onclick:ctrl.deployClick}, "Click to deploy new DAO"),
        m("div",{id:"new_dao_tx"}),
        m("div",{id:"new_dao_address"})
    )
}
