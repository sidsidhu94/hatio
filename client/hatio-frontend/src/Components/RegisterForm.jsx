import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/");
  };

  const [formData, setformData] = useState({
    name: "",
    email: "",
    mobilenumber: "",
    password: "",
  });
  const handleInput = (event) => {
    const { name, value } = event.target
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const [confirmpassword, setconfirmpassword] = useState("")

  const handleSubmit = async (e)  => {
    e.preventDefault()
    if (confirmpassword === formData.password) {
      console.log("Passwords match, proceeding with registration");
      try {
          console.log("Sending request to the server with formData:", formData);
          console.log(formData);
          const data = {...formData}
          const response = await axios.post('http://127.0.0.1:8000/api/register/',data);
          console.log(response)
          if (response.data.message === "succes"){
            navigate('/')
          }
          
          // Handle successful registration (e.g., redirect or display a success message)
      } catch (error) {
          console.error('Error during registration:', error);
          // Handle error (e.g., display error message)
      }
  } else {
      alert("Password mismatch!");
  }
  }

  return (
    <div>
      <div className="border-dashed border-gray-700 rounded-xl p-8 mx-auto mt-40 shadow-2xl max-w-md bg-slate-200">
        <form action="">
          <h1 className="text-2xl font-bold mb-4 ">Register</h1>
          <div className="mb-4">
            <input
              onChange={(e)=>handleInput(e)}
              value={formData.name}
              type="text"
              name="name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Name"
              required
            />
          </div>
          <div className="mb-4">
            <input
              onChange={handleInput}
              type="email"
              value={formData.email}
              name="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-4">
            <input
              onChange={handleInput}
              value={formData.mobilenumber}
              type="text"
              name="mobilenumber"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Mobile Number"
              required
            />
          </div>
          <div className="mb-4">
            <input
              onChange={handleInput}
              value={formData.password}
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Password"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={confirmpassword}
              onChange={(e)=>setconfirmpassword(e.target.value)}
              name="confirmpassword"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="button"
            onClick={(e)=>handleSubmit(e)}
            className=" mt-4 w-full bg-cyan-700 text-white py-2 rounded-lg hover:bg-cyan-900"
          >
            Register
          </button>
          <div className="">
            <p className="mt-4 text-cyan-500 cursor-pointer text-center">
              Already Registered?{" "}
              <a onClick={handleLoginClick} className="text-black" href="#">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
