export async function load() {
  return {
    appName: process.env.APP_NAME || 'Deverse',
    enableSocialLogin: process.env.ENABLE_SOCIAL_LOGIN === 'true',
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    githubClientId: process.env.GITHUB_CLIENT_ID
  };
}