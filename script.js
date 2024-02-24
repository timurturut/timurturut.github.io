document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

function toggleMenu() {
    var elements = document.querySelector('.middleElements');
    if (elements.style.display === "none" || elements.style.display === "") {
        elements.style.display = "flex"; // Or "block" depending on your layout
    } else {
        elements.style.display = "none";
    }
}

const hamburger = document.querySelector(".hamburger");
const middleElements = document.querySelector(".middleElements")

hamburger.addEventListener("click", () =>{
    hamburger.classList.toggle("active")
    middleElements.classList.toggle("active")
})


document.querySelectorAll(".middleElements").forEach(n => n.
    addEventListener("click" ,  () => {
        hamburger.classList.remove("active")
        middleElements.classList.remove("active")
    })
)