import { Router } from 'express'
import { registerUser, getOne, loginUser, updateUser, changePassword, deleteUser } from '../controller/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const userRouter = Router()

userRouter.route('/register').post(
  // middleware injected
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    }
  ]),
  registerUser
)

userRouter.route('/login').post(loginUser)

userRouter.route('/:userId/update').put(
  // middleware injected
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    }
  ]), updateUser)

userRouter.route('/:userId/changePassword').put(changePassword)

userRouter.route('/:userId/deleteUser').delete(deleteUser)

userRouter.route('/:userId').get(getOne)


export { userRouter }