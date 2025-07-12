async function fetchTodos() {
  const res = await fetch('/todos');
  const todos = await res.json();
  renderTodos(todos);
}

async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;

  await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  input.value = '';
  fetchTodos();
}

async function toggleTodo(id) {
  await fetch(`/todos/${id}/toggle`, { method: 'PUT' });
  fetchTodos();
}

async function clearCompleted() {
  await fetch('/todos/completed', { method: 'DELETE' });
  fetchTodos();
}

function renderTodos(todos) {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.onclick = () => toggleTodo(todo.id);

    const label = document.createElement('label');
    label.textContent = todo.text;

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
  });

  document.getElementById('counter').textContent = `${todos.length} item(s)`;
  document.getElementById('clearBtn').style.display = todos.some(t => t.completed) ? 'inline-block' : 'none';
}

fetchTodos();
