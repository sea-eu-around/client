import {PaginatedState} from "../state/types";

export type Group = {
    id: string;
    name: string;
    description: string;
    visible: boolean;
    requireApproval: boolean;
    members: [] | null;
    membersPagination: PaginatedState;
};
