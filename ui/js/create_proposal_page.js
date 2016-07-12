var CreateProposalPage = {}

CreateProposalPage.route = "/proposals";

CreateProposalPage.controller = function() {

    var self = this;

    //get active parent dao addresses
    this.parentDAOs = getParentDAOs();
    this.targetParentDAO = false;
    this.proposalType = m.prop(1);

    this.submit = function() {
        if (rpcAvailable == false || daoaddress.length == 0) {
            alert('No RPC or DAO Address available');
            return;
        }

        var gasPrice = web3.eth.gasPrice.toNumber();

        //get account
        var account = getPrimaryAccount();
        //get proptype
        var propTypeId = self.proposalType();
        
        //set param defaults
        var _address1 = "0x0";
        var _address2 = "0x0";
        var _uint1 = 0;
        var _uint2 = 0;
        var _bool1 = false;

        //get params from form if they are there
        if ($('#_address1').length) _address1 = $('#_address1').val();
        if ($('#_address2').length) _address2 = $('#_address2').val();
        if ($('#_uint1').length) _uint1 = $('#_uint1').val();
        if ($('#_uint2').length) _uint2 = $('#_uint2').val();
        if ($('#_bool1').length) _bool1 = $('#_bool1').is(":checked");

        var contract = web3.eth.contract(HierarchicalDAO_abi);
        var instance = contract.at(daoaddress);

        var gasAmount = 300000;

        //var propTypeId = ProposalsPage.propTypes.indexOf(propType);

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
        
        txHistory.add(ProposalsPage.propTypes[propTypeId].name, tx);
    }

    this.toggleTargetDAO = function() {
        if (self.targetParentDAO)
            self.targetParentDAO = false;
        else
            self.targetParentDAO = true;
    }
}

CreateProposalPage.view = function(ctrl) {

    var targetDAOcheckbox = null;
    var targetDAOdropdown = null;

    if (ctrl.parentDAOs.length > 0) {

        targetDAOcheckbox = m("div.checkbox", 
                m("label",
                    m("input", {type:"checkbox", onclick:ctrl.toggleTargetDAO}),
                    "Target this proposal to a parent DAO"
                )
            );

        if (ctrl.targetParentDAO) {
            targetDAOdropdown = m("div.form-group", {style:"width:400px"},
                        m("label","Target DAO"),
                        m("select.form-control", {id:"_address1"},
                            ctrl.parentDAOs.map(function(daoaddress, idx) {
                                return m("option", {value:daoaddress}, daoaddress);
                            })
                        )
                    );
        }

    }

    //build the params
    var paramControls = [];
    if (ProposalsPage.propTypes[ctrl.proposalType()].hasOwnProperty('params')) {
        for (var a=0; a < ProposalsPage.propTypes[ctrl.proposalType()].params.length; a++) {
            var param = ProposalsPage.propTypes[ctrl.proposalType()].params[a];
            if (param.type.startsWith("_uint")) {
                paramControls.push(m("div.form-group", {style:param.size ? "width:" + param.size : "width:100px"},
                    m("label", param.name),
                    m("input", {type:"text", class:"form-control", id:param.type})
                ));
            }
            else if (param.type.startsWith("_address")) {
                paramControls.push(m("div.form-group", {style:"width:400px"},
                    m("label", param.name),
                    m("input", {type:"text", class:"form-control", id:param.type})
                ));
            }
            else if (param.type.startsWith("_bool")) {
                paramControls.push(m("div.checkbox", 
                    m("label",
                        m("input", {type:"checkbox", name:"__bool1", id:param.type}),
                        param.name
                    )
                ));
            }
        }
    }

    return m("div", {style:"margin:10px;"},
        m("h3", {style:"margin-top:0px;"}, "Create Proposal"),
        m("form",
            m("div.form-group", {style:"width:400px"},
                m("label","Proposal Type"),
                m("select.form-control", {id:"proposalType", onchange: m.withAttr("value", ctrl.proposalType)},
                    ProposalsPage.propTypes.map(function(propType, idx) {
                        if (propType != "")
                            return m("option", {value:idx}, propType.name);
                    })
                )
            ),
            targetDAOcheckbox,
            targetDAOdropdown,
            paramControls
        ),

        m("button.btn.btn-default",{onclick:ctrl.submit}, "Submit Proposal")
    )
}
