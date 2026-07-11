---
title: "Kubernetes Diagnostics MCP Server"
slug: "k8s-mcp"
category: "MCP Infrastructure"
lifecycleStage: "active"
summary: "Model Context Protocol server for Kubernetes cluster debugging and runtime validation."
techStack: ["TypeScript", "Node.js", "Kubernetes Client", "MCP SDK"]
links:
  repo: "https://github.com/soham/k8s-mcp-server"
tags: ["kubernetes", "mcp", "devops", "diagnostics"]
---

# Kubernetes Diagnostics MCP Server

This tool is a Model Context Protocol (MCP) server that exposes diagnostic tools for Kubernetes clusters to AI agents. It allows LLMs to safely query Kubernetes runtime stats, view pod logs, inspect resource allocations, and diagnose configuration errors during a live coding session.

## Core Capabilities
* List cluster resources (pods, services, deployments)
* Fetch container logs and event streams
* Analyze security context constraints and RBAC issues
* Detect crash looping container causes automatically
