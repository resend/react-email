---
'@react-email/editor': patch
---

Fix the container enforcer racing against collaborative (Yjs/Liveblocks) initial sync, which permanently added a spurious empty container to the shared doc on editor open. In collaborative mode the enforcer no longer wraps synchronously from `appendTransaction`; it wraps only after the document settles containerless following a real doc change, never wraps the bare empty placeholder doc, ignores no-op sync transactions, and defers while IME composition is active. An empty collaborative doc is wrapped after the first real edit. Paragraphs auto-inserted by the TrailingNode extension now carry an `autoTrailingNode` transaction meta so integrations can recognize machine-generated transactions.
