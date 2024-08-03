//SecureKey generator
const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('.data-lengthNumber');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('.data-copy');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength = 8;
let checkCount = 0;
//called handleslider because need to update initial value of password i.e 10
handleSlider();
setIndicator("#CCC");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
}

function getRanInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
//Below functions generate randomvalues with this function
}
function generateRandomNumber(){
    return getRanInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRanInteger(97,123));

}
function generateUppercase(){
    return String.fromCharCode(getRanInteger(65,91));
}
function generateSymbol(){
    const randNum = getRanInteger(0,symbol.length);
    return symbol.charAt(randNum);
}


function calcStrength() {
    //initiallly considered all checkbox as unmarked
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    //checked All checkboxes
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

//async function foer copying
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'Copied';
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //shufilling password using Fishers yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//update checkcount
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
        
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
  
}
//Event change in checkbox 
allCheckBox.forEach(  (checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener("input",(e) => {
    passwordLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})
//for grnerating Password
generateBtn.addEventListener('click', () => {
    //None of the checkbox are selected
    if(checkCount == 0)
        return;
    //updating password length if length is less than checked checkbox
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("starting the journey");
    //removing old password before generating new password
    password = "";

    //Generate Password Based on checkboxes
    let funArr = [];
    if(uppercaseCheck.checked){
        funArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowercase);
    }
    if (numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked){
        funArr.push(generateSymbol);
    }
    console.log("Compulsary Addition Done");
    //compulsary Addition
    for(let i=0;i<funArr.length;i++){
        password += funArr[i]();
    }
    console.log("Remainnig Addition Done");
    //remaining Password 
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIndex = getRanInteger(0,funArr.length);
        password += funArr[randIndex]();
    }
    console.log("Shuffiling Done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("UI  Done");
    //show in UI
    passwordDisplay.value = password;
    calcStrength();

})