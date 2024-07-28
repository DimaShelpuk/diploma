const blankDateTB = document.blank.dateTB;
const blankdateTBNext = document.blank.dateTBNext;
const submit = blank.submit;
submit.addEventListener("click", validate);

function validate(){
    if(blankDateTB.value > blankdateTBNext.value){
        blank.dateTB.setCustomValidity("Data is not valid");
    }
    
}