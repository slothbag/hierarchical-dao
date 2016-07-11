var DashboardPage = {}

DashboardPage.route = "/dashboard";

DashboardPage.controller = function() {

    //get version, parent, autoapprove
    if (rpcAvailable && daoaddress.length > 0) {
        this.daoversion = web3.toAscii(web3.eth.getStorageAt(daoaddress, 1));
        this.parentdao = web3.toHex(web3.toBigNumber(web3.eth.getStorageAt(daoaddress, 0)));
        this.autoapprovedurationoveride = web3.toDecimal(web3.eth.getStorageAt(daoaddress, 2));
        this.memberCount = web3.toDecimal(web3.eth.getStorageAt(daoaddress, 3)) - 1;
        this.proposalCount = web3.toDecimal(web3.eth.getStorageAt(daoaddress, 4));
    }   

}

DashboardPage.view = function(ctrl) {
    var title = "Dashboard";
    if (daoname)
        title = daoname;

    return m("div", {style:"margin:10px;"},
     m("h3", {style:"margin-top:0px;"}, title),
     m("h5", m("b", "DAO Balance")),
     m("div", {style:"font-size:25px;font-weight:bold;"}, ethCache.balance + " ETH"),
     m("h5", m("b","DAO Settings")),
     m("div",
        m("div", "DAO Version: ", m("b", ctrl.daoversion)),
        m("div", "Parent DAO: ", m("b", ctrl.parentdao)),
        m("div", "Auto Approve Duration Overide: ",  m("b", ctrl.autoapprovedurationoveride ))
     ),
     m("h5", m("b", "DAO Members")),
     m("div", {style:"font-size:18px;font-weight:bold;"}, ctrl.memberCount, " Members" ),
     m("h5", m("b", "DAO Proposals")),
     m("div", {style:"font-size:18px;font-weight:bold;"}, ctrl.proposalCount, " Proposals" )
    );
}
