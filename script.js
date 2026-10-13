
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const emptyMessage = document.getElementById("emptyMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counts
function updateCounts() {
    const completed = tasks.filter(task => task.done).length;

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = tasks.length - completed;
}

// Display tasks based on search and filter
function displayTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();
    const filterValue = filterSelect.value;

    const filteredTasks = tasks
        .map((task, index) => ({ ...task, index }))
        .filter(task => task.name.toLowerCase().includes(searchText))
        .filter(task => {
            if (filterValue === "pending") {
                return !task.done;
            }

            if (filterValue === "completed") {
                return task.done;
            }

            return true;
        });

    filteredTasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Mark task completed");

        checkbox.addEventListener("change", function () {
            tasks[task.index].done = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const text = document.createElement("span");
        text.className = task.done ? "task-name done" : "task-name";
        text.textContent = task.name;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            tasks.splice(task.index, 1);
            saveTasks();
            displayTasks();
        });

        li.append(checkbox, text, deleteButton);
        taskList.appendChild(li);
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    updateCounts();
}

// Add a task
function addTask() {
    const name = taskInput.value.trim();

    if (name === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        name: name,
        done: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
    taskInput.focus();
}

// Add button click
addButton.addEventListener("click", addTask);

// Press Enter to add a task
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Search tasks as you type
searchInput.addEventListener("input", displayTasks);

// Filter tasks
filterSelect.addEventListener("change", displayTasks);

// Show saved tasks when page opens
displayTasks();
