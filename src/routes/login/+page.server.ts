import { env as privateEnv } from '$env/dynamic/private';

export async function load() {
  return {
    appName: process.env.APP_NAME || 'Deverse',
    enableSocialLogin: privateEnv.ENABLE_SOCIAL_LOGIN === 'true',
    googleClientId: privateEnv.GOOGLE_CLIENT_ID,
    githubClientId: privateEnv.GITHUB_CLIENT_ID
  };
}