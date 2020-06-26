function add(n1: number, n2: number) {
  return n1 + n2;
}

function printResult(num: number) {
  console.log('Result ' + num);
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  cb(result);
}

printResult(add(2, 12));

//how to declare a function
let combineValues: (a: number, b: number) => number;

combineValues = add;
// Pointing to print throws a compile error.
// combineValues = printResult;

addAndHandle(10, 20, result => {
  console.log(result);
});
