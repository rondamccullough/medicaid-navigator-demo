(function () {
  "use strict";
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const money = value => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

  function initHoursConverter() {
    const amount = document.querySelector("[data-convert-hours]");
    const frequency = document.querySelector("[data-convert-frequency]");
    const monthly = document.querySelector("[data-convert-monthly]");
    const summary = document.querySelector("[data-convert-summary]");
    const weekly = document.querySelector("[data-convert-weekly]");
    if (!amount || !frequency || !monthly) return;
    function update() {
      const value = Number(amount.value);
      if (!amount.value || !Number.isFinite(value) || value < 0) {
        monthly.textContent = "—";
        summary.textContent = "Enter your hours to see a monthly estimate.";
        weekly.textContent = "Equivalent weekly average: —";
        return;
      }
      const factors = { weekly: 52 / 12, biweekly: 26 / 12, semimonthly: 2, monthly: 1 };
      const monthTotal = value * factors[frequency.value];
      const weekAverage = monthTotal * 12 / 52;
      monthly.textContent = monthTotal.toFixed(1) + " hours";
      summary.textContent = monthTotal >= 80
        ? "Your schedule converts to " + monthTotal.toFixed(1) + " estimated hours per month. This reaches or exceeds the 80-hour planning reference only; it does not confirm that the hours qualify."
        : "Your schedule converts to " + monthTotal.toFixed(1) + " estimated hours per month. This is " + (80 - monthTotal).toFixed(1) + " hours below the 80-hour planning reference.";
      weekly.textContent = "Equivalent weekly average: " + weekAverage.toFixed(1) + " hours.";
    }
    amount.addEventListener("input", update);
    frequency.addEventListener("change", update);
    const print = document.querySelector("[data-print-converter]");
    if (print) print.addEventListener("click", () => window.print());
    update();
  }

  function initIncomeConverter() {
    const amount = document.querySelector("[data-pay-amount]");
    const frequency = document.querySelector("[data-pay-frequency]");
    const monthly = document.querySelector("[data-pay-monthly]");
    const summary = document.querySelector("[data-pay-summary]");
    const annual = document.querySelector("[data-pay-annual]");
    if (!amount || !frequency || !monthly) return;
    function update() {
      const value = Number(amount.value);
      if (!amount.value || !Number.isFinite(value) || value < 0) {
        monthly.textContent = "—";
        summary.textContent = "Enter an amount to see a monthly estimate.";
        annual.textContent = "Estimated annual gross amount: —";
        return;
      }
      const monthlyFactors = { weekly: 52 / 12, biweekly: 26 / 12, semimonthly: 2, monthly: 1, annually: 1 / 12 };
      const annualFactors = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12, annually: 1 };
      const monthValue = value * monthlyFactors[frequency.value];
      const annualValue = value * annualFactors[frequency.value];
      monthly.textContent = money(monthValue);
      summary.textContent = "Based on the pay frequency selected, your estimated gross monthly average is " + money(monthValue) + ".";
      annual.textContent = "Estimated annual gross amount: " + money(annualValue) + ".";
    }
    amount.addEventListener("input", update);
    frequency.addEventListener("change", update);
    const print = document.querySelector("[data-print-income]");
    if (print) print.addEventListener("click", () => window.print());
    update();
  }

  function initNoticePlanner() {
    const kind = document.querySelector("[data-notice-kind]");
    const received = document.querySelector("[data-notice-received]");
    const response = document.querySelector("[data-notice-response]");
    const action = document.querySelector("[data-notice-action]");
    const output = document.querySelector("[data-notice-output]");
    const build = document.querySelector("[data-build-notice-plan]");
    if (!kind || !output || !build) return;
    const steps = {
      renewal: ["Confirm the renewal response date and the submission method shown in the notice.", "Check whether the agency needs a renewal form, updated information, or both.", "Ask which household or income details must be updated and what records are accepted.", "Ask how to confirm that the renewal was received and whether anything else is outstanding.", "Keep the notice and submission confirmation together."],
      missing: ["Identify each item the agency says is missing; do not assume one document answers every request.", "Ask what formats and submission channels the agency accepts.", "Ask whether copies are acceptable and whether originals are required.", "Confirm the response date and how the agency will confirm receipt.", "Keep a copy of the request and everything submitted."],
      income: ["Ask which income source or household detail needs clarification.", "Ask whether the agency wants gross pay, net pay, pay stubs, employer information, or another record.", "Explain if income or hours vary and ask how to report changes.", "Confirm the deadline and secure submission method.", "Ask how to correct the record if the information on the notice is inaccurate."],
      engagement: ["Ask whether your specific Medicaid coverage group is subject to the community-engagement requirement in your state.", "Ask which activity pathways the state recognizes and how it defines the reporting month.", "Ask what records or verification the state accepts and when they must be submitted.", "Ask whether an exclusion, exception, or other pathway may apply; the agency must assess your circumstances.", "Ask how to correct an inaccurate record and what appeal instructions apply if the state makes an adverse decision."],
      decision: ["Identify the exact reason for the denial, closure, or reduction stated in the notice.", "Confirm the effective date and the action the agency has taken.", "Read the appeal or fair-hearing instructions and note the deadline exactly as printed.", "Ask the agency how to obtain the case record or explanation if the reason is unclear.", "Ask what submission method is accepted and how to confirm that a request was received."],
      appeal: ["Read the full appeal or fair-hearing instructions, including the filing deadline.", "Ask which filing methods are accepted and whether a specific form is required.", "Ask how to confirm the appeal request was received.", "Ask whether there are options related to continued benefits and what rules or deadlines apply.", "Keep copies of the notice, appeal request, and delivery confirmation."],
      other: ["Identify the exact action requested and the reason for the notice.", "Confirm the response date and how the agency expects you to respond.", "Ask the agency to explain any unfamiliar term or instruction.", "Ask how to confirm receipt and whether more information is needed.", "Keep the notice and a record of your response."]
    };
    function buildPlan() {
      output.replaceChildren();
      output.appendChild(make("h3", "", "Your notice action checklist"));
      const receivedDate = received && received.value ? new Date(received.value + "T12:00:00").toLocaleDateString() : "";
      const responseDate = response && response.value ? new Date(response.value + "T12:00:00").toLocaleDateString() : "";
      output.appendChild(make("p", "micro", "Notice type: " + kind.options[kind.selectedIndex].text + (receivedDate ? " · Received: " + receivedDate : "") + (responseDate ? " · Response date shown: " + responseDate : "")));
      const list = document.createElement("ol");
      (steps[kind.value] || steps.other).forEach(text => list.appendChild(make("li", "", text)));
      output.appendChild(list);
      if (action && action.value.trim()) {
        output.appendChild(make("h4", "", "What the notice asks you to do"));
        output.appendChild(make("p", "", action.value.trim()));
      }
      output.appendChild(make("p", "micro", "This is a general organizer, not a legal interpretation. The official notice and state agency instructions control."));
    }
    build.addEventListener("click", buildPlan);
    const print = document.querySelector("[data-print-notice-plan]");
    if (print) print.addEventListener("click", () => {
      if (!output.querySelector("ol")) buildPlan();
      window.print();
    });
  }

  function initCallPrep() {
    const topic = document.querySelector("[data-call-topic]");
    const container = document.querySelector("[data-call-questions]");
    const count = document.querySelector("[data-call-count]");
    if (!topic || !container || !count) return;
    const questions = {
      renewal: ["What is my renewal due date and what must I submit?", "Can the agency renew my coverage using information it already has?", "What information or documents are still needed?", "How can I submit the renewal and confirm it was received?", "When should I expect a decision or another notice?", "Who can help if I do not understand the renewal request?"],
      notice: ["What action is the notice asking me to take?", "What is the exact response deadline?", "Which documents or information are required?", "Which secure submission methods can I use?", "How do I confirm the agency received my response?", "If I disagree with the notice, where are the appeal instructions?"],
      application: ["Which Medicaid coverage category should I ask about?", "What information is required to complete the application?", "How should I report household members and income?", "Can I get help completing the application?", "How can I confirm the application was received?", "How will the agency contact me if more information is needed?"],
      income: ["Which income sources are counted for this coverage category?", "Should I report gross pay, net pay, or another amount?", "How should variable hours, overtime, or irregular income be reported?", "How should self-employment or cash income be documented?", "Which pay periods or records should I submit?", "How can I correct an income record that is inaccurate?"],
      engagement: ["Does the community-engagement requirement apply to my coverage group in this state?", "Which activity pathways does the state recognize?", "What is the state's reporting period and how are hours counted?", "What records or verification does the state accept?", "How do I ask whether an exclusion or exception applies?", "How will the state notify me and how can I correct an error?"],
      coverage: ["Is my coverage currently active, pending, or closed?", "What is the effective date of any change?", "What reason does the agency have on record?", "Is any information or action still outstanding?", "How can I get the decision or explanation in writing?", "What appeal or review instructions and deadlines apply?"]
    };
    function updateCount() {
      count.textContent = container.querySelectorAll("input[data-call-question]:checked").length + " selected";
    }
    function update() {
      container.replaceChildren();
      (questions[topic.value] || questions.renewal).forEach(question => {
        const label = make("label", "checkbox-field");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.dataset.callQuestion = "true";
        input.addEventListener("change", updateCount);
        label.appendChild(input);
        label.appendChild(document.createTextNode(question));
        container.appendChild(label);
      });
      updateCount();
    }
    topic.addEventListener("change", update);
    const print = document.querySelector("[data-print-call]");
    if (print) print.addEventListener("click", () => window.print());
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHoursConverter();
    initIncomeConverter();
    initNoticePlanner();
    initCallPrep();
  });
})();