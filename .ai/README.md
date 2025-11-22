# AI Metadata

## Purpose
This directory centralizes machine-readable metadata and structured task definitions so AI agents can quickly understand and modify the repo without rediscovering context.

## Key Files
- `.ai/repo-map.json`: High-level map of the codebase for AI navigation.
- `.ai/task-schema.json`: Contract for machine-readable tasks targeting this repo.
- `.ai/tasks/examples/*.json`: Sample tasks showing how to use the schema.

## How AI Agents Should Use This
1. Read `repo-map.json` to locate domain logic, state hooks, UI components, tests, and docs.
2. Review `task-schema.json` to understand the expected structure for structured tasks.
3. Use the example tasks as references when generating or consuming new machine-readable requests.
