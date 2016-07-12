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
                    ProposalsPage.propTypes[prop.type].name,
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
    {
        name:"ChangeAutoApprovalDuration", 
        params:[
            {name:"Member Index (e.g. 1 for first member)", type:"_uint1"}, 
            {name:"New Time in Seconds (e.g. 604800 = 1 week)", type:"_uint2"}, 
            {name:"DAO Overide (if set, adjusts the auto approve for the DAO as a whole and ignores the member index field)", type:"_bool1"}
        ]
    },
    {name:"ChangeMinAppovalQuorum",
        params:[
            {name:"Member Index (e.g. 1 for first member)", type:"_uint1"}, 
            {name:"New Quorum (e.g. 0 for all, or 1 for one member etc)", type:"_uint2"} 
        ]
    },
    {name:"ChangeMinVetoQuorum",
        params:[
            {name:"Member Index (e.g. 1 for first member)", type:"_uint1"}, 
            {name:"New Quorum (e.g. 0 for all, or 1 for one member etc)", type:"_uint2"} 
        ]
    },
    "",
    {name:"ChangeMemberStatus",
        params:[
            {name:"Member Index (e.g. 1 for first member)", type:"_uint1"}, 
            {name:"Active (e.g. unchecked for disabled, checked for active)", type:"_bool1"} 
        ]
    },
    {name:"ModifyCompulsoryApprover",
        params:[
            {name:"Member Index (e.g. 1 for first member)", type:"_uint1"}, 
            {name:"Approver Index (e.g. 2 for second member)", type:"_uint2"},
            {name:"Remove or Add (e.g. unchecked to remove, checked to add)", type:"_bool1"} 
        ]
    },
    {name:"JoinParentDAO",
        params:[
            {name:"Parent DAO Address (e.g. 0x12345...)", type:"_address1"} 
        ]
    },
    {name:"Vote",
        params:[
            {name:"Proposal Index (e.g. 0 for first proposal)", type:"_uint1"}, 
            {name:"Veto or Approve (e.g. unchecked for Veto, checked for Approve)", type:"_bool1"} 
        ]
    },
    {name:"AddMember",
        params:[
            {name:"Member Address (e.g. 0x12345.... of new member or DAO to add)", type:"_address1"}, 
            {name:"Active (e.g. unchecked for disabled, checked for active)", type:"_bool1"} 
        ]
    },
    {name:"TransferEth",
        params:[
            {name:"Recipient Address (e.g. 0x12345....)", type:"_address1"}, 
            {name:"Amount (e.g. amount in Wei 18 zeros = 1 ETH)", type:"_uint1", size:"400px"} 
        ]
    },
    {name:"TransferToken"}
]

ProposalsPage.approvalTypes = [
    "Pending",
    "Vetoed",
    "Auto Approved",
    "Explicitly Approved"
]
