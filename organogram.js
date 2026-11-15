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
  const availableDepartments = [...new Set([centralDepartment, ...data.users.map(user => user.department)])];
  const officerOptions = department => data.users.filter(user => user.department === department).map(user => `<option value="${escapeHTML(user.id)}"${user.id === currentOfficer.id ? ' selected' : ''}>${escapeHTML(`${user.name} / ${user.rank}${user.grade == null ? '' : ` / GL${String(user.grade).padStart(2, '0')}`}${user.id === currentOfficer.id ? ' (current desk)' : ''}`)}</option>`).join('');
  showModal('Choose a fictional desk', 'Switch office context / no real account authentication', `<div class="organogram-picker">
    <div class="organogram-picker-intro"><p>Current desk: <strong>${escapeHTML(currentOfficer.name)}</strong></p><p>${escapeHTML(currentOfficer.rank)} / ${escapeHTML(departmentLabel(currentOfficer.department))}</p></div>
    <form id="officer-picker-form" aria-describedby="officer-picker-note">
      <div class="field"><label for="officer-picker-department">Department / central office</label><select id="officer-picker-department" name="department" required autofocus>${availableDepartments.map(department => `<option value="${escapeHTML(department)}"${department === currentOfficer.department ? ' selected' : ''}>${escapeHTML(departmentLabel(department))}</option>`).join('')}</select></div>
      <div class="field"><label for="officer-picker-officer">Officer / desk</label><select id="officer-picker-officer" name="officer" required aria-describedby="officer-picker-selection">${officerOptions(currentOfficer.department)}</select></div>
      <p id="officer-picker-selection" class="organogram-picker-selection" role="status"></p>
      <div class="organogram-picker-actions">${button(`Open inbox ${icon('arrow')}`, 'select-officer', 'btn btn-primary', `data-id="${escapeHTML(currentOfficer.id)}"`)}</div>
    </form>
    <p id="officer-picker-note" class="organogram-picker-note">Names and records are fictional. Switching desks does not authenticate an account, grant real permissions or delegate authority. Assignment is not final approval.</p>
  </div>`, button('Keep current desk', 'close-modal', 'btn'));

  const form = document.getElementById('officer-picker-form');
  const departmentSelect = form.elements.namedItem('department');
  const officerSelect = form.elements.namedItem('officer');
  const openButton = form.querySelector('[data-action="select-officer"]');
  const selection = form.querySelector('#officer-picker-selection');
  const updateSelection = () => {
    const officer = data.users.find(user => user.id === officerSelect.value && user.department === departmentSelect.value);
    openButton.dataset.id = officer?.id || '';
    openButton.disabled = !officer;
    officerSelect.disabled = !officerSelect.options.length;
    selection.textContent = officer ? `${officer.name} / ${officer.rank} / ${departmentLabel(officer.department)}${officer.grade == null ? ' / Central office' : ` / GL${String(officer.grade).padStart(2, '0')}`}` : 'No officers are available in this office.';
  };
  departmentSelect.addEventListener('change', () => {
    officerSelect.innerHTML = officerOptions(departmentSelect.value);
    updateSelection();
  });
  officerSelect.addEventListener('change', updateSelection);
  // Keep this selector out of the document-level task submission handlers.
  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
  });
  updateSelection();
}
