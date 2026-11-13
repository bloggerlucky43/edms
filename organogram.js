'use strict';

function organogramDeskCard(department, title, grade, headingLevel = 4) {
  const officer = data.users.find(user => user.department === department && user.rank === title);
  const selected = officer && officer.id === currentOfficer.id;
  const officeGrade = grade ?? officer?.grade;
  const gradeLabel = officeGrade == null ? 'Central office' : `GL${String(officeGrade).padStart(2, '0')}`;
  const officeLabel = `${title}, ${departmentLabel(department)}`;
  return `<article class="organogram-desk${selected ? ' is-current' : ''}">
    <div class="organogram-desk-heading"><h${headingLevel}>${escapeHTML(title)}</h${headingLevel}><span class="organogram-grade">${escapeHTML(gradeLabel)}</span></div>
    <p class="organogram-incumbent">${officer ? escapeHTML(officer.name) : 'No fictional incumbent assigned'}</p>
    <p class="organogram-desk-state">${selected ? `${icon('check')} Current desk` : 'Fictional office context'}</p>
    ${officer ? button(`Open desk ${icon('arrow')}`, 'select-officer', 'btn organogram-open-desk', `data-id="${escapeHTML(officer.id)}" aria-label="${escapeHTML(`Open desk: ${officeLabel}${selected ? ' (current desk)' : ''}`)}"`) : '<button type="button" class="btn organogram-open-desk" disabled>Desk unavailable</button>'}
  </article>`;
}

function officerPickerModal() {
  const branches = [departments[3], departments[0], departments[1], departments[2]];
  const additionalOfficers = data.users.filter(user => user.id !== officeID(user.department,route.indexOf(user.rank)) && staffRanks.some(rank => rank.title === user.rank));
  showModal('Choose a fictional desk', 'Switch office context / no real account authentication', `<div class="organogram-picker">
    <div class="organogram-picker-intro"><p>Current desk: <strong>${escapeHTML(currentOfficer.name)}</strong> / ${escapeHTML(currentOfficer.rank)} / ${escapeHTML(departmentLabel(currentOfficer.department))}.</p><p>Select an office to open its inbox. Names and records are fictional; switching does not grant real permissions or delegate authority.</p></div>
    <section aria-labelledby="organogram-picker-central"><div class="organogram-section-heading"><div><p class="eyebrow">CENTRAL OFFICES</p><h3 id="organogram-picker-central">${escapeHTML(departmentLabel(centralDepartment))}</h3></div></div><p class="organogram-picker-note">PS Registry is the intake desk. The Permanent Secretary is the reporting root.</p><ul class="organogram-picker-central"><li>${organogramDeskCard(centralDepartment, 'PS Registry', undefined)}</li><li>${organogramDeskCard(centralDepartment, 'Permanent Secretary', undefined)}</li></ul></section>
    <div class="organogram-picker-departments">${branches.map((department, index) => `<section aria-labelledby="organogram-picker-department-${index}"><header class="organogram-branch-heading"><p class="eyebrow">DEPARTMENTAL OFFICES</p><h3 id="organogram-picker-department-${index}">${escapeHTML(departmentLabel(department))}</h3></header><ol class="organogram-picker-ranks" aria-label="${escapeHTML(`${departmentLabel(department)} offices by rank`)}">${staffRanks.map(rank => `<li>${organogramDeskCard(department, rank.title, rank.grade)}</li>`).join('')}</ol></section>`).join('')}</div>
    ${additionalOfficers.length ? `<section><h3>Additional departmental officers</h3><p class="organogram-picker-note">Officers in the staff directory can receive tasks at their assigned rank.</p><div class="organogram-picker-central">${additionalOfficers.map(user => `<article class="organogram-desk"><h4>${escapeHTML(user.name)}</h4><p>${escapeHTML(user.rank)} / GL${String(user.grade).padStart(2,'0')} / ${escapeHTML(departmentLabel(user.department))}</p>${button('Open officer inbox','select-officer','btn organogram-open-desk',`data-id="${escapeHTML(user.id)}"`)}</article>`).join('')}</div></section>` : ''}
    <p class="organogram-picker-note">Confirmed grades: GL17, GL16, GL15, GL14, GL13, GL12, GL10, GL09 and GL08. No GL11. Assignment is not final approval.</p>
  </div>`, button('Keep current desk', 'close-modal', 'btn'), true);
}
