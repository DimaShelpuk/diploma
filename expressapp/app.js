const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;


// Используем body-parser для парсинга данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('style'))

app.get("/", function (_, response) {
    response.sendFile(__dirname + "/index.html");
});

// Обрабатываем POST-запросы на /check-user
app.post('/check-user', (req, res) => {
    const userData = {
        userName: req.body.userName,
        userPhone: req.body.userPhone,
        discharge: req.body.discharge,
        electroGroup: req.body.electroGroup,
        workshop: req.body.workshop,
        email: req.body.email,
        dateTB: req.body.dateTB,
        dateTBNext: req.body.dateTBNext,
        dateMed: req.body.dateMed,
        dateMedNext: req.body.dateMedNext,
        userTalon: req.body.userTalon,
    };

    // Здесь вы можете выполнять дополнительные действия, например, сохранять данные в БД
    console.log(userData);

    // Отправляем ответ
    res.render('app',{userData});
});

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});