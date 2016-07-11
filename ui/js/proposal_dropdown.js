var ProposalDropdown = {}

ProposalDropdown.controller = function(args) {

    this.items = [
        {icon:"icon-book-open", text:"View Details"},
        {icon:"icon-thumbs-up", text:"Vote For"},
        {icon:"icon-thumbs-down", text:"Vote Against"},
        {icon:"icon-flash", text:"Execute Proposal"}
    ]

    this.handleClick = function() {
        var chosen = $(this).attr('selector');
        if (chosen == 'View Details')
            args.viewDetails();
        else if (chosen == 'Vote For')
            args.voteOnProposal(true);
        else if (chosen == 'Vote Against')
            args.voteOnProposal(false);
        else if (chosen == 'Execute Proposal')
            args.executeProposal();
    }
}

ProposalDropdown.view = function(ctrl, args) {
    return m("div", {id:"jq-dropdown-1", class:"jq-dropdown jq-dropdown-tip"}, 
        m("ul", {class:"jq-dropdown-menu"},
            ctrl.items.map(function(item) {
                return m("li", m("a", {href:"javascript:void(0);", selector:item.text, onclick:ctrl.handleClick }, m("div.icon", {class:item.icon, style:"display:inline-block;width:12px;"}), " ", item.text));
            })
        )
    )
}