---
'introduction': patch
---

changed: Rework the avatar menu into icon-only actions (vertical on mobile, horizontal on larger screens) with a balanced power-style sign-out icon.
changed: Simplify the profile setup page by removing the card wrapper and intro texts, with content centered directly.
changed: Drop the auth page card wrapper and intro texts, left-aligning the form over the rain backdrop.
added: Stacked grayscale social login icons (Google, GitHub, QQ, WeChat) at the submit button's lower-left that restore brand colors on hover and toast an under-development notice.
added: Header sign-in entry for anonymous visitors in the account slot beside the theme toggle.
changed: Give Textarea content-driven height with no resizer, sharing the AI page's auto-resize hook.
fixed: Echo the saved profile photo in the header avatar instead of always showing initials.
removed: Drop the role tag from the profile page.
