import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite, selectIsFavorite } from '../../../store/favoritesSlice.js'
import './FavoriteButton.css'

function FavoriteButton({ countryId, countryName }) {
  const dispatch = useDispatch()
  const isFavorite = useSelector(state => selectIsFavorite(state, countryId))
  const hasCountryId = typeof countryId === 'string' && countryId.trim() !== ''

  function handleClick(event) {
    event.stopPropagation()
    dispatch(isFavorite ? removeFavorite(countryId) : addFavorite(countryId))
  }

  return (
    <button
      type="button"
      className="favorite-button"
      aria-label={`Favorite ${countryName}`}
      aria-pressed={isFavorite}
      disabled={!hasCountryId}
      onClick={handleClick}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}

export default FavoriteButton
