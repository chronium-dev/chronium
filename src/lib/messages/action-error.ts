export const ERROR_INVALID_SESSION = 'Invalid session';
export const ERROR_RATE_LIMIT_EXCEEDED = 'Rate limit exceeded';
export const ERROR_ORG_ALREADY_EXISTS = 'Organization already exists';
export const ERROR_TEMPLATE_ALREADY_EXISTS = 'A template with that name already exists.';
export const ERROR_AUDIENCE_ALREADY_EXISTS = 'Audience already exists';
export const ERROR_CAMPAIGN_ALREADY_EXISTS = 'Campaign already exists';
export const ERROR_EMAIL_ADDRESS_ALREADY_UNSUBSCRIBED =
  'The email address has already been unsubscribed so cannot be added or updated';

export class ActionError extends Error {}

export const DEFAULT_SERVER_ERROR_MESSAGE = 'Ratings Robot - Internal Server Error';
export const GENERIC_SOMETHING_WENT_WRONG_MESSAGE = 'Something went wrong, please try again.';
