import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"

import { UseQueryWrapper } from '@/services/Client';

export default function LandingPage() {
	const { isLoading, error, data, refetch } = UseQueryWrapper({
		queryKey: ['react-query-stats'],
		enabled: false,
	}, 'https://api.github.com/repos/tannerlinsley/react-query')

	
    return (
		<div className='flex flex-col items-center h-screen'>
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

