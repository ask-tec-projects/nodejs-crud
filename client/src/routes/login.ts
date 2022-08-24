export async function login(event: Event): Promise<void> {
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    fetch("/api/account/login", { method: "POST", body: JSON.stringify({ email, password }) }).then((response) => {
        return response.json();
    }).then((response) => {
        if (response.authenticated === true) {
            window.location.href = "/";
        } else {
            throw new Error();
        }
    }).catch(() => {
        alert("Invalid credentials");
    });
}

window.onload = () => {
    document.querySelector("form").onsubmit = login;
}
