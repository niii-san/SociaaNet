import { isValidObjectId } from "mongoose";
import { ErrorCodes } from "../constants/error-code";
import { FollowUserDTO, UnfollowUserDTO } from "../dtos";
import { userRepo } from "../repositories";
import { HttpError } from "../utils";
import { socialsRepo } from "../repositories/socials.repository";

class SocialService {
    async followUser(dto: FollowUserDTO) {
        const followerId = dto.followerId;
        const followeeId = dto.followeeId;

        if (followerId === followeeId) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You cannot follow yourself"
            );
        }

        if (!isValidObjectId(followeeId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid followeeId"
            );
        }

        const followee = await userRepo.getUserById(followeeId);

        if (!followee) {
            throw new HttpError(
                404,
                false,
                ErrorCodes.NOT_FOUND,
                "Followee user not found"
            );
        }

        const alreadyFollows = await socialsRepo.isFollowing(
            followerId,
            followeeId
        );

        if (alreadyFollows) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.DUPLICATE,
                "You already follow this user"
            );
        }

        if (followee.is_private_account) {
            const isFollowRequestPending =
                await socialsRepo.isFollowRequestPending(
                    followerId,
                    followeeId
                );
            if (isFollowRequestPending) {
                throw new HttpError(
                    400,
                    false,
                    ErrorCodes.DUPLICATE,
                    "Follow request already sent and pending"
                );
            }

            const followRequest = await socialsRepo.createFollowRequest(
                followerId,
                followeeId
            );

            return {
                followerId: followRequest.follower.toString(),
                followeeId: followRequest.following.toString(),
                is_follow_request: true
            };
        } else {
            const result = await socialsRepo.followUser(followerId, followeeId);

            return {
                followerId: result.follower.toString(),
                followeeId: result.following.toString(),
                is_follow_request: false
            };
        }
    }

    async unfollowUser(dto: UnfollowUserDTO) {
        const followerId = dto.followerId;
        const followeeId = dto.followeeId;

        if (followerId === followeeId) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You cannot unfollow yourself"
            );
        }

        if (!isValidObjectId(followeeId)) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "Invalid followeeId"
            );
        }

        const isFollowing = await socialsRepo.isFollowing(
            followerId,
            followeeId
        );

        if (!isFollowing) {
            throw new HttpError(
                400,
                false,
                ErrorCodes.INVALID_INPUT,
                "You do not follow this user"
            );
        }

        const unfollow = await socialsRepo.unfollowUser(followerId, followeeId);

        return unfollow;
    }

    async getFollowers(userId: string) {
        const followers = await socialsRepo.getAllFollowers(userId);
        return followers;
    }
    async getFollowings(userId: string) {
        const followings = await socialsRepo.getAllFollowings(userId);
        return followings;
    }

    async getFollowingRequests(userId:string) {
        const followingRequests = await socialsRepo.getFollowingRequests(userId);
        return followingRequests;
    }

    async getFollowRequests() {
        throw new Error("Not implemented yet - Service Layer");
    }

    async acceptFollowRequest() {
        throw new Error("Not implemented yet - Service Layer");
    }
}

export const socialService = new SocialService();
