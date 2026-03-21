const API_URL = 'https://mpmc-project.onrender.com';

const parkingLot = document.getElementById('parking-lot');
const bookButton = document.getElementById('bookButton');
const messageEl = document.getElementById('message');

// ---------------- FETCH SLOTS ----------------
async function fetchSlots() {
    try {
        const res = await fetch(`${API_URL}/status`);
        const slots = await res.json();

        parkingLot.innerHTML = '';

        let allBooked = true;

        slots.forEach((isBooked, index) => {
            const slotDiv = document.createElement('div');
            const slotNumber = index + 1;

            slotDiv.classList.add('slot');

            if (isBooked) {
                slotDiv.classList.add('booked');
                slotDiv.textContent = `Slot ${slotNumber}`;

                // click to release
                slotDiv.onclick = () => releaseSlot(slotNumber);

            } else {
                slotDiv.classList.add('available');
                slotDiv.textContent = `Slot ${slotNumber}`;
                allBooked = false;
            }

            parkingLot.appendChild(slotDiv);
        });

        // Disable button if full
        bookButton.disabled = allBooked;

        if (allBooked) {
            messageEl.textContent = "Parking Full";
            messageEl.style.color = "red";
        } else {
            messageEl.textContent = "";
        }

    } catch (err) {
        messageEl.textContent = "Server Error";
        messageEl.style.color = "red";
    }
}

// ---------------- BOOK SLOT ----------------
async function bookSlot() {
    try {
        const res = await fetch(`${API_URL}/book`, {
            method: "POST"
        });

        const data = await res.json();

        messageEl.textContent = data.message;
        messageEl.style.color = data.success ? "green" : "red";

        fetchSlots();

    } catch (err) {
        messageEl.textContent = "Booking Failed";
        messageEl.style.color = "red";
    }
}

// ---------------- RELEASE SLOT ----------------
async function releaseSlot(slotNumber) {
    try {
        const res = await fetch(`${API_URL}/release/${slotNumber}`, {
            method: "POST"
        });

        const data = await res.json();

        messageEl.textContent = data.message;
        messageEl.style.color = data.success ? "blue" : "red";

        fetchSlots();

    } catch (err) {
        messageEl.textContent = "Release Failed";
        messageEl.style.color = "red";
    }
}

// ---------------- EVENTS ----------------
bookButton.onclick = bookSlot;

// AUTO REFRESH (important)
setInterval(fetchSlots, 2000);

// INITIAL LOAD
fetchSlots();
