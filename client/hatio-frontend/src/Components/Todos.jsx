import React, { useEffect, useMemo, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";
import { TiPencil } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

const Todos = ({ project }) => {
  const [todoList, settodoList] = useState([]);
  const userId = localStorage.getItem("user_id");
  // console.log(todoList)
  const [error, setError] = useState(null);

  const pendingTodos = useMemo(() => {
    return project.todos.filter((item) => item.status === false);
  }, [todoList]);

  const completedTodos = useMemo(() => {
    return project.todos.filter((item) => item.status === true);
  }, [todoList]);

  const [toolTip, settoolTip] = useState("");
  const [modal, setmodal] = useState(false);

  const [editModalOpen, seteditModalOpen] = useState(false);
  const [currentlyEditing, setcurrentlyEditing] = useState(null);

  const TodoModal = () => {
    const [newTodoValue, setnewTodoValue] = useState("");
    const [newTodoDesc, setnewTodoDesc] = useState("");

    const handleAddNewTodo = async () => {
      const project_id = project.id;
      const body = {
        task: newTodoValue,
        description: newTodoDesc,
      };
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/todos/${project_id}/`,
          body
        );
        console.log(response);
        if ((response.data.message = "Todo updated successfully")) {
          seteditModalOpen(false);
        }
      } catch (error) {
        setError("error");
      }

      const updatedTodo = [
        ...todoList,
        {
          id: todoList.length + 1,
          name: newTodoValue,
          description: newTodoDesc,
          status: false,
        },
      ];
      settodoList(updatedTodo);
      setnewTodoValue("");
      setnewTodoDesc("");
      setmodal(false);
    };

    return (
      <div className="absolute w-screen h-screen flex items-center justify-center bg-transparent backdrop-blur-sm">
        <div className="h-fit py-7 px-10 flex flex-col items-center justify-center gap-4 w-[30rem] shadow-2xl bg-slate-200 rounded-xl">
          <div className="w-full h-3 flex items-center justify-end">
            <IoIosCloseCircle
              className="text-xl text-red-600 cursor-pointer"
              onClick={() => setmodal(false)}
            />
          </div>
          <input
            placeholder="Enter task name"
            className="w-[25rem] placeholder:text-xs p-1"
            type="text"
            value={newTodoValue}
            onChange={(e) => setnewTodoValue(e.target.value)}
          />
          <textarea
            placeholder="Enter task description"
            className="w-[25rem] placeholder:text-xs p-1"
            name=""
            value={newTodoDesc}
            id=""
            onChange={(e) => setnewTodoDesc(e.target.value)}
          ></textarea>
          <button
            onClick={() => handleAddNewTodo()}
            className="w-full h-10 bg-teal-400 rounded-xl"
          >
            ADD TASK
          </button>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    const [newValue, setnewValue] = useState("");
    const [newDesc, setnewDesc] = useState("");

    //EDIT todo API CALL
    const editTodo = async () => {
      const body = {
        task: newValue,
        description: newDesc,
      };

      const project_id = project.id;
      const sequential_number = currentlyEditing.sequential_number;
      console.log(body);
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/todos_edit/${project_id}/${sequential_number}/`,
          body
        );
        console.log(response);
        if ((response.data.message = "Todo updated successfully")) {
          seteditModalOpen(false);
        }
      } catch (error) {
        setError("error");
      }
    };

    return (
      <div className="absolute w-screen h-screen flex items-center justify-center bg-transparent backdrop-blur-sm">
        <div className="h-fit py-7 px-10 flex flex-col items-center justify-center gap-4 w-[30rem] shadow-2xl bg-slate-200 rounded-xl">
          <div className="w-full h-3 flex items-center justify-end">
            <IoIosCloseCircle
              className="text-xl text-red-600 cursor-pointer"
              onClick={() => seteditModalOpen(false)}
            />
          </div>
          <input
            placeholder={currentlyEditing.task}
            className="w-[25rem] placeholder:text-xs p-1"
            type="text"
            value={newValue}
            onChange={(e) => setnewValue(e.target.value)}
          />
          <textarea
            placeholder={currentlyEditing.description}
            className="w-[25rem] placeholder:text-xs p-1"
            name=""
            value={newDesc}
            id=""
            onChange={(e) => setnewDesc(e.target.value)}
          ></textarea>
          <button
            onClick={() => editTodo()}
            className="w-full h-10 bg-teal-400 rounded-xl"
          >
            ADD TASK
          </button>
        </div>
      </div>
    );
  };

  //Status changing API CALL
  const handleToggle = async (sequential_number, task, description, status) => {
    const body = {
      task: task,
      description: description,
      status: !status,
    };

    const project_id = project.id;
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/todos_edit/${project_id}/${sequential_number}/`,
        body
      );
      console.log(response);
      if ((response.data.message = "Todo updated successfully")) {
        location.reload();
      }
    } catch (error) {
      setError("error");
    }
  };

  //Todo delete API call
  const deleteTodo = async (sequential_number, task, description) => {
    const body = {
      task: task,
      description: description,
    };
    const project_id = project.id
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/todo_delete/${project_id}/${sequential_number}/`,
        body
      );
      if (response){
        alert("Deleted")
        location.reload()
      }
    } catch (error) {}
  };


  const deleteProject = async () =>{
    const id = project.id
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/projects/${userId}/${id}/`
        
      );
      if (response.data.message  == "Project deleted"){
           location.reload()
      }
    } catch (error) {
      
    }
  } 

  return (
    <>
      <div className="relative">
        {modal && <TodoModal />}
        {editModalOpen && <EditModal />}
        <div className=" border-gray-700 rounded-xl h-[21rem]  shadow-2xl w-[20rem] px-4 py-3 bg-slate-200">
          <div className="w-full flex items-center justify-between pr-1">
            <h1 className="text-3xl font-bold text-left ">{project.project}</h1>
            <div className="flex gap-1">
            <CiCirclePlus onClick={() => setmodal(true)} className="text-3xl" />
              <MdDelete onClick={()=>deleteProject()} className="text-3xl"/>
            </div>
          </div>
          <div className="w-full h-[1px] mt-2 bg-black"></div>
          <div className="h-fit pb-4 mt-2 rounded-xl w-full">
            <h1>
              <span className="font-bold">Summary:</span>{" "}
              {completedTodos.length}/{project.todos.length} todos completed
            </h1>
            <div>
              <h1 className="text-xl font-bold mt-4">Pending</h1>
              <div className="max-h-[5.5rem] h-fit overflow-y-auto">
                {!pendingTodos.length ? (
                  <h1>No pending todos!</h1>
                ) : (
                  pendingTodos.map((item,ind) => (
                    <div key={ind} className="mt-1">
                      <div className="flex justify-between">
                        <div className="flex gap-1 items-center">
                          <input
                            onClick={() =>
                              handleToggle(
                                item.sequential_number,
                                item.task,
                                item.description,
                                item.status
                              )
                            }
                            defaultChecked={item.status}
                            type="checkbox"
                          />{" "}
                          <h1>{item.task}</h1>
                        </div>
                        <div className="flex gap-1">
                          <TiPencil
                            onClick={() => [
                              seteditModalOpen(true),
                              setcurrentlyEditing(item),
                            ]}
                          />
                          <MdDelete
                            onClick={() =>
                              deleteTodo(
                                item.sequential_number,
                                item.task,
                                item.description
                              )
                            }
                          />
                        </div>
                      </div>
                      <h1
                        onMouseEnter={() => settoolTip(item.id)}
                        onMouseLeave={() => settoolTip()}
                        className="text-[10px] pl-4 truncate"
                      >
                        {item.description}
                      </h1>
                    </div>
                  ))
                )}
              </div>
              <h1 className="text-xl font-bold mt-5">Completed</h1>
              <div className="max-h-[5.5rem] h-fit overflow-y-auto">
                {!completedTodos.length ? (
                  <h1>No completed todos!</h1>
                ) : (
                  completedTodos.map((item,ind) => (
                    <div key={ind} className="mt-1">
                      <div className="flex gap-1 items-center">
                        <input
                          onClick={() =>
                            handleToggle(
                              item.sequential_number,
                              item.task,
                              item.description,
                              item.status
                            )
                          }
                          defaultChecked={item.status}
                          type="checkbox"
                        />{" "}
                        <h1>{item.task}</h1>
                      </div>
                      <h1 className="text-[10px] pl-4 truncate">
                        {item.description}
                      </h1>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todos;
