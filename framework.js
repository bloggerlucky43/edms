'use strict';

const ORGANISATION = 'Office of the Head of the Civil Service of the Federation';
const FX_KEY = 'ohcsf-framework-prototype-v1';
const modules = [
  {number:'01',name:'Capture & intake',page:'captureops',symbol:'upload',phase:'First release',description:'From scanned paper, email and bulk imports to checked, classified records.',features:['smart','scan','email','bulk','classify','metadata','duplicate']},
  {number:'02',name:'Document repository',page:'repositorytools',symbol:'folder',phase:'First release',description:'Cabinets, folders, working copies and a recoverable history.',features:['browse','folders','checkout','versions','compare','rollback','preview','bookmark']},
  {number:'03',name:'Search & discovery',page:'discovery',symbol:'search',phase:'First release',description:'Find a reference, search sample content and retain useful searches.',features:['search','advanced','savedSearch','alerts','semantic','archiveAsk']},
  {number:'04',name:'Workflow & approvals',page:'workflows',symbol:'inbox',phase:'First release',description:'Use the authority reference to route treatment and review tasks; explore illustrative processes.',features:['approval','designer','parallel','conditional','delegation','reminders','escalation','signature','seal','templates']},
  {number:'05',name:'Collaboration',page:'teamwork',symbol:'users',phase:'Expansion',description:'Shared workspaces, annotations, subscriptions and receipt-aware circulars.',features:['workspace','annotation','mentions','subscription','sharing','receipts','notifications']},
  {number:'06',name:'Registry & correspondence',page:'correspondence',symbol:'file',phase:'Expansion',description:'Incoming and outgoing registers connected to dispatch and physical custody.',features:['incoming','outgoing','numbering','tracking','custody','dispatch','verification']},
  {number:'07',name:'Security & access control',page:'access',symbol:'shield',phase:'First release',description:'A designed sign-in journey, access policies and inspectable audit evidence.',features:['signin','mfa','permissions','clearance','encryption','watermark','audit','siem']},
  {number:'08',name:'Records management',page:'records',symbol:'clock',phase:'Expansion',description:'Classification schedules, holds, appraisal, archiving and controlled disposition.',features:['retention','hold','appraisal','disposal','restore','standards']},
  {number:'09',name:'Reporting & oversight',page:'reports',symbol:'chart',phase:'Expansion',description:'Operational reports, SLA views, adoption and leadership briefing.',features:['command','sla','adoption','reports','reportSchedule','export']},
  {number:'10',name:'Intelligence',page:'intelligence',symbol:'spark',phase:'Headline + expansion',description:'Explainable assistance with human review and source visibility.',features:['smart','archiveAsk','summary','routing','minute','translation','sensitive','anonymise','rescue','weeklyBrief']},
  {number:'11',name:'Integrations',page:'integrations',symbol:'settings',phase:'Expansion',description:'Preview identity, HR, email, scanner, office and API connections.',features:['identityConnector','hrConnector','emailConnector','scannerConnector','officeConnector','api','publicPortal']},
  {number:'12',name:'Platform & administration',page:'platform',symbol:'grid',phase:'First release + expansion',description:'Manage the demonstration organisation, accessibility and recovery journeys.',features:['users','organisation','mobile','offline','language','accessibility','backup','recovery','architecture']}
];
const featureLabels = {
  smart:'Explainable smart intake',scan:'Scanner & OCR desk',email:'Email-to-record intake',bulk:'Bulk import review',classify:'Classification & tagging',metadata:'Custom metadata fields',duplicate:'Duplicate review',browse:'Cabinet browser',folders:'Folder hierarchy',checkout:'Check-out / check-in',versions:'Version history',compare:'Side-by-side comparison',rollback:'Version rollback',preview:'Multi-format preview',bookmark:'Bookmarks & favourites',search:'Full-text sample search',advanced:'Advanced search',savedSearch:'Saved searches',alerts:'Search alerts',semantic:'Semantic search preview',archiveAsk:'Ask the Archive',approval:'Approval inbox',designer:'Visual workflow studio',parallel:'Parallel review & merge',conditional:'Conditional route preview',delegation:'Delegation & out-of-office',reminders:'Reminder policy',escalation:'Escalation policy',signature:'Signature preview',seal:'Stamp & seal preview',templates:'Civil-service process templates',workspace:'Shared workspace',annotation:'Document annotations',mentions:'Officer mentions',subscription:'Subscriptions',sharing:'Secure sharing preview',receipts:'Circular read receipts',notifications:'Notification channels',incoming:'Incoming correspondence',outgoing:'Outgoing correspondence',numbering:'File-numbering rules',tracking:'File movement',custody:'Physical-file custody',dispatch:'Dispatch register',verification:'QR / letter verification',signin:'Sign-in journey',mfa:'Two-factor verification',permissions:'Role permission matrix',clearance:'Clearance & access decisions',encryption:'Encryption policy preview',watermark:'Watermark controls',audit:'Audit trail',siem:'SIEM event preview',retention:'Retention schedules',hold:'Legal holds',appraisal:'Record appraisal',disposal:'Controlled disposal',restore:'Restore archived record',standards:'Records standards & policy',command:'Leadership command view',sla:'SLA & turnaround view',adoption:'Adoption & activity',reports:'Report builder',reportSchedule:'Scheduled reporting',export:'CSV / PDF preview',summary:'Document summary',routing:'Routing rationale',minute:'Minute drafting',translation:'Translation preview',sensitive:'Sensitive-content detection',anonymise:'Anonymisation preview',rescue:'Archive rescue',weeklyBrief:'Weekly briefing preview',identityConnector:'Directory / SSO connector',hrConnector:'HR / IPPIS connector',emailConnector:'Email connector',scannerConnector:'Scanner connector',officeConnector:'Office applications',api:'API sandbox',publicPortal:'Public submission portal',users:'Users & roles',organisation:'Organisation configuration',mobile:'Mobile approvals preview',offline:'Offline capture queue',language:'Language preferences',accessibility:'Accessibility controls',backup:'Backup snapshot',recovery:'Recovery rehearsal',architecture:'Proposed technical architecture'
};
function initialFX() {
  return {config:{},log:[],folders:['2026 / Circulars','2026 / Personnel','2026 / Procurement'],bookmarks:[],annotations:[],shares:[],receipts:[],correspondence:[{id:'IN/2026/001',direction:'Incoming',subject:'Records liaison nominations',sender:'Sample MDA registry',status:'Prepared illustration / not registered'},{id:'OUT/2026/001',direction:'Outgoing',subject:'Acknowledgement of workplan receipt',sender:'OHCSF demonstration registry',status:'Prepared dispatch illustration'}],custody:[],dispatch:[],holds:[],retention:[{category:'Personnel records',years:7,action:'Appraise'},{category:'Administrative correspondence',years:5,action:'Review for disposal'},{category:'Policy circulars',years:0,action:'Permanent archive'}],disposed:[],offline:[],tickets:[],workflow:route.map((title,index) => index === route.length-1 ? 'Archive / existing final decision required' : index < 2 ? `${title} / mandatory intake` : `${index === 2 ? 'Responsible departmental Director (PRS / HRM / Finance)' : title} / GL${String(staffRanks[index-2].grade).padStart(2,'0')} / ${index === 2 ? 'mandatory first departmental assignment' : 'optional authority reference'}`),parallel:[false,false],snapshot:null};
}
let fx = initialFX();
try {const stored = JSON.parse(localStorage.getItem(FX_KEY)); if (stored && Array.isArray(stored.log)) fx = {...initialFX(),...stored};} catch {}
let activeFeature = null;
let fxStep = 0;
let authStep = 0;
function fxSave(action,note='') {
  if (action) fx.log.unshift({action,note,time:new Date().toISOString()});
  try {localStorage.setItem(FX_KEY,JSON.stringify(fx));} catch {toast('Demo state could not be saved; this preview remains usable.',true);}
}
function decoratePrototype() {
  document.querySelectorAll('.letter-letterhead h3').forEach(element => {element.textContent = ORGANISATION.toUpperCase();});
  document.querySelectorAll('.letter-seal').forEach(element => {element.innerHTML = '<img src="nigeria-coat-of-arms.svg" alt="Nigeria coat of arms" class="document-coat"/>';});
  document.querySelectorAll('.source-paper-header').forEach(element => {element.textContent = 'OHCSF / FEDERAL REPUBLIC OF NIGERIA';});
  document.querySelectorAll('.office-brief-paper>.eyebrow').forEach(element => {element.textContent = 'OHCSF / DEMONSTRATION BRIEFING NOTE';});
  document.querySelectorAll('.preview-toolbar').forEach(element => {if (!element.querySelector('.fx-file-notice')) element.insertAdjacentHTML('beforeend','<span class="fx-file-notice">Fictional illustration only</span>');});
  const record = state.docID && getRecord(state.docID);
  const paper = document.querySelector('.letter-paper');
  if (record) {
    const metadata = document.querySelector('.document-meta .metadata-list');
    const details = [['Priority',processPriority(record)],['Receipt channel',record.sourceChannel || 'Not recorded'],['Assigned officer',routeOffice(record)?.name || 'Unassigned']];
    if (record.physicalReference) details.push(['Physical reference',record.physicalReference]);
    if (metadata) {
      for (const [label,value] of details) {
        const existing = Array.from(metadata.children).find(row => row.querySelector('dt')?.textContent === label);
        if (existing) existing.querySelector('dd').textContent = value;
        else metadata.insertAdjacentHTML('beforeend',`<div><dt>${label}</dt><dd>${escapeHTML(value)}</dd></div>`);
      }
      const department = Array.from(metadata.children).find(row => row.querySelector('dt')?.textContent === 'Department');
      if (department) department.querySelector('dd').textContent = departmentLabel(record.department);
    }
    const brief = document.querySelector('.decision-brief-side');
    if (brief) {
      const priority = Array.from(brief.querySelectorAll('.brief-fact')).find(fact => fact.querySelector('strong')?.textContent === 'Priority');
      if (priority) priority.querySelector('span').textContent = processPriority(record);
      else brief.insertAdjacentHTML('beforeend',`<div class="brief-fact">${icon('clock')}<div><strong>Priority</strong><span>${processPriority(record)}</span></div></div>`);
      brief.querySelectorAll('.brief-fact').forEach(fact => {
        const label = fact.querySelector('strong')?.textContent;
        if (label === 'Current desk') fact.querySelector('span').textContent = deskLabel(record);
        if (label === 'Handling') fact.querySelector('span').textContent = `${record.level} / ${departmentLabel(record.department)}`;
      });
    }
    if (paper) {
      const addressee = Array.from(paper.children).find(element => element.tagName === 'P' && /^To:/.test(element.textContent));
      if (addressee) addressee.textContent = `To: ${record.addressedTo || 'The Permanent Secretary'}`;
      const office = paper.querySelector('.letter-letterhead p');
      if (office) office.textContent = `${departmentLabel(record.department).toUpperCase()} / DEMONSTRATION OFFICE`;
    }
    const routeList = document.querySelector('.document-meta .route-list');
    if (routeList) {
      if (routeList.previousElementSibling?.tagName === 'H3') routeList.previousElementSibling.textContent = 'Authority reference / recorded actions';
      const visited = new Set(record.history.filter(event => Number.isInteger(event.fromStep)).map(event => event.fromStep));
      routeList.innerHTML = route.map((desk,index) => {
        const current = index === record.step;
        const recorded = visited.has(index);
        const label = current ? record.status === 'Archived' ? 'Filed with history' : record.status === 'Approved' ? 'Historical approval / ready for filing' : record.status === 'Correction' ? 'Returned for action' : record.status === 'Treated' ? 'Treatment recorded / awaiting review' : 'Current desk' : recorded ? 'Action recorded' : index === route.length-1 ? 'Existing final decision required' : index > 2 ? 'Optional authority / no recorded action' : 'No recorded action';
        return `<li class="route-step"><span class="route-marker ${current ? 'current' : recorded ? 'done' : ''}">${!current && recorded ? icon('check') : index+1}</span><div>${escapeHTML(deskLabel(record,index))}<small>${label}</small></div></li>`;
      }).join('');
    }
    document.querySelectorAll('.document-meta small,.document-meta dd').forEach(element => {
      if (/Approved by (?:the )?Permanent Secretary/i.test(element.textContent)) element.textContent = 'Final authority is not inferred from a desk position.';
    });
  }
  const endorsement = record && fx.config[`signature-${record.id}`];
  if (paper && endorsement && !paper.querySelector('.fx-signed-document')) paper.insertAdjacentHTML('beforeend',`<div class="fx-signed-document"><span class="eyebrow">ELECTRONIC SIGNATURE / DEMONSTRATION ONLY</span>${endorsement.image ? `<img src="${endorsement.image}" alt="Fictional drawn signature preview"/>` : `<strong class="fx-written-signature">${escapeHTML(endorsement.signer)}</strong>`}<p>${escapeHTML(endorsement.designation)} / ${escapeHTML(endorsement.date)} / Signed version ${endorsement.version || 1}.0</p>${(endorsement.version || 1) !== record.version ? `<p><strong>Historical signature only. Current version ${record.version}.0 is not covered by this signature.</strong></p>` : ''}<small>NOT A LEGALLY BINDING SIGNATURE / NO CERTIFICATE OR IDENTITY VALIDATION</small></div>`);
}
function signatureVersionHistory(record) {
  const latest = fx.config[`signature-${record.id}`];
  const signatures = fx.config[`signatures-${record.id}`] || (latest ? [latest] : []);
  return signatures.length ? `<section class="panel panel-padding"><h3>Recorded E-signatures</h3>${signatures.map(signature => `<div class="role-item"><span class="avatar">v${signature.version || 1}</span><div><strong>${escapeHTML(signature.signer)}</strong><small>${escapeHTML(signature.designation)} / ${escapeHTML(signature.mode)} / ${escapeHTML(signature.date)} / Version ${signature.version || 1}.0</small></div></div>`).join('')}<p class="subtle">Earlier signatures are retained as historical endorsements, not signatures of revised versions. Demonstration only.</p></section>` : '';
}
function fxButton(label,feature,style='btn btn-sm') {return button(label,'fx-open',style,`data-feature="${feature}"`);}
function fxNotice(text='Design prototype only. These controls use fictional metadata; no live files, accounts, messages or government systems are affected.') {return `<div class="notice fx-notice">${icon('shield')}<span>${text}</span></div>`;}
function fxTable(headers,rows) {return `<div class="panel table-wrap"><table class="document-table"><thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}">No demonstration entries yet.</td></tr>`}</tbody></table></div>`;}
function recordOptions() {return visibleRecords().map(record => `<option value="${escapeHTML(record.id)}">${escapeHTML(record.id)} / ${escapeHTML(record.title)}</option>`).join('');}
function field(label,name,type='text',value='',choices=[]) {
  const id = `fx-${name}`;
  return `<div class="field"><label for="${id}">${label}</label>${type === 'select' ? `<select id="${id}" name="${name}">${choices.map(choice => `<option value="${escapeHTML(choice)}" ${choice === value ? 'selected' : ''}>${escapeHTML(departmentLabel(choice))}</option>`).join('')}</select>` : type === 'record' ? `<select id="${id}" name="${name}">${recordOptions()}</select>` : type === 'textarea' ? `<textarea id="${id}" name="${name}" required maxlength="1200">${escapeHTML(value)}</textarea>` : `<input id="${id}" type="${type}" name="${name}" value="${escapeHTML(value)}" ${type === 'number' ? 'min="0" max="100"' : 'maxlength="160"'} required/>`}</div>`;
}
function consent(text='I understand this records a fictional prototype action, not a live government transaction.') {return `<label class="check-label"><input type="checkbox" name="confirmed" required/><span>${text}</span></label>`;}
function featureForm(feature,body,actionLabel='Save demo configuration',wide=false) {
  activeFeature = feature;
  showModal(featureLabels[feature],`${ORGANISATION} / Prototype`,`${fxNotice()}<form id="fx-feature-form" data-feature="${feature}">${body}${consent()}</form>`,`${button('Cancel','close-modal','btn')}${button(actionLabel,'fx-submit','btn btn-primary','type="submit" form="fx-feature-form"')}`,wide);
}
function moduleCards(module) {return `<div class="fx-feature-grid">${module.features.map(feature => `<button class="fx-feature-card" data-action="fx-open" data-feature="${feature}"><span>${icon(module.symbol)}</span><strong>${featureLabels[feature]}</strong><small>${fx.config[feature] ? 'Demo configuration saved' : 'Open designed journey'}</small>${icon('arrow')}</button>`).join('')}</div>`;}
function moduleHeading(module) {return `${heading(`MODULE ${module.number} / ${module.phase.toUpperCase()}`,module.name,module.description,button(`${icon('grid')} All modules`,'go-modules','btn'))}${fxNotice()}`;}
function modulePage(module) {
  const recent = fx.log.slice(0,5);
  return `${moduleHeading(module)}${moduleHighlights(module)}<div class="section-heading fx-section"><h2>Designed capabilities <span class="count-pill">${module.features.length}</span></h2><span class="subtle">Select a capability to explore its prototype flow</span></div>${moduleCards(module)}<section class="fx-activity"><div class="section-heading"><h2>Demonstration activity</h2></div>${fxTable(['Action','Detail','Time'],recent.map(event => [escapeHTML(event.action),escapeHTML(event.note),new Date(event.time).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})]))}</section>`;
}
function modulesPage() {
  return `${heading('FRAMEWORK DESIGN COVERAGE','One framework. Twelve connected modules.','First-release and expansion capabilities are both represented as interactive design previews.',button('Explore an assigned file','go-approvals','btn btn-primary'))}<div class="fx-coverage-banner"><div><span class="eyebrow">OHCSF / COMPLETE MODULE MAP</span><h2>From the registry desk to the national archive.</h2><p>Every module below leads to its designed capabilities. Coverage means screens and simulated journeys, not production readiness, security accreditation or integration certification.</p></div><span>12<small>MODULES</small></span></div><div class="fx-module-grid">${modules.map(module => `<a class="fx-module-card" href="#${module.page}"><div><span class="eyebrow">${module.number} / ${module.phase}</span>${icon(module.symbol)}</div><h2>${module.name}</h2><p>${module.description}</p><footer>${module.features.length} designed capabilities ${icon('arrow')}</footer></a>`).join('')}</div><div class="notice fx-section">${icon('help')}<span>Incoming mail must pass PS Registry, PS and the responsible departmental Director. Thereafter the organogram defines authority, not a compulsory all-rank process: route treatment to a lower departmental rank or request review from a senior rank. A review request is not approval; final approval and dispatch authority remain unconfigured.</span></div>`;
}
function moduleHighlights(module) {
  if (module.page === 'workflows') return workflowPreview();
  if (module.page === 'correspondence') {
    const entries = fx.correspondence.filter(entry => entry.documentID ? Boolean(getRecord(entry.documentID)) : entry.department ? canAccessDepartment(entry.department) : isCentralOfficer());
    return fxNotice('Incoming mail is registered once through PS Registry capture and linked to its document. Unlinked entries are retained illustrations, not registered mail.')+fxTable(['Reference','Direction','Department','Subject','State'],entries.map(entry => {
      const record = entry.documentID && getRecord(entry.documentID);
      return [escapeHTML(entry.id),escapeHTML(entry.direction),escapeHTML(departmentLabel(record?.department || entry.department || centralDepartment)),record ? button(escapeHTML(entry.subject),'document','text-link',`data-id="${escapeHTML(record.id)}"`) : escapeHTML(entry.subject),escapeHTML(record ? record.status : entry.direction === 'Incoming' ? 'Prepared illustration / not registered' : entry.status)];
    }));
  }
  if (module.page === 'records') return fxTable(['Category','Illustrative retention','Disposition'],fx.retention.map(rule => [escapeHTML(rule.category),rule.years ? `${rule.years} years` : 'Permanent',escapeHTML(rule.action)]));
  if (module.page === 'access') return `<div class="fx-two-column"><div class="panel panel-padding"><p class="eyebrow">DESIGNING TRUST</p><h2 class="fx-serif">The right officer.<br>The right level of access.</h2><p>Preview authentication, role permissions, document handling and audit evidence without entering real credentials.</p>${fxButton('Try the sign-in journey','signin','btn btn-primary')}</div><div class="panel panel-padding"><p class="eyebrow">POLICY IS NOT ENFORCEMENT</p><h2 class="fx-serif">Visible safeguards.<br>Honest boundaries.</h2><p>Policies here are editable illustrations. They do not encrypt documents, enforce real access or authenticate a civil servant.</p>${fxButton('Inspect the access matrix','permissions','btn')}</div></div>`;
  if (module.page === 'intelligence') return `<div class="intelligence-manifesto"><div><p class="eyebrow">LOCALLY HOSTED INTELLIGENCE / PROPOSED ARCHITECTURE</p><h2>Assist the officer.<br><em>Never hide the evidence.</em></h2><p>Summarisation, routing, translation, redaction and archive rescue all use fictional examples. Every important change requires human review.</p></div></div>`;
  if (module.page === 'reports') return `<div class="stats-grid">${stat('Tracked records',visibleRecords().length,'Current department registry','file')}${stat('Overdue',overdue().length,'Fixed demo date: 5 Nov 2026','clock',true)}${stat('Completed',closed().length,'Approved or archived','check')}${stat('Demo actions',fx.log.length,'Actions recorded in this browser','chart')}</div>`;
  if (module.page === 'platform') return `<div class="fx-phase-strip"><span><strong>Phase 1</strong>Capture, repository, search, access, approvals + three headline experiences</span><span><strong>Phase 2</strong>Mobile, physical registry, verification, archive rescue and additional workflows</span><span><strong>Phase 3</strong>Retention, integrations and organisational scale</span></div>`;
  return '';
}
function workflowPreview() {
  const steps = initialFX().workflow;
  return `<div class="fx-process-panel"><div class="section-heading"><h2>MDA authority reference / ${steps.length-1} offices + Archive</h2><span class="badge draft">Example path / not compulsory</span></div><div class="fx-process-track" tabindex="0" aria-label="Authority ladder, not a compulsory document route">${steps.map((step,index) => `<div><span>${index+1}</span><strong>${escapeHTML(step)}</strong>${index === 1 ? '<small>Confirms the responsible department</small>' : index === 2 ? '<small>First departmental recipient</small>' : index === steps.length-1 ? '<small>Not an automatic handoff</small>' : index > 2 ? '<small>Treatment or review as authorized</small>' : ''}</div>`).join('')}</div><p class="subtle">Mandatory intake: PS Registry &rarr; PS &rarr; responsible departmental Director. The organogram defines authority; it does not force every document through every rank. Director is GL17 and there is no GL11 office.</p><p class="subtle">For treatment: select any lower rank in the same department, skipping intermediate ranks. For review / approval: select any senior rank in the same department; the Director may escalate to PS. This is a request, not approval. Any assigned departmental officer may explicitly Record Treatment: the file stays assigned and becomes Treated awaiting review, then its report can be routed upward for review.</p><p class="subtle">Corrections return to the actual recorded sender, not the numerically preceding rank; resubmission goes to the exact requester. Final approval authority remains unconfigured, and Archive requires an existing final decision. Editing this illustration does not change authority-based operational rules.</p></div>`;
}
const frameworkPages = {modules:modulesPage,public:publicPage,verify:verificationPage};
modules.forEach(module => {frameworkPages[module.page] = () => modulePage(module);});
frameworkPages.repository = ministryRepositoryPage;

function ministryRepositoryPage() {
  state.repositoryDepartment ??= null;
  state.repositoryUnit ??= null;
  state.repositoryRootOpen ??= false;
  const ownDepartment = currentOfficer.department;
  if (state.repositoryDepartment !== null && (!Object.hasOwn(departmentUnits,state.repositoryDepartment) || !canAccessDepartment(state.repositoryDepartment)) || state.repositoryUnit !== null && (!state.repositoryDepartment || !departmentUnits[state.repositoryDepartment]?.includes(state.repositoryUnit)) || !state.repositoryRootOpen && (state.repositoryDepartment !== null || state.repositoryUnit !== null)) {
    state.repositoryDepartment = null;
    state.repositoryUnit = null;
    state.repositoryRootOpen = false;
    state.query = '';
  }
  const department = state.repositoryDepartment;
  const unit = state.repositoryUnit;
  const units = departmentUnits[department] || [];
  const title = unit || (department && departmentLabel(department)) || (state.repositoryRootOpen ? 'Permanent Secretary' : 'Ministry repository');
  const description = unit ? 'Documents filed in the selected sub-department. Search by title or reference.' : department ? 'Open a sub-department to browse its documents. PS Registry and PS can browse all departments; departmental officers stay within their own department.' : state.repositoryRootOpen ? 'The highest office in the ministry. Every department folder sits directly beneath the Permanent Secretary.' : 'Permanent Secretary, departments, sub-departments, then documents. A clear filing structure for the ministry.';
  const breadcrumbs = `<nav class="ministry-repository-breadcrumbs" aria-label="Repository breadcrumb"><ol><li>${button('Repository','repo-back','',`data-level="repository" ${!state.repositoryRootOpen ? 'aria-current="page"' : ''}`)}</li>${state.repositoryRootOpen ? `<li>${button('Permanent Secretary','repo-open-root','',!department ? 'aria-current="page"' : '')}</li>` : ''}${department ? `<li>${button(escapeHTML(departmentLabel(department)),'repo-back','',`data-level="department" data-department="${escapeHTML(department)}" ${!unit ? 'aria-current="page"' : ''}`)}</li>` : ''}${unit ? `<li><span aria-current="page">${escapeHTML(unit)}</span></li>` : ''}</ol></nav>`;
  let content;
  if (!state.repositoryRootOpen) {
    content = `<section aria-label="Highest ministry office"><button type="button" class="ministry-repository-root" data-action="repo-open-root"><span class="ministry-repository-folder-icon">${icon('folder')}</span><span class="ministry-repository-root-copy"><span class="eyebrow">HIGHEST OFFICE / MINISTRY ROOT</span><strong>Permanent Secretary</strong><span>Open the ministry's department folders.</span></span><span class="ministry-repository-open">Open folder ${icon('arrow')}</span></button></section>`;
  } else if (!department) {
    content = `<section aria-labelledby="ministry-repository-folders"><div class="section-heading"><h2 id="ministry-repository-folders">Department folders</h2><span class="subtle">Folder names are visible; contents are department-restricted</span></div><div class="ministry-repository-folders">${Object.keys(departmentUnits).map(name => {
      const allowed = canAccessDepartment(name);
      return `<button type="button" class="ministry-repository-folder${allowed ? ' own-department' : ' restricted'}" data-action="repo-department" data-department="${escapeHTML(name)}" ${allowed ? '' : 'disabled aria-disabled="true"'}><span class="ministry-repository-folder-top">${icon('folder')}<span>${icon(allowed ? 'shield' : 'lock')}${allowed ? isCentralOfficer() ? 'Central office access' : 'Your department' : 'Restricted'}</span></span><strong>${escapeHTML(departmentLabel(name))}</strong><span class="ministry-repository-folder-detail">${allowed ? 'Open sub-departments' : 'Department access required'}</span>${allowed ? `<span class="ministry-repository-folder-footer">Open folder ${icon('arrow')}</span>` : '<span class="ministry-repository-folder-footer">Folder name only</span>'}</button>`;
    }).join('')}</div></section>`;
  } else if (!unit) {
    const records = visibleRecords().filter(record => canAccessRecord(record) && record.department === department);
    content = `<section aria-labelledby="ministry-repository-folders"><div class="section-heading"><h2 id="ministry-repository-folders">Sub-department folders</h2>${button('All department folders','repo-back','text-link','data-level="root"')}</div><div class="ministry-repository-folders">${units.map(name => {
      const count = records.filter(record => recordUnit(record) === name).length;
      return `<button type="button" class="ministry-repository-folder" data-action="repo-unit" data-department="${escapeHTML(department)}" data-unit="${escapeHTML(name)}"><span class="ministry-repository-folder-top">${icon('folder')}<span>Sub-department</span></span><strong>${escapeHTML(name)}</strong><span class="ministry-repository-folder-detail">${count} accessible document${count === 1 ? '' : 's'}</span><span class="ministry-repository-folder-footer">Open folder ${icon('arrow')}</span></button>`;
    }).join('')}</div></section>`;
  } else {
    content = `<section aria-labelledby="ministry-repository-documents"><div class="section-heading"><h2 id="ministry-repository-documents">Documents</h2>${button('All sub-departments','repo-back','text-link',`data-level="department" data-department="${escapeHTML(department)}"`)}</div><div class="toolbar ministry-repository-toolbar"><label class="search-field">${icon('search')}<input id="ministry-repository-search" type="search" aria-label="Search this sub-department by title or reference" value="${escapeHTML(state.query)}" placeholder="Search this folder by title or reference..." autocomplete="off"/></label><span class="subtle">Current sub-department only</span></div><div id="ministry-repository-results" aria-live="polite">${ministryRepositoryDocuments()}</div></section>`;
  }
  return `<div class="ministry-repository">${breadcrumbs}${heading('THE MINISTRY FILING ROOM',escapeHTML(title),description,button(`${icon('plus')} Start a process`,'go-start-process','btn btn-primary'))}<div class="ministry-repository-context">${icon('shield')}<span>${escapeHTML(currentOfficer.name)} / ${escapeHTML(currentOfficer.role)}</span><strong>${escapeHTML(departmentLabel(ownDepartment))}</strong></div>${fxNotice('Prototype access preview: PS Registry and PS can open all department folders. Departmental officers can open only their own contents; other folder names remain visible. This browser-only demonstration is not production security.')}${content}</div>`;
}

