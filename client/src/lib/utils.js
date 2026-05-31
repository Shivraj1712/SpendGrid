import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function handleApiError(err, defaultMsg = "An error occurred") {
  if (!err.response) {
    return "Network Error: Unable to connect to the server. Please check your internet connection.";
  }
  const { status, data } = err.response;
  if (status >= 500) {
    return `Server Error: An internal server error occurred (${status}). Please try again later.`;
  }
  return data?.message || defaultMsg;
}
