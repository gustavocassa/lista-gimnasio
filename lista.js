document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const body = document.body;
    const themeSwitch = document.getElementById('theme-switch');

    loadTasks(); // Cargar tareas al cargar la página

    addTaskBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
            saveTasksToLocalStorage(); // Guardar las tareas después de agregar una nueva
        }
    });

    function addTask(taskText, checked = false) {
        const li = document.createElement('li');
        li.draggable = true;
        li.className = 'task'; // Added class name
        li.innerHTML = `
            <input type="checkbox">
            <label>${taskText}</label>
            <button class="delete-btn">Eliminar</button>
        `;
        taskList.appendChild(li);

        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.checked = checked;

        checkbox.addEventListener('change', saveTasksToLocalStorage);

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasksToLocalStorage();
        });

        // Añadir listeners de eventos de arrastrar y soltar aquí
        li.addEventListener('dragstart', function(e) {
            draggedTask = li;
            setTimeout(() => {
                li.classList.add('invisible');
            }, 0);
        });

        li.addEventListener('dragend', function(e) {
            li.classList.remove('invisible');
            saveTasksToLocalStorage();
        });

        li.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        li.addEventListener('dragenter', function(e) {
            e.preventDefault();
            if (draggedTask !== null && draggedTask !== li) {
                const taskIndex = Array.from(li.parentNode.children).indexOf(li);
                const draggedIndex = Array.from(li.parentNode.children).indexOf(draggedTask);
                if (draggedIndex < taskIndex) {
                    li.parentNode.insertBefore(draggedTask, li.nextSibling);
                } else {
                    li.parentNode.insertBefore(draggedTask, li);
                }
            }
        });

        li.addEventListener('touchstart', function(e) {
            draggedTask = li;
        });

        li.addEventListener('touchend', function(e) {
            draggedTask = null;
        });

        li.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const touch = e.targetTouches[0];
            if (draggedTask !== null) {
                const taskUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
                if (taskUnderTouch.classList.contains('task')) {
                    const taskIndex = Array.from(li.parentNode.children).indexOf(taskUnderTouch);
                    const draggedIndex = Array.from(li.parentNode.children).indexOf(draggedTask);
                    if (draggedIndex < taskIndex) {
                        li.parentNode.insertBefore(draggedTask, taskUnderTouch.nextSibling);
                    } else {
                        li.parentNode.insertBefore(draggedTask, taskUnderTouch);
                    }
                }
            }
        });
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTask(task.text, task.checked);
        });
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('label').textContent,
                checked: li.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    themeSwitch.addEventListener('change', function() {
        body.classList.toggle('dark-theme');
        localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
    });

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        body.classList.add('dark-theme');
    }
});
