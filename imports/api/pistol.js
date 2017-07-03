import { Actions, playersDb } from '../../players/players.js';
import  {defaultPlayer} from '../../rules/rules.js';

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Pistol//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export function pistol() {
var object = ":pistol" ;
    //if (mess.from == ":pistol") {
    if (mess.param == "target"){
                            
                playersDb.update({"IRtag": mess.to }, { $set: { "pistol.directTarget": mess.value }});
                //shooter = playersDb.find( {IRtag: mess.to} ).fetch();
                target = playersDb.find( {IRtag: mess.value} ).fetch();
                playersDb.update({"IRtag": mess.to}, { $set: { eventFb: "void" } }, {upsert: true});

                if (mess.value != "!vide")
                {
                playersDb.update({"IRtag": mess.to}, { $set: {eventObject: ":pistol", eventFb: ":target",  soundFile: '/sounds/flingue/target.wav'} }, {upsert: true});  //eventFb: ":target",
                //Meteor.call('ButtSendTest', ":pistol", "!111111", ":target", 20, function(err, result) {})
                }
                else
                {
                playersDb.update({"IRtag": mess.to}, { $set: {eventObject: ":pistol", eventFb: ":!target",  soundFile: '/sounds/flingue/noTarget.aif' } }, {upsert: true}); //eventFb: ":!target", 
                //Meteor.call('ButtSendTest', ":pistol", "!111111", ":!target", 20, function(err, result) {}) 
                }
        
        }//End cible direct

        if (mess.param == "reload"){
                owner = playersDb.find({"IRtag": mess.to }).fetch();

                    if (owner[0]["pistol"].ammo < defaultPlayer.pistol.ammoMax)
                    {
                    //playersDb.update({"IRtag": mess.to }, { $set: { ammo: defaultPlayer.ammoMax }});
                    string = "Rechargement de "+ mess.from + " en cours ...";
                    playersDb.update({"IRtag": mess.to }, { $set: { eventObject: ":pistol", event: string, eventFb: "reloadFb", soundFile: '/sounds/flingue/reload1.mp3', "pistol.canShoot": false }});

                        Meteor.setTimeout(function() {
                            playersDb.update({"IRtag": mess.to }, { $set: { "pistol.ammo": defaultPlayer.pistol.ammoMax, "pistol.canShoot": true }});
                            Meteor.call('ButtSendTest', ":pistol", "!111111", "ammo", 20, function(err, result) {})
                            }, 2000
                        );
                    }
            }

        if (mess.param == "trigger"  && mess.value && player[0]["pistol"]["canShoot"] ){


              //shooter = playersDb.find({"IRtag": mess.to }).fetch();
              ammo = player[0]["pistol"].ammo ;

              if (ammo >0 ){
                playersDb.update({"IRtag": mess.to }, { $inc: { "pistol.ammo": -1 }});
                //playersDb.update({"IRtag": mess.to }, { $inc: { ammo: -1 }, $set: {eventFb: "ammo",} });

                shooter = playersDb.find({"IRtag": mess.to }).fetch();
                ammo = shooter[0]["pistol"].ammo ;

                victimIRtag = shooter[0]["pistol"].directTarget ;   //si flemme : playersDb.find( {IRtag: mess.value} ).fetch();
                playersDb.update({"IRtag": victimIRtag }, { $inc: { health: -10 }});
                //playersDb.update({"IRtag": mess.to }, { $set: { eventFb: "beenShot" } }, {upsert: true});
                victim = playersDb.find( {IRtag: victimIRtag} ).fetch();

                playersDb.update({"IRtag": mess.to }, { $set: { eventObject: ":pistol", eventFb: "shootFb", soundFile: '/sounds/flingue/attack1.mp3' } }, {upsert: true});  

                    if (victimIRtag == "!vide")
                    {

                    string = shooter[0]["name"] + " tire dans le vide ...";
                    playersDb.update({"IRtag": mess.to }, { $set: { event: string }});
                    }
                else if (victimIRtag != "!vide")
                    {
                    
                    string = shooter[0]["name"] + " tire sur " + victim[0]["name"];
                    playersDb.update({"IRtag": mess.to }, { $set: { event: string, eventFb2: "beenShot" }});
                    playersDb.update({"IRtag": victimIRtag }, { $set: { shooter: victimIRtag }});
                }

              }
              else
              {
                playersDb.update({"IRtag": mess.to }, { $set: { eventObject: ":pistol", eventFb: "pistolAmmoDepleted", event: "Munitions de pistolet épuisées.", soundFile: '/sounds/flingue/depleted1.mp3' } }, {upsert: true});
              }

            playersDb.update({"IRtag": mess.to }, { $set: { "pistol.canShoot": false }});

            nextShoot = player[0]["pistol"].fireRate ;

            //console.log(nextShoot);
                Meteor.setTimeout(function() {
                    playersDb.update({"IRtag": mess.to }, { $set: { "pistol.canShoot": true }});
                    }, nextShoot
                );

          }

}
