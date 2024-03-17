import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

const fetchData = async (url: string) => {
    return axios.get(url).then((res) => res.data);
  }
  
function UseQueryWrapper<TData = unknown, TError = unknown>({ queryKey, queryFn, ...options }: UseQueryOptions<TData, TError>, url: string) {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: queryKey, 
    queryFn: queryFn || (() => fetchData(url)),
    ...options
  })
  return { isLoading, error, data, refetch }
}



  export { UseQueryWrapper };

