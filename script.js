// 1. Επιλογή στοιχείων από το DOM
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 2. Πίνακας για την αποθήκευση των εργασιών (Ανάκτηση από LocalStorage αν υπάρχουν)
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// 3. Συναρτήσεις (Functions)

// Αποθήκευση στο LocalStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Εμφάνιση των εργασιών στην οθόνη
function renderTodos() {
  todoList.innerHTML = ''; // Καθαρισμός της λίστας πριν τον επανασχεδιασμό

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    if (todo.completed) {
      li.classList.add('completed');
    }

    // Δημιουργία περιεχομένου του LI
    li.innerHTML = `
      <span onclick="toggleTodo(${index})">${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(${index})">Διαγραφή</button>
    `;

    todoList.appendChild(li);
  });
}

// Προσθήκη νέας εργασίας
todoForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Αποφυγή reload της σελίδας

  const text = todoInput.value.trim();
  if (text !== '') {
    todos.push({ text: text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = ''; // Καθαρισμός του πεδίου
  }
});

// Αλλαγή κατάστασης (Ολοκληρωμένη / Μη ολοκληρωμένη)
function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

// Διαγραφή εργασίας
function deleteTodo(index) {
  todos.splice(index, 1); // Αφαίρεση του αντικειμένου από τον πίνακα
  saveTodos();
  renderTodos();
}

// 4. Αρχική εμφάνιση κατά τη φόρτωση της σελίδας
renderTodos();