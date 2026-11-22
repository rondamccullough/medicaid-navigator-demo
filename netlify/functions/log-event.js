// Clinic analytics is intentionally disabled in the public pilot preview.
// Re-enable only after authenticated clinic access, rate limiting, retention controls,
// and a documented clinic-approved data flow are implemented and reviewed.
exports.handler = async () => ({
  statusCode: 410,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify({
    ok: false,
    message: "Clinic reporting is not enabled in this preview."
  })
});
