'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const TODAY = '2026-11-05';
const STORAGE_KEY = 'registry-design-prototype-v1';
const pageNames = {dashboard:'Office workbench',journeys:'File journeys',repository:'Document repository',approvals:'My approvals',intake:'Smart intake',archive:'Ask the Archive',leadership:'Command view',admin:'Administration',modules:'Framework modules',captureops:'Capture operations',repositorytools:'Repository workspace',discovery:'Search & discovery',workflows:'Workflow studio',teamwork:'Collaboration',correspondence:'Registry & correspondence',access:'Security & access',records:'Records lifecycle',reports:'Reporting centre',intelligence:'Intelligence lab',integrations:'Integration centre',platform:'Platform & administration',public:'Public submission preview',verify:'Letter verification preview'};
const departments = ['Human Resources', 'Finance & Accounts', 'General Administration', 'Policy & Planning'];
Object.assign(pageNames,{landing:'OHCSF EDMS',login:'Officer sign-in',mfa:'Verification preview'});
const route = ['Registry', 'Reviewing officer', 'Director', 'Permanent Secretary', 'Archive'];
const seedRecords = [
  {id:'REG/2026/0148',title:'Request for staff training approval',department:'Human Resources',type:'Memo',status:'Pending',due:'2026-11-04',date:'2026-11-02',owner:'Amina Bello',sender:'Director of Human Resources',level:'Internal',step:2,summary:'Approval requested for a three-day records management workshop for 18 officers. The proposed programme focuses on digital filing, classification and document handling.',file:'Staff_training_request.pdf'},
  {id:'REG/2026/0147',title:'Q4 office equipment procurement',department:'Finance & Accounts',type:'Request',status:'Pending',due:'2026-11-05',date:'2026-11-02',owner:'Chidi Okafor',sender:'Head of Procurement',level:'Confidential',step:2,summary:'Request to review the procurement schedule for office printers and scanning equipment. Budget details and vendor comparisons are included in the supporting documents.',file:'Q4_procurement.pdf'},
  {id:'REG/2026/0146',title:'Interdepartmental coordination meeting',department:'General Administration',type:'Letter',status:'Pending',due:'2026-11-06',date:'2026-11-03',owner:'Amina Bello',sender:'Director of Administration',level:'Internal',step:1,summary:'Invitation to a coordination meeting on the transition to digital records. Each department is requested to nominate one records liaison officer.',file:'Coordination_meeting.pdf'},
  {id:'REG/2026/0145',title:'Annual leave request - T. Adeyemi',department:'Human Resources',type:'Request',status:'Pending',due:'2026-11-03',date:'2026-10-30',owner:'Fatima Yusuf',sender:'Tunde Adeyemi',level:'Confidential',step:2,summary:'Annual leave requested for 16 to 27 November 2026. A handover note and supervisor recommendation are attached for review.',file:'Annual_leave_request.pdf'},
  {id:'REG/2026/0144',title:'Departmental budget review circular',department:'Finance & Accounts',type:'Circular',status:'Approved',due:'2026-11-02',date:'2026-10-29',owner:'Chidi Okafor',sender:'Director of Finance',level:'Internal',step:4,summary:'Departments are to submit their revised budget estimates and expenditure returns by 12 November 2026 using the approved template.',file:'Budget_review_circular.pdf'},
  {id:'REG/2026/0143',title:'Digital records transition guidelines',department:'General Administration',type:'Circular',status:'Approved',due:'2026-11-01',date:'2026-10-28',owner:'Amina Bello',sender:'Office of the Secretariat',level:'Internal',step:4,summary:'Guidelines for the pilot digital registry: assign a file reference, verify metadata, maintain a clear approval trail and keep sensitive records within the approved office environment.',file:'Digital_records_guidelines.pdf'},
  {id:'REG/2026/0142',title:'2027 departmental workplan submission',department:'Policy & Planning',type:'Memo',status:'Pending',due:'2026-11-09',date:'2026-11-04',owner:'Emeka Nwosu',sender:'Director of Planning',level:'Internal',step:3,summary:'Consolidated departmental workplan for the 2027 planning cycle, submitted for final review and approval.',file:'2027_workplan.pdf'},
  {id:'REG/2026/0141',title:'Monthly expenditure reconciliation',department:'Finance & Accounts',type:'Report',status:'Correction',due:'2026-11-07',date:'2026-10-31',owner:'Chidi Okafor',sender:'Accounts Unit',level:'Confidential',step:1,summary:'October expenditure reconciliation returned to the reviewing officer to clarify two entries and attach the missing supporting schedule.',file:'October_reconciliation.pdf'},
  {id:'REG/2026/0140',title:'October management meeting minutes',department:'General Administration',type:'Minutes',status:'Archived',due:'2026-10-30',date:'2026-10-27',owner:'Amina Bello',sender:'Secretariat Services',level:'Internal',step:4,summary:'Approved minutes of the October management meeting, including action points for departmental records officers and the next quarterly review.',file:'October_meeting_minutes.pdf'},
  {id:'REG/2026/0139',title:'New officer onboarding checklist',department:'Human Resources',type:'Circular',status:'Approved',due:'2026-10-29',date:'2026-10-26',owner:'Fatima Yusuf',sender:'Human Resources Unit',level:'Internal',step:4,summary:'An approved checklist covering staff registration, induction, account requests, departmental assignment and records handling orientation.',file:'Onboarding_checklist.pdf'}
];
const seedUsers = [
  {name:'Amina Bello',role:'Registry officer',department:'General Administration'},
  {name:'Chidi Okafor',role:'Reviewing officer',department:'Finance & Accounts'},
  {name:'Fatima Yusuf',role:'Director',department:'Human Resources'},
  {name:'Emeka Nwosu',role:'Reviewing officer',department:'Policy & Planning'}
];
function initialData() {
  return {records:seedRecords.map(record => ({...record,version:1,history:[{action:'Captured and registered',by:record.owner,time:`${record.date}T09:00:00`,note:'Metadata verified and a file reference assigned.'},{action:record.status === 'Pending' ? `Routed to ${route[record.step]}` : record.status === 'Correction' ? 'Returned for correction' : `Document ${record.status.toLowerCase()}`,by:'Secretariat workflow',time:`${record.date}T11:20:00`,note:record.status === 'Correction' ? 'Please clarify the entries and include the supporting schedule.' : 'Sample activity for the design preview.'}]})),users:structuredClone(seedUsers),settings:{twoFactor:true,watermark:true,localAI:true}};
}
let data = initialData();
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (saved && Array.isArray(saved.records) && Array.isArray(saved.users) && saved.settings && saved.records.every(record => typeof record.id === 'string' && Array.isArray(record.history) && departments.includes(record.department) && Number.isInteger(record.step) && record.step >= 0 && record.step <= 4 && ['Pending','Approved','Archived','Correction','Draft'].includes(record.status))) data = saved;
} catch { /* The demo remains usable when browser storage is unavailable. */ }
const state = {page:'dashboard',query:'',department:'All departments',status:'All statuses',view:'list',approvalTab:'Pending',docID:null,docTab:'preview',intake:null,answer:null,previewRole:'Registry officer',journeyID:null,journeyQuery:'',followUpID:null};
let lastFocus = null;
let storageWarningShown = false;
let archiveTimer;
function save() {
  try { localStorage.setItem(STORAGE_KEY,JSON.stringify(data)); }
  catch { if (!storageWarningShown) { storageWarningShown = true; toast('Browser storage is unavailable. Demo changes last until this page closes.',true); } }
}
const pending = () => data.records.filter(record => record.status === 'Pending');
const overdue = () => pending().filter(record => record.due < TODAY);
const closed = () => data.records.filter(record => ['Approved','Archived'].includes(record.status));
const initials = name => name.split(' ').map(part => part[0]).slice(0,2).join('');
const getRecord = id => data.records.find(record => record.id === id);
const isLate = record => record.status === 'Pending' && record.due < TODAY;
const dateLabel = value => new Date(`${value}T12:00:00`).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
const dueLabel = record => isLate(record) ? 'Overdue' : record.due === TODAY ? 'Due today' : `Due ${dateLabel(record.due)}`;
const badge = record => `<span class="badge ${isLate(record) ? 'overdue' : record.status.toLowerCase()}">${escapeHTML(isLate(record) ? 'Overdue' : record.status === 'Pending' ? 'In review' : record.status === 'Correction' ? 'For correction' : record.status)}</span>`;
const fileIcon = record => `<span class="file-icon ${record.type === 'Circular' ? 'green' : record.type === 'Report' ? 'blue' : ''}">${icon('file')}</span>`;
const button = (label,action,style='btn',extra='') => `<button ${extra.includes('type=') ? '' : 'type="button"'} class="${style}" data-action="${action}" ${extra}>${label}</button>`;
const options = (values,selected) => values.map(value => `<option ${value === selected ? 'selected' : ''}>${escapeHTML(value)}</option>`).join('');
function heading(eyebrow,title,description,actions='') {
  return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div><div><div class="date-note">${icon('clock')}Thursday, 5 November 2026</div><div class="heading-actions">${actions}</div></div></div>`;
}
function stat(label,value,note,name='file',alert=false) {
  return `<div class="stat-card ${alert ? 'alert' : ''}"><div class="stat-top">${label}${icon(name)}</div><div class="stat-value">${value}</div><div class="stat-bottom">${note}</div></div>`;
}
function toast(message,warning=false) {
  const element = document.createElement('div');
  element.className = `toast${warning ? ' warning' : ''}`;
  element.innerHTML = `${icon(warning ? 'help' : 'check')}<span>${escapeHTML(message)}</span>`;
  $('#toast-root').append(element);
  setTimeout(() => element.remove(),5500);
}
function navigate(page) {
  if (state.page === page && location.hash === `#${page}`) render();
  else location.hash = page;
  closeMenu();
}
function closeMenu() {
  $('#sidebar').classList.remove('open');
  $('#mobile-scrim').classList.remove('open');
  $('[data-action="menu"]').setAttribute('aria-expanded','false');
}
function syncShell() {
  const names = pageNames;
  $('#breadcrumb-page').textContent = names[state.page];
  document.title = `${names[state.page]} | Registry prototype`;
  $('#nav-pending').textContent = pending().length;
  document.querySelectorAll('[data-page]').forEach(link => {
    const active = link.dataset.page === state.page;
    link.classList.toggle('active',active);
    if (active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
}
function render() {
  document.body.classList.toggle('fx-entry',['landing','login','mfa','public','verify'].includes(state.page));
  const pages = {dashboard:dashboardPage,journeys:journeysPage,repository:repositoryPage,approvals:approvalsPage,intake:intakePage,archive:archivePage,leadership:leadershipPage,admin:adminPage,...frameworkPages};
  $('#main').innerHTML = pages[state.page]();
  decoratePrototype();
  syncShell();
}
function cabinetCard(department,compact=false) {
  const count = data.records.filter(record => record.department === department).length;
  return `<button class="cabinet-card ${state.department === department && state.page === 'repository' ? 'active' : ''}" data-action="cabinet" data-department="${escapeHTML(department)}">${icon('folder')}<h3>${escapeHTML(department)}</h3><p>${count} document${count === 1 ? '' : 's'}</p>${compact ? '' : `<div class="cabinet-meta"><span>Department cabinet</span>${icon('arrow')}</div>`}</button>`;
}
function taskRow(record) {
  return `<button class="task-row" data-action="document" data-id="${escapeHTML(record.id)}" style="width:100%;text-align:left;background:transparent;border-left:0;border-right:0;border-top:0;">${fileIcon(record)}<span class="task-copy"><h3>${escapeHTML(record.title)}</h3><p>${escapeHTML(record.department)} <span class="footer-separator">&middot;</span> ${escapeHTML(dueLabel(record))}</p></span>${badge(record)}${icon('chevron')}</button>`;
}
function dashboardPage() {
  const tasks = [...pending()].sort((a,b) => a.due.localeCompare(b.due));
  const focus = tasks[0] || data.records[0];
  return `<div class="workbench-greeting"><span>Good morning, Amina. <span class="footer-separator">/</span> Your office workbench</span><span>${icon('clock')} 5 November 2026 &middot; Demo date</span></div>
  <section class="office-hero"><div class="office-hero-copy"><p class="eyebrow">FROM INCOMING PAPER TO ACCOUNTABLE ACTION</p><h1>Know what needs you.<br><em>Before it holds up the office.</em></h1><p>A letter arrives. Its meaning becomes clear. The right desk takes action. Registry connects the entire journey, not just the filing cabinet.</p><div class="hero-actions">${button(`${icon('spark')} Try smart intake`,'capture','btn hero-primary')}${button(`Follow a file ${icon('arrow')}`,'go-journeys','hero-link')}</div><span class="hero-disclosure">INTERACTIVE CONCEPT &middot; FICTIONAL RECORDS &middot; SIMULATED INTELLIGENCE</span></div><div class="office-signal"><div class="signal-top"><span class="signal-label">THE OFFICE SIGNAL</span>${icon('chart')}</div><div class="signal-number">${overdue().length.toString().padStart(2,'0')}<span>${overdue().length ? 'files need a nudge' : 'overdue files'}</span></div><p>${overdue().length ? 'Past their deadline. Still within your reach.' : 'The sample office has no overdue reviews.'}</p><div class="signal-mini-route"><span>Incoming</span>${icon('arrow')}<span class="signal-current">Decision</span>${icon('arrow')}<span>Filed</span></div>${button(`See the hold-up ${icon('arrow')}`,'go-leadership','hero-link')}</div></section>
  <section class="experience-section"><div class="section-heading"><h2>Not just stored. Understood. Moved forward.</h2><span class="subtle">Three headline experiences from the proposal</span></div><div class="experience-grid">
  <button class="experience-card" data-action="go-intake"><span class="experience-index">01 / UNDERSTAND</span>${icon('spark')}<h2>A letter. Read between the lines.</h2><p>Review a suggested summary, deadline and next desk. See the reason behind each suggestion.</p><span class="experience-link">Explore smart intake ${icon('arrow')}</span></button>
  <button class="experience-card" data-action="go-archive"><span class="experience-index">02 / KNOW</span>${icon('search')}<h2>An answer. With its evidence.</h2><p>Ask what is overdue or where a file is. Move from the answer directly to the source and its journey.</p><span class="experience-link">Ask the Archive ${icon('arrow')}</span></button>
  <button class="experience-card" data-action="go-leadership"><span class="experience-index">03 / ACT</span>${icon('chart')}<h2>A bottleneck. Made visible.</h2><p>Find the desk holding up the office. Review the evidence and draft a follow-up, not just a report.</p><span class="experience-link">Open command view ${icon('arrow')}</span></button></div></section>
  <div class="workbench-lower"><section><div class="section-heading"><h2>${focus && isLate(focus) ? 'One file. One visible hold-up.' : 'One file. A complete journey.'}</h2>${button(`All file journeys ${icon('arrow')}`,'go-journeys','text-link')}</div>${focus ? journeyCard(focus,true) : ''}</section><section><div class="section-heading"><h2>Decisions on your desk <span class="count-pill">${tasks.length}</span></h2>${button('Open inbox','go-approvals','text-link')}</div><div class="panel">${tasks.slice(0,3).map(taskRow).join('') || emptyState('check','A clear desk','No sample approvals are waiting.')}</div></section></div>
  <div class="office-pulse"><span class="pulse-label">OFFICE PULSE</span><span><strong>${data.records.length}</strong> registered records</span><span><strong>${pending().length}</strong> active reviews</span><span><strong>${closed().length}</strong> approved or filed</span><span><strong>${departments.length}</strong> departments connected</span>${button(`Browse repository ${icon('arrow')}`,'go-repository','text-link')}</div>`;
}

function nextAction(record) {
  if (record.status === 'Correction') return 'Clarify the return note and resubmit a corrected version to the Director.';
  if (record.status === 'Approved') return 'Archive the approved record, keeping its minutes and decision trail together.';
  if (record.status === 'Archived') return 'No action pending. The filed record and its history remain available.';
  return `The ${route[record.step]} should review the submission and ${record.step < 3 ? `forward a decision to the ${route[record.step+1]}` : 'record a final decision'}.`;
}
function journeyCard(record,compact=false) {
  const complete = ['Approved','Archived'].includes(record.status);
  const latest = record.history.filter(event => !['Minute added','Follow-up draft saved'].includes(event.action)).at(-1);
  return `<article class="journey-card ${compact ? 'compact' : ''}"><div class="journey-title"><div><p class="eyebrow">${escapeHTML(record.id)} &middot; ${escapeHTML(record.department)}</p><h2>${escapeHTML(record.title)}</h2></div>${badge(record)}</div><div class="journey-track" aria-label="File routing stages">${route.map((desk,index) => {const done = index < record.step || complete && index < 4 || record.status === 'Archived' && index === 4; return `<div class="journey-stop ${done ? 'done' : index === record.step ? 'current' : ''}"><span class="journey-stop-marker">${done ? icon('check') : (index+1).toString().padStart(2,'0')}</span><strong>${desk}</strong><small>${index === record.step ? record.status === 'Archived' ? 'Filed' : record.status === 'Approved' ? 'Ready to file' : record.status === 'Correction' ? 'Correction needed' : 'Here now' : done ? 'Passed' : 'Next'}</small></div>`;}).join('')}</div><div class="journey-insight ${isLate(record) ? 'needs-attention' : ''}">${icon(isLate(record) ? 'clock' : 'arrow')}<div><strong>${isLate(record) ? `Waiting past the ${dateLabel(record.due)} deadline` : `Current position: ${record.status === 'Archived' ? 'Filed in the archive' : route[record.step]}`}</strong><p>${escapeHTML(nextAction(record))}</p></div></div>${!compact ? `<div class="journey-latest"><span class="eyebrow">LAST RECORDED HANDOFF</span><p>${escapeHTML(latest?.action || 'Registered')} <span class="footer-separator">&middot;</span> ${escapeHTML(latest?.by || record.owner)}</p><span class="subtle">${escapeHTML(latest?.note || '')}</span></div>` : ''}<div class="journey-actions">${button(`Open decision workspace ${icon('arrow')}`,'document','btn btn-primary btn-sm',`data-id="${escapeHTML(record.id)}"`)}${record.status === 'Pending' ? button('Draft a follow-up','follow-up','text-link',`data-id="${escapeHTML(record.id)}"`) : ''}</div></article>`;
}
function journeysPage() {
  if (!getRecord(state.journeyID)) state.journeyID = overdue()[0]?.id || data.records[0]?.id;
  const selected = getRecord(state.journeyID);
  return `${heading('FILE JOURNEYS & DESK ACCOUNTABILITY','Where is my file?','Not just its status. Its desk, its next step and the decision trail that brought it here.',button(`${icon('plus')} Start a new journey`,'capture','btn btn-primary'))}<div class="journey-layout"><aside class="panel journey-picker"><label class="search-field">${icon('search')}<input id="journey-search" aria-label="Find a file journey" placeholder="Title or file reference..." value="${escapeHTML(state.journeyQuery)}"/></label><div id="journey-options">${journeyOptions()}</div></aside><div id="journey-detail">${selected ? journeyCard(selected) : ''}<div class="notice" style="margin-top:15px">${icon('shield')}<span>These are digital desk positions from the demo workflow, not physical file locations or live officer activity. Every action is simulated.</span></div></div></div>`;
}
function journeyOptions() {
  const query = state.journeyQuery.trim().toLowerCase();
  const records = data.records.filter(record => `${record.id} ${record.title} ${record.department}`.toLowerCase().includes(query));
  return records.length ? records.map(record => `<button class="journey-option ${record.id === state.journeyID ? 'selected' : ''}" data-action="select-journey" data-id="${escapeHTML(record.id)}"><span>${escapeHTML(record.id)}</span><strong>${escapeHTML(record.title)}</strong><small>${record.status === 'Archived' ? 'Archived' : record.status === 'Correction' ? 'For correction' : route[record.step]}${isLate(record) ? ' / Overdue' : ''}</small></button>`).join('') : '<p class="subtle" style="padding:20px">No matching file journey.</p>';
}
function emptyState(name,title,description,action='') {
  return `<div class="empty-state">${icon(name)}<h3>${title}</h3><p>${description}</p>${action}</div>`;
}
function filteredRecords() {
  const query = state.query.trim().toLowerCase();
  return data.records.filter(record => (!query || [record.title,record.id,record.department,record.owner,record.summary,record.type].join(' ').toLowerCase().includes(query)) && (state.department === 'All departments' || record.department === state.department) && (state.status === 'All statuses' || (state.status === 'Overdue' ? isLate(record) : record.status === state.status)));
}
function recordTable(records,approval=false) {
  if (!records.length) return emptyState('search','No documents found','Try a different search or clear your filters.',button('Clear filters','clear-filters','btn btn-sm'));
  return `<div class="panel"><div class="table-wrap"><table class="document-table"><thead><tr><th scope="col">Document name</th><th scope="col">Department</th><th scope="col">${approval ? 'Current desk' : 'Access'}</th><th scope="col">Status</th><th scope="col">${approval ? 'Deadline' : 'Registered'}</th><th scope="col"><span class="visually-hidden">Open document</span></th></tr></thead><tbody>${records.map(record => `<tr><td><div class="document-cell">${fileIcon(record)}<div>${button(escapeHTML(record.title),'document','',`data-id="${escapeHTML(record.id)}"`)}<small>${escapeHTML(record.id)} <span class="footer-separator">&middot;</span> ${escapeHTML(record.type)}</small></div></div></td><td>${escapeHTML(record.department)}</td><td>${approval ? escapeHTML(route[record.step]) : `${record.level === 'Confidential' ? icon('lock') : ''} ${escapeHTML(record.level)}`}</td><td>${badge(record)}</td><td>${dateLabel(approval ? record.due : record.date)}</td><td>${button(icon('chevron'),'document','icon-button',`data-id="${escapeHTML(record.id)}" aria-label="Open ${escapeHTML(record.title)}"`)}</td></tr>`).join('')}</tbody></table></div><div class="table-footer"><span>${records.length} document${records.length === 1 ? '' : 's'} <span class="footer-separator">&middot;</span> ${approval ? 'All workflow desks shown for the demo' : 'Fictional demonstration records'}</span><span>No live records</span></div></div>`;
}
function repositoryResults() {
  const records = filteredRecords();
  if (state.view === 'list' || !records.length) return recordTable(records);
  return `<div class="document-grid">${records.map(record => `<button class="document-grid-card" data-action="document" data-id="${escapeHTML(record.id)}">${fileIcon(record)}<h3>${escapeHTML(record.title)}</h3><p>${escapeHTML(record.id)}<br>${escapeHTML(record.department)}</p>${badge(record)}<p>Registered ${dateLabel(record.date)} <span class="footer-separator">&middot;</span> ${escapeHTML(record.level)}</p></button>`).join('')}</div>`;
}
function repositoryPage() {
  return `${heading('THE DIGITAL FILING ROOM','Everything in its place.','One registry. Clear references. A history that stays with every document.',`${button(`${icon('download')} Export list`,'export','btn')}${button(`${icon('plus')} Capture document`,'capture','btn btn-primary')}`)}
  <div class="section-heading"><h2>Department cabinets</h2>${state.department !== 'All departments' ? button('Show all cabinets','clear-cabinet','text-link') : '<span class="subtle">Organised around the way your office works</span>'}</div><div class="repository-cabinets">${departments.map(department => cabinetCard(department,true)).join('')}</div>
  <div class="section-heading"><h2>${state.department === 'All departments' ? 'All documents' : escapeHTML(state.department)}</h2><span class="subtle">Search titles, references and sample content</span></div><div class="toolbar"><label class="search-field">${icon('search')}<input id="repository-search" aria-label="Search repository" value="${escapeHTML(state.query)}" placeholder="Find a document, reference or keyword..." autocomplete="off"/></label><div class="filters"><select id="department-filter" class="select-control" aria-label="Filter by department">${options(['All departments',...departments],state.department)}</select><select id="status-filter" class="select-control" aria-label="Filter by status">${options(['All statuses','Pending','Overdue','Approved','Correction','Archived','Draft'],state.status)}</select><div class="view-switch">${button(icon('list'),'view-list',state.view === 'list' ? 'active' : '',`aria-label="List view" aria-pressed="${state.view === 'list'}"`)}${button(icon('grid'),'view-grid',state.view === 'grid' ? 'active' : '',`aria-label="Grid view" aria-pressed="${state.view === 'grid'}"`)}</div></div></div><div id="repository-results">${repositoryResults()}</div>`;
}
function approvalsPage() {
  const groups = {Pending:pending(),Overdue:overdue(),Correction:data.records.filter(record => record.status === 'Correction'),Completed:closed()};
  return `${heading('WORKFLOW & APPROVALS','Decisions that move things.','Review, minute and route documents. Nothing gets lost between desks.',button(`${icon('plus')} Capture document`,'capture','btn btn-primary'))}
  <div class="tabs">${Object.keys(groups).map(tab => button(`${tab === 'Pending' ? 'Awaiting action' : tab === 'Correction' ? 'For correction' : tab} <span class="count-pill">${groups[tab].length}</span>`,'approval-tab',`tab ${state.approvalTab === tab ? 'active' : ''}`,`data-tab="${tab}" aria-pressed="${state.approvalTab === tab}"`)).join('')}</div>
  ${overdue().length && ['Pending','Overdue'].includes(state.approvalTab) ? `<div class="approval-summary">${icon('clock')}<span><strong>${overdue().length} overdue document${overdue().length === 1 ? '' : 's'}.</strong> Open a document to review its routing history and take action.</span></div>` : ''}
  ${groups[state.approvalTab].length ? recordTable([...groups[state.approvalTab]].sort((a,b) => a.due.localeCompare(b.due)),true) : emptyState('check','All clear here.','No documents in this queue. Try another tab or capture a new letter.')}
  <p class="screen-reader-note">Prototype note: this inbox shows every participating desk so you can demonstrate the complete workflow. Live permissions and reminders are not implemented.</p>`;
}
function intakePage() {
  const captures = data.records.filter(record => record.history.some(event => event.action === 'Captured with smart intake'));
  return `${heading('EXPLAINABLE SMART INTAKE','A letter arrives. The office understands.','See the source, question the suggestion and confirm the right next desk.',button(`${icon('upload')} Choose a local file`,'choose-file','btn'))}
  <div class="intelligence-manifesto"><span class="manifesto-mark">${icon('spark')}</span><div><p class="eyebrow">INTELLIGENCE SHOULD NOT BE A BLACK BOX</p><h2>A suggestion is useful.<br><em>A reason makes it trustworthy.</em></h2><p>Every sample suggestion sits beside the passage it comes from. The officer can change it, challenge it or choose a different desk.</p></div><span class="manifesto-stamp">SUGGESTED<br>NOT DECIDED</span></div>
  <div class="section-heading"><h2>Choose an incoming document</h2><span class="subtle">Three fictional situations. Three different review needs.</span></div><div class="scenario-grid">${Object.entries(intakeScenarios).map(([key,scenario]) => `<button class="scenario-card" data-action="capture-scenario" data-scenario="${key}"><span class="eyebrow">${scenario.label}</span>${icon(scenario.symbol)}<h2>${scenario.headline}</h2><p>${scenario.description}</p><div class="scenario-flags">${scenario.flags.map(flag => `<span>${flag}</span>`).join('')}</div><span class="experience-link">Review this document ${icon('arrow')}</span></button>`).join('')}</div>
  <div class="intake-boundary"><div><strong>The model proposes. The officer decides.</strong><p>Source evidence &rarr; editable metadata &rarr; a confirmed route. Nothing important is silently filed or approved.</p></div><div class="notice">${icon('shield')}<span>Prewritten scenarios only. No OCR, live AI or uploads. Local file selection reads its name and size, not its contents.</span></div></div>
  <section style="margin-top:27px"><div class="section-heading"><h2>Captured in this session <span class="count-pill">${captures.length}</span></h2><span class="subtle">Your sample journeys appear here</span></div>${captures.length ? recordTable(captures) : '<div class="panel" style="padding:23px;color:#96a087;font-size:11px">Your first captured letter will appear here, with its new file reference and current desk.</div>'}</section><input id="local-file-input" class="visually-hidden" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt" aria-label="Choose a fictional document"/>`;
}
const suggestedQuestions = ['Which documents are overdue?','What are the digital records guidelines?','Show me the budget review circular.','Where is the staff training request?'];
function archivePage() {
  return `<div class="archive-page"><div class="archive-intro"><div class="archive-orb">${icon('spark')}</div><p class="eyebrow">ANSWERS, WITH A PAPER TRAIL</p><h1>Your archive has answers.</h1><p>Ask in your own words. Find the record behind the answer.<br>A calmer way to work with everything your office knows.</p></div><form id="archive-form" class="archive-form">${icon('search')}<input id="archive-question" aria-label="Ask a question about the sample archive" placeholder="What would you like to find in the archive?" required maxlength="300" autocomplete="off" value="${escapeHTML(state.answer?.question || '')}"/>${button(`Ask ${icon('arrow')}`,'submit-archive','btn btn-primary','type="submit"')}</form><p class="suggestion-label">A FEW PLACES TO START</p><div class="suggestions">${suggestedQuestions.map(question => button(escapeHTML(question),'ask-suggestion','suggestion',`data-question="${escapeHTML(question)}"`)).join('')}</div><div id="archive-answer" aria-live="polite">${state.answer ? answerHTML() : ''}</div><div class="archive-safeguards"><span>${icon('shield')}Permission-aware by design</span><span>${icon('file')}Source-linked answers</span><span>${icon('check')}Human judgement comes first</span></div><div class="notice">${icon('spark')}<span><strong>Demonstration, not live AI.</strong> Answers use the fictional records bundled with this prototype. No model is connected, and role-based security is not enforced here.</span></div></div>`;
}
function findAnswer(question) {
  const query = question.toLowerCase();
  let records = [],text = '';
  if (/\b(overdue|late|stuck)\b/.test(query)) {
    records = overdue();
    text = records.length ? `As of the demo date, 5 November 2026, ${records.length} document${records.length === 1 ? ' is' : 's are'} overdue. ${records.map(record => `${record.title} is at the ${route[record.step]} desk and was due ${dateLabel(record.due)}`).join('. ')}. Open the source records to review or move them forward.` : 'There are no overdue documents in the current sample registry.';
  } else {
    const keywords = query.replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(word => word.length > 2 && !['what','are','the','show','where','for','with','can','please','document','documents','find','about','how','does','this','that','file','files','status','current','desk','deadline'].includes(word));
    const ranked = data.records.map(record => ({record,score:keywords.filter(word => `${record.title} ${record.summary} ${record.id} ${record.department}`.toLowerCase().includes(word)).length})).filter(item => item.score > 0).sort((a,b) => b.score-a.score);
    const locationQuestion = /\bwhere\b|current desk|file status/.test(query);
    records = ranked.filter(item => item.score >= Math.max(1,(ranked[0]?.score || 0)*0.6)).slice(0,locationQuestion ? 1 : 3).map(item => item.record);
    if (records.length) text = records.map(record => locationQuestion ? `${record.title} is ${record.status === 'Archived' ? 'filed in the archive' : `at the ${route[record.step]} desk`}. Its current status is ${record.status.toLowerCase()}, and the recorded deadline is ${dateLabel(record.due)}. ${nextAction(record)} Use "Trace this file" below to inspect the complete journey.` : `${record.title}: ${record.summary} Current status: ${record.status === 'Pending' ? `in review at the ${route[record.step]} desk` : record.status.toLowerCase()}.`).join('\n\n');
    else text = 'I could not find a supporting record in this sample archive. Try a document title, department or one of the example questions. This prototype does not invent an answer when there is no source.';
  }
  return {question,text,ids:records.map(record => record.id)};
}
function answerHTML() {
  const answer = state.answer;
  const records = answer.ids.map(getRecord).filter(Boolean);
  return `<section class="panel answer-card"><h2 class="answer-question">${escapeHTML(answer.question)}</h2><div class="answer-label">${icon('spark')}SAMPLE ARCHIVE RESPONSE</div><div class="answer-text">${escapeHTML(answer.text).replace(/\n\n/g,'<br><br>')}</div>${records.length ? `<p class="eyebrow" style="margin-top:23px">SOURCE DOCUMENTS &middot; ${records.length}</p><div class="source-list">${records.map((record,index) => `<div class="evidence-source"><button class="source-card" data-action="document" data-id="${escapeHTML(record.id)}">${icon('file')}<div><strong>${index+1}. ${escapeHTML(record.title)}</strong><small>${escapeHTML(record.id)} &middot; ${escapeHTML(record.department)}</small></div>${icon('arrow')}</button><div class="source-context"><span>${record.status === 'Archived' ? 'Filed in the archive' : `At the ${escapeHTML(route[record.step])} desk`} ${isLate(record) ? '&middot; Overdue' : ''}</span>${button(`Trace this file ${icon('arrow')}`,'trace-file','text-link',`data-id="${escapeHTML(record.id)}"`)}</div></div>`).join('')}</div>` : ''}<div class="answer-footnote">Generated from sample summaries and current demo statuses. Always check the source before making a decision.</div></section>`;
}
function askArchive(question) {
  clearTimeout(archiveTimer);
  state.answer = findAnswer(question.trim());
  $('#archive-question').value = question;
  $('#archive-answer').innerHTML = `<div class="panel answer-card"><span class="busy-indicator"><i></i><i></i><i></i></span> <span class="subtle">Looking through the sample registry...</span></div>`;
  archiveTimer = setTimeout(() => { if (state.page === 'archive') $('#archive-answer').innerHTML = answerHTML(); },450);
}
function leadershipPage() {
  const late = overdue();
  const desks = route.slice(1,4).map((desk,index) => ({desk,index:index+1,records:pending().filter(record => record.step === index+1)}));
  const busiest = [...desks].sort((a,b) => b.records.length-a.records.length)[0];
  return `${heading('THE LEADERSHIP COMMAND VIEW','Find the hold-up. Move the office.','From a departmental count to a desk, a source record and a considered intervention.',`${button(`${icon('download')} Export snapshot`,'export','btn')}${button(`${icon('spark')} Prepare office brief`,'office-brief','btn btn-primary')}`)}
  <section class="command-ribbon"><div><p class="eyebrow">THE CURRENT OFFICE SIGNAL</p><h2>${late.length ? `${late.length} files need attention. Not another dashboard.` : 'No overdue files. Keep the office moving.'}</h2><p>${busiest.records.length ? `The ${busiest.desk} desk holds ${busiest.records.length} of ${pending().length} pending files.` : 'No documents are waiting for approval.'} These are counts from the sample workflow, not a prediction of officer performance.</p></div><span class="command-ribbon-number">${late.length.toString().padStart(2,'0')}<small>OVERDUE</small></span></section>
  <div class="section-heading"><h2>Where the office is waiting</h2><span class="subtle">Select a desk to inspect its queue</span></div><div class="desk-map">${desks.map(desk => `<button class="desk-node ${desk.records.some(isLate) ? 'blocked' : ''}" data-action="inspect-desk" data-step="${desk.index}"><span class="desk-node-label">${desk.index.toString().padStart(2,'0')} / REVIEW STAGE</span><h2>${desk.desk}</h2><div class="desk-node-count">${desk.records.length}<span>pending file${desk.records.length === 1 ? '' : 's'}</span></div><div class="desk-node-foot"><span>${desk.records.filter(isLate).length ? `${desk.records.filter(isLate).length} past deadline` : 'Within deadline'}</span>${icon('arrow')}</div></button>`).join('')}</div>
  <div class="leader-grid"><section class="panel"><div class="panel-header"><h2>Department pressure</h2><span class="subtle">Source-linked, not predictive</span></div><div class="bar-chart">${departments.map(department => { const count = pending().filter(record => record.department === department).length; const lateCount = late.filter(record => record.department === department).length; return `<div class="bar-row"><div class="chart-label"><span>${escapeHTML(department)}</span><span>${count} pending${lateCount ? ` / ${lateCount} overdue` : ''}</span></div><div class="bar-track"><div class="bar-fill ${lateCount ? 'alert' : ''}" style="width:${count / Math.max(1,...departments.map(d => pending().filter(r => r.department === d).length))*100}%"></div></div></div>`; }).join('')}<div class="chart-legend">Counts from the current demo records. Amber marks overdue reviews.</div></div></section><aside class="brief-card">${icon('spark')}<p class="eyebrow" style="margin-top:16px">A BRIEF YOU CAN QUESTION</p><h2>Every conclusion.<br>A source behind it.</h2><p>${pending().length} active reviews. ${late.length} overdue records. ${data.records.filter(r => r.status === 'Correction').length} awaiting correction. ${closed().length} approved or archived.</p><p>Open the office brief to inspect the source files. Review a follow-up draft before recording it. The prototype never sends a message on your behalf.</p>${button(`Review the office brief ${icon('arrow')}`,'office-brief','btn btn-soft')}</aside></div>
  <div class="section-heading"><h2>The intervention desk <span class="count-pill">${late.length}</span></h2><span class="subtle">Human-reviewed drafts. No live reminders.</span></div><div class="intervention-list">${late.length ? late.map(record => `<article class="intervention-row"><div><span class="eyebrow">${escapeHTML(record.department)} &middot; ${escapeHTML(record.id)}</span><h3>${escapeHTML(record.title)}</h3><p>At the ${route[record.step]} desk. Deadline: ${dateLabel(record.due)}. ${record.history.some(event => event.action === 'Follow-up draft saved') ? '<strong>Follow-up draft recorded.</strong>' : 'No follow-up draft recorded.'}</p></div><div class="intervention-actions">${button('Trace file','trace-file','text-link',`data-id="${escapeHTML(record.id)}"`)}${button(`${icon('spark')} Draft follow-up`,'follow-up','btn btn-sm',`data-id="${escapeHTML(record.id)}"`)}</div></article>`).join('') : `<div class="panel">${emptyState('check','No overdue files','The current sample queue is within its deadlines.')}</div>`}</div>`;
}

function followUpDialog(id) {
  const record = getRecord(id);
  if (!record || record.status !== 'Pending') return toast('This record no longer needs an approval follow-up.');
  state.followUpID = id;
  const note = `To: ${route[record.step]}, ${record.department}\n\nKindly review ${record.title} (${record.id}). The recorded deadline is ${dateLabel(record.due)} 2026${isLate(record) ? ' and has passed as of the demo date' : ''}. Please record the next decision or explain any clarification required so the file can proceed.\n\nFor your consideration.\nOffice of the Secretariat`;
  showModal('A nudge. With context, not guesswork.','Leadership follow-up &middot; Editable template, not live AI',`<div class="draft-source"><span class="eyebrow">THE FACTS BEHIND THIS DRAFT</span><strong>${escapeHTML(record.title)}</strong><p>${escapeHTML(record.id)} &middot; ${escapeHTML(route[record.step])} &middot; Due ${dateLabel(record.due)}</p>${button(`Inspect source ${icon('arrow')}`,'document','text-link',`data-id="${escapeHTML(record.id)}"`)}</div><form id="follow-up-form"><div class="field"><label for="follow-up-note">Review and edit the proposed follow-up</label><textarea id="follow-up-note" name="note" required minlength="10" maxlength="1500" rows="9">${escapeHTML(note)}</textarea></div><label class="check-label"><input name="reviewed" type="checkbox" required/><span>I reviewed this fictional draft. Saving records it in the demo trail only; no message will be sent.</span></label></form><div class="notice">${icon('shield')}<span>No email, SMS, escalation or officer contact takes place. Human review is deliberately part of the prototype journey.</span></div>`,`${button('Discard draft','close-modal','btn')}${button('Record reviewed draft','submit-follow-up','btn btn-primary','type="submit" form="follow-up-form"')}`);
}
function officeBriefModal() {
  const late = overdue();
  const corrections = data.records.filter(record => record.status === 'Correction');
  const sources = [...late,...corrections];
  showModal('The office, in a few clear lines.','Leadership brief &middot; 5 November 2026 &middot; Sample template',`<div class="office-brief-paper"><p class="eyebrow">OFFICE OF THE SECRETARIAT / BRIEFING NOTE</p><h3>What needs a decision today</h3><p>Of ${data.records.length} registered records, <strong>${pending().length} remain in active approval</strong> and <strong>${closed().length} are approved or archived</strong>.</p><p>${late.length ? `<strong>${late.length} reviews are overdue.</strong> They are waiting at ${[...new Set(late.map(record => route[record.step]))].map(escapeHTML).join(', ')}. The relevant source files are listed below.` : 'No current sample review is past its deadline.'}</p><p>${corrections.length} ${corrections.length === 1 ? 'record requires' : 'records require'} correction before the next approval. Check the recorded return notes rather than treating them as ordinary overdue approvals.</p><h4>Recommended human action</h4><p>Review each outstanding file, confirm its current desk and prepare a contextual follow-up if appropriate. Do not infer a cause for delay or officer performance from document counts alone.</p></div><p class="eyebrow" style="margin-top:22px">SOURCE RECORDS / ${sources.length}</p><div class="source-list">${sources.map(record => `<button class="source-card" data-action="document" data-id="${escapeHTML(record.id)}">${icon('file')}<div><strong>${escapeHTML(record.title)}</strong><small>${escapeHTML(record.id)} &middot; ${escapeHTML(record.status)}</small></div>${icon('arrow')}</button>`).join('') || '<p class="subtle">No overdue or correction sources in the current sample.</p>'}</div><div class="notice">${icon('spark')}<span>This brief uses a fixed template and current sample metadata. There is no AI model, automatic weekly delivery or real organisational reporting.</span></div>`,button('Close brief','close-modal','btn'));
}
function adminPage() {
  return `${heading('PLATFORM & ADMINISTRATION','An organised office starts here.','Explore the people, safeguards and routing rules behind the registry.',button(`${icon('plus')} Add demo user`,'add-user','btn btn-primary'))}<div class="notice" style="margin-bottom:24px">${icon('shield')}<span>These controls illustrate the proposed administration experience. They do not enforce security, configure infrastructure or connect to an identity provider.</span></div><div class="admin-grid">${[
    {name:'shield',title:'Identity & access',text:'Sensitive roles use an additional verification step. Access follows an officer\'s role and department.',key:'twoFactor',label:'Two-factor sign-in'},
    {name:'file',title:'Document protection',text:'Confidentiality travels with the record. Protected previews help make its handling requirements visible.',key:'watermark',label:'Preview watermark'},
    {name:'spark',title:'Intelligence, responsibly',text:'The intended AI environment stays local, shows its sources and leaves important decisions with people.',key:'localAI',label:'Local AI policy'}
  ].map(card => `<section class="panel admin-card">${icon(card.name)}<h3>${card.title}</h3><p>${card.text}</p><div class="toggle-row"><span>${card.label}</span><button class="toggle ${data.settings[card.key] ? '' : 'off'}" data-action="setting" data-setting="${card.key}" role="switch" aria-checked="${Boolean(data.settings[card.key])}" aria-label="${card.label} (demo setting)"></button></div></section>`).join('')}</div>
  <div class="admin-bottom"><section class="panel"><div class="panel-header"><h2>People in the workspace <span class="count-pill">${data.users.length}</span></h2><span class="subtle">Fictional users</span></div>${data.users.map(user => `<div class="role-item"><span class="avatar">${escapeHTML(initials(user.name))}</span><div><strong>${escapeHTML(user.name)}</strong><small>${escapeHTML(user.department)}</small></div><span class="badge approved">${escapeHTML(user.role)}</span></div>`).join('')}</section><aside class="panel panel-padding"><p class="eyebrow">A STANDARD APPROVAL JOURNEY</p><h2 style="font:23px Georgia,serif;margin:0">Every desk. Every decision.</h2><div class="workflow-small">${route.map((desk,index) => `${index ? icon('arrow') : ''}<span>${desk}</span>`).join('')}</div><p class="subtle" style="line-height:1.9">Return for correction at any review desk. A comment explains why. Approved records can then be archived with their history intact.</p>${button(`Explore a workflow ${icon('arrow')}`,'go-approvals','text-link')}<hr class="divider"/><p class="eyebrow">A CLEAN SLATE</p><p class="subtle" style="line-height:1.9">Reset fictional records, demo users and settings to replay the presentation.</p>${button(`${icon('return')} Reset demo`,'reset','btn btn-sm')}</aside></div>`;
}

function showModal(title,subtitle,body,footer='',wide=false) {
  if (!$('#modal-root').firstElementChild) lastFocus = document.activeElement;
  $('#modal-root').innerHTML = `<div class="modal-overlay"><section class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-header"><div class="modal-title-group"><h2 id="modal-title">${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div>${button(icon('close'),'close-modal','icon-button','aria-label="Close dialog"')}</header><div class="modal-body">${body}</div>${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}</section></div>`;
  decoratePrototype();
  document.body.style.overflow = 'hidden';
  $('#sidebar').inert = true;
  $('.app-shell').inert = true;
  requestAnimationFrame(() => { const target = $('.modal [autofocus]') || $('.modal input:not([type="checkbox"]):not([type="file"]), .modal textarea') || $('.modal [data-action="close-modal"]'); target?.focus(); });
}
function closeModal(restoreFocus=true) {
  $('#modal-root').innerHTML = '';
  document.body.style.overflow = '';
  $('#sidebar').inert = false;
  $('.app-shell').inert = false;
  if (restoreFocus && lastFocus?.isConnected) lastFocus.focus();
  else if (restoreFocus) $('#main').focus({preventScroll:true});
  state.docID = null;
}
function documentPreview(record) {
  const completed = ['Approved','Archived'].includes(record.status);
  return `<div class="document-layout"><div class="document-preview"><div class="preview-toolbar"><span>${escapeHTML(record.file)}</span><span>Illustrative preview &middot; 1 page</span></div><article class="letter-paper"><div class="letter-letterhead"><div class="letter-seal">OS</div><h3>OFFICE OF THE SECRETARIAT</h3><p>${escapeHTML(record.department.toUpperCase())} &middot; DEMONSTRATION OFFICE</p></div><div class="letter-ref"><span>REF: ${escapeHTML(record.id)}</span><span>${dateLabel(record.date)} 2026</span></div><p>To: The ${escapeHTML(completed ? 'Permanent Secretary' : route[record.step])}</p><h4>${escapeHTML(record.title)}</h4><p>${escapeHTML(record.summary)}</p><p>This submission is forwarded for your consideration and the necessary action. Kindly record your decision and any supporting observations in the document workflow.</p><p>Please accept the assurances of our regards.</p><div class="signature">${escapeHTML(record.sender.split(' ').slice(0,2).join(' '))}</div><p style="margin-top:4px;font-size:9px">${escapeHTML(record.sender)}<br>${escapeHTML(record.department)}</p>${data.settings.watermark ? '<div class="letter-watermark">FICTIONAL RECORD &middot; PROTOTYPE PREVIEW</div>' : ''}</article></div><aside class="document-meta"><h3>Document details</h3><dl class="metadata-list"><div><dt>Status</dt><dd>${badge(record)}</dd></div><div><dt>File reference</dt><dd>${escapeHTML(record.id)}</dd></div><div><dt>Department</dt><dd>${escapeHTML(record.department)}</dd></div><div><dt>Document type</dt><dd>${escapeHTML(record.type)}</dd></div><div><dt>Registered by</dt><dd>${escapeHTML(record.owner)}</dd></div><div><dt>Confidentiality</dt><dd>${escapeHTML(record.level)}</dd></div><div><dt>Review deadline</dt><dd>${dateLabel(record.due)} 2026</dd></div><div><dt>Version</dt><dd>v${record.version}.0</dd></div></dl><h3>The routing trail</h3><ol class="route-list">${route.map((desk,index) => `<li class="route-step"><span class="route-marker ${index < record.step || (completed && index < 4) || (record.status === 'Archived' && index === 4) ? 'done' : index === record.step ? 'current' : ''}">${index < record.step || completed && index < 4 || record.status === 'Archived' && index === 4 ? icon('check') : index+1}</span><div>${desk}<small>${index === record.step ? record.status === 'Correction' ? 'Correction requested' : record.status === 'Archived' ? 'Filed with history' : record.status === 'Approved' ? 'Ready to archive' : 'Current desk' : index < record.step ? 'Completed' : 'Next step'}</small></div></li>`).join('')}</ol><div class="notice">${icon('shield')}<span>This is a rendered sample letter, not the contents of an uploaded file. Approvals are simulated, not legally binding signatures.</span></div></aside></div>`;
}
function documentHistory(record) {
  return `<ol class="history-list">${record.history.map(event => `<li><span class="activity-avatar">${escapeHTML(initials(event.by))}</span><div><strong>${escapeHTML(event.action)}</strong><p>${escapeHTML(event.note || '')}</p><small>${escapeHTML(event.by)} &middot; ${new Date(event.time).toLocaleString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</small></div></li>`).join('')}</ol><form id="comment-form" class="comment-box"><label for="document-comment">Add a minute or comment</label><textarea id="document-comment" name="comment" placeholder="Record a note for the next officer..." required maxlength="1000"></textarea>${button(`${icon('plus')} Add comment`,'submit-comment','btn btn-primary btn-sm','type="submit"')}</form>`;
}
function documentVersions(record) {
  return `<div class="notice">${icon('file')}<span>Version history is simulated. Resubmitting a corrected record creates a new metadata version; no binary documents are stored or compared.</span></div><ol class="history-list">${Array.from({length:record.version},(_,index) => record.version-index).map(version => `<li><span class="activity-avatar">v${version}</span><div><strong>Version ${version}.0 ${version === record.version ? '<span class="badge approved">Current</span>' : ''}</strong><p>${version === 1 ? 'Original registered document' : 'Resubmitted after correction'}</p><small>Sample metadata revision &middot; ${escapeHTML(record.owner)}</small></div></li>`).join('')}</ol>`;
}
function decisionBrief(record) {
  return `<div class="decision-brief"><div class="decision-brief-main"><p class="eyebrow">A READABLE FILE, BEFORE A DECISION</p><h3>${record.status === 'Archived' ? 'The decision is on record.' : 'What this file asks of the office.'}</h3><div class="brief-summary"><span class="summary-label">DOCUMENT SUMMARY</span><p>${escapeHTML(record.summary)}</p>${button(`Read the source letter ${icon('arrow')}`,'doc-tab','text-link','data-tab="preview"')}</div><div class="brief-next"><span class="summary-label">THE NEXT HUMAN ACTION</span><p>${escapeHTML(nextAction(record))}</p></div><div class="decision-brief-tools">${button(`${icon('spark')} Prepare a minute`,'draft-minute','btn')}${button(`Trace the file ${icon('arrow')}`,'trace-file','text-link',`data-id="${escapeHTML(record.id)}"`)}</div></div><aside class="decision-brief-side"><p class="eyebrow">BEFORE YOU ACT</p><div class="brief-fact">${icon('users')}<div><strong>Current desk</strong><span>${escapeHTML(route[record.step])}</span></div></div><div class="brief-fact">${icon('clock')}<div><strong>Deadline</strong><span>${dateLabel(record.due)} 2026 ${isLate(record) ? '/ overdue' : ''}</span></div></div><div class="brief-fact">${icon('lock')}<div><strong>Handling</strong><span>${escapeHTML(record.level)} / ${escapeHTML(record.department)}</span></div></div><div class="brief-fact">${icon('file')}<div><strong>Version</strong><span>v${record.version}.0 / ${record.history.length} trail entries</span></div></div><div class="notice">${icon('spark')}<span>Summary from fictional metadata, not an AI reading of an uploaded file. Check the source and make your own decision.</span></div></aside></div>`;
}
function minuteDraftDialog() {
  const record = getRecord(state.docID);
  if (!record) return;
  const note = record.status === 'Archived' ? `For record: ${record.title} (${record.id}) is archived. Please consult the recorded approval trail for the preceding decisions.` : `Please review ${record.title} (${record.id}). ${nextAction(record)} Kindly record the decision and any supporting observations for the next desk.`;
  showModal('A clear minute. A considered decision.',escapeHTML(record.title),`<div class="notice" style="margin-bottom:20px">${icon('spark')}<span>Template-based drafting preview. The proposed minute does not approve, forward or change the document status.</span></div><form id="minute-draft-form"><div class="field"><label for="minute-draft-note">Review the proposed minute</label><textarea id="minute-draft-note" name="note" required minlength="10" maxlength="1500" rows="6">${escapeHTML(note)}</textarea></div><label class="check-label"><input name="reviewed" type="checkbox" required/><span>I have reviewed the wording before adding it to this fictional activity trail.</span></label></form>`,`${button('Back to document','document','btn',`data-id="${escapeHTML(record.id)}"`)}${button('Add reviewed minute','submit-minute','btn btn-primary','type="submit" form="minute-draft-form"')}`);
}
function openDocument(id,tab='brief') {
  const record = getRecord(id);
  if (!record) return;
  state.docID = id; state.docTab = tab;
  const tabs = `<div class="tabs doc-tabs">${[['brief','Decision brief'],['preview','Source document'],['history','Activity & minutes'],['versions',`Versions (${record.version})`]].map(([key,label]) => button(label,'doc-tab',`tab ${tab === key ? 'active' : ''}`,`data-tab="${key}" aria-pressed="${tab === key}"`)).join('')}</div>`;
  let actions = `<span class="left-note">${icon('lock')} Sample workflow &middot; no live signature</span>`;
  if (record.status !== 'Archived') actions += button(`${icon('shield')} E-sign document`,'e-sign','btn');
  if (record.status === 'Pending') actions += `${button(`${icon('return')} Return for correction`,'return','btn btn-danger')}${button(`${icon('check')} ${record.step < 3 ? 'Approve & forward' : 'Approve document'}`,'approve','btn btn-primary')}`;
  if (record.status === 'Correction') actions += button(`${icon('upload')} Correct & resubmit`,'resubmit','btn btn-primary');
  if (record.status === 'Approved') actions += button(`${icon('folder')} Archive document`,'archive-document','btn btn-primary');
  if (record.status === 'Archived') actions += '<span class="badge archived">Archived with history</span>';
  showModal(escapeHTML(record.title),`${escapeHTML(record.id)} &middot; ${escapeHTML(record.department)}`,tabs+(tab === 'brief' ? decisionBrief(record) : tab === 'preview' ? documentPreview(record) : tab === 'history' ? documentHistory(record) : documentVersions(record)),actions,true);
}
function addHistory(record,action,note,by='Demo officer') {
  record.history.push({action,note,by,time:new Date().toISOString()});
}
function approveDocument() {
  const record = getRecord(state.docID);
  if (!record || record.status !== 'Pending') return;
  const desk = route[record.step];
  if (record.step < 3) { record.step++; addHistory(record,`Approved at ${desk}`,`Forwarded to ${route[record.step]} for the next review.`,desk); }
  else { record.status = 'Approved'; record.step = 4; addHistory(record,'Final approval recorded','The approval journey is complete. This record is ready to archive.',desk); }
  save(); render(); openDocument(record.id,'history');
  toast(record.status === 'Approved' ? 'Sample approval complete. The record is ready to archive.' : `Approved and forwarded to ${route[record.step]}.`);
}
function correctionDialog() {
  const record = getRecord(state.docID);
  if (!record || record.status !== 'Pending') return;
  showModal('Send it back, with a clear note.',escapeHTML(record.title),`<form id="correction-form"><div class="field"><label for="correction-note">What needs to be corrected?</label><textarea id="correction-note" name="note" required minlength="5" maxlength="1000" placeholder="Explain what the reviewing officer should change..."></textarea><small>A return note becomes part of the permanent activity trail.</small></div><div class="notice">${icon('return')}<span>The sample document returns to the reviewing officer. It can be resubmitted after correction.</span></div></form>`,`${button('Back to document','document','btn',`data-id="${escapeHTML(record.id)}"`)}${button('Return for correction','submit-return','btn btn-danger','type="submit" form="correction-form"')}`);
}
function resubmitDialog() {
  const record = getRecord(state.docID);
  if (!record || record.status !== 'Correction') return;
  showModal('Ready for another look.',escapeHTML(record.title),`<form id="resubmit-form"><div class="field"><label for="resubmit-note">Correction made</label><textarea id="resubmit-note" name="note" required minlength="5" maxlength="1000" placeholder="Describe the changes or clarification made..."></textarea><small>Resubmitting creates version ${record.version+1}.0 in this demo.</small></div><div class="notice">${icon('file')}<span>This records a fictional correction note and metadata version. It does not alter an actual file.</span></div></form>`,`${button('Back to document','document','btn',`data-id="${escapeHTML(record.id)}"`)}${button('Resubmit to director','submit-resubmit','btn btn-primary','type="submit" form="resubmit-form"')}`);
}
const intakeScenarios = {
  liaison:{label:'01 / ROUTINE CORRESPONDENCE',symbol:'file',headline:'The letter that needs the right desk.',description:'A request for records liaison nominations. Review the deadline and a proposed administrative route.',flags:['Deadline in the letter','Desk suggestion'],file:'Records_liaison_nomination.pdf',title:'Nomination of departmental records liaison officers',department:'General Administration',type:'Letter',level:'Internal',due:'2026-11-12',sender:'Director of Administration',summary:'Each department is requested to nominate a records liaison officer for the digital registry pilot. Nominations should be submitted by 12 November 2026.',desk:1,source:'Each department is requested to nominate a records liaison officer for the digital registry pilot. Kindly forward your nomination to the Administration Unit by 12 November 2026.',evidence:[['Department','"Administration Unit" identifies the originating business area.'],['Deadline','"By 12 November 2026" is an explicit submission deadline. Confirm that it is the appropriate review deadline.'],['First desk','A reviewing officer can verify the nomination before director approval. This is a sample routing rationale, not an organisational rule.']]},
  procurement:{label:'02 / HANDLE WITH CARE',symbol:'lock',headline:'The request that deserves a second look.',description:'A procurement request with sensitive budget context and a title already present in the sample registry.',flags:['Confidentiality review','Possible duplicate'],file:'Q4_procurement_copy.pdf',title:'Q4 office equipment procurement',department:'Finance & Accounts',type:'Request',level:'Confidential',due:'2026-11-05',sender:'Head of Procurement',summary:'Request to review the procurement schedule for office printers and scanning equipment. Budget details and vendor comparisons are included in the supporting documents.',desk:2,source:'To the Director of Finance: kindly review the Q4 procurement schedule by 5 November 2026. The accompanying budget breakdown and vendor comparisons are intended for authorised reviewers only.',evidence:[['Department','"Director of Finance" suggests the Finance & Accounts cabinet.'],['Confidentiality','"Authorised reviewers only" suggests restricted handling. The registry officer must confirm the classification.'],['First desk','This sample request is addressed directly to the Director of Finance. A director desk is suggested, but can be overridden.']]},
  clarification:{label:'03 / DO NOT GUESS',symbol:'help',headline:'The memo with a missing deadline.',description:'An instruction marked "as soon as possible". The prototype asks the officer to set a date rather than inventing one.',flags:['No explicit date','Human confirmation'],file:'Records_handover_memo.pdf',title:'Departmental records handover arrangements',department:'Human Resources',type:'Memo',level:'Internal',due:'',sender:'Human Resources Unit',summary:'Departmental officers are requested to confirm records handover arrangements before staff reassignment. The memo states "as soon as possible" but does not specify a calendar date.',desk:1,source:'From the Human Resources Unit: please confirm your departmental records handover arrangements before staff reassignment. Responses are required as soon as possible.',evidence:[['Department','"Human Resources Unit" suggests the Human Resources cabinet.'],['Deadline','"As soon as possible" is not a calendar date. No deadline is filled automatically; an officer must decide.'],['First desk','A reviewing officer can check that the handover arrangements are complete before forwarding.']]}
};
function startCapture(file=null,scenario='liaison') {
  state.docID = null;
  state.intake = file ? {step:1,sample:false,file:file.name,size:`${(file.size/1024).toFixed(1)} KB`,title:file.name.replace(/\.[^.]+$/,'').replace(/[_-]/g,' '),department:'General Administration',type:'Letter',level:'Internal',due:'',sender:'Demo submitting officer',summary:'Enter a fictional summary. This local file is not read, uploaded or processed.',desk:1} : {...intakeScenarios[scenario],step:1,sample:true,scenario,size:'Fictional sample / not an uploaded file'};
  captureModal();
}
function intakeEvidence(intake) {
  if (!intake.sample) return `<aside class="intake-evidence"><p class="eyebrow">NO SOURCE CONTENT HAS BEEN READ</p><h3>Manual preview.<br>No hidden extraction.</h3><p>The file name and size were selected locally. No text, scan or image contents have been accessed. Enter fictional details to demonstrate registration.</p><div class="notice">${icon('shield')}<span>Do not use real sensitive documents in this prototype.</span></div></aside>`;
  const matching = data.records.find(record => record.title.toLowerCase() === intake.title.toLowerCase());
  const source = escapeHTML(intakeScenarios[intake.scenario].source).replace(/12 November 2026|5 November 2026|as soon as possible|Administration Unit|Director of Finance|Human Resources Unit|authorised reviewers only/g,phrase => `<mark>${phrase}</mark>`);
  return `<aside class="intake-evidence"><p class="eyebrow">FICTIONAL SOURCE EXCERPT</p><div class="source-paper"><p class="source-paper-header">OFFICE OF THE SECRETARIAT</p><h3>${escapeHTML(intakeScenarios[intake.scenario].title)}</h3><p>${source}</p><span class="source-paper-footer">SIMULATED LETTER / NOT OCR OUTPUT</span></div><p class="eyebrow" style="margin-top:23px">WHY THESE ORIGINAL SUGGESTIONS?</p><div class="explanation-list">${intake.evidence.map(([field,reason]) => `<div><strong>${field}</strong><p>${escapeHTML(reason)}</p></div>`).join('')}</div>${matching ? `<div class="duplicate-warning">${icon('help')}<strong>A matching title already exists.</strong><p>${escapeHTML(matching.id)} &middot; ${escapeHTML(matching.title)}. This is a title match only, not a comparison of file contents.</p>${button('Use the existing record','use-matching-record','text-link',`data-id="${escapeHTML(matching.id)}"`)}</div>` : ''}</aside>`;
}
function captureModal() {
  const intake = state.intake;
  const stepper = `<div class="stepper">${['Select','Confirm details','Route & register'].map((label,index) => `${index ? icon('chevron') : ''}<span class="${intake.step === index+1 ? 'active' : ''}"><b>${index+1}</b>${label}</span>`).join('')}</div>`;
  let body = '',footer = '';
  if (intake.step === 1) {
    body = `<div class="sample-file">${fileIcon({type:'Letter'})}<div><strong>${escapeHTML(intake.file)}</strong><small>${escapeHTML(intake.size)} &middot; ${intake.sample ? 'Sample letter, ready to explore' : 'File name and size only'}</small></div>${icon('check')}</div><div class="drop-zone" id="modal-drop-zone">${icon('upload')}<h3>${intake.sample ? 'Your sample letter is ready.' : 'Local file selected.'}</h3><p>${intake.sample ? 'Continue to explore prewritten smart intake suggestions.' : 'Continue to enter fictional metadata. No file contents are read.'}</p><div class="drop-actions">${button('Choose a different file','choose-modal-file','btn btn-sm')}${!intake.sample ? button('Use sample instead','capture','btn btn-sm') : ''}</div></div><input id="modal-file-input" class="visually-hidden" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt" aria-label="Choose a fictional document"/><div class="notice" style="margin-top:18px">${icon('spark')}<span>${intake.sample ? 'The next screen shows simulated OCR and classification suggestions for this fictional letter. A person confirms every important field.' : 'Automatic extraction is not implemented. The next screen uses the file name and editable placeholder fields.'}</span></div>`;
    footer = `${button('Cancel','close-modal','btn')}${button(`Review details ${icon('arrow')}`,'intake-next','btn btn-primary')}`;
  } else if (intake.step === 2) {
    body = `<div class="notice" style="margin-bottom:21px">${icon('spark')}<span>${intake.sample ? '<strong>Sample smart intake suggestions.</strong> Please check the extracted details before registering.' : '<strong>Manual metadata preview.</strong> Add fictional details; the file itself has not been inspected.'}</span></div><form id="intake-details-form"><div class="field"><label for="intake-title">Document title</label><input id="intake-title" name="title" required maxlength="160" value="${escapeHTML(intake.title)}"/></div><div class="field-row"><div class="field"><label for="intake-department">Department cabinet</label><select id="intake-department" name="department">${options(departments,intake.department)}</select></div><div class="field"><label for="intake-type">Document type</label><select id="intake-type" name="type">${options(['Letter','Memo','Circular','Request','Report','Minutes'],intake.type)}</select></div></div><div class="field-row"><div class="field"><label for="intake-level">Confidentiality</label><select id="intake-level" name="level">${options(['Internal','Confidential'],intake.level)}</select></div><div class="field"><label for="intake-due">Review deadline</label><input id="intake-due" type="date" name="due" required min="${TODAY}" max="2027-12-31" value="${escapeHTML(intake.due)}"/></div></div><div class="field"><label for="intake-sender">From / originating office</label><input id="intake-sender" name="sender" required maxlength="100" value="${escapeHTML(intake.sender)}"/></div><div class="field"><label for="intake-summary">Document summary</label><textarea id="intake-summary" name="summary" required maxlength="1200">${escapeHTML(intake.summary)}</textarea></div></form>`;
    footer = `${button('Back','intake-back','btn')}${button(`Confirm & continue ${icon('arrow')}`,'submit-intake-details','btn btn-primary','type="submit" form="intake-details-form"')}`;
  } else {
    body = `<div class="review-summary"><p class="eyebrow">READY TO REGISTER</p><h3>${escapeHTML(intake.title)}</h3><p>${escapeHTML(intake.summary)}</p><span class="badge draft">${escapeHTML(intake.department)}</span> <span class="badge draft">${escapeHTML(intake.level)}</span></div><form id="intake-route-form"><div class="field"><label for="intake-desk">First review desk / you can override the suggestion</label><select id="intake-desk" name="desk">${route.slice(1,4).map((desk,index) => `<option value="${index+1}" ${intake.desk === index+1 ? 'selected' : ''}>${desk}${intake.sample && intakeScenarios[intake.scenario].desk === index+1 ? ' (sample suggestion)' : ''}</option>`).join('')}</select><small>The standard route continues from the desk you select.</small></div><div class="workflow-small">${route.map((desk,index) => `${index ? icon('arrow') : ''}<span>${desk}</span>`).join('')}</div><label class="check-label"><input name="confirmed" type="checkbox" required/><span>I have checked the metadata and understand this creates a fictional demo record, not a live submission.</span></label></form><div class="notice">${icon('shield')}<span>A file reference and activity trail are created automatically. Only fictional metadata is saved in this browser.</span></div>`;
    footer = `${button('Back','intake-back','btn')}${button(`${icon('check')} Register & route`,'submit-register','btn btn-primary','type="submit" form="intake-route-form"')}`;
  }
  if (intake.step === 1 && intake.sample) body = `<div class="scenario-switch">${Object.entries(intakeScenarios).map(([key,scenario]) => button(scenario.label.split(' / ')[1],'capture-scenario',`scenario-choice ${key === intake.scenario ? 'active' : ''}`,`data-scenario="${key}" aria-pressed="${key === intake.scenario}"`)).join('')}</div>`+body;
  if (intake.step === 2) body = `<div class="intake-evidence-layout">${intakeEvidence(intake)}<div class="intake-confirmation"><p class="eyebrow">CHECK, EDIT AND CONFIRM</p>${body}</div></div>`;
  if (intake.step === 3 && intake.sample) body = `<div class="routing-reason">${icon('spark')}<div><strong>Why the original desk suggestion?</strong><p>${escapeHTML(intake.evidence.at(-1)[1])}</p><span>Sample rationale / not a verified office policy. Your selection below takes precedence.</span></div></div>`+body;
  if (intake.step === 3) {
    const matching = data.records.find(record => record.title.toLowerCase() === intake.title.toLowerCase());
    if (matching) body += `<div class="duplicate-warning"><strong>Matching title: ${escapeHTML(matching.id)}</strong><p>Choose the existing record, or explicitly confirm that this is a separate submission.</p>${button('Use existing record instead','use-matching-record','text-link',`data-id="${escapeHTML(matching.id)}"`)}<label class="check-label"><input type="checkbox" name="duplicateConfirmed" form="intake-route-form" required/><span>I reviewed the title match and intend to register a separate fictional submission.</span></label></div>`;
  }
  showModal('Smart intake. Your judgement, first.',`Explainable intake &middot; Step ${intake.step} of 3`,stepper+body,footer,intake.step === 2);
}
function exportRecords() {
  const records = state.page === 'repository' ? filteredRecords() : data.records;
  const csvCell = value => `"${String(value ?? '').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')}"`;
  const rows = [['DEMONSTRATION DATA ONLY - Registry design prototype'],['Reference','Title','Department','Type','Status','Current desk','Deadline','Confidentiality'],...records.map(record => [record.id,record.title,record.department,record.type,isLate(record) ? 'Pending - overdue' : record.status,route[record.step],record.due,record.level])];
  const blob = new Blob(['\uFEFF'+rows.map(row => row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'Registry-demo-snapshot.csv'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
  toast(`Exported ${records.length} fictional records as a CSV snapshot.`);
}
function helpModal() {
  showModal('A working preview. A shared direction.','Explore the proposed EDMS before production development.',`<p class="subtle" style="line-height:1.9;margin-top:0;margin-bottom:20px">All records are fictional. Demo changes stay in this browser. Start with one of these journeys:</p><div class="help-grid">${[
    ['upload','Understand an incoming letter','Compare source evidence, question a suggestion and confirm a route.','help-capture'],
    ['arrow','Find the file, not just its status','Follow every desk and see the next human action.','help-journeys'],
    ['spark','Ask, then inspect the evidence','Move from an answer to a source and its file journey.','help-archive'],
    ['chart','Turn oversight into a considered action','Inspect the hold-up and review a source-linked follow-up draft.','help-leadership']
  ].map(([name,title,text,action]) => `<button class="help-card" data-action="${action}">${icon(name)}<div><strong>${title}</strong><small>${text}</small></div>${icon('arrow')}</button>`).join('')}</div><div class="notice" style="margin-top:20px">${icon('help')}<span>Press <strong>/</strong> to search documents. Escape closes a dialog. Reset the preview under Administration to replay it.</span></div>`,button('Start exploring','close-modal','btn btn-primary'));
}
function profileModal() {
  showModal('One registry. Different perspectives.','Role previews are explanatory, not authenticated accounts.',`<div class="help-grid">${[['Registry officer','Captures records, verifies metadata and starts routing.'],['Director','Reviews documents, adds minutes and forwards decisions.'],['Leadership','Sees departmental workloads and files that need attention.'],['Administrator','Manages users and illustrates security policies.']].map(([role,text]) => `<button class="help-card" data-action="preview-role" data-role="${role}">${icon(role === 'Leadership' ? 'chart' : role === 'Administrator' ? 'settings' : 'users')}<div><strong>${role}</strong><small>${text}</small></div>${state.previewRole === role ? icon('check') : icon('arrow')}</button>`).join('')}</div><p class="screen-reader-note">Switching perspectives opens a relevant screen. All demo records remain visible; production role enforcement is outside this prototype.</p>`);
}
function notificationModal() {
  const items = overdue();
  showModal('A few things to keep in view.','Demonstration notification centre',`${items.map(record => `<div class="notification-item">${icon('clock')}<div><p><strong>${escapeHTML(record.title)}</strong><br>Review deadline passed on ${dateLabel(record.due)}. Current desk: ${route[record.step]}.</p>${button('Open document','document','text-link',`data-id="${escapeHTML(record.id)}"`)}</div></div>`).join('') || '<p class="subtle">No overdue review alerts in the current demo.</p>'}<div class="notification-item">${icon('shield')}<div><p>Your prototype uses fictional records and local browser storage.</p><small>No email, SMS or external notifications are sent.</small></div></div>`);
}
document.addEventListener('click',event => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger || trigger.disabled) return;
  const action = trigger.dataset.action;
  if (trigger.type === 'submit' && trigger.form) return;
  if (action.startsWith('go-')) {
    if (action === 'go-overdue') { state.approvalTab = 'Overdue'; navigate('approvals'); }
    else { if (action === 'go-repository') { state.department = 'All departments'; state.query = ''; state.status = 'All statuses'; } navigate(action.slice(3)); }
    return;
  }
  if (action.startsWith('help-')) { closeModal(false); action === 'help-capture' ? startCapture() : navigate(action.slice(5)); return; }
  switch(action) {
    case 'menu': $('#sidebar').classList.add('open'); $('#mobile-scrim').classList.add('open'); trigger.setAttribute('aria-expanded','true'); break;
    case 'close-menu': closeMenu(); break;
    case 'capture': startCapture(); break;
    case 'capture-scenario': startCapture(null,trigger.dataset.scenario); break;
    case 'use-matching-record': state.intake = null; openDocument(trigger.dataset.id); toast('Opened the existing sample record. No duplicate was registered.'); break;
    case 'document': openDocument(trigger.dataset.id); break;
    case 'trace-file': state.journeyID = trigger.dataset.id; if ($('.modal')) closeModal(false); navigate('journeys'); break;
    case 'select-journey': state.journeyID = trigger.dataset.id; render(); break;
    case 'draft-minute': minuteDraftDialog(); break;
    case 'e-sign': openFeature('signature'); break;
    case 'follow-up': followUpDialog(trigger.dataset.id); break;
    case 'office-brief': officeBriefModal(); break;
    case 'inspect-desk': {const step = Number(trigger.dataset.step); const records = pending().filter(record => record.step === step); showModal(`${route[step]}: the visible queue.`,'Current sample desk positions, not live officer monitoring.',`${records.map(taskRow).join('') || emptyState('check','No files waiting here','There are no pending records at this desk in the sample workflow.')}<div class="notice" style="margin-top:18px">${icon('help')}<span>A queue tells you where a file is, not why it is delayed. Check the recorded minutes before drawing a conclusion.</span></div>`); break;}
    case 'close-modal': closeModal(); break;
    case 'cabinet': state.department = trigger.dataset.department; state.query = ''; state.status = 'All statuses'; navigate('repository'); break;
    case 'clear-cabinet': state.department = 'All departments'; render(); break;
    case 'clear-filters': state.query = ''; state.department = 'All departments'; state.status = 'All statuses'; if (state.page === 'approvals') state.approvalTab = 'Pending'; render(); break;
    case 'view-list': state.view = 'list'; render(); break;
    case 'view-grid': state.view = 'grid'; render(); break;
    case 'approval-tab': state.approvalTab = trigger.dataset.tab; render(); break;
    case 'doc-tab': openDocument(state.docID,trigger.dataset.tab); break;
    case 'approve': approveDocument(); break;
    case 'return': correctionDialog(); break;
    case 'resubmit': resubmitDialog(); break;
    case 'archive-document': {const record = getRecord(state.docID); if (record?.status !== 'Approved') break; record.status = 'Archived'; addHistory(record,'Archived with approval history','Filed in the department cabinet. Retention and disposal are not implemented.','Registry'); save(); render(); openDocument(record.id,'history'); toast('Sample record archived. Its history remains available.'); break;}
    case 'intake-next': state.intake.step++; captureModal(); break;
    case 'intake-back': {if ($('#intake-details-form')) {const values = new FormData($('#intake-details-form')); for (const key of ['title','department','type','level','due','sender','summary']) state.intake[key] = values.get(key);} if ($('#intake-desk')) state.intake.desk = Number($('#intake-desk').value); state.intake.step--; captureModal(); break;}
    case 'choose-file': $('#local-file-input')?.click(); break;
    case 'choose-modal-file': $('#modal-file-input')?.click(); break;
    case 'ask-suggestion': askArchive(trigger.dataset.question); break;
    case 'export': exportRecords(); break;
    case 'setting': data.settings[trigger.dataset.setting] = !data.settings[trigger.dataset.setting]; save(); render(); toast('Demo preference updated. No production policy changed.'); break;
    case 'help': helpModal(); break;
    case 'profile': profileModal(); break;
    case 'notifications': notificationModal(); break;
    case 'preview-role': state.previewRole = trigger.dataset.role; closeModal(false); navigate({'Registry officer':'dashboard',Director:'approvals',Leadership:'leadership',Administrator:'admin'}[state.previewRole]); toast(`${state.previewRole} perspective. All demo records remain visible.`); break;
    case 'add-user': showModal('A new person in the workspace.','Create a fictional user for this preview.',`<form id="add-user-form"><div class="field"><label for="user-name">Fictional full name</label><input id="user-name" name="name" required minlength="3" maxlength="70" placeholder="e.g. Zainab Mohammed"/></div><div class="field"><label for="user-role">Role</label><select id="user-role" name="role">${options(['Registry officer','Reviewing officer','Director','Administrator'],'Registry officer')}</select></div><div class="field"><label for="user-department">Department</label><select id="user-department" name="department">${options(departments,departments[0])}</select></div></form><div class="notice">${icon('users')}<span>No account, password or invitation is created. This adds an entry to the fictional user list only.</span></div>`,`${button('Cancel','close-modal','btn')}${button('Add demo user','submit-user','btn btn-primary','type="submit" form="add-user-form"')}`); break;
    case 'reset': showModal('Start with a clean desk.','Reset the fictional demonstration workspace.',`<p class="subtle" style="font-size:12px;line-height:1.9">This removes your captured demo records, comments, approval changes and added users. The original 10 fictional documents and default settings will be restored.</p>`,`${button('Keep my demo changes','close-modal','btn')}${button('Reset demonstration','confirm-reset','btn btn-danger')}`); break;
    case 'confirm-reset': data = initialData(); state.query = ''; state.department = 'All departments'; state.status = 'All statuses'; state.approvalTab = 'Pending'; state.answer = null; state.intake = null; state.journeyID = null; state.journeyQuery = ''; state.followUpID = null; clearTimeout(archiveTimer); save(); closeModal(false); render(); toast('The original demonstration workspace has been restored.'); break;
  }
});
document.addEventListener('submit',event => {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  if (form.id === 'global-search-form') { state.query = $('#global-search').value.trim(); state.department = 'All departments'; state.status = 'All statuses'; navigate('repository'); }
  if (form.id === 'archive-form') { const question = $('#archive-question').value.trim(); if (question) askArchive(question); }
  if (form.id === 'comment-form') { const record = getRecord(state.docID); const note = values.get('comment').trim(); if (!note) return; addHistory(record,'Minute added',note,'Amina Bello'); save(); render(); openDocument(record.id,'history'); toast('Comment added to the sample activity trail.'); }
  if (form.id === 'minute-draft-form') {const record = getRecord(state.docID); const note = values.get('note').trim(); if (!record || note.length < 10) return; addHistory(record,'Minute added',note,'Demo reviewing officer'); save(); render(); openDocument(record.id,'history'); toast('Reviewed sample minute added. Document status did not change.');}
  if (form.id === 'follow-up-form') {const record = getRecord(state.followUpID); const note = values.get('note').trim(); if (!record || record.status !== 'Pending' || note.length < 10) return; addHistory(record,'Follow-up draft saved',note,'Demo leadership desk'); save(); closeModal(false); render(); toast('Reviewed draft recorded in the demo trail. No message was sent.');}
  if (form.id === 'correction-form') { const record = getRecord(state.docID); if (!record || record.status !== 'Pending') return; const note = values.get('note').trim(); if (note.length < 5) return; const from = route[record.step]; record.status = 'Correction'; record.step = 1; addHistory(record,'Returned for correction',note,from); save(); render(); openDocument(record.id,'history'); toast('Returned to the reviewing officer with your note.'); }
  if (form.id === 'resubmit-form') { const record = getRecord(state.docID); if (!record || record.status !== 'Correction') return; const note = values.get('note').trim(); if (note.length < 5) return; record.status = 'Pending'; record.step = 2; record.version++; record.due = record.due < TODAY ? '2026-11-06' : record.due; addHistory(record,`Corrected and resubmitted as v${record.version}.0`,note,'Reviewing officer'); save(); render(); openDocument(record.id,'history'); toast('New sample version submitted to the director.'); }
  if (form.id === 'intake-details-form') {
    for (const key of ['title','department','type','level','due','sender','summary']) { state.intake[key] = values.get(key).trim(); if (!state.intake[key]) { toast('Complete all document details before continuing.',true); return; } }
    state.intake.step = 3; captureModal();
  }
  if (form.id === 'intake-route-form') {
    const intake = state.intake;
    const serial = Math.max(...data.records.map(record => Number(record.id.split('/').pop())).filter(Number.isFinite),148)+1;
    const record = {id:`REG/2026/${String(serial).padStart(4,'0')}`,title:intake.title,department:intake.department,type:intake.type,level:intake.level,due:intake.due,sender:intake.sender,summary:intake.summary,file:intake.file,step:Number(values.get('desk')),owner:'Amina Bello',date:TODAY,status:'Pending',version:1,history:[]};
    addHistory(record,'Captured with smart intake',intake.sample ? 'Sample suggestions checked and confirmed by the registry officer.' : 'Fictional metadata entered manually. Local file contents were not read.','Amina Bello');
    addHistory(record,`Routed to ${route[record.step]}`,'Review deadline and confidentiality recorded.','Amina Bello');
    data.records.unshift(record); save(); state.intake = null; render(); openDocument(record.id); toast(`Registered as ${record.id}. The approval journey has begun.`);
  }
  if (form.id === 'add-user-form') { const name = values.get('name').trim(); if (name.length < 3) return; if (data.users.some(user => user.name.toLowerCase() === name.toLowerCase())) { toast('A fictional user with that name already exists.',true); return; } data.users.push({name,role:values.get('role'),department:values.get('department')}); save(); closeModal(false); render(); toast('Fictional user added. No real account has been created.'); }
});
document.addEventListener('input',event => {
  if (event.target.id === 'repository-search') { state.query = event.target.value; $('#repository-results').innerHTML = repositoryResults(); }
  if (event.target.id === 'journey-search') {state.journeyQuery = event.target.value; $('#journey-options').innerHTML = journeyOptions();}
});
document.addEventListener('change',event => {
  if (event.target.id === 'department-filter') { state.department = event.target.value; render(); }
  if (event.target.id === 'status-filter') { state.status = event.target.value; $('#repository-results').innerHTML = repositoryResults(); }
  if (['local-file-input','modal-file-input'].includes(event.target.id) && event.target.files[0]) startCapture(event.target.files[0]);
});
document.addEventListener('dragover',event => { const zone = event.target.closest('.drop-zone'); if (zone) { event.preventDefault(); zone.classList.add('dragging'); } });
document.addEventListener('dragleave',event => { const zone = event.target.closest('.drop-zone'); if (zone && !zone.contains(event.relatedTarget)) zone.classList.remove('dragging'); });
document.addEventListener('drop',event => { const zone = event.target.closest('.drop-zone'); if (zone) { event.preventDefault(); zone.classList.remove('dragging'); const file = event.dataTransfer.files[0]; if (file) startCapture(file); } });
document.addEventListener('keydown',event => {
  const modal = $('.modal');
  if (event.key === 'Escape') { if (modal) closeModal(); else closeMenu(); }
  if (event.key === '/' && !modal && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); $('#global-search').focus(); }
  if (event.key === 'Tab' && modal) {
    const focusable = Array.from(modal.querySelectorAll('button:not(:disabled),a[href],input:not([type="file"]):not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(element => element.getClientRects().length);
    const first = focusable[0],last = focusable[focusable.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
$('#modal-root').addEventListener('click',event => { if (event.target.classList.contains('modal-overlay')) closeModal(); });
window.addEventListener('hashchange',() => {
  const page = location.hash.slice(1);
  state.page = Object.hasOwn(pageNames,page) ? page : 'landing';
  clearTimeout(archiveTimer); closeMenu(); if ($('.modal')) closeModal(false); render(); window.scrollTo(0,0); $('#main').focus({preventScroll:true});
});
state.page = Object.hasOwn(pageNames,location.hash.slice(1)) ? location.hash.slice(1) : 'landing';
window.addEventListener('DOMContentLoaded',render);
