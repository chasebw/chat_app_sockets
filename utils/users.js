const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = {id, username, room };
    users.push(user);
    return user;
}

// Get Current User
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User Leaves Chat
function userLeave(id){
    //Find user in our users array
    const index = users.findIndex(user => user.id === id);

    //If the value was found, return modifed users array
    if (index !== -1){
        return users.splice(index, 1)[0];
    }

}

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};