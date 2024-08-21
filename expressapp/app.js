const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const { format, parseISO } = require('date-fns');
const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;


// Используем body-parser для парсинга данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('style'));
app.use(express.static('js'));

const users = [
    { email: 'user@example.com', password: 'potyer29'} // Пример пользователя
];

app.get("/", function (_, response) {
    response.sendFile(__dirname + "/admin.html");
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Проверка данных пользователя
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Успешная аутентификация
        res.sendFile(__dirname + "/index.html");
    } else {
        // Неудачная аутентификация
        res.send('Неверная электронная почта или пароль.');
    }
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

    //  сохраняем данные в БД
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "test",
        password: "potyer29061934F"
        });
    
    // тестирование подключения
    
    connection.connect(function(err){
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        else{
        console.log("Подключение к серверу MySQL успешно установлено");
        }
    });
    
    const sql = "INSERT INTO users(name,  worktype, dicharge, electroGroup, workshop, email, dateTB, dateTBNext, dateMed, dateMedNext, userTalon) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const userInfo = Object.values(userData);
    
    
    connection.query(sql, userInfo, function(err, results) {
        if(err) console.log(err);
        else console.log("Данные добавлены");
    });
    
    console.log(userData);
    
    // закрытие подключения
    connection.end(function(err) {
        if (err) {
            return console.log("Ошибка: " + err.message);
        }
        console.log("Подключение закрыто");
        });
    

    // Отправляем ответ
    res.render('app',{userData});
});

app.get('/page/:id', function (req, res) {
    const id = parseInt(req.params.id);
    
    console.log(id);
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "test",
        password: "potyer29061934F"
    });
    
    connection.connect(function(err){
        if (err) {
            return console.error("Ошибка: " + err.message);
        }
        console.log("Подключение к серверу MySQL для получения данных успешно установлено");
    });

    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            connection.end();
            return res.status(500).send('Error fetching data');
        }
        
        if (results.length === 0) {
            connection.end();
            return res.status(404).send('User not found');
        }

        const user = results[0];
        
        function dateTransform(str) {
            let date = new Date(str);
            return format(date, 'yyyy-MM-dd');
        }
        
        const dateArray = [dateTransform(user.dateTB), dateTransform(user.dateTBNext), dateTransform(user.dateMed),  dateTransform(user.dateMedNext)];
        
        const userData = {
            userName: user.name,
            userPhone: user.worktype,
            discharge: user.dicharge,
            electroGroup: user.electroGroup,
            workshop: user.workshop,
            email: user.email,
            dateTB: dateArray[0],
            dateTBNext: dateArray[1],
            dateMed: dateArray[2],
            dateMedNext: dateArray[3],
            userTalon: user.userTalon
        };
        
        console.log(userData);
        
        connection.end(function(err) {
            if (err) {
                return console.log("Ошибка: " + err.message);
            }
            console.log("Подключение закрыто");
        });

        res.render('app', { userData });
    });
});



// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});