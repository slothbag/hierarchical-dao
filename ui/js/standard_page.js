var StandardPage = function(page) {

	var tmpComponent = {}

	tmpComponent.view = function() {
        //this code gets executed with every refresh
        var block = {}
        //set some defaults
        block.number = 0;
        block.timestamp = 0;
        ethCache.balance = 0;

        if (rpcAvailable) {
            block = web3.eth.getBlock("latest");
            if (daoaddress.length > 0)
                ethCache.balance = web3.fromWei(web3.eth.getBalance(daoaddress), "ether").toNumber();
        }

        var blockLagSeconds = Math.round(new Date().getTime() / 1000) - block.timestamp;
        var blockLag;
        if (blockLagSeconds < 60)
            blockLag = blockLagSeconds + " seconds";
        else if (blockLagSeconds < 3600)
            blockLag = Math.round(blockLagSeconds / 60) + " minutes";
        else 
            blockLag = Math.round(blockLagSeconds / 60 / 60) + " hours";

		return m("div.window",

                m("header.toolbar.toolbar-header",
                    m("div.title",
                        "Latest block: " + block.number + " (" + blockLag + " ago)",
                        m("span", {style:"margin-left:30px;"}, "Node: " + ethrpc),
                        m("span", {style:"margin-left:30px;"}, "DAO Balance: " + ethCache.balance + " ETH")
                    )
                ),

                m("div.window-content",
                    m("div.pane-group",
                        m("div.pane.pane-sm.sidebar",
                            m.component(SideMenu, {currentPageRoute: page.route})
                        ),

                        m("div.pane",    
                            m.component(page)
                        )

                    )
                )
            );

	}

	return tmpComponent;
}
