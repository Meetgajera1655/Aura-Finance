import { rtdb } from '../config/firebase';

export const getUserByEmail = async (email: string) => {
  const usersRef = rtdb.ref('users');
  const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
  if (!snapshot.exists()) return null;
  const users = snapshot.val();
  const userId = Object.keys(users)[0];
  return { id: userId, ...users[userId] };
};

export const getUserById = async (id: string) => {
  const snapshot = await rtdb.ref(`users/${id}`).once('value');
  if (!snapshot.exists()) return null;
  return { id, ...snapshot.val() };
};

export const createUser = async (data: any) => {
  const usersRef = rtdb.ref('users');
  const newUserRef = usersRef.push();
  await newUserRef.set(data);
  return { id: newUserRef.key, ...data };
};

export const saveEmailVerificationToken = async (userId: string, token: string) => {
  const tokensRef = rtdb.ref('emailVerificationTokens');
  const newTokenRef = tokensRef.push();
  const data = {
    userId,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
  await newTokenRef.set(data);
  return { id: newTokenRef.key, ...data };
};

export const verifyEmailToken = async (token: string) => {
  const tokensRef = rtdb.ref('emailVerificationTokens');
  const snapshot = await tokensRef.orderByChild('token').equalTo(token).once('value');
  if (!snapshot.exists()) return null;
  
  const tokens = snapshot.val();
  const tokenId = Object.keys(tokens)[0];
  const tokenData = tokens[tokenId];
  
  if (new Date(tokenData.expiresAt) < new Date()) {
    return null;
  }
  
  const userSnapshot = await rtdb.ref(`users/${tokenData.userId}`).once('value');
  if (!userSnapshot.exists()) return null;
  
  await rtdb.ref(`users/${tokenData.userId}`).update({
    emailVerified: new Date().toISOString()
  });
  
  await rtdb.ref(`emailVerificationTokens/${tokenId}`).remove();
  
  return { id: tokenData.userId, ...userSnapshot.val() };
};
