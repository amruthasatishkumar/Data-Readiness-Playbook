# STRATA: AI data readiness playbook

An interactive self-assessment that helps an institution decide whether its data is ready to support a specific AI use case, such as an advising assistant or a RAG chatbot.

**STRATA** (A Layered Data Architecture for Reliable Enterprise AI) holds that reliable AI needs more than clean data. It scores six peer layers:

| Layer | Question it asks |
|---|---|
| **S**ourced | Are these the facts your institution can stand behind? |
| **T**raceable | Can you explain how the answer got here? |
| **R**etrievable | Can the right user get the right evidence, and only that? |
| **A**ligned | Does the evidence mean what everyone thinks it means? |
| **T**imely | Is the evidence current enough for this decision? |
| **A**udited | Can you demonstrate and sustain responsible operation? |

## How it works

1. **Understand**: explore what each layer means.
2. **Assess**: pick one use case and answer 18 questions (three per layer) with Yes, No or Not sure. Critical questions are flagged.
3. **Act**: get six separate layer scores, the critical gaps that remain open, suggested owners for each layer and a 30/60/90-day action plan.

There is deliberately no blended "AI-ready" percentage: a strong layer can't cancel a critical gap in another.

A **worked example** compares a risky student-advising proposal with a narrower advisor-support pilot at a fictional college (synthetic data only).

## Privacy

Everything runs in the browser. There is no sign-in, analytics or answer submission. You can print the report, download an editable JSON copy to reopen later, or save it on your device.

## Run it

It's a static site with no build step:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Or enable GitHub Pages on this repository (the `.nojekyll` file is already in place).

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `assessment.js` | The six layers, 18 questions, scoring and validation |
| `advising-case.js` | Synthetic before/after worked example |
| `app.js` | Rendering, navigation, save/export |
| `styles.css` | Styles, including print and dark theme |

## Licence

[MIT](LICENSE). A self-assessment aid, not a certification, compliance opinion or approval to deploy AI.
