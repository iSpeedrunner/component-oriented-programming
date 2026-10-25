import { useEffect, useState } from 'react'

function useFetch(fetchFunction, params) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = typeof AbortController === 'function' ? new AbortController() : null
    let isActive = true

    const requestParams = params ? { ...params, signal: controller?.signal } : {
      signal: controller?.signal,
    }

    Promise.resolve()
      .then(() => {
        if (!isActive) {
          return null
        }

        setLoading(true)
        setError(null)
        return fetchFunction(requestParams)
      })
      .then(result => {
        if (!isActive || result === null) {
          return
        }

        setData(result)
        setLoading(false)
      })
      .catch(requestError => {
        if (!isActive || requestError?.name === 'AbortError') {
          return
        }

        setError(requestError)
        setLoading(false)
      })

    return () => {
      isActive = false
      controller?.abort()
    }
  }, [fetchFunction, params])

  return { data, loading, error }
}

export default useFetch
