const STATE_FILE="state-status.json";
const $=id=>document.getElementById(id);
let stateData=null;
const actions={
 prepare:["Keep your state Medicaid contact information current.","Read every notice from your Medicaid agency and note any response deadline.","If you may be subject to the requirement, keep records of work, earnings, education, training, or volunteer activities that your state says it accepts.","Ask the state agency or a qualified assister whether an exclusion or exception may apply.","Complete all other renewal and information requests on time."],
 notice:["Read the entire notice and identify the exact action requested and the response deadline.","Use the contact information printed on the notice or the official state Medicaid website.","Ask whether the notice concerns community engagement, renewal, income, residency, or another eligibility factor.","Keep a copy of the notice and any response you submit.","If you need help, contact a state-approved assister or legal aid organization."],
 renewal:["Check your renewal date and follow the instructions from your state.","Update your mailing address, phone number, and email with the state agency.","Return requested renewal information by the deadline—even if your state has announced a hold-harmless period.","Use the official state application or renewal portal.","Keep confirmation that you submitted the renewal."],
 understand:["The federal requirement applies only to defined Medicaid groups and is subject to exclusions and exceptions.","The state-specific status shown here is based on publicly available announcements and is not an eligibility determination.","Ask your state whether your Medicaid coverage group is included and whether an exclusion or exception may apply.","Read official notices carefully and keep contact information current."]
};
function statusCopy(s){
 if(s.status==="announced") return {label:"State announced participation",cls:"",detail:"The state has publicly announced that it plans to use the CMS hold-harmless option. CMS guidance requires state approval of the mitigation plan before the option is implemented. The state still assesses compliance; the approved period may pause denials or disenrollments based solely on community-engagement noncompliance."};
 if(s.status==="intent") return {label:"State announced intent",cls:"intent",detail:"The state has announced an intention to use the option or submit a plan. This is not the same as confirmed CMS approval. Check the state agency for the latest implementation details."};
 if(s.status==="declined") return {label:"State announced it will not participate",cls:"unverified",detail:"The state has publicly said it will not use the optional hold-harmless period. The January 1, 2027 federal baseline therefore remains relevant for applicable individuals, subject to any other approved relief or later change."};
 return {label:"No election verified in this guide",cls:"unverified",detail:"We have not verified a public state announcement about the optional hold-harmless period. Do not assume the state has declined. Whether the federal requirement applies in this state depends on the coverage groups subject to the law and any state-specific waiver or approved relief. Check the state agency."};
}
function renderGroups(){
 const container = $("state-groups");
 container.innerHTML = "";
 const groups = [
  {title:"State announced participation", cls:"", items:stateData.states.filter(s=>s.status==="announced"), desc:"State agencies have publicly announced participation; CMS plan approval is a separate step."},
  {title:"State announced intent", cls:"intent-card", items:stateData.states.filter(s=>s.status==="intent"), desc:"The state has announced intent; do not treat this as final CMS approval."}
 ];
 groups.forEach(g=>{
  const card=document.createElement("div"); card.className="group-card "+g.cls;
  const heading=document.createElement("h4"); heading.textContent=g.title+" ("+g.items.length+")"; card.appendChild(heading);
  const desc=document.createElement("p"); desc.textContent=g.desc; card.appendChild(desc);
  g.items.forEach(s=>{ const b=document.createElement("button"); b.className="state-chip"; b.type="button"; b.textContent=s.name; b.addEventListener("click",()=>{ $("state-select").value=s.code; renderState(s); $("state-result").scrollIntoView({behavior:"smooth",block:"nearest"}); }); card.appendChild(b); });
  if(!g.items.length){ const empty=document.createElement("span"); empty.className="micro"; empty.textContent="No state records yet."; card.appendChild(empty); }
  container.appendChild(card);
 });
 const unverified=stateData.states.filter(s=>s.status==="unverified");
 const card=document.createElement("div"); card.className="group-card neutral-card";
 const heading=document.createElement("h4"); heading.textContent="No hold-harmless election verified ("+unverified.length+")"; card.appendChild(heading);
 const desc=document.createElement("p"); desc.textContent="No public state election has been verified in this initial dataset. This does not mean the state declined or that every Medicaid enrollee in the state is subject to the federal requirement. Check the state agency and your coverage group."; card.appendChild(desc);
 container.appendChild(card);
}
function renderState(s){
 const c=statusCopy(s);
 $("state-result").innerHTML=`<article class="status-card"><div class="status-head"><h3>${s.name}</h3><span class="status-badge ${c.cls}">${c.label}</span></div><p>${s.summary}</p><p class="status-note">${c.detail}</p><div class="status-actions"><a href="${s.source_url || s.agency_directory_url || "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip"}" target="_blank" rel="noopener">${s.source_url ? "State announcement source ↗" : "No state announcement source verified"}</a><a href="https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip" target="_blank" rel="noopener">Find official state Medicaid contacts ↗</a><a href="${stateData.federal_source}" target="_blank" rel="noopener">CMS federal guidance ↗</a></div><div class="pathway"><h4>Choose what you need help with</h4><div class="pathway-choices"><button class="choice" data-path="understand">Understand whether the change may apply</button><button class="choice" data-path="prepare">Prepare for upcoming requirements</button><button class="choice" data-path="notice">I received a Medicaid notice</button><button class="choice" data-path="renewal">I need help with renewal</button></div><div id="action-output" class="action-output" hidden></div></div><p class="micro">Status record reviewed ${s.reviewed_on}. State announcements and CMS approvals may change.</p></article>`;
 document.querySelectorAll("[data-path]").forEach(b=>b.addEventListener("click",()=>showActions(b.dataset.path,s)));
 const u=new URL(location.href);u.searchParams.set("state",s.code);history.replaceState({}, "",u);
}
function showActions(type,s){
 const list=actions[type]||actions.understand;
 $("action-output").hidden=false;
 $("action-output").innerHTML=`<h4>Your next-step checklist</h4><ol>${list.map(x=>`<li>${x}</li>`).join("")}</ol><p class="micro">This is a general checklist, not an eligibility decision. Confirm requirements and deadlines with ${s.name}'s Medicaid agency.</p><button class="button secondary" onclick="window.print()">Print checklist</button>`;
}
async function init(){
 try{
  const res=await fetch(STATE_FILE,{cache:"no-store"});if(!res.ok)throw new Error("status file unavailable");
  stateData=await res.json();
  const sel=$("state-select");
  stateData.states.sort((a,b)=>a.name.localeCompare(b.name)).forEach(s=>{const o=document.createElement("option");o.value=s.code;o.textContent=s.name;sel.appendChild(o)});
  $("reviewed-date").textContent="State information last reviewed: "+new Date(stateData.last_reviewed+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})+". Status can change.";
  renderGroups();
  const initial=new URLSearchParams(location.search).get("state");
  if(initial){sel.value=initial.toUpperCase();const s=stateData.states.find(x=>x.code===sel.value);if(s)renderState(s);}
  $("check-state").addEventListener("click",()=>{const s=stateData.states.find(x=>x.code===sel.value);if(s)renderState(s);else $("state-result").innerHTML='<p class="micro">Please select a state.</p>'});
  sel.addEventListener("change",()=>{if(sel.value){const s=stateData.states.find(x=>x.code===sel.value);if(s)renderState(s)}});
 }catch(e){$("state-result").innerHTML='<p class="micro">State information could not be loaded. Please use the official Medicaid contact directory.</p>';}
}
document.addEventListener("DOMContentLoaded",init);