function sum(x, y){ 
    return new Promise(function(resolve){
        const result = x + y;
        resolve(result);
    });
}

async function calculate(){
    const value = await sum(5, 3);
    console.log("Результат асинхронной операции:", value);
}
calculate();