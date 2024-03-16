import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"

import { useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios'


export default function Component() {
	const { isLoading, error, data, refetch } = useQuery({
		queryKey: ['repoData'], 
		queryFn: async () => 
			axios
			.get('https://api.github.com/repos/tannerlinsley/react-query')
			.then((res) => res.data),
        enabled: false 
	})

    return (
		<div className='flex flex-col  items-center h-screen'>
			<h1>Landing Page</h1>
			<Button
				disabled={isLoading}
				onClick={() => refetch()}
			>
				Get ReactQuery stats :) 
				{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
			</Button>
			{isLoading ? (
				"Loading..."
			) : error ? (
				<div>An error occurred: {error.message}</div>
			) : data ? (
				<div>
					<h1>{data.name}</h1>
					<p>{data.description}</p>
				</div>
			) : null}
		</div>
	)
}

