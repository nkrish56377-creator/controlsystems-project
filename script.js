const API_URL = 'https://controlsystems-project-1.onrender.com/';

const parkingLot = document.getElementById('parking-lot');
const bookButton = document.getElementById('bookButton');
const resetButton = document.getElementById('resetButton');
const messageEl = document.getElementById('message');

// FETCH SLOTS
async function fetchSlots() {
    try {
        const res = await fetch(`${API_URL}/status`);
        const slots = await res.json();

        // First time: build the grid
        if (parkingLot.children.length !== slots.length) {
            parkingLot.innerHTML = '';
            slots.forEach((isBooked, index) => {
                const div = document.createElement('div');
                div.classList.add('slot');
                div.id = `slot-${index}`;
                div.textContent = `Slot ${index + 1}`;
                parkingLot.appendChild(div);
            });
        }

        // Every refresh: just update classes and onclick
        let allBooked = true;
        slots.forEach((isBooked, index) => {
            const div = document.getElementById(`slot-${index}`);
            div.className = 'slot ' + (isBooked ? 'booked' : 'available');
            div.onclick = isBooked ? () => releaseSlot(index + 1) : null;
            if (!isBooked) allBooked = false;
        });

        bookButton.disabled = allBooked;
    } catch (err) {
        messageEl.textContent = "Server Error";
        messageEl.style.color = "red";
    }
}

// BOOK SLOT
async function bookSlot() {
    const res = await fetch(`${API_URL}/book`, { method: "POST" });
    const data = await res.json();

    messageEl.textContent = data.message;
    messageEl.style.color = data.success ? "green" : "red";

    fetchSlots();
}

// RELEASE SLOT
async function releaseSlot(slot) {
    const res = await fetch(`${API_URL}/release/${slot}`, {
        method: "POST"
    });

    const data = await res.json();

    messageEl.textContent = data.message;
    messageEl.style.color = data.success ? "blue" : "red";

    fetchSlots();
}

// RESET
async function resetSlots() {
    if (!confirm("Reset all slots?")) return;

    const res = await fetch(`${API_URL}/reset`, {
        method: "POST"
    });

    const data = await res.json();

    messageEl.textContent = data.message;
    messageEl.style.color = "blue";

    fetchSlots();
}

// EVENTS
bookButton.onclick = bookSlot;
resetButton.onclick = resetSlots;

// AUTO REFRESH
setInterval(fetchSlots, 2000);
fetchSlots();
