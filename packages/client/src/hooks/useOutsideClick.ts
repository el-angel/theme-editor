import React from 'react';

const useOutsideClick = (
  elem: React.RefObject<HTMLElement>,
  callback: (isOutside: boolean) => void,
): void => {
  const clickListener = React.useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;
      if (!elem.current?.contains(target)) {
        callback(true);
        return;
      }

      callback(false);
    },
    [callback, elem],
  );

  React.useEffect(() => {
    document.addEventListener('click', clickListener);

    return (): void => {
      document.removeEventListener('click', clickListener);
    };
  }, [clickListener]);
};

export default useOutsideClick;
