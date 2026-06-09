import { PassportStatic } from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback,
} from 'passport-google-oauth20';
import {
  Strategy as GithubStrategy,
  Profile as GithubProfile,
} from 'passport-github2';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import { config } from 'dotenv';
import { LoginWithGithub, LoginWithGoogle } from '../helpers/socialLogin';
import { getUserById } from '../helpers/data';

config();

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_JWT_SECRET || 'fallback_insecure_secret',
};

if (!process.env.ACCESS_JWT_SECRET) {
  console.warn('⚠️ WARNING: ACCESS_JWT_SECRET is not set. Using insecure fallback secret. Please set this in your environment variables.');
}

const JWTProvider = new JwtStrategy(options, async (jwt_payload, done) => {
  try {
    const user = await getUserById(jwt_payload.id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

export default (passport: PassportStatic) => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const GoogleProvider = new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done
      ) {
        await LoginWithGoogle(profile, done);
      }
    );
    passport.use(GoogleProvider);
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    const GithubProvider = new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL as string,
        scope: ['user:email', 'user:profile'],
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: GithubProfile,
        done: VerifyCallback
      ) {
        await LoginWithGithub(profile, done);
      }
    );
    passport.use(GithubProvider);
  }

  passport.use(JWTProvider);
};
