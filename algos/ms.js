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
    msg.innerHTML = "Enter Your Array or Create Random array for Merge Sort";
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

async function mergeSort(array, start, end) {
    if (start < end) {
        let mid = Math.floor((start + end) / 2);

        await mergeSort(array, start, mid);
        await mergeSort(array, mid + 1, end);

        await merge(array, start, mid, end);
    }
}

async function merge(array, start, mid, end) {
    let n1 = mid - start + 1;
    let n2 = end - mid;

    let left = new Array(n1);
    let right = new Array(n2);

    for (let i = 0; i < n1; i++)
        left[i] = array[start + i];
    for (let j = 0; j < n2; j++)
        right[j] = array[mid + 1 + j];

    let i = 0, j = 0, k = start;
    let barss = document.getElementsByClassName("bars");

    while (i < n1 && j < n2) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            barss[k].style.height = (left[i] / Math.max(...array)) * 100 + "%";
            barss[k].innerHTML = left[i];
            barss[k].style.backgroundColor = "brown";
            i++;
        } else {
            array[k] = right[j];
            barss[k].style.height = (right[j] / Math.max(...array)) * 100 + "%";
            barss[k].innerHTML = right[j];
            barss[k].style.backgroundColor = "brown";
            j++;
        }
        k++;
        await sleep(speed);
    }

    while (i < n1) {
        array[k] = left[i];
        barss[k].style.height = (left[i] / Math.max(...array)) * 100 + "%";
        barss[k].innerHTML = left[i];
        barss[k].style.backgroundColor = "brown";
        i++;
        k++;
        await sleep(speed);
    }

    while (j < n2) {
        array[k] = right[j];
        barss[k].style.height = (right[j] / Math.max(...array)) * 100 + "%";
        barss[k].innerHTML = right[j];
        barss[k].style.backgroundColor = "brown";
        j++;
        k++;
        await sleep(speed);
    }

    for (let i = start; i <= end; i++) {
        barss[i].style.backgroundColor = "#2fb45d";
    }
}

sort_button.addEventListener("click", async function () {
    let inputString = input_nums.value;
    let numbers = inputString.split(",").map(Number);

    if (!numbers.every(Number.isInteger)) {
        alert("Please enter comma-separated numbers only.");
        return;
    }
    renderBars(numbers);
    await mergeSort(numbers, 0, numbers.length - 1);
});
