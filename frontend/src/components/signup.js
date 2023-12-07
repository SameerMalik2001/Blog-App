import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setUserId } from "../Redux/reducers.js";

function Signup() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const sendData = async () => {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        username: username,
        password: password,
        email: email
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
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <form onSubmit={(e) => submit(e)}>
          <div className="mb-4">
            <label htmlFor="username" classNameName="block text-gray-600 font-semibold">Username</label>
            <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your username" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-semibold">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-semibold">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Sign Up</button>
        </form>
        <p class="mt-4 text-center text-gray-600">
          If You have an account? <Link to="/signin" class="text-blue-500 hover:underline">Sign In</Link>
        </p>
      </div>
      {
        status && navigate('/')
      }
    </div>
  );
}

export default Signup;