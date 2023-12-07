import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setUserId } from "../Redux/reducers.js";

function Signin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submit = (e) => {
    e.preventDefault()
    const sendData = async () => {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        username: username,
        password: password
      })
      if (res?.data?.data?._id) {
        setStatus(true)
        dispatch(setUserId(res?.data?.data?._id))
      }
    }
    sendData()
  }

  return (
    <div className="bg-gray-200 flex justify-center items-center w-[1270px] h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={(e) => submit(e)}>
          <div className="mb-4">
            <label htmlhtmlFor="username" classNameName="block text-gray-600 font-semibold">Username</label>
            <input onChange={(e)=>setUsername(e.target.value)} type="text" id="username" name="username" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your username" />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-semibold">Password</label>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" id="password" name="password" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Sign In</button>
        </form>
        <p class="mt-4 text-center text-gray-600">
          Don't have an account? <Link to="/signup" class="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
      {
        status && navigate('/')
      }
    </div>
  );
}

export default Signin;