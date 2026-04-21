export function mapErrorToHebrew(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.toLowerCase();

  if (message.includes("authentication") || message.includes("session expired")) {
    return "פג תוקף ההתחברות. כדאי להיכנס שוב למערכת.";
  }

  if (message.includes("validation failed")) {
    return "יש כמה שדות שדורשים תיקון לפני שאפשר לשמור.";
  }

  if (message.includes("patient is required")) {
    return "צריך לבחור מטופל לפני השמירה.";
  }

  if (message.includes("contact is required")) {
    return "צריך לבחור איש קשר.";
  }

  if (message.includes("unique constraint") || message.includes("already")) {
    return "הקישור הזה כבר קיים במערכת.";
  }

  if (message.includes("date is required")) {
    return "צריך לבחור תאריך.";
  }

  if (message.includes("start time is required")) {
    return "צריך להזין שעת התחלה.";
  }

  if (message.includes("duration")) {
    return "משך המפגש צריך להיות מספר חיובי.";
  }

  if (message.includes("full name is required")) {
    return "צריך להזין שם מלא.";
  }

  if (message.includes("date of birth is required")) {
    return "צריך לבחור תאריך לידה.";
  }

  return error.message || fallback;
}
