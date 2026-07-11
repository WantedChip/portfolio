---
# PROJECT ENTRY — strict schema, validated against lib/schemas.ts::projectSchema
# Every field below is required unless marked optional. Do not add fields not in the schema
# without updating schemas.ts first — this file is not a suggestion, it's the contract.

title: ""                  # string, required. Display name, e.g. "FAIN"
slug: ""                   # string, required. URL-safe, e.g. "fain". Must be unique.
catalogNumber: ""          # string, required. e.g. "SOL-001". Manually assigned, sequential is fine.

lifecycleStage: in-drift   # required. One of: in-drift | nebula | forming | active | remnant
                           # in-drift = idea only, nothing built
                           # nebula   = concept defined, not started
                           # forming  = actively in development
                           # active   = shipped / live
                           # remnant  = archived / superseded

summary: ""                # string, required, max 200 chars. One-line description for orbit hover + list views.

techStack:                 # array of strings, required (can be empty array [] if not yet decided)
  - ""

links:                     # optional object — omit entirely if none exist yet
  repo: ""                 # optional, must be a valid URL if present
  live: ""                 # optional, must be a valid URL if present
  demo: ""                 # optional, must be a valid URL if present

startDate: ""              # string, required, ISO format: "2026-06-01"

featured: false             # boolean, required, defaults to false. true = rendered larger/brighter.

tags:                      # array of strings, defaults to []
  - ""

scale: 1                   # optional number, defaults to 1. Manual size multiplier for orbit rendering.
supersedes: ""             # optional string — slug of an earlier project this one replaces, if any
---

Full markdown body goes here. This is the content of the project detail page below the
frontmatter — write it like the actual project writeup: what it is, why it exists, what
you learned, current status in your own words (beyond the lifecycle badge).
