const btn = document.getElementById("button")
const book = document.getElementById("book")
let closed = true

for (let p of document.getElementsByClassName("page")) {
    p.onclick = function (e) {
        if (p.id == "p3") {
            book.classList.toggle("flipped")
        } else {
            p.classList.toggle("flipped");
            for (let pel of document.getElementsByClassName("page")) {
                pel.classList.remove("top")
            }
            p.classList.add("top")
        }
    }
}

book.onclick = function (e) {
    closed = document.getElementsByClassName("flipped").length > 0
    if (closed) {
        btn.innerText = "Reset"
        btn.classList.add("reset-btn")
    } else {
        btn.innerText = "Click to open ⤵︎"
        btn.classList.remove("reset-btn")
    }
}

btn.onclick = function (e) {
    if (closed) {
        for (let p of document.getElementsByClassName("page")) {
            p.classList.remove("flipped")
            p.classList.remove("top")
        }
        document.getElementById("p1").classList.add("top")
        book.classList.remove("flipped")
        closed = false
        btn.innerText = "Click to open ⤵︎"
        btn.classList.remove("reset-btn")
    }
}