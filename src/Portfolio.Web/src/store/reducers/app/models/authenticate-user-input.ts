export class AuthenticateUserInput {
  googleToken: string;

  static buildFromGoogleUser(
    googleToken: string,
  ): AuthenticateUserInput {
    return {
      googleToken: googleToken,
    };
  }
}
