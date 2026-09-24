(function (root) {
  "use strict";
  // Legacy synthetic seeds are normalized to version 2 by assessment.validate.
  const owners = {
    sourced: "Registrar data steward", traceable: "Data engineering lead",
    retrievable: "Identity and platform lead", aligned: "Academic policy owner",
    timely: "Integration operations lead", audited: "Advising pilot lead"
  };
  const before = {
    version: 1,
    context: {
      useCase: "SYNTHETIC: Cedar Vale College student advising, Before",
      audience: "Fictional college students asking a student-facing assistant if they can graduate. Synthetic scenario date: 2030-04-08.",
      decision: "Proposed graduation assurance from an overnight SIS extract and credit totals. A synthetic student has enough credits but a pending capstone.",
      boundary: "Risk in the proposed scope: a student could interpret a generated answer as graduation certification. No tested registrar handoff or prohibition on student-record writes is documented.",
      sponsor: "Fictional advising lead sponsors discovery. Registrar, academic policy and governance reviewers have not agreed the student-facing scope."
    },
    owners: { ...owners },
    answers: {
      authority: { status: "evidenced", evidence: "Synthetic illustrative source register B-01: registrar-owned SIS extract is named for enrolled courses and credit totals. This records the proposed narrow facts, not proof that credit totals establish graduation eligibility." },
      quality: { status: "unknown", evidence: "Synthetic question B-02: duplicate identities, missing transfer credits and coverage have not been examined." },
      purpose: { status: "unknown", evidence: "Synthetic illustrative review backlog B-03: permission for student-facing graduation assurance is unresolved." },
      lineage: { status: "evidenced", evidence: "Synthetic illustrative path diagram B-04: SIS overnight extract to credit-total view to assistant. The diagram exposes the missing degree-rule evidence path." },
      references: { status: "evidenced", evidence: "" },
      versions: { status: "unknown", evidence: "Synthetic question B-06: which program, catalog year and rule version supported the answer?" },
      access: { status: "gap", evidence: "Synthetic illustrative design review B-07: no end-to-end denied-access tests across student identities, caches and exports." },
      retrieval: { status: "gap", evidence: "Synthetic illustrative sample B-08: the answer retrieves total credits but misses a pending capstone and program requirements." },
      minimal: { status: "gap", evidence: "Synthetic illustrative field review B-09: full student profile proposed; minimum required fields and exclusions are not defined." },
      meaning: { status: "gap", evidence: "Synthetic illustrative policy question B-10: credit totals are treated as graduation eligibility without approved degree rules, program or catalog year." },
      entities: { status: "gap", evidence: "Synthetic illustrative record B-11: 120 credits with a pending capstone; no tested rule calculation distinguishes credits from requirement completion." },
      exceptions: { status: "unknown", evidence: "Synthetic question B-12: who resolves transfer credit exceptions and conflicting catalogs?" },
      freshness: { status: "unknown", evidence: "Synthetic illustrative design note B-13: overnight refresh is known, but no decision-specific maximum age is agreed." },
      propagation: { status: "unknown", evidence: "Synthetic question B-14: update, deletion and permission-change latency through caches is unmeasured." },
      stale: { status: "gap", evidence: "Synthetic illustrative failure case B-15: an overnight extract omits a capstone update; no tested stale-answer withholding or registrar handoff." },
      evaluation: { status: "unknown", evidence: "Synthetic question B-16: no expert-reviewed acceptance set for supported and unsupported advising questions." },
      monitoring: { status: "unknown", evidence: "Synthetic question B-17: incident response, privacy-aware logs and pause rehearsal are not yet specified." },
      human: { status: "gap", evidence: "Synthetic illustrative failure case B-18: student-facing graduation assurance has no tested human approval boundary or prohibited-write test." }
    }
  };
  const after = {
    version: 1,
    context: {
      useCase: "SYNTHETIC: Cedar Vale College student advising, After",
      audience: "Advisors in one fictional college, using synthetic records only for this demonstration. Not student-facing. Synthetic scenario date: 2030-05-20.",
      decision: "Support advisor inspection of potentially unmet requirements using approved degree rules, program and catalog year. A pending capstone stays unresolved until registrar review.",
      boundary: "One-college advisor-facing evidence-support pilot proposed for review. No graduation certification, autonomous student advice, enrollment changes or student-record writes. Withhold unsupported or stale answers and hand off to the registrar.",
      sponsor: "Fictional advising lead owns the proposed bounded pilot; registrar, policy and governance roles review evidence and can pause it. Propagation measurement and monitoring follow-up remain open. This is not approval."
    },
    owners: { ...owners },
    answers: {
      authority: { status: "evidenced", evidence: "Synthetic illustrative source register A-01: SIS course facts, registrar-approved degree rules and published program/catalog-year policy are mapped to accountable roles for the one-college scope." },
      quality: { status: "evidenced", evidence: "Synthetic illustrative test record A-02: missing courses, transfer-credit coverage and duplicate identity cases are checked against expected outcomes in the small demo set, not a production validation." },
      purpose: { status: "evidenced", evidence: "Synthetic illustrative review record A-03: permitted purpose is limited to advisor evidence support with minimum data; student-facing certification is excluded. Not a real governance approval." },
      lineage: { status: "evidenced", evidence: "Synthetic illustrative lineage record A-04: SIS and approved degree rules through joins, deterministic calculations and retrieval to advisor-visible evidence are inspectable." },
      references: { status: "evidenced", evidence: "Synthetic illustrative inspection A-05: a pending-capstone response is traced to the actual synthetic record and program/catalog-year rule passage; a citation alone is not accepted as support." },
      versions: { status: "evidenced", evidence: "Synthetic illustrative version record A-06: rule edition, catalog year, transform and retrieval configuration identifiers are recorded with a privacy-aware retention plan." },
      access: { status: "evidenced", evidence: "Synthetic illustrative test record A-07: allowed advisor and denied cross-college/student-role access are tested through retrieval, cache, generated response and export paths." },
      retrieval: { status: "evidenced", evidence: "Synthetic illustrative question set A-08: degree rules, course records, pending capstone, missing context and conflicting policy cases have expected supporting records or a handoff." },
      minimal: { status: "evidenced", evidence: "Synthetic illustrative field review A-09: only scoped identifiers, program/catalog year, course completions and requirement evidence are exposed. Sensitive unrelated fields are excluded; retrieved instructions remain untrusted content." },
      meaning: { status: "evidenced", evidence: "Synthetic illustrative rule mapping A-10: academic policy owner agrees one-college degree rules by program and catalog year. Total credits do not mean all graduation requirements are complete." },
      entities: { status: "evidenced", evidence: "Synthetic illustrative calculation tests A-11: IDs, joins, transfer-credit units and deterministic rule checks retain a pending capstone even when total credits reach 120." },
      exceptions: { status: "evidenced", evidence: "Synthetic illustrative routing test A-12: transfer-credit exceptions, conflicting catalogs and unapproved substitutions go to the registrar; the assistant does not infer a resolution." },
      freshness: { status: "evidenced", evidence: "Synthetic illustrative freshness record A-13: course facts older than the agreed 24-hour demo limit are withheld; rule edition/effective date must match the program and catalog year." },
      propagation: { status: "gap", evidence: "Synthetic illustrative open item A-14: end-to-end update, deletion and permission-revocation propagation through every serving cache has not been measured. Measure latency and invalidation before any pilot decision." },
      stale: { status: "evidenced", evidence: "Synthetic illustrative test record A-15: expired timestamps, unavailable SIS and a missing capstone update trigger withholding and explicit registrar handoff rather than graduation assurance." },
      evaluation: { status: "evidenced", evidence: "Synthetic illustrative evaluation record A-16: a small expert-role-reviewed demo set covers correctness, refusals, access and pending requirements with explicit thresholds. Not a real validation; propagation remains outside the tested evidence." },
      monitoring: { status: "gap", evidence: "Synthetic illustrative follow-up A-17: incident role and log-retention proposal are named, but the monitoring review and pause/rollback rehearsal are not complete. Complete both and record evidence before any pilot decision." },
      human: { status: "evidenced", evidence: "Synthetic illustrative boundary tests A-18: advisors inspect evidence; registrar handoff handles consequential decisions. Graduation certification and student-record writes are prohibited and blocked in the demo tests." }
    }
  };
  const changes = [
    "Replace student-facing graduation assurance with a one-college advisor-facing evidence-support scope.",
    "Use approved degree rules, program and catalog year, not credit totals alone; a pending capstone still needs review.",
    "Limit student fields, test access boundaries and inspect actual source provenance rather than trusting citations.",
    "Withhold stale or unsupported answers and hand off to the registrar. Do not certify graduation or write student records.",
    "Keep end-to-end propagation measurement and monitoring follow-up open. A bounded, reviewed proposal is not automatically ready."
  ];
  const api = { before, after, changes };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AdvisingCase = api;
})(globalThis);
