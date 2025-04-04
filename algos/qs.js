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
    msg.innerHTML = "Enter Your Array or Create Random array for Quick Sort";
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

async function quickSort(array, low, high) {
    if (low < high) {
        let pi = await partition(array, low, high);
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    }
}

async function partition(array, low, high) {
    let pivot = array[high];
    let i = (low - 1);
    let barss = document.getElementsByClassName("bars");
    barss[high].style.backgroundColor = "red";
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            barss[i].style.height = (array[i] / Math.max(...array)) * 100 + "%";
            barss[i].innerHTML = array[i];
            barss[j].style.height = (array[j] / Math.max(...array)) * 100 + "%";
            barss[j].innerHTML = array[j];
            barss[i].style.backgroundColor = "brown";
            barss[j].style.backgroundColor = "brown";
            await sleep(speed);
        }
        for (let k = low; k < high; k++) {
            barss[k].style.backgroundColor = "#fec53c";
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    barss[i + 1].style.height = (array[i + 1] / Math.max(...array)) * 100 + "%";
    barss[i + 1].innerHTML = array[i + 1];
    barss[high].style.height = (array[high] / Math.max(...array)) * 100 + "%";
    barss[high].innerHTML = array[high];
    barss[i + 1].style.backgroundColor = "brown";
    barss[high].style.backgroundColor = "brown";
    await sleep(speed);

    for (let k = low; k <= high ; k++) {
        barss[k].style.backgroundColor = "#fec53c";
    }
    return i + 1;
}


sort_button.addEventListener("click", async function () {
    let inputString = input_nums.value;
    let numbers = inputString.split(",").map(Number);

    if (!numbers.every(Number.isInteger)) {
        alert("Please enter comma-separated numbers only.");
        return;
    }
    renderBars(numbers);
    await quickSort(numbers,0,numbers.length-1);
});
