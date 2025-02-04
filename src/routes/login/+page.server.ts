import { GOOGLE_CLIENT_ID, GITHUB_CLIENT_ID } from '$env/static/private';
import { ENABLE_SOCIAL_LOGIN } from '$env/dynamic/private';

export async function load() {
  return {
    appName: process.env.APP_NAME || 'Deverse',
    enableSocialLogin: ENABLE_SOCIAL_LOGIN === 'true',
    googleClientId: GOOGLE_CLIENT_ID,
    githubClientId: GITHUB_CLIENT_ID
  };
}