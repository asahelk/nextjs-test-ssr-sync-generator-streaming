// @/lib/utils/deferred-generator.ts
export type DeferredGenerator<T, R = T> = {
  generator: () => AsyncGenerator<T, R>;
  next: (chunk: IteratorResult<T, R>) => void;
};
export function createDeferredGenerator<T, R = T>(): DeferredGenerator<T, R> {
  let resolve: (() => void) | null = null;
  const queue: IteratorResult<T, R>[] = [];

  return {
    generator: async function* () {
      while (true) {
        if (queue.length > 0) {
          const result = queue.shift()!;
          if (result.done) {
            return result.value;
          }
          yield result.value;
        } else {
          await new Promise<void>((r) => (resolve = r));
        }
      }
    },
    next(result: IteratorResult<T, R>) {
      queue.push(result);
      resolve?.();
      resolve = null;
    },
  };
}