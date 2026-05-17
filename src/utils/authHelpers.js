export const formatZodErrors = validationResult => {
  const formattedErrors = {};

  validationResult.error.issues.forEach(issue => {
    formattedErrors[issue.path[0]] = issue.message;
  });

  return formattedErrors;
};

export const getAuthErrorMessage = error => {
  const message = String(error?.message || '').trim();
  const normalized = message.toLowerCase();

  if (!message) {
    return 'Something went wrong. Please try again.';
  }

  if (normalized.includes('invalid login credentials')) {
    return 'Email or password is incorrect.';
  }

  if (normalized.includes('email not confirmed')) {
    return 'Please verify your email before logging in.';
  }

  if (normalized.includes('otp') || normalized.includes('token')) {
    return 'The code is invalid or has expired.';
  }

  if (normalized.includes('already registered') || normalized.includes('already exists')) {
    return 'An account already exists for this email.';
  }

  if (normalized.includes('rate limit') || normalized.includes('security purposes')) {
    return 'Please wait a moment before trying again.';
  }

  return message;
};
