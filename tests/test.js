const box = document.getElementById('empty-box')
const b1 = document.getElementById('t1');
const b2 = document.getElementById('t2');
const b3 = document.getElementById('t3');

prep(b1, "shake-animation", 200)

prep(b2, "red")

// prep(b3, "unfilled-box")


function prep(el, an, timeout) {
    el.onclick = () => {
        box.classList.add(an)
        if (timeout) {
            setTimeout(() => {
                box.classList.remove(an)
            }, timeout)
        }
    }
}

b3.onclick = () => {
    if (box.classList.contains("unfilled-box")) {
        box.classList.add("bounce")
        setTimeout(() => {
            box.classList.remove("bounce")
        }, 100)
    }
    box.classList.add("unfilled-box")
}


document.body.oninput = () => {
    box.classList.remove("shake-animation")
    box.classList.remove("red")
    box.classList.remove("unfilled-box")
    box.classList.remove("bounce")
}