import express from 'express'
import Controller from './controller'

const router = express.Router()

router.get('/save', Controller.save)
router.get('/read', Controller.read)


export default router