/**
 * The API reports field-level problems as `details: [{ field, message }]`.
 * Anything else (conflicts, auth failures, network) is a single message.
 */
export const fieldErrorsFrom = (error) =>
  error?.details?.length
    ? Object.fromEntries(error.details.map((detail) => [detail.field, detail.message]))
    : null;
