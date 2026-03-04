import prisma from "../config/db.js";

console.log(Object.keys(prisma));

const addToWatchList = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

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
  const existingInWatchList = await prisma.watchListItem .findUnique({
    where: {
      userId_movieId: {
        userId: req.user.id,
        movieId: movieId
      }
    },
  });

  if (existingInWatchList) {
    return res.status(400).json({
      error: "Movie already in th watchlist",
    });
  }

  const watchlistItem = await prisma.watchListItem.create({
    data: {
        userId: req.user.id,
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

// Update
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchListItem.findUnique({
    where: {id: req.params.id},
  });

  if(!watchlistItem) {
    return res.status(404).json({error: "Watchlist item not found"});
  };

  // Ensure only owner can update
  if(watchlistItem.userId !== req.user.id){
    return res.status(403).json({
      error: "Not allowed to update this watchlist"
    });
  };

  // Build update data
  const updateData = {};
  if(status !== undefined) updateData.status = status.toUpperCase();
  if(rating !== undefined) updateData.rating = rating;
  if(notes !== undefined) updateData.notes = notes;

  // Update watchlist item
  const updateItem = await prisma.watchListItem.update({
    where: { id: req.params.id},
    data: { updateData },
  });

  res.status(200).json({
  status: "Success",
  data: {
    watchlistItem: updateItem,
  },
});
};




// Delete
const removeFromWatchlist = async (req, res) => {
  const watchlistItem = await prisma.watchListItem.findUnique({
    where: {id: req.params.id},
  });

  if(!watchlistItem) {
    res.status(404).json({error: 'Watchlist item not found'});
  };

  // ensure owner can delete
  if(watchlistItem.userId !== req.user.id){
    return res.status(403).json({error: "Not allowed to update this watchlist item"})
  };

  await prisma.watchListItem.delete({
    where: { id: req.params.id}
  });

  res.status(200).json({
    status: "Success",
    message: "Movie removed from watchlist"
  });
}

export { addToWatchList, removeFromWatchlist, updateWatchlistItem };