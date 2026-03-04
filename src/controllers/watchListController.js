import { prisma } from "../config/db.js";

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, notes, userId } = req.body;

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
  });

  // verify movie exists
  if (!movie) {
    res.status(404).json({
      error: "Movie not found",
    });
  }

  // Check if already added
  const existingInWatchList = await prisma.watchlistItem.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId
      }
    },
  });

  if (!existingInWatchList) {
    res.status(400).json({
      error: "Movie already in th watchlist",
    });
  }

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
        userId,
        movieId,
        status: status || 'PLANNED',
        rating,
        notes,
    }
  });

  res.status(201).json({
    status: "success",
    data: {
        watchlistItem,
    }
  })
};

export { addToWatchList };