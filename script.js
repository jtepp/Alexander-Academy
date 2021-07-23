class Tutor {
    //  constructor(name, school, sat, act, about, subjects) {
    //     this.name = name
    //     this.school = school
    //     this.sat = sat
    //     this.act = act
    //     this.about = about
    //     this.subjects = subjects
    // }
    constructor() {
        this.name = randomElement(["Emma Smith", "Clay Oxford", "Krystal McRae", "Sophia Smith", "Alexandria Ferguson", "Nora McRae", "Mia Smith", "Sophia Fine"])
        this.school = randomElement(["Yale", "Duke", "Georgia Tech", "Harvard", "Columbia", "MIT", "Stanford"])
        this.sat = Math.floor(150 + Math.random() * 1) * 10
        this.act = Math.floor(30 + Math.random() * 9)
        this.about = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua onsectetur adipiscing elit, sed do adipiscing elit, sed do eiusmod tempor incididu ut labore et dolore magna aliqua onsectetur ghnmm nmk"
        this.subjects = {
            "Math": randomSlice(["Algebra 1", "Algebra 2", "Calculus", "Geometry", "Linear Algebra"], 2),
            "English": randomSlice(["Creative Writing", "Shakespeare", "Literature", "Public Speaking", "Spelling"], 3),
            "Science": randomSlice(["Biology", "Chemistry", "Physics", "Biology"], 2),
            "History": [randomElement(["World History", "United States", "Civilizations"])],
            "SAT/ACT": [randomElement(["SAT", "ACT"])]
        }
        this.imgurl = "https://raw.githubusercontent.com/jtepp/allPurpose/Home/dist/alexander/Tutor" + Math.floor(Math.random() * 2 + 1) + ".png"
        this.altimgurl = "https://raw.githubusercontent.com/jtepp/allPurpose/Home/dist/alexander/alttutor.png"
        this.location = randomElement(["in-person", "online"])
        this.role = randomElement(["tutor", "admin"])
    }

}

var chosenSubjects = []
var chosenTutors = []
var chosenSchools = []
var allSubjects = {}
var allSchools = []
var allTutors = [...Array(Math.floor(16 + Math.random() * 10))].map(() => new Tutor()) //make list of tutors

processTutors(allTutors, true)
filterTutors()

