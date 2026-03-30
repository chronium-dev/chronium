# Chronium V1 Engine Specification

## Purpose

This document describes the architecture and behaviour of the Chronium V1 obligation engine. It is intended to provide enough context for a new conversation with ChatGPT (or another developer) to immediately understand how the system works.

Chronium is an obligation tracking system that converts real-world events and recurring schedules into concrete obligations with due dates.

---

# Core Concept

Chronium follows a simple rules‑engine pattern:

Events → Rules → Obligations

Where:

• **Events** represent facts that happened in the real world  
• **Rules** define how obligations should be generated  
• **Obligations** are the resulting tasks with due dates

Chronium also supports operational recurring obligations via recurrence rules.

---

# Database Schema Overview

The database is organised into several logical groups.

## Authentication

Handles user accounts and login sessions.

Tables:

- `user`
- `session`
- `account`
- `verification`

These are largely infrastructure tables and not directly related to the obligation engine.

---

## Organisation Model

Chronium is multi‑tenant and supports multiple organisations.

Tables:

- `organisation`
- `member`

Supporting classification tables:

- `jurisdictions`
- `entity_types`

Example:

Organisation
→ UK
→ Private Limited Company

This classification allows obligation templates to apply only to specific regulatory contexts.

---

## Event System

Events represent **facts that happened**.

Table:

- `events`

Reference tables:

- `event_types`

Examples:

- Company Incorporated
- Accounting Period End
- VAT Registered

Events are the **primary trigger mechanism** for regulatory obligations.

---

## Obligation Rule System

Rules describe how obligations should be generated.

Table:

- `obligation_templates`

Reference tables:

- `obligation_types`

Templates connect:

Trigger Event → Obligation Type → Due Offset

Example:

Accounting Period End
→ Pay Corporation Tax
→ Offset 276 days

---

## Obligation Instances

Generated obligations are stored in:

- `obligations`

Important fields:

- organisationId
- obligationTypeId
- templateId
- generatedFromEventId
- dueDate
- status

These represent the **actual tasks** shown in the UI.

---

## Recurring Operational Rules

Not all obligations are triggered by events.

Operational activities such as meetings or payroll occur on recurring schedules.

Table:

- `recurrence_rules`

Example rules:

- Weekly leadership meeting
- Monthly payroll
- Quarterly board meeting

These generate obligations independently of the event system.

---

# Events (Facts)

Events represent real‑world things that have happened.

Examples:

- Accounting period ended
- Company incorporated
- VAT registered
- Payroll run

Important fields:

- `eventTypeId`
- `eventDate`
- `anchorDate` (optional)
- `organisationId`

### Anchor Date

`anchorDate` is optional.

If present, it overrides `eventDate` as the base date used when calculating obligation deadlines.

Example:

Accounting period end = 31 Dec  
Accounts filed = 15 Jan

Database values:

- eventDate = 15 Jan
- anchorDate = 31 Dec

Engine rule:

baseDate = anchorDate ?? eventDate

---

# Obligation Templates (Rules)

Templates define how obligations are generated from events.

Key fields:

- eventTypeId
- obligationTypeId
- dueOffsetDays
- jurisdictionId
- entityTypeId

Example template:

Event: Accounting Period End  
Obligation: Corporation Tax Payment  
Offset: 276 days

Due date calculation:

DueDate = baseDate + dueOffsetDays

---

# Obligations (Generated Tasks)

Obligations are the **output of the engine**.

Examples:

- Pay Corporation Tax
- File Accounts
- Submit CT600

The dashboard and application UI operate entirely on this table.

---

# Recurrence Rules

Operational schedules that generate obligations without events.

Fields:

- organisationId
- obligationTypeId
- name
- startDate
- frequency
- interval
- weekday

Example:

Leadership stand‑up

frequency: weekly  
interval: 2  
weekday: Monday

Meaning:

Every two weeks on Monday.

---

# Obligation Generation Diagrams

These diagrams illustrate how obligations are created.

## Event Triggered Obligations

```
Event Recorded

Accounting Period End
31 Mar 2026

        ↓

Event Engine

        ↓

Lookup Obligation Templates

        ↓

Calculate Due Dates

        ↓

Insert Obligations
```

Result:

```
31 Dec 2026  File Accounts
1 Jan 2027   Pay Corporation Tax
31 Mar 2027  File CT600
```

---

## Recurring Obligations

```
Recurrence Rule

Bi‑weekly Monday Stand‑up

        ↓

Recurrence Engine

        ↓

Generate Future Dates

        ↓

Insert Obligations
```

Example generated tasks:

```
6 Jan 2026  Team Stand‑up
20 Jan 2026 Team Stand‑up
3 Feb 2026  Team Stand‑up
```

---

# Example: UK Limited Company Obligation Timeline (2026–2027)

Example company:

Jurisdiction: UK  
Entity type: Private Limited Company  
Accounting year end: **31 March 2026**

Generated obligations:

| Obligation          | Due Date    | Source                |
| ------------------- | ----------- | --------------------- |
| File Accounts       | 31 Dec 2026 | Accounting Period End |
| Pay Corporation Tax | 1 Jan 2027  | Accounting Period End |
| File CT600          | 31 Mar 2027 | Accounting Period End |

Timeline:

