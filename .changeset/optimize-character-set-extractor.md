---
'introduction': patch
---

Optimize the poetry character-set extractor: skip font subsetting when the extracted character set is unchanged, cache the source font buffer across regenerations, and restrict Unicode escape decoding to source-code files.