function ministryRepositoryDocuments() {
  const department = state.repositoryDepartment;
  if (!state.repositoryRootOpen || !Object.hasOwn(departmentUnits,department) || !canAccessDepartment(department) || !departmentUnits[department].includes(state.repositoryUnit)) return '';
  const query = (state.query || '').trim().toLowerCase();
  const records = visibleRecords().filter(record => canAccessRecord(record) && record.department === department && recordUnit(record) === state.repositoryUnit && (!query || [record.title,record.id,record.reference].join(' ').toLowerCase().includes(query)));
  return recordTable(records);
}

document.addEventListener('click',event => {
  const trigger = event.target.closest('[data-action]');
  if (!trigger || !['repo-open-root','repo-department','repo-unit','repo-back'].includes(trigger.dataset.action)) return;
  event.preventDefault();
  const department = trigger.dataset.department;
  const units = departmentUnits[department] || [];
  const selectedDepartment = state.repositoryDepartment ?? null;
  const selectedUnit = state.repositoryUnit ?? null;
  let allowed = state.page === 'repository' && (selectedDepartment === null || Object.hasOwn(departmentUnits,selectedDepartment) && canAccessDepartment(selectedDepartment)) && (selectedUnit === null || departmentUnits[selectedDepartment]?.includes(selectedUnit)) && (state.repositoryRootOpen || selectedDepartment === null && selectedUnit === null) && (department === undefined || Object.hasOwn(departmentUnits,department) && canAccessDepartment(department));
  let nextDepartment = null;
  let nextUnit = null;
  let rootOpen = true;
  switch (trigger.dataset.action) {
    case 'repo-department':
      allowed = allowed && state.repositoryRootOpen && Object.hasOwn(departmentUnits,department) && canAccessDepartment(department);
      nextDepartment = department;
      break;
    case 'repo-unit':
      allowed = allowed && state.repositoryRootOpen && selectedDepartment === department && trigger.dataset.department === department && units.includes(trigger.dataset.unit);
      nextDepartment = department;
      nextUnit = trigger.dataset.unit;
      break;
    case 'repo-back':
      if (trigger.dataset.level === 'repository') rootOpen = false;
      else if (trigger.dataset.level === 'root') allowed = allowed && state.repositoryRootOpen;
      else if (trigger.dataset.level === 'department') {
        allowed = allowed && state.repositoryRootOpen && selectedDepartment === department && trigger.dataset.department === department;
        nextDepartment = department;
      } else allowed = false;
      break;
  }
  state.repositoryDepartment = allowed ? nextDepartment : null;
  state.repositoryUnit = allowed ? nextUnit : null;
  state.repositoryRootOpen = allowed ? rootOpen : false;
  state.query = '';
  if (!allowed) toast('Access denied. Only PS Registry and PS can browse all departments; departmental officers can open only their own folders.',true);
  render();
  const title = $('#main h1');
  if (title) {title.setAttribute('tabindex','-1');title.focus({preventScroll:true});}
});

