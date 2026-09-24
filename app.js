/* global Strata, AdvisingCase */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const storageKey = "buildwithamrutha.strata.assessment.v1";
  const labels = { useCase: "Use case", audience: "Intended users", decision: "Decision and outcome", boundary: "Boundaries and human review", sponsor: "Accountable roles" };
  let state = Strata.blank();
  let dirty = false;
  let activeLayer = 0;
  let demoPhase = null;
  let demoEdited = false;
  const prompts = {
    sourced: "Which SIS facts and approved degree rules can the registrar stand behind? Is this advisor-support purpose permitted?",
    traceable: "Can an advisor inspect the pending-capstone record and the exact program/catalog-year rule behind the answer?",
    retrievable: "Do access tests deny cross-college or student-role retrieval? Are only minimum student fields exposed?",
    aligned: "Do approved degree rules distinguish total credits from completed requirements, including the pending capstone?",
    timely: "What happens after the overnight SIS refresh becomes stale? Have updates, deletions and revocations reached every cache?",
    audited: "Can an advisor hand off to the registrar without certifying graduation or writing student records? Who rehearses a pause?"
  };
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  function message(text) { $("message").textContent = text; }
  function makeLabel(text, control) {
    const label = node("label", text);
    label.append(control);
    return label;
  }
  function createCards() {
    for (const [index, layer] of Strata.layers.entries()) {
      const explanation = node("details", undefined, "hero-layer");
      const tile = node("summary", undefined, "hero-tile");
      const letter = node("span", layer.letter, "tile-letter");
      letter.setAttribute("aria-hidden", "true");
      const toggle = node("span", undefined, "tile-toggle");
      toggle.setAttribute("aria-hidden", "true");
      tile.append(letter, node("span", layer.name, "tile-name"), node("span", layer.question, "tile-summary"), toggle);
      const detail = node("div", undefined, "hero-layer-detail");
      detail.append(node("p", layer.meaning));
      const assess = node("a", "Assess " + layer.name + " \u2192");
      assess.href = "#layer-" + layer.id;
      detail.append(assess);
      explanation.append(tile, detail);
      $("hero-layers").append(explanation);
      const navigation = node("button", undefined, "layer-tab");
      navigation.type = "button";
      navigation.id = "nav-" + layer.id;
      navigation.setAttribute("aria-controls", "layer-" + layer.id);
      navigation.append(node("strong", layer.letter), node("span", layer.name), node("small", "0 / 3 answered"));
      navigation.addEventListener("click", () => showLayer(index));
      $("layer-navigation").append(navigation);
      const article = node("article", undefined, "layer");
      article.id = "layer-" + layer.id;
      article.setAttribute("aria-labelledby", "title-" + layer.id);
      const header = node("div", undefined, "layer-header");
      const heading = node("div");
      const title = node("h3", layer.name);
      title.id = "title-" + layer.id;
      title.tabIndex = -1;
      heading.append(title, node("p", layer.question));
      const count = node("span", "0 / 3 Yes", "badge");
      count.id = "count-" + layer.id;
      header.append(node("span", layer.letter, "letter"), heading, count);
      article.append(header);
      const casePrompt = node("p", prompts[layer.id], "case-prompt");
      casePrompt.id = "case-prompt-" + layer.id;
      casePrompt.hidden = true;
      article.append(casePrompt);
      const owner = node("input");
      owner.id = "owner-" + layer.id;
      owner.maxLength = 200;
      owner.placeholder = "Accountable role for this layer";
      const ownerLabel = makeLabel("Responsible role (optional)", owner);
      ownerLabel.className = "owner";
      const ownerDetails = node("details", undefined, "optional-notes owner-details");
      ownerDetails.append(node("summary", "Optional: add a responsible role for " + layer.name), ownerLabel);
      article.append(ownerDetails);
      for (const [checkIndex, check] of layer.checks.entries()) {
        const fieldset = node("fieldset", undefined, "check");
        fieldset.id = "check-" + check.id;
        const legend = node("legend");
        legend.append(node("span", String(checkIndex + 1).padStart(2, "0"), "check-number"), node("span", check.title));
        if (check.critical) legend.append(node("span", "Critical check", "badge"));
        const help = node("p", check.help);
        help.id = "help-" + check.id;
        const choices = node("fieldset", undefined, "choices");
        choices.append(node("legend", "Your answer", "choice-heading"));
        choices.setAttribute("aria-describedby", help.id);
        const choiceGrid = node("div", undefined, "choice-grid");
        for (const [value, label, description] of [
          ["yes", "Yes", "In place for this use case. +1 point."],
          ["no", "No", "A known gap. 0 points."],
          ["not-sure", "Not sure", "We need to find out. 0 points."]
        ]) {
          const input = node("input", undefined, "choice-input");
          input.type = "radio";
          input.name = "status-" + check.id;
          input.id = check.id + "-" + value;
          input.value = value;
          const labelNode = node("label", undefined, "choice");
          const face = node("span", undefined, "choice-face");
          const selected = node("span", "Selected", "choice-selection");
          selected.setAttribute("aria-hidden", "true");
          face.append(node("strong", label), node("small", description), selected);
          labelNode.append(input, face);
          choiceGrid.append(labelNode);
        }
        const reset = node("button", "Clear choice", "reset-choice");
        reset.type = "button";
        reset.setAttribute("aria-label", "Clear choice: " + check.title);
        reset.addEventListener("click", () => {
          choiceGrid.querySelectorAll("input").forEach(input => { input.checked = false; });
          choices.dispatchEvent(new Event("input", { bubbles: true }));
        });
        choices.append(choiceGrid, reset);
        const evidence = node("textarea");
        evidence.id = "evidence-" + check.id;
        evidence.maxLength = 1200;
        evidence.rows = 2;
        evidence.placeholder = "Describe the evidence, test result, or unresolved question. No sensitive data.";
        const hint = node("p", "", "evidence-hint");
        hint.id = "hint-" + check.id;
        evidence.setAttribute("aria-describedby", hint.id);
        const fields = node("div", undefined, "check-fields");
        const evidenceGroup = node("details", undefined, "optional-notes");
        evidenceGroup.append(node("summary", "Optional: add a note or evidence reference"), makeLabel("Supporting note (does not affect points)", evidence), hint);
        fields.append(choices, evidenceGroup);
        fieldset.append(legend, help, fields);
        article.append(fieldset);
      }
      $("layer-cards").append(article);
    }
  }
  function readForm() {
    for (const layer of Strata.layers) state.owners[layer.id] = $("owner-" + layer.id).value;
    for (const check of Strata.checks) {
      const selected = document.querySelector(`input[name="status-${check.id}"]:checked`);
      state.answers[check.id] = { status: selected ? selected.value : "", evidence: $("evidence-" + check.id).value };
    }
  }
  function populate(next, phase = null, notice = "") {
    state = Strata.validate(next);
    demoPhase = phase;
    demoEdited = false;
    $("migration-notice").textContent = notice;
    $("migration-notice").hidden = !notice;
    $("score-update").textContent = "";
    for (const layer of Strata.layers) $("owner-" + layer.id).value = state.owners[layer.id];
    for (const check of Strata.checks) {
      document.querySelectorAll(`input[name="status-${check.id}"]`).forEach(input => {
        input.checked = input.value === state.answers[check.id].status;
      });
      $("evidence-" + check.id).value = state.answers[check.id].evidence;
    }
    render();
  }
  function render() {
    const result = Strata.evaluate(state);
    $("worksheet-source").textContent = demoPhase
      ? `Current worksheet: synthetic Student advising: ${demoPhase}${demoEdited ? " (edited)" : ""}. No real validation. Not saved automatically.`
      : "Current worksheet: your assessment. No answers saved automatically.";
    for (const layer of Strata.layers) $("case-prompt-" + layer.id).hidden = !demoPhase;
    $("progress").value = result.answered;
    $("progress-text").textContent = `${result.answered} of 18 answered`;
    const report = $("report");
    report.replaceChildren();
    const summary = node("div", undefined, "summary");
    summary.append(node("p", state.context.useCase.trim() || "Your assessment", "eyebrow"), node("h3", result.title), node("p", result.detail));
    summary.append(node("p", `${result.critical.length} critical questions unresolved. ${result.priorities.length} questions need attention. These are open-item counts, not an overall score.`, "blocker-count"));
    if (result.critical.length) {
      const blockers = node("ul", undefined, "blockers");
      for (const check of result.critical) {
        const item = node("li");
        const link = node("a", `${check.layerName}: ${check.title}`);
        link.href = "#check-" + check.id;
        item.append(link, node("span", " " + check.reason));
        blockers.append(item);
      }
      summary.append(blockers);
    }
    report.append(summary);
    report.append(node("h3", "How many Yes answers are in each layer?"));
    const map = node("div", undefined, "scorecard");
    for (const [index, score] of result.scorecard.entries()) {
      const layer = Strata.layers[index];
      const count = score.yes;
      $("count-" + layer.id).textContent = `${count} / 3 Yes`;
      const answered = layer.checks.filter(check => state.answers[check.id].status !== "").length;
      $("nav-" + layer.id).querySelector("small").textContent = `${answered} / 3 answered`;
      $("nav-" + layer.id).classList.toggle("all-yes", count === 3);
      const item = node("article", undefined, "score-card");
      item.dataset.layer = layer.id;
      const link = node("a", layer.name);
      link.href = "#layer-" + layer.id;
      item.append(link, node("strong", `${count} / 3`, "score"), node("p", "self-reported Yes answers", "small"));
      const counts = node("ul", undefined, "score-counts");
      counts.append(node("li", `${score.no} No`), node("li", `${score.notSure} Not sure`), node("li", `${score.unanswered} Unanswered`));
      item.append(counts, node("p", `${score.criticalMissing} critical unresolved`, score.criticalMissing ? "critical-count" : "small muted"));
      map.append(item);
    }
    report.append(map);
    report.append(node("h3", result.priorities.length ? "What is missing, and who should act?" : "Your next step: independent review"));
    report.append(node("p", result.priorities.length ? "Critical checks come first, then known gaps within each group. This is a starting order, not a substitute for your institution's risk assessment." : "Ask the accountable owners to inspect the evidence, test the assumptions, and document the pilot decision.", "muted small"));
    const actions = node("ol", undefined, "actions");
    for (const check of result.priorities) {
      const item = node("li");
      item.append(node("strong", `${check.critical ? "CRITICAL / " : ""}${check.layerName}: ${check.title}`));
      item.append(node("p", `Reason: ${check.reason}`, "action-reason"));
      item.append(node("p", `Next action: ${check.nextAction}`));
      item.append(node("p", `Responsible role: ${check.role}${check.owner ? "" : " (suggested, assign an owner)"}`, "muted"));
      const link = node("a", "Go to this question");
      link.href = "#check-" + check.id;
      item.append(link);
      actions.append(item);
    }
    report.append(actions);
    for (const check of result.reviewed) {
      $("hint-" + check.id).textContent = "Optional and not scored. Avoid sensitive data or confidential links.";
    }
    const printed = $("print-evidence");
    printed.replaceChildren(node("h2", "Your answers and optional notes"), node("p", "Generated " + new Date().toLocaleString() + ". Yes answers are self-reported, not independently verified. Notes and owners do not affect scores."));
    if (!$("migration-notice").hidden) printed.append(node("p", $("migration-notice").textContent));
    for (const key of Strata.contextFields) {
      if (state.context[key].trim()) printed.append(node("h3", labels[key]), node("p", state.context[key]));
    }
    for (const layer of Strata.layers) {
      printed.append(node("h2", layer.name), node("p", "Owner: " + (state.owners[layer.id] || "Not assigned")));
      for (const check of result.reviewed.filter(item => item.layerId === layer.id)) {
        const entry = node("article");
        entry.append(node("h3", check.title + (check.critical ? " [Critical]" : "")), node("p", check.reason), node("p", check.evidence || "No evidence or notes recorded."));
        printed.append(entry);
      }
    }
  }
  function hasContent() { return JSON.stringify(state) !== JSON.stringify(Strata.blank()); }
  function replaceAllowed() { return (!hasContent() && !dirty) || window.confirm("Replace the current answers? Download them first if you want to keep a copy. Your device save will not change."); }
  function showLayer(index, moveFocus = false) {
    activeLayer = index;
    for (const [position, layer] of Strata.layers.entries()) {
      $("layer-" + layer.id).hidden = position !== index;
      $("nav-" + layer.id).setAttribute("aria-pressed", String(position === index));
    }
    $("layer-position").textContent = `EXPLORING ${String(index + 1).padStart(2, "0")} / 06: ${Strata.layers[index].name}`;
    $("previous-layer").disabled = index === 0;
    $("next-layer").textContent = index === Strata.layers.length - 1 ? "Build my action plan \u2192" : `Next: ${Strata.layers[index + 1].name} \u2192`;
    if (moveFocus) {
      $("layer-" + Strata.layers[index].id).scrollIntoView({ block: "start" });
      $("title-" + Strata.layers[index].id).focus({ preventScroll: true });
    }
  }
  function revealHash() {
    const hash = location.hash.slice(1);
    if (hash === "canvas" || Strata.contextFields.includes(hash)) {
      history.replaceState(null, "", "#layers");
      $("layers").scrollIntoView({ block: "start" });
      $("layers-title").focus({ preventScroll: true });
      return;
    }
    const index = Strata.layers.findIndex(layer => hash === "layer-" + layer.id || layer.checks.some(check => hash === "check-" + check.id));
    if (index < 0) return;
    showLayer(index);
    const target = $(hash);
    target.scrollIntoView({ block: "start" });
    const focusTarget = hash.startsWith("check-") ? target.querySelector("input") : $("title-" + Strata.layers[index].id);
    focusTarget.focus({ preventScroll: true });
  }
  createCards();
  populate(state);
  showLayer(0);
  revealHash();
  window.addEventListener("hashchange", revealHash);
  document.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (link && link.hash && link.hash === location.hash) revealHash();
  });
  $("previous-layer").addEventListener("click", () => showLayer(activeLayer - 1, true));
  $("next-layer").addEventListener("click", () => {
    if (activeLayer < Strata.layers.length - 1) showLayer(activeLayer + 1, true);
    else {
      $("results").scrollIntoView({ block: "start" });
      $("results-title").focus({ preventScroll: true });
    }
  });
  $("worksheet").addEventListener("submit", event => event.preventDefault());
  $("worksheet").addEventListener("input", event => {
    readForm(); dirty = true; demoEdited = !!demoPhase; render();
    const checkId = event.target.name ? event.target.name.replace("status-", "") : event.target.closest(".check")?.id.replace("check-", "");
    const check = Strata.checks.find(item => item.id === checkId);
    if (check && (event.target.type === "radio" || event.target.classList.contains("choices"))) {
      const score = Strata.scorecard(state).find(item => item.id === check.layerId);
      $("score-update").textContent = `${score.name}: ${score.yes} of 3 Yes. ${score.answered} of 3 answered.`;
    }
    message("Changes are not saved. Download a copy or save on this device to keep them.");
  });
  function loadPreset(phase) {
    if (!replaceAllowed()) return;
    populate(AdvisingCase[phase.toLowerCase()], phase);
    showLayer(0, true);
    dirty = true;
    message(`Student advising: ${phase} loaded. All evidence is synthetic and illustrative. Nothing was saved. The comparison remains a separate fixed example.`);
  }
  $("example").addEventListener("click", () => loadPreset("Before"));
  $("example-after").addEventListener("click", () => loadPreset("After"));
  function renderComparison() {
    const content = $("comparison-content");
    content.replaceChildren();
    const before = Strata.evaluate(AdvisingCase.before);
    const after = Strata.evaluate(AdvisingCase.after);
    const scopes = node("div", undefined, "comparison-scopes");
    for (const [phase, result] of [["Before", before], ["After", after]]) {
      const fixture = AdvisingCase[phase.toLowerCase()];
      const article = node("article");
      article.append(node("h3", "Student advising: " + phase), node("p", fixture.context.audience), node("p", fixture.context.decision), node("p", fixture.context.boundary), node("strong", `${result.critical.length} critical missing checks. ${result.title}`));
      scopes.append(article);
    }
    content.append(scopes, node("h3", "Six independent scores: Yes answers / 3"));
    const table = node("table", undefined, "comparison-table");
    const caption = node("caption", "Fixed synthetic selections, not real validation. Each Yes is one point. No overall score.");
    const head = node("thead");
    const heading = node("tr");
    for (const text of ["Layer", "Before", "After"]) { const th = node("th", text); th.scope = "col"; heading.append(th); }
    head.append(heading);
    const body = node("tbody");
    for (const [index, score] of before.scorecard.entries()) {
      const row = node("tr");
      const name = node("th", score.name);
      name.scope = "row";
      row.append(name);
      for (const cell of [score, after.scorecard[index]]) {
        const td = node("td");
        td.append(node("strong", `${cell.yes} / ${cell.total}`), node("small", `${cell.no} No / ${cell.notSure} Not sure / ${cell.unanswered} Unanswered / ${cell.criticalMissing} critical unresolved`));
        row.append(td);
      }
      body.append(row);
    }
    table.append(caption, head, body);
    content.append(table, node("h3", "What changed, and what still needs work?"));
    const changes = node("ul");
    for (const change of AdvisingCase.changes) changes.append(node("li", change));
    content.append(changes);
    const remaining = node("div", undefined, "notice");
    remaining.append(node("h3", "After still has missing items"));
    for (const check of after.priorities) remaining.append(node("p", `${check.layerName}: ${check.reason}. ${check.nextAction} Responsible role: ${check.role}.`));
    content.append(remaining);
    const details = node("details", undefined, "case-records");
    details.append(node("summary", "Inspect all 18 synthetic questions and evidence records"));
    for (const [index, check] of before.reviewed.entries()) {
      const article = node("article");
      article.append(node("h4", `${check.layerName}: ${check.title}${check.critical ? " (critical)" : ""}`));
      for (const [phase, item] of [["Before", check], ["After", after.reviewed[index]]]) {
        article.append(node("strong", `${phase}: ${item.reason}`), node("p", item.evidence || "No evidence reference recorded."), node("p", "Owner: " + item.role, "small"));
      }
      details.append(article);
    }
    content.append(details);
  }
  $("compare").addEventListener("click", () => {
    renderComparison();
    $("comparison").hidden = false;
    $("compare").setAttribute("aria-expanded", "true");
    $("comparison-title").scrollIntoView({ block: "start" });
    $("comparison-title").focus({ preventScroll: true });
  });
  $("close-comparison").addEventListener("click", () => {
    $("comparison").hidden = true;
    $("compare").setAttribute("aria-expanded", "false");
    $("compare").focus();
  });
  $("save").addEventListener("click", () => {
    if (!window.confirm("Save these answers in this browser on this device? They are not encrypted by this tool and may be accessible to others using this browser profile. This replaces the previous save.")) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      dirty = false;
      message("Saved on this device. Future edits are not saved automatically. Download a file for a portable backup.");
    } catch (error) { message("Could not save on this device: " + error.message + " Use Download assessment instead."); }
  });
  $("load").addEventListener("click", () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === null) { message("No saved assessment was found in this browser for this page."); return; }
      const imported = Strata.importState(JSON.parse(saved));
      if (!replaceAllowed()) return;
      populate(imported.state, null, imported.notice);
      dirty = !!imported.notice;
      message(imported.notice || "Device save loaded. Changes are not saved automatically.");
    } catch (error) { message("Could not load the device save: " + error.message + " Current answers were kept."); }
  });
  $("download").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = node("a");
    link.href = url;
    link.download = "strata-assessment-" + new Date().toISOString().slice(0, 10) + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    message("Download requested. Check your downloads before closing; the file contains your notes and should be handled according to your institution's policies.");
  });
  $("import").addEventListener("click", () => $("file").click());
  $("file").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 100000) throw new Error("File is too large. Choose an assessment file under 100 KB.");
      const imported = Strata.importState(JSON.parse(await file.text()));
      if (!replaceAllowed()) return;
      populate(imported.state, null, imported.notice);
      dirty = true;
      message(imported.notice || "Assessment file opened. It has not been saved on this device.");
    } catch (error) { message("Could not open this assessment: " + error.message + " Current answers were kept."); }
    finally { event.target.value = ""; }
  });
  $("clear").addEventListener("click", () => {
    if (!window.confirm("Clear all current answers and this page's saved assessment from this browser? Downloaded files will not be deleted.")) return;
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      message("Could not remove the device save: " + error.message + " Nothing was cleared. Use browser site settings to remove stored data.");
      return;
    }
    populate(Strata.blank());
    showLayer(0);
    dirty = false;
    message("Current answers and the device save were cleared. Downloaded copies were not deleted.");
  });
  $("print").addEventListener("click", () => { render(); window.print(); });
  let printState;
  window.addEventListener("beforeprint", () => {
    if (!printState) {
      printState = {
        theme: document.documentElement.dataset.theme,
        layers: [...$("hero-layers").querySelectorAll("details")].map(details => ({ details, open: details.open }))
      };
    }
    for (const { details } of printState.layers) details.open = true;
    document.documentElement.dataset.theme = "light";
    render();
  });
  window.addEventListener("afterprint", () => {
    if (!printState) return;
    document.documentElement.dataset.theme = printState.theme;
    for (const { details, open } of printState.layers) details.open = open;
    printState = undefined;
  });
  window.addEventListener("beforeunload", event => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
})();
