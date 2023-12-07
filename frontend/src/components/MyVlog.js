import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setVlogId } from '../Redux/reducers.js';

function Home() {
  const userID = useSelector(state => state.userId)

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const [hai, setHai] = useState(false)
  const navigate = useNavigate()

  const vlogClick = (id) => {
    dispatch(setVlogId(id))
    navigate('/singleVlog')
  }

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true)
      await axios.get('http://localhost:5000/api/vlogs/sort/newest')
        .then(response => setData(response.data))
      setIsLoading(false)
    }
      fetching()
  }, []);

  return (
    <div className='flex w-[1270px] flex-col mt-5 items-center gap-10'>

      <div className='flex gap-3 mt-5 ml-4 flex-wrap self-start'>
        {
          isLoading && <p className='text-2xl text-white'>Loading...</p>
        }
        {
          !isLoading &&
          data?.data?.map(item => {
            if (userID === item?.userId) {
              return <div key={item?._id} onClick={() => vlogClick(item?._id)} className='min-h-[170px] flex flex-col items-center w-[240px] border-2 rounded-lg overflow-hidden'>
                <div className='h-[130px] w-[220px] m-2 rounded-xl overflow-hidden'>
                  <img src={item?.photo} alt="pic" className='h-full w-full object-cover' />
                </div>
                <p className='text-[16px] w-[200px] text-white p-1 break-all text-center'>{item?.title}</p>
              </div>
            }
          })
        }
      </div>
    </div>
  );
}

export default Home;
