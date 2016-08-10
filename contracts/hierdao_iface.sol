contract HierarchicalDAO_iface {

    //member settings
    //1
    function proposeChangeAutoApprovalDuration(address targetDAO, uint member, uint newTimeInSeconds);
    //2
    function proposeChangeMinAppovalQuorum(address targetDAO, uint member, uint newQuorum);
    //3
    function proposeChangeMinVetoQuorum(address targetDAO, uint member, uint newQuorum);
    //5
    function proposeChangeMemberStatus(address targetDAO, uint member, bool state);
    //6
    function proposeModifyCompulsoryApprover(address targetDAO, uint member, uint approver, bool removeOrAdd); //false = remove, true = add

    //proposal actions
    //7
    function proposeJoinParentDAO(address targetDAO, address parentDAO);
    //8
    function proposeVote(address targetDAO, uint proposalIdx, bool vetoOrApproval); //false = veto, true = approve
    //9
    function proposeAddMember(address targetDAO, address newMember);
    //10
    function proposeTransferEth(address targetDAO, address recipient, uint amount);
    //11
    function proposeTransferToken(address targetDAO, address token, address recipient, uint amount);
    //12
    function proposeSetMigrationStatus(address targetDAO, address targetContract, address newContract, uint migrationStatus);

    // RecursiveDAO v2??
    //IssueStake
    //SellStake
    //TransferStake

}

contract MigratableContract_iface {
    function setMigrationStatus(uint, address);
}

contract ERC20_iface {
    function transfer(address, uint) returns (bool);
}