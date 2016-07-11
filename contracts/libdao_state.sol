library LibDAO_State  {

    struct state {
        address parentDAO;
        string version;
        uint autoApproveDurationOveride;
        
        Member[] members;
        Proposal[] proposals;        
    }

    struct Proposal {
        uint proposedBy;
        address targetDAO;
        ProposalGenericDataStruct data;
        uint startDate;
        bool isOpen;
        uint status; // 0 pending, 1 = vetoed, 2 = auto-approved, 3 = explicit approval 
        uint proposalType; //(1-12)
        uint[] approvals; //array of member indexes
        uint[] vetos; //array of member indexes
    }

    struct ProposalGenericDataStruct {
        address _address1;
        address _address2;
        uint _uint1;
        uint _uint2;
        bool _bool1;
    }

    struct Member {
        address account;
        uint minMemberQuorumForVeto;
        uint minMemberQuorumForApproval;
        uint autoApprovalDuration;
        uint[] compulsoryApprovers; // for this member, these compulsaryApprovers must explicitly approve a proposal before auto-approval can go ahead
        bool autoApprovalActive;
        bool active;
        bool disableFirstTryDone;
        uint nextProposalDelay;
        uint lastProposalActivity;
        //v2 uint simultaneousProposals;
        //v2 uint stake; //could be % or incrementing token count. Perhaps members can buy stake at a price (set by DAO)
    }

}