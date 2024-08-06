import React from 'react'

const RegisterForm = () => {
  return (
    <div>
        <div className="border-dashed border-gray-700 rounded-xl p-8 mx-auto mt-40 shadow-2xl max-w-md bg-slate-200">
      <form action="">
        <h1 className="text-2xl font-bold mb-4 ">Register</h1>
        <div className="mb-4">
          <input type="email" name="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"  placeholder="Email" required />
        </div>
        <div className="">
          <input type="password" name="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-cyan-500"  placeholder="Password" required />
        </div>

        <button type="submit" className=" mt-4 w-full bg-cyan-700 text-white py-2 rounded-lg hover:bg-cyan-900">Login</button>
        <div className="">
          <p className="mt-4 text-cyan-500 cursor-pointer text-center">
            Don't have an account? <a className="text-black" href="#">Register</a>
          </p>
        </div>
      </form>
    </div>
    </div>
  )
}

export default RegisterForm