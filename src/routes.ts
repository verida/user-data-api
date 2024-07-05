import express from 'express'
import Controller from './controller'

const router = express.Router()

router.get('/save', Controller.save)

export default router