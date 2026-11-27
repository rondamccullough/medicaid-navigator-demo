const $ = (id) => document.getElementById(id);
let stateData = null;
let programData = null;

const statusLabels = {
  announced: { label: "State announced participation", className: "announced", detail: "The state has publicly announced that it plans to use the optional CMS hold-harmless period. An announcement is not the same as confirmed CMS approval. The state still assesses applicable individuals; an approved period may pause certain denials or disenrollments based solely on community-engagement noncompliance." },
  intent: { label: "State announced intent", className: "intent", detail: "The state has announced an intention to use the option or submit a plan. This is not proof of CMS approval. Check the state and CMS for the latest status." },
  not_applicable: { label: "CMS page currently says requirement does not apply", className: "not-applicable", detail: "CMS's current state-specific page says the new Medicaid community-engagement work requirement does not apply in this state. This is a state-page applicability statement, not a hold-harmless election. Recheck the official CMS page and state agency for updates." },
  declined: { label: "State announced it will not participate", className: "declined", detail: "A state announcement says it will not use this optional hold-harmless period. The federal implementation framework may still apply to defined individuals, subject to exclusions, exceptions, and any other approved relief." },
  unverified: { label: "No election verified in this guide", className: "unverified", detail: "We have not verified a public state announcement in this independent tracker. This does not mean the state declined. Check the official CMS state page and your state Medicaid agency." }
};

const plans = {
  prepare: { title: "Prepare for possible Medicaid changes", intro: "Start with your coverage group and your state's instructions. The federal change does not apply to every Medicaid member.", steps: ["Keep your mailing address, phone number, and email current with the state Medicaid agency.", "Watch for official mail, email, and account messages. Read every notice and note its deadline.", "Ask the state whether your Medicaid coverage group is subject to the community-engagement requirement.", "If it may apply, ask which activities count, what records are accepted, and when information must be submitted.", "Ask whether an exclusion, exception, or other pathway may apply to your circumstances."] },
  notice: { title: "Organize a response to a Medicaid notice", intro: "The notice itself is the starting point. Different notices can concern renewal, income, residency, community engagement, or another eligibility issue.", steps: ["Read the entire notice and identify the exact action requested.", "Write down the notice date and the response deadline. Use the deadline calculator below if helpful.", "Identify whether the notice concerns community engagement or a different eligibility factor.", "Use the phone number, website, or mailing address printed on the notice or listed by the official state agency.", "Keep a copy of the notice and confirmation of anything you submit. If you disagree with a decision, follow the appeal instructions in the notice."] },
  renewal: { title: "Get organized for a Medicaid renewal", intro: "A hold-harmless period does not pause every Medicaid rule or renewal deadline. Continue to follow your state's renewal instructions.", steps: ["Check your renewal date and the response deadline shown in the official notice.", "Update your contact information with the state Medicaid agency.", "Open and read all mail and electronic messages from the agency.", "Use the official state portal or submission method listed in your notice.", "Keep copies and submission confirmations. Contact a qualified assister if you need help."] },
  applying: { title: "Prepare to apply for Medicaid", intro: "Applications and eligibility decisions are handled by the state. Use the official state process and confirm which information is required for your household.", steps: ["Open your state's official Medicaid application page using the government links below.", "Review the state's current instructions before starting an application.", "Ask whether the 2027 community-engagement rules apply to the coverage group for which you are applying.", "Use only the agency's official portal or contact channels to submit information.", "Save the application confirmation and any notices or follow-up requests."] },
  unsure: { title: "Find out what questions to ask", intro: "You do not need to assume that a federal change applies to you. The state can confirm your coverage group and explain current instructions.", steps: ["Identify the name of your Medicaid coverage category from your card, account, or official notice.", "Ask the state Medicaid agency whether that coverage group is included in the community-engagement requirement.", "Ask whether any exclusions, exceptions, or alternative pathways may apply.", "Ask when the state will verify information and what documentation it accepts.", "Do not miss ordinary renewal deadlines while waiting for an answer."] }
};

function makeElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}
function addLink(parent, href, label, className = "resource-link") {
  if (!href) return;
  const link = makeElement("a", className, label);
  link.href = href;
  if (!href.startsWith("#")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  parent.appendChild(link);
}
function getStatePageUrl(state) {
  return state.cms_state_page_url || ("https://www.medicaid.gov/renew-info/" + state.code.toLowerCase());
}
function renderPrograms() {
  const container = $("program-cards");
  container.replaceChildren();
  programData.programs.forEach((program) => {
    const card = makeElement("article", "program-card " + (program.status === "active" ? "program-active" : "program-preview"));
    const top = makeElement("div", "program-card-top");
    top.appendChild(makeElement("span", "program-status " + program.status, program.statusLabel));
    top.appendChild(makeElement("span", "program-icon", program.icon));
    card.appendChild(top);
    card.appendChild(makeElement("h3", "", program.name));
    card.appendChild(makeElement("p", "", program.description));
    const links = makeElement("div", "program-links");
    if (program.status === "active") addLink(links, program.primaryUrl, "Use the interactive tools →");
    else {
      addLink(links, program.primaryUrl, program.primaryLabel || "Open official program resources ↗");
      card.appendChild(makeElement("p", "program-note", "Official resources are available now. Radiant Motive's guided tools for this program are planned for a later release."));
    }
    if (program.secondaryUrl) addLink(links, program.secondaryUrl, program.secondaryLabel || "More official information ↗");
    card.appendChild(links);
    container.appendChild(card);
  });
}
function appendStateChips(parent, states) {
  const list = makeElement("div", "chip-list");
  states.forEach((state) => {
    const button = makeElement("button", "state-chip", state.name);
    button.type = "button";
    button.addEventListener("click", () => {
      $("state-select").value = state.code;
      renderState(state);
    });
    list.appendChild(button);
  });
  parent.appendChild(list);
}
function renderStateGroups() {
  const container = $("state-groups");
  container.replaceChildren();
  [
    { key: "announced", title: "Announced participation", note: "Public state announcements; CMS approval is a separate step." },
    { key: "intent", title: "Announced intent", note: "A stated intention is not confirmation of CMS approval." },
    { key: "not_applicable", title: "CMS page says requirement does not apply", note: "This is a current CMS state-page statement. Open the official page to confirm details." }
  ].forEach((group) => {
    const matches = stateData.states.filter((state) => state.status === group.key);
    const card = makeElement("div", "group-card " + group.key);
    card.appendChild(makeElement("h4", "", group.title + " (" + matches.length + ")"));
    card.appendChild(makeElement("p", "", group.note));
    appendStateChips(card, matches);
    container.appendChild(card);
  });
  const unverified = stateData.states.filter((state) => state.status === "unverified");
  const details = makeElement("details", "group-card unverified");
  const summary = makeElement("summary", "", "Not verified in this tracker (" + unverified.length + ")");
  details.appendChild(summary);
  details.appendChild(makeElement("p", "", "Not verified does not mean declined. Select a state to open its official CMS page and state agency directory."));
  appendStateChips(details, unverified);
  container.appendChild(details);
}
function renderState(state) {
  const result = $("state-result");
  result.replaceChildren();
  const status = statusLabels[state.status] || statusLabels.unverified;
  const card = makeElement("article", "status-card");
  const head = makeElement("div", "status-head");
  head.appendChild(makeElement("h4", "", state.name));
  head.appendChild(makeElement("span", "status-badge " + status.className, status.label));
  card.appendChild(head);
  card.appendChild(makeElement("p", "state-summary", state.summary));
  card.appendChild(makeElement("p", "status-note", status.detail));
  const links = makeElement("div", "status-actions");
  if (state.source_url) addLink(links, state.source_url, "State announcement source ↗");
  addLink(links, getStatePageUrl(state), "CMS " + state.name + " Medicaid update ↗");
  addLink(links, "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip", "State Medicaid agency directory ↗");
  addLink(links, stateData.federal_source, "CMS federal guidance ↗");
  card.appendChild(links);
  card.appendChild(makeElement("p", "micro", "State record reviewed " + state.reviewed_on + ". This independent tracker may not reflect a later state or CMS update."));
  result.appendChild(card);
  const url = new URL(window.location.href);
  url.searchParams.set("state", state.code);
  window.history.replaceState({}, "", url);
}
function renderPlan() {
  const stateCode = $("state-select").value;
  const state = stateData.states.find((item) => item.code === stateCode);
  if (!state) {
    $("plan-result").hidden = false;
    $("plan-result").replaceChildren(makeElement("p", "validation-message", "Please choose your state so we can show the right official links."));
    $("state-select").focus();
    return;
  }
  const selectedPlan = plans[$("need-select").value] || plans.prepare;
  renderState(state);
  const section = $("plan-result");
  section.hidden = false;
  section.replaceChildren();
  const card = makeElement("div", "plan-card");
  const heading = makeElement("div", "plan-heading");
  heading.appendChild(makeElement("p", "eyebrow", "Your starting point · " + state.name));
  heading.appendChild(makeElement("h2", "", selectedPlan.title));
  heading.appendChild(makeElement("p", "plan-intro", selectedPlan.intro));
  card.appendChild(heading);
  const list = document.createElement("ol");
  selectedPlan.steps.forEach((step) => list.appendChild(makeElement("li", "", step)));
  card.appendChild(list);
  const resources = makeElement("div", "plan-resources");
  resources.appendChild(makeElement("h3", "", "Official resources for " + state.name));
  addLink(resources, getStatePageUrl(state), "CMS state-specific Medicaid update ↗");
  addLink(resources, "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip", "Find the state Medicaid agency ↗");
  addLink(resources, stateData.federal_source, "Read the federal CMS guidance ↗");
  card.appendChild(resources);
  card.appendChild(makeElement("p", "plan-disclaimer", "This plan is general educational guidance. It does not determine whether a requirement applies to you or replace the instructions in an official notice."));
  const print = makeElement("button", "button secondary", "Print this plan");
  print.type = "button";
  print.addEventListener("click", () => window.print());
  card.appendChild(print);
  section.appendChild(card);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}
function updateActivityPlanner() {
  const ids = ["work-hours", "service-hours", "training-hours", "education-hours"];
  const total = ids.reduce((sum, id) => {
    const value = Number($(id).value);
    return sum + (Number.isFinite(value) && value > 0 ? value : 0);
  }, 0);
  const rounded = Math.round(total * 10) / 10;
  const remaining = Math.max(0, 80 - rounded);
  const percent = Math.min(100, (rounded / 80) * 100);
  $("hours-total").textContent = rounded + " / 80";
  $("hours-progress-fill").style.width = percent + "%";
  $("hours-progress").setAttribute("aria-valuenow", String(Math.min(80, rounded)));
  if (rounded >= 80) {
    $("hours-message").textContent = "You entered 80 or more hours. This is a planning total only; your state decides whether activities qualify and how they must be verified.";
    $("hours-message").className = "result-message result-caution";
  } else {
    $("hours-message").textContent = rounded + " hours entered · " + remaining + " more hours to reach the 80-hour planning reference.";
    $("hours-message").className = "result-message";
  }
  const earnings = Number($("monthly-earnings").value);
  if (Number.isFinite(earnings) && earnings >= 580) {
    $("earnings-message").textContent = "You entered $580 or more in monthly earnings. CMS currently lists this as another federal pathway. Your state must confirm how income is counted and whether the rule applies to you.";
    $("earnings-message").className = "earnings-message result-caution";
  } else {
    $("earnings-message").textContent = "CMS's public guide currently lists at least $580 in monthly earnings as another pathway. Confirm the current amount and how your state counts income.";
    $("earnings-message").className = "earnings-message";
  }
  if ($("half-time-education").checked) {
    $("education-message").textContent = "You selected half-time enrollment. CMS public guidance describes half-time education as a separate pathway; your state must confirm the enrollment definition and documentation.";
    $("education-message").className = "earnings-message result-caution";
  } else {
    $("education-message").textContent = "CMS guidance describes half-time education as a separate pathway. Confirm your enrollment status with your state.";
    $("education-message").className = "earnings-message";
  }
}
function calculateDeadline() {
  const value = $("deadline-date").value;
  const output = $("deadline-result");
  output.replaceChildren();
  if (!value) {
    output.textContent = "Choose the date printed on your official notice.";
    return;
  }
  const [year, month, day] = value.split("-").map(Number);
  const deadline = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((deadline - today) / 86400000);
  const message = days < 0 ? "The date you entered was " + Math.abs(days) + " calendar day(s) ago. Contact the agency promptly to ask what options remain." : days === 0 ? "The date you entered is today. Contact the agency immediately if you have not completed the requested action." : days + " calendar day(s) remain until the date you entered. Do not wait until the last day to contact the agency or submit information.";
  output.appendChild(makeElement("strong", "deadline-count", days < 0 ? "Date has passed" : days === 0 ? "Date is today" : days + " days remaining"));
  output.appendChild(makeElement("p", "", message));
  output.appendChild(makeElement("p", "micro", "This calculator counts calendar days only. The official notice controls; contact the agency if the date or deadline is unclear."));
}
async function init() {
  try {
    const [stateResponse, programResponse] = await Promise.all([fetch("./state-status.json", { cache: "no-store" }), fetch("./programs.json", { cache: "no-store" })]);
    if (!stateResponse.ok || !programResponse.ok) throw new Error("Could not load the guide data.");
    stateData = await stateResponse.json();
    programData = await programResponse.json();
    const select = $("state-select");
    stateData.states.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((state) => {
      const option = makeElement("option", "", state.name);
      option.value = state.code;
      select.appendChild(option);
    });
    $("reviewed-date").textContent = "State tracker last reviewed: " + new Date(stateData.last_reviewed + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) + ". Status can change.";
    renderPrograms();
    renderStateGroups();
    const params = new URLSearchParams(window.location.search);
    const initialState = params.get("state");
    if (initialState) select.value = initialState.toUpperCase();
    if (select.value) {
      const initial = stateData.states.find((item) => item.code === select.value);
      if (initial) renderState(initial);
    }
    $("build-plan").addEventListener("click", renderPlan);
    ["work-hours", "service-hours", "training-hours", "education-hours", "monthly-earnings"].forEach((id) => $(id).addEventListener("input", updateActivityPlanner));
    $("half-time-education").addEventListener("change", updateActivityPlanner);
    $("print-hours").addEventListener("click", () => window.print());
    $("calculate-deadline").addEventListener("click", calculateDeadline);
  } catch (error) {
    $("program-cards").replaceChildren(makeElement("p", "validation-message", "Program guides could not be loaded. Please refresh the page or use the official resources linked in the guide library."));
    $("state-result").replaceChildren(makeElement("p", "validation-message", "State information could not be loaded. Use the official Medicaid agency directory while we restore the tracker."));
    $("reviewed-date").textContent = "State tracker temporarily unavailable.";
  }
}
document.addEventListener("DOMContentLoaded", init);