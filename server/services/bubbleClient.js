/**
 * Fetch a single thing from Bubble Data API
 * GET https://APP_URL/api/1.1/obj/DATA_TYPE/ID
 */
async function fetchThing(appUrl, apiKey, dataType, id) {
  const base = appUrl.replace(/\/$/, '');
  const url = `${base}/api/1.1/obj/${encodeURIComponent(dataType)}/${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bubble API error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.response;
}

/**
 * Fetch meta/schema from Bubble API
 * GET https://DOMAIN/api/1.1/meta
 */
async function fetchMeta(domain, apiKey) {
  const base = (domain || '').replace(/\/$/, '');
  const url = `${base}/api/1.1/meta`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bubble API error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json;
}

module.exports = { fetchThing, fetchMeta };
