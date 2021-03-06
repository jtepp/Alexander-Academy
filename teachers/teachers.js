class Tutor {
    constructor(obj) {
        this.name = obj.name
        this.about = obj.about
        this.aboutOrg = this.orgAbout()
        this.school = obj.school
        this.sat = (obj.satact || ",").split(",")[0]
        this.act = (obj.satact || ",").split(",")[1]
        this.ap5 = (obj.ap5 || "").split(",")
        this.subjectsArr = (obj.subjects || "").split(", ")
        this.subjects = this.orgSubs()
        this.imgurl = `https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/headshots/${imgfromname(obj.name)}_headshot.jpeg`
        this.altimgurl = `https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/headshots/${(obj.name.toLowerCase().includes("nadine") || obj.name.toLowerCase().includes("rocio")) || obj.role == "Admin" ? "blank" : (imgfromname(obj.name)+"_fun")}.jpeg`
        this.location = obj.location
        this.role = obj.role || "Tutor"
    }

    orgSubs() {
        let subs = {}

        if (this.subjectsArr.includes("")) {
            return ""
        }
        if (this.act != 0) {
            this.subjectsArr = ["ACT", ...this.subjectsArr]
        }

        if (this.sat != 0) {
            this.subjectsArr = ["SAT", ...this.subjectsArr]
        }

        this.subjectsArr.forEach(x => {
            if (subs[organizeSubject(x)] == null) {
                subs[organizeSubject(x)] = []
            }
            subs[organizeSubject(x)].push(x)
        })
        return subs
    }

    orgAbout() {
        let charCount = 0
        let main = []
        let more = []
        const maxChars = 245;

        for (let w of this.about.split(" ")) {
            if (charCount < maxChars) {
                main.push(w)
                charCount += w.length
            } else {
                more.push(w)
            }
        }
        return [main.join(" "), " " + more.join(" ")]
    }

    // constructor() {
    //     this.name = randomElement(["Emma Smith", "Clay Oxford", "Krystal McRae", "Sophia Smith", "Alexandria Ferguson", "Nora McRae", "Mia Smith", "Sophia Fine"])
    //     this.school = randomElement(["Yale", "Duke", "Georgia Tech", "Harvard", "Columbia", "MIT", "Stanford"])
    //     this.sat = Math.floor(150 + Math.random() * 1) * 10
    //     this.act = Math.floor(30 + Math.random() * 9)
    //     this.ap5 = ["Calculus", "Biology", "Forensics", "Psychology", "US History", "Chemistry", "Physics 1"]
    //     this.about = "Aradhya is a PhD student studying Quantitative Biosciences at Georgia Tech. Originally from New Jersey, Aradhya is an avid musician, playing both violin and guitar. He also enjoys reading and learning more about various subjects, including math and computer science.##Aradhya has been teaching SAT and ACT for more than four years and is the director of Alexander Academy???s yearly Math for College Workshop at Georgia Tech. He has also taught various high school subjects including chemistry, physics, and calculus. Aradhya finds teaching like a puzzle, finding new perspectives to better explain concepts. He enjoys seeing students quickly improve after they learn a new way to solve a problem."
    //     this.subjects = {
    //         "Math": randomSlice(["Algebra 1", "Algebra 2", "Calculus", "Geometry", "Linear Algebra"], 2),
    //         "English": randomSlice(["Creative Writing", "Shakespeare", "Literature", "Public Speaking", "Spelling"], 3),
    //         "Science": randomSlice(["Biology", "Chemistry", "Physics", "Biology"], 2),
    //         "History": [randomElement(["World History", "United States", "Civilizations"])],
    //         "SAT/ACT": [randomElement(["SAT", "ACT"])]
    //     }
    //     this.imgurl = "https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/Tutor" + Math.floor(Math.random() * 2 + 1) + ".png"
    //     this.altimgurl = "https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/alttutor.png"
    //     this.location = randomElement(["Atlanta", "Boston", "New York"])
    //     this.role = randomElement(["Tutor", "Admin"])
    // }

}

var chosenSubjects = []
var chosenTutors = []
var chosenSchools = []
var chosenLocations = []
var allSubjects = {}
var realAllSubjects = []
var allSchools = []
var allLocations = []
var allTutors = [] //make list of tutors
const urlSchool = new URLSearchParams(window.location.search).get("school") || "Selected.."

