var SettingsPage = {}

SettingsPage.route = "/settings";

SettingsPage.controller = function() {

    this.save = function() {
        ethrpc = $('#ethrpc').val();
        localStorage.setItem("ethrpc", ethrpc);

        daoname = $('#daoname').val();
        localStorage.setItem("daoname", daoname);

        daoaddress = $('#daoaddress').val();
        localStorage.setItem("daoaddress", daoaddress);
        
        web3.setProvider(new web3.providers.HttpProvider('http://' + ethrpc));
        rpcAvailable = web3.isConnected();

        //m.redraw();
        
        return false;
    }
}

SettingsPage.view = function(ctrl) {
    return m("div", {style:"margin:10px;"},
     m("h3", {style:"margin-top:0px;"},"Settings"),
     m("form",
        m("div.form-group",
            m("div", m("label","Ethereum RPC address")),
            m("input", {type:"text",class:"form-control", style:"max-width:300px;", id:"ethrpc", value:ethrpc})
        ),
        m("div.form-group",
            m("div", m("label","DAO Name")),
            m("input", {type:"text",class:"form-control", style:"max-width:400px;", id:"daoname", value:daoname})
        ),
        m("div.form-group",
            m("div", m("label","DAO Contract Address")),
            m("input", {type:"text",class:"form-control", style:"max-width:350px;", id:"daoaddress", value:daoaddress})
        ),
        m("button.btn.btn-default",{onclick:ctrl.save}, "Save")
     )
    );
}
