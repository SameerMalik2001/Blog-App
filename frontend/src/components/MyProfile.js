import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUserId } from '../Redux/reducers.js'

function MyProfile() {
  let userID = useSelector(state => state.userId)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [s, setS] = useState(false)

  useEffect(() => {
    const fetching = async () => {
      await axios.get(`http://localhost:5000/api/users/${userID}`)
        .then(resp => setUser(resp?.data))
    }
    fetching()
  }, [s]);

  const delete_user = async () => {
    await axios.delete(`http://localhost:5000/api/vlogs/${userID}/delete`)
    dispatch(setUserId(''))
    navigate('/')
  }

  const editUser = () => {
    navigate('/edit')
  }

  const changePhoto = async (e) => {
    const file = e.target.files[0]
    console.log(file)
    await axios.put(`http://localhost:5000/api/users/${userID}/update`, {
      avatar: file
    },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    setS(p=>!p)
  }

  return (
    <div className="bg-[#373737] w-[1270px] items-center mb-10 gap-5 mt-10 flex flex-col">
      <div className="w-[800px] border-[1px] border-gray-300 items-center pt-6 justify-around rounded-3xl flex flex-col gap-8 pb-6">
        <div className="h-80 w-80 rounded-full bg-gray-500 flex justify-center items-center">
          <img src={user?.data?.avatar} alt="pic" className="h-80 w-80 rounded-full object-fill overflow-hidden"/>
        </div>
        <div className="flex w-full gap-5 justify-center">

          <button className="p-2 justify-center items-center flex w-[300px] rounded-xl text-white font-semibold bg-green-600">
            <input type="file" className=" w-full h-full" onChange={(e) => changePhoto(e)} />
          </button>
          <button className="p-2 w-[300px] rounded-xl text-white font-semibold bg-red-600" onClick={() => delete_user()}>Delete ID</button>
        </div>
      </div>

      <div className="w-[800px] border-[1px] p-5 border-gray-300 gap-6 rounded-3xl flex flex-col">
        <div className="flex w-full justify-between items-center">
          <p className="text-xl text-gray-300">Username </p>
          <p className="text-xl min-w-[300px] rounded-2xl text-center border-[1px] border-gray300 text-gray-300 p-[2px]">{user?.data?.username}</p>
        </div>

        <div className="flex w-full justify-between items-center">
          <p className="text-xl text-gray-300">Email ID </p>
          <p className="text-xl min-w-[300px] rounded-2xl text-center border-[1px] border-gray300 text-gray-300 p-[2px]">{user?.data?.email}</p>
        </div>

        <button className="p-2 rounded-xl text-white font-semibold bg-green-600" onClick={() => editUser()}>Edit</button>
      </div>

    </div>
  );
}

export default MyProfile;