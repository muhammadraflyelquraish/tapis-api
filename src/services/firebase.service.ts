import * as firebaseCredential from 'firebase.json';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

import { CreateUserDto } from 'src/controllers/sso/sso.dto';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor() {}
  private auth: Auth;
  private app: App;

  onModuleInit() {
    /**
     * Firebase Config
     *
     */
    const firebaseConfig = {
      projectId: firebaseCredential.project_id,
      privateKey: firebaseCredential.private_key,
      clientEmail: firebaseCredential.client_email,
    };

    /**
     * Initialize Firebase
     *
     */
    this.app = initializeApp({ credential: cert(firebaseConfig) });

    /**
     * Use the getAuth() method to get the Auth instance
     *
     */
    this.auth = getAuth(this.app);
  }

  async verifyToken(token: string) {
    const decodedToken = await this.auth.verifyIdToken(token);
    return decodedToken;
  }

  async createUser(request: CreateUserDto) {
    const user = await this.auth.createUser({
      email: request.email,
      emailVerified: false,
      password: request.password,
      displayName: request.displayName,
      disabled: false,
    });
    return user;
  }

  async getUserById(uid: string) {
    const user = await this.auth.getUser(uid);
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.auth.getUserByEmail(email);
    return user;
  }
}