fetch("https://raw.githubusercontent.com/jtepp/Alexander-Academy/main/teachers/resources/staff.json").then(res => res.json()).then(json => {

    json.forEach(tutor => {
        const tt = new Tutor(tutor)
        allTutors.push(tt)
        // tt.subjects.forEach(subject => {
        //     if (!realAllSubjects.includes(subject)) {
        //         realAllSubjects.push(subject)
        //     }
        // })
    })

    processTutors(allTutors, true)
    filterTutors()
})

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


    } else if (!e.target.classList.toString().includes("filter") && !e.target.classList.contains("header-box")) { // Close all filters if target has nothing to do with filters
        for (let el of document.getElementsByClassName("filter-button")) {
            el.children[1].classList.remove("fmopen")
            el.children[1].classList.add("fmclosed")
        }
    }

    if (e.target.classList.contains("request-dropdown")) { // Click on request-dropdown button toggle request menu and turn others off

        for (let el of document.getElementsByClassName("request-dropdown")) {
            if (el.children.length > 1) {
                if (el.children[1] != e.target.children[1]) {
                    el.children[1].classList.remove("rmopen")
                    el.children[1].classList.add("rmclosed")
                }
            }
        }

        toggleClassOpenClosed(e.target.children[1], "rm")


    } else if (!e.target.classList.toString().includes("dropdown") && !e.target.classList.toString().includes("item") && !e.target.classList.contains("header-box")) {
        for (let el of document.getElementsByClassName("request-dropdown")) {
            if (el.children.length > 1) {
                el.children[1].classList.remove("rmopen")
                el.children[1].classList.add("rmclosed")
            }
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
            for (let h of e.target.parentNode.children) {
                if (h.classList.contains("filter-dropdown-header")) {
                    h.setAttribute('selected-inside', '')
                    h.setAttribute('all-selected', 'false')
                } else if (h.classList.contains("filter-item-container")) {
                    h.children[0].setAttribute('checked', 'false')
                }
            }

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
        } else if (e.target.id == "All-locations") {
            chosenLocations = []
            document.getElementById("Location").setAttribute("selected", "Online")
            for (let c of e.target.parentNode.children) {
                if (c != e.target)
                    c.children[0].setAttribute("checked", "false")
            }
        }


    } else if (e.target.classList.contains("filter-dropdown-header")) { // Click dropdown header to toggle 
        toggleClassOpenClosed(e.target.nextSibling, "fid")
    } else if (e.target.classList.contains("header-box")) { // toggle header checkbox and children
        toggleHeaderCheckbox(e.target)
    } else if (e.target.classList.contains("filter-item-container") && e.target.children[0].classList.contains("filter-item-checkbox")) { //click checkbox to toggle
        console.log(e.target.parentNode.parentNode.id.toLowerCase())
        toggleAttributeCheckBox(e.target.children[0], "checked", e.target.parentNode.parentNode.id.toLowerCase())
        for (let el of document.getElementsByClassName("request-item-checkbox")) {
            if (el.innerHTML == e.target.children[0].innerHTML) {
                toggleAttributeCheckBox(el, "checked", e.target.parentNode.parentNode.id.toLowerCase())
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
        toggleAttributeCheckBox(e.target.children[0], "checked", e.target.parentNode.parentNode.id.toLowerCase().replace("req", ""))
        console.log(true)

        for (let el of document.getElementsByClassName("filter-item-checkbox")) {
            if (el.innerHTML == e.target.children[0].innerHTML) {
                toggleAttributeCheckBox(el, "checked", e.target.parentNode.parentNode.id.toLowerCase().replace("req", ""))
                console.log(true)
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


    if (e.target.id == "reset-link") { // Click on reset button to reset all filters
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
        if (usage == "subjects" || usage == "subject") {
            removeElementFromArray(chosenSubjects, element.innerText)
        } else if (usage == "school") {
            removeElementFromArray(chosenSchools, element.innerText)
        } else if (usage == "tutor") {
            removeElementFromArray(chosenTutors, element.innerText)
        } else if (usage == "location") {
            removeElementFromArray(chosenLocations, element.innerText)
        }
    } else if (element.getAttribute(attr) == "false") {
        element.setAttribute(attr, "true")
        if (usage == "subjects" || usage == "subject") {
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
        } else if (usage == "location") {
            if (!chosenLocations.includes(element.innerText)) {
                chosenLocations.push(element.innerText)
            }
        }
    }
    if (usage == "subjects" || usage == "subject") {
        const header = element.parentNode.parentNode.previousSibling
        if (chosenSubjects.length == 0) {
            document.getElementById("Subject").setAttribute("selected", "All")
            document.getElementById("subjectdrop").setAttribute("selected", "All")
            document.getElementById("All-subjects").setAttribute("selected", "true")
            document.getElementById("All-subjectsreq").setAttribute("selected", "true")
            if (header.classList != null) {
                if (header.classList.toString().includes("-dropdown-header")) {
                    header.setAttribute("selected-inside", "")
                    header.setAttribute("all-selected", "false")
                }
            }
        } else {

            document.getElementById("Subject").setAttribute("selected", chosenSubjects.length < 2 ? chosenSubjects.join(", ") : `${chosenSubjects[0]},...`)
            document.getElementById("subjectdrop").setAttribute("selected", chosenSubjects.length < 2 ? chosenSubjects.join(", ") : `${chosenSubjects[0]},...`)
            document.getElementById("All-subjects").setAttribute("selected", "false")
            document.getElementById("All-subjectsreq").setAttribute("selected", "false")

            if (header.classList != null) {
                if (header.classList.toString().includes("-dropdown-header")) {
                    header.setAttribute("selected-inside", chosenSubjects.join(", "))
                    if ([...element.parentNode.parentNode.children].every(x => x.children[0].getAttribute("checked") == "true")) {
                        header.setAttribute("all-selected", "true")
                    } else {
                        header.setAttribute("all-selected", "false")
                    }
                }
            }
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
    } else if (usage == "location") {
        if (chosenLocations.length == 0) {
            document.getElementById("Location").setAttribute("selected", "Online")
        } else {
            document.getElementById("Location").setAttribute("selected", chosenLocations.length < 2 ? chosenLocations.join(", ") : `${chosenLocations[0]},...`)
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
        el.setAttribute('selected', 'Selected..')
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
        el.setAttribute('selected', 'Selected..')
    }
    for (let el of document.getElementsByClassName("request-item-checkbox")) {
        el.setAttribute('checked', 'false')
        chosenSubjects = []
    }

    for (let el of document.querySelectorAll("[all-selected]")) {
        el.setAttribute('all-selected', 'false')
    }
    for (let el of document.querySelectorAll("[selected-inside]")) {
        el.setAttribute('selected-inside', '')
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
    tutorImg.setAttribute("draggable", "false")

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
        if (!allLocations.includes(t.location)) { // if list doesnt have this location, add it
            if (t.location == "Boston" || t.location == "New York" || t.location == "Atlanta") {
                allLocations.push(t.location)
            }
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
            // if (s == "Essay") {
            //     continue
            // } else {
            c.appendChild(returnDropdownHeader(s))
            c.appendChild(returnDropdownItemsAdded(allSubjects[s]))
            sur.appendChild(returnDropdownHeader(s, true))
            sur.appendChild(returnDropdownItemsAdded(allSubjects[s], true))
            // }
        }
        // c.appendChild(returnDropdownCheck(allSubjects["Essay"]))
        sur.appendChild(returnDropdownCheck(allSubjects["Essay"], true))

        let s = document.getElementById("schools")
        s.innerHTML = ""
        s.appendChild(returnAllButton("schools"))
        // let tur = document.getElementById("tutorsreq")
        // tur.innerHTML = ""
        // tur.appendChild(returnAllButton("tutorsreq", true))
        // for (let tut of allTutors) { //req tutors
        // tur.appendChild(returnDropdownCheck(tut.name, true))
        // }
        for (let v of allSchools) { // schools
            s.appendChild(returnDropdownCheck(v))
        }
        let ef = document.getElementById("locations")
        ef.innerHTML = ""
        ef.appendChild(returnAllButton("locations", false, "Online"))
        for (let l of allLocations) { //locations
            ef.appendChild(returnDropdownCheck(l))
        }
        let er = document.getElementById("locationsreq")
        er.innerHTML = ""
        er.appendChild(returnAllButton("locationsreq", true, "Online"))
        for (let l of allLocations) { //locations
            er.appendChild(returnDropdownText(l, true))
        }
    }
    document.getElementById("filter-reset-line").children[0].innerHTML = `Viewing ${givenTutors.length} of ${allTutors.length} results.&nbsp;`

    if (initial) {
        // chosenSchools = [urlSchool]
        for (el of document.getElementById("schools").children) {
            if (el.children[0].innerText == urlSchool) {
                toggleAttributeCheckBox(el.children[0], "checked", "school")
                el.setAttribute('selected', 'true')
            }
        }
    }
}

function returnDropdownHeader(name, request) {
    let dropdownHeader = document.createElement("div")
    dropdownHeader.classList.add((request ? "request" : "filter") + "-dropdown-header")
    dropdownHeader.setAttribute('selected-inside', "")
    dropdownHeader.innerText = name
    let hb = document.createElement("div")
    hb.classList.add("header-box")
    dropdownHeader.appendChild(hb)
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

function returnDropdownText(name, request) {
    let schoolcont = document.createElement("div")
    schoolcont.classList.add((request ? "request" : "filter") + "-item-container")
    schoolcont.setAttribute("selected", "false")

    let schoolitem = document.createElement("div")
    schoolitem.classList.add((request ? "request" : "filter") + "-item-text")
    schoolitem.innerHTML = name

    schoolcont.appendChild(schoolitem)

    return schoolcont

}

function returnDropdownCheck(name, request) {
    let dcont = document.createElement("div")
    dcont.classList.add((request ? "request" : "filter") + "-item-container")
    dcont.setAttribute("selected", "false")

    let ditem = document.createElement("div")
    ditem.classList.add((request ? "request" : "filter") + "-item-checkbox")
    ditem.setAttribute("checked", "false")
    ditem.innerHTML = name

    dcont.appendChild(ditem)

    return dcont

}

function closeSheet() {
    document.getElementById("sheet-back").classList.remove("sopen")
    document.getElementById("sheet-back").classList.add("sclosed")
    for (let r of document.getElementsByClassName("red")) {
        r.classList.remove("red")
    }
    setTimeout(() => {
        document.getElementById("sheet-container").classList.remove("srequest")
        document.getElementById("sheet-container").classList.remove("sthanks")
        document.getElementById("sheet-container").classList.add("scontent")
        //clear request form
        for (let el of document.getElementsByClassName("request-box")) {
            if (el.id == "subjectdrop") {
                //its linked so leave it
            } else if (el.id == "locationdrop") {
                el.setAttribute("selected", "Online")

                for (let elem of el.children[1].children) {
                    if (elem.innerText == "Online") {
                        elem.setAttribute("selected", "true")
                    } else {
                        elem.setAttribute("selected", "false")
                    }
                }

            } else {
                el.innerText = ""
            }
        }
        document.getElementsByClassName("request-message")[0].value = ""
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

    about.innerHTML = ""

    about.setAttribute("read-more", "false")

    const abtMain = document.createElement("span")
    abtMain.innerText = tutor.aboutOrg[0]
    abtMain.classList.add("abt-main")

    const rmButton = document.createElement("div")
    rmButton.id = "read-more-button"
    rmButton.innerText = "Read More"
    rmButton.onclick = () => {
        about.setAttribute("read-more", "true")
    }

    const rlButton = document.createElement("span")
    rlButton.id = "read-less-button"
    rlButton.innerText = "Read Less"
    rlButton.onclick = () => {
        about.setAttribute("read-more", "false")
    }


    const abtMore = document.createElement("span")
    abtMore.innerText = tutor.aboutOrg[1] + " "
    abtMore.classList.add("abt-more")

    about.appendChild(abtMain)
    about.appendChild(rmButton)
    about.appendChild(abtMore)
    about.appendChild(rlButton)

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

    sat.innerHTML = ""

    if (tutor.sat != 0) {
        const satdiv = document.createElement("div")
        satdiv.innerHTML += `SAT ${tutor.sat}`

        sat.appendChild(satdiv)
    }

    if (tutor.act != 0) {
        const actdiv = document.createElement("div")
        actdiv.innerHTML += `ACT ${tutor.act}`

        sat.appendChild(actdiv)
    }

    // `${tutor.sat ? "SAT "+tutor.sat : ""}${(tutor.sat && tutor.act) ? "<br>" : ""}${tutor.act ? "ACT "+tutor.act : ""}`

    const ap5 = document.createElement("div")
    ap5.setAttribute("field", "AP 5's")
    ap5.innerText = tutor.ap5.map(a => "AP " + a).join(", ")


    if (tutor.sat != 0 && tutor.act != 0) {
        subjects.appendChild(sat)
    }

    if (tutor.ap5[0] != "") {
        subjects.appendChild(ap5)
    }

    if (tutor.subjects != "") {
        subjects.appendChild(ts)
    }

    document.getElementById("sheet-container").setAttribute("role", tutor.role)


}

function filterTutors() {
    const currentPeople = document.getElementById("People").getAttribute("selected")
    const currentSubject = document.getElementById("Subject").getAttribute("selected")
    const currentSchool = document.getElementById("School").getAttribute("selected")
    const currentLocation = document.getElementById("Location").getAttribute("selected")

    let givenTutors = allTutors.filter(tutor => {
        const tSchool = (currentSchool == "All" || currentSchool == "Selected..") ? true : chosenSchools.includes(tutor.school)
        const tSubjects = (currentSubject == "All" || currentSubject == "Selected..") ? true : chosenSubjects.every(subject => {
            return Object.values(tutor.subjects).flat().includes(subject)
        })
        const tLocation = (currentLocation == "Online" || currentLocation == "Selected..") ? true : chosenLocations.includes(tutor.location)
        const tPeople = (currentPeople == "All") ? true : ((currentPeople == "Selected..") ? tutor.role == "Tutor" : currentPeople == tutor.role)

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

function returnAllButton(idsuffix, request, alt) {
    const d = document.createElement("div")
    d.classList.add((request ? "request" : "filter") + "-item-container")
    d.setAttribute("selected", "true")
    d.id = "All-" + idsuffix

    const a = document.createElement("div")
    a.classList.add((request ? "request" : "filter") + "-item-text")
    a.innerHTML = alt || "All"

    d.appendChild(a)

    return d
}

function toggleHeaderCheckbox(el) {
    const header = el.parentNode
    let otherHeader;

    if (el.parentNode.classList.toString().includes("filter")) {
        for (let elem of document.getElementsByClassName("request-dropdown-header")) {
            if (elem.innerText == header.innerText) {
                otherHeader = elem
            }
        }
    } else if (el.parentNode.classList.toString().includes("request")) {
        for (let elem of document.getElementsByClassName("filter-dropdown-header")) {
            if (elem.innerText == header.innerText) {
                otherHeader = elem
            }
        }
    }

    if (header.getAttribute("selected-inside") == "") {
        header.setAttribute("selected-inside", allSubjects[header.innerText].join(", "))
        header.setAttribute("all-selected", "true")
        for (let c of header.nextSibling.children) {
            if (c.children[0].getAttribute("checked") == "false") {
                toggleAttributeCheckBox(c.children[0], "checked", "subjects")
            }
        }
        otherHeader.setAttribute("selected-inside", allSubjects[header.innerText].join(", "))
        otherHeader.setAttribute("all-selected", "true")
        for (let c of otherHeader.nextSibling.children) {
            if (c.children[0].getAttribute("checked") == "false") {
                toggleAttributeCheckBox(c.children[0], "checked", "subjects")
            }
        }
    } else {
        header.setAttribute("selected-inside", "")
        header.setAttribute("all-selected", "false")
        for (let c of header.nextSibling.children) {
            if (c.children[0].getAttribute("checked") == "true") {
                toggleAttributeCheckBox(c.children[0], "checked", "subjects")
            }
        }
        otherHeader.setAttribute("selected-inside", "")
        otherHeader.setAttribute("all-selected", "false")
        for (let c of otherHeader.nextSibling.children) {
            if (c.children[0].getAttribute("checked") == "true") {
                toggleAttributeCheckBox(c.children[0], "checked", "subjects")
            }
        }
    }
    console.log(header.getAttribute("selected-inside"))
}

function imgfromname(name) {
    const r = name.toLowerCase().split(" ").join("").replace(".", "").replace("gaorong(tommy)", "tommy")
    // console.log(r)
    return r
}


function organizeSubject(subject) {
    if (String(subject).toLowerCase().includes("algebra") || String(subject).toLowerCase().includes("calc") || String(subject).toLowerCase().includes("stat") || String(subject).toLowerCase().includes("calc") || String(subject).toLowerCase().includes("geometry")) {
        return "Math"
    } else if (String(subject).toLowerCase().includes("history") || String(subject).toLowerCase().includes("art")) {
        return "History"
    } else if (String(subject).toLowerCase().includes("biology") || String(subject).toLowerCase().includes("chemistry") || String(subject).toLowerCase().includes("physics") || String(subject).toLowerCase().includes("science") || String(subject).toLowerCase().includes("econ")) {
        return "Science"
    } else if (String(subject).toLowerCase().includes("essay")) {
        return "Essay Consulting"
    } else if (String(subject).toLowerCase().includes("english") || String(subject).toLowerCase().includes("latin") || String(subject).toLowerCase().includes("spanish") || String(subject).toLowerCase().includes("chinese") || String(subject).toLowerCase().includes("french")) {
        return "Language"
    } else if (String(subject).toLowerCase().includes("sat") || String(subject).toLowerCase().includes("act")) {
        return "SAT/ACT"
    } else {
        return "Other"
    }
}