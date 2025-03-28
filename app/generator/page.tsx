
import ItemList from "@/components/ItemList";
import { Suspense } from "react";
import { Chunk, Pokemon } from "../type";
import { createDeferredGenerator, DeferredGenerator } from "./helper";
import { generatorComponent } from "@/components/generator";

interface Props {
    searchParams: Promise<{limit: string, offset: string}>
}

const Total = generatorComponent(async function* Innie({deferred}: {deferred: DeferredGenerator<Chunk,Chunk>}) {
    const pokemons: Pokemon[] = [];
    const iterator = deferred.generator();

    for await(const chunk of iterator){
        // console.log("The chunk ->",chunk)
        // console.log("Length => ",pokemons.length)
        pokemons.push(...chunk.pokemons);
        yield <div>Totalz: {pokemons.length}</div>
    }

    return <div>Totalx: {pokemons.length}</div>
})

export default async function Home(props: Props) {
    const searchParams = await props.searchParams;
    const limit = parseInt(searchParams.limit ?? '5', 10) ;
    const offset = parseInt(searchParams.offset ?? '0', 10) ;

    const deferred = createDeferredGenerator<Chunk,Chunk>();
    
    return (
        <div>
        <Total deferred={deferred} />
        <div className="flex flex-col gap-3 ml-20">
        <Suspense fallback={<div>Loading...</div>}>
            <ItemList limit={limit} offset={offset} deferred={deferred}/>
        </Suspense>
        </div>
    </div>
    );
}
