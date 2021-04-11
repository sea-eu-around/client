import {GroupPost, PostComment} from "../../model/groups";
import {GroupsState} from "../types";

export function findPost(state: GroupsState, groupId: string, postId: string): GroupPost | undefined {
    const {groupsDict, postsFeed} = state;

    // Try to get the post from storage (from its group or from the feed)
    return groupsDict[groupId].posts[postId] || postsFeed[postId];
}

export function findComment(
    state: GroupsState,
    groupId: string,
    postId: string,
    commentId: string,
): PostComment | undefined {
    const post = findPost(state, groupId, postId);
    const comment = post?.comments[commentId];
    return comment;
}
