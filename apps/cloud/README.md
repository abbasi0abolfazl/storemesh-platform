# StoreMesh Cloud

Read-only cross-site aggregation and reporting service.

Sites publish versioned events through local transactional outboxes. Cloud availability never blocks local production.

## Site-key rotation

For a grace-period rotation, copy the old `<SITE>_SITE_KEY` to `<SITE>_PREVIOUS_SITE_KEY`, set `<SITE>_PREVIOUS_SITE_KEY_EXPIRES_AT` to an ISO-8601 expiry, install the new current key in `<SITE>_SITE_KEY`, and restart Cloud. Publishers still using the old key must send `X-Site-Key-Id: previous`; they are accepted only through the expiry. After all publishers use the new current key, remove both previous-key variables.
