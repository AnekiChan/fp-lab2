let state = {
    tasks: [],
    filter: 'all'
};

const addTask = (state, text) => ({
    ...state,
    tasks: [...state.tasks, {
        id: Date.now(),
        text: text.trim(),
        completed: false
    }]
});

const toggleTask = (state, id) => ({
    ...state,
    tasks: state.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    )
});

const deleteTask = (state, id) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id)
});

const setFilter = (state, filter) => ({
    ...state,
    filter
});

const filterTasks = (tasks, filter) => {
    const filters = {
        all: () => true,
        active: task => !task.completed,
        completed: task => task.completed
    };
    return tasks.filter(filters[filter]);
};

const dispatch = (action) => {
    switch (action.type) {
        case 'ADD_TASK':
            state = addTask(state, action.payload);
            break;
        case 'TOGGLE_TASK':
            state = toggleTask(state, action.payload);
            break;
        case 'DELETE_TASK':
            state = deleteTask(state, action.payload);
            break;
        case 'SET_FILTER':
            state = setFilter(state, action.payload);
            break;
    }
    render();
};

const render = () => {
    const filteredTasks = filterTasks(state.tasks, state.filter);

    document.getElementById('taskList').innerHTML = filteredTasks
        .map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn">×</button>
            </li>
        `).join('');

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === state.filter);
    });
};

const init = () => {
    document.getElementById('addBtn').addEventListener('click', () => {
        const input = document.getElementById('taskInput');
        if (input.value.trim()) {
            dispatch({ type: 'ADD_TASK', payload: input.value });
            input.value = '';
        }
    });

    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            dispatch({ type: 'ADD_TASK', payload: e.target.value });
            e.target.value = '';
        }
    });

    document.addEventListener('click', (e) => {
        const li = e.target.closest('.task-item');
        if (!li) return;

        const taskId = parseInt(li.dataset.id);

        if (e.target.classList.contains('task-checkbox')) {
            dispatch({ type: 'TOGGLE_TASK', payload: taskId });
        }

        if (e.target.classList.contains('delete-btn')) {
            dispatch({ type: 'DELETE_TASK', payload: taskId });
        }
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            dispatch({ type: 'SET_FILTER', payload: btn.dataset.filter });
        });
    });

    render();
};

document.addEventListener('DOMContentLoaded', init);