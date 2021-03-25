import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(); //no error -> undefined

  const activeHttpRequests = useRef([]); //store data across rerender cycles

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl); //push to useRef

      try {
        const response = await fetch(url, {
          method, //method: method
          body,
          headers,
          signal: httpAbortCtrl.signal //link AbortController to request
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl //clear abort controllers that belong to the request that was just completed
        );

        if (!response.ok) { //for 400ish & 500ish status code
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
