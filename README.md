# IOI Domino to Microsoft 365 & Power Platform Migration Monorepo

[![Enterprise Architecture](https://img.shields.io/badge/Enterprise-Migration%20Architecture-0284C7?style=for-the-badge)]()
[![Microsoft 365](https://img.shields.io/badge/Microsoft%20365-Power%20Platform-D83B01?style=for-the-badge&logo=microsoft&logoColor=white)](https://powerplatform.microsoft.com)
[![Dataverse](https://img.shields.io/badge/Dataverse-Relational%20Core-0078D4?style=for-the-badge)](https://learn.microsoft.com/power-apps/maker/data-platform/)
[![Lotus Domino](https://img.shields.io/badge/Source-IBM%20Lotus%20Domino-1F2937?style=for-the-badge)]()

**IOI Domino to Microsoft 365 Migration Monorepo** serves as the authoritative knowledge base, architectural blueprint, schema mapping registry, and automation toolset for modernizing legacy IBM Lotus Notes/Domino databases into Microsoft 365, Power Platform, and Microsoft Dataverse for IOI Acidchem Sdn Bhd.

---

## 🌟 Modernization Framework

```mermaid
graph LR
    Domino[Legacy Lotus Domino NSF / DXL] --> Parser[DXL Form & Subform Parser]
    Parser --> Mapping[Field & Formula Mapping Engine]
    Mapping --> Dataverse[Dataverse Entities & Relationships]
    Mapping --> PowerApps[Power Apps Canvas & Code-First Apps]
    Mapping --> Automate[Power Automate Approval Flows]
```

### 1. DXL Form & Schema Parsing
- Converts legacy Domino DXL forms, subforms, field data types, keyword formulas, and `@Formula` logic into strongly-typed TypeScript and Dataverse entity definitions.

### 2. Hide-When & Security Translation
- Translates Domino hide-when formulas and ACL roles into Power Apps conditional visibility properties and Dataverse Role-Based Access Control (RBAC).

### 3. Multi-Tier Enterprise Approval State Machines
- Replaces legacy Domino background agents with event-driven Power Automate cloud flows supporting multi-stage approvals (`Draft` ➔ `Department Head` ➔ `Plant General Manager` ➔ `Completed`).

---

## 📁 Repository Structure

```
ioi-domino-m365-migration/
├── .github/
│   ├── agents/             # Autonomous migration agents (.agent.md)
│   ├── instructions/       # Domino modernization operating instructions
│   └── skills/             # Reusable migration skills & schema transformers
├── architecture/           # System topology, ERDs, and governance docs
├── dxl-schemas/            # Parsed DXL form exports and source dictionaries
├── dataverse-models/       # Entity relationship diagrams and solution XMLs
├── power-automate-flows/   # Cloud flow definitions and approval triggers
└── AGENTS.md               # Agent guidelines and quality policies
```

---

## 📄 License & Attribution
Authored and maintained by **Ali Akhmad Fauzie** ([@aliakhmadfauzie](https://github.com/aliakhmadfauzie)), Enterprise Solutions Architect.
