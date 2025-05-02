// DOM 요소 캐싱
const barChart = document.getElementById('barChart');
const tbody = document.getElementById('editTableBody');
const newIdInput = document.getElementById('newId');
const newValueInput = document.getElementById('newValue');
const jsonEditor = document.getElementById('jsonEditor');
// 이벤트 리스너 등록
document.getElementById('applyEditsBtn').addEventListener('click', applyEdits);
document.getElementById('addItemBtn').addEventListener('click', addItem);
document.getElementById('applyJsonBtn').addEventListener('click', applyJson);

//  데이터 초기화
let data = JSON.parse(localStorage.getItem('data') || '[]');

//  바 차트 렌더링
function renderBarChart() {
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

// 편집 테이블 렌더링
function renderEditTable() {
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

// JSON 에디터 동기화
function updateJsonEditor() {
  jsonEditor.value = JSON.stringify(data, null, 2);
}

// 데이터 저장
function saveData() {
  localStorage.setItem('data', JSON.stringify(data));
}

// 전체 리렌더링
function refresh() {
  renderBarChart();
  renderEditTable();
  updateJsonEditor();
}

// 새 항목 추가
function addItem() {
  const newId = newIdInput.value.trim();
  const newValue = newValueInput.value.trim();

  if (!newId || newValue === '') {
    alert('ID와 값을 모두 입력해주세요.');
    return;
  }

  if (isNaN(newValue)) {
    alert('값은 숫자여야 합니다.');
    return;
  }

  if (data.some(item => item.id === newId)) {
    alert('이미 존재하는 ID입니다.');
    return;
  }

  data.push({ id: newId, value: Number(newValue) });
  newIdInput.value = '';
  newValueInput.value = '';
  saveData();
  refresh();
}

// 항목 삭제
function deleteItem(index) {
  if (confirm('정말 삭제하시겠습니까?')) {
    data.splice(index, 1);
    saveData();
    refresh();
  }
}

// 편집 적용
function applyEdits() {
  const inputs = document.querySelectorAll('#editTableBody input');
  inputs.forEach(input => {
    const index = input.dataset.index;
    data[index].value = Number(input.value);
  });
  saveData();
  refresh();
}

// JSON 직접 적용
function applyJson() {
  try {
    const newData = JSON.parse(jsonEditor.value);
    if (!Array.isArray(newData)) {
      alert('배열 형식의 JSON이어야 합니다.');
      return;
    }
    data = newData;
    saveData();
    refresh();
  } catch {
    alert('올바른 형식의 JSON이 아닙니다.');
  }
}

// 초기 렌더링
refresh();
