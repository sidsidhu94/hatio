import React, { useState, useEffect } from "react";
import Todos from "../Components/Todos";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosCloseCircle } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { useNavigate } from "react-router";

const Todo = () => {
  const navigate = useNavigate()
  const [todoList, settodoList] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const token = localStorage.getItem("refresh");
    

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/projects/${userId}/`)
      .then((response) => {
        settodoList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError(error);
      });
  }, []);
  console.log(todoList);

  const [showModal, setshowModal] = useState(false)


  const handleLogout = () =>{
    localStorage.clear()
    navigate('/')
  }


  const ProjectAdd = () => {
    const [value, setvalue] = useState("")

    const addProject = async () => {
      
      const data = {
        "user":userId,
        "project":value
      }
      
    try {
      
      const response = await axios.post(`http://127.0.0.1:8000/api/project_add/${userId}/`,data)
      if (response){
        location.reload()
      }
      
      
    } catch (error) {
      alert(error)
    }
    }


    return (
      <div className="absolute z-50 w-screen h-screen flex items-center justify-center bg-transparent backdrop-blur-sm">
        <div className="h-fit py-7 px-10 flex flex-col items-center justify-center gap-4 w-[30rem] shadow-2xl bg-slate-200 rounded-xl">
          <div className="w-full h-3 flex items-center justify-end">
            <IoIosCloseCircle
              className="text-xl text-red-600 cursor-pointer"
              onClick={() => setshowModal(false)}
            />
          </div>
          <input
            placeholder="Enter Project Name"
            className="w-[25rem] placeholder:text-xs p-1"
            type="text"
            value={value}
            onChange={(e) => setvalue(e.target.value)}
          />
          <button
            onClick={() => addProject()}
            className="w-full h-10 bg-teal-400 rounded-xl"
          >
            ADD PROJECT
          </button>
        </div>
      </div>
    )
  }

  

  return (
    <>
    {showModal && (
      <div className="relative">
        <ProjectAdd/>
      </div>
    )}
    <div className="w-scrreen flex flex-wrap justify-start gap-8 px-6 py-4">
      <div className="w-full h-20 rounded-xl bg-teal-400 flex justify-between items-center gap-2 px-5">
        <h1 className="text-3xl font-bold">ToDo</h1>
        <div className="flex justify-center items-center gap-6">
          <div className="flex justify-center items-center gap-1">
          <h1 className="text-xl font-medium">ADD PROJECT</h1>
          <CiCirclePlus onClick={()=>setshowModal(true)} className="text-2xl"/>
          </div>
          <div onClick={()=>handleLogout()} className="flex justify-center items-center gap-1">
          <h1 className="text-xl font-medium">LOGOUT</h1>
          <HiOutlineLogout className="text-2xl"/>
          </div>
        </div>
      </div>
      {error && <p>{error.message}</p>}
      {todoList.map((project,ind) => (
        <Todos key={ind} project={project} />
      ))}
    </div>
    </>
  );
};

export default Todo;
