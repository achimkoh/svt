// get user input
let twitterClient;
let screenName = ''; 
let userIDList = [];

// removes all of your followers by block and unblocking them
let removeFollowers = function(followerList) {
    for (let memberIndex = 0; memberIndex < followerList.length; memberIndex++) {
        let member = followerList[memberIndex];
        twitterClient.post('blocks/create', {
            user_id: member
        }, function(error, user, response) {
            if (!error) {
                twitterClient.post('blocks/destroy', {
                    user_id: member
                }, function(error, user, response) {
                    if (!error) {
                        console.log(`${member} has been removed as a follower.`);
                    } else {
                        console.log(error);
                    }
                })
            } else {
                console.log(error);
            }
        })
    }
}

// check if user is sachal and calls block-unblock on them
let isSachal = function(followerList) {
    // let's first retrieve friends
    let following = [];
    twitterClient.get('friends/ids', {
        stringify_ids: true
    }, function(error, userList, response) {
        if (!error) following = userList['ids'];
        else console.log(error);
    });

    // make a list of followers I don't follow back
    let followersIDontFollow = [];
    let hundredFollowers = [];
    for (let memberIndex = 0; memberIndex < followerList.length; memberIndex++) {
        let member = followerList[memberIndex];
        if (following.includes(member)) {
            continue;
        } else {
            hundredFollowers.push(member);
            if (hundredFollowers.length === 100) {
                followersIDontFollow.push(hundredFollowers);
                hundredFollowers = [];
            }
        }
    }

    // among these, check who is protected
    let sachal = [];
    let followersIDontFollow_objects = [];
    for (let i=0; i<followersIDontFollow.length; i++) {
        twitterClient.get('users/lookup', {
            user_id: followersIDontFollow[i]
        }, )
    }

}

// gets your followers then calls isSachal on them
let getFollowers = function() {
    twitterClient.get('followers/ids', {
        // screen_name: screenName,
        stringify_ids: true
    }, function(error, userList, response) {
        if (!error) {
            console.log(`you have ${userList['ids'].length} followers`);
            // isSachal(userList['ids']);
        } else {
            console.log(error);
        }
    })
}

let run = function() {
    twitterClient = new Twitter({
        consumer_key: document.getElementById("consumer-key").value,
        consumer_secret: document.getElementById("consumer-secret").value,
        access_token_key: document.getElementById("access-token").value,
        access_token_secret: document.getElementById("access-token-secret").value
    });
    screenName = document.getElementById("screen-name").value;
    getFollowers();
}
