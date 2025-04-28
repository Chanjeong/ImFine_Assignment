let data = JSON.parse(localStorage.getItem('data'));

function renderBarChart() {
  const barChart = document.getElementById('barChart');
  barChart.innerHTML = '';
  data.forEach(item => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = item.value * 3 + 'px';
    const value = document.createElement('div');
    value.className = 'bar-value';
    value.innerText = item.id;
    bar.appendChild(value);
    barChart.appendChild(bar);
  });
}

function renderEditTable() {
  const tbody = document.getElementById('editTableBody');
  tbody.innerHTML = '';
  data.forEach((item, index) => {
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.textContent = item.id;

    const tdValue = document.createElement('td');
    const inputValue = document.createElement('input');
    inputValue.type = 'number';
    inputValue.value = item.value;
    inputValue.dataset.index = index;
    tdValue.appendChild(inputValue);

    const tdActions = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => deleteItem(index);
    tdActions.appendChild(deleteButton);

    tr.appendChild(tdId);
    tr.appendChild(tdValue);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function applyEdits() {
  const inputs = document.querySelectorAll('#editTableBody input');
  inputs.forEach(input => {
    const index = input.dataset.index;
    data[index].value = Number(input.value);
  });
  saveData();
  refresh();
}

function addItem() {
  const newId = document.getElementById('newId').value.trim();
  const newValue = document.getElementById('newValue').value.trim();
  if (newId && newValue) {
    data.push({ id: newId, value: Number(newValue) });
    document.getElementById('newId').value = '';
    document.getElementById('newValue').value = '';
    saveData();
    refresh();
  } else {
    alert('값을 입력해주세요.');
  }
}

function deleteItem(index) {
  data.splice(index, 1);
  saveData();
  refresh();
}

function applyJson() {
  try {
    const newData = JSON.parse(document.getElementById('jsonEditor').value);
    if (Array.isArray(newData)) {
      data = newData;
      saveData();
      refresh();
    } else {
      alert('올바르지 않습니다.');
    }
  } catch (e) {
    alert('올바른 형식이 아닙니다.');
  }
}

function saveData() {
  localStorage.setItem('data', JSON.stringify(data));
}

function refresh() {
  renderBarChart();
  renderEditTable();
  document.getElementById('jsonEditor').value = JSON.stringify(data, null, 2);
}

refresh();
