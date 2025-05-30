function handleSubmit(event) {
    event.preventDefault();
    const form = document.getElementById("contactForm");
    const formData = new FormData(form);

    for (let [name, value] of formData.entries()) {
        if (value.trim() === "") {
            alert("Please fill out all fields in order for your message to be sent.");
            return;
        }
    }

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Message sent!");
            form.reset();
        } else {
            alert("There was a problem sending your message.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("There was a problem sending your message.");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    form.addEventListener("submit", handleSubmit);
});