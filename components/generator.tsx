// @/components/generator.tsx
import { Suspense } from "react";

// export function generatorComponent<P extends object>(
//   generatorFn: (props: P) => AsyncGenerator<React.ReactNode, React.ReactNode>
// ) {
//   return function GeneratedComponent(props: P) {
//     const generator = generatorFn(props);

//     async function Content() {
//       const { value, done } = await generator.next();
//       if (done) {
//         return value;
//       }
//       return (
//         <>
//           {/* {value} */}
//           {/* <Suspense fallback={null}> */}
//             <Content />
//           {/* </Suspense> */}
//         </>
//       );
//     }

//     return (
//       <Suspense fallback={null}>
//         <Content />
//       </Suspense>
//     );
//   };
// }


export function generatorComponent<P extends object>(
  generatorFn: (props: P) => AsyncGenerator<React.ReactNode, React.ReactNode>
) {
  return function GeneratedComponent(props: P) {
    const generator = generatorFn(props);

    async function Content() {
      const { value, done } = await generator.next();
      
      if (done) {
        return value
      }
      return (
        <Suspense fallback={value}>
          <Content />
        </Suspense>
      );
    }

    return (
      <Content />
    );
  };
}