document.body.onclick = function (e) {

    if (e.target.classList.contains("sopen")) {
        closeSheet()
    }

    if (e.target.classList.contains("sheet-request-tutor") && !e.target.classList.contains("disabled-button")) {
        if (document.getElementById("sheet-container").classList.contains("scontent")) { //go from content to request
            document.getElementById("sheet-container").classList.remove("scontent")
            document.getElementById("sheet-container").classList.add("srequest")
        } else if (document.getElementById("sheet-container").classList.contains("srequest")) { //go from request to thanks
            document.getElementById("sheet-container").classList.remove("srequest")
            document.getElementById("sheet-container").classList.add("sthanks")
        } else if (document.getElementById("sheet-container").classList.contains("sthanks")) { //go from thanks to content
            document.getElementById("sheet-container").classList.remove("sthanks")
            document.getElementById("sheet-container").classList.add("scontent")
        }
    } else if (e.target.classList.contains("sheet-request-tutor")) {

        const mandatoryFields = document.querySelectorAll("[field$='*']")
        // add empty box emphasis class
        mandatoryFields.forEach(qel => {
            if (qel.getAttribute("selected") == "Select..." || (qel.innerText == "" && qel.getAttribute("selected") == null)) {
                ["red", "unfilled-box"].forEach(x => qel.classList.add(x))
            }
        })
    }

    if (e.target.classList.contains("filter-button")) { // Click on filter button toggle filter menu and turn others off

        for (let el of e.target.parentNode.children) {
            if (el != e.target) {
                el.children[1].classList.remove("fmopen")
                el.children[1].classList.add("fmclosed")
            }
        }

        toggleClassOpenClosed(e.target.children[1], "fm")


    } else if (!e.target.classList.toString().includes("filter")) { // Close all filters if target has nothing to do with filters
        for (let el of document.getElementsByClassName("filter-button")) {
            el.children[1].classList.remove("fmopen")
            el.children[1].classList.add("fmclosed")
        }
    }

    if (e.target.classList.contains("request-dropdown")) { // Click on request-dropdown button toggle request menu and turn others off

        for (let el of document.getElementsByClassName("request-dropdown")) {
            if (el.children[1] != e.target.children[1]) {
                el.children[1].classList.remove("rmopen")
                el.children[1].classList.add("rmclosed")
            }
        }

        toggleClassOpenClosed(e.target.children[1], "rm")


    } else if (!e.target.classList.toString().includes("dropdown") && !e.target.classList.toString().includes("item")) {
        for (let el of document.getElementsByClassName("request-dropdown")) {
            el.children[1].classList.remove("rmopen")
            el.children[1].classList.add("rmclosed")
        }
    }


    if (e.target.classList.contains("filter-item-container") && e.target.children[0].classList.contains("filter-item-text")) { // Click on filter item text to change the text

        let newText = e.target.children[0].innerText

        e.target.parentNode.parentNode.setAttribute("selected", newText)

        if (e.target.id.includes("location")) {
            document.getElementById("locationdrop").setAttribute("selected", newText)

            for (let el of document.getElementById("locationdrop").children[1].children) {
                el.setAttribute("selected", false)
            }

            document.getElementById(e.target.id + "req").setAttribute("selected", true)

        }



        filterTutors()

        if (e.target.parentNode != null) {
            for (let el of e.target.parentNode.children) {
                el.setAttribute('selected', 'false')
            }
            e.target.setAttribute('selected', 'true')
        }

        if (e.target.id == "All-subjects") {
            chosenSubjects = []
            document.getElementById("Subject").setAttribute("selected", "All")
            document.getElementById("subjectdrop").setAttribute("selected", "All")

            for (let el of e.target.parentNode.children) {
                if (el.classList.contains("filter-item-dropdown")) {

                    for (let elem of el.children) {
                        elem.children[0].setAttribute("checked", "false")
                    }
                }
            }

            for (let el of document.getElementById(e.target.id + "req").parentNode.children) {
                if (el.classList.contains("request-item-dropdown")) {

                    for (let elem of el.children) {
                        elem.children[0].setAttribute("checked", "false")
                    }
                }
            }
            filterTutors()

        }
        if (e.target.id == "All-schools") {
            chosenSchools = []
            document.getElementById("School").setAttribute("selected", "All")
            for (let c of e.target.parentNode.children) {
                if (c != e.target)
                    c.children[0].setAttribute("checked", "false")
            }
        }


    } else if (e.target.classList.contains("filter-dropdown-header")) { // Click dropdown header to toggle 
        toggleClassOpenClosed(e.target.nextSibling, "fid")
    } else if (e.target.classList.contains("filter-item-container") && e.target.children[0].classList.contains("filter-item-checkbox")) { //click checkbox to toggle
        toggleAttributeCheckBox(e.target.children[0], "checked", (e.target.parentNode.classList.contains("filter-item-dropdown")) ? "subject" : "school")
        for (let el of document.getElementsByClassName("request-item-checkbox")) {
            if (el.innerHTML == e.target.children[0].innerHTML) {
                toggleAttributeCheckBox(el, "checked", "subject")
            }
        }

    }

    if (e.target.classList.contains("request-item-container") && e.target.children[0].classList.contains("request-item-text")) { // Click on request item text to change the text
        let newText = e.target.children[0].innerText

        e.target.parentNode.parentNode.setAttribute("selected", newText)


        for (let el of e.target.parentNode.children) {
            el.setAttribute("selected", false)
        }

        e.target.setAttribute("selected", true)

        // change filter stuff here too

        if (e.target.parentNode.parentNode.id == "locationdrop") {
            document.getElementById("Location").setAttribute("selected", newText)
            for (let el of document.getElementById("Location").children[1].children) {
                el.setAttribute("selected", false)
            }
            document.getElementById(e.target.id.replace("req", "")).setAttribute("selected", true)
        }

    }
    if (e.target.id == "All-subjectsreq") {
        chosenSubjects = []
        document.getElementById("Subject").setAttribute("selected", "All")
        document.getElementById("subjectdrop").setAttribute("selected", "All")

        for (let el of e.target.parentNode.children) {
            if (el.classList.contains("request-item-dropdown")) {

                for (let elem of el.children) {
                    elem.children[0].setAttribute("checked", "false")
                }
            }
        }

        for (let el of document.getElementById(e.target.id.replace("req", "")).parentNode.children) {
            if (el.classList.contains("request-item-dropdown")) {

                for (let elem of el.children) {
                    elem.children[0].setAttribute("checked", "false")
                }
            }
        }

        filterTutors()
    }
    if (e.target.id == "All-tutorsreq") {
        chosenTutors = []
        document.getElementById("tutordrop").setAttribute("selected", "All")
        for (let c of e.target.parentNode.children) {
            if (c != e.target)
                c.children[0].setAttribute("checked", "false")
        }
        filterTutors()
    }

    if (e.target.classList.contains("request-dropdown-header")) { // Click on dropdown to toggle
        toggleClassOpenClosed(e.target.nextSibling, "rid")
    } else if (e.target.classList.contains("request-item-container") && e.target.children[0].classList.contains("request-item-checkbox")) { //click checkbox to toggle
        toggleAttributeCheckBox(e.target.children[0], "checked", (e.target.parentNode.classList.contains("request-item-dropdown")) ? "subject" : "tutor")

        for (let el of document.getElementsByClassName("filter-item-checkbox")) {
            if (el.innerHTML == e.target.children[0].innerHTML) {
                toggleAttributeCheckBox(el, "checked", "subject")
            }
        }

    }



    //choosing a container option refreshes the button
    if (e.target.classList.contains("request-item-container")) {
        const mandatoryFields = document.querySelectorAll("[field$='*']")
        const allFilled = Object.values(mandatoryFields).map(x => !(x.getAttribute("selected") == "Select..." || (x.innerText == "" && x.getAttribute("selected") == null)))

        mandatoryFields.forEach(qel => {
            ["red", "unfilled-box"].forEach(x => qel.classList.remove(x))
        })

        if (allFilled.every(x => x)) {
            document.getElementById("sheet-request-tutor-request").classList.remove("disabled-button")
        } else {
            document.getElementById("sheet-request-tutor-request").classList.add("disabled-button")
        }
    }


    if (e.target.classList.contains("link-button")) { // Click on reset button to reset all filters
        setFalseExceptAll()
        filterTutors()
    }
}



