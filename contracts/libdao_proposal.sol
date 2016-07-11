import "./libdao_member.sol";
import "./libdao_state.sol";

library LibDAO_Proposal  {

    event ProposalVetoed(uint proposalIdx);
    event ProposalApproved(uint proposalIdx);
    event ProposalCreated(uint proposalIdx);

    function voteOnProposal(LibDAO_State.state storage state, uint proposalIdx, bool vote) {
        uint memberIdx = LibDAO_Member.getActiveMemberIdx(state, msg.sender);
        if (memberIdx == uint(-1)) return;

        if (vote) {
            voteForProposal(state, proposalIdx, memberIdx);
        }
        else {
            voteAgainstProposal(state, proposalIdx, memberIdx);
        }
    }

    function voteForProposal(LibDAO_State.state storage state, uint proposalIdx, uint memberIdx) {
        LibDAO_State.Proposal proposal = state.proposals[proposalIdx];

        if (!proposal.isOpen || proposal.status != 0)
            return;

        //dont add if already there
        for (uint i = 0; i < proposal.approvals.length; i++)
            if (proposal.approvals[i] == memberIdx) return;

        //add the member as an approver
        proposal.approvals.push(memberIdx);

        //check if the proposal has got approval 
        if (checkProposalApprovalStatus(state, proposalIdx)) {
            proposal.status = 2;
            state.members[proposal.proposedBy].lastProposalActivity = now;
            ProposalApproved(proposalIdx);
        }
    }

    function voteAgainstProposal(LibDAO_State.state storage state, uint proposalIdx, uint memberIdx) {

        LibDAO_State.Proposal proposal = state.proposals[proposalIdx];

        //check proposal is still active
        if (!proposal.isOpen || proposal.status != 0)
            return;

        //add the member as a veto'er
        proposal.vetos.push(memberIdx);

        //if enough vetos then cancel proposal
        if (proposal.vetos.length >= state.members[memberIdx].minMemberQuorumForVeto) {
            proposal.status = 1;
            proposal.isOpen = false;
            state.members[proposal.proposedBy].lastProposalActivity = now;
            ProposalVetoed(proposalIdx);
        }
    }

    function checkProposalApprovalStatus(LibDAO_State.state storage state, uint proposalIdx) internal returns (bool) {

        LibDAO_State.Proposal prop = state.proposals[proposalIdx];
        LibDAO_State.Member proposedByMember = state.members[prop.proposedBy];

        bool bFound = false;

        //log0(bytes32(proposedByMember.compulsoryApprovers.length));
        // have to use full state.members.[prop.proposedBy].compulsoryApprovers.length otherwise the values are all screwed up.
        // but if you do a log0(bytes32(proposedByMember.compulsoryApprovers.length)) beforehand then its all good! wierd.

        //check if proposal has satisfied all the compulsoryApprovers 
        //this can probably be optimized by removing compulsary approvers from the proposal as they approve 
        for (uint a = 0; a < state.members[prop.proposedBy].compulsoryApprovers.length; a++) {

            bFound = false;

            //if the approver is 0 (deleted) ignore it
            if (proposedByMember.compulsoryApprovers[a] == 0) {
                continue;
            }

            for (uint b=0;b<prop.approvals.length;b++) {
                if (state.members[prop.proposedBy].compulsoryApprovers[a] == prop.approvals[b]) {
                    bFound = true;
                    break;
                }
            }
            if (!bFound) {
                return false;
            }
        }

        //check if proposal has enough votes (minQuorum) to pass explicit approval
        if (state.members[prop.proposedBy].minMemberQuorumForApproval == 0) {
            if (prop.approvals.length == LibDAO_Member.getActiveMemberCount(state)) {
                return true;
            }
        }
        //we have to use the variable rather than state.members[prop.proposedBy]?? bug in solidity
        else {
            if (prop.approvals.length >= proposedByMember.minMemberQuorumForApproval) {
                return true;
            }
        }

        // CHECK FOR AUTO-APPROVAL (only if != 0)
        if (state.members[prop.proposedBy].autoApprovalDuration > 0) {
            //if we are below the min duration overide then do not approve
            if (state.autoApproveDurationOveride > 0 && prop.startDate + state.autoApproveDurationOveride > now)
                return false;

            //check if proposal has reached members auto approval duration
            if (prop.startDate + state.members[prop.proposedBy].autoApprovalDuration < now) 
                return true;
        }

        // We have to use state.members[prop.proposedBy].autoApprovalDuration rather than the proposedBy variable.. bug in solidity??

        return false;
    }

    function createNewProposal(LibDAO_State.state storage state, uint proposedBy, address targetDAO, uint proposalType) returns (uint) {
            
        uint newPropIdx = state.proposals.length++;
        state.proposals[newPropIdx].proposedBy = proposedBy;
        state.proposals[newPropIdx].targetDAO = targetDAO;
        state.proposals[newPropIdx].startDate = now;
        state.proposals[newPropIdx].proposalType = proposalType;
        state.proposals[newPropIdx].isOpen = true;
        state.proposals[newPropIdx].status = 0;
        state.proposals[newPropIdx].approvals.push(proposedBy);

        ProposalCreated(newPropIdx);

        return newPropIdx;
    }

    function closeProposal(LibDAO_State.state storage state, uint proposalIdx) {
        state.proposals[proposalIdx].isOpen = false;
        state.members[state.proposals[proposalIdx].proposedBy].lastProposalActivity = now;
    }

}