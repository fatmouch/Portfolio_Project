document.addEventListener('DOMContentLoaded', () => {
    // Check and apply the saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Load existing tasks and check for daily reset
    loadTasks();
    checkForDailyReset();

    // Add event listeners
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

        // Toggle icon based on mode
        const sunIcon = document.querySelector('.fa-sun');
        const moonIcon = document.querySelector('.fa-moon');
        sunIcon.style.display = isDarkMode ? 'none' : 'inline';
        moonIcon.style.display = isDarkMode ? 'inline' : 'none';
    });

    document.getElementById('todo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    document.getElementById('todo-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('icon')) {
            toggleTaskCompletion(e.target);
        } else if (e.target.classList.contains('delete-icon')) {
            deleteTask(e.target);
        }
    });
});

// Add a new task
function addTask() {
    const input = document.getElementById('todo-input');
    const taskText = input.value.trim();
    if (taskText) {
        const list = document.getElementById('todo-list');
        const li = document.createElement('li');
        li.innerHTML = `
            ${taskText}
            <i class="fas fa-check icon"></i>
            <i class="fas fa-trash delete-icon"></i>
        `;
        list.appendChild(li);
        input.value = '';
        saveTasks();
    }
}

// Toggle task completion
function toggleTaskCompletion(icon) {
    const li = icon.parentElement;
    li.classList.toggle('completed');
    saveTasks();
}

// Delete a task
function deleteTask(deleteIcon) {
    const li = deleteIcon.parentElement;
    li.remove();
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
        tasks.push({
            text: li.firstChild.textContent.trim(),
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Save the current date for daily reset
    localStorage.setItem('lastSavedDate', new Date().toDateString());
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const list = document.getElementById('todo-list');
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${task.text}
            <i class="fas fa-check icon"></i>
            <i class="fas fa-trash delete-icon"></i>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }
        list.appendChild(li);
    });
}

// Check for daily reset
function checkForDailyReset() {
    const lastSavedDate = localStorage.getItem('lastSavedDate');
    const today = new Date().toDateString();

    if (lastSavedDate !== today) {
        // Clear the tasks if it's a new day
        localStorage.removeItem('tasks');
        document.getElementById('todo-list').innerHTML = '';
    }
}
