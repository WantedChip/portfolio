---
# TOOL ENTRY — strict schema, validated against lib/schemas.ts::toolSchema

title: ""                  # string, required. e.g. "MCP Gateway"
slug: ""                   # string, required. URL-safe, unique. e.g. "mcp-gateway"
category: ""                # string, required. e.g. "MCP Infrastructure", "Testing & QA", "Developer Tooling"

lifecycleStage: in-drift    # required. One of: in-drift | nebula | forming | active | remnant
                            # same five-stage vocabulary as projects — do not invent new statuses here

summary: ""                 # string, required, max 200 chars

techStack:                  # array of strings, required (empty array [] allowed)
  - ""

links:                      # optional object — omit if none yet
  repo: ""
  live: ""

tags:                       # array of strings, defaults to []
  - ""
---

Full markdown body — what the tool does, why you built it, what problem it solves,
current state beyond the badge.
