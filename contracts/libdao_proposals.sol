import "./libdao_member.sol";
import "./libdao_state.sol";
import "./libdao_proposal.sol";
import "./hierdao_iface.sol";

library LibDAO_Proposals  {

    event ProposalApproved(uint proposalIdx);

    function passThrough(LibDAO_State.state storage state, uint proposalType, address targetDAO,
        address _address1, address _address2,
        uint _uint1, uint _uint2,
        bool _bool1
    ) {
        //if its an execProposal, do it and return
        if (proposalType == 0) {
            execProposal(state, _uint1);
            return;
        }

        // it must be a proposal

        //ensure they are a member
        uint memberIdx = LibDAO_Member.getActiveMemberIdx(state, msg.sender); 
        if (memberIdx == uint(-1))
            return;

        //create the proposal struct and return its index
        uint propIdx = LibDAO_Proposal.createNewProposal(state, memberIdx, targetDAO, proposalType);

        if (_address1 != 0x0)
            state.proposals[propIdx].data._address1 = _address1;

        if (_address2 != 0x0)
            state.proposals[propIdx].data._address2 = _address2;

        if (_uint1 != 0x0)
            state.proposals[propIdx].data._uint1 = _uint1;

        if (_uint2 != 0x0)
            state.proposals[propIdx].data._uint2 = _uint2;

        if (_bool1 == true)
            state.proposals[propIdx].data._bool1 = _bool1;

    }

    function execProposal(LibDAO_State.state storage state, uint proposalIdx) {
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];

        //check the proposal is still open
        if (!prop.isOpen)
            return;

        //its vetod (shouldnt happen but just in case)
        if (prop.status == 1)
            return;

        //first check if autoaccept duration has passed
        if (prop.status == 0) {
            if (LibDAO_Proposal.checkProposalApprovalStatus(state, proposalIdx)) {
                ProposalApproved(proposalIdx);
                prop.status = 2;
            }
            else
                return;
        }

        //if status is 1 isOpen would be false, if status is 2 or 3 then its good to go

        if (prop.proposalType == 1)
            execChangeAutoApprovalDuration(state, proposalIdx);
        if (prop.proposalType == 2)
            execChangeMinAppovalQuorum(state, proposalIdx);
        if (prop.proposalType == 3)
            execChangeMinVetoQuorum(state, proposalIdx);
        //if (prop.proposalType == 4)
        if (prop.proposalType == 5)
            execChangeMemberStatus(state, proposalIdx);
        if (prop.proposalType == 6)
            execModifyCompulsoryApprover(state, proposalIdx);
        if (prop.proposalType == 7)
            execJoinParentDAO(state, proposalIdx);

        /*
        if (prop.proposalType == 8)
            execVote(proposalIdx);*/

        if (prop.proposalType == 9)
            execAddMember(state, proposalIdx);
        if (prop.proposalType == 10)
            execTransferEth(state, proposalIdx);
        if (prop.proposalType == 11)
            execTransferToken(state, proposalIdx);
        if (prop.proposalType == 12)
            execSetMigrationStatus(state, proposalIdx);
        
    }

    // ********** 1. ChangeAutoApprovalDuration ********************
    function execChangeAutoApprovalDuration(LibDAO_State.state storage state, uint proposalIdx) {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            if (prop.data._bool1)
                //if daoOveride set then adjust the DAO global auto approve duration
                state.autoApproveDurationOveride = prop.data._uint2; 
            else
                //if daoOveride is not set then adjust for specific member
                state.members[prop.data._uint1].autoApprovalDuration = prop.data._uint2;
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeChangeAutoApprovalDuration(prop.targetDAO, prop.data._uint1, prop.data._uint2);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 1. ChangeAutoApprovalDuration ********************

    // ********** 2. ChangeMinAppovalQuorum ********************
    function execChangeMinAppovalQuorum(LibDAO_State.state storage state, uint proposalIdx) {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            state.members[prop.data._uint1].minMemberQuorumForApproval = prop.data._uint2;
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeChangeMinAppovalQuorum(prop.targetDAO, prop.data._uint1, prop.data._uint2);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 2. ChangeMinAppovalQuorum ********************

    // ********** 3. ChangeMinAppovalQuorum ********************
    function execChangeMinVetoQuorum(LibDAO_State.state storage state, uint proposalIdx) {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            state.members[prop.data._uint1].minMemberQuorumForVeto = prop.data._uint2;
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeChangeMinVetoQuorum(prop.targetDAO, prop.data._uint1, prop.data._uint2);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 3. ChangeMinVetoQuorum ********************

    // ********** 4.  ********************
    // ********** FINISH 4.  ********************

    // ********** 5. ChangeMemberStatus ********************
    function execChangeMemberStatus(LibDAO_State.state storage state, uint proposalIdx) internal {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            state.members[prop.data._uint1].active = prop.data._bool1;
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeChangeMemberStatus(prop.targetDAO, prop.data._uint1, prop.data._bool1);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 5. ChangeMemberStatus ********************

    // ********** 6. ModifyCompulsaryApprover ********************
    function execModifyCompulsoryApprover(LibDAO_State.state storage state, uint proposalIdx) {
        
        uint targetMemberIdx = state.proposals[proposalIdx].data._uint1;
        uint approver = state.proposals[proposalIdx].data._uint2;
        bool removeOrAdd = state.proposals[proposalIdx].data._bool1;

        bool bFound;
        bool bFoundFreeIdx = false;
        uint firstFreeIdx = 0;
        uint existingApprover = 0;

        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        LibDAO_State.Member member = state.members[targetMemberIdx];

        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            for (uint a=0;a<member.compulsoryApprovers.length;a++) {

                existingApprover = member.compulsoryApprovers[a];

                //if we find a approver == 0 then remember it as a free slot and skip to next approver
                if (!bFoundFreeIdx && existingApprover == 0) {
                    firstFreeIdx = a;
                    bFoundFreeIdx = true;
                    continue;
                }

                //if we find the approver
                if (existingApprover == approver) {
                    bFound = true;
                    if (!removeOrAdd) 
                        member.compulsoryApprovers[a] = 0;
                    break;
                }
            }

            if (removeOrAdd && !bFound) {
                if (!bFoundFreeIdx) {
                    member.compulsoryApprovers.push(approver);
                }
                else {
                    member.compulsoryApprovers[firstFreeIdx] = approver;
                }
            }
        }
        else {
            HierarchicalDAO_iface(state.parentDAO).proposeModifyCompulsoryApprover(prop.targetDAO, targetMemberIdx, approver, removeOrAdd);
        } 

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);       
    }
    // ********** 6. FINISH ModifyCompulsaryApprover ********************



    // ********** 7. JoinParentDAO ********************
    function execJoinParentDAO(LibDAO_State.state storage state, uint proposalIdx) internal {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            state.parentDAO = prop.data._address1; 
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeJoinParentDAO(prop.targetDAO, prop.data._address1);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 7. JoinParentDAO ********************



    // ********** FINISH 8. Vote ********************
    function execVote(LibDAO_State.state storage state, uint proposalIdx) {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            if (prop.data._bool1)
                LibDAO_Proposal.voteForProposal(state, proposalIdx, prop.proposedBy);
            else
                LibDAO_Proposal.voteAgainstProposal(state, proposalIdx, prop.proposedBy);
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeVote(prop.targetDAO, prop.data._uint1, prop.data._bool1);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 8. Vote ********************

    // ********** 9. AddMember ********************
    function execAddMember(LibDAO_State.state storage state, uint proposalIdx) internal {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me) {
            uint newMemberIdx = LibDAO_Member.createNewMember(state);
            state.members[newMemberIdx].account = prop.data._address1; 
            state.members[newMemberIdx].active = prop.data._bool1;
        }
        else
            HierarchicalDAO_iface(state.parentDAO).proposeAddMember(prop.targetDAO, prop.data._address1);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 9. AddMember ********************
    
    // ********** 10. TransferEth ********************
    function execTransferEth(LibDAO_State.state storage state, uint proposalIdx) internal { 

        //firstly, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);

        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;

        //either send the eth, or create the proposal to the parentDAO
        if (prop.targetDAO == 0x0 || prop.targetDAO == me)
            bool result = prop.data._address1.send(prop.data._uint1); 
        else
            HierarchicalDAO_iface(state.parentDAO).proposeTransferEth(prop.targetDAO, prop.data._address1, prop.data._uint1);
    }
    // ********** FINISH 10. TransferEth ********************

    // ********** 11. TransferToken ********************
    function execTransferToken(LibDAO_State.state storage state, uint proposalIdx) internal {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me)
            ERC20_iface(prop.data._address1).transfer(prop.data._address2, prop.data._uint1); 
        else
            HierarchicalDAO_iface(state.parentDAO).proposeTransferToken(prop.targetDAO, prop.data._address1, prop.data._address2, prop.data._uint1);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 11. TransferToken ********************


    // ********** 12. SetMigrateStatus ********************
    function execSetMigrationStatus(LibDAO_State.state storage state, uint proposalIdx) internal {
        //we have already checked proposal is approved in caller
        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        address me = this;
        if (prop.targetDAO == 0x0 || prop.targetDAO == me)
            MigratableContract_iface(prop.data._address1).setMigrationStatus(prop.data._uint1, prop.data._address2); 
        else
            HierarchicalDAO_iface(state.parentDAO).proposeSetMigrationStatus(prop.targetDAO, prop.data._address1, prop.data._address2, prop.data._uint1);

        //finally, close the proposal
        LibDAO_Proposal.closeProposal(state, proposalIdx);
    }
    // ********** FINISH 12. SetMigrateStatus ********************
}