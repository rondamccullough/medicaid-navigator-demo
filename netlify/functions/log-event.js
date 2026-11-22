// Zero-PHI analytics endpoint: accepts only a fixed set of non-identifying fields.
const EVENTS = new Set(['session_started', 'screen_view', 'language_change', 'exemptions_viewed', 'path_completed']);
const LANGS = new Set(['en', 'es', 'zh', 'ko', 'vi']);
const CLINICS = new Set(['chase-brexton', 'cci-health', 'total-health-care', 'choptank-health', 'bmsi']);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const d = JSON.parse(event.body || '{}');

    const clean = {
      date: /^\d{4}-\d{2}-\d{2}$/.test(d.date) ? d.date : new Date().toISOString().slice(0, 10),
      clinicId: CLINICS.has(d.clinicId) ? d.clinicId : null,
      eventName: EVENTS.has(d.eventName) ? d.eventName : null,
      pathway: /^[A-Za-z0-9_-]{1,40}$/.test(d.pathway) ? d.pathway : 'general',
      lang: LANGS.has(d.lang) ? d.lang : 'en'
    };
    if (!clean.clinicId || !clean.eventName) {
      return { statusCode: 400, body: 'Invalid payload' };
    }

    if (process.env.METRICS_WEBHOOK_URL) {
      await fetch(process.env.METRICS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clean)
      });
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 400, body: 'Invalid payload' };
  }
};
