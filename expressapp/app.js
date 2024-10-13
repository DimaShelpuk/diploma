const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql2");
const { format, parseISO } = require('date-fns');
const bcrypt = require('bcrypt');
const qr = require('qr-image');
const nodemailer = require('nodemailer');
const path = require('path');
const NodeWebcam = require('node-webcam');
const app = express();
app.set('view engine', 'ejs');
const PORT = 3000;


// Используем body-parser для парсинга данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'style')));
app.use(express.static(path.join(__dirname, 'photos')));
app.use(express.static('js'));

const webcam = NodeWebcam.create({});
const photosFolderPath = path.join(__dirname, 'photos');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "test",
    password: "potyer29061934F"
});

const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "test",
        password: "potyer29061934F"
});
    
const query = async (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

const genHash = (str) => { 
    return new Promise((resolve, reject) => {

        const salt = bcrypt.genSaltSync(10);
    
        const ToSave = bcrypt.hashSync(str, salt);
        
        // Hashing successful, 'hash' contains the hashed password
        console.log('Hashed date:', ToSave);
        resolve(ToSave);
    })
}

app.get("/", function (_, response) {
    response.sendFile(__dirname + "/admin.html");
});

app.get("/registration", function (_, response) {
    
    response.sendFile(__dirname + "/registration.html");
    
});
 
app.post('/regAdmin', async (req, res) => {
    
    const storedHashedPassword = "$2b$10$2ODPnE6c/5.aeUvI4LC.X.3wbfaspuq2EhSebwn8PH3Yw2nNiSrWa";
    const userInputPassword = req.body.hashpass;
    
    const userData = {
                    login: req.body.email,
                    password: req.body.password,
                    };
    
    const hashedDate = await genHash(userData.password);
    
    bcrypt.compare(userInputPassword, storedHashedPassword, (err, result) => {
            if (err) {
                // Handle error
                console.error('Error comparing passwords:', err);
                return;
            }

            if (result) {
                console.log('Hashed password:', hashedDate);

                userData.password = hashedDate;

                const userInfo = Object.values(userData);

                const sql = "INSERT INTO admin(login, password) VALUES(?, ?)";

                connection.connect(function(err){
                    if (err) {
                        return console.error("Ошибка: " + err.message);
                    }
                    console.log("Подключение к серверу MySQL для получения данных успешно установлено");
                });

                connection.query(sql, userInfo, function(err, results) {
                    if(err) console.log(err);
                    else console.log("Данные добавлены");
                });

                connection.end(function(err) {
                    if (err) {
                        return console.log("Ошибка: " + err.message);
                    }
                        console.log("Подключение закрыто");
                 });                
                
                res.render('successful');
            } else {
                console.log("Аутентификация не пройдена");
                res.render('fail');
            }
        });
});

app.post('/login', async (req, res) => {
    
    const user = { 
        email: req.body.email, 
        password: req.body.password
    };
    
    try {
        const results = await query('SELECT * FROM admin WHERE login = ?', [user.email]);

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        const storedHashedPassword = results[0].password;
        const userInputPassword = user.password;

        bcrypt.compare(userInputPassword, storedHashedPassword, (err, result) => {
            if (err) {
                // Handle error
                console.error('Error comparing passwords:', err);
                return;
            }

            if (result) {
                console.log("Аутентификация пройдена");
                res.sendFile(__dirname + "/index.html");
            } else {
                console.log("Аутентификация не пройдена");
                res.render('fail');
            }
        });
        
    } catch (err) {
        console.error("Ошибка: " + err.message);
        res.render('fail');
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

    // Подключение к базе данных
    connection.connect(function(err){
        if (err) {
            return console.error("Ошибка: " + err.message);
        } else {
            console.log("Подключение к серверу MySQL успешно установлено");
        }
    });

    const sql = "INSERT INTO users(name, worktype, dicharge, electroGroup, workshop, email, dateTB, dateTBNext, dateMed, dateMedNext, userTalon) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    const userInfo = Object.values(userData);

    const insertUser = (sql, userInfo) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, userInfo, function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve("Данные добавлены");
                }
            });
        });
    };
    
    const generateQRCode = (url) => {
        try {
            const qrImageBuffer = qr.imageSync(url, { type: 'png' });
            return qrImageBuffer;
        } catch (err) {
            console.error(err);
            return null;
        }
    };
    
    const sendEmail = async (qrImageBuffer, email) => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port:465,
            secure: true,
            secureConnection: false,
            auth: {
              user: 'gressqrcode@mail.ru',
              pass: 'wEzduPF6FBWGYVWxGgax'
        }
    });
    
    let mailOptions = {
        from: 'gressqrcode@mail.ru',
        to: email,
        subject: 'QR Code GRES Electro station',
        text: 'Qr код вашего удостоверения по охране труда, с уважением ОНиОТ Берёзовской ГРЭС;)',
        attachments: [
        {
            filename: 'qr-code.png',
            content: qrImageBuffer, // Здесь мы уверены, что это буфер
            contentType: 'image/png' // Указание типа контента
        }
        ]
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    };
    
    // Функция для поиска ID пользователя
    const selectIdUser = (sql2, userArr) => {
        return new Promise((resolve, reject) => {
            connection.query(sql2, userArr, function(err, results) {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    };
    
    
    // Ожидание выполнения запроса
    insertUser(sql, userInfo)
        .then(result => {
            console.log(result); // Логируем результат
            const sql2 = "SELECT * FROM users WHERE name = ? AND email = ?";
            const userArr = [userData.userName, userData.email];

            return selectIdUser(sql2, userArr);
        })
    
        .then(result => {
            if (result.length > 0) {
                const id = result[0].id; // Получаем id пользователя
                
                console.log("ID найден:", id);
                const urlInfo = "http://localhost:3000/page/";
                const url = urlInfo + String(id);
                const email = userData.email;
                
                console.log(url + " |||| " + email);
                
                const qrImageBuffer = generateQRCode(url);
                
                // Генерируем QR-код
                if (qrImageBuffer) {
                    sendEmail(qrImageBuffer, email); // Отправляем email с QR-кодом
                } else {
                    console.log('Failed to generate QR Code');
                }
                
                
                const userid = {
                    photoID: id
                }
                
                res.render('startPhoto', { userid });
                
            } else {
                console.log("Пользователь не найден");
                connection.end(function(err) {
                    if (err) {
                        return console.log("Ошибка: " + err.message);
                    }
                    console.log("Подключение закрыто");
                });
            }
        })
        .catch(err => {
            console.log("Ошибка:", err);
        })
    
});


app.get('/page/:id', function (req, res) {
    try {
        const id = parseInt(req.params.id);
        
        console.log(id);
        
        connection.connect(function(err){
            if (err) {
                throw err;
            }
            console.log("Подключение к серверу MySQL для получения данных успешно установлено");
        });
        
        const sql = "SELECT * FROM users WHERE id = ?";

        connection.query(sql, [id], (err, results) => {
            if (err) {
                connection.end(function(err) {
                    if (err) {
                        console.log("Ошибка: " + err.message);
                    }
                    console.log("Подключение закрыто");
                });
                throw err;
            }
            
            if (results.length === 0) {
                connection.end(function(err) {
                    if (err) {
                        console.log("Ошибка: " + err.message);
                    }
                    console.log("Подключение закрыто");
                });
                throw new Error('Пользователь не найден');
            }

            const user = results[0];
            
            function dateTransform(str) {
                let date = new Date(str);
                return format(date, 'yyyy-MM-dd');
            }
            
            const dateArray = [dateTransform(user.dateTB), dateTransform(user.dateTBNext), dateTransform(user.dateMed),  dateTransform(user.dateMedNext)];
            
            const filePhoto = "face" + id + ".jpg";
            
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
                userTalon: user.userTalon,
                fileName: filePhoto
            };
            
            console.log(userData);
            
            res.render('app', { userData });
            
            connection.end(function(err) {
                if (err) {
                    console.log("Ошибка: " + err.message);
                }
                console.log("Подключение закрыто");
            });
            
        });
    } catch (err) {
        res.status(500).send('Ошибка: ' + err.message);
    }
});

app.get('/photo/:id', function (req, res) {
    const numPicture = parseInt(req.params.id);
    const fileName = "face" + numPicture + ".jpg";

    webcam.capture(path.join(photosFolderPath, fileName), (err, data) => {
        if (err) {
          res.status(500).send('Error capturing image');
        } else {
            
          const userObj = { 
              number: numPicture,
              fileName: fileName
          };
          res.render('selectPhoto', { userObj });
        }
    });
});



// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});