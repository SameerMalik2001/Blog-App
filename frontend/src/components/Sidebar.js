import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setUserId } from '../Redux/reducers.js'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  let userID = useSelector(state => state.userId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logout = () => {
    dispatch(setUserId(''))
    navigate('/')
  }

  return (
    <div className='min-h-screen w-64 border-r-[1px]'>
      <Link to='/' className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-10 flex justify-start items-center'>
        <div>Home</div>
      </Link>
      {
        userID.length > 0 &&
        <>
          <Link to='/myprofile' className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-2 flex justify-start items-center'>
            <div>My Profile</div>
          </Link>
          <Link to='/create' className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-2 flex justify-start items-center'>
            <div>Create</div>
          </Link>
          <Link to='/myvlog' className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-2 flex justify-start items-center'>
            <div>My Vlogs</div>
          </Link>
          <Link to='/saved' className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-2 flex justify-start items-center'>
            <div>Saved</div>
          </Link>
          <div onClick={() => logout()} className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-2 flex justify-start items-center'>
            <div>Logout</div>
          </div>
        </>
      }
      {
        userID.length === 0 &&
        <Link to='/Signin' className='text-gray-300 border-[1px] border-gray-400 hover:bg-gray-600 font-[300] rounded-lg mr-4 px-2 py-2 ml-4 text-3xl mt-2 flex justify-start items-center'>
          <div>Sign In</div>
        </Link>
      }
    </div>
  );
}

export default Sidebar;
