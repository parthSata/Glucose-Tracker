# Sweety rules

Follow the full ruleset in [AGENTS.md](../AGENTS.md) — stack, folder layout,
API/DB/auth/UI conventions, validation messages, and simplicity constraints.
It is the complete and only ruleset for this project.

@AGENTS.md

After every change, re-check validation, Bun-only, one-component-per-file,
and user-scoped data rules. Never commit, push, or open a PR without
explicit user permission. Do not scaffold `client/` or `server/` until asked.

Do not add rules to this file. Edit `AGENTS.md` at the repository root or the
owning file under `context/` instead.

<!-- Two reference styles on purpose: VS Code follows the Markdown link (requires
     chat.includeReferencedInstructions, set in .vscode/settings.json); Copilot CLI and the
     coding agent follow the @AGENTS.md path. -->
