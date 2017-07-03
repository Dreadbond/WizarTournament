import { Actions, playersDb } from '../players/players.js';
import  pistol from '../imports/api/pistol.js';
import  wizarblaster from '../imports/api/wizarblaster.js';
import  arcaglove from '../imports/api/arcaglove.js';
//var Fiber = require('fibers');
//import rules from '../rules/rules.js';



export var defaultPlayer = {
type: "player", //entity, object, weapon, chest, GM ...
IRtag: "!111111",
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
    Meteor.call('general', function() {
        player = playersDb.find({"name": "Dreadbond"}).fetch();
        health = player[0]["health"];
        isDead = player[0]["isDead"];


if (!isDead){
        if (health <= 0) {
            playersDb.update({"name": "Dreadbond"}, { $set: { health: 0, isDead: true, event: "Vous êtes mort.", eventFb: "death", soundFile: '/sounds/general/death.mp3' }, $inc: {death: 1}});  // { $inc: { ammo: -1 }

                if (player[0]["shooter"] != player[0]["IRtag"]){
                    playersDb.update({"IRtag": player[0]["IRtag"]}, { $inc: { frag: 1 },  $set: { eventFb: "frag", soundFile: '/sounds/general/frag.mp3'}});
                }

            Meteor.setTimeout(function() {
                playersDb.update({"name": "Dreadbond"}, { $set: { health: 100, isDead: false, event: "Vous repopez", soundFile: '/sounds/general/respawn.mp3', eventFb: "respawn" }});
                }, 5000
            );

        }

        if (health > 100) {
            playersDb.update({"name": "Dreadbond"}, { $set: { health: 100}});
        }
            //console.log(oldHealth, health);            playersDb.update({"name": "Dreadbond"}, { $set: { health: 0, isDead: true, event: "Vous êtes mort." }});
    
if (mess.from == ":pistol") pistol.pistol();
if (mess.from == ":wizbla") wizarblaster.wizarblaster(); //wizbla
if (mess.from == ":gant") arcaglove.arcaglove(); //arcaglove

        }//End isDead
    });//End Meteor.call general
}// End general()

export function resetSound(){
     playersDb.update({name: "Dreadbond"}, { $set: { eventFb: "void", event: "" } }, {upsert: true});
console.log("reset");

}//End resetSound