import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { setVlogDetails } from '../Redux/reducers.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp as solidThumbup,
  faThumbsDown as solidThumbdown,
  faBookmark as soildBookmark
} from '@fortawesome/free-solid-svg-icons';
import {
  faThumbsUp as regularThumbup,
  faThumbsDown as regularThumbdown,
  faBookmark as regularBookmark
} from '@fortawesome/free-regular-svg-icons';

function SingleVlog() {
  let userID = useSelector(state => state.userId)
  let vlogID = useSelector(state => state.vlogId)
  const [isLoading, setIsLoading] = useState(true)
  const [canLike, setCanLike] = useState(true)
  const [canDisike, setCanDislike] = useState(true)
  const [canSave, setCanSave] = useState(true)
  const [force, setForce] = useState(null)
  const [vlog, setVlog] = useState(null)
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetching = async () => {
      const res = await axios.get(`http://localhost:5000/api/vlogs/${vlogID}`, { vlogId: vlogID })
      if (userID !== '') {
        const resU = await axios.get(`http://localhost:5000/api/users/${userID}`, { userId: userID })
        setUser(resU?.data?.data)
        if (resU?.data?.data?.saved.includes(res?.data?.data?._id)) {
          setCanSave(false)
          // console.log(resU?.data?.data?.saved, res?.data?.data?._id, "save true", Array(resU?.data?.data?.saved).includes(res?.data?.data?._id))

        } else {
          setCanSave(true)
          // console.log(resU?.data?.data?.saved, res?.data?.data?._id, "save false", Array(resU?.data?.data?.saved).includes(res?.data?.data?._id))
        }
        const v = res?.data?.data
        const title = v?.title
        const photo = v?.photo 
        const category = v?.category 
        const content = v?.story
        const id = v?._id
        dispatch(setVlogDetails({title, photo, category, content, id}))
      }
      setVlog(res?.data?.data)
      setForce([res?.data?.data?.likes, res?.data?.data?.dislikes])

      if (res?.data?.data?.likers.includes(userID)) {
        setCanLike(false)
        // console.log(res?.data?.data?.likers, userID, "like true", Array(res?.data?.data?.likers).includes(userID))
      } else {
        setCanLike(true)
        // console.log(res?.data?.data?.likers, userID, "like false", Array(res?.data?.data?.likers).includes(userID))
      }

      if (res?.data?.data?.dislikers.includes(userID)) {
        setCanDislike(false)
        // console.log(res?.data?.data?.dislikers, userID, "dislike true", Array(res?.data?.data?.dislikers).includes(userID))
      } else {
        setCanDislike(true)
        // console.log(res?.data?.data?.dislikers, userID, "dislike false", Array(res?.data?.data?.dislikers).includes(userID))
      }

      setIsLoading(false)
    }
    fetching()
  }, []);


  const like = () => {

    const addlike = async () => {
      await axios.put(`http://localhost:5000/api/vlogs/${userID}/${vlogID}/like`)
      setCanLike(prev => {
        if (prev && canDisike) {
          let p = force
          p = [p[0] + 1, p[1]]
          setForce(p)
        } else if (!prev && canDisike) {
          let p = force
          p = [p[0] - 1, p[1]]
          setForce(p)
        } else if (prev && !canDisike) {
          setCanDislike(true)
          let p = force
          p = [p[0] + 1, p[1] - 1]
          setForce(p)
        }
        return !prev
      })

    }
    if (userID === '')
      navigate('/signin')
    else {
      addlike()
    }
  }

  const dislike = () => {
    const disliked = async () => {
      await axios.put(`http://localhost:5000/api/vlogs/${userID}/${vlogID}/dislike`)
      setCanDislike(prev => {
        if (prev && canLike) {
          let p = force
          p = [p[0], p[1] + 1]
          setForce(p)
        } else if (!prev && canLike) {
          let p = force
          p = [p[0], p[1] - 1]
          setForce(p)
        } else if (prev && !canLike) {
          setCanLike(true)
          let p = force
          p = [p[0] - 1, p[1] + 1]
          setForce(p)
        }
        return !prev
      })
    }
    if (userID === '')
      navigate('/signin')
    else {
      disliked()
    }
  }

  const save = () => {
    const saved = async () => {
      await axios.put(`http://localhost:5000/api/vlogs/${userID}/${vlogID}/save`)
      setCanSave(p => !p)
    }
    if (userID === '')
      navigate('/signin')
    else {
      saved()
    }
  }

  const deleteVlog = () => {
    const del = async () => {
      await axios.delete(`http://localhost:5000/api/vlogs/${userID}/${vlogID}/delete`)
    }
    del()
    navigate('/create')
  }


  return (
    <div className="bg-[#373737] flex mb-10 flex-col justify-start items-center w-[1270px] min-h-screen">
      <div className='w-[1240px] h-full flex flex-col gap-10 items-center'>
        {
          !isLoading &&
          <>
            <div className='text-3xl text-white mt-10 w-full text-center capitalize'>
              {vlog?.title}
            </div>
            <div className='w-[800px] h-[500px] rounded-3xl overflow-hidden'>
              <img src={vlog?.photo} alt="pic" className='w-full h-full object-contain' />
            </div>

            <div className='flex gap-5'>
              <div onClick={() => like()} className='flex hover:cursor-pointer flex-col justify-center items-center'>
                {
                  canLike &&
                  <FontAwesomeIcon icon={regularThumbup} className='text-white text-4xl' />
                }
                {
                  !canLike &&
                  <FontAwesomeIcon icon={solidThumbup} className='text-white text-4xl' />
                }
                <p className='text-white text-xl'>{force[0]}</p>
              </div>
              <div onClick={() => dislike()} className='flex hover:cursor-pointer flex-col justify-center items-center'>
                {
                  canDisike &&
                  <FontAwesomeIcon icon={regularThumbdown} className='text-white text-4xl' />
                }
                {
                  !canDisike &&
                  <FontAwesomeIcon icon={solidThumbdown} className='text-white text-4xl' />
                }
                <p className='text-white text-xl'>{force[1]}</p>
              </div>
              <div onClick={() => save()} className='hover:cursor-pointer'>
                {
                  canSave &&
                  <FontAwesomeIcon icon={regularBookmark} className='text-white text-4xl' />
                }
                {
                  !canSave &&
                  <FontAwesomeIcon icon={soildBookmark} className='text-white text-4xl' />
                }
              </div>
            </div>
            <div className='text-[25px] w-[1100px] leading-[30px] text-white text-justify capitalize'>
              <div dangerouslySetInnerHTML={{ __html: vlog?.story }} />
            </div>
            {
              userID === vlog?.userId &&
              <div className='flex gap-5'>
                <button onClick={()=>navigate('/editvlog')} className='text-xl font-semibold text-white bg-green-500 rounded-md px-2 py-1'>Edit Vlog</button>
                <button onClick={() => deleteVlog()} className='text-xl font-semibold text-white bg-red-500 rounded-md px-2 py-1'>Delete Vlog</button>
              </div>
            }

          </>
        }
        {
          isLoading && <p className='text-xl text-white'>Loading...</p>
        }
      </div>
    </div>
  );
}

export default SingleVlog;
