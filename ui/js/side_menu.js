var SideMenu = {}

SideMenu.controller = function(args) {
    this.items = [];
	this.items.push({title: "Dashboard", route: "/dashboard", icon: "icon-home"});
	this.items.push({title: "Members", route: "/members", icon: "icon-users"});
	this.items.push({title: "Proposals", route: "/proposals", icon: "icon-download"});
    this.items.push({title: "Hierarchy", route: "/tree", icon: "icon-flow-tree"});
    this.items.push({title: "Transactions", route: "/transactions", icon: "icon-clipboard"});
    this.items.push({title: "Deploy DAO", route: "/deploy", icon: "icon-upload-cloud"});
	this.items.push({title: "Settings", route: "/settings", icon: "icon-cog"});
	this.items.push({title: "Quit", route: "", icon: "icon-logout"});

    this.quit = function() {
        var win = remote.getCurrentWindow();
        win.close();
    }

    this.propAdd = function() {
        m.route("/createproposal");
        return false;
    }
}

SideMenu.view = function(ctrl, args) {

    //build the items array
    var items = ctrl.items.map(function(item) {
        
        var attr = {};
        var propAddBtn;

        if (item.title == "Quit")
            attr.onclick = ctrl.quit;

        if (item.title == "Proposals")
            propAddBtn = m("span.icon.icon-plus-circled", {onclick:ctrl.propAdd});

        if (args.currentPageRoute == item.route)
            attr.class = "active";

        return m("a", {href:"#"+item.route, style:"text-decoration: none;"}, 
                m("span.nav-group-item", attr,
                   m("span.icon." + item.icon),
                   item.title,
                   m("span.pull-right", propAddBtn)
                 )
        )
    });

    return m("nav.nav-group",
              m("h5.nav-group-title","Menu"),
              items
    );

}