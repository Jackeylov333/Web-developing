import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TasksContainer = ({ socket }) => {
    const [tasks, setTasks] = useState({});

    useEffect(() => {
        function fetchTasks() {
            fetch("http://localhost:4000/api")
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setTasks(data);
                });
        }
        fetchTasks();
    }, []);

    

    const handleDragEnd = ({ destination, source }) => {
        if (!destination) return;
        if (
            destination.index === source.index &&
            destination.droppableId === source.droppableId
        )
            return;
    
        socket.emit("taskDragged", {
            source,
            destination,
        });
    };

    useEffect(() => {
        socket.on("tasks", (updatedTasks) => {
            setTasks(updatedTasks);
        });

        socket.on("deleteTask", (deletedTaskData) => {
            setTasks((currentTasks) => {
                const { taskId, category } = deletedTaskData;
                const updatedCategoryTasks = currentTasks[category].items.filter(
                    (task) => task.id !== taskId
                );
                return {
                    ...currentTasks,
                    [category]: {
                        ...currentTasks[category],
                        items: updatedCategoryTasks,
                    },
                };
            });
        });

        // 清理函数，在组件卸载时取消事件监听
        return () => {
            socket.off("tasks");
            socket.off("deleteTask");
        };
    }, [socket]);

    const deleteTask = (taskId, category) => {
        socket.emit("deleteTask", { taskId, category });
    };

    useEffect(() => {
        socket.on("tasks", (data) => setTasks(data));
    }, [socket]);

    return (
        <div className='container'>
            <DragDropContext onDragEnd={handleDragEnd}>
                {Object.entries(tasks).map((task) => (
                    <div
                        className={`${task[1].title.toLowerCase()}__wrapper`}
                        key={task[1].title}
                    >
                        <h3>{task[1].title} Tasks</h3>
                        <div className={`${task[1].title.toLowerCase()}__container`}>
                            <Droppable droppableId={task[1].title}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {task[1].items.map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={item.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`${task[1].title.toLowerCase()}__items`}
                                                    >
                                                        <p>{item.title}</p>
                                                        <p className='comment'>
                                                            <Link to={`/comments/${task[1].title}/${item.id}`}>
                                                                {item.comments.length > 0
                                                                    ? `View Comments`
                                                                    : "Add Comment"}
                                                            </Link>
                                                        </p>
                                                        <button
                                                            className='delete-task-btn'
                                                        
                                                            onClick={() => deleteTask(item.id, task[1].title)}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </div>
                ))}
            </DragDropContext>
        </div>
    );
};

export default TasksContainer;