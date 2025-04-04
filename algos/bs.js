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
    msg.innerHTML = "Enter Your Array or Create Random array for Bubble Sort";
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

async function bubbleSort(array) {
    renderBars(array);
    let bso_bars = document.getElementsByClassName("bars");
    let l = array.length;

    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            for (let k = 0; k < bso_bars.length; k++) {
                if (k !== j && k !== j + 1 && k < l) {
                    bso_bars[k].style.backgroundColor = "brown";
                }
            }
            if (array[j] > array[j + 1]) {
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;

                let tempHeight = bso_bars[j].style.height;
                bso_bars[j].style.height = bso_bars[j + 1].style.height;
                bso_bars[j + 1].style.height = tempHeight;
                bso_bars[j].innerHTML = array[j];
                bso_bars[j + 1].innerHTML = array[j + 1];
                bso_bars[j].style.backgroundColor = "#feb737";
                bso_bars[j + 1].style.backgroundColor = "#feb737";

                await sleep(speed);
            }
        }
        l--;
        bso_bars[l].style.backgroundColor = "#2fb45d";

        await sleep(speed);
    }
    bso_bars[0].style.backgroundColor = "#2fb45d";
}

sort_button.addEventListener("click", async function () {
    let inputString = input_nums.value;
    let numbers = inputString.split(",").map(Number);

    if (!numbers.every(Number.isInteger)) {
        alert("Please enter comma-separated numbers only.");
        return;
    }
    renderBars(numbers);
    await bubbleSort(numbers);
});
