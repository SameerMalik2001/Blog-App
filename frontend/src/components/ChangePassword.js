import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [status, setStatus] = useState(false)
  const userID = useSelector(state => state.userId)
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const sendData = async () => {
      await axios.put(`http://localhost:5000/api/users/${userID}/changePassword`, {
        oldPassword: oldPassword,
        newPassword:newPassword,
        confirmPassword:confirmNewPassword
      })
      setStatus(true)
    }
    sendData()
  }

  console.log(userID)

  return (
    <div className="bg-gray-200 flex justify-center items-center w-[1270px] h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">Password Change</h2>
        <form onSubmit={(e) => submit(e)}>

          <div className="mb-4">
            <label htmlFor="old password" className="block text-gray-600 font-semibold">Confirm Password</label>
            <input onChange={(e) => setOldPassword(e.target.value)} type="password" id="email" name="email" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>

          <div className="mb-4">
            <label htmlhtmlFor="new password" classNameName="block text-gray-600 font-semibold">Password</label>
            <input onChange={(e) => setNewPassword(e.target.value)} type="password" id="username" name="username" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your username" />
          </div>

          <div className="mb-4">
            <label htmlFor="confirm password" className="block text-gray-600 font-semibold">Confirm Password</label>
            <input onChange={(e) => setConfirmNewPassword(e.target.value)} type="password" id="email" name="email" className="w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Enter your email" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Change</button>
        </form>
        <p class="mt-4 text-center text-gray-600">
          wanna change other details? <Link to="/edit" class="text-blue-500 hover:underline">change</Link>
        </p>

      </div>
      {
        status && navigate('/myprofile')
      }
    </div>
  );
}

export default ChangePassword;