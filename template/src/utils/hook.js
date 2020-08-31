import { useEffect, useState } from 'react'

export function useOnce(loading) {
  const [once, setOnce] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (loading && !done) {
      setOnce(true);
      setDone(true);
    }

    if (!loading && once) {
      setOnce(false);
    }
  }, [done, loading, once])

  return [once]
}
