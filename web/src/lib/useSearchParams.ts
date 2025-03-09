import { useRouterState } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';

const removeEmptyValues = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null && value !== undefined && value !== ''),
  ) as Partial<T>;
};

export interface UseSearchParamsNavigationConfig<T extends object> {
  route: {
    useSearch: () => T;
    useNavigate: () => (args: { to: string; search: T; replace: boolean }) => void;
  };
  initialState?: Partial<T>;
}

export function useSearchParams<T extends object>(config: UseSearchParamsNavigationConfig<T>) {
  const search = config.route.useSearch();
  const navigate = config.route.useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const setSearch = useCallback(
    (newSearch: Partial<T>) => {
      const cleanedSearch = removeEmptyValues(newSearch);
      navigate({
        to: pathname,
        search: cleanedSearch as T,
        replace: true,
      });
    },
    [navigate, pathname],
  );

  const getQueryParam = useCallback(
    <K extends keyof T>(key: K): T[K] | undefined => {
      return search[key];
    },
    [search],
  );

  const getQueryParamSetter = useCallback(
    <K extends keyof T>(key: K) => {
      return (value: T[K]) => {
        setSearch({ ...search, [key]: value });
      };
    },
    [search, setSearch],
  );

  useEffect(() => {
    const cleanedSearch = removeEmptyValues(search);
    setSearch({
      ...config.initialState,
      ...cleanedSearch,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    search,
    setSearch,
    getQueryParam,
    getQueryParamSetter,
  } as const;
}
