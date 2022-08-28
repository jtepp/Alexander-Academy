class Staff {
    constructor(index, name, availability) {
        this.index = index;
        this.name = name;
        this.availability = availability;
        this.ref = undefined
    }

    element() {
        const name = document.createElement('div');
        name.classList.add('staff-name');
        name.innerHTML = this.name;
        name.setAttribute('is-available', false);
        this.ref = name;
        return name
    }
}

let staffArray = []
const cont = document.getElementById('container')
let z = [...Array(100).keys()]

z.forEach(i => {
    const s = new Staff(i, `Staff ${i}`, {
        monday: {
            evening: chance(30)
        },
        tuesday: {
            evening: chance(30)
        },
        wednesday: {
            evening: chance(30)
        },
        thursday: {
            evening: chance(30)
        },
        friday: {
            evening: chance(30)
        },
        saturday: {
            morning: chance(30),
            afternoon: chance(30),
            evening: chance(30)
        },
        sunday: {
            morning: chance(30),
            afternoon: chance(30),
            evening: chance(30)
        }
    })
    staffArray.push(s)
    cont.appendChild(s.element())

})

const monday = document.getElementById('monday'),
    tuesday = document.getElementById('tuesday'),
    wednesday = document.getElementById('wednesday'),
    thursday = document.getElementById('thursday'),
    friday = document.getElementById('friday'),
    saturday = document.getElementById('saturday'),
    sunday = document.getElementById('sunday')
const weekdays = [monday, tuesday, wednesday, thursday, friday],
    weekends = [saturday, sunday],
    alldays = [...weekdays, ...weekends]
const morning = document.getElementById('morning'),
    afternoon = document.getElementById('afternoon'),
    evening = document.getElementById('evening')
const days = document.getElementById('days'),
    times = document.getElementById('times')
const go = document.getElementById('go'),
    today = document.getElementById('today')

today.onclick = () => {
    const t = getToday()

    document.querySelector('[value="' + t.day + '"').checked = true
    document.querySelector('[value="' + t.time + '"').checked = true

    if (t.day != 'saturday' && t.day != 'sunday') {
        morning.disabled = true
        afternoon.disabled = true
    } else {
        morning.disabled = false
        afternoon.disabled = false
    }
}

alldays.forEach(d => {
    d.onclick = (e) => {
        if (e.target.value != 'saturday' && e.target.value != 'sunday') {
            morning.disabled = true
            afternoon.disabled = true
        } else {
            morning.disabled = false
            afternoon.disabled = false
        }
    }
})

go.onclick = () => {
    const checked = document.querySelectorAll(":checked")
    staffArray.forEach(s => {
        if (isAvailable(s, {
                day: checked[0].value,
                time: checked[1].value
            })) {
            s.ref.setAttribute('is-available', true)
        } else {
            s.ref.setAttribute('is-available', false)
        }
    })

}


function chance(pct) {
    return Math.floor(Math.random() * 100) < pct;
}

function getToday() {
    const d = new Date()
    const day = numToDay(d.getDay())
    const hour = d.getHours()
    let time;
    if (hour < 12) {
        time = 'morning'
    } else if (hour >= 12 && hour < 18) {
        time = 'afternoon'
    } else {
        time = 'evening'
    }
    return {
        day: day,
        time: time
    }
}

function numToDay(n) {
    switch (n) {
        case 0:
            return 'sunday'
        case 1:
            return 'monday'
        case 2:
            return 'tuesday'
        case 3:
            return 'wednesday'
        case 4:
            return 'thursday'
        case 5:
            return 'friday'
        case 6:
            return 'saturday'
    }
}

function isAvailable(staff, timeObj) {
    return staff.availability[timeObj.day][timeObj.time]
}