document.body.oninput = function (e) { // checking that mandatory fields are filled
    const mandatoryFields = document.querySelectorAll("[field$='*']")
    const allFilled = Object.values(mandatoryFields).map(x => !(x.getAttribute("selected") == "Select..." || (x.innerText == "" && x.getAttribute("selected") == null)))

    mandatoryFields.forEach(qel => {
        ["red", "unfilled-box"].forEach(x => qel.classList.remove(x))
    })

    if (allFilled.every(x => x)) {
        document.getElementById("sheet-request-tutor-request").classList.remove("disabled-button")
    } else {
        document.getElementById("sheet-request-tutor-request").classList.add("disabled-button")
    }
}

function toggleClassOpenClosed(element, pre) {
    if (element.classList.contains(pre + "closed")) {
        element.classList.remove(pre + "closed")
        element.classList.add(pre + "open")
    } else {
        element.classList.add(pre + "closed")
        element.classList.remove(pre + "open")
    }
}


function toggleAttributeCheckBox(element, attr, usage) {
    if (element.getAttribute(attr) == "true") {
        element.setAttribute(attr, "false")
        if (usage == "subject") {
            removeElementFromArray(chosenSubjects, element.innerText)
        } else if (usage == "school") {
            removeElementFromArray(chosenSchools, element.innerText)
        } else if (usage == "tutor") {
            removeElementFromArray(chosenTutors, element.innerText)
        }
    } else {
        element.setAttribute(attr, "true")
        if (usage == "subject") {
            if (!chosenSubjects.includes(element.innerText)) {
                chosenSubjects.push(element.innerText)
            }
        } else if (usage == "school") {
            if (!chosenSchools.includes(element.innerText)) {
                chosenSchools.push(element.innerText)
            }
        } else if (usage == "tutor") {
            if (!chosenTutors.includes(element.innerText)) {
                chosenTutors.push(element.innerText)
            }
        }
    }
    if (usage == "subject") {
        if (chosenSubjects.length == 0) {
            document.getElementById("Subject").setAttribute("selected", "All")
            document.getElementById("subjectdrop").setAttribute("selected", "All")
            document.getElementById("All-subjects").setAttribute("selected", "true")
            document.getElementById("All-subjectsreq").setAttribute("selected", "true")
        } else {

            document.getElementById("Subject").setAttribute("selected", chosenSubjects.length < 2 ? chosenSubjects.join(", ") : `${chosenSubjects[0]},...`)
            document.getElementById("subjectdrop").setAttribute("selected", chosenSubjects.length < 2 ? chosenSubjects.join(", ") : `${chosenSubjects[0]},...`)
            document.getElementById("All-subjects").setAttribute("selected", "false")
            document.getElementById("All-subjectsreq").setAttribute("selected", "false")

        }
    } else if (usage == "school") {
        if (chosenSchools.length == 0) {
            document.getElementById("School").setAttribute("selected", "All")
            document.getElementById("All-schools").setAttribute("selected", "true")
        } else {
            document.getElementById("School").setAttribute("selected", chosenSchools.length < 2 ? chosenSchools.join(", ") : `${chosenSchools[0]},...`)
            document.getElementById("All-schools").setAttribute("selected", "false")
        }
    } else if (usage == "tutor") {
        if (chosenTutors.length == 0) {
            document.getElementById("tutordrop").setAttribute("selected", "All")
            document.getElementById("All-tutorsreq").setAttribute("selected", "true")
        } else {
            document.getElementById("tutordrop").setAttribute("selected", chosenTutors.length < 2 ? chosenTutors.join(", ") : `${chosenTutors[0]},...`)
            document.getElementById("All-tutorsreq").setAttribute("selected", "false")
        }
    }
    filterTutors()
}

