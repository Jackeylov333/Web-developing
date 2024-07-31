import React, { useState } from "react";

const AddTask = ({ socket }) => {
    const [task, setTask] = useState("");

    const handleAddTodo = (e) => {
        e.preventDefault();
        //👇🏻 sends the task to the Socket.io server
        socket.emit("createTask", { task });
        setTask("");
    };
    return (
        <form className='form__input' onSubmit={handleAddTodo}>
            <label htmlFor='task'>添加待办项</label>
            <input
                type='text'
                name='task'
                id='task'
                value={task}
                className='input'
                required
                onChange={(e) => setTask(e.target.value)}
            />
            <button className='addTodoBtn'>添加</button>
        </form>
    );
};

export default AddTask;