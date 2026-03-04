import express from 'express';
import { addToWatchList } from '../controllers/watchListController.js';

const router = express.Router();

router.post('/', addToWatchList)

export default router;