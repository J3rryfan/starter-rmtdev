import { useEffect, useState } from "react";
import { jobItem, jobItemDescription } from "./types";
import { BASE_URL } from "./constant";
import { useQuery } from "@tanstack/react-query";

type JobItemApiResponse = {
  public: boolean;
  jobItem: jobItemDescription;
};

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_URL}/${id}`);
  // 4xx or 5xx
  const errorData = await response.json();
  if (!response.ok) {
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data;
};

// using reactQueryhook
export function useJobItem(id: number | null) {
  const { data, isInitialLoading } = useQuery(
    ["job-item", id],
    () => (id ? fetchJobItem(id) : null),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id), // another solution is to use !!id
      onError: (error) => {
        console.log(error);
      },
    }
  );
  const jobItem = data?.jobItem;
  const isLoading = isInitialLoading;
  return { jobItem, isLoading } as const;
}

// -----------------------------
//
type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: jobItem[];
};

const fetchGetJobItems = async (
  searchInputText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_URL}?search=${searchInputText}`);
  const data = await response.json();
  return data;
};

export function useJobItems(searchInputText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchInputText],
    () => fetchGetJobItems(searchInputText),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchInputText),
      onError: (error) => {
        console.log(error);
      },
    }
  );
  const jobItems = data?.jobItems;
  const isLoading = isInitialLoading;
  return { jobItems, isLoading } as const;
}

// -----------------------------

export function useActiveId() {
  const [activeJobItemId, setActiveJobItemId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveJobItemId(id);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeJobItemId;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounceValue;
}

// export function useJobItem(id: number | null) {
//   const [jobItem, setJobItem] = useState<jobItemDescription | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchJobItemData = async () => {
//       setIsLoading(true);
//       const response = await fetch(`${BASE_URL}/${id}`);
//       const data = await response.json();
//       setJobItem(data.jobItem);
//       setIsLoading(false);
//     };

//     fetchJobItemData();
//   }, [id]);

//   return { jobItem, isLoading } as const;
// }

// export function useJobItems(searchInputText: string) {
//     const [jobItems, setJobItems] = useState<jobItem[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//       if (!searchInputText) return;

//       const fetchJobData = async () => {
//         setIsLoading(true);
//         const response = await fetch(`${BASE_URL}?search=${searchInputText}`);

//         const data = await response.json();
//         setIsLoading(false);
//         setJobItems(data.jobItems);
//       };

//       fetchJobData();
//     }, [searchInputText]);

//     return { jobItems, isLoading } as const;
//   }
