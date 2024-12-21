const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols= '~!@#$%^&*()_+=:";<>,.?/'

function shufflePassword(array){
    //Fisher Yates Method

    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}



let password="";
let passwordLength=10;
let checkCount=1;
handleSlider();
//set strenght circle color to grey
setIndicator("#ccc");

//set passwordLength 
function handleSlider(){
inputSlider.value=passwordLength;
lengthDisplay.innerText=passwordLength;
//extra thing
const min=inputSlider.min;
const max=inputSlider.max;
inputSlider.style.backgroundSize=( (passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow khud se daal
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function geRndInteger(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return geRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(geRndInteger(97,123));
}
function generateUpperCase(){
return String.fromCharCode(geRndInteger(65,91));
}
 
function generateSymbol(){
const randNum=geRndInteger(0,symbols.length);
return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasSym=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum||hasSym)&&passwordLength>=8){
        setIndicator("red");
    }
    else if((hasLower||hasUpper)&&(hasNum||hasSym)&& passwordLength>=6 ){
        setIndicator("green");
    }
    else{
        setIndicator("black");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='Copied';
    }
    catch(e){
    copyMsg.innerText='Failed';
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
    copyMsg.classList.remove("active");
    copyMsg.innerText='';
    },2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checbox)=>{
        if(checbox.checked)
            checkCount++;
    });

    //special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();}
}

allCheckBox.forEach((checbox)=>{
    checbox.addEventListener('change',handleCheckBoxChange);
})



inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
});


generateBtn.addEventListener('click',()=>{

//none of the checkbox selected
handleCheckBoxChange();
if(checkCount<=0)return;

if(passwordLength<=checkCount){
    passwordLength=checkCount;
    handleSlider();
}

//let's start the journey to find the new password
console.log("Starting the journey");
//remove old password
password="";

//let's put stuff mentioned by checkboxes

// if(uppercaseCheck.checked){
//     password+=generateUpperCase();
// }
// if(lowercaseCheckcaseCheck.checked){
//     password+=generateLowerCase();
// }
// if(numberCheck.checked){
//     password+=generateRandomNumber();
// }
// if(symbolCheck.checked){
//     password+=generateSymbol();
// }


let funcArr=[];

if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);
if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);
if(numberCheck.checked)
    funcArr.push(generateRandomNumber);
if(symbolCheck.checked)
    funcArr.push(generateSymbol);

//compulsary addition
for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
}
console.log("compulsary addition done");
// remaining addition
for(i=0;i<passwordLength-funcArr.length;i++){
let randIndex=geRndInteger(0,funcArr.length);
password+=funcArr[randIndex]();
}
console.log("remaining addition done");

//shuffle the password
password=shufflePassword(Array.from(password));

//show in UI
passwordDisplay.value=password;

//calculate strength and show it
calcStrength();
})

