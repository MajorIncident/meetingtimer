# Tasks Playbook

Well-structured prompts make collaboration efficient. Use this guide when writing future human or AI tasks.

## Recommended Task Template
```
Goal: <What outcome is desired?>
Scope: <Specific features or files to touch>
Constraints: <Performance, accessibility, deadlines, etc.>
Files to touch: <Explicit list or directories>
Out of scope: <What must not change>
Testing: <Commands to run or checks to add>
```

## Examples
### ✅ Good prompt
> Goal: Add role increment/decrement controls to the Attendees section.
>
> Scope: Update `src/components/AttendeeControls.tsx` and related tests under `tests/components`.
>
> Constraints: Must work with keyboard-only interactions and include aria-labels.
>
> Files to touch: `src/components/AttendeeControls.tsx`, `tests/components/AttendeeControls.test.tsx`, `docs/architecture.md` (if new data structures are introduced).
>
> Testing: `npm test`, `npm run lint`.

### ❌ Bad prompt
> "Can you improve the UI a bit?"
>
> Missing clarity on files, scope, and validation steps.

## Tips
- Mention whether the change is backend logic, UI, or both.
- Call out any dependencies on API keys or environment variables.
- Provide acceptance criteria or definition of done for complex requests.
- Encourage updating `/docs` whenever a new pattern is introduced.
