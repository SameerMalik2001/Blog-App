import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { User } from '../models/user.models.js'
import { Vlog } from '../models/vlog.models.js'

// title, photo, story, userId, views, likes, dislikes, viewer

const createVlog = asyncHandler(async (req, res) => {

  const { title, story, category } = req.body
  console.log(title, story, category)

  if (title === '' && story === '' && category === '')
    throw new ApiError(403, "title, category and story is required!")

  const user1 = await User.findById(req.params.userId)
  if (!user1)
    throw new ApiError(409, "wrong url!!")

  let photoLocalPath;
  if (req.files && Array.isArray(req.files.photo) && req.files.photo.length > 0) {
    photoLocalPath = req.files.photo[0].path
    const uploadedImg = await uploadOnCloudinary(photoLocalPath)
    if (!uploadedImg)
      throw new ApiError(400, "photo upload failed")
    req.body.photo = uploadedImg.url
  } else {
    req.body.photo = ''
  }

  const isTitlePresent = await Vlog.findOne({
    title: title
  })

  if (isTitlePresent)
    throw new ApiError(402, "title present already")

  const vlog = await Vlog.create({
    ...req.body,
    userId: req.params.userId
  })

  return res.status(201).json(
    new ApiResponse(200, vlog, "vlog successfully created!")
  )
})

const updateVlog = asyncHandler(async (req, res) => {

  const { title, story } = req.body
  if (title === '' && story === '')
    throw new ApiError(403, "title and story is required!")


  const { userId, vlogId } = req.params

  const user = await User.findById(userId)
  if (!user)
    throw new ApiError(409, "wrong url!!")

  const vlog1 = await Vlog.findById(vlogId)
  if (!vlog1)
    throw new ApiError(409, "wrong url!!")

  const relation = await Vlog.findOne({
    $and: [
      { userId: userId },
      { _id: vlogId }
    ]
  })

  if (!relation)
    throw new ApiError(405, "incorrect URL!!")

  let photoLocalPath;
  if (req.files && Array.isArray(req.files.photo) && req.files.photo.length > 0) {
    photoLocalPath = req.files.photo[0].path
    const uploadedImg = await uploadOnCloudinary(photoLocalPath)
    if (!uploadedImg)
      throw new ApiError(400, "photo upload failed")
    req.body.photo = uploadedImg.url
  }

  const isTitlePresent = await Vlog.findOne({
    $and: [
      { userId: { $ne: req.params.userId } },
      { title: title }
    ]
  })

  if (isTitlePresent)
    throw new ApiError(402, "title present already")

  const vlog = await Vlog.findByIdAndUpdate(
    req.params.vlogId,
    {
      ...req.body
    }
  )

  if (!vlog)
    throw new ApiError(304, "server error! can not update")

  const v = await Vlog.findById(vlog._id)

  return res.status(202).json(
    new ApiResponse(200, v, "updated successfully!")
  )

})

const viewVlog = asyncHandler(async (req, res) => {
  const { userId, vlogId } = req.params
  const user = await User.findById(userId)
  if (!user)
    throw new ApiError(409, "wrong url!!")

  const vlog = await Vlog.findById(vlogId)
  if (!vlog)
    throw new ApiError(409, "wrong url!!")

  if (!vlog.viewers.includes(userId)) {
    const response = await Vlog.findByIdAndUpdate(vlogId,
      {
        viewers: [...vlog.viewers, userId],
        views: (vlog.views + 1)
      }
    )

    if (!response)
      throw new ApiError(405, "something went wrong!!")
  }

  const response = await Vlog.findById(vlogId)

  res.status(200).json(
    new ApiResponse(200, response, "viewed successfully!!")
  )

})

const likeVlog = asyncHandler(async (req, res) => {
  const { userId, vlogId } = req.params
  const user = await User.findById(userId)
  if (!user)
    throw new ApiError(409, "wrong url!!")

  const vlog = await Vlog.findById(vlogId)
  if (!vlog)
    throw new ApiError(409, "wrong url!!")

  if (!vlog.likers.includes(userId)) {
    if (vlog.dislikers.includes(userId)) {
      const response = await Vlog.findByIdAndUpdate(vlogId,
        {
          likers: [...vlog.likers, userId],
          likes: (vlog.likes + 1),
          dislikers: [...vlog.dislikers].filter(item => item !== userId),
          dislikes: (vlog.dislikes - 1)
        }
      )
      if (!response)
        throw new ApiError(405, "something went wrong!!")
    } else {
      const response = await Vlog.findByIdAndUpdate(vlogId,
        {
          likers: [...vlog.likers, userId],
          likes: (vlog.likes + 1)
        }
      )
      if (!response)
        throw new ApiError(405, "something went wrong!!")
    }

  }

  const response = await Vlog.findById(vlogId)

  res.status(200).json(
    new ApiResponse(200, response, "like successfully!!")
  )
})

