
import { Meteor } from 'meteor/meteor';
import serialport from 'serialport';
import { playersDb } from '../players/players.js';
import rules from '../rules/rules.js';


var port = "COM5" ; //process.argv[2];
var incomingJson ;

var sp = new serialport.SerialPort(port, {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

sp.on('open', onPortOpen);
sp.on('data', onData);
sp.on('close', onClose);
sp.on('error', onError);

function onPortOpen(){
    console.log("Port ouvert !");
}

function onClose(){
    console.log("Port is closed, yo");
}
function onError(){
    console.log("Arduino branché ?");
}

//https://stackoverflow.com/questions/29486983/save-serialport-list-with-meteor

function onData(incomingData)
{
incomingJson = incomingData ;
        try
        { 
        mess = JSON.parse(incomingData);
        }
        catch(e){console.log("Error : ", e)}
    //console.log("Reçu  Ardu :", mess);



//Meteor.call('testChelou');

//règles de jeu ici
rules.general();
}

Meteor.methods({
 playerFeedback(to, from, param, value = 1){

    var DataToSend = new Object();
    DataToSend.to = to;
    DataToSend.from  = from;
    DataToSend.param = param;
    DataToSend.value = value;
    DataToSend= JSON.stringify(DataToSend);

    //console.log("Envoi Ardu :", DataToSend);

    sp.write(DataToSend);

    playersDb.update({name: "Dreadbond"}, { $set: { eventFb: "void", eventFb2: "void" } }, {upsert: true});  //, event: "" , soundFile: ""
    },

 reset(){
        Meteor.call('reset_game', function() {
            //playersDb.update({ name: "Dreadbond"}, { $set: { directTarget: rules.defaultPlayer.directTarget }}, {upsert: true});
            playersDb.update(
                {health: { $lt: 101} },
                {$set: 
                     //rules.defaultPlayer 
                    {
                    team: rules.defaultPlayer.team,
                    health: rules.defaultPlayer.healthMax,
                    armor: rules.defaultPlayer.armorMax,
                    wizar: rules.defaultPlayer.wizar,
                    //ammo: rules.defaultPlayer.ammo,
                    //directTarget: rules.defaultPlayer.directTarget,
                    rangedTarget: rules.defaultPlayer.rangedTarget,
                    //wbAmmo: rules.defaultPlayer.wbAmmo,
                    isDead: rules.defaultPlayer.isDead,

                    //canShoot: rules.defaultPlayer.canShoot,
                    //fireRate: rules.defaultPlayer.fireRate,
                    inventory: rules.defaultPlayer.inventory,
                    buff: rules.defaultPlayer.buff,

                    wizbla: rules.defaultPlayer.wizbla,
                    pistol: rules.defaultPlayer.pistol,
                    arcaglove: rules.defaultPlayer.arcaglove,

                    frag: rules.defaultPlayer.frag,
                    death: rules.defaultPlayer.death,
                    shooter: rules.defaultPlayer.shooter,

                    event: rules.defaultPlayer.event,
                    eventFb: rules.defaultPlayer.eventFb,
                    eventFb2: rules.defaultPlayer.eventFb2,
                    eventObject: rules.defaultPlayer.eventObject,
                    soundFile: rules.defaultPlayer.soundFile,
                    
                    }
                },
                    { 
                    upsert: true,
                    multi: true
                    }
            );
    })
    qsd = "Remise à zéro." ;
    console.log(qsd);
    return qsd ;
    },

    damageType(object, ammoType){
        retour = playersDb.update({"name": "Dreadbond"}, 
            { $set: { 
            "pistol.ammoType": ammoType}
            }
        , {upsert: true}
        ); 
        return retour ;
    },

 });


Meteor.startup(() => {

});



