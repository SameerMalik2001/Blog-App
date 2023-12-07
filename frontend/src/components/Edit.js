import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { setUserId } from "../Redux/reducers.js";

function Edit() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(false)
  const userID = useSelector(state=>state.userId)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const sendData = async () => {
      const res = await axios.put(`http://localhost:5000/api/users/${userID}/update`, {
        username: username,
        email: email
      })
      setStatus(true)
    }
    sendData()
  }

  return (
    <div className="bg-gray-200 mb-10 mt-5 flex justify-center items-center w-[1270px] h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">Edit</h2>
        <form onSubmit={(e) => submit(e)}>
          <div className="mb-4">
            <label htmlhtmlFor="username" classNameName="block text-gray-600 font-semibold">Username</label>
            <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your username" />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 font-semibold">Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Save</button>
        </form>
        <p class="mt-4 text-center text-gray-600">
          wanna change password? <Link to="/changePassword" class="text-blue-500 hover:underline">change</Link>
        </p>

      </div>
      {
        status && navigate('/myprofile')
      }
    </div>
  );
}

export default Edit;