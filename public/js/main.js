
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// Join ChatRoom
socket.emit('joinRoom', { username, room});

// Get room and users info
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);

});

// Message from Server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message Submit
chatForm.addEventListener('submit' , e => {
    // Stop form from submiting
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    console.log(`Sending to the server [${msg}]`);

    // Emit Message to the server
    socket.emit('chatMessage', msg);

    // Clear input // Focus text box
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus;
});


/******************************************************
 * OUTPUT MESSAGE:
 * This will output the message to the DOM when
 * a message is received.
 * 
 ******************************************************/
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username} <span> ${message.time} </span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add Room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}