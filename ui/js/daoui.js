require("../vendor/gx/ipfs/QmbqNPsyWN5uKmqjj6sv5sqvfyNuJaRFsA6mjzg54XAEWo/web3/web3");
const m = require("../vendor/gx/ipfs/QmQhhKYqNwipMSpwz5G2fY3dX2xm1H6pujeLWKS7PK1fRP/mithriljs/mithril");
const $ = require("../vendor/gx/ipfs/QmdVSi27zJ8dLs6Yf272cYJxKvmk3vBwqWGrMqiXEgaGL1/jQuery/Content/Scripts/jquery-2.2.1");
jQuery = $;
require("../vendor/gx/ipfs/Qmdr95n4J6tMz5T1pzPCGVngetzqtS2tfEuxasYLMW9Upx/jquery-dropdown/jquery.dropdown.min");
require("../vendor/gx/ipfs/QmQLk8Rh2cNjKkTZsZJaJFptXpVC3Ebx1eVi37gWbbt6ck/perfect-scrollbar/perfect-scrollbar");
const remote = require('electron').remote;

//attach events
$(function() {

    //load localStorage settings
    ethrpc = localStorage.getItem("ethrpc");
    daoname = localStorage.getItem("daoname");
    daoaddress = localStorage.getItem("daoaddress");

    var txs = JSON.parse(localStorage.getItem('txs'));
    if (txs != null)
        txHistory.collection = txs.collection;

    //set a global eth query cache object
    ethCache = {}

    //set default rpc address if empty
    if (ethrpc == "" || ethrpc == null)
        ethrpc = "127.0.0.1:8545";

    web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider('http://' + ethrpc));

    rpcAvailable = web3.isConnected();

    //set up the routes
    m.route.mode = "hash";
    m.route(document.body, "/", {
	    "/": StandardPage(DashboardPage),
        "/dashboard": StandardPage(DashboardPage),
        "/settings": StandardPage(SettingsPage),
        "/members": StandardPage(MembersPage),
        "/proposals": StandardPage(ProposalsPage),
        "/transactions": StandardPage(TransactionsPage),
        "/tree": StandardPage(TreePage),
        "/createproposal": StandardPage(CreateProposalPage),
        "/deploy": StandardPage(DeployDAOPage),
    });
});