document.addEventListener('input',event => {
  if (event.target.id !== 'ministry-repository-search' || state.page !== 'repository') return;
  state.query = event.target.value;
  const results = $('#ministry-repository-results');
  if (results) results.innerHTML = ministryRepositoryDocuments();
});

const policyForms = {
  classify:()=>field('Sample document','record','record')+field('Classification','classification','select','Internal',['Public','Internal','Confidential','Secret'])+field('Tags','tags','text','training, civil service')+field('Reason for the classification','reason','textarea','Reviewed by the demonstration registry officer.'),
  metadata:()=>field('Field name','name','text','Programme reference')+field('Field type','type','select','Text',['Text','Date','Number','List'])+field('Applies to','scope','select','All records',['All records','Personnel records','Circulars','Procurement'])+field('Example field value','value','text','OHCSF-DEMO-2026'),
  numbering:()=>field('Reference prefix','prefix','text','OHCSF')+field('Number format','format','select','Office / year / serial',['Office / year / serial','Department / subject / volume / serial'])+field('Next serial (sample)','serial','number','149'),
  alerts:()=>field('Alert name','name','text','Personnel decisions')+field('Search phrase','query','text','training')+field('Frequency','frequency','select','Daily',['Daily','Weekly','On new matching records'])+field('Delivery preview','channel','select','In-app',['In-app','Email preview']),
  reminders:()=>field('Before deadline (days)','days','number','2')+field('Recipient desk','desk','select','Current reviewing desk',['Current reviewing desk','Registry officer','Director'])+field('Channel','channel','select','In-app',['In-app','Email','SMS']),
  escalation:()=>field('After deadline (days)','days','number','1')+field('Escalate to','desk','select','Director',['Director','Permanent Secretary','Registry supervisor'])+field('Escalation note','note','textarea','Please inspect the source record and recorded minutes before following up.'),
  delegation:()=>field('Officer away','officer','select',data.users[0].name,data.users.map(user=>user.name))+field('Delegate','delegate','select',data.users[1].name,data.users.map(user=>user.name))+field('Until','until','date','2026-11-12')+field('Scope','scope','select','New approvals only',['New approvals only','Selected document'])+field('Handover note','note','textarea','Please review incoming demonstration approvals during this absence.'),
  subscription:()=>field('Watch','scope','select','Personnel cabinet',['Personnel cabinet','Selected document','All circulars'])+field('Notify on','event','select','New minute',['New minute','New version','Decision','Dispatch']),
  notifications:()=>field('Event','event','select','Approval assigned',['Approval assigned','Comment mention','Deadline approaching','Circular issued'])+field('Channels','channel','select','In-app + email',['In-app','In-app + email','In-app + SMS'])+field('Quiet hours','quiet','text','18:00 - 08:00'),
  encryption:()=>field('At-rest policy','rest','select','AES-256 (proposed)',['AES-256 (proposed)','Government-approved standard (to validate)'])+field('Transport policy','transport','select','TLS 1.3 (proposed)',['TLS 1.3 (proposed)','TLS 1.2 minimum (proposed)'])+field('Key owner','owner','select','Government-controlled keys',['Government-controlled keys','Approved key-management service']),
  reportSchedule:()=>field('Report name','name','text','Weekly OHCSF registry brief')+field('Frequency','frequency','select','Weekly',['Daily','Weekly','Monthly'])+field('Recipient group','recipient','select','Leadership',['Leadership','Registry supervisors','Department directors'])+field('Format','format','select','PDF preview',['PDF preview','CSV']),
  organisation:()=>field('Unit name','name','text','Service Policies and Strategies Office')+field('Parent office','parent','text',ORGANISATION)+field('Registry code','code','text','SPSO')+field('Supervisor (fictional)','supervisor','text','Demo director'),
  identityConnector:()=>field('Directory type','type','select','Active Directory / LDAP',['Active Directory / LDAP','OpenID Connect','SAML'])+field('Illustrative endpoint','endpoint','url','https://directory.example.invalid')+field('Attribute mapping','mapping','text','displayName -> officer; department -> cabinet'),
  hrConnector:()=>field('Source system','type','select','IPPIS (proposed)',['IPPIS (proposed)','HRMIS (proposed)'])+field('Data mapping','mapping','text','Fictional staff ID, department, designation')+field('Mode','mode','select','Read-only preview',['Read-only preview','Approval status exchange preview']),
  emailConnector:()=>field('Mailbox (fictional)','mailbox','email','registry@example.invalid')+field('Provider','type','select','IMAP / SMTP',['IMAP / SMTP','Microsoft Graph (proposed)'])+field('Attachment handling','handling','select','Officer reviews before capture',['Officer reviews before capture','Queue for classification review']),
  scannerConnector:()=>field('Scanner profile','name','text','Demonstration network scanner')+field('Colour mode','mode','select','Greyscale',['Greyscale','Colour','Black and white'])+field('Resolution','resolution','select','300 DPI',['200 DPI','300 DPI','600 DPI']),
  officeConnector:()=>field('Application','type','select','Microsoft Office (proposed)',['Microsoft Office (proposed)','LibreOffice (proposed)'])+field('Editing mode','mode','select','Check-out then return a version',['Check-out then return a version','Read-only preview']),
  language:()=>field('Interface language preview','language','select','English',['English','Hausa','Yoruba','Igbo'])+field('Date display','dateFormat','select','Day / month / year',['Day / month / year','ISO year-month-day'])+field('Translation policy','policy','select','Human review required',['Human review required','Official translation service required']),
  standards:()=>field('Records policy reference','policy','text','Draft OHCSF records schedule - for validation')+field('Reference framework','standard','select','ISO 15489 reference',['ISO 15489 reference','National Archives requirements - validate'])+field('Approval state','state','select','Draft / not approved',['Draft / not approved','Reviewed in prototype only'])+field('Compliance note','note','textarea','These are proposed records-management design controls, not a compliance certification.'),
  retention:()=>field('Record category','category','text','Committee working papers')+field('Illustrative retention years (0 = permanent)','years','number','5')+field('On expiry','action','select','Appraise',['Appraise','Review for disposal','Permanent archive']),
  sharing:()=>field('Sample document','record','record')+field('Recipient (fictional)','recipient','email','reviewer@example.invalid')+field('Expires','expiry','date','2026-11-12')+field('Allow','permission','select','View only',['View only','View and comment'])+field('Access-code policy','code','select','Demo code required',['Demo code required','Signed-in recipient only (preview)'])
};

