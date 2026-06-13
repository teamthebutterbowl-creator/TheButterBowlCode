// import { useEffect, useState } from 'react';

// const useMediaQuery = (query) => {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia(query);
//     const updateMatches = () => setMatches(mediaQuery.matches);
//     updateMatches();
//     mediaQuery.addEventListener('change', updateMatches);
//     return () => mediaQuery.removeEventListener('change', updateMatches);
//   }, [query]);

//   return matches;
// };

// export default useMediaQuery;

import { useEffect, useState } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);
    updateMatches();
    mediaQuery.addEventListener('change', updateMatches);
    return () => mediaQuery.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
};

export default useMediaQuery;