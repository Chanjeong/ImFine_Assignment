// 그래프에 넣을 데이터터
let data = JSON.parse(localStorage.getItem('data') || []);

// 바 차트 렌더링
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

// 그래프 값 편집 기능
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

// 수정된 값 저장
function applyEdits() {
  const inputs = document.querySelectorAll('#editTableBody input');
  inputs.forEach(input => {
    const index = input.dataset.index;
    data[index].value = Number(input.value);
  });
  saveData();
  refresh();
}

// 새 항목에 추가
function addItem() {
  const newIdInput = document.getElementById('newId');
  const newValueInput = document.getElementById('newValue');
  const newId = newIdInput.value.trim();
  const newValue = newValueInput.value.trim();
  if (!newId || !newValue) {
    alert('값을 모두 입력해주세요.');
    return;
  }
  data.push({ id: newId, value: Number(newValue) });
  newIdInput.value = '';
  newValueInput.value = '';
  saveData();
  refresh();
}

//데이터 값 삭제
function deleteItem(index) {
  data.splice(index, 1);
  saveData();
  refresh();
}

//JSON을 통한 고급 편집
function applyJson() {
  try {
    const newData = JSON.parse(document.getElementById('jsonEditor').value);
    if (!Array.isArray(newData)) {
      alert('배열 형식의 JSON이어야 합니다.');
      return;
    }
    data = newData;
    saveData();
    refresh();
  } catch {
    alert('올바른 형식이 아닙니다.');
  }
}

//저장된 정보 삭제 방지를 위해해 localStorage 기능 추가
function saveData() {
  localStorage.setItem('data', JSON.stringify(data));
}

//리렌더링 기능
function refresh() {
  renderBarChart();
  renderEditTable();
  document.getElementById('jsonEditor').value = JSON.stringify(data, null, 2);
}

refresh();
