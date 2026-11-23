import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addFavorite,
  removeFavorite,
  selectFavoriteIds,
  selectIsFavorite,
} from '../src/store/favoritesSlice.js'
import { store } from '../src/store/store.js'

test('favorite actions store each country code once and remove only the requested country', () => {
  assert.deepEqual(selectFavoriteIds(store.getState()), [])

  store.dispatch(addFavorite('UKR'))
  store.dispatch(addFavorite('BRA'))
  store.dispatch(addFavorite('UKR'))

  const added = store.getState()
  assert.deepEqual(selectFavoriteIds(added), ['UKR', 'BRA'])
  assert.equal(selectIsFavorite(added, 'UKR'), true)
  assert.equal(selectIsFavorite(added, 'CAN'), false)

  store.dispatch(removeFavorite('UKR'))

  assert.equal(selectIsFavorite(store.getState(), 'UKR'), false)
  assert.equal(selectIsFavorite(store.getState(), 'BRA'), true)
  assert.deepEqual(selectFavoriteIds(store.getState()), ['BRA'])
  assert.deepEqual(selectFavoriteIds(added), ['UKR', 'BRA'])
})
