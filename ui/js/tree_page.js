var TreePage = {}

TreePage.route = "/tree";

TreePage.controller = function() {
    
    var self = this;

    //after chart canvas is initialized, construct the chart
    this.config = function(elem, isInit) {

        var chart_config = {
            chart: {
                container: "#daochart",
                animateOnInit: false,
                scrollbar: 'fancy',
                node: {
                   HTMLclass: 'nodeExample1'
                }
            },
            nodeStructure: self.structure
        }
        var tree = new Treant( chart_config );
    }

    //we initiate the recursive call with our DAO address
    var topDAO = TreePage.findTopDAO(daoaddress);
    this.structure = TreePage.fetchHierarchy(topDAO);
}

TreePage.view = function(ctrl) {
    return m("div", {style:"margin:10px;height:90%;", config:ctrl.config},
        m("h3", {style:"height:30px;min-height:30px;"},"DAO Hierarchy"),
        m("div.chart", {id:"daochart",style:"height:95%;width:100%;overfdlow:visible;"})
    )
}











TreePage.isValidDAOVersion = function(version) {
    if (version == "1.0.1")
        return true;
    
    return false;
}

TreePage.findTopDAO = function(startingDAO) {
    var bFound = false;
    var targetDAO = startingDAO;

    while (!bFound) {
        var parentdao = web3.toHex(web3.toBigNumber(web3.eth.getStorageAt(targetDAO, 0)));
        var daoversion = web3.toAscii(web3.eth.getStorageAt(targetDAO, 1));
        daoversion = daoversion.replace(/[\0\n]/g, '');
        if (TreePage.isValidDAOVersion(daoversion) && parentdao != 0) {
            targetDAO = parentdao;
            continue;
        }
        else
            return targetDAO;
    }
}

//function to walk the DAO structure
TreePage.fetchHierarchy = function(target_dao_address) {
    //fetch daos & members both upstream and downstream from us
    var structure = {}
    structure.text = {name: target_dao_address}
    structure.image = "img/network.png";
    structure.stackChildren = true;

    //check each member
    var membersLength = web3.eth.getStorageAt(target_dao_address, 3);
    var hash = web3.sha3("0x0000000000000000000000000000000000000000000000000000000000000003", {encoding:'hex'});
    var bn = web3.toBigNumber("0x" + hash);

    var children = []
    for (var a=1;a<membersLength;a++) {
        var memberStartPos = a * 8;
        var memberAddress = web3.toHex(web3.toBigNumber(web3.eth.getStorageAt(target_dao_address, bn.plus(memberStartPos))));
        //try get DAOversion to determine if user or DAO
        var memberDAOVersion = web3.toAscii(web3.eth.getStorageAt(memberAddress, 1));
        memberDAOVersion = memberDAOVersion.replace(/[\0\n]/g, '');
        if (TreePage.isValidDAOVersion(memberDAOVersion)) {
            var tmpStruct = TreePage.fetchHierarchy(memberAddress);
            children.push(tmpStruct)
        }
        else
            children.push({text: {name: memberAddress}, image:"img/user1.png"})
    }

    if (children.length > 0)
        structure.children = children;

    return structure;
}