function setFalseExceptAll(onlyCheckboxes) {
    for (let el of document.getElementsByClassName("filter-item-container")) {
        if (el.getAttribute("selected") == "true" && el.children[0].innerText != "All") {
            el.setAttribute('selected', 'false')
        }
    }
    //set all elements of filter-button to attribuute selected = All
    for (let el of document.getElementsByClassName("filter-button")) {
        el.setAttribute('selected', 'All')
    }
    for (let el of document.getElementsByClassName("filter-item-checkbox")) {
        el.setAttribute('checked', 'false')
        chosenSubjects = []
    }

    for (let el of document.getElementsByClassName("request-item-container")) {
        if (el.getAttribute("selected") == "true" && el.children[0].innerText != "All") {
            el.setAttribute('selected', 'false')
        }
    }
    //set all elements of request-dropdown to attribuute selected = All
    for (let el of document.getElementsByClassName("request-dropdown")) {
        el.setAttribute('selected', 'All')
    }
    for (let el of document.getElementsByClassName("request-item-checkbox")) {
        el.setAttribute('checked', 'false')
        chosenSubjects = []
    }

}


function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function returnTutor(tutor) {
    let tutorHtml = document.createElement("div")
    let tutorImg = document.createElement("img")

    tutorHtml.setAttribute('name', tutor.name)
    tutorHtml.setAttribute('school', tutor.school)
    tutorHtml.classList.add("tutor-cell")

    tutorImg.src = tutor.imgurl

    tutorHtml.appendChild(tutorImg)

    tutorHtml.onclick = () => {
        fillSheet(tutor)
        showSheet()
    }

    return tutorHtml
}

