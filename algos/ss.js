let msg=document.getElementById("span_in_selectionsort");
let first_run=true;

let speed_control = document.getElementById("algo-speed");
let speed = (32 - speed_control.value) * 100;

speed_control.addEventListener("input", () => {
    speed = (32 - speed_control.value) * 100;
});

let random_array_generate = document.getElementById("random_arr_button");
random_array_generate.addEventListener("click", () => {
    let randomArray = generateRandomArray(13, 50);
    document.getElementById('input_nums').value = randomArray.join(',');
});

let visual = document.getElementById("visual"); // Fix: Define visual

function generateRandomArray(size, max) {
    let arr = [];
    while (arr.length < size) {
        let num = Math.floor(Math.random() * max) + 1;
        if (!arr.includes(num) && num > 5) {
            arr.push(num);
        }
    }
    return arr;
}

if(first_run){
    msg.style.fontSize = "20px";
    msg.style.fontWeight = "500";
    msg.style.padding = "20px";
    msg.style.marginTop = "54px";
    msg.innerHTML = "Enter Your Array or Create Random array for Selection Sort";
}


function renderBars(array) {
    visual.innerHTML = ""; // Clear existing bars
    let containerWidth = visual.clientWidth;
    let barWidth = ((containerWidth) / array.length) - 2;
    let maxValue = Math.max(...array);

    for (let i = 0; i < array.length; i++) {
        let bars = document.createElement("div");
        bars.classList.add("bars");
        let barHeightPercent = (array[i] / maxValue) * 100;
        bars.style.height = barHeightPercent + "%";
        bars.style.width = barWidth + "px";
        bars.style.backgroundColor = "#fec53c";
        bars.innerHTML = array[i];
        bars.style.color = "white";
        visual.appendChild(bars);
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function selectionSort(array) {
    renderBars(array);
    let sso_bars = document.getElementsByClassName("bars");
    let l = array.length;

    for (let i = 0; i < array.length; i++) {
        var min_idx = i;
        for (let j = i + 1; j < array.length; j++) {
            for (let k = i; k < sso_bars.length; k++) {
                if (k !== j && k !== min_idx && k < l) {
                    sso_bars[k].style.backgroundColor = "brown";
                }
            }
            if (array[min_idx] > array[j]) {
                min_idx = j;
            }
        }
        
        let temp = array[i];
        array[i] = array[min_idx];
        array[min_idx] = temp;

        let tempHeight = sso_bars[i].style.height;
        sso_bars[i].style.height = sso_bars[min_idx].style.height;
        sso_bars[min_idx].style.height = tempHeight;
        sso_bars[min_idx].innerHTML = array[min_idx];
        sso_bars[i].innerHTML = array[i];
        sso_bars[i].style.backgroundColor = "#feb737";
        sso_bars[min_idx].style.backgroundColor = "#feb737";

        await sleep(speed);
        
        sso_bars[i].style.backgroundColor = "#2fb45d";

        await sleep(speed);
    }
    sso_bars[0].style.backgroundColor = "#2fb45d";
}


sort_button.addEventListener("click", async function () {
    let inputString = input_nums.value;
    let numbers = inputString.split(",").map(Number);

    if (!numbers.every(Number.isInteger)) {
        alert("Please enter comma-separated numbers only.");
        return;
    }
    renderBars(numbers);
    await selectionSort(numbers,0,numbers.length-1);
});
