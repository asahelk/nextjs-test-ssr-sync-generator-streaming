import { DeferredGenerator } from "@/app/generator/helper";
import { Chunk } from "@/app/type";
import { Suspense } from "react";

export default async function ItemList({ limit, offset, deferred }: Readonly<{ limit: number; offset: number; deferred: DeferredGenerator<Chunk, Chunk> }>) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Simulate a delay of 1 second
    const api = 'https://pokeapi.co/api/v2/pokemon';

    const result = await fetch(`${api}?limit=${limit}&offset=${offset}`);
    const data = await result.json();
    
    deferred.next({
        value: {
            pokemons: data.results,
        },
        done: !data?.results.length,
    });

    if (!data?.results.length) {
        return <div>No data found</div>
    }
    return (
        <>
        {data.results.map((item: { name: string, url: string }, index: number) => (
            <div key={item.name} data-num={index + 1} className="before:content-[attr(data-num)] before:text-gray-500 before:absolute before:-ml-10">
            <h3 className="capitalize">{item.name}</h3>
            <p>{item.url}</p>
        </div>
        ))}
        {data.next &&  (
            <Suspense fallback={<div className="text-7xl text-yellow-300">Loading...</div>}>
                <ItemList limit={limit} offset={offset + limit} deferred={deferred} />
            </Suspense>
        )}
        </>
    
    )
    
}