// initial param true enables filling all filter boxes
function processTutors(givenTutors, initial) { // Iterate through tutors to make fill list of schools and subjects, and place in HTML
    document.getElementById("tutor-container").innerHTML = ""
    for (let t of givenTutors) {
        if (!allSchools.includes(t.school)) { // if list doesnt have this school, add it
            allSchools.push(t.school)
        }
        for (let s in t.subjects) { // subjects
            for (let c of t.subjects[s]) { // classes
                if (allSubjects[s] == undefined) {
                    allSubjects[s] = []
                }
                if (!allSubjects[s].includes(c)) { // if list doesnt have this course, add it
                    allSubjects[s].push(c)
                }
            }
        }
        // add tutor html to tutor-container
        document.getElementById("tutor-container").appendChild(returnTutor(t))
    }
    if (initial) {
        let c = document.getElementById("subjects")
        c.innerHTML = ""
        c.appendChild(returnAllButton("subjects"))
        let sur = document.getElementById("subjectsreq")
        sur.innerHTML = ""
        sur.appendChild(returnAllButton("subjectsreq", true))
        for (let s in allSubjects) { // subjects
            c.appendChild(returnDropdownHeader(s))
            c.appendChild(returnDropdownItemsAdded(allSubjects[s]))
            sur.appendChild(returnDropdownHeader(s, true))
            sur.appendChild(returnDropdownItemsAdded(allSubjects[s], true))
        }

        let s = document.getElementById("schools")
        s.innerHTML = ""
        s.appendChild(returnAllButton("schools"))
        let tur = document.getElementById("tutorsreq")
        tur.innerHTML = ""
        tur.appendChild(returnAllButton("tutorsreq", true))
        for (let v of allSchools) { // schools
            s.appendChild(returnDropdownCheck(v))
        }
        for (let tut of allTutors) { //req tutors
            tur.appendChild(returnDropdownCheck(tut.name, true))
        }
    }
    document.getElementById("filter-reset-line").children[0].innerHTML = `Viewing ${givenTutors.length} of ${allTutors.length} results&nbsp;`
}

function returnDropdownHeader(name, request) {
    let dropdownHeader = document.createElement("div")
    dropdownHeader.classList.add((request ? "request" : "filter") + "-dropdown-header")
    dropdownHeader.innerText = name
    return dropdownHeader
}

function returnDropdownItemsAdded(classes, request) {
    let dropdown = document.createElement("div")
    dropdown.classList.add((request ? "request" : "filter") + "-item-dropdown")
    dropdown.classList.add((request ? "rid" : "fid") + "closed")

    for (let c of classes) {
        let classcont = document.createElement("div")
        classcont.classList.add((request ? "request" : "filter") + "-item-container")

        let classItem = document.createElement("div")
        classItem.classList.add((request ? "request" : "filter") + "-item-checkbox")
        classItem.innerHTML = c
        classItem.setAttribute("checked", "false")

        classcont.appendChild(classItem)

        dropdown.appendChild(classcont)
    }
    return dropdown
}

function returnDropdownText(name) {
    let schoolcont = document.createElement("div")
    schoolcont.classList.add("filter-item-container")
    schoolcont.setAttribute("selected", "false")

    let schoolitem = document.createElement("div")
    schoolitem.classList.add("filter-item-text")
    schoolitem.innerHTML = name

    schoolcont.appendChild(schoolitem)

    return schoolcont

}

function returnDropdownCheck(name, request) {
    let schoolcont = document.createElement("div")
    schoolcont.classList.add((request ? "request" : "filter") + "-item-container")
    schoolcont.setAttribute("selected", "false")

    let schoolitem = document.createElement("div")
    schoolitem.classList.add((request ? "request" : "filter") + "-item-checkbox")
    schoolitem.setAttribute("checked", "false")
    schoolitem.innerHTML = name

    schoolcont.appendChild(schoolitem)

    return schoolcont

}

