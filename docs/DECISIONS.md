# Architecture & Product Decisions

Use this document for decisions that materially affect the project.

## ADR-001 — One Learning Engine + Skill Libraries

**Status:** Accepted

**Decision:** Ilm-os will use one reusable Learning Engine with separate skill libraries for different domains.

**Reason:** This allows the platform to scale to 50+ skills without duplicating the learning system.

## ADR-002 — Standalone Project

**Status:** Accepted

**Decision:** Ilm-os is an independent project and is not part of Noor.

**Reason:** Ilm-os has a dedicated purpose: structured skill education.

## ADR-003 — Open Source

**Status:** Accepted

**Decision:** The project is intended to be released under the MIT License.

**Reason:** The long-term objective is free public use and community contribution.

## ADR-004 — Engine Before 50+ Skills

**Status:** Accepted

**Decision:** Build and validate the common learning engine before large-scale skill expansion.

**Reason:** This reduces architectural duplication and prevents content volume from hiding weaknesses in the core learning experience.
