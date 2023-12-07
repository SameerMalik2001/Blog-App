import { Router } from "express";
import {createVlog, deleteVlogOfUser, sortVlog, getOne, getAll, getVlogByCategoryAndSort, saveVlog, deleteVlog, updateVlog, likeVlog, dislikeVlog, viewVlog} from '../controller/vlog.controller.js'
import { upload } from '../middleware/multer.middleware.js'

const vlogRouter = Router()

vlogRouter.route('/:userId/create').post(
  // middleware injected
  upload.fields([
    {
      name: "photo",
      maxCount: 1
    }
  ]),
  createVlog
)


vlogRouter.route('/:userId/:vlogId/update').put(
  // middleware injected
  upload.fields([
    {
      name: "photo",
      maxCount: 1
    }
  ]), updateVlog)

vlogRouter.route('/:userId/:vlogId').put(viewVlog)

vlogRouter.route('/:userId/:vlogId/like').put(likeVlog)

vlogRouter.route('/:userId/:vlogId/dislike').put(dislikeVlog)

vlogRouter.route('/:userId/:vlogId/save').put(saveVlog)

vlogRouter.route('/:userId/:vlogId/delete').delete(deleteVlog)

vlogRouter.route('/sort/:which').get(sortVlog)

vlogRouter.route('/:cat/:sor').get(getVlogByCategoryAndSort)

vlogRouter.route('/').get(getAll)

vlogRouter.route('/:vlogId').get(getOne)

vlogRouter.route('/:userId/delete').delete(deleteVlogOfUser)

export { vlogRouter }