function closeSheet() {
    document.getElementById("sheet-back").classList.remove("sopen")
    document.getElementById("sheet-back").classList.add("sclosed")
    setTimeout(() => {
        document.getElementById("sheet-container").classList.remove("srequest")
        document.getElementById("sheet-container").classList.remove("sthanks")
        document.getElementById("sheet-container").classList.add("scontent")
    }, 300)
}

function showSheet() {
    document.getElementById("sheet-back").classList.remove("sclosed")
    document.getElementById("sheet-back").classList.add("sopen")
}


function fillSheet(tutor) {
    // clear sheet
    const name = document.getElementById("sheet-name")
    const school = document.getElementById("sheet-school")
    const topimg = document.getElementById("sheet-pic-top")
    const altimg = document.getElementById("sheet-pic-alt")
    const about = document.getElementById("sheet-body-about")
    const subjects = document.getElementById("sheet-body-subjects")

    subjects.innerHTML = ""

    // fill sheet
    name.innerText = tutor.name
    school.innerText = `${tutor.school}`
    //${tutor.sat ? "   SAT "+tutor.sat : ""}${tutor.act ? "   ACT "+tutor.act : ""}
    topimg.src = tutor.imgurl
    altimg.src = tutor.altimgurl

    about.innerText = tutor.about

    // for (let s in tutor.subjects) {
    //     if (tutor.subjects[s].length > 0) {
    //         let cell = document.createElement("div")
    //         cell.innerHTML = tutor.subjects[s].join(", ")
    //         cell.setAttribute("subject", s)
    //         cell.classList.add("subject-cell")
    //         subjects.appendChild(cell)
    //     }
    // }

    const ts = document.createElement("div")
    ts.setAttribute("field", "Tutoring Subjects")
    ts.innerText = Object.values(tutor.subjects).flat().join(", ")

    const sat = document.createElement("div")
    sat.setAttribute("field", "SAT/ACTs")

    sat.innerHTML = `${tutor.sat ? "SAT "+tutor.sat : ""}${(tutor.sat && tutor.act) ? "<br>" : ""}${tutor.act ? "ACT "+tutor.act : ""}`

    subjects.appendChild(sat)
    subjects.appendChild(ts)

}

function filterTutors() {
    const currentPeople = document.getElementById("People").getAttribute("selected")
    const currentSubject = document.getElementById("Subject").getAttribute("selected")
    const currentSchool = document.getElementById("School").getAttribute("selected")
    const currentLocation = document.getElementById("Location").getAttribute("selected")

    let givenTutors = allTutors.filter(tutor => {
        const tSchool = currentSchool == "All" ? true : chosenSchools.includes(tutor.school)
        const tSubjects = currentSubject == "All" ? true : chosenSubjects.every(subject => {
            return Object.values(tutor.subjects).flat().includes(subject)
        })
        const tLocation = currentLocation == "All" ? true : currentLocation.toLowerCase() == tutor.location
        const tPeople = currentPeople == "All" ? true : currentPeople.toLowerCase() == tutor.role

        return (tSchool && tSubjects && tLocation && tPeople)
    })

    processTutors(givenTutors, false)
}

//function to return a random slice of an array
function randomSlice(arr, n) {
    let result = []
    while (result.length < n) {
        let index = Math.floor(Math.random() * arr.length)
        if (!result.includes(arr[index])) {
            result.push(arr[index])
        }
    }
    return result
}

//function to remove an element from an array
function removeElementFromArray(arr, elem) {
    let index = arr.indexOf(elem)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

function returnAllButton(idsuffix, request) {
    const d = document.createElement("div")
    d.classList.add((request ? "request" : "filter") + "-item-container")
    d.setAttribute("selected", "true")
    d.id = "All-" + idsuffix

    const a = document.createElement("div")
    a.classList.add((request ? "request" : "filter") + "-item-text")
    a.innerHTML = "All"

    d.appendChild(a)

    return d
}