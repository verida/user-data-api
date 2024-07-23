import express from 'express'
import { controller } from './controller'

const router = express.Router()

router.get(/db\/(.*)$/, controller.searchDb)
router.get(/ds\/(.*)$/, controller.searchDs)


export default router