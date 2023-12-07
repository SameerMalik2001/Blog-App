import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setVlogId} from '../Redux/reducers.js'


function Saved() {
  let userID = useSelector(state => state.userId)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true)
      await axios.get(`http://localhost:5000/api/users/${userID}`, { userId: userID })
        .then(resp => setUser(resp?.data))
      await axios.get('http://localhost:5000/api/vlogs/')
        .then(response => setData(response.data))
      setIsLoading(false)
    }
    if (userID === '')
      navigate('/signin')
    fetching()
  }, []);

  const clicked = (id) => {
    dispatch(setVlogId(id))
    navigate('/singleVlog')
  }

  console.log(user?.data?.saved, data)
  return (
    <div className="bg-[#373737] flex flex-col justify-start mt-10 mb-10 items-center w-[1270px] min-h-screen">
      <div className='w-[1240px] flex gap-2 mt-5 ml-4 flex-wrap self-start'>
        {
          !isLoading &&
          data?.data?.map(item => {
            if (user.data.saved.includes(item._id)) {
              return <div key={item?._id} onClick={() => clicked(item._id)} className='min-h-[170px] flex flex-col items-center w-[240px] border-2 rounded-lg overflow-hidden'>
                <div className='h-[130px] w-[220px] m-2 rounded-xl overflow-hidden'>
                  <img src={item?.photo} alt="pic" className='h-full w-full object-cover' />
                </div>
                <p className='text-[16px] w-[200px] text-white p-1 break-all text-center'>{item?.title}</p>
              </div>
            }
          })
        }
        {
          !isLoading && user?.data?.saved?.length === 0 && <p className="text-white text-3xl">You do not saved any Vlog yet!</p>
        }
        {
          isLoading && <p className='text-xl text-white'>Loading...</p>
        }
      </div>
    </div>
  );
}

export default Saved;