let score = 399
let target = 1460

const k1 = document.getElementById("kpi1");

let i = setInterval(increaseText, 1)

function increaseText() {
    k1.setAttribute("text", "Average SAT score: " + (score = score + 6))
    if (score >= target) {
        //     score = 1600 - 6
        //     increaseText()
        clearInterval(i)
        k1.setAttribute("text", "Average SAT score: " + target)
    }
}