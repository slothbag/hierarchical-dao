var CreateProposalPage = {}

CreateProposalPage.route = "/proposals";

CreateProposalPage.controller = function() {

    //get active parent dao addresses
    this.parentDAOs = getParentDAOs();

    this.submit = function() {
        if (rpcAvailable == false || daoaddress.length == 0) {
            alert('No RPC or DAO Address available');
            return;
        }

        var gasPrice = web3.eth.gasPrice.toNumber();

        //get account
        var account = getPrimaryAccount();
        //get proptype
        var propType = $('#proposalType option:selected').text();
        
        //get address1
        var _address1 = $('#_address1').val();
        //get address2
        var _address2 = $('#_address2').val();

        var _uint1 = $('#_uint1').val();
        var _uint2 = $('#_uint2').val();
        var _bool1 = $('#_bool1').is(":checked");

        var contract = web3.eth.contract(HierarchicalDAO_abi);
        var instance = contract.at(daoaddress);

        var gasAmount = 300000;

        var propTypeId = ProposalsPage.propTypes.indexOf(propType);

        if (propTypeId == 1)
            var tx = instance.proposeChangeAutoApprovalDuration(_address1, _uint1, _uint2, _bool1, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 2)
            var tx = instance.proposeChangeMinAppovalQuorum(_address1, _uint1, _uint2, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 3)
            var tx = instance.proposeChangeMinVetoQuorum(_address1, _uint1, _uint2, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 5)
            var tx = instance.proposeChangeMemberStatus(_address1, _uint1, _bool1, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 6)
            var tx = instance.proposeModifyCompulsoryApprover(_address1, _uint1, _uint2, _bool1, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 7)
            var tx = instance.proposeJoinParentDAO(_address1, _address2, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 8)
            var tx = instance.proposeVote(_address1, _uint1, _bool1, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 9)
            var tx = instance.proposeAddMember(_address1, _address2, _bool1, {from: account, gasPrice: gasPrice, gas: gasAmount});
        if (propTypeId == 10)
            var tx = instance.proposeTransferEth(_address1, _address2, _uint1, {from: account, gasPrice: gasPrice, gas: gasAmount});
        
        txHistory.add(propType, tx);
    }
}

CreateProposalPage.view = function(ctrl) {
    return m("div", {style:"margin:10px;"},
        m("h3", {style:"margin-top:0px;"}, "Create Proposal"),
        m("form",
            m("div.form-group", {style:"width:400px"},
                m("label","Proposal Type"),
                m("select.form-control", {id:"proposalType"},
                    ProposalsPage.propTypes.map(function(propType, idx) {
                        if (propType != "")
                            return m("option", {value:idx}, propType);
                    })
                )
            ),
            function() {
                //only return target DAO if there are some
                if (ctrl.parentDAOs.length > 0) {
                    return m("div.form-group", {style:"width:400px"},
                        m("label","Target DAO"),
                        m("select.form-control", {id:"_address1"},
                            ctrl.parentDAOs.map(function(daoaddress, idx) {
                                return m("option", {value:daoaddress}, daoaddress);
                            })
                        )
                    )
                }
            }(),
            m("div.form-group", {style:"width:400px"},
                m("label","_address2"),
                m("input", {type:"text", class:"form-control", id:"_address2"})
            ),
            m("div.form-group", {style:"width:400px"},
                m("label","_uint1"),
                m("input", {type:"text", class:"form-control", id:"_uint1"})
            ),
            m("div.form-group", {style:"width:400px"},
                m("label","_uint2"),
                m("input", {type:"text", class:"form-control", id:"_uint2"})
            ),
            m("div.checkbox", 
                m("label",
                    m("input", {type:"checkbox", name:"__bool1", id:"_bool1"}),
                    "_bool1"
                )
            )
        ),

        m("button.btn.btn-default",{onclick:ctrl.submit}, "Submit Proposal")
    )
}
