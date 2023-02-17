function send() {
    var name = document.querySelector(".senderName").value;
    var mail = document.querySelector(".senderMail").value;
    var message = document.querySelector(".message").value;
    if (name === "" || name.replace(/\s/g, "") === "" || mail === "" || mail.replace(/\s/g, "") === "" || message === "" || message.replace(/\s/g, "") === "") {
    } else {
        window.location.href = `/send/sendername=${name}/sendermail=${mail}/message=${message}/redirect=&`;
    }
}