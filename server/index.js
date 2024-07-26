const express = require("express");
const app = express();
const PORT = 4000;
const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
    pending: {
        title: "pending",
        items: [
            {
                id: fetchID(),
                title: "Send the Figma file to Dima",
                comments: [],
            },
        ],
    },
    ongoing: {
        title: "ongoing",
        items: [
            {
                id: fetchID(),
                title: "Review GitHub issues",
                comments: [
                    {
                        name: "David",
                        text: "Ensure you review before merging",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
    completed: {
        title: "completed",
        items: [
            {
                id: fetchID(),
                title: "Create technical contents",
                comments: [
                    {
                        name: "Dima",
                        text: "Make sure you check the requirements",
                        id: fetchID(),
                    },
                ],
            },
        ],
    },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("createTask", (data) => {
        // 👇🏻 Constructs an object according to the data structure
        const newTask = { id: fetchID(), title: data.task, comments: [] };
        // 👇🏻 Adds the task to the pending category
        tasks["pending"].items.push(newTask);
        /* 
        👇🏻 Fires the tasks event for update
         */
        socket.emit("tasks", tasks);
    });

    socket.on('disconnect', () => {
            socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});

socketIO.on("taskDragged", (data) => {
    const { source, destination } = data;

    //👇🏻 Gets the item that was dragged
    const itemMoved = {
        ...tasks[source.droppableId].items[source.index],
    };
    console.log("DraggedItem>>> ", itemMoved);

    //👇🏻 Removes the item from the its source
    tasks[source.droppableId].items.splice(source.index, 1);

    //👇🏻 Add the item to its destination using its destination index
    tasks[destination.droppableId].items.splice(destination.index, 0, itemMoved);

    //👇🏻 Sends the updated tasks object to the React app
    socket.emit("tasks", tasks);

    /* 👇🏻 Print the items at the Source and Destination
        console.log("Source >>>", tasks[source.droppableId].items);
        console.log("Destination >>>", tasks[destination.droppableId].items);
        */
});

socketIO.on("addComment", (data) => {
    const { category, userId, comment, id } = data;
    //👇🏻 Gets the items in the task's category
    const taskItems = tasks[category].items;
    //👇🏻 Loops through the list of items to find a matching ID
    for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].id === id) {
    //👇🏻 Then adds the comment to the list of comments under the item (task)
            taskItems[i].comments.push({
                name: userId,
                text: comment,
                id: fetchID(),
            });
            //👇🏻 sends a new event to the React app
            socket.emit("comments", taskItems[i].comments);
        }
    }
});

socketIO.on("fetchComments", (data) => {
    const { category, id } = data;
    const taskItems = tasks[category].items;
    for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].id === id) {
            socket.emit("comments", taskItems[i].comments);
        }
    }
});

app.get("/api", (req, res) => {
    res.json(tasks);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});