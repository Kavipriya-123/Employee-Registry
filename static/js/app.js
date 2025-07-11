
let currentPage = 1;
let itemsPerPage = 10;


function renderEmployees() {
  const container = document.getElementById('employee-list');
  const query = document.getElementById('search').value.toLowerCase();
  const sortBy = document.getElementById('sort-select').value;


  let filtered = employees.filter(e =>
    e.firstName.toLowerCase().includes(query) ||
    e.lastName.toLowerCase().includes(query) ||
    e.email.toLowerCase().includes(query)
  );


  if (sortBy) filtered.sort((a,b) => a[sortBy].localeCompare(b[sortBy]));


  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(start, start + itemsPerPage);

  
  container.innerHTML = '';
  paginated.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p>Email: ${emp.email}</p>
      <p>Department: ${emp.department}</p>
      <p>Role: ${emp.role}</p>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    container.appendChild(card);
  });

  renderPagination(filtered.length);
}


function renderPagination(totalCount) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => { currentPage = i; renderEmployees(); };
    pag.appendChild(btn);
  }
}


function showForm() {
  document.getElementById('employee-form').reset();
  document.getElementById('emp-id').value = '';
  document.getElementById('form-title').innerText = 'Add Employee';
  document.getElementById('employee-form').style.display = 'block';
}


function hideForm() {
  document.getElementById('employee-form').style.display = 'none';
}


function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (!emp) return;
  document.getElementById('form-title').innerText = 'Edit Employee';
  document.getElementById('emp-id').value = emp.id;
  document.getElementById('firstName').value = emp.firstName;
  document.getElementById('lastName').value = emp.lastName;
  document.getElementById('email').value = emp.email;
  document.getElementById('department').value = emp.department;
  document.getElementById('role').value = emp.role;
  document.getElementById('employee-form').style.display = 'block';
}


function deleteEmployee(id) {
  if (!confirm('Delete this employee?')) return;
  employees = employees.filter(e => e.id !== id);
  renderEmployees();
}


const form = document.getElementById('employee-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('emp-id').value;
  const newEmp = {
    id: id ? parseInt(id) : Date.now(),
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    department: document.getElementById('department').value,
    role: document.getElementById('role').value
  };


  if (!validate(newEmp)) return;

  
  if (id) {
    const idx = employees.findIndex(e => e.id === newEmp.id);
    employees[idx] = newEmp;
  } else {
    employees.push(newEmp);
  }
  hideForm();
  renderEmployees();
});


function validate(emp) {
  const emailR = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emp.firstName || !emp.lastName || !emp.email || !emp.department || !emp.role) {
    alert('All fields are required.'); return false;
  }
  if (!emailR.test(emp.email)) { alert('Invalid email'); return false; }
  return true;
}


document.getElementById('search').addEventListener('input', () => { currentPage = 1; renderEmployees(); });
document.getElementById('sort-select').addEventListener('change', () => { currentPage = 1; renderEmployees(); });


window.onload = renderEmployees;