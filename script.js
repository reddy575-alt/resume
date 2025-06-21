document.addEventListener('input', updatePreview);

let skills = [];

const skillInput = document.getElementById('skill-input');
const skillTagsContainer = document.getElementById('skill-tags');

skillInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && skillInput.value.trim() !== '') {
    e.preventDefault();
    addSkill(skillInput.value.trim());
    skillInput.value = '';
  }
});

function addSkill(skill) {
  if (!skills.includes(skill)) {
    skills.push(skill);
    renderSkills();
    updatePreview();
  }
}

function removeSkill(skill) {
  skills = skills.filter(s => s !== skill);
  renderSkills();
  updatePreview();
}

function renderSkills() {
  skillTagsContainer.innerHTML = '';
  skills.forEach(skill => {
    const tag = document.createElement('div');
    tag.classList.add('skill-tag');
    tag.textContent = skill;

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-skill');
    removeBtn.textContent = '×';
    removeBtn.onclick = () => removeSkill(skill);

    tag.appendChild(removeBtn);
    skillTagsContainer.appendChild(tag);
  });
}


function addEducation() {
  const container = document.getElementById('education-section');
  const div = document.createElement('div');
  div.setAttribute('draggable', true);
  div.innerHTML = `
    <input type="text" placeholder="Degree" class="edu" />
    <input type="text" placeholder="Institution" class="edu" />
    <input type="text" placeholder="Year" class="edu" />
    <button type="button" onclick="removeEntry(this)">Remove</button>
  `;
  container.appendChild(div);
  addDragAndDropHandlers(div);
}

function addDragAndDropHandlers(elem) {
  elem.addEventListener('dragstart', (e) => {
    elem.classList.add('dragging');
    e.dataTransfer.setData('text/plain', '');
  });
  elem.addEventListener('dragend', () => {
    elem.classList.remove('dragging');
  });

  elem.parentElement.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(elem.parentElement, e.clientY);
    if (afterElement == null) {
      elem.parentElement.appendChild(dragging);
    } else {
      elem.parentElement.insertBefore(dragging, afterElement);
    }
    updatePreview();
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('div:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return {offset: offset, element: child};
    } else {
      return closest;
    }
  }, {offset: Number.NEGATIVE_INFINITY}).element;
}


function addExperience() {
  const container = document.getElementById('experience-section');
  const div = document.createElement('div');
  div.innerHTML = `
    <input type="text" placeholder="Job Title" class="exp" />
    <input type="text" placeholder="Company" class="exp" />
    <input type="text" placeholder="Years Worked" class="exp" />
    <button type="button" onclick="removeEntry(this)">Remove</button>
  `;
  container.appendChild(div);
}

function removeEntry(btn) {
  btn.parentElement.remove();
  updatePreview();
}


function updatePreview() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const summary = document.getElementById('summary').value;

  const eduFields = document.querySelectorAll('.edu');
  const expFields = document.querySelectorAll('.exp');

  let resumeHTML = `
    <h2>${name || 'Your Name'}</h2>
    <p>Email: ${email || 'email@example.com'} | Phone: ${phone || '123-456-7890'}</p>
    <p><strong>Summary:</strong> ${summary || 'Brief profile summary...'}</p>
    <h3>Education</h3>
    <ul>`;
  
  for (let i = 0; i < eduFields.length; i += 3) {
    if (eduFields[i] && (eduFields[i].value || eduFields[i+1].value || eduFields[i+2].value)) {
      resumeHTML += `<li>${eduFields[i].value || 'Degree'} at ${eduFields[i + 1].value || 'Institution'} (${eduFields[i + 2].value || 'Year'})</li>`;
    }
  }
  resumeHTML += `</ul><h3>Experience</h3><ul>`;

  for (let i = 0; i < expFields.length; i += 3) {
    if (expFields[i] && (expFields[i].value || expFields[i+1].value || expFields[i+2].value)) {
      resumeHTML += `<li>${expFields[i].value || 'Job Title'} at ${expFields[i + 1].value || 'Company'} (${expFields[i + 2].value || 'Years'})</li>`;
    }
  }
  resumeHTML += `</ul><h3>Skills</h3><p>${skills.length ? skills.join(', ') : 'Add your skills above'}</p>`;

  const preview = document.getElementById('resume-preview');
  preview.innerHTML = resumeHTML;

  updateProgressBar();
}


function clearForm() {
  document.getElementById('resume-form').reset();
  document.getElementById('education-section').innerHTML = '';
  document.getElementById('experience-section').innerHTML = '';
  skills = [];
  renderSkills();
  document.getElementById('resume-preview').innerHTML = '';
  updateProgressBar();
}


function updateProgressBar() {
  const fields = Array.from(document.querySelectorAll('#resume-form input:not([type="button"]), #resume-form textarea'));
  let filled = 0;
  fields.forEach(field => {
    if (field.value.trim() !== '') filled++;
  });
  if (skills.length > 0) filled++;

  const percent = Math.round((filled / (fields.length + 1)) * 100);
  document.getElementById('progress-bar').style.width = percent + '%';
}


function downloadPDF() {
  const element = document.getElementById('resume-preview');
  if (element.innerHTML.trim() === '') {
    alert('Please fill out the form to generate a resume first.');
    return;
  }
}
