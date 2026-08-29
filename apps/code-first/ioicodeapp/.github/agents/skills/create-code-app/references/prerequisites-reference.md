# Prerequisites Reference

Before creating a Power Apps code app, ensure the following prerequisites are met.

## Environment Requirements
- **Node.js**: v22.0.0 or higher.
- **npm**: v10.0.0 or higher.
- **Git**: Installed and available in PATH (required for `npx degit`).

## Power Platform Requirements
- **Environment ID**: A valid Power Platform Environment ID where you have "Environment Maker" or "System Administrator" roles.
- **Power Apps License**: A valid license to create and run Power Apps.
- **Dataverse**: If using Dataverse, the environment must have a Dataverse database initialized.

## Permissions
- Ability to sign in to Microsoft Entra ID (formerly Azure AD).
- Maker permissions in the target environment.

## Allowed Prompts (for Step 3)
When presenting the plan, include these prompts for the user:
- "Check my Node version with `node -v`"
- "I have my Environment ID ready"
- "I'm logged into the Power Platform CLI"
