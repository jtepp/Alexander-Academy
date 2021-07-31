class Result {
    constructor(obj) {
        this.id = obj.id;
        this.lower = obj.lower;
        this.higher = obj.higher;
    }
}

const graphLength = 400;
const grd = document.getElementById("gr1-data")

let allResults = [];

(async function main() {

    await fetch("https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/graph/data.json").then(res => res.json()).then(json => {

        json.forEach(result => {
            allResults.push(new Result(result))
        })
    })


    allResults.forEach(result => {
        document.getElementById("gr1-data").appendChild(returnDataElement(result))
    })
})()

grd.onclick = function (e) {
    const base = grd.getAttribute("base")
    const top = grd.getAttribute("top")
    const scale = (top - base) / graphLength

    for (let p of document.getElementsByClassName("point-cont")) {
        const id = p.getAttribute("id")
        console.log(id)
        p.style.height = `${(allResults[id].higher - allResults[id].lower) * scale}px`
    }
}


function returnDataElement(result) {
    const base = grd.getAttribute("base")
    const top = grd.getAttribute("top")

    const scale = (top - base) / graphLength

    const point = document.createElement("div")
    point.classList.add("point-cont")
    point.setAttribute("id", result.id)
    point.style.left = `${calculateLeftOffest(allResults.indexOf(result))}px`
    point.style.bottom = `${(result.lower - base) * scale}px`


    let lower = document.createElement("div")
    lower.classList.add("point")
    lower.classList.add("lower")
    lower.setAttribute("value", result.lower)

    let higher = document.createElement("div")
    higher.classList.add("point")
    higher.classList.add("higher")
    higher.setAttribute("value", result.higher)

    point.appendChild(lower)
    point.appendChild(higher)

    return point
}


function calculateLeftOffest(index) {
    return (index + 1) * graphLength / (allResults.length)
}