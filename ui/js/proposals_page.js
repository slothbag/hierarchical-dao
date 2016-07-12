var ProposalsPage = {}

ProposalsPage.route = "/proposals";

ProposalsPage.controller = function() {
    var self = this;

    this.domCreated = false;

    //include the dropdown menu
    $("body").append('<div id="dropdown"></div>');
    m.mount($('#dropdown').get(0), m.component(ProposalDropdown, self));

    this.data = []
    if (rpcAvailable && daoaddress.length > 0) {
        var proposalsLength = web3.eth.getStorageAt(daoaddress, 4);
        var hash = web3.sha3("0x0000000000000000000000000000000000000000000000000000000000000004", {encoding:'hex'});
        var bn = web3.toBigNumber("0x" + hash);

        this.data = []
        for (var a = 0; a < proposalsLength; a++) {
            var proposalStartPos = a * 13;
            var newProposal = {}
            newProposal.type = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos + 10)));
            newProposal.isOpen = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos + 8))) == 0 ? "Closed" : "Open";
            newProposal.status = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos + 9)));
            newProposal.proposedBy = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos)));
            newProposal.startDate = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos + 7)));
            newProposal.approvals = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos + 11)));
            newProposal.vetos = web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(proposalStartPos + 12)));

            this.data.push(newProposal);
        }
    }

    this.onunload = function() {
        //remove the dropdown on unload
        $('#dropdown').remove();
    }

    this.ddClick = function(idx) {
        self.selectedProposal = idx;
        return;
    }

    this.viewDetails = function() {
        alert("View proposal: " + self.selectedProposal);
    }

    this.executeProposal = function() {
        var account = getPrimaryAccount();
        var gasPrice = web3.eth.gasPrice.toNumber();
        var contract = web3.eth.contract(HierarchicalDAO_abi);
        var instance = contract.at(daoaddress);
        try {
            var tx = instance.execProposal(self.selectedProposal, {from: account, gasPrice: gasPrice, gas: 300000});
        }
        catch (err) {
            alert(err);
            return;
        }
        txHistory.add("execProposal", tx);
    }

    this.voteOnProposal = function(vote) {
        var account = getPrimaryAccount();
        var gasPrice = web3.eth.gasPrice.toNumber();
        var contract = web3.eth.contract(HierarchicalDAO_abi);
        var instance = contract.at(daoaddress);
        try {
            var tx = instance.voteOnProposal(self.selectedProposal, vote, {from: account, gasPrice: gasPrice, gas: 300000});
        }
        catch (err) {
            alert(err);
            return;
        }
        txHistory.add("voteOnProposal", tx);
    }
}

ProposalsPage.view = function(ctrl) {
          return m("div",
            m("table.table-striped",
              m("thead",
               m("tr",
                  m("th", "Type"),
                  m("th", "ProposedBy"),
                  m("th", "StartDate"),
                  m("th", "Approval Status"),
                  m("th", "Status"),
                  m("th", "Approvals"),
                  m("th", "Vetos")
                )
              ),
              m("tbody",
               ctrl.data.map(function(prop, idx){
                return m("tr",
                  m("td",
                    ProposalsPage.propTypes[prop.type],
                    m("a", {href:"javascript:void(0);", "data-jq-dropdown":"#jq-dropdown-1", id:"test" + idx, onclick:ctrl.ddClick.bind(null, idx)}, 
                        m("span.icon.icon-down-open", {style:"margin-left:10px;"})
                    )
                  ),
                  m("td", prop.proposedBy),
                  m("td", formatDate(prop.startDate)),
                  m("td", ProposalsPage.approvalTypes[prop.status]),
                  m("td", prop.isOpen),
                  m("td", prop.approvals),
                  m("td", prop.vetos)
                );
               })
            ))
          );
}

ProposalsPage.propTypes = [
    "",
    "ChangeAutoApprovalDuration",
    "ChangeMinAppovalQuorum",
    "ChangeMinVetoQuorum",
    "",
    "ChangeMemberStatus",
    "ModifyCompulsoryApprover",
    "JoinParentDAO",
    "Vote",
    "AddMember",
    "TransferEth",
    "TransferToken"
]

ProposalsPage.approvalTypes = [
    "Pending",
    "Vetoed",
    "Auto Approved",
    "Explicitly Approved"
]
