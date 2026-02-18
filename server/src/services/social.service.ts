import { FollowUserDTO, UnfollowUserDTO } from "../dtos";

class SocialService {
    async followUser(dto: FollowUserDTO) {
        throw new Error("Not implemented yet - Service Layer");
    }

    async getFollowers(userId: string) {
        throw new Error("Not implemented yet - Service Layer");
    }

    async getFollowing(userId: string) {
        throw new Error("Not implemented yet - Service Layer");
    }

    async unfollowUser(dto: UnfollowUserDTO) {
        throw new Error("Not implemented yet - Service Layer");
    }
    async requestFollow() {
        throw new Error("Not implemented yet - Service Layer");
    }

    async getFollowRequests() { }

    async acceptFollowRequest() {
        throw new Error("Not implemented yet - Service Layer");
    }
}

export const socialService = new SocialService();
