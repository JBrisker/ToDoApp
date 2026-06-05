const tableBody = document.getElementById("taskTable");

const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
const page = window.location.pathname;

if (page.endsWith("index.html")) DisplayTask();
if (page.endsWith("updateTask.html")) PopulateUpdatePage();

tableBody.addEventListener("click", (e) => {
  const tr = e.target.closest("tr");
  if (!tr) return;
  const previous = tableBody.querySelector(".selected");
  if (previous) previous.classList.remove("selected");

  tr.classList.add("selected");
});

//progress tasks with double clicks
tableBody.addEventListener("dblclick", (e) => {
  const tableRow = e.target.closest("tr");
  if (!tableRow) return;

  const index = Array.from(tableBody.children).indexOf(tableRow);

  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

  //change task status based on previous status
  if (taskList[index].status === "Completed") {
    tableRow.classList.remove("completed");
    taskList[index].status = "Not Started";
  } else if (taskList[index].status === "Not Started") {
    taskList[index].status = "In Progress";
  } else if (taskList[index].status === "In Progress") {
    tableRow.classList.add("completed");
    taskList[index].status = "Completed";
  } else if (taskList[index].status === "Completed") {
    tableRow.classList.remove("completed");
    taskList[index].status = "In Progress";
  }
  location.reload();
  // re-save task list
  localStorage.setItem("taskList", JSON.stringify(taskList));
});

/* A function written to populate the table
with the tasks saved in localStorage
param: newRow,newTask,newPriority,newStatus,taskItem
return:
*/
function DisplayTask() {
  tableBody.innerHTML = "";
  //create table row
  for (let taskItem of taskList) {
    const newRow = document.createElement("tr");
    const newTask = document.createElement("td");
    const newPriority = document.createElement("td");
    const newStatus = document.createElement("td");

    //add content
    newTask.textContent = taskItem.task;
    newPriority.textContent = taskItem.priority;
    newStatus.textContent = taskItem.status;

    try {
      newRow.appendChild(newTask);
      newRow.appendChild(newPriority);
      if (taskItem.status === "Completed") {
        newRow.classList.add("completed");
      }
      newRow.appendChild(newStatus);
      switch (taskItem.priority) {
        case "High":
          newRow.style.color = "#FB4141";
          break;
        case "Medium":
          newRow.style.color = "#FF9B2F";
          break;
        case "Low":
          newRow.style.color = "#78C841";
          break;
      }
      tableBody.appendChild(newRow);
    } catch (e) {
      console.error(e.message);
      return;
    }
  }
}

/*function used to create new tasks
and append to list listen for add click
params:taskName,priority,status
return:
*/
function AddTask() {
  const taskName = document.getElementById("tname").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const status = document.getElementById("taskStatus").value;
  //ensure input is valid
  if (taskName === "") {
    alert("Enter a task");
    return;
  }
  //create new task
  let newTask = {
    task: taskName,
    priority: priority,
    status: status,
  };
  if (taskList.some((task) => task.task === taskName)) {
    alert("Task already exists");
    return;
  }
  taskList.push(newTask);
  alert("Task Added");
  //save to local storage
  localStorage.setItem("taskList", JSON.stringify(taskList));
}

/* function to delete tasks from list*/
function DeleteTask() {
  const selected = tableBody.querySelector(".selected");
  if (!selected) {
    alert("Select task to delete");
    return;
  }
  //find index of selected row
  const index = Array.from(tableBody.children).indexOf(selected);
  //remove task
  taskList.splice(index, 1);
  // re-save task list
  localStorage.setItem("taskList", JSON.stringify(taskList));
  tableBody.innerHTML = "";
  DisplayTask();
}

// function to select which task to update
function UpdateTask() {
  //get selected task
  const selected = tableBody.querySelector(".selected");

  if (!selected) {
    alert("Select task to update");
    return;
  }
  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];
  const index = Array.from(tableBody.children).indexOf(selected);
  //save task information in local storage
  localStorage.setItem("taskItem", JSON.stringify(taskList[index]));
  //navigate to update page
  window.location.href = "updateTask.html";
}

//populate update page with selected task information
function PopulateUpdatePage() {
  const taskItem = JSON.parse(localStorage.getItem("taskItem"));

  // populate update page with task information
  const taskInput = document.getElementById("task");
  taskInput.value = taskItem.task;

  const priorityInput = document.getElementById("priority");
  priorityInput.value = taskItem.priority;

  const statusInput = document.getElementById("status");
  statusInput.value = taskItem.status;

  // save task information in local storage for use in SaveTask function
  localStorage.setItem("taskToUpdate", JSON.stringify(taskItem));
}

//save updated task information in place of old task information
function SaveTask() {
  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

  //updated task information
  const updatedTask = {
    task: document.getElementById("task").value.trim(),
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
  };

  const taskToUpdate = JSON.parse(localStorage.getItem("taskToUpdate"));

  //find index of task to update
  if (updatedTask.task === "") {
    alert("Task name cannot be empty");
    return;
  }
  if (taskToUpdate.task === null) {
    alert("Task not found");
    return;
  }
  const index = taskList.findIndex((task) => task.task === taskToUpdate.task);
  if (index === -1) {
    alert("Task not found");
    return;
  }

  taskList[index] = updatedTask;

  //remove updated task object from local storage

  localStorage.removeItem("taskToUpdate");

  //save updated task list to local storage
  localStorage.setItem("taskList", JSON.stringify(taskList));

  //navigate back to main page
  window.location.href = "index.html";
}

//clear list
function ClearTasks() {
  if (taskList.length === 0) {
    alert("Nothing to Clear!");
    return;
  }
  taskList.length = 0;
  localStorage.clear();
  alert("Tasks Cleared");
  taskTable.innerHTML = "";
}

function SortTasks() {
  const sortSelection = document.getElementById("sort").value;
  switch (sortSelection) {
    case "Alphabetical":
      SortAlpha();
      break;
    case "Priority":
      SortPriority();
      break;
    case "Status":
      SortStatus();
      break;
  }
  location.reload();
}
//AI generated sorting function to sort by alphabet
function SortAlpha() {
  taskList.sort((a, b) => a.task.localeCompare(b.task));
  localStorage.setItem("taskList", JSON.stringify(taskList));
  location.reload();
}

// function created to sort by priority
function SortPriority() {
  const priorityOptions = { High: 3, Medium: 2, Low: 1 };
  taskList.sort(
    (a, b) => priorityOptions[b.priority] - priorityOptions[a.priority],
  );
  localStorage.setItem("taskList", JSON.stringify(taskList));
  location.reload();
}

//AI generated function to sort by status
function SortStatus() {
  const statusOptions = { "Not Started": 1, "In Progress": 2, Completed: 3 };
  taskList.sort((a, b) => statusOptions[a.status] - statusOptions[b.status]);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  location.reload();
}
