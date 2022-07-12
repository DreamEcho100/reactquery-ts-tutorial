// index.tsx
import { FC, useState } from 'react';
import Link from 'next/link';
import {
	useQueries,
	useQuery,
	useQueryClient,
	UseQueryResult,
} from 'react-query';
import PersonComponent from '../../src/components/PersonComponent';
import { IPerson } from '../../src/lib/interfaces/IPerson';
import { ITodo } from '../../src/lib/interfaces/ITodo';
// import PersonComponent from '@src/components/PersonComponent';
// import { IPerson } from '@src/lib/interfaces/IPerson';

export const fetchPerson = async (): Promise<IPerson> => {
	const res = await fetch(`/api/person`);
	// need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
	if (res.ok) {
		return res.json();
	}
	throw new Error('Network response not ok'); // need to throw because react-query functions need to have error thrown to know its in error state
};

const fetchTodo = async (): Promise<ITodo> => {
	const res = await fetch(`/api/todo`);
	// need to do this with fetch since doesn't automatically throw errors axios and graphql-request do
	if (res.ok) {
		return res.json();
	}
	throw new Error('Network response not ok'); // need to throw because react-query functions need to have error thrown to know its in error state
};

const PersonPage: FC = () => {
	// const { isLoading, isError, error, data }: UseQueryResult<IPerson, Error> =
	// 	useQuery<IPerson, Error>(
	// 		'person',
	// 		fetchPerson
	// 		// {
	// 		//   staleTime: 5 * 1000, // 5 seconds
	// 		// }
	// 	);
	const [enabled, setEnabled] = useState(true);
	const {
		isLoading,
		isError,
		isSuccess: personSuccess,
		error,
		data,
	}: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>(
		'person',
		fetchPerson,
		{
			enabled,
		}
	);

	const {
		isSuccess: todoSuccess,
		data: todoData,
	}: UseQueryResult<ITodo, Error> = useQuery<ITodo, Error>('todo', fetchTodo, {
		enabled,
	});

	// dynamic parallel queries wooooo
	const userQueries = useQueries(
		['1', '2', '3'].map((id) => {
			return {
				queryKey: ['todo', { page: id }],
				queryFn: () => {
					return id;
				},
				enabled,
			};
		})
	);

	const queryClient = useQueryClient();

	//   const { status, error, data }: UseQueryResult<string, Error> = useQuery<IPerson, Error, string>(
	//     'person',
	//     async () => {
	//       const res = await fetch('/api/person');
	//       return res.json();
	//     },
	//     {
	//       select: (person) => person.name,
	//     }
	//   );

	// if (personSuccess && todoSuccess) {
	//   queryClient.invalidateQueries();
	// }

	if (personSuccess && todoSuccess && enabled) {
		setEnabled(false);
	}

	if (isLoading) {
		return (
			<div>
				<p>Loading...</p>
			</div>
		);
	}
	if (isError) return <p>Boom boy: Error is -- {error?.message}</p>;

	return (
		<>
			<Link href='/'>
				<a>Home</a>
			</Link>
			<br />
			<button
				type='button'
				onClick={(event) => {
					event.preventDefault();
					queryClient.invalidateQueries();
				}}
			>
				Invalidate Queries
			</button>
			<br />
			<button
				type='button'
				onClick={(event) => {
					event.preventDefault();
					queryClient.invalidateQueries('person');
				}}
			>
				Invalidate Person
			</button>
			<br />
			<button
				type='button'
				onClick={(event) => {
					event.preventDefault();
					queryClient.invalidateQueries({
						predicate: (query) => {
							// eslint-disable-next-line radix
							return parseInt((query as any).queryKey[1].page) % 2 === 1;
						},
					});
				}}
			>
				Invalidate Todo
			</button>
			<p>{data?.id}</p>
			<p>{data?.name}</p>
			<p>{data?.age}</p>
			<br />
			<h1>Person Component</h1>
			<PersonComponent />
		</>
	);
};

export default PersonPage;

// onMutate: async (_variables: ICreatePersonParams) => {
// 	// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
// 	await queryClient.cancelQueries('person');

// 	// Snapshot the previous value
// 	const previousPerson: IPerson | undefined = queryClient.getQueryData('person');

// 	queryClient.setQueryData('person', previousPerson);

// 	// Return a context object with the snapshotted value
// 	return { previousPerson };
// },
