for (let el of document.querySelectorAll(".lb-image-button")) {
    el.onclick = function () {
        document.querySelector(':root').style.setProperty('--lb-img', `url("${el.getAttribute("src")}"`)
        for (let elem of document.getElementsByClassName("lb-image-button")) {
            elem.removeAttribute("selected")
        }
        for (let elem of document.querySelectorAll(`[src="${el.getAttribute("src")}"`)) {
            elem.setAttribute("selected", "")
        }
    }
}
document.querySelector(".lb-nav.right").onclick = function () {
    const curSelected = document.querySelector("[selected]")
    if (curSelected.nextElementSibling != null) {
        curSelected.nextElementSibling.click()
    } else {
        curSelected.parentNode.children[0].click()
    }
}

document.querySelector(".lb-nav.left").onclick = function () {
    const curSelected = document.querySelector("[selected]")
    if (curSelected.previousElementSibling != null) {
        curSelected.previousElementSibling.click()
    } else {
        curSelected.parentNode.children[curSelected.parentNode.children.length - 1].click()
    }
}

document.getElementById("lb1").onclick = function (e) {
    if (!e.target.classList.contains("lb-image-button") &&
        !e.target.classList.contains("lb-nav") &&
        !e.target.classList.contains("lb-thumbnails") &&
        !document.getElementById("popover-cont").classList.contains("show")) {
        console.log(e.target.classList)
        const pc = document.getElementById("popover-cont").classList
        pc.toggle("show")
        pc.toggle("hide")
    }
}

document.getElementById("popover-cont").onclick = function (e) {
    if (!e.target.classList.contains("lb-image-button") &&
        !e.target.classList.contains("lb-nav") &&
        !e.target.classList.contains("lb-thumbnails")
        //&& e.target.id != "lb2"
    ) {
        this.classList.toggle("show")
        this.classList.toggle("hide")
    }
}