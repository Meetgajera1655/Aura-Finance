import {
  Profile as GoogleProfile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { getUserByEmail, createUser, getAccountByProviderId, createAccount } from './data';
import { Profile as GithubProfile } from 'passport-github2';
import { logger } from '../utils/logger';

export const LoginWithGoogle = async (
  profile: GoogleProfile,
  done: VerifyCallback
) => {
  try {
    const { email, sub } = profile._json;

    if (!email) {
      return done(new Error('No email found in the Google profile'), false);
    }

    const existingUser = await getUserByEmail(email);

    let user;

    if (existingUser) {
      user = existingUser;
    } else {
      user = await createUser({
        username: profile.displayName,
        email,
        emailVerified: new Date().toISOString(),
      });
    }

    const existingAccount = await getAccountByProviderId(sub);

    if (!existingAccount) {
      await createAccount({
        userId: user.id,
        provider: profile.provider,
        providerAccountId: sub,
      });
    }

    done(null, user);
  } catch (err) {
    logger.error('Error during Google login:', err);
    done(err, false);
  }
};

export const LoginWithGithub = async (
  profile: GithubProfile,
  done: VerifyCallback
) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email found in the GitHub profile'), false);
    }

    const existingUser = await getUserByEmail(email);

    let user;

    if (existingUser) {
      user = existingUser;
    } else {
      user = await createUser({
        username: profile.displayName,
        email,
        emailVerified: new Date().toISOString(),
      });
    }

    const existingAccount = await getAccountByProviderId(profile.id);

    if (!existingAccount) {
      await createAccount({
        userId: user.id,
        provider: profile.provider,
        providerAccountId: profile.id,
      });
    }
    done(null, user);
  } catch (err) {
    logger.error('Error during GitHub login:', err);
    done(err, false);
  }
};
