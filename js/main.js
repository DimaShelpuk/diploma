const myForm = document.getElementById("blank");
myForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const formData = new FormData(blank);
 
    const xhr = new XMLHttpRequest();  
    xhr.onload = () => {
        if (xhr.status == 200) { 
            console.log(xhr.responseText);
        }
    };
    xhr.open("POST", "user", true);  
    xhr.send(formData);
});