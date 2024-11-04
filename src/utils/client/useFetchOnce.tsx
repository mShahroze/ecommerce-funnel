import { useState, useEffect, useRef } from 'react';

type FetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

function useFetchOnce<T>(endpointURL: string): FetchState<T> {
  const didPerformRequest = useRef(false);
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (didPerformRequest.current) {
      return;
    }

    didPerformRequest.current = true;

    fetch(endpointURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setState({
          data: data,
          isLoading: false,
          error: null,
        });
      })
      .catch((error) => {
        setState({
          data: null,
          isLoading: false,
          error: error,
        });
      });
  }, [endpointURL]);

  return state;
}

export default useFetchOnce;
