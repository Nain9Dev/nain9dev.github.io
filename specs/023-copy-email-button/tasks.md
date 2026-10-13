# Tasks: Copy email button copies the contact address

- [x] **T01** `[A]` Copy the address from data attributes on the button.
  - **Covers**: MAIL-005, MAIL-006
  - **Done when**: `scripts/copy-email.test.mjs` fails before the change and passes after it.
  - **Result**: both tests red before, green after; `scripts/contact-email.test.mjs` still passes.
- [ ] **T02** `[A]` Verify in production after deploy.
  - **Done when**: production home HTML has no `__cf_email__` markup and the button copies the address in a browser.
