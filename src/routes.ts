import { Router } from 'express'
import DbRoutes from './services/db/routes'
import DsRoutes from './services/ds/routes'
import AdminRoutes from './services/admin/routes'
import LLMRoutes from './services/llm/routes'
import MiniSearchRoutes from './services/minisearch/routes'

const router = Router()

router.use('/db', DbRoutes)
router.use('/ds', DsRoutes)
router.use('/admin', AdminRoutes)
router.use('/llm', LLMRoutes)
router.use('/minisearch', MiniSearchRoutes)

export default router