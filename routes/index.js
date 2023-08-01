import express from 'express'
const router = express.Router()

import home from "./modules/home.js";
router.use('/', home)

export default router