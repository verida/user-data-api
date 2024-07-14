import express from 'express'
import { controller } from './controller'

const router = express.Router()

router.get(/get\/(.*)$/, controller.get)
router.get(/get\/(.*)\/([a-z0-9]*)$/, controller.getById)
router.get(/query\/(.*)$/, controller.query)


export default router