import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { User } from '../models/user.models.js'
import bcrypt from 'bcrypt'

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body

  const isUserPresent = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (isUserPresent)
    throw new ApiError(401, "User is present already")

  const newUser = await User.create({
    username: username,
    email: email,
    password: password,
    avatar: ''
  })

  const createdUser = await User.findById(newUser._id).select("-password")

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user!")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Register Successfully!")
  )
})

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({
    $or: [{ username }]
  })
  if (!user)
    throw new ApiError(401, "User is not exists")

  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if (!isPasswordCorrect)
    throw new ApiError(409, "password is not correct")

  const dummyUser = await User.findById(user._id).select("-password")

  return res.status(201).json(
    new ApiResponse(200, dummyUser, "User login Successfully!")
  )
})

const updateUser = asyncHandler(async (req, res) => {

  let avatarLocalPath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path
  }

  if (avatarLocalPath) {
    const uploadedImg = await uploadOnCloudinary(avatarLocalPath)
    if (!uploadedImg)
      throw new ApiError(400, "avatar upload required")
    req.body.avatar = uploadedImg.url
  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.userId,
    {
      ...req.body
    }
  )

  if (!updateUser)
    throw new ApiError(409, "server problem")

  const user = await User.findById(updateUser._id).select("-password")

  return res.status(202).json(
    new ApiResponse(200, user, "updated successfully!")
  )

})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body

  if ([oldPassword, newPassword, confirmPassword].some(i => i?.trim() === ""))
    throw new ApiError(408, "all fields are required!")

  const user = await User.findById(req.params.userId)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect)
    throw new ApiError(409, "old Password is incorrect")

  if (newPassword !== confirmPassword)
    throw new ApiError(409, "both password are not match!")

  const updatedUser = await User.findByIdAndUpdate(user._id,
    {
      password: await bcrypt.hash(newPassword, 10)
    }
  ).select("-password")

  res.status(203).json(
    new ApiResponse(200, updatedUser, "change password successfully!")
  )
})

const deleteUser = asyncHandler(async (req, res)=>{
  await User.findByIdAndDelete(req.params.userId)

  res.status(203).json(
    new ApiResponse(200, null, "Delete User successfully!")
  )
})

const getOne = asyncHandler(async (req, res)=>{
  const resp = await User.findById(req.params.userId)
  if(!resp)
    throw new ApiError(405, "can not find user or invalid url")
  res.status(203).json(
    new ApiResponse(200, resp, "get one user successfully!")
  )
})

export { registerUser, getOne, loginUser, updateUser, changePassword, deleteUser }