function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function initHourPlanner() {
  const fields = [...document.querySelectorAll("[data-hour-input]")];
  const totalLabel = document.querySelector("[data-hours-total]");
  if (!fields.length || !totalLabel) return;
  const fill = document.querySelector("[data-progress-fill]");
  const bar = document.querySelector("[data-progressbar]");
  const message = document.querySelector("[data-hours-message]");
  const earningsField = document.querySelector("[data-monthly-earnings]");
  const earningsMessage = document.querySelector("[data-earnings-message]");
  const halfTime = document.querySelector("[data-half-time-education]");
  const educationMessage = document.querySelector("[data-education-message]");

  function update() {
    const total = fields.reduce((sum, field) => {
      const value = Number(field.value);
      return sum + (Number.isFinite(value) && value > 0 ? value : 0);
    }, 0);
    const rounded = Math.round(total * 10) / 10;
    const remaining = Math.max(0, 80 - rounded);
    totalLabel.textContent = rounded + " / 80";
    if (fill) fill.style.width = Math.min(100, rounded / 80 * 100) + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(Math.min(80, rounded)));
    if (message) {
      message.textContent = rounded >= 80
        ? "You entered 80 or more hours. This is a planning total only; your state decides whether activities qualify and how they must be verified."
        : rounded + " hours entered · " + remaining + " more hours to reach the 80-hour planning reference.";
    }
    if (earningsField && earningsMessage) {
      const earnings = Number(earningsField.value);
      earningsMessage.textContent = Number.isFinite(earnings) && earnings >= 580
        ? "You entered $580 or more in monthly earnings. CMS currently lists this as another federal pathway. Your state must confirm how income is counted and whether the rule applies to you."
        : "CMS's public guide currently lists at least $580 in monthly earnings as another pathway. Confirm the current amount and how your state counts income.";
    }
    if (halfTime && educationMessage) {
      educationMessage.textContent = halfTime.checked
        ? "You selected half-time enrollment. CMS public guidance describes half-time education as a separate pathway; your state must confirm the enrollment definition and documentation."
        : "CMS guidance describes half-time education as a separate pathway. Confirm your enrollment status with your state.";
    }
  }
  fields.forEach(field => field.addEventListener("input", update));
  if (earningsField) earningsField.addEventListener("input", update);
  if (halfTime) halfTime.addEventListener("change", update);
  const print = document.querySelector("[data-print-planner]");
  if (print) print.addEventListener("click", () => window.print());
  update();
}

function initDeadlineCalculator() {
  const field = document.querySelector("[data-deadline-input]");
  const button = document.querySelector("[data-deadline-calc]");
  const output = document.querySelector("[data-deadline-output]");
  if (!field || !button || !output) return;
  button.addEventListener("click", () => {
    output.replaceChildren();
    if (!field.value) {
      output.textContent = "Choose the date printed on your official notice.";
      return;
    }
    const [year, month, day] = field.value.split("-").map(Number);
    const deadline = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((deadline - today) / 86400000);
    const headline = days < 0 ? "Date has passed" : days === 0 ? "Date is today" : days + " days remaining";
    const body = days < 0
      ? "The date you entered was " + Math.abs(days) + " calendar day(s) ago. Contact the agency promptly to ask what options remain."
      : days === 0
        ? "The date you entered is today. Contact the agency immediately if you have not completed the requested action."
        : days + " calendar day(s) remain until the date you entered. Do not wait until the last day to contact the agency or submit information.";
    output.appendChild(element("strong", "deadline-count", headline));
    output.appendChild(element("p", "", body));
    output.appendChild(element("p", "micro", "This calculator counts calendar days only. The official notice controls; contact the agency if the date or deadline is unclear."));
  });
  const print = document.querySelector("[data-print-deadline]");
  if (print) print.addEventListener("click", () => window.print());
}

function initRenewalChecklist() {
  const items = [...document.querySelectorAll("[data-checklist-item]")];
  const status = document.querySelector("[data-checklist-status]");
  const progress = document.querySelector("[data-checklist-progress]");
  if (!items.length || !status) return;
  function update() {
    const complete = items.filter(item => item.checked).length;
    status.textContent = complete + " of " + items.length + " preparation steps checked";
    if (progress) progress.style.width = (complete / items.length * 100) + "%";
  }
  items.forEach(item => item.addEventListener("change", update));
  const print = document.querySelector("[data-print-checklist]");
  if (print) print.addEventListener("click", () => window.print());
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  initHourPlanner();
  initDeadlineCalculator();
  initRenewalChecklist();
});