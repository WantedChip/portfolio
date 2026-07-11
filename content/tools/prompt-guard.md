---
title: "PromptGuard Sanitizer"
slug: "prompt-guard"
category: "Security & QA"
lifecycleStage: "forming"
summary: "Input validation and injection defense pipeline for agentic LLM integrations."
techStack: ["Rust", "Wasm", "Python binding"]
links:
  repo: "https://github.com/soham/prompt-guard"
tags: ["security", "injection", "agentic-safety"]
---

# PromptGuard Sanitizer

Currently in active development (Forming phase). 

PromptGuard is designed to inspect raw inputs for prompt injection payloads, system instruction override patterns, and PII leakage before data is routed to agent cycles. Written in Rust for speed and compiled to WebAssembly for execution in edge environments.