function openFeature(feature) {
  activeFeature = feature;
  const record = getRecord(state.docID) || getRecord(state.journeyID) || visibleRecords()[0];
  const navigation = {smart:'intake',browse:'repository',search:'repository',archiveAsk:'archive',approval:'approvals',command:'leadership',tracking:'journeys',users:'admin',publicPortal:'public',verification:'verify',semantic:'archive',mobile:'approvals'};
  if (navigation[feature]) {closeModal(false); navigate(navigation[feature]); if (feature === 'mobile') toast('Resize to a phone width to preview the same approval journey.'); return;}
  if (['summary','routing'].includes(feature)) {openDocument(record.id); return;}
  if (feature === 'minute') {state.docID = record.id; minuteDraftDialog(); return;}
  if (feature === 'weeklyBrief') {officeBriefModal(); return;}
  if (feature === 'versions') {openDocument(record.id,'versions'); return;}
  if (feature === 'duplicate') {startCapture(null,'procurement'); return;}
  if (feature === 'watermark') {featureForm(feature,field('Watermark on preview','enabled','select',data.settings.watermark ? 'Enabled' : 'Disabled',['Enabled','Disabled']),'Apply preview preference');return;}
  if (policyForms[feature]) {featureForm(feature,policyForms[feature](),feature.endsWith('Connector') ? 'Run simulated connection check' : 'Save demo configuration');return;}
  if (feature === 'scan') {scanModal();return;}
  if (feature === 'email') {emailModal();return;}
  if (feature === 'bulk') {bulkModal();return;}
  if (feature === 'folders') {featureForm(feature,`<div class="fx-folder-tree"><strong>OHCSF</strong>${departments.map(department=>`<p>${icon('folder')} ${escapeHTML(departmentLabel(department))}</p>`).join('')}${fx.folders.map(folder=>`<p class="fx-folder-child">${icon('folder')} ${escapeHTML(folder)}</p>`).join('')}</div>`+field('Parent cabinet','parent','select',isCentralOfficer() ? departments[0] : currentOfficer.department,departments.filter(canAccessDepartment))+field('New folder path','path','text','2026 / Reviewed circulars'),'Create demo folder');return;}
  if (feature === 'checkout') {featureForm(feature,field('Document','record','record')+field('Operation','operation','select','Check out',['Check out','Check in'])+field('Working-copy note','note','textarea','Metadata working copy reviewed by the demo officer.'),'Update working-copy state');return;}
  if (feature === 'compare') {showModal(featureLabels[feature],'Illustrative text comparison; not binary document comparison.',`<div class="fx-two-column"><div class="source-paper"><p class="eyebrow">ORIGINAL SAMPLE</p><h3>${escapeHTML(record.title)}</h3><p>${escapeHTML(record.summary)}</p></div><div class="source-paper"><p class="eyebrow">PROPOSED REVISION</p><h3>${escapeHTML(record.title)}</h3><p>${escapeHTML(record.summary)}</p><p><mark>Proposed addition: supporting schedule reviewed and attached.</mark></p></div></div>${fxNotice('This comparison shows a prepared text revision. It does not inspect or compare real files.')}`,button('Close comparison','close-modal','btn'),true);return;}
  if (feature === 'rollback') {featureForm(feature,field('Document','record','record')+field('Reason for restoring an earlier metadata version','reason','textarea','Restore the originally registered summary for this fictional record.'),'Restore original metadata');return;}
  if (feature === 'preview') {previewModal(record);return;}
  if (feature === 'bookmark') {featureForm(feature,field('Document','record','record')+field('Bookmark label','label','text','For management review'),'Save bookmark');return;}
  if (['advanced','savedSearch'].includes(feature)) {searchModal(feature);return;}
  if (feature === 'designer') {designerModal();return;}
  if (feature === 'parallel') {parallelModal();return;}
  if (feature === 'conditional') {conditionalModal();return;}
  if (feature === 'templates') {templateModal();return;}
  if (feature === 'signature') {signatureModal(state.docID ? getRecord(state.docID) : visibleRecords().find(canActOnRecord));return;}
  if (feature === 'seal') {featureForm(feature,field('Document','record','record')+field('Fictional signatory','signer','text','Demo approving officer')+field('Designation','designation','text','Demonstration director')+field('Endorsement text','text','textarea','Reviewed in the design prototype. Not a legally binding endorsement.'),'Apply DEMO seal');return;}
  if (feature === 'workspace') {workspaceModal();return;}
  if (['annotation','mentions'].includes(feature)) {featureForm(feature,field('Document','record','record')+field('Mention officer','officer','select',data.users[0].name,data.users.map(user=>user.name))+field('Page / location','location','text','Page 1 / opening paragraph')+field('Comment or annotation','note','textarea','Please verify the supporting schedule before forwarding.'),'Add sample annotation');return;}
  if (feature === 'receipts') {receiptsModal();return;}
  if (feature === 'incoming') {startCapture();return;}
  if (feature === 'outgoing') {featureForm(feature,field('Subject','subject','text','Acknowledgement of departmental submission')+field('Originator / recipient (fictional)','sender','text','Sample MDA registry')+field('Department','department','select',isCentralOfficer() ? departments[2] : currentOfficer.department,departments.filter(canAccessDepartment)),'Prepare outgoing illustration');return;}
  if (feature === 'custody') {featureForm(feature,field('Document reference','record','record')+field('Receiving officer (fictional)','officer','text','Demo registry custodian')+field('Physical location','location','text','Block A / Registry room / Cabinet 2 / Shelf B')+field('Movement','movement','select','Issue file',['Issue file','Return file','Transfer custody'])+field('Handover note','note','textarea','Physical-file movement illustrated only; no real file has moved.'),'Record sample handover');return;}
  if (feature === 'dispatch') {featureForm(feature,field('Outgoing reference','reference','text',fx.correspondence.find(item=>item.direction==='Outgoing')?.id || 'OUT/2026/001')+field('Recipient (fictional)','recipient','text','Sample MDA registry')+field('Channel','channel','select','Official email preview',['Official email preview','Courier preview','Hand delivery preview'])+field('State','status','select','Prepared',['Prepared','Dispatched (demo)','Acknowledged (demo)']),'Update dispatch preview');return;}
  if (['signin','mfa'].includes(feature)) {authStep = feature === 'mfa' ? 1 : 0; authModal();return;}
  if (feature === 'permissions') {permissionModal();return;}
  if (feature === 'clearance') {featureForm(feature,field('Document','record','record')+field('Officer clearance','clearance','select','Internal',['Public','Internal','Confidential','Secret']),'Preview access decision');return;}
  if (['audit','siem'].includes(feature)) {auditModal(feature);return;}
  if (feature === 'hold') {featureForm(feature,field('Record','record','record')+field('Operation','operation','select','Apply legal hold',['Apply legal hold','Release legal hold'])+field('Case reference (fictional)','case','text','DEMO-CASE-001')+field('Reason','reason','textarea','Preserve this demonstration record pending review.'),'Record hold decision');return;}
  if (feature === 'appraisal') {featureForm(feature,field('Record','record','record')+field('Appraisal recommendation','recommendation','select','Retain',['Retain','Permanent archive','Review for disposal'])+field('Appraisal reason','reason','textarea','Review administrative, evidential and historical value.'),'Save appraisal');return;}
  if (feature === 'disposal') {disposalModal();return;}
  if (feature === 'restore') {featureForm(feature,field('Record','record','record')+field('Reason','reason','textarea','Restore the archived metadata to the approved records workspace.'),'Restore archived sample');return;}
  if (['sla','adoption'].includes(feature)) {reportView(feature);return;}
  if (feature === 'reports') {featureForm(feature,field('Report scope','scope','select','All departments',['All departments',...departments])+field('Metric','metric','select','Approval status',['Approval status','Overdue records','Record types','Demo activity']),'Generate report preview');return;}
  if (feature === 'export') {exportModal();return;}
  if (['translation','sensitive','anonymise','rescue'].includes(feature)) {intelligenceModal(feature);return;}
  if (feature === 'api') {apiModal();return;}
  if (feature === 'offline') {offlineModal();return;}
  if (feature === 'accessibility') {featureForm(feature,field('Contrast preference','contrast','select','Standard',['Standard','High contrast'])+field('Text size','text','select','Standard',['Standard','Larger'])+field('Motion','motion','select','Follow device preference',['Follow device preference','Reduced motion']),'Apply demonstration preferences');return;}
  if (feature === 'backup') {backupModal();return;}
  if (feature === 'recovery') {featureForm(feature,`<p class="subtle">Restore only the saved fictional metadata snapshot. The preview compares record counts before confirmation; no real files or infrastructure are touched.</p><div class="review-summary"><p>Current demo records: ${data.records.length}</p><p>Saved snapshot: ${fx.snapshot ? fx.snapshot.records.length+' records' : 'No snapshot yet; create one under Backup snapshot'}</p></div>`+field('Recovery note','note','textarea','Rehearse restoration of fictional browser metadata.'),'Restore demo snapshot');return;}
  if (feature === 'architecture') {architectureModal();return;}
  toast('This capability is represented in its module workspace.',true);
}

