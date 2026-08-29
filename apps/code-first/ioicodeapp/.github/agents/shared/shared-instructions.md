# Shared Instructions

These instructions apply across all Power Apps Code App skills and agents.

## Environment & CLI
- **Power Apps CLI**: Use `npx power-apps` for all commands. Do not assume `pac` is available globally.
- **Node.js**: Version 22+ is required.
- **OS**: Windows is the primary target for these instructions.

## Planning & Memory
- **Plan Mode**: Always use `EnterPlanMode` before starting complex implementation tasks.
- **Memory Bank**: Maintain a `memory-bank.md` in the project root to track progress and state.

## Implementation Standards
- **Standard Connectors Only**: **NEVER use premium connectors** (e.g., Dataverse, SQL Server). All data storage and integration must use standard connectors like SharePoint.
- **Connectors Only**: Always use Power Platform standard connectors via generated services. Never use `fetch`, `axios`, or direct API calls.
- **TypeScript**: Use strict mode. Avoid `any`. Type `useState` for picklists as `number`.
- **Components**: Prefer functional components and hooks.

## Error Handling
- If a build fails, resolve all TypeScript/Lint errors before attempting to deploy.
- If a command fails, report the error message exactly.
