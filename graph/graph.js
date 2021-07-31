class Result {
    constructor(obj) {
        this.id = obj.id;
        this.lower = obj.lower;
        this.higher = obj.higher;
    }
}

const graphLength = 400;
const grd = document.getElementById("gr1")

let allResults = [];

(async function main() {

    await fetch("https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/graph/data.json").then(res => res.json()).then(json => {

        json.forEach(result => {
            allResults.push(new Result(result))
        })
    })

    const avg = new Result({ //made average object, id is the next index, so calling it will now be end index (-1)
        id: `${allResults.length}`,
        lower: average(allResults.map(result => result.lower)),
        higher: average(allResults.map(result => result.higher))
    })
    allResults.push(avg)
    allResults.forEach(result => {
        document.getElementById("gr1-data").appendChild(returnDataElement(result, result.id == `${allResults.length-1}`))
    })

})()

grd.onclick = function (e) {
    const base = grd.getAttribute("base")
    const top = grd.getAttribute("top")
    const scale = (top - base) / graphLength

    if (!this.classList.contains("opened")) { //if not opened, open it
        for (let p of document.getElementsByClassName("point-range")) {
            const id = p.getAttribute("id")
            console.log(id)
            p.style.height = `${(allResults[id].higher - allResults[id].lower) * scale}px`
        }
        grd.classList.add("opened")
    } else { //if opened, close it
        for (let p of document.getElementsByClassName("point-range")) {
            p.style.height = `0px`
        }
        grd.classList.remove("opened")
    }
}


function returnDataElement(result, isAvg) {
    const base = grd.getAttribute("base")
    const top = grd.getAttribute("top")

    const scale = (top - base) / graphLength

    const cont = document.createElement("div")
    cont.className = "point-cont" + (isAvg ? " avg" : "")
    cont.style.width = graphLength / allResults.length + "px"

    const range = document.createElement("div")
    range.classList.add("point-range")
    range.setAttribute("id", result.id)
    range.setAttribute("improvement", `+${result.higher - result.lower}`)
    range.style.bottom = `${(result.lower - base) * scale}px`


    let lower = document.createElement("div")
    lower.classList.add("point")
    lower.classList.add("lower")
    lower.setAttribute("value", result.lower)

    let higher = document.createElement("div")
    higher.classList.add("point")
    higher.classList.add("higher")
    higher.setAttribute("value", result.higher)

    range.appendChild(lower)
    range.appendChild(higher)

    cont.appendChild(range)

    return cont
}




// return average value of array
function average(array) {
    return array.reduce((a, b) => a + b) / array.length
}