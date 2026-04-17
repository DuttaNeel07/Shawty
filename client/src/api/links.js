const headers = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getAllLinks = async (token) => {
  const res = await fetch('/api/links', { headers: headers(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch links');
  return data;
};

export const createLink = async (token, { slug, destination, expiresAt }) => {
  const res = await fetch('/api/links', {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({ slug, destination, expiresAt: expiresAt || null }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create link');
  return data;
};

export const deleteLink = async (token, id) => {
  const res = await fetch(`/api/links/${id}`, {
    method: 'DELETE',
    headers: headers(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete link');
  return data;
};

export const updateLink = async (token, id, updates) => {
  const res = await fetch(`/api/links/${id}`, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update link');
  return data;
};
