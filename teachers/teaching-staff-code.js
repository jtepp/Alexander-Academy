document.body.onload = () => {
  const param = new URLSearchParams(window.location.search).get("school")

  if (param) {

    document.querySelectorAll('input').forEach((e) => {
      if (e.nextSibling) {
        if (e.nextSibling.innerText == param) {
          //document.querySelector('.select-button-div.school').click()

          //e.click()

          //document.querySelector('.select-button-div.school').nextSibling.children[0].setAttribute('data-selected', JSON.stringify([e.nextSibling.innerText]))

          //setDropdownText(document.querySelector('.select-button-div.school').nextSibling.children[0])

          clickCheckbox(document.querySelector('.select-button-div.school').nextSibling.children[0], e)
        }
      }
    })
    //setTimeout(() => {
    //document.querySelector('.select-button-div.school').click()
    //  }, 1)
  }

  // for displaying the right text in the filter dropdowns

  let filterClickCount = 0

  for (let f of document.getElementsByClassName('form')) {
    f.querySelectorAll('.check-box').forEach((b) => {
      b.onclick = () => { // when clicking filter checkbox
        // webflow is counting two clicks

        filterClickCount++
        if (filterClickCount % 2 == 0) {

          // do stuff for filter checkbox

          let checked = b.querySelector('input').checked
          let formSelected = JSON.parse(f.getAttribute('data-selected')) || []

          // if checked after click    
          if (checked) {
            formSelected.push(b.innerText)
          } else {
            removeFromArray(b.innerText, formSelected)
          }

          f.setAttribute('data-selected', JSON.stringify(formSelected))
          setDropdownText(f)

          // do stuff for request checkbox, only for location and subject
          if (f.classList.contains("filter-location") || f.classList.contains("filter-subject")) {
            document.querySelectorAll("#request-location>.dropdown-options, .rt--formdrop.request-subject").forEach((frm) => {
              frm.querySelectorAll("input").forEach((i) => {

                if (i.nextSibling.innerText == b.innerText) {
                  clickCheckbox(frm, i)
                }

              })
            })
          }



        }
      }

    })
  }


  let requestClickCount = 0

  for (let f of [...document.getElementsByClassName('dropdown-options'), ...document.querySelectorAll(".rt--formdrop>.ext-container")]) {
    f.querySelectorAll('.check-box').forEach((b) => {
      b.onclick = () => {
        // webflow is counting two clicks
        requestClickCount++
        if (requestClickCount % 2 == 0) {

          // do stuff for request checkbox
          const checked = b.querySelector('input').checked

          let form = f

          if (form.classList.contains("ext-container")) {
            form = form.parentNode
          }

          let formSelected = JSON.parse(form.getAttribute('data-selected')) || []

          // if checked after click    
          if (checked) {
            formSelected.push(b.innerText)
          } else {
            removeFromArray(b.innerText, formSelected)
          }

          form.setAttribute('data-selected', JSON.stringify(formSelected))
          setDropdownText(form)

          // do stuff for filter checkbox, only for location and subject

          // if (form.parentNode.id == "request-location" || form.classList.contains("request-subject")) {
          //   document.querySelectorAll(".form").forEach((frm) => {
          //     frm.querySelectorAll("input").forEach((i) => {

          //       if (i.nextSibling.innerText == b.innerText) {

          //         clickCheckbox(frm, i)
          //       }

          //     })
          //   })
          // }

        }
      }

    })
  }



  // close tabs if click off 

  document.body.onclick = (e) => {

    if (!(e.target.classList.contains("option-select") ||
        e.target.classList.contains("select-button-div") ||
        e.target.classList.contains("dropdown-form-block") ||
        e.target.classList.contains("check-box") ||
        e.target.classList.contains("ext-button") ||
        e.target.classList.contains("checkbox") ||

        (e.target.parentNode && (e.target.parentNode.classList.contains("ext-button") ||
          e.target.parentNode.classList.contains("select-button-div")))


      )) {


      document.querySelectorAll(".dropdown-form-block > form[style='display: block;']").forEach((el) => {
        el.parentNode.previousSibling.click()
      })

      document.querySelectorAll(".rt--formdrop[style='display: block;']").forEach((el) => {
        el.previousSibling.click()
      })
    }
  }


  document.querySelectorAll(".staff-item").forEach((e) => {

    e.setAttribute("onclick", "this.querySelector('.staff-popup').style.display = 'flex'")
  })


  // reset heading text and close all nested menus
  // also reset request forms
  document.querySelector(".filter-reset-master").onclick = () => {
    for (let f of document.querySelectorAll("form, .dropdown-options, .rt--formdrop")) {
      f.setAttribute("data-selected", "[]")
      const text = f.querySelector(".ext-container") != null && f.classList.contains("rt--formdrop") ? f.previousSibling.querySelector('p') : (f.parentNode.previousSibling && f.parentNode.previousSibling.querySelector('p'))
      if (text != null) {
        setDropdownText(f)
      }
    }

    document.querySelectorAll("[style*='rotateZ(0deg)']").forEach((e) => {
      e.click()
    })
  }


  document.querySelectorAll(".staff-item").forEach((e) => {
    let subjects = e.querySelector(".subjects-container").innerHTML.match(/>((?!<).+?)</g).map(s => s.replace("<", "").replace(">", ""))
    let school = e.querySelector(".school").innerText
    let location = e.querySelector(".hidden-location-text").innerText
    let html = e.outerHTML
    allStaff.push(new Staff(subjects, school, location, html))
  })

}



