# AI Work Guide

## Static

- Always edit this file in English.
- Always use English for text within the project.
- The README.md file can never be edited.
- Do not create any test files (for the time being).

- Style requirements should prioritize the capabilities provided by Tailwind CSS, and 
  only fall back to alternative implementations if necessary.
- When a call-site `className` exists mainly to cancel a `components/ui` base class
  (e.g. `h-auto` against `h-10`, `p-0` against `px-5`), sink that behavior into a
  component variant or size instead of repeating the override at every usage.
- Descriptions generated for changesets should be concise and brief.

- Before creating or changing UI, read DESIGN.md, treat it as the repository’s visual 
  source of truth, and preserve the existing typography, light/dark mode, spacing 
  rhythm, and Tailwind-first styling approach.

## Temporary

- From now on, only Iconify is permitted for use.