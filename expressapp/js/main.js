function validateDates() {
            const dateTB = document.getElementById("dateTB").value;
            const dateTBNext = document.getElementById("dateTBNext").value;
            const dateMed = document.getElementById("dateMed").value;
            const dateMedNext = document.getElementById("dateMedNext").value;

            if (dateTB && dateTBNext) {
                if (new Date(dateTBNext) < new Date(dateTB)) {
                    alert("Дата следующей проверки не может быть позже даты предыдущей проверки!");
                    return false; // Предотвращаем отправку формы
                }
            }
            if (dateMed && dateMedNext) {
                if (new Date(dateMedNext) < new Date(dateMed)) {
                    alert("Дата следующей медицинской проверки не может быть позже даты предыдущей проверки!");
                    return false; // Предотвращаем отправку формы
                }
            }
                return true; // Позволяем отправку формы
    
        }