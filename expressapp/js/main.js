const form = document.getElementById('blank');
form.addEventListener('submit', saveArticle);

function saveArticle (event) {
    event.preventDefault();
    const myFormData = new FormData(form);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/check-user");
    xhr.send(myFormData);
    
}