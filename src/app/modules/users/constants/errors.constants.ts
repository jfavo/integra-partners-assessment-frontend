import { MAX_INPUT_LENGTH, MIN_NAME_LENGTH, MIN_USERNAME_LENGTH } from "./form.constants";

export const USERNAME_REQUIRED_ERROR_MESSAGE: string = 'Username is required.';
export const USERNAME_MIN_LENGTH_ERROR_MESSAGE: string = `Username needs to be at least ${MIN_USERNAME_LENGTH} characters long.`;
export const USERNAME_MAX_LENGTH_ERROR_MESSAGE: string = `Username can only be ${MAX_INPUT_LENGTH} characters long.`;
export const USERNAME_DUPLICATE_ERROR_MESSAGE: string = 'Username is already in use.'

export const EMAIL_REQUIRED_ERROR_MESSAGE: string = 'Email is required.'
export const EMAIL_INVALID_ERROR_MESSAGE: string = 'Email is not a valid email address.'
export const EMAIL_DUPLICATE_ERROR_MESSAGE: string = 'Email is already in use.'

export const FIRSTNAME_REQUIRED_ERROR_MESSAGE: string = 'First name is required.';
export const FIRSTNAME_MIN_LENGTH_ERROR_MESSAGE: string = `First name needs to be at least ${MIN_NAME_LENGTH} characters long.`;
export const FIRSTNAME_MAX_LENGTH_ERROR_MESSAGE: string = `First name can only be ${MAX_INPUT_LENGTH} characters long.`;

export const LASTNAME_REQUIRED_ERROR_MESSAGE: string = 'Last name is required.';
export const LASTNAME_MIN_LENGTH_ERROR_MESSAGE: string = `Last name needs to be at least ${MIN_NAME_LENGTH} characters long.`;
export const LASTNAME_MAX_LENGTH_ERROR_MESSAGE: string = `Last name can only be ${MAX_INPUT_LENGTH} characters long.`;

export const DEPARTMENT_MIN_LENGTH_ERROR_MESSAGE: string = `Department needs to be at least ${MIN_NAME_LENGTH} characters long.`;
export const DEPARTMENT_MAX_LENGTH_ERROR_MESSAGE: string = `Department can only be ${MAX_INPUT_LENGTH} characters long.`;

export const BACKEND_API_USERS_FAILED_MESSAGE: string = 'There was an unexpected error. Please try again later.';
export const BACKEND_API_USERS_FAILED_ACTION: string = 'Acknowledge';