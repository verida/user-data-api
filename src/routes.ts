import { Router } from 'express'
import DbRoutes from './services/db/routes'
import DsRoutes from './services/ds/routes'
import LuceneRoutes from './services/lucene/routes'

const router = Router()

router.use('/db', DbRoutes)
router.use('/ds', DsRoutes)
router.use('/search', LuceneRoutes)

export default router