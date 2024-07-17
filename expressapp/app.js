const express = require("express");

// создаем объект приложения
const app = express();
// определяем обработчик для маршрута "/"
app.get("file:///C:/Users/37529/diploma/index.html", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!</h2>");
});
// начинаем прослушивать подключения на 3000 порту
app.listen(3000);