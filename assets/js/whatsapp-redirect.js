document
  .getElementById("powerCalculatorForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value;
    const mobile = document.getElementById("mobile").value;
    const requirement = document.getElementById("requirement").value;
    const location = document.getElementById("location").value;

    const message = `Hi, I want a UPS Quote:

Name: ${name}
Mobile: ${mobile}
Requirement: ${requirement}
Location: ${location}`;

    const encodedMessage = encodeURIComponent(message);

    window.open("https://wa.me/919763150181?text=" + encodedMessage, "_blank");
  });


  

document.addEventListener("DOMContentLoaded", function() {

    const heroForm = document.getElementById("heroContactForm");

    if (heroForm) {
        heroForm.addEventListener("submit", function() {

            const name = document.getElementById("heroName").value;
            const phone = document.getElementById("heroPhone").value;
            const location = document.getElementById("heroLocation").value;
            const requirement = document.getElementById("heroRequirement").value;

            const message =
`Hi Sonic Team,

I am interested in your solar power solutions.

Name: ${name}
Mobile: ${phone}
Location: ${location}
Requirement: ${requirement}

Please guide me with pricing and installation details.`;

            const encodedMessage = encodeURIComponent(message);

            window.open("https://wa.me/919763150181?text=" + encodedMessage, "_blank");

        });
    }

});





document.getElementById("amcForm").addEventListener("submit", function (e) {
  e.preventDefault(); // stop page reload

  const name = document.getElementById("amcName").value;
  const phone = document.getElementById("amcPhone").value;
  const email = document.getElementById("amcEmail").value;
  const capacity = document.getElementById("amcCapacity").value;

  const message = `Hi, I want AMC Quote:

Name: ${name}
Mobile: ${phone}
Email: ${email}
UPS Capacity: ${capacity}`;

  const encodedMessage = encodeURIComponent(message);

  window.open("https://wa.me/919763150181?text=" + encodedMessage, "_blank");
});

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("contactName").value;
  const mobile = document.getElementById("contactMobile").value;
  const email = document.getElementById("contactEmail").value;
  const location = document.getElementById("contactLocation").value;
  const requirement = document.getElementById("requirement").value;

  const message = `Hi, I want to enquire about power backup:

Name: ${name}
Mobile: ${mobile}
Email: ${email}
Location: ${location}
Requirement: ${requirement}`;

  const encodedMessage = encodeURIComponent(message);

  window.open("https://wa.me/919763150181?text=" + encodedMessage, "_blank");
});