const dislikeVlog = asyncHandler(async (req, res) => {
  const { userId, vlogId } = req.params
  const user = await User.findById(userId)
  if (!user)
    throw new ApiError(409, "wrong url!!")

  const vlog = await Vlog.findById(vlogId)
  if (!vlog)
    throw new ApiError(409, "wrong url!!")

  if (!vlog.dislikers.includes(userId)) {
    if (vlog.likers.includes(userId)) {
      const response = await Vlog.findByIdAndUpdate(vlogId,
        {
          dislikers: [...vlog.dislikers, userId],
          dislikes: (vlog.dislikes + 1),
          likes: (vlog.likes - 1),
          likers: [...vlog.likers].filter(item => item !== userId)
        }
      )
      if (!response)
        throw new ApiError(405, "something went wrong!!")
    } else {
      const response = await Vlog.findByIdAndUpdate(vlogId,
        {
          dislikers: [...vlog.dislikers, userId],
          dislikes: (vlog.dislikes + 1),
        }
      )
      if (!response)
        throw new ApiError(405, "something went wrong!!")
    }
  }

  const response = await Vlog.findById(vlogId)

  res.status(200).json(
    new ApiResponse(200, response, "dislike successfully!!")
  )
})

const saveVlog = asyncHandler(async (req, res) => {
  const { userId, vlogId } = req.params

  const user = await User.findById(userId)
  if (!user)
    throw new ApiError(409, "wrong url!!")

  const vlog1 = await Vlog.findById(vlogId)
  if (!vlog1)
    throw new ApiError(409, "wrong url!!")

  if (!user.saved.includes(vlogId)) {
    const response = await User.findByIdAndUpdate(
      userId,
      {
        saved: [...user.saved, vlogId]
      }
    )
  } else {
    const response = await User.findByIdAndUpdate(
      userId,
      {
        saved: [...user.saved].filter(i => i !== vlogId)
      }
    )
  }

  const v = await User.findById(userId).select("-password")

  res.status(202).json(
    new ApiResponse(200, v, "saved successfully!!")
  )

})

const deleteVlog = asyncHandler(async (req, res) => {
  const { userId, vlogId } = req.params

  const user = await User.findById(userId)
  if (!user)
    throw new ApiError(409, "wrong url!!")

  const vlog1 = await Vlog.findById(vlogId)
  if (!vlog1)
    throw new ApiError(409, "wrong url!!")

  const relation = await Vlog.findOne({
    $and: [
      { userId: userId },
      { _id: vlogId }
    ]
  })

  if (!relation)
    throw new ApiError(405, "incorrect URL!!")

  const response = await Vlog.findByIdAndDelete(vlogId)
  if (!response)
    throw new ApiError(508, "server error")


  res.status(203).json(
    new ApiResponse(200, null, "delete vlog successfully!!")
  )
})

const sortVlog = asyncHandler(async (req, res) => {
  const { which } = req.params
  // ['popular', 'liked', 'disliked', 'newest', 'oldest']
  let sorted_vlog;
  if (which === 'popular') {
    sorted_vlog = await Vlog.find().sort({ views: 'desc' })
  } else if (which === 'liked') {
    sorted_vlog = await Vlog.find().sort({ likes: 'desc' })
  } else if (which === 'disliked') {
    sorted_vlog = await Vlog.find().sort({ dislikes: 'desc' })
  } else if (which === 'newest') {
    sorted_vlog = await Vlog.find().sort({ createdAt: 'desc' })
  } else if (which === 'oldest') {
    sorted_vlog = await Vlog.find().sort({ createdAt: 'asc' })
  }

  return res.status(202).json(
    new ApiResponse(200, sorted_vlog, "sorted done!")
  )
})

const getVlogByCategoryAndSort = asyncHandler(async (req, res) => {
  const { cat, sor } = req.params

  // ['popular', 'liked', 'disliked', 'newest', 'oldest']

  let sorted_vlog;
  if (sor === 'popular') {
    sorted_vlog = await Vlog.find({ $and: [{ category: cat }] }).sort({ views: 'desc' })
  } else if (sor === 'liked') {
    sorted_vlog = await Vlog.find({ $and: [{ category: cat }] }).sort({ likes: 'desc' })
  } else if (sor === 'disliked') {
    sorted_vlog = await Vlog.find({ $and: [{ category: cat }] }).sort({ dislikes: 'desc' })
  } else if (sor === 'newest') {
    sorted_vlog = await Vlog.find({ $and: [{ category: cat }] }).sort({ createdAt: 'desc' })
  } else if (sor === 'oldest') {
    sorted_vlog = await Vlog.find({ $and: [{ category: cat }] }).sort({ createdAt: 'asc' })
  }

  if (!sorted_vlog)
    throw new ApiError(500, "server error during fetching the vlogs")

  return res.status(202).json(
    new ApiResponse(200, sorted_vlog, "all vlog fetched!!")
  )
})

const getAll = asyncHandler(async (req, res) => {
  const resp = await Vlog.find()
  if (!resp)
    throw new ApiError(405, "can not fetch getall!")
  return res.status(203).json(
    new ApiResponse(200, resp, "get all done!")
  )
})

const getOne = asyncHandler(async (req, res) => {
  const resp = await Vlog.findById(req.params.vlogId)
  if (!resp)
    throw new ApiError(405, "can not fetch getall!")
  return res.status(203).json(
    new ApiResponse(200, resp, "get one done!")
  )
})

const deleteVlogOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params

  const user = await User.findById(userId)
  if(!user)
    throw new ApiError(408, "invalid url!!")

  const vlog = await Vlog.find()

  vlog.forEach(async element => {
    if(element.userId === userId) {
      await Vlog.findByIdAndDelete(element)
    }
  });

  await User.findByIdAndDelete(user._id)

  res.status(200).json("delete all related to user!")
})

export { deleteVlogOfUser, createVlog, getAll, getOne, getVlogByCategoryAndSort, updateVlog, likeVlog, sortVlog, dislikeVlog, deleteVlog, saveVlog, viewVlog }