```
31 Mar 2026
Accounting Period End (event)

↓

31 Dec 2026
File Accounts

↓

1 Jan 2027
Corporation Tax Payment

↓

31 Mar 2027
CT600 Filing
```

A single event generates multiple obligations using different offsets.

---

# V1 Scope

Chronium V1 focuses on a minimal but functional engine.

Capabilities:

- Event triggered obligations
- Recurring operational obligations
- Obligation generation
- Due date calculation
- Duplicate prevention

Out of scope for V1:

- complex legal rule logic
- conditional templates
- multi‑stage obligations
- escalation workflows

---

# Future V2 Architecture (Conceptual)

Future versions may expand the rule engine to support more complex regulatory logic.

Potential capabilities:

## Conditional Rules

Example:

Large companies must pay corporation tax in quarterly instalments.

## Multi‑Stage Obligations

Example workflow:

Prepare accounts  
→ Director approval  
→ File at Companies House

## Dynamic Date Rules

Examples:

- last working day of month
- first Monday after event
- end of quarter

## Jurisdiction Rule Packs

Predefined regulatory packs such as:

- UK Limited Company
- US Delaware C‑Corp
- EU VAT Registered Entity

## External Integrations

Potential integrations:

- Companies House
- HMRC
- accounting systems

---

# Chronium V1 Engine Implementation (TypeScript / Drizzle)

Below is a simplified implementation of the Chronium V1 event processing engine. This demonstrates how an event generates obligations using the `obligation_templates` table.

```ts
import { db } from '$lib/server/db';
import { events, obligationTemplates, obligations } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { addDays } from 'date-fns';

export async function processEvent(eventId: string) {

  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      organisation: true
    }
  });

  if (!event) throw new Error('Event not found');

  const baseDate = event.anchorDate ?? event.eventDate;

  const templates = await db.select()
    .from(obligationTemplates)
    .where(eq(obligationTemplates.eventTypeId, event.eventTypeId));

  for (const template of templates) {

    const dueDate = addDays(baseDate, template.dueOffsetDays);

    await db.insert(obligations).values({
      organisationId: event.organisationId,
      obligationTypeId: template.obligationTypeId,
      templateId: template.id,
      generatedFromEventId: event.id,
      dueDate
    }).onConflictDoNothing();
  }
}
```

Key behaviour:

• Retrieves the event
• Determines the **base date** (`anchorDate ?? eventDate`)
• Finds matching obligation templates
• Calculates due dates using `dueOffsetDays`
• Inserts generated obligations
• Prevents duplicates via database constraints

This function is typically called:

- after inserting a new event
- by a background worker
- during batch recomputation

---

# Design Principles

The Chronium engine follows several core design principles that guide development and ensure the system remains predictable and maintainable.

## Events Are Immutable Facts

Events represent things that happened in the real world.

Examples:

- Company incorporated
- Accounting period ended
- VAT registered

Once recorded, events should generally **not be modified**. If something was entered incorrectly, the preferred approach is to correct it by creating a new event or by controlled administrative correction. This ensures a reliable historical audit trail.

## Templates Represent Regulatory Rules

Obligation templates encode **jurisdictional or operational rules**.

Examples:

- UK Companies House filing deadlines
- HMRC corporation tax rules
- Internal governance requirements

Templates should be designed to be **reusable across organisations** where possible.

## Obligations Are Generated State

Obligations are not primary data; they are **derived outputs** generated from events and recurrence rules.

This means they can theoretically be regenerated if needed.

The obligations table therefore acts as a **materialised view of upcoming responsibilities**.

## The Engine Is Deterministic

Given the same:

- event
- templates
- recurrence rules

The engine should always generate the **same obligations**.

This property makes debugging, recomputation, and future reprocessing far easier.

## Idempotent Processing

Running the engine multiple times should not create duplicate obligations.

This is achieved through:

- unique database constraints
- conflict-safe inserts
- referencing `generatedFromEventId`

This allows the system to safely re-run generation jobs.

---

# Chronium V1 Core Invariants

These invariants help ensure the system remains stable as features evolve.

## 1. Events Never Depend on Obligations

Events represent real-world facts and must never depend on generated obligations.

Direction of dependency:

```
Events → Templates → Obligations
```

Never the reverse.

## 2. Every Obligation Has a Clear Source

Each obligation should ideally be traceable to its origin.

Possible sources:

- `generatedFromEventId`
- `templateId`
- `recurrence_rules`

This allows debugging and recomputation.

## 3. Obligations Belong to an Organisation

Every obligation must have:

```
organisationId
```

This guarantees strict multi-tenant separation.

## 4. Rules Must Be Context-Aware

Templates can optionally restrict applicability via:

- jurisdictionId
- entityTypeId

This allows the system to support many legal environments without duplicating logic.

## 5. The Engine Can Be Re-run Safely

If the engine is re-executed:

- existing obligations should not be duplicated
- missing obligations should be created

This allows:

- batch regeneration
- rule upgrades
- historical recomputation

## 6. Future Obligations Should Be Predictable

Chronium should generate obligations far enough into the future that organisations can plan ahead.

Typical horizons might be:

- 12 months
- 24 months

This is especially important for recurrence rules.

---

# Summary

Chronium converts organisational facts and schedules into a unified timeline of obligations.

Architecture:

Events → Rules → Obligations

and

Recurrence Rules → Obligations

This structure allows the system to scale from simple compliance tracking into a full organisational obligation management platform.
