import { makePosting, getRecentPostings, getStatus, setStatus } from "../plugins/utils.mjs";
import { registerName, getMyName, setProvider } from "../plugins/utils.mjs"


function onRegisterNameClicked() {
    let name = document.getElementById("name-text").value;
    registerName(name);
}


function onChangeStatusClicked() {
    let status = document.getElementById("status-text").value;
    setStatus(status);
}

async function onCheckFriendStatus() {
    let friendName = document.getElementById("friend-name").value
    let friendStatus = await getStatus(friendName)
    document.getElementById("friends-current-status").innerHTML =
        friendName + " is currently " + friendStatus;
}

async function onPostNewMessage() {
    let message = document.getElementById("message-text").value
    await makePosting(message)
    checkRecentMessages()
}

async function checkRecentMessages() {
    let postings = await getRecentPostings()
    let postBox = document.getElementById("post-box")
    postBox.innerHTML = ""
    for (let i = postings.length-1; i >= 0; i--) {
        let html = "<i>"
        html += postings[i].owner
        html += "</i>: "
        html += postings[i].message
        html += "<br/>"
        postBox.innerHTML += html
    }
}

document.getElementById('register').addEventListener('click', () => {
    onRegisterNameClicked();
})

document.getElementById('status').addEventListener('click', () => {
    onChangeStatusClicked();
});

document.getElementById('checkFriendStatus').addEventListener('click', () => {
    onCheckFriendStatus();
})

document.getElementById('postNewMessage').addEventListener('click', () => {
    onPostNewMessage();
})


async function getMyStatus() {
    let myName = await getMyName();
    let myStatus = await getStatus(myName);
    document.getElementById("current-status").innerHTML = myName + " is currently " + myStatus;
}

async function populatePage() {
    getMyStatus()
    checkRecentMessages()
}

setProvider().then(populatePage);
