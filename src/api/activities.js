const API = import.meta.env.VITE_API ?? "https://fitnesstrac-kr.herokuapp.com/api";

async function parse(res) {
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg = data?.message || data?.error || `${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

/** Fetches an array of activities from the API. */
export async function getActivities() {
  try {
    const res = await fetch(`${API}/activities`);
    const data = await parse(res);
    return Array.isArray(data) ? data : data?.activities ?? [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function createActivity(token, activity) {
  if (!token) throw new Error("You must be signed in to create an activity.");
  const res = await fetch(`${API}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(activity),
  });
  return parse(res);
}

export async function deleteActivity(token, activityId) {
  if (!token) throw new Error("You must be signed in to delete an activity.");
  const res = await fetch(`${API}/activities/${activityId}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });
  return parse(res);
}
