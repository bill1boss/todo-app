// Selecting DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Load saved tasks from LocalStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Save tasks to LocalStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Render simple task list
function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    li.innerHTML = `
      <div class="task-content" onclick="toggleTodo(${index})">
        <span class="checkbox"></span>
        <span class="todo-text">${todo.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTodo(${index})">🗑️</button>
    `;

    todoList.appendChild(li);
  });
}

// Add new task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();

  if (text !== '') {
    todos.push({ text: text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
  }
});

// Toggle complete status
function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Delete task
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// Initial Render
renderTodos();