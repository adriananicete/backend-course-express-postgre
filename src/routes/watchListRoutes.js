import express from 'express';
import { addToWatchList, removeFromWatchlist, updateWatchlistItem } from '../controllers/watchListController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequestMiddleware.js';
import { addToWatchlistSchema } from '../validator/watchlistValidators.js';

const router = express.Router();

router.use(authMiddleware);

// @desc Create/Add new movie to watchlist
// @route {{BaseURL}}/watchlist
router.post('/', validateRequest(addToWatchlistSchema),addToWatchList);

// @desc Update movie to watchlist
// @route {{BaseURL}}/watchlist/:id
router.put('/:id', updateWatchlistItem)

// @desc Delete movie to watchlist
// @route {{BaseURL}}/watchlist/:id
router.delete('/:id', removeFromWatchlist);

export default router;