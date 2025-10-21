export const providerGuides = {
  stripe: {
    apiKeyLabel: 'Secret API Key',
    apiKeyPlaceholder: 'sk_live_... or sk_test_...',
    apiKeyInstructions:
      'Find your API keys in the Stripe Dashboard under Developers > API keys',
    webhookSecretLabel: 'Webhook Signing Secret',
    webhookSecretPlaceholder: 'whsec_...',
    webhookSecretInstructions:
      'Create a webhook endpoint and copy the signing secret from Stripe Dashboard',
    docsUrl: 'https://stripe.com/docs/keys',
    webhookDocsUrl: 'https://stripe.com/docs/webhooks',
  },
  paddle: {
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'Enter your Paddle API key',
    apiKeyInstructions:
      'Generate an API key in Paddle Dashboard under Developer Tools > Authentication',
    webhookSecretLabel: 'Webhook Secret',
    webhookSecretPlaceholder: 'Enter your webhook secret',
    webhookSecretInstructions:
      'Find your webhook secret in Paddle Dashboard under Notifications > Webhooks',
    docsUrl: 'https://developer.paddle.com/api-reference/authentication',
    webhookDocsUrl: 'https://developer.paddle.com/webhooks/overview',
  },
  paypal: {
    apiKeyLabel: 'Client ID',
    apiKeyPlaceholder: 'Enter your PayPal Client ID',
    apiKeyInstructions:
      'Get your Client ID from PayPal Developer Dashboard under My Apps & Credentials',
    webhookSecretLabel: 'Webhook ID',
    webhookSecretPlaceholder: 'Enter your webhook ID',
    webhookSecretInstructions:
      'Create a webhook and copy the webhook ID from PayPal Dashboard',
    docsUrl: 'https://developer.paypal.com/api/rest/',
    webhookDocsUrl: 'https://developer.paypal.com/docs/api-basics/notifications/webhooks/',
  },
  lemon_squeezy: {
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'Enter your Lemon Squeezy API key',
    apiKeyInstructions:
      'Create an API key in Lemon Squeezy Dashboard under Settings > API',
    webhookSecretLabel: 'Webhook Secret',
    webhookSecretPlaceholder: 'Enter your webhook secret',
    webhookSecretInstructions:
      'Copy the webhook secret from Lemon Squeezy Dashboard after creating a webhook',
    docsUrl: 'https://docs.lemonsqueezy.com/api',
    webhookDocsUrl: 'https://docs.lemonsqueezy.com/api/webhooks',
  },
  square: {
    apiKeyLabel: 'Access Token',
    apiKeyPlaceholder: 'Enter your Square access token',
    apiKeyInstructions:
      'Generate an access token in Square Developer Dashboard',
    webhookSecretLabel: 'Webhook Signature Key',
    webhookSecretPlaceholder: 'Enter your webhook signature key',
    webhookSecretInstructions:
      'Find your signature key in Square Dashboard under Webhooks settings',
    docsUrl: 'https://developer.squareup.com/docs/build-basics/access-tokens',
    webhookDocsUrl: 'https://developer.squareup.com/docs/webhooks/overview',
  },
}

export type ProviderGuideKey = keyof typeof providerGuides

export function getProviderGuide(providerType: string) {
  return providerGuides[providerType as ProviderGuideKey]
}
