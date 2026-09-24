(function (root) {
  "use strict";
  const layers = [
    { id: "sourced", letter: "S", name: "Sourced", meaning: "Start with authoritative, fit-for-purpose data that you are permitted to use.", question: "Are these the facts your institution can stand behind?", checks: [
      { id: "authority", title: "Are authoritative sources agreed for every required fact?", critical: true, help: "An approved source and accountable role for every fact the use case needs.", action: "Agree which source is authoritative for each required fact. Record its owner and resolve conflicting sources." },
      { id: "quality", title: "Have you tested data quality for this use case?", help: "Checks for missing records, duplicates, identity matching, coverage, and relevant populations.", action: "Test completeness, identity matching, and representative coverage against the questions the pilot must answer." },
      { id: "purpose", title: "Has the proposed data use been reviewed and permitted?", critical: true, help: "A documented review of purpose, sensitivity, consent or other applicable basis, and source restrictions.", action: "Have the data and governance owners confirm permitted purpose and restrictions before connecting the data." }
    ] },
    { id: "traceable", letter: "T", name: "Traceable", meaning: "Follow an answer back through its sources, transformations and versions.", question: "Can you explain how the answer got here?", checks: [
      { id: "lineage", title: "Can you trace the source-to-serving path?", help: "A lineage record covering extraction, transformations, joins, and derived fields.", action: "Document how each source becomes the evidence served to AI, including joins and transformations." },
      { id: "references", title: "Can you inspect the evidence supporting an answer?", help: "A sample answer connected to source records or document versions. Citations alone are not proof of correctness.", action: "Trace representative answers back to the actual supporting records and document versions. Verify that the evidence supports the claim." },
      { id: "versions", title: "Can you reconstruct the versions behind an answer?", help: "Version history for policies, data transformations, and retrieval configuration with an appropriate retention policy.", action: "Record the relevant data, policy, and configuration versions so an incident can be reconstructed without retaining unnecessary sensitive content." }
    ] },
    { id: "retrievable", letter: "R", name: "Retrievable", meaning: "Make relevant evidence available to authorized users without exposing anything else.", question: "Can the right user get the right evidence, and only that?", checks: [
      { id: "access", title: "Have allowed and denied access been tested end to end?", critical: true, help: "Positive and negative tests across user roles, including cross-student, cross-patient, or cross-team access where relevant.", action: "Test allowed and denied access end to end, including retrieval, caches, generated answers, and exports. Do not rely on a prompt as an access control." },
      { id: "retrieval", title: "Does retrieval find the evidence each question needs?", help: "Representative questions with expected structured records, document passages, and exception cases.", action: "Build a small question set with expected evidence. Test missing context, irrelevant results, and questions requiring multiple sources." },
      { id: "minimal", title: "Have you limited the AI path to necessary data and content?", help: "A documented field and document scope, sensitive-content exclusions, and handling of retrieved instructions.", action: "Minimize fields and documents sent to AI. Review sensitive-content exclusions and how retrieved content is kept separate from system instructions." }
    ] },
    { id: "aligned", letter: "A", name: "Aligned", meaning: "Agree definitions and rules, validate calculations, and make exceptions explicit.", question: "Does the evidence mean what everyone thinks it means?", checks: [
      { id: "meaning", title: "Have domain owners agreed the definitions and rules?", help: "Approved meanings for terms such as on track, active, eligible, or current, including local variations.", action: "Agree the key definitions with domain owners. Make legitimate department or facility differences explicit." },
      { id: "entities", title: "Have entities, joins and calculations been validated?", help: "Verified IDs, joins, units, time periods, measures, and deterministic calculations.", action: "Validate joins, identifiers, units, time periods, and calculations. Keep consequential calculations in tested logic, not model guesswork." },
      { id: "exceptions", title: "Are conflict and exception resolution rules defined?", help: "Rules for conflicting policy versions, missing approvals, and cases that need expert review.", action: "Define how conflicting rules and exceptions are resolved, and when the system must hand off rather than infer." }
    ] },
    { id: "timely", letter: "T", name: "Timely", meaning: "Set acceptable data age, measure update delays, and handle stale evidence safely.", question: "Is the evidence current enough for this decision?", checks: [
      { id: "freshness", title: "Have you agreed a maximum acceptable age for each source?", help: "An agreed maximum age based on consequences, not a blanket demand for real-time data.", action: "Set a maximum acceptable age for each source based on the decision and the cost of being wrong." },
      { id: "propagation", title: "Have update and deletion delays been measured end to end?", help: "Measured propagation through pipelines, indexes, and caches, including corrections and revocations.", action: "Measure update and deletion propagation through every serving layer. Test corrections, permission changes, and cache invalidation." },
      { id: "stale", title: "Has stale or unavailable evidence behavior been tested?", critical: true, help: "A test showing when to label an answer, withhold it, recheck a source, or escalate.", action: "Test unavailable and over-age sources. Define when a dated answer is acceptable and when the system must withhold or escalate it." }
    ] },
    { id: "audited", letter: "A", name: "Audited", meaning: "Test expected behavior, monitor failures, and keep people accountable for decisions.", question: "Can you demonstrate and sustain responsible operation?", checks: [
      { id: "evaluation", title: "Have expert-reviewed pilot acceptance criteria been tested?", critical: true, help: "An expert-reviewed evaluation set with thresholds for correctness, appropriate refusal, access, and relevant failure modes.", action: "Agree acceptance criteria with domain experts. Test realistic and adversarial cases, unsupported questions, and outcomes across relevant populations." },
      { id: "monitoring", title: "Are monitoring, incident ownership and tested pause procedures in place?", help: "A named response role, review cadence, privacy-aware logs, and a tested pause or rollback procedure.", action: "Assign incident ownership. Define monitoring, log access and retention, and rehearse pausing or rolling back unsafe behavior." },
      { id: "human", title: "Have human review and prohibited actions been tested?", critical: true, help: "Evidence that consequential actions require the intended approval, with clear escalation and user communication.", action: "Test human review, escalation, and prohibited actions. Confirm who can approve, pause, or stop the pilot." }
    ] }
  ];
  const roles = {
    sourced: "Data steward and governance reviewer", traceable: "Data engineering lead",
    retrievable: "Identity and platform lead", aligned: "Domain policy owner",
    timely: "Integration operations lead", audited: "Pilot lead and domain reviewer"
  };
  const contextFields = ["useCase", "audience", "decision", "boundary", "sponsor"];
  const statuses = ["", "yes", "no", "not-sure"];
  const legacyStatuses = ["", "unknown", "gap", "evidenced"];
  const checks = layers.flatMap(layer => layer.checks.map(check => ({ ...check, layerId: layer.id, layerName: layer.name })));
  function blank() {
    return {
      version: 2,
      context: Object.fromEntries(contextFields.map(key => [key, ""])),
      owners: Object.fromEntries(layers.map(layer => [layer.id, ""])),
      answers: Object.fromEntries(checks.map(check => [check.id, { status: "", evidence: "" }]))
    };
  }
  function validate(input) {
    const object = value => value && typeof value === "object" && !Array.isArray(value);
    if (!object(input) || ![1, 2].includes(input.version) || !object(input.context) || !object(input.owners) || !object(input.answers)) {
      throw new Error("This is not a supported STRATA playbook file (version 1 or 2).");
    }
    const result = blank();
    const text = (value, max, field) => {
      if (typeof value !== "string" || value.length > max) throw new Error(`Invalid or oversized field: ${field}.`);
      return value;
    };
    for (const key of contextFields) result.context[key] = text(input.context[key], key === "useCase" ? 200 : 1200, key);
    for (const layer of layers) result.owners[layer.id] = text(input.owners[layer.id], 200, layer.name + " owner");
    for (const check of checks) {
      const answer = input.answers[check.id];
      if (!object(answer) || !(input.version === 1 ? legacyStatuses : statuses).includes(answer.status)) throw new Error(`Invalid answer for ${check.title}.`);
      const evidence = text(answer.evidence, 1200, check.title);
      let status = answer.status;
      if (input.version === 1) {
        status = status === "evidenced"
          ? (evidence.trim() && result.owners[check.layerId].trim() ? "yes" : "not-sure")
          : ({ "": "", unknown: "not-sure", gap: "no" })[status];
      }
      result.answers[check.id] = { status, evidence };
    }
    return result;
  }
  function importState(input) {
    const state = validate(input);
    if (input.version === 2) return { state, notice: "" };
    const incomplete = checks.filter(check => input.answers[check.id].status === "evidenced" && state.answers[check.id].status === "not-sure").length;
    return {
      state,
      notice: `Version 1 record converted to the selectable playbook. Complete evidence claims became Yes, gaps became No, unknowns became Not sure, and blanks stayed unanswered. ${incomplete} incomplete evidence claim(s) became Not sure for review. Your notes and owners were kept. Scores now count Yes selections, not written evidence. Review the answers before saving.`
    };
  }
  function evaluate(state) {
    state = validate(state);
    const reviewed = checks.map(check => {
      const answer = state.answers[check.id];
      const owner = state.owners[check.layerId].trim();
      const selectedYes = answer.status === "yes";
      const reason = ({ "": "Unanswered: still to review", yes: "Yes: self-reported, not verified", no: "No: a known gap", "not-sure": "Not sure: investigate" })[answer.status];
      const prefix = answer.status === "" ? "Review this unanswered question with the responsible role. " :
        answer.status === "not-sure" ? "Find out with the responsible role before claiming Yes. " : "";
      return { ...check, ...answer, owner, selectedYes, reason, reasons: [reason], nextAction: prefix + check.action, role: owner || roles[check.layerId] };
    });
    const answered = reviewed.filter(check => check.status !== "").length;
    const yes = reviewed.filter(check => check.selectedYes).length;
    const critical = reviewed.filter(check => check.critical && !check.selectedYes);
    const missingContext = contextFields.filter(key => !state.context[key].trim());
    let title, detail;
    if (answered === 0) {
      title = "Start with one use case in mind.";
      detail = "Choose Yes, No or Not sure for each question. No written context, notes or owner details are needed to generate scores.";
    } else if (critical.length) {
      title = "Review the unresolved critical controls.";
      detail = "Critical No, Not sure and Unanswered responses remain visible regardless of other scores. Review the underlying controls with domain and governance owners. This playbook does not verify that controls work.";
    } else if (answered < checks.length) {
      title = "Your self-assessment is in progress.";
      detail = "Some questions are still unanswered. They are not the same as No. Review the open items below; written context remains optional.";
    } else if (yes < checks.length) {
      title = "Address the remaining gaps and unknowns.";
      detail = "Critical controls have self-reported Yes answers, but other questions remain unresolved. Agree the next actions or a narrower scope with your reviewers.";
    } else {
      title = "All questions are Yes. Validate those claims.";
      detail = "Your selections are complete, not independently verified. Ask the appropriate reviewers to inspect evidence and test the controls. This is not deployment approval.";
    }
    const priorities = reviewed.filter(check => !check.selectedYes).sort((a, b) => Number(Boolean(b.critical)) - Number(Boolean(a.critical)) || Number(b.status === "no") - Number(a.status === "no"));
    const scorecard = layers.map(layer => {
      const items = reviewed.filter(check => check.layerId === layer.id);
      return {
        id: layer.id, name: layer.name,
        yes: items.filter(check => check.selectedYes).length, total: items.length,
        no: items.filter(check => check.status === "no").length,
        notSure: items.filter(check => check.status === "not-sure").length,
        unanswered: items.filter(check => check.status === "").length,
        answered: items.filter(check => check.status !== "").length,
        criticalMissing: items.filter(check => check.critical && !check.selectedYes).length
      };
    });
    return { title, detail, answered, yes, critical, missingContext, priorities, reviewed, scorecard };
  }
  function scorecard(state) { return evaluate(state).scorecard; }
  function example() {
    const fixture = typeof module !== "undefined" && module.exports ? require("./advising-case.js") : root.AdvisingCase;
    return validate(fixture.before);
  }
  const api = { layers, checks, contextFields, statuses, blank, validate, importState, evaluate, example, scorecard };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Strata = api;
})(globalThis);
