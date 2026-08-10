# Archived banking article versions (2026-08-10)

## What happened

WordPress had **two** Casino banking posts:

| WP ID | Slug | Status |
|-------|------|--------|
| **#25** | `casino-banking-withdrawal-at-100cuci-casino-malaysia-guide` | **Kept** — canonical banking article |
| **#23** | `banking-withdrawal-at-100cuci-casino-malaysia-guide` | **Trashed** — duplicate topic |

Auto-push mapped **both IDs** to the same HTML file (`02-100cuci-casino-banking-withdrawal.html`), so two URLs showed nearly identical text.

## Where did the “original” content go?

Nothing was permanently deleted until cleanup:

1. **Jul 28 originals** — recovered from WordPress **Revisions** (before bulk push).
2. **Jul 29+ live version** — the incremental SEO update in `articles/02-100cuci-casino-banking-withdrawal.html`, still on **#25**.

## Files here

| File | Meaning |
|------|---------|
| `banking-wp25-jul28-before-incremental.html` | #25 first published version (Jul 28) |
| `banking-wp23-jul28-trashed.html` | #23 first version (same topic, trashed post) |
| `banking-wp25-current-incremental.html` | Copy of current push source (what #25 uses now) |

To restore Jul 28 wording on #25: WP → Posts → edit #25 → **Browse revisions** → pick Jul 28, or paste from `banking-wp25-jul28-before-incremental.html`.

## Rule going forward

**One topic = one WP post ID = one slug = one HTML file in wp-post-map.json.**
