import { singleton, inject } from "tsyringe";
import type { IUserRepository } from "../repositories/user.repository.js";
import type { ICognitoService } from "./cognito.service.js";
import type { CognitoUser, CognitoAuthResult } from "./cognito.service.js";
import { User, NewUser } from "@conduit/data";

export interface IUserService {
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(userData: NewUser): Promise<User>;
  updateUser(id: number, userData: Partial<NewUser>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  registerUser(username: string, email: string, password: string): Promise<{ user: User; cognitoUser: CognitoUser }>;
  loginUser(email: string, password: string): Promise<{ user: User; authResult: CognitoAuthResult }>;
  syncUserFromCognito(cognitoUser: CognitoUser): Promise<User>;
}

@singleton()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("ICognitoService") private cognitoService: ICognitoService
  ) {}

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async createUser(userData: NewUser): Promise<User> {
    return this.userRepository.create(userData);
  }

  async updateUser(id: number, userData: Partial<NewUser>): Promise<User | null> {
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async registerUser(username: string, email: string, password: string): Promise<{ user: User; cognitoUser: CognitoUser }> {
    // Create user in Cognito first
    const cognitoUser = await this.cognitoService.registerUser(username, email, password);

    // Create local user record
    const user = await this.userRepository.create({
      username,
      email,
      password: '', // We don't store passwords locally when using Cognito
      bio: null,
      image: null
    });

    return { user, cognitoUser };
  }

  async loginUser(email: string, password: string): Promise<{ user: User; authResult: CognitoAuthResult }> {
    // Authenticate with Cognito
    const authResult = await this.cognitoService.loginUser(email, password);

    // Get or sync local user record
    let user = await this.getUserByEmail(email);
    if (!user) {
      user = await this.syncUserFromCognito(authResult.user);
    }

    return { user, authResult };
  }

  async syncUserFromCognito(cognitoUser: CognitoUser): Promise<User> {
    let user = await this.getUserByEmail(cognitoUser.email);

    if (!user) {
      // Create new local user record
      user = await this.userRepository.create({
        username: cognitoUser.username,
        email: cognitoUser.email,
        password: '',
        bio: cognitoUser.bio || null,
        image: cognitoUser.image || null
      });
    } else {
      // Update existing user with Cognito data
      user = await this.userRepository.update(user.id, {
        username: cognitoUser.username,
        bio: cognitoUser.bio || null,
        image: cognitoUser.image || null
      });
    }

    if (!user) {
      throw new Error('Failed to sync user from Cognito');
    }

    return user;
  }
}