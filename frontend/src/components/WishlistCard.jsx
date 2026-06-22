function WishlistCard({
  item,
  deleteWishlistItem
}) {

  return (
    <div className="wishlist-card">

      <h3>
        ⭐ {item.destination}
      </h3>

      <button
        onClick={() =>
          deleteWishlistItem(item._id)
        }
      >
        Remove
      </button>

    </div>
  )
}

export default WishlistCard