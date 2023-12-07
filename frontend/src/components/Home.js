import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setVlogId} from '../Redux/reducers.js'
import {useNavigate} from 'react-router-dom'

function Home() {
  const cat = ['travel', 'lifestyle', 'fashion', 'fitness', 'health', 'technology', 'gaming', 'sport', 'food',
    'family', 'education', 'craft', 'business', 'enterpreneurship', 'music', 'animal', 'pet', 'science',
    'motivation', 'enterntainment', 'environment', 'art', 'dance', 'social issue', 'coding', 'wedding',
    'car', 'bike', 'hip-hop', 'product']
  const sor = ['popular', 'liked', 'disliked', 'newest', 'oldest']
  const sor_temp = ["most popular", 'most liked', 'most disliked', 'newest', 'oldest']
  const [cats, setCats] = useState('')
  const [sors, setSors] = useState('popular')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const vlogClick = (id)=>{
    dispatch(setVlogId(id))
    navigate('/singleVlog')
  }

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true)
      await axios.get('http://localhost:5000/api/vlogs')
        .then(response => setData(response.data))
      setIsLoading(false)
    }
    if(cats === '') {
      fetching()
    }
  }, [cats]);

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true)
      await axios.get(`http://localhost:5000/api/vlogs/${cats}/${sors}`)
        .then(response => setData(response.data))
      setIsLoading(false)
    }
    if (cats !== '' && sors !== '') {
      fetching()
    }
  }, [cats, sors]);

  useEffect(() => {
    const fetching = async () => {
      setIsLoading(true)
      await axios.get(`http://localhost:5000/api/vlogs/sort/${sors}`)
        .then(response => setData(response.data))
      setIsLoading(false)
    }
    if (cats === '') {
      fetching()
    }
  }, [sors]);

  console.log(cats, sors)

  return (
    <div className='flex w-[1270px] mb-10  flex-col mt-5 items-center gap-10'>

      <div className=' w-full px-3 flex flex-wrap gap-2'>
        {
          cat?.map((item, index) => (
            cats === item ? <span onClick={() => setCats(prev=>{
              if(prev === cats) {
                return ''
              } else {
                return cats
              }
            })} key={index} className='text-white p-1 hover:cursor-pointer rounded-xl capitalize text-xl bg-gray-800'>
              {item}
            </span> :
              <span onClick={() => setCats(item)} key={index} className='text-white p-1 hover:cursor-pointer hover:bg-gray-500 rounded-xl capitalize text-xl bg-gray-400'>
                {item}
              </span>
          ))
        }
      </div>

      <div className='w-full ml-5 justify-start rounded-lg overflow-hidden'>
        <select className='h-12 w-72 bg-gray-400 text-xl capitalize text-white' onChange={(e) => setSors(e.target.value)}>
          {
            sor?.map((item, index) => (
              <option key={item} value={item}>{sor_temp[index]}</option>
            ))
          }
        </select>
      </div>

      <div className='flex gap-3 mt-5 ml-4 flex-wrap self-start'>
        {
          isLoading && <p className='text-2xl text-white'>Loading...</p>
        }
        {
          !isLoading &&
          data?.data?.map(item => (
            <div key={item?._id} onClick={() => vlogClick(item?._id)} className='min-h-[170px] flex flex-col items-center w-[240px] border-2 rounded-lg overflow-hidden'>
              <div className='h-[130px] w-[220px] m-2 rounded-xl overflow-hidden'>
                <img src={item?.photo} alt="pic" className='h-full w-full object-cover' />
              </div>
              <p className='text-[16px] w-[200px] text-white p-1 break-all text-center'>{item?.title}</p>
            </div>
          ))
        }
        {
          !isLoading && data?.data?.length === 0 &&
          <p className='text-white t'>No Article found with this category.</p>
        }
      </div>
    </div>
  );
}

export default Home;
