import update from "immutability-helper";
import { useCallback, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";



import styles from "./kanban.module.scss";

const tasksList = [
  {
    _id: 1,
    title: "First Task",
    description: "2 Gallons of milk at the Deli store",
    status: "ready"
  },
  { _id: 2, title: "Second Task", description: "Welcome", status: "ready" },
  { _id: 3, title: "Third Task", description: "2 Gallons of milk at the Deli store", status: "ready" },
  { _id: 4, title: "Fourth Task", description: "2 Gallons of milk at the Deli store", status: "Progress" },
  { _id: 5, title: "Fifth Task", description: "2 Gallons of milk at the Deli store", status: "Progress" },
  { _id: 6, title: "Sixth Task", description: "2 Gallons of milk at the Deli store", status: "Progress" },
  { _id: 7, title: "Seventh Task", description: "2 Gallons of milk at the Deli store", status: "review" },
  { _id: 8, title: "Eighth Task", description: "2 Gallons of milk at the Deli store", status: "review" },
  { _id: 9, title: "Ninth Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 10, title: "Tenth Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 11, title: "Eleventh Task", description: "2 Gallons of milk at the Deli store", status: "ready" },
  { _id: 12, title: "twelfth Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 13, title: "thirteen Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 14, title: "fourteen Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 15, title: "fifteen Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 16, title: "sixteen Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 17, title: "seventeen Task", description: "2 Gallons of milk at the Deli store", status: "completed" },
  { _id: 18, title: "eighteen Task", description: "2 Gallons of milk at the Deli store", status: "completed" }

];

const channels = ["ready", "Progress", "review", "completed", "Blocked"];
const labelsMap = {
  ready: "Ready",
  Progress: "In Progress",
  review: "Review",
  Blocked: "blocked",
  Repeat: "repeat",
  completed: "Completed"
};

const classes = {
  board: {
    display: "flex",
    justifyContent: "center",
    fontFamily: 'Arial, "Helvetica Neue", sans-serif'
  },
  column: {
    minWidth: 200,
    width: "18vw",
    height: "80vh",
    margin: "0 auto",
    borderRight: "4px solid white",
    backgroundColor: "#FCC8B2"
  },
  columnHead: {
    textAlign: "center",
    padding: 10,
    fontSize: "1.4em",
    backgroundColor: "#C6D8AF"
  },
  item: {
    padding: 10,
    margin: 10,
    fontSize: "1em",
    cursor: "grab",
    borderRadius: "10px",
    backgroundColor: "#fff"


  },
  itemTitle: {
    fontSize: "1.2em",
    fontWeight: "500"
  }
};
const Index = () => {
  const [tasks, setTaskStatus] = useState(tasksList);

  const changeTaskStatus = useCallback(
    (id, status) => {
      let task = tasks.find((task) => task._id === id);
      const taskIndex = tasks.indexOf(task);
      task = { ...task, status };
      let newTasks = update(tasks, {
        [taskIndex]: { $set: task }
      });
      setTaskStatus(newTasks);
    },
    [tasks]
  );

  return (
    <main>

      <DndProvider backend={HTML5Backend}>
        <section style={classes.board}>
          {channels.map((channel) => (
            <KanbanColumn
              key={channel}
              status={channel}
              changeTaskStatus={changeTaskStatus}
            >
              <div style={classes.column} className={styles.col}>
                <div style={classes.columnHead}>{labelsMap[channel]}</div>
                <div>
                  {tasks
                    .filter((item) => item.status === channel)
                    .map((item) => (
                      <KanbanItem key={item._id} id={item._id}>
                        <div style={classes.item}>
                          <h2 style={classes.itemTitle}>{item.title}</h2>
                          <p className={styles.disc}>{item.description}</p>
                          <hr />
                          <p >Status : <span className={styles.disc}>{item.status}</span></p>
                        </div>
                      </KanbanItem>
                    ))}
                </div>
              </div>
            </KanbanColumn>
          ))}
        </section>
      </DndProvider>
    </main>
  );
};



const KanbanColumn = ({ status, changeTaskStatus, children }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "card",
    drop(item) {
      changeTaskStatus(item.id, status);
    }
  });
  drop(ref);
  return <div ref={ref}> {children}</div>;
};

const KanbanItem = ({ id, children }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id },
    type: "card",
    collect: (monitor) => ({
      // isDragging: !!monitor.isDragging()
      isDragging: monitor.isDragging()
    })
  });

  // ===========================================================
  // Old version DnD

  // const [{ isDragging }, dragRef] = useDrag({
  //   item: { type: "card", id },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging()
  //   })
  // });
  // ===========================================================

  const opacity = isDragging ? 0 : 1;

  // const cardDragStyle = isDragging ? `opacity: 0;` : `opacity:1`;


  drag(ref);
  return (
    <div ref={ref} style={{ opacity }}>
      {children}
    </div>
  );
};
export default Index;