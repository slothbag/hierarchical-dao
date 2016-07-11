var MembersPage = {}

MembersPage.route = "/members";

MembersPage.controller = function() {
    this.data = []
    if (rpcAvailable && daoaddress.length > 0) {
        
        var membersLength = web3.eth.getStorageAt(daoaddress, 3);
        var hash = web3.sha3("0x0000000000000000000000000000000000000000000000000000000000000003", {encoding:'hex'});
        var bn = web3.toBigNumber("0x" + hash);

        this.data = []
        for (var a = 1; a < membersLength; a++) {
            var memberStartPos = a * 8;
            var newMember = {}

            newMember.address = web3.toHex(web3.toBigNumber(web3.eth.getStorageAt(daoaddress, bn.plus(memberStartPos))));

            var result =  web3.eth.getStorageAt(daoaddress, bn.plus(memberStartPos + 5));
            var autoApproveActive = result.substr(64,2);
            var active = result.substr(62,2);
            var disableFirstTryDone = result.substr(60,2);

            newMember.active = active == 0 ? "Disabled" : "Active";

            if (web3.isAddress(newMember.address))
                newMember.eth = Math.round(web3.fromWei(web3.eth.getBalance(newMember.address), "ether").toNumber() * 10000) / 10000;
            else
                newMember.eth = 0;
            newMember.autoapprove = calcDuration(web3.toDecimal(web3.eth.getStorageAt(daoaddress, bn.plus(memberStartPos + 3))));
            this.data.push(newMember);
        }
    }
}

MembersPage.view = function(ctrl) {
          return m("table.table-striped",
              m("thead",
               m("tr",
                  m("th", "Address"),
                  m("th", "Active"),
                  m("th", "ETH"),
                  m("th", "AutoApprove")
                )
              ),
              m("tbody",
               ctrl.data.map(function(member){
                return m("tr",
                  m("td", member.address),
                  m("td", member.active),
                  m("td", member.eth),
                  m("td", member.autoapprove)
                );
               })
          ));
}
