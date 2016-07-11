import "./libdao_state.sol"; 

library LibDAO_Member  {

     function init(LibDAO_State.state storage state) {
        //add the creator as the first member
        //the creator initially can immediately execute proposals and can submit new proposals with no delay
        //after the dao is setup, make sure this account is disabled or restricted
        
        //skip the zero [0] position
        state.members.length++;
        state.members.length++;

        state.members[1].autoApprovalDuration = 1; // default 1 second vote duration (essentially no wait, 0 == autoApproval disabled) 
        state.members[1].minMemberQuorumForVeto = 1; // one veto and the proposal is toast! 
        state.members[1].minMemberQuorumForApproval = 0; //0 everyone (for explicit approval or if auto-approve is disabled)

        state.members[1].account = msg.sender;
        state.members[1].active = true;
        state.members[1].autoApprovalActive = true;
        //members[0].simultaneousProposals = 100;
        //state.members[1].nextProposalDelay = 0; //0 no delay for first member
        //state.members[1].lastProposalActivity = 0;
        //state.members[1].disableFirstTryDone = false;       
    }

    function getActiveMemberIdx(LibDAO_State.state storage state, address memberAddress) returns (uint) {
        for (uint i = 1; i < state.members.length; i++)
            if (state.members[i].active && state.members[i].account == memberAddress) return i;
        return uint(-1);
    }

    function getActiveMemberCount(LibDAO_State.state storage state) returns (uint) {
        uint count;
        for (uint i = 1; i < state.members.length; i++)
            if (state.members[i].active) count++;
        return count;
    }

    function createNewMember(LibDAO_State.state storage state) internal returns (uint) {

        uint newMemberIdx = state.members.length++;    
        state.members[newMemberIdx].minMemberQuorumForVeto = 1;
        //state.members[newMemberIdx].minMemberQuorumForApproval = 0;
        state.members[newMemberIdx].autoApprovalDuration = 7 days;
		state.members[newMemberIdx].autoApprovalActive = true;
        //state.members[newMemberIdx].active = false;
        state.members[newMemberIdx].nextProposalDelay = 7 days;
        //state.members[newMemberIdx].lastProposalActivity = 0;
        //state.members[newMemberIdx].disableFirstTryDone = false;
        return newMemberIdx;
    }

    

}