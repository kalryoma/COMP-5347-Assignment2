let file = cat('/Users/kalryoma/Documents/USYD/COMP5347/Assignment2/Dataset/Admin.txt');
let type = "admin";
let users = file.split('\n');
for (let i = 0, l = users.length; i < l; i++) { 
    db.userType.insert({'user': users[i], 'type': type});
}
file = cat('/Users/kalryoma/Documents/USYD/COMP5347/Assignment2/Dataset/Bot.txt');
type = "bot";
users = file.split('\n');
for (let i = 0, l = users.length; i < l; i++) { 
    db.userType.insert({'user': users[i], 'type': type});
}