document.querySelector(".request-form-submit").onclick = (e) => {

  [...e.target.parentNode.querySelectorAll("[required]")].forEach((el) => {

    if (el.getAttribute("type") == "email") {
      if (!el.value.includes("@")) {
        incomplete(el)
      }
    } else if (el.value == "") {
      incomplete(el)
    }

  })

}




// close on bg click 

document.querySelectorAll(".staff-popup").forEach((el) => {
  el.setAttribute("onclick", "closePopupIfClassList(event)")
})

function closePopupIfClassList(event) {
  if (event.target.classList.contains('staff-popup')) {
    closePopup()
  }
}

document.querySelectorAll(".close").forEach((e) => {
  e.setAttribute("onclick", "closePopup()")
})

function incomplete(e) {
  e.classList.add("red-incomplete")
  e.classList.add("shake")
  setTimeout(() => {
    e.classList.remove("shake")
  }, 400)
}

// close forms and reset offset when click on background

// same thing for clicking on close button

document.querySelectorAll(".slide-to-request-form").forEach((e) => {
  e.setAttribute("onclick", "document.querySelector(':root').style.setProperty('--popup-offset', '-100vw')")
})

function closePopup() {
  document.querySelector(':root').style.setProperty("--popup-offset", "0vw")
  document.querySelectorAll(".staff-popup").forEach((e) => setTimeout(() => e.style.display = "none", 10))
}

function clickCheckbox(form, checkbox) {
  checkbox.checked = !checkbox.checked

  if (form.classList.contains("ext-container")) {
    form = form.parentNode
  }

  const checked = checkbox.checked
  let formSelected = JSON.parse(form.getAttribute('data-selected')) || []

  // if checked after click    
  if (checked) {
    formSelected.push(checkbox.nextSibling.innerText)
  } else {
    removeFromArray(checkbox.nextSibling.innerText, formSelected)
  }

  form.setAttribute('data-selected', JSON.stringify(formSelected))
  setDropdownText(form)
}

function removeFromArray(element, array) {
  let index = array.indexOf(element)
  if (index > -1) {
    array.splice(index, 1)
  }
}

function setDropdownText(form) { //form is .dropdown-options or .form or .rt--formdrop (only for .ext-container)
  const selected = JSON.parse(form.getAttribute('data-selected'))
  const text = form.querySelector(".ext-container") != null && form.classList.contains("rt--formdrop") ? form.previousSibling.querySelector('p') : form.parentNode.previousSibling.querySelector('p')


  if (selected.length > 0) {
    const maxlength = form.classList.contains("rt--formdrop") || form.classList.contains("dropdown-options") ? 21 : 14
    text.innerText = selected.join(", ").slice(0, maxlength)
    if (selected.join(", ").length > maxlength) {
      text.innerText += ".."
    }

  } else {
    if (text) {
      text.innerText = "Selected.."
    }
  }

  if ((form.classList.contains("rt--formdrop") || form.classList.contains("dropdown-options")) && selected.length == 0) {
    text.style.color = "#cbcbcb"
  } else {
    text.style.color = "#505050"
  }
}


function filterCollection() {
  let selectedSubjects = JSON.parse(document.querySelector(".filter-subject form").getAttribute("data-selected")) || []
  let selectedSchools = JSON.parse(document.querySelector(".filter-schools form").getAttribute("data-selected")) || []
  let selectedLocations = JSON.parse(document.querySelector(".filter-location form").getAttribute("data-selected")) || []


  $(".collection-list").empty()

  allStaff.filter((s) => {
    return (!selectedSubjects.every((ss) => ss == s.subjects) || selectedSubjects.length == 0) &&
      (selectedSchools.includes(s.school) || selectedSchools.length == 0) &&
      (selectedLocations.includes(s.location) || selectedLocations.length == 0)
  }).forEach((e) => {
    document.querySelector(".collection-list").innerHTML += e.html
  })

}