import { Actions, playersDb } from '../players/players.js';
import  pistol from '../imports/api/pistol.js';
import  wizarblaster from '../imports/api/wizarblaster.js';
import  arcaglove from '../imports/api/arcaglove.js';
//var Fiber = require('fibers');
//import rules from '../rules/rules.js';
var health ;


export var defaultPlayer = {
type: "player", //entity, object, weapon, chest, GM ...
IRtag: "!11",
name: "Dreadbond",
team: "blue",
health: 100,
wizar: 100,

armor: 0,
isDead: 0,

rangedTarget: {},
shooter: "!vide",

event:"",
eventFb:"",
eventFb2:"",
eventObject:"",

inventory: {},
buff: {
        "onFire" : 0,
        "poisoned" : 0,
        "frozen" : 0,

        "canPoisoned" : true,
        "canFreeze" : true,
        "canLit" : true
    },
    
pistol: {
    directTarget: "!vide",

    canShoot: 1,
    canReload: 1,
    fireRate: 250,

    ammo: 20,
    ammoMax: 20,
    },

wizbla: {
    directTarget: "!vide",
    mode: "plasma",

    canShoot: 1,
    canReload: 1,
    plasmaFireRate: 100,
    chargedFireRate: 4000,

    ammo: 200,
    ammoMax: 200,
    },

arcaglove: {
    directTarget: "!vide",
    spell: "arf",
    pattern: "",
    preSpell: "",
    },

frag: 0,
death: 0,

healthMin: 0,
healthMax: 100,
armorMin: 0,
armorMax: 100,
} ;

//Loop

export function general(){
oldHealth = health ;
    
    Meteor.call('general', function() {
        player = playersDb.find({"name": "Dreadbond"}).fetch();
        health = player[0]["health"];
        isDead = player[0]["isDead"];


if (!isDead){
        if (health <= 0) {
            playersDb.update({"name": "Dreadbond"}, 
                { $set: { 
                    health: 0, 
                    isDead: true, 
                    event: "Vous êtes mort.", 
                    eventFb: "death", 
                    soundFile: '/sounds/general/death.mp3' 
                }, $inc: {
                    death: 1
                    }
                });

            if (player[0]["shooter"] != player[0]["IRtag"]){
                playersDb.update({"IRtag": player[0]["IRtag"]}, 
                { $inc: { 
                    frag: 1 
                    },  
                $set: { 
                    eventFb: "frag", 
                    soundFile: '/sounds/general/frag.mp3'}
                });
            }

            Meteor.setTimeout(function() {
                playersDb.update({"name": "Dreadbond"}, 
                    { $set: { 
                        health: 100, 
                        isDead: false, 
                        event: "Vous repopez", 
                        soundFile: '/sounds/general/respawn.mp3', 
                        eventFb: "respawn" }
                    });
                }, 5000
            );

            Meteor.clearInterval(stopFeu) ;
            Meteor.clearInterval(stopPoison) ;

        }//fin health <= 0



        if (health > 100) {
            playersDb.update({"name": "Dreadbond"}, { $set: { health: 100}});
        }

        if (player[0].buff.onFire > 0 && player[0].buff.canLit){
                duration = player[0].buff.onFire ;
                
                playersDb.update({"IRtag": player[0].IRtag}, 
                { $set: {
                    "buff.onFire": 0,
                    eventFb: "onFire",
                    soundFile: "sounds/hub/onFireLoop.mp3"
                    }
                })

                stopFeu = Meteor.setInterval(
                    function(){
                    Meteor.call('playerFeedback', ":hub", "!11", "onFire", function(err, result) {}),
                    playersDb.update({"IRtag": player[0].IRtag}, 
                        { $inc: {
                            health: -2 
                            },  
                        $set: { 
                            eventFb: "onFire", 
                            soundFile: 'void' ///sounds/general/onFire.mp3
                            }
                        });
                    }
                    , 500);
                

            playersDb.update({"name": "Dreadbond"}, { $set: { "buff.canLit": false}});


                Meteor.setTimeout(
                    function(){ 
                        Meteor.clearInterval(stopFeu) ;
                        playersDb.update({"name": "Dreadbond"}, { $set: { "buff.canLit": true}});
                        playersDb.update({"IRtag": player[0].IRtag},
                        { $set: { 
                            eventFb: "onFireEnd", 
                            soundFile: '/sounds/hub/onFireEnd.mp3',
                            }
                        })
                        
                        }
                    , duration);   //prepare the end of the effect

            }//feu

        if (player[0].buff.poisoned > 0 && player[0].buff.canPoisoned){
                duration = player[0].buff.poisoned ;
                
                playersDb.update({"IRtag": player[0].IRtag}, 
                { $set: {
                    "buff.poisoned": 0,
                    eventFb: "poisoned",
                    soundFile: "sounds/hub/poisoned.mp3"
                    }
                })

                stopPoison = Meteor.setInterval(
                    function(){
                    Meteor.call('playerFeedback', ":hub", "!11", "poisoned", function(err, result) {}),
                    playersDb.update({"IRtag": player[0].IRtag}, 
                        { $inc: {
                            health: -2 
                            },  
                        $set: { 
                            eventFb: "poisoned", 
                            soundFile: 'void' ///sounds/general/poisoned.mp3
                            }
                        });
                    }
                    , 500);
                

            playersDb.update({"name": "Dreadbond"}, { $set: { "buff.canPoisoned": false}});


                Meteor.setTimeout(
                    function(){ 
                        Meteor.clearInterval(stopPoison) 
                        playersDb.update({"name": "Dreadbond"}, { $set: { "buff.canPoisoned": true}});
                        playersDb.update({"IRtag": player[0].IRtag},
                        { $set: { 
                            eventFb: "poisonedEnd", 
                            soundFile: '/sounds/hub/poisonedEnd.mp3',
                            }
                        })
                        
                        }
                    , duration);   //prepare the end of the effect

            }//poisoned



if (mess.from == ":pistol") pistol.pistol();
if (mess.from == ":wizbla") wizarblaster.wizarblaster(); //wizbla
if (mess.from == ":gant") arcaglove.arcaglove(); //arcaglove

        }//End isDead

if (oldHealth != health){
        Meteor.setTimeout(function() {
    Meteor.call('playerFeedback', ":hub", "!11", "health", health, function(err, result) {})
    }, 100);
}

    });//End Meteor.call general
}// End general()

export function resetSound(){
     playersDb.update({name: "Dreadbond"}, { $set: { eventFb: "void", event: "" } }, {upsert: true});
console.log("reset");

}//End resetSound