const promise1 = new Promise((resolve) => {
    setTimeout(resolve, 500, "Hello");
});
const promise2 = new Promise((resolve) => {
    setTimeout(resolve, 100, "World");
});
Promise.race([promise1, promise2])
    .then(value => console.log(value))       // Hello
    .catch(error => console.log(error));