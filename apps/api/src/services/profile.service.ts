import { singleton, inject } from "tsyringe";
import type { IUserRepository } from "../repositories/user.repository.js";
import type { IFollowRepository } from "../repositories/follow.repository.js";
import { User } from "@conduit/data";
import { getAvatarUrl } from "../utils/avatar.js";

export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

export interface IProfileService {
  getProfile(username: string, currentUserId?: number): Promise<Profile | null>;
  followUser(followerId: number, username: string): Promise<Profile | null>;
  unfollowUser(followerId: number, username: string): Promise<Profile | null>;
}

@singleton()
export class ProfileService implements IProfileService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IFollowRepository") private followRepository: IFollowRepository
  ) {}

  async getProfile(username: string, currentUserId?: number): Promise<Profile | null> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    let following = false;
    if (currentUserId) {
      following = await this.followRepository.isFollowing(currentUserId, user.id);
    }

    return {
      username: user.username,
      bio: user.bio,
      image: await getAvatarUrl(user.image),
      following
    };
  }

  async followUser(followerId: number, username: string): Promise<Profile | null> {
    const userToFollow = await this.userRepository.findByUsername(username);

    if (!userToFollow) {
      return null;
    }

    if (followerId === userToFollow.id) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await this.followRepository.isFollowing(followerId, userToFollow.id);
    if (!existingFollow) {
      await this.followRepository.createFollow(followerId, userToFollow.id);
    }

    return {
      username: userToFollow.username,
      bio: userToFollow.bio,
      image: await getAvatarUrl(userToFollow.image),
      following: true
    };
  }

  async unfollowUser(followerId: number, username: string): Promise<Profile | null> {
    const userToUnfollow = await this.userRepository.findByUsername(username);

    if (!userToUnfollow) {
      return null;
    }

    await this.followRepository.deleteFollow(followerId, userToUnfollow.id);

    return {
      username: userToUnfollow.username,
      bio: userToUnfollow.bio,
      image: await getAvatarUrl(userToUnfollow.image),
      following: false
    };
  }
}