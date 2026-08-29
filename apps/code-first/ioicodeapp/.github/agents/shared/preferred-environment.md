# Preferred Environment

When initializing a new Power Apps code app, selecting the correct environment is critical.

## How to Find Environment ID
1. Navigate to [make.powerapps.com](https://make.powerapps.com).
2. Select your target environment from the top-right picker.
3. Look at the URL. The environment ID is the GUID after `/environments/`.
   - Example: `https://make.powerapps.com/environments/32a51012-32a5-43b5-a0a6-b38ce6be852d/home`

## Environment Selection Strategy
- **Default**: Use the environment ID found in `power.config.json` if it exists.
- **New Project**: Ask the user to provide the environment ID.
- **Personal Productivity**: Use the user's personal "Developer" environment for prototyping.
- **Team Projects**: Use a dedicated "Sandbox" or "Development" environment.

## Validation
After running `npx power-apps init`, verify the ID in `power.config.json` matches the intended target.