function scanModal() {
  showModal(featureLabels.scan,'Prepared paper illustration / no scanner or OCR engine connected.',`<div class="fx-two-column"><div class="fx-scan-stage"><article id="fx-scan-paper" class="source-paper"><p class="eyebrow">SIMULATED SCANNED PAGE</p><h3>Records liaison nomination</h3><p>Kindly nominate an officer for the digital registry pilot by 12 November 2026.</p><p class="signature">Demo submitting officer</p></article></div><div><p class="eyebrow">SCAN PREPARATION</p><p>Demonstrate rotation, image cleanup and text review before registering a record.</p><div class="fx-action-row">${button('Rotate page','fx-rotate','btn btn-sm')}${button('Toggle cleanup','fx-cleanup','btn btn-sm')}</div><div class="notice">${icon('spark')}<span>OCR preview: the prepared paragraph above becomes editable metadata. This is not extraction from a real scan.</span></div>${button('Review sample OCR result','fx-scan-review','btn btn-primary')}</div></div>`,button('Close scanner preview','close-modal','btn'),true);
}
function emailModal() {
  signatureDrawing=false;
  showModal(featureLabels.email,'Fictional mailbox / no external messages are read.',fxTable(['From','Subject','Attachment','Action'],[['sample.registry@example.invalid','Records liaison nomination','Sample PDF',button('Review for capture','fx-email-capture','btn btn-sm')],['sample.finance@example.invalid','Equipment procurement','Sample PDF',button('Review for capture','fx-email-procurement','btn btn-sm')]])+fxNotice('Import previews preserve a fictional origin and attachment name. No mailbox is connected.'),button('Close mailbox preview','close-modal','btn'),true);
}
let signatureMode='typed';
let signatureHasInk=false;
let signatureDrawing=false;
function signatureModal(record) {
  if (!record || !canActOnRecord(record) || record.status === 'Archived') return toast('Only the currently assigned officer can sign this document.',true);
  signatureMode='typed';signatureHasInk=false;
  const designation = `${currentOfficer.rank || currentOfficer.role}${currentOfficer.grade ? ` / GL${String(currentOfficer.grade).padStart(2,'0')}` : ''}`;
  showModal('E-sign this document.','Electronic signature design / assigned fictional officer only.',`<div class="fx-signature-layout"><div><p class="eyebrow">THE DOCUMENT YOU ARE ENDORSING</p><div class="draft-source"><strong>${escapeHTML(record.title)}</strong><p>${escapeHTML(record.id)} / ${escapeHTML(departmentLabel(record.department))}</p><span class="badge draft">Prototype signature / not legally binding</span></div>
    <form id="fx-signature-form" data-record="${escapeHTML(record.id)}"><div class="field"><label for="fx-signer">Assigned fictional officer</label><input id="fx-signer" name="signer" value="${escapeHTML(currentOfficer.name)}" readonly/></div><div class="field"><label for="fx-designation">Designation</label><input id="fx-designation" name="designation" value="${escapeHTML(designation)}" readonly/></div><div class="tabs"><button type="button" class="tab active" data-action="fx-signature-mode" data-mode="typed">Type signature</button><button type="button" class="tab" data-action="fx-signature-mode" data-mode="drawn">Draw a sample mark</button></div><div id="fx-typed-panel" class="fx-signature-preview"><strong id="fx-typed-signature" class="fx-written-signature">${escapeHTML(currentOfficer.name)}</strong><small>Typed signature preview</small></div><div id="fx-drawn-panel" hidden><canvas id="fx-signature-canvas" width="640" height="180" aria-label="Draw a fictional sample mark; typed signature is available as an accessible alternative"></canvas>${button('Clear drawing','fx-clear-signature','btn btn-sm')}<p class="subtle">Use a fictional mark, not your real signature.</p></div>${consent('I reviewed this fictional endorsement. Applying it adds a sample signature and trail entry, without a real certificate or identity check.')}</form></div>
    <aside class="fx-signature-explanation"><p class="eyebrow">SIGNATURE JOURNEY</p><h3>Review. Endorse.<br>Keep the evidence.</h3><ol><li>Inspect the document and its version.</li><li>Select a typed or drawn sample signature.</li><li>Confirm your intention to endorse the demo.</li><li>See the signature on the document and in its history.</li></ol><div class="notice">${icon('shield')}<span>Only the assigned desk can endorse this file. Signing does not approve or change its assignment. This is not PKI, cryptographic signing, biometric verification or an official government signature.</span></div></aside></div>`,`${button('Cancel','close-modal','btn')}${button(`${icon('shield')} Apply sample e-signature`,'fx-signature-submit','btn btn-primary','type="submit" form="fx-signature-form"')}`,true);
  const context=$('#fx-signature-canvas').getContext('2d');context.lineWidth=3;context.lineCap='round';context.strokeStyle='#153e35';
}
function signaturePoint(event,canvas) {const rect=canvas.getBoundingClientRect();return {x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};}
document.addEventListener('pointerdown',event=>{if(event.target.id!=='fx-signature-canvas')return;event.preventDefault();const canvas=event.target;canvas.setPointerCapture(event.pointerId);const point=signaturePoint(event,canvas);const context=canvas.getContext('2d');context.beginPath();context.moveTo(point.x,point.y);context.lineTo(point.x+.1,point.y+.1);context.stroke();signatureDrawing=true;signatureHasInk=true;});
document.addEventListener('pointermove',event=>{if(!signatureDrawing||event.target.id!=='fx-signature-canvas')return;const point=signaturePoint(event,event.target);const context=event.target.getContext('2d');context.lineTo(point.x,point.y);context.stroke();});
document.addEventListener('pointerup',()=>{signatureDrawing=false;});
document.addEventListener('pointercancel',()=>{signatureDrawing=false;});
document.addEventListener('input',event=>{if(event.target.id==='fx-signer'&&$('#fx-typed-signature'))$('#fx-typed-signature').textContent=event.target.value;});
document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-action]');if(!trigger)return;
  if(trigger.dataset.action==='fx-signature-mode'){signatureMode=trigger.dataset.mode;$('#fx-typed-panel').hidden=signatureMode!=='typed';$('#fx-drawn-panel').hidden=signatureMode!=='drawn';document.querySelectorAll('[data-action="fx-signature-mode"]').forEach(button=>button.classList.toggle('active',button.dataset.mode===signatureMode));}
  if(trigger.dataset.action==='fx-clear-signature'){const canvas=$('#fx-signature-canvas');canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);signatureHasInk=false;}
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='fx-signature-form')return;event.preventDefault();if(!event.target.reportValidity())return;if(signatureMode==='drawn'&&!signatureHasInk)return toast('Draw a fictional sample mark, or choose a typed signature.',true);
  const record=getRecord(event.target.dataset.record);if(!record || !canActOnRecord(record) || record.status === 'Archived')return toast('Only the currently assigned officer can sign this document.',true);
  const key = `signature-${record.id}`;
  const historyKey = `signatures-${record.id}`;
  if (!Array.isArray(fx.config[historyKey])) fx.config[historyKey] = fx.config[key] ? [{...fx.config[key],version:fx.config[key].version || 1}] : [];
  fx.config[key]={signer:currentOfficer.name,designation:`${currentOfficer.rank || currentOfficer.role}${currentOfficer.grade ? ` / GL${String(currentOfficer.grade).padStart(2,'0')}` : ''}`,date:TODAY,version:record.version,mode:signatureMode,image:signatureMode==='drawn'?$('#fx-signature-canvas').toDataURL('image/png'):null};
  fx.config[historyKey].push({...fx.config[key]});
  addHistory(record,'Sample electronic signature applied',`${fx.config[key].signer}, ${fx.config[key].designation} / version ${record.version}.0 / ${signatureMode} preview / no cryptographic certificate.`,currentOfficer.name);save();fxSave('Electronic signature preview applied',record.id);render();openDocument(record.id,'preview');toast('Sample e-signature appears on the document. Approval status is unchanged.');
});
function bulkModal() {
  featureForm('bulk',`<p class="subtle">Prepared import configuration only. Saving this selection does not register mail, create documents or start routing. Register each incoming item through PS Registry capture. Local files are not read.</p>${fxTable(['Include','Sample title','Review state'],['Liaison nomination - batch','Staff induction - batch','Quarterly records return - batch'].map((title,index)=>[`<input type="checkbox" name="batch" value="${index}" checked aria-label="Include ${title}"/>`,title,'Prepared metadata / not registered']))}${field('Proposed cabinet','department','select',isCentralOfficer() ? departments[2] : currentOfficer.department,departments.filter(canAccessDepartment))}`,'Save prepared import selection',true);
}
function previewModal(record) {
  showModal(featureLabels.preview,'Select an illustrative format; no actual file contents are loaded.',`<div class="fx-action-row">${['PDF','Word','Spreadsheet','Image'].map(type=>button(type,'fx-preview-format','btn btn-sm',`data-format="${type}"`)).join('')}</div><div id="fx-format-preview" class="source-paper"><h3>PDF / sample letter</h3><p>${escapeHTML(record.summary)}</p></div>${fxNotice()}`,button('Close preview','close-modal','btn'),true);
}
function searchModal(feature) {
  featureForm(feature,field('Search phrase','query','text',state.query || 'training')+field('Department','department','select','All departments',['All departments',...departments])+field('Document type','type','select','All types',['All types','Letter','Memo','Circular','Request','Report','Minutes'])+field('Registered on or after','from','date','2026-10-01')+field('Registered on or before','to','date','2026-11-30')+(feature === 'savedSearch' ? field('Saved-search name','name','text','My personnel search') : ''),feature === 'savedSearch' ? 'Save and run search' : 'Run sample search');
}
function designerModal() {
  showModal(featureLabels.designer,'Visual process editor / changes apply to this demonstration canvas only.',`${workflowPreview()}<h3>Editable example path / not compulsory / saved edits retained</h3><div class="fx-designer-list">${fx.workflow.map((step,index)=>`<div><span>${index+1}</span><strong>${escapeHTML(step)}</strong>${button(icon('return'),'fx-move-step','icon-button',`data-index="${index}" aria-label="Move ${escapeHTML(step)} earlier" ${index===0?'disabled':''}`)}</div>`).join('')}</div><form id="fx-designer-form">${field('New step name','step','text','Departmental verification')}${button('Add step to canvas','fx-submit-designer','btn','type="submit"')}</form>${fxNotice('Editing this illustration does not change mandatory intake or authority-based routing rules, or configure final approval authority. Saved canvas edits, including earlier examples, remain illustrations and are preserved until you explicitly reset them.')}`,`${button('Reset illustration to authority reference','fx-reset-workflow','btn')}${button('Save canvas preview','fx-save-workflow','btn btn-primary')}`,true);
}
function parallelModal() {
  showModal(featureLabels.parallel,'Prepared consultation illustration / not an operational assignment.',`<div class="fx-branch"><div class="fx-branch-origin">Prepared request</div><div class="fx-two-column">${['Finance consultation','Administrative consultation'].map((desk,index)=>`<div class="panel panel-padding"><h3>${desk}</h3><span class="badge ${fx.parallel[index]?'draft':'pending'}">${fx.parallel[index]?'Reviewed':'Awaiting review'}</span><p>Configuration-only example, not a departmental assignment or approval.</p>${button(fx.parallel[index]?'Undo sample review':'Mark reviewed','fx-parallel-review','btn btn-sm',`data-index="${index}"`)}</div>`).join('')}</div><div class="fx-branch-origin">Combine prepared consultation notes / no final decision</div></div>${fxNotice('Mandatory intake and selective authority-based routing remain unchanged. This illustration does not authorize cross-department tasks or configure final approval authority.')}`,`${button('Close','close-modal','btn')}${button('Merge reviewed branches','fx-parallel-merge','btn btn-primary',fx.parallel.every(Boolean)?'':'disabled')}`,true);
}
function conditionalModal() {
  showModal(featureLabels.conditional,'Change the classification to inspect a prepared handling illustration.',`${workflowPreview()}${field('Handling classification','branch','select','Internal',['Internal','Confidential','Secret'])}<div id="fx-conditional-result" class="review-summary"><h3>Internal correspondence</h3><p>Ordinary handling illustration. Mandatory intake and selective authority-based routing are unchanged.</p></div>${fxNotice('Classification examples are configuration-only. They do not change permissible recipients, bypass mandatory intake or establish final approval authority.')}`,button('Close route preview','close-modal','btn'),true);
}
function templateModal() {
  featureForm('templates',workflowPreview()+fxNotice('Prepared template configuration only: no mail is registered and no process is started. Register through PS Registry capture. The authority ladder is a reference, not a compulsory path; editing this example does not alter operational rules.')+field('Civil-service process','process','select','Leave request',['Leave request','Promotion review','Retirement processing','Training nomination','Procurement review'])+field('Fictional applicant / reference','applicant','text','Demo officer / DEMO-STAFF-001')+field('Department','department','select',isCentralOfficer() ? departments[0] : currentOfficer.department,departments.filter(canAccessDepartment))+field('Request summary','summary','textarea','Prepared submission through PS Registry, PS and the responsible departmental Director, then selected lower-rank treatment and senior-rank review within the department. Intermediate ranks need not receive the file. Review requests are not approval; final authority is not configured.'),'Save template illustration',true);
}
function workspaceModal() {
  showModal(featureLabels.workspace,'OHCSF records transition / fictional team workspace.',`<div class="fx-workspace-banner"><span class="eyebrow">PROJECT WORKSPACE</span><h3>Digital records transition</h3><p>${data.users.length} fictional participants / shared documents / minutes and comments</p></div>${recordTable(data.records.filter(record=>record.level==='Internal').slice(0,3))}<div class="fx-action-row">${fxButton('Annotate a document','annotation')}${fxButton('Mention an officer','mentions')}${fxButton('Subscribe to updates','subscription')}${fxButton('Create a sharing preview','sharing')}</div>`,button('Close workspace','close-modal','btn'),true);
}
function receiptsModal() {
  showModal(featureLabels.receipts,'Circular distribution receipt preview / no notification is transmitted.',`<div class="review-summary"><h3>Digital records transition guidelines</h3><p>Track acknowledgements separately from a document's approval status.</p></div>${fxTable(['Department','Receipt','Action'],departments.map((department,index)=>[escapeHTML(departmentLabel(department)),fx.receipts.includes(department)?'Acknowledged in demo':'Awaiting acknowledgement',button('Acknowledge sample receipt','fx-receipt','btn btn-sm',`data-index="${index}" ${canAccessDepartment(department) ? '' : 'disabled'}`)]))}`,button('Close receipt tracker','close-modal','btn'),true);
}
function authModal() {
  const body = authStep === 0 ? `<div class="fx-auth-brand"><img src="nigeria-coat-of-arms.svg" alt="Nigeria coat of arms"/><h3>OHCSF officer access</h3><p>Design preview. Do not enter a real government password.</p></div><form id="fx-auth-form">${field('Fictional sample account','account','email','amina@example.invalid')}<div class="field"><label>Sample password</label><input value="DEMO-ONLY-NOT-A-PASSWORD" readonly aria-label="Prepared demonstration password"/></div>${consent('Use this fictional account to preview sign-in, not authenticate a real officer.')}</form>` : `<div class="review-summary"><h3>Verify your demonstration session</h3><p>For this prototype, enter the fixed sample code <strong>123456</strong>. No SMS or authenticator is connected.</p></div><form id="fx-auth-form">${field('Six-digit demo code','code','text','')}${consent('This code is a UI demonstration only, not a security credential.')}</form>`;
  showModal(authStep === 0 ? featureLabels.signin : featureLabels.mfa,'Authentication design / no real account authentication.',body,`${button('Cancel','close-modal','btn')}${button(authStep===0?'Continue to verification':'Verify sample code','fx-auth-submit','btn btn-primary','type="submit" form="fx-auth-form"')}`);
}
function permissionModal() {
  const roles = ['PS Registry','Permanent Secretary',...staffRanks.map(rank => rank.title)];
  const permissions = ['Capture','Browse all departments','Minute assigned file','Route authorized task','Record treatment'];
  showModal(featureLabels.permissions,'Illustrative authority matrix / no final authority configured.',fxTable(['Role',...permissions],roles.map((role,r)=>[role,...permissions.map((permission,p)=>`<input type="checkbox" data-role="${r}" data-permission="${p}" class="fx-permission" aria-label="${role}: ${permission}" ${fx.config.authorityPermissions?.[`${r}-${p}`] ?? (p===0&&r===0 || p===1&&r<2 || p===2 || p===3 || p===4&&r>=2) ? 'checked':''}/>`)]))+fxNotice('PS Registry routes incoming mail to PS, then PS assigns the responsible departmental Director. Departmental officers act only on assigned files: treatment may go to any lower rank in the same department, review to any senior rank, and the Director may escalate to PS. Every departmental rank may Record Treatment and route its report upward for review; treatment retains assignment and awaits review, not final approval. Corrections follow the actual sender and exact requester. Editing this illustration does not change access or authority-based routing rules.'),button('Save matrix preview','fx-save-permissions','btn btn-primary'),true);
}
function auditModal(feature) {
  const events = visibleRecords().flatMap(record=>record.history.map(event=>({...event,reference:record.id}))).slice(-12);
  showModal(featureLabels[feature],'Fictional audit evidence / no SIEM destination is contacted.',feature === 'audit' ? fxTable(['Reference','Action','Officer','Time'],events.map(event=>[escapeHTML(event.reference),escapeHTML(event.action),escapeHTML(event.by),escapeHTML(event.time)])) : `<pre class="fx-code">${escapeHTML(JSON.stringify({event_type:'document.review.demo',reference:visibleRecords()[0]?.id,actor:'DEMO_OFFICER',classification:'Internal',timestamp:new Date().toISOString(),delivery:'Not sent - prototype payload'},null,2))}</pre>`,button('Close evidence preview','close-modal','btn'),true);
}
function disposalModal() {
  featureForm('disposal',`<div class="notice">${icon('clock')}<span>Appraisal clock: 2035, a hypothetical future review. Original sample dates are not changed. A legal hold or non-archived state blocks disposal.</span></div>`+field('Record for appraisal','record','record')+field('Appraisal recommendation','recommendation','select','Dispose after approval',['Dispose after approval','Retain'])+field('Authorising reference (fictional)','authority','text','DEMO-DISPOSITION-001')+field('Reason','reason','textarea','Retention and evidential value assessed in this hypothetical demonstration.'),'Preview controlled disposition');
}
function reportView(feature) {
  const rows = feature === 'sla' ? departments.filter(canAccessDepartment).map(department=>[escapeHTML(departmentLabel(department)),pending().filter(record=>record.department===department).length,overdue().filter(record=>record.department===department).length,closed().filter(record=>record.department===department).length]) : data.users.filter(user=>canAccessDepartment(user.department)).map(user=>[escapeHTML(user.name),escapeHTML(user.role),visibleRecords().filter(record=>record.owner===user.name).length,visibleRecords().reduce((count,record)=>count+record.history.filter(event=>event.by===user.name).length,0)]);
  showModal(featureLabels[feature],'Counts from fictional records / not a real staff-performance assessment.',fxTable(feature === 'sla' ? ['Department','Pending','Overdue','Completed'] : ['Officer','Role','Owned records','Recorded actions'],rows)+fxNotice('Historical turnaround and adoption trends require production telemetry. This preview displays only the available demonstration counts.'),button('Close report','close-modal','btn'),true);
}
function exportModal() {
  showModal(featureLabels.export,'Export fictional registry metadata, or open a print-ready sample report.',`<div class="fx-two-column"><div class="panel panel-padding"><h3>CSV snapshot</h3><p>Download the current sample document list.</p>${button('Download sample CSV','export','btn btn-primary')}</div><div class="panel panel-padding"><h3>PDF / print layout</h3><p>Use the browser's print preview for a report marked as demonstration data.</p>${button('Open print preview','fx-print','btn')}</div></div>${fxNotice()}`,button('Close exports','close-modal','btn'));
}
function intelligenceModal(feature) {
  if (feature === 'translation') {
    showModal(featureLabels.translation,'Prepared translation examples / not certified translations.',`${field('Language','translation','select','Hausa',['Hausa','Yoruba','Igbo'])}<div class="fx-two-column"><div class="source-paper"><p class="eyebrow">ENGLISH SOURCE</p><p>Please submit your departmental records return.</p></div><div class="source-paper"><p class="eyebrow">ILLUSTRATIVE TRANSLATION</p><p id="fx-translation-output">Da fatan za a gabatar da rahoton bayanan sashinku.</p></div></div>${fxNotice('These prepared phrases illustrate a translation review screen. An authorised translator must verify any official translation.')}`,button('Close translation preview','close-modal','btn'));return;
  }
  if (['sensitive','anonymise'].includes(feature)) {
    featureForm(feature,`<div class="fx-two-column"><div class="source-paper"><p class="eyebrow">FICTIONAL SOURCE</p><p>Demo Officer A requests reimbursement. Sample account: <mark>0000000000</mark>. Sample personnel reference: <mark>DEMO-STAFF-001</mark>.</p></div><div class="source-paper"><p class="eyebrow">REVIEWED REDACTION PREVIEW</p><p>[Officer] requests reimbursement. Account: [REDACTED]. Personnel reference: [REDACTED].</p></div></div>`+field('Record receiving the sample review note','record','record')+field('Handling recommendation','level','select','Confidential',['Internal','Confidential']),'Confirm sample content review',true);return;
  }
  featureForm('rescue',`<div class="fx-two-column"><div class="source-paper fx-aged-paper"><p class="eyebrow">FICTIONAL LEGACY LEDGER</p><h3>Registry return / 1998</h3><p>File ref: LEGACY-DEMO-001</p><p>Subject: Departmental staff return</p><p>Origin: unclear handwritten entry</p></div><div><div class="notice">${icon('help')}<span>Prepared rescue configuration only. No record is created or registered. Human review is required; the prototype does not invent the unclear origin.</span></div>${field('Confirmed legacy reference','reference','text','LEGACY-DEMO-001')}${field('Officer-confirmed origin','origin','text','')}${field('Readable title','title','text','Legacy departmental staff return')}</div></div>`,'Save prepared rescue metadata',true);
}
function apiModal() {
  showModal(featureLabels.api,'Local dry-run response / no HTTP request or integration authentication occurs.',`<p class="eyebrow">POST / PROPOSED DOCUMENTS API</p><pre class="fx-code">${escapeHTML(JSON.stringify({title:'Fictional API submission',department:departments[2],classification:'Internal',source:'demo-sandbox'},null,2))}</pre>${button('Run local dry-run','fx-api-run','btn btn-primary')}<pre id="fx-api-response" class="fx-code">Response preview will appear here.</pre>${fxNotice('Endpoints and fields are illustrative, not an implemented API contract. No API key or real credentials are needed.')}`,button('Close API sandbox','close-modal','btn'));
}
function offlineModal() {
  showModal(featureLabels.offline,'Prepared queue configuration / no service worker or remote synchronisation.',`${fxTable(['Sample title','State'],fx.offline.map(item=>[escapeHTML(item.title),escapeHTML(item.status)]))}<form id="fx-offline-form">${field('Fictional queued document title','title','text','Offline registry capture example')}${button('Queue prepared metadata','fx-submit-offline','btn','type="submit"')}</form>${fxNotice('Queue and sync controls are configuration-only simulations. They do not create operational documents or register mail. Use PS Registry capture to register each item; no real offline sync runs.')}`,`${button('Close queue','close-modal','btn')}${button('Simulate queue review (not registration)','fx-sync','btn btn-primary',fx.offline.some(item=>item.status==='Queued')?'':'disabled')}`);
}
function backupModal() {
  showModal(featureLabels.backup,'Browser-only snapshot / not an infrastructure or primary-document backup.',`<div class="review-summary"><h3>${data.records.length} records / ${data.users.length} fictional users</h3><p>${fx.snapshot ? 'A snapshot is available for the recovery rehearsal.' : 'Create a snapshot before rehearsing recovery.'}</p></div><div class="fx-action-row">${button('Create browser-data snapshot','fx-backup','btn btn-primary')}${button('Download fictional JSON','fx-download-backup','btn')}</div>${fxNotice('The snapshot and JSON export include browser records, settings and locally stored supporting files attached to minutes. Primary document binaries and real accounts are not captured. This is not encrypted storage, an infrastructure backup or production document security. Use fictional files only.')}`,button('Close backup preview','close-modal','btn'));
}
function architectureModal() {
  const layers = [['Accessible web & mobile views','Responsive interface, keyboard support, language and offline designs'],['Application / proposed API layer','Capture, registry, workflow, records and reporting services'],['Identity & audit boundary','SSO, RBAC, MFA, handling classification and auditable operations'],['Data / object storage','Proposed relational metadata and document object repository'],['Locally hosted intelligence','OCR, classification, retrieval and drafting with human review'],['Government-controlled hosting','Backup, recovery, observability and integration policies']];
  showModal(featureLabels.architecture,'Explanatory design architecture, not deployed infrastructure.',`<div class="fx-architecture">${layers.map(([title,description],index)=>`<div><span>${index+1}</span><strong>${title}</strong><p>${description}</p></div>`).join('')}</div>${fxNotice('Technology choices, capacity, sovereignty controls and compliance obligations require technical validation before implementation.')}`,button('Close architecture','close-modal','btn'),true);
}
function publicPage() {
  return `${heading('PUBLIC-FACING DESIGN PREVIEW','Submit correspondence. Track its receipt.','A fictional public submission journey, separate from officer approvals.',button('Return to module map','go-modules','btn'))}${fxNotice('Not an official public submission service. Use fictional details only. No email, attachment or personal data is transmitted.')}<div class="fx-two-column"><section class="panel panel-padding"><h2 class="fx-serif">A clear starting point.</h2><form id="fx-public-form">${field('Fictional sender','sender','text','Demo submitting organisation')}${field('Subject','subject','text','Request for a civil-service information circular')}${field('Fictional contact','contact','email','sender@example.invalid')}${field('Correspondence summary','summary','textarea','A fictional submission to illustrate public intake and receipt tracking.')}${consent('I am submitting fictional details to the prototype, not contacting OHCSF.')}${button('Create sample receipt','fx-submit-public','btn btn-primary','type="submit"')}</form></section><section class="panel panel-padding"><h2 class="fx-serif">Your sample receipt.</h2><div id="fx-public-receipt">${fx.tickets.length ? `<p>Latest demonstration ticket: <strong>${escapeHTML(fx.tickets.at(-1).id)}</strong></p><p>Status: received in the prototype.</p>` : '<p>A fictional receipt reference will appear after submission.</p>'}</div>${fxButton('Open letter verification','verification','btn')}</section></div>`;
}
function verificationPage() {
  const verified = fx.config.verification;
  return `${heading('LETTER VERIFICATION DESIGN','A reference. A visible trail.','Look up a fictional verification code. This is not proof of government authenticity.',button('All modules','go-modules','btn'))}${fxNotice('The QR sample encodes OHCSF-DEMO-0148. No real seal, cryptographic signature or official verification registry is involved.')}<div class="fx-two-column"><section class="panel panel-padding"><img class="fx-qr" src="verification-qr.svg" alt="QR code containing the demonstration reference OHCSF-DEMO-0148"/><p class="subtle">QR sample / OHCSF-DEMO-0148</p><form id="fx-verify-form">${field('Sample verification code','code','text','OHCSF-DEMO-0148')}${button('Check sample reference','fx-submit-verify','btn btn-primary','type="submit"')}</form></section><section class="panel panel-padding" id="fx-verification-result"><p class="eyebrow">REFERENCE LOOKUP RESULT</p>${verified ? verificationResult(verified) : '<h2 class="fx-serif">Inspect before trusting.</h2><p>The result shows a fictional file reference and status, not a security or authenticity guarantee.</p>'}</section></div>`;
}
function verificationResult(valid) {const record=getRecord('REG/2026/0148');return valid === 'valid' && record ? `<h2 class="fx-serif">Sample reference found.</h2><p>OHCSF-DEMO-0148 corresponds to ${escapeHTML(record.title)}.</p><span class="badge draft">Fictional record / not officially verified</span>` : '<h2 class="fx-serif">No accessible sample match.</h2><p>The reference is unavailable to your department or does not match a sample.</p>';}
function resultModal(feature,title,body) {showModal(featureLabels[feature],title,body+fxNotice(),button('Return to workspace','fx-return','btn btn-primary'),true);}
function downloadJSON(value,name) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const link = document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

