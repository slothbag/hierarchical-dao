import "./libdao_state.sol";
import "./libdao_member.sol";
import "./libdao_proposal.sol";
import "./libdao_proposals.sol";

contract HierarchicalDAO {

    LibDAO_State.state state;

    function HierarchicalDAO() {
        LibDAO_Member.init(state);
        state.version = "1.0.2";
    }

    function passThrough(uint proposalType,
        address _address1, address _address2, address _address3,
        uint _uint1, uint _uint2,
        bool _bool1
    ) private {
        LibDAO_Proposals.passThrough(state, proposalType, _address1, _address2, _address3, _uint1, _uint2, _bool1);
    }

    //this can stay, LibDAO_Proposal only refered to once
    function voteOnProposal(uint proposalIdx, bool vote) {
        LibDAO_Proposal.voteOnProposal(state, proposalIdx, vote);
    }

    function execProposal(uint proposalIdx) {
        //proposalId == 0 for execProposal
        passThrough(0, 0x0, 0x0, 0x0, proposalIdx, 0, false);
        //LibDAO_Proposals.execProposal(state, proposalIdx);
    }

    // Start of proposal functions located in LibDAO_Proposals.sol
    function proposeChangeAutoApprovalDuration(address targetDAO, uint member, uint newTimeInSeconds, bool daoOveride) {
        passThrough(1, targetDAO, 0x0, 0x0, member, newTimeInSeconds, daoOveride);
        //LibDAO_Proposals.proposeChangeVoteDuration(state, targetDAO, member, newTimeInSeconds);
    }

    function proposeChangeMinAppovalQuorum(address targetDAO, uint member, uint newQuorum) {
        passThrough(2, targetDAO, 0x0, 0x0, member, newQuorum, false);
        //LibDAO_Proposals.proposeChangeMinAppovalQuorum(state, targetDAO, member, newQuorum);
    }

    function proposeChangeMinVetoQuorum(address targetDAO, uint member, uint newQuorum) {
        passThrough(3, targetDAO, 0x0, 0x0, member, newQuorum, false);
        //LibDAO_Proposals.proposeChangeMinVetoQuorum(state, targetDAO, member, newQuorum);
    }

    //proposal 4 is free to be used

    function proposeChangeMemberStatus(address targetDAO, uint member, bool value) {
        passThrough(5, targetDAO, 0x0, 0x0, member, 0, value);
        //LibDAO_Proposals.proposeChangeMemberStatus(state, targetDAO, member, value);
    }

    function proposeModifyCompulsoryApprover(address targetDAO, uint member, uint approver, bool removeOrAdd) {
        passThrough(6, targetDAO, 0x0, 0x0, member, approver, removeOrAdd);
        //LibDAO_Proposals.proposeModifyCompulsoryApprover(state, targetDAO, member, approver, removeOrAdd);
    }

    function proposeJoinParentDAO(address targetDAO, address parentDAO) {
        passThrough(7, targetDAO, parentDAO, 0x0, 0, 0, false);
        //LibDAO_Proposals.proposeJoinParentDAO(state, targetDAO, parentDAO);
    }

    function proposeVote(address targetDAO, uint proposalIdx, bool vetoOrApproval) {
        passThrough(8, targetDAO, 0x0, 0x0, proposalIdx, 0, vetoOrApproval);
        //LibDAO_Proposals.proposeVote(state, targetDAO, proposalIdx, vetoOrApproval);
    } 

    function proposeAddMember(address targetDAO, address newMember, bool isActive) {
        passThrough(9, targetDAO, newMember, 0x0, 0, 0, isActive);
        //LibDAO_Proposals.proposeAddMember(state, targetDAO, newMember);
    }

    function proposeTransferEth(address targetDAO, address recipient, uint amount) {
        passThrough(10, targetDAO, recipient, 0x0, amount, 0, false);
        //LibDAO_Proposals.proposeTransferEth(state, targetDAO, recipient, amount);
    }

    function proposeTransferToken(address targetDAO, address targetToken, address recipient, uint amount) {
        passThrough(11, targetDAO, targetToken, recipient, amount, 0, false);
        //LibDAO_Proposals.proposeTransferToken(state, targetDAO, token, recipient, amount);
    }

    function proposeSetMigrationStatus(address targetDAO, address targetContract, address newContract, uint migrationStatus) {
        passThrough(12, targetDAO, targetContract, newContract, migrationStatus, 0, false);
    }
}
