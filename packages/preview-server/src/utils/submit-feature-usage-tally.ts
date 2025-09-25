export function submitFeatureUsageTally(
  feature:
    | 'toolbar'
    | 'compatibility checking'
    | 'spam checking'
    | 'image/link checking'
    | 'sending test email',
) {
  fetch('http://localhost:3001/api/metrics/feature-usage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feature }),
  }).catch(() => { });
}
