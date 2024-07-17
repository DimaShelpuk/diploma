const form = document.getElementById('blank');
form.addEventListener('submit', saveArticle);

function saveArticle (event) {
    event.preventDefault();
    const myFormData = new FormData(form);
    for (let data of myFormData) {
        console.log(data);
    }
}