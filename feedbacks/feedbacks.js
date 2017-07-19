


export function feedbacks(eventFb, player) {
object = player[0].eventObject;

    switch(eventFb) {

    case "shootFb":
      Meteor.setTimeout(function() {
          Meteor.call('playerFeedback', object, "!111111", "ammo", player[0].pistol.ammo, function(err, result) {})
      }, 100)
      ;
    break;

    case "respawn":
    Meteor.call('playerFeedback', ":hub", "!111111", eventFb, 1, function(err, result) {})
    //sf = '/sounds/general/respawn.mp3';
              Meteor.setTimeout(function() {
              Meteor.call('playerFeedback', ":hub", "!111111", "health", player[0].health, function(err, result) {})
              }, 100)
    break;

}
Meteor.call('playerFeedback', object, "!111111", eventFb, 1, function(err, result) {})

return player[0].soundFile ;

}