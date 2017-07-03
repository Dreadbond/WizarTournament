import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Actions, playersDb } from '../players/players.js';

import './main.html';
import  feedbacks  from '../feedbacks/feedbacks.js';
//import rules from '../rules/rules.js';


var actualMessage ;
var oldMessage ;

Template.hud.onCreated(function helloOnCreated() {
  this.target = new ReactiveVar(0);
  this.spell = new ReactiveVar(0);
});

Template.hud.helpers({
    pTarget() {
    thisPlayer = playersDb.find({"name": "Dreadbond"}).fetch();
    cible = thisPlayer[0]["pistol"].directTarget ;
    cible = playersDb.find({"IRtag": cible}).fetch();
    try {
    cible = cible[0]["name"];
    }
    catch(e){
    cible = "rien";
    }
    return cible ;
  },

    wTarget() {
    thisPlayer = playersDb.find({"name": "Dreadbond"}).fetch();
    cible = thisPlayer[0]["wizbla"].directTarget ;
    cible = playersDb.find({"IRtag": cible}).fetch();
    try {
    cible = cible[0]["name"];
    }
    catch(e){
    cible = "rien";
    }
    return cible ;
  },

  gTarget() {
  thisPlayer = playersDb.find({"name": "Dreadbond"}).fetch();
  cible = thisPlayer[0]["arcaglove"].directTarget ;
  cible = playersDb.find({"IRtag": cible}).fetch();
  try {
  cible = cible[0]["name"];
  }
  catch(e){
  cible = "rien";
  }
  return cible ;
},

  name() {
    thisPlayer = playersDb.find({"name": "Dreadbond"}).fetch();
    return thisPlayer[0]["name"] ;
  },

  spell() {
        spell = playersDb.find({"name": "Dreadbond"}).fetch();
    return spell[0].arcaglove.spell ;
  },

  glPattern() {
        pattern = playersDb.find({"name": "Dreadbond"}).fetch();

    return pattern[0].arcaglove.pattern ;
  },

  glPreSpell() {
        preSpell = playersDb.find({"name": "Dreadbond"}).fetch();

    return preSpell[0].arcaglove.preSpell ;
  },


  deaths(){
    deaths = playersDb.find({"name": "Dreadbond"}).fetch();
    return deaths[0]["death"] ;
  },

  frags(){
    frag = playersDb.find({"name": "Dreadbond"}).fetch();
    return frag[0]["frag"] ;
  },

  health() {
    health = playersDb.find({"name": "Dreadbond"}).fetch();
    //Meteor.call('ButtSendTest', ":hub", "!111111", "health", health[0]["health"], function(err, result) {})
    return health[0]["health"] ;
    
  },

  armor() {
    armor = playersDb.find({"name": "Dreadbond"}).fetch();
    return armor[0]["armor"] ;
  },

  wizar() {
    wizar = playersDb.find({"name": "Dreadbond"}).fetch();
    return wizar[0]["wizar"] ;
  },

  pAmmo() {
    player = playersDb.find({"name": "Dreadbond"}).fetch();
    ammo = player[0]["pistol"].ammo ;
    return ammo ;
  },

  wAmmo() {
    player = playersDb.find({"name": "Dreadbond"}).fetch();
    ammo = player[0]["wizbla"].ammo ;
    return ammo ;
  },

  Class() {
    Class = playersDb.find({"name": "Dreadbond"}).fetch();
    return Class[0]["Class"] ;
  },

  team() {
    team = playersDb.find({"name": "Dreadbond"}).fetch();
    return team[0]["team"] ;
  },

  event() {
    event = playersDb.find({"name": "Dreadbond"}).fetch();
    return event[0]["event"] ;
  },

  shooter(){
    shooter = playersDb.find({"name": "Dreadbond"}).fetch();
    return shooter[0]["shooter"] ;
  }

});

Template.inter.helpers({
  events() {
    player = playersDb.find({"name": "Dreadbond"}).fetch();
    eventFb = player[0]["eventFb"] ;
    eventFb2 = player[0]["eventFb2"] ;
    eventPhrase = player[0]["event"] ;
    soundFile = player[0]["soundFile"];
    
    if (eventFb2 == "beenShot"){
    setTimeout(function() {
            Meteor.call('ButtSendTest', ":hub", "!111111", "beenShot", 1, function(err, result) {})
            var s = new buzz.sound('/sounds/general/hit.mp3');
            s.play();
              Meteor.setTimeout(function() {
              Meteor.call('ButtSendTest', ":hub", "!111111", "health", player[0]['health'], function(err, result) {})
              }, 100)
          }, 150
        );
    }
    

    if (eventFb != "void"){
      soundFile = feedbacks.feedbacks(eventFb, player);
      s = new buzz.sound(soundFile);

        try
        { 
        s.play();
        }
        catch(e){//console.log("Error : ", e)
        }
    
    //playersDb.update({"name": "Dreadbond"}, { $set: { soundFile:"void"}});
    return eventPhrase ;
    }
  },
});

Template.hud.events({
  'click button'(event, instance)   {
    //dataToSend = playersDb.find({"name": "Dreadbond"}).fetch();
    //dataToSend = dataToSend[0]["eventFb"] ;
    dataToSend = ":reloadFb"
                                      //to, from, param, value
        Meteor.call('ButtSendTest', ":pistol", "!111111", dataToSend, value, function(err, result) {
        console.log("Envoi réussi"); 
        })

    console.log("Son test vers serveur :", dataToSend); 
  },
});

    
Template.reset.events({
  'click button'(event, instance){

    Meteor.call('reset', function(err, result) {
      console.log(result);
    })
  }
});
