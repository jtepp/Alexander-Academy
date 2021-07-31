class Result {
    constructor(obj) {
        this.id = obj.id;
        this.lower = obj.lower;
        this.higher = obj.higher;
    }
}

const grph = document.getElementById("gr1")

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

// grph.onclick = function (e) {
//     const base = grph.getAttribute("base")
//     const top = grph.getAttribute("top")
//     const scale = (top - base) / graphSize("gr1", "height")

//     if (!this.classList.contains("opened")) { //if not opened, open it
//         for (let p of document.getElementsByClassName("point-range")) {
//             const id = p.getAttribute("id")
//             console.log(id)
//             p.style.height = `${(allResults[id].higher - allResults[id].lower) * scale}px`
//         }
//         grph.classList.add("opened")
//     } else { //if opened, close it
//         for (let p of document.getElementsByClassName("point-range")) {
//             p.style.height = `0px`
//         }
//         grph.classList.remove("opened")
//     }
// }

for (let b of document.getElementsByClassName("test-button")) {

    b.onclick = function (e) {
        if (b.id == "reset") {
            closeGraph("gr1")
        } else {
            document.documentElement.style = "--graph-transition: " + e.target.getAttribute("transition") + ";"

            openGraph("gr1")


        }
    }
}


function returnDataElement(result, isAvg) {
    const base = grph.getAttribute("base")
    const top = grph.getAttribute("top")

    const scale = (top - base) / graphSize("gr1", "height")

    const cont = document.createElement("div")
    cont.className = "point-cont" + (isAvg ? " avg" : "")
    cont.style.width = graphSize("gr1", "width") / allResults.length + "px"

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

function openGraph(gId) {
    const cGraph = document.getElementById(gId)
    const base = cGraph.getAttribute("base")
    const top = cGraph.getAttribute("top")
    const scale = (top - base) / graphSize(gId, "height")

    if (!cGraph.classList.contains("opened")) { //if not opened, open it
        for (let p of document.querySelectorAll("#" + gId + " .point-range")) {
            const id = p.getAttribute("id")
            console.log(id)
            p.style.height = `${(allResults[id].higher - allResults[id].lower) * scale}px`
        }
        cGraph.classList.add("opened")
        //     }
    } else {
        closeGraph(gId)
        setTimeout(() => openGraph(gId), 1000)
    }
}

function closeGraph(gId) {
    for (let p of document.querySelectorAll("#" + gId + " .point-range")) {
        p.style.height = `0px`
    }
    document.getElementById(gId).classList.remove("opened")
}

// return average value of array
function average(array) {
    return array.reduce((a, b) => a + b) / array.length
}

function graphSize(id, prop) {
    return window.getComputedStyle(document.querySelector("#" + id))[prop].replace(/px/g, "")
}