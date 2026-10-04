// Selecting DOM elements for task handling, UI state, and progress calculation
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressPercent = document.getElementById('progress-percent');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

// Retrieve existing task array from browser LocalStorage or initialize an empty array
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all'; // Tracks currently active view filter ('all', 'active', 'completed')

// Function to synchronize the state array with browser LocalStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Function to calculate task completion percentage and update counters dynamically
function updateStats() {
  const total = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = total - completedCount;

  // Calculate completion percentage safely to avoid division by zero
  const percent = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  progressBarFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;

  // Display number of active tasks left
  itemsLeft.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

// Function to render tasks dynamically onto the DOM based on current filter state
function renderTodos() {
  todoList.innerHTML = ''; // Reset UI list before re-rendering

  // Filter tasks based on active selection filter
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  // Dynamically generate DOM list elements for each task
  filteredTodos.forEach((todo) => {
    const originalIndex = todos.indexOf(todo);
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    // Inner HTML structure with toggle click handler, edit button, and delete button
    li.innerHTML = `
      <span class="todo-text" onclick="toggleTodo(${originalIndex})">${todo.text}</span>
      <div class="actions">
        <button class="edit-btn" onclick="editTodo(${originalIndex})">✏️</button>
        <button class="delete-btn" onclick="deleteTodo(${originalIndex})">🗑️</button>
      </div>
    `;

    todoList.appendChild(li);
  });

  // Re-calculate stats every time list updates
  updateStats();
}

// Handle form submission when adding a new task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page refresh on submit
  const text = todoInput.value.trim();

  if (text !== '') {
    todos.push({ text: text, completed: false }); // Add new task object
    saveTodos();
    renderTodos();
    todoInput.value = ''; // Reset input field
  }
});

// Toggle completion status of a task when clicked
function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Prompt user to edit task description
function editTodo(index) {
  const newText = prompt('Edit task:', todos[index].text);
  if (newText !== null && newText.trim() !== '') {
    todos[index].text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

// Remove task from array
function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

// Handle switching between view filters ('All', 'Active', 'Completed')
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active'); // Update visual active tab
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Remove all completed tasks at once
clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

// Initial render call when script loads
renderTodos();