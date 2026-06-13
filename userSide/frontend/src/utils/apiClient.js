/** Parse JSON from fetch; surface clear errors when the server is unreachable */
export async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return { success: false, message: response.ok ? 'Empty response' : response.statusText };
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      response.ok
        ? 'Invalid response from server'
        : `Server error (${response.status}). Is the backend running?`
    );
  }
}