document.addEventListener('click',event=>{
  const trigger = event.target.closest('[data-action]'); if (!trigger || trigger.disabled || trigger.type==='submit' && trigger.form) return;
  const action = trigger.dataset.action; if (!action.startsWith('fx-')) return;
  switch(action) {
    case 'fx-open': openFeature(trigger.dataset.feature);break;
    case 'fx-return': closeModal(false);render();break;
    case 'fx-rotate': $('#fx-scan-paper').classList.toggle('rotated');break;
    case 'fx-cleanup': $('#fx-scan-paper').classList.toggle('cleaned');break;
    case 'fx-scan-review': startCapture();break;
    case 'fx-email-capture': startCapture();break;
    case 'fx-email-procurement': startCapture(null,'procurement');break;
    case 'fx-preview-format': {const format=trigger.dataset.format;$('#fx-format-preview').innerHTML=format==='Spreadsheet'?fxTable(['Department','Sample records'],[[escapeHTML(departmentLabel(currentOfficer.department)),visibleRecords().length]]):`<h3>${format} / illustrative sample</h3><p>${escapeHTML(visibleRecords()[0]?.summary)}</p><p class="subtle">Not an actual ${format} file renderer.</p>`;break;}
    case 'fx-move-step': {const i=Number(trigger.dataset.index);if(!Number.isInteger(i)||i<1||i>=fx.workflow.length)break;[fx.workflow[i-1],fx.workflow[i]]=[fx.workflow[i],fx.workflow[i-1]];designerModal();break;}
    case 'fx-reset-workflow': fx.workflow=initialFX().workflow;designerModal();break;
    case 'fx-save-workflow': fxSave('Workflow canvas saved',`${fx.workflow.length} illustrative entries / not a compulsory path`);closeModal(false);render();toast('Illustration saved. Mandatory intake and authority-based routing are unchanged.');break;
    case 'fx-parallel-review': {const i=Number(trigger.dataset.index);fx.parallel[i]=!fx.parallel[i];parallelModal();break;}
    case 'fx-parallel-merge': if(!fx.parallel.every(Boolean))return toast('Review both prepared branches first.',true);fxSave('Consultation illustration merged','Both sample branches reviewed / no approval or assignment.');resultModal('parallel','Prepared consultation notes combined.','<div class="review-summary"><h3>Sample branches merged</h3><p>No file was assigned or approved. Mandatory intake, selective authority-based routing and the unconfigured final authority are unchanged.</p></div>');break;
    case 'fx-receipt': {const department=departments[Number(trigger.dataset.index)];if(!department || !canAccessDepartment(department))return toast('Department access required.',true);if(!fx.receipts.includes(department))fx.receipts.push(department);fxSave('Circular receipt acknowledged',departmentLabel(department));receiptsModal();break;}
    case 'fx-save-permissions': {const matrix={};document.querySelectorAll('.fx-permission').forEach(input=>{matrix[`${input.dataset.role}-${input.dataset.permission}`]=input.checked;});fx.config.authorityPermissions=matrix;fxSave('Authority matrix saved','Design configuration only / operational checks unchanged.');closeModal(false);render();break;}
    case 'fx-print': window.print();break;
    case 'fx-api-run': $('#fx-api-response').textContent=JSON.stringify({status:201,reference:'API-DEMO-001',mode:'local dry run',network_request_sent:false},null,2);fxSave('API dry-run previewed','No network request.');break;
    case 'fx-sync': {const queued=fx.offline.filter(item=>item.status==='Queued');queued.forEach(item=>{item.status='Review simulated / not registered';});fxSave('Offline queue review simulated',`${queued.length} prepared items / no records created`);render();offlineModal();break;}
    case 'fx-backup': fx.snapshot=structuredClone(data);fxSave('Demo metadata snapshot created',`${data.records.length} fictional records`);backupModal();break;
    case 'fx-download-backup': downloadJSON({notice:'FICTIONAL DESIGN PROTOTYPE DATA ONLY',records:visibleRecords(),users:data.users.filter(user=>user.department===currentOfficer.department),settings:data.settings},'OHCSF-prototype-metadata.json');break;
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='fx-branch')$('#fx-conditional-result').innerHTML=`<h3>${escapeHTML(event.target.value)} handling</h3><p>${event.target.value==='Internal'?'Ordinary handling illustration.':'Restricted handling review illustration.'} Mandatory intake and selective authority-based routing are unchanged.</p><p class="subtle">Configuration-only example; no final approval authority is established.</p>`;
  if(event.target.id==='fx-translation')$('#fx-translation-output').textContent={Hausa:'Da fatan za a gabatar da rahoton bayanan sashinku.',Yoruba:'Jowo, fi iroyin iwe eka yin sile.',Igbo:'Biko, nyefee akuko ndeko ngalaba unu.'}[event.target.value];
});
document.addEventListener('submit',event=>{
  const form=event.target;if(!form.id.startsWith('fx-'))return;event.preventDefault();if(!form.reportValidity())return;const values=new FormData(form);
  if(form.id==='fx-auth-form'){if(authStep===0){authStep=1;authModal();}else if(values.get('code')==='123456'){fxSave('Sign-in flow previewed','Fixed demo code only.');resultModal('signin','Sample sign-in journey complete.','<div class="review-summary"><h3>Fictional officer session</h3><p>This preview did not authenticate an account or establish a secure government session.</p></div>');}else toast('Use the prepared sample code 123456.',true);return;}
  if(form.id==='fx-designer-form'){fx.workflow.push(values.get('step').trim());designerModal();return;}
  if(form.id==='fx-offline-form'){fx.offline.push({title:values.get('title').trim(),status:'Queued'});fxSave('Offline sample queued');offlineModal();return;}
  if(form.id==='fx-public-form'){const ticket={id:`PUBLIC-DEMO-${String(fx.tickets.length+1).padStart(3,'0')}`,subject:values.get('subject'),sender:values.get('sender')};fx.tickets.push(ticket);fxSave('Public submission previewed',ticket.id);render();return;}
  if(form.id==='fx-verify-form'){fx.config.verification=values.get('code').trim()==='OHCSF-DEMO-0148'?'valid':'missing';fxSave('Sample reference checked','Not official verification.');$('#fx-verification-result').innerHTML=verificationResult(fx.config.verification);return;}
  if(form.id!=='fx-feature-form')return;
  const feature=form.dataset.feature;
  if(feature==='incoming'){closeModal(false);startCapture();return;}
  const value=Object.fromEntries(values.entries());const record=getRecord(value.record);
  if(value.record&&!record)return toast('This record is not accessible to your department.',true);
  if(value.department&&value.department!=='All departments'&&(!departments.includes(value.department)||!canAccessDepartment(value.department)))return toast('Department access required.',true);
  if(feature==='bulk'){const titles=['Liaison nomination - batch','Staff induction - batch','Quarterly records return - batch'];const selected=[...new Set(values.getAll('batch'))];if(!selected.length||selected.some(i=>!['0','1','2'].includes(i)))return toast('Select at least one valid prepared sample.',true);fx.config.bulk={...value,samples:selected.map(i=>titles[Number(i)]),registered:false};fxSave('Bulk import configuration saved',`${selected.length} prepared items / no records created`);closeModal(false);render();toast('Prepared selection saved. No mail was registered; use PS Registry capture.');return;}
  if(feature==='folders')fx.folders.push(`${value.parent} / ${value.path}`);
  if(feature==='checkout'){const existing=fx.config[`working-${value.record}`];if(value.operation==='Check out'&&existing?.checkedOut)return toast('This sample is already checked out. Check it in first.',true);fx.config[`working-${value.record}`]={checkedOut:value.operation==='Check out',note:value.note};addHistory(record,`${value.operation} preview`,value.note,'Demo officer');save();}
  if(feature==='rollback'){const original=seedRecords.find(item=>item.id===record.id);if(!original)return toast('No earlier prepared metadata is available for this sample.',true);record.summary=original.summary;record.version++;addHistory(record,'Metadata rollback preview',value.reason,'Demo officer');save();}
  if(feature==='bookmark')fx.bookmarks.push({record:value.record,label:value.label});
  if(['advanced','savedSearch'].includes(feature)){if(value.from>value.to)return toast('The start date must precede the end date.',true);const matches=visibleRecords().filter(record=>[record.title,record.summary,record.id].join(' ').toLowerCase().includes(value.query.toLowerCase())&&(value.department==='All departments'||record.department===value.department)&&(value.type==='All types'||record.type===value.type)&&record.date>=value.from&&record.date<=value.to);fx.config[feature]=value;fxSave(`${featureLabels[feature]} completed`,`${matches.length} sample matches`);resultModal(feature,'Search matches from fictional records.',recordTable(matches));return;}
  if(feature==='classify'){record.level=value.classification;addHistory(record,'Classification reviewed',`${value.classification}; tags: ${value.tags}; ${value.reason}`,'Demo registry officer');save();}
  if(feature==='delegation'&&value.officer===value.delegate)return toast('Choose a different delegate for this sample.',true);
  if(feature==='signature'){signatureModal(record);return;}
  if(feature==='seal'){if(!canActOnRecord(record)||record.status==='Archived')return toast('Only the currently assigned officer can endorse this document.',true);addHistory(record,'DEMO seal preview',`${value.signer}, ${value.designation}: ${value.text}`,currentOfficer.name);save();fxSave(featureLabels[feature],record.id);resultModal(feature,'Fictional endorsement applied to the activity trail.',`<div class="fx-demo-seal"><strong>DEMO ONLY</strong><span>${escapeHTML(value.signer)}</span><small>NOT A LEGALLY BINDING SIGNATURE OR SEAL</small></div>`);return;}
  if(['annotation','mentions'].includes(feature)){fx.annotations.push(value);addHistory(record,'Sample annotation',`@${value.officer} / ${value.location}: ${value.note}`,'Demo officer');save();}
  if(feature==='sharing'){fx.shares.push(value);fx.config[feature]=value;fxSave('Sharing preview created','Fictional recipient only / no message sent.');resultModal(feature,'Recipient access preview prepared.',`<div class="review-summary"><h3>${escapeHTML(value.record)}</h3><p>Recipient: ${escapeHTML(value.recipient)}</p><p>${escapeHTML(value.permission)} / expires ${escapeHTML(value.expiry)}</p><p>Demo access code: <strong>DEMO-ACCESS</strong></p><p>No publicly accessible link or security token has been issued.</p></div>`);return;}
  if(feature==='outgoing'){fx.correspondence.push({id:`OUT/2026/${String(fx.correspondence.filter(item=>item.direction==='Outgoing').length+1).padStart(3,'0')}`,direction:'Outgoing',department:value.department,subject:value.subject,sender:value.sender,status:'Prepared outgoing illustration'});}
  if(feature==='custody'){fx.custody.push(value);addHistory(record,'Physical custody preview',`${value.movement}: ${value.officer}, ${value.location}. ${value.note}`,'Demo registry officer');save();}
  if(feature==='dispatch'){fx.dispatch.push(value);const item=fx.correspondence.find(item=>item.id===value.reference);if(!item)return toast('Choose an existing outgoing reference.',true);item.status=value.status;}
  if(feature==='clearance'){const levels=['Public','Internal','Confidential','Secret'];const allowed=levels.indexOf(value.clearance)>=levels.indexOf(record.level);fxSave('Handling decision previewed',allowed?'Allowed by sample clearance rule':'Denied by sample clearance rule');resultModal(feature,'Illustrative clearance evaluation.',`<div class="review-summary"><h3>${allowed?'Access allowed in policy preview':'Access denied in policy preview'}</h3><p>${escapeHTML(value.record)} / ${escapeHTML(record.level)} / officer clearance: ${escapeHTML(value.clearance)}</p><p>This result does not enforce actual application permissions.</p></div>`);return;}
  if(feature==='watermark'){data.settings.watermark=value.enabled==='Enabled';save();}
  if(feature==='hold'){if(value.operation==='Apply legal hold'&&!fx.holds.some(item=>item.record===value.record))fx.holds.push(value);if(value.operation==='Release legal hold')fx.holds=fx.holds.filter(item=>item.record!==value.record);addHistory(record,'Legal-hold design action',`${value.operation}: ${value.reason}`,'Demo records officer');save();}
  if(feature==='retention')fx.retention.push({category:value.category,years:Number(value.years),action:value.action});
  if(feature==='disposal'){if(fx.holds.some(item=>item.record===value.record))return toast('Disposition blocked: this fictional record is under a legal hold.',true);if(record.status!=='Archived')return toast('Disposition blocked: archive and appraise the sample before disposal.',true);if(value.recommendation==='Dispose after approval'&&!fx.disposed.includes(value.record))fx.disposed.push(value.record);addHistory(record,'Disposition preview',`${value.recommendation}. ${value.authority}: ${value.reason}. No binary record was deleted.`,'Demo records officer');save();}
  if(feature==='restore'){if(record.status!=='Archived')return toast('Select an archived sample record.',true);record.status='Approved';fx.disposed=fx.disposed.filter(id=>id!==record.id);addHistory(record,'Archive restore preview',value.reason,'Demo records officer');save();}
  if(feature==='reports'){const rows=visibleRecords().filter(record=>value.scope==='All departments'||record.department===value.scope);fxSave('Report preview generated',value.metric);resultModal(feature,`${value.metric} / fictional report`,recordTable(value.metric==='Overdue records'?rows.filter(isLate):rows));return;}
  if(['sensitive','anonymise'].includes(feature)){record.level=value.level;addHistory(record,'Prepared content review',`${featureLabels[feature]} / ${value.level}. Fictional example only.`,'Demo reviewing officer');save();}
  if(feature==='accessibility'){document.body.classList.toggle('fx-high-contrast',value.contrast==='High contrast');document.body.classList.toggle('fx-large-text',value.text==='Larger');document.body.classList.toggle('fx-reduced-motion',value.motion==='Reduced motion');}
  if(feature==='recovery'){if(!fx.snapshot)return toast('Create a fictional metadata snapshot before recovery.',true);data=structuredClone(fx.snapshot);save();}
  fx.config[feature]=value;fxSave(featureLabels[feature],feature.endsWith('Connector')?'Simulated check / no connection attempted.':['templates','rescue'].includes(feature)?'Prepared configuration only / no records created.':'Fictional design action recorded.');closeModal(false);render();toast(`${featureLabels[feature]}: ${['templates','rescue'].includes(feature)?'prepared configuration saved; no mail registered.':'demonstration updated.'}`);
});
