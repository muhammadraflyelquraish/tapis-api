export class FirebaseIdentity {
  identities: object;
  sign_in_provider: string;
}

export class FirebaseUserDto {
  name: string;
  iss: string;
  aud: string;
  auth_time: number;
  user_id: string;
  sub: string;
  iat: number;
  exp: number;
  email: string;
  email_verified: string;
  phone_number: string;
  firebase: FirebaseIdentity;
  uid: string;
}
