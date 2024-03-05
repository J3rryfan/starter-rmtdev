import { useState } from 'react';

export default function BookmarksContextProvider({ children }) {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>([]);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkIds.includes(id)) {
      setBookmarkIds((prev) => prev.filter((item) => item !== id));
    } else {
      setBookmarkIds((prev) => [...prev, id]);
    }
  };

  return <div>{children}</div>;
}
