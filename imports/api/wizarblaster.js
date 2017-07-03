import { Actions, playersDb } from '../../players/players.js';
import  {defaultPlayer} from '../../rules/rules.js';


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Pistol//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export function wizarblaster() {

mode = playersDb.find({"IRtag": mess.to, health }).fetch();
mode = mode[0].wizbla.mode ;


    if (mess.param == "target"){

                playersDb.update({"IRtag": mess.to }, { $set: { "wizbla.directTarget": mess.value }});

                if (mess.value != "!vide")
                {
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    eventObject: ":wizbla", 
                    eventFb: ":target", 
                    soundFile: '/sounds/general/target.wav'
                        } 
                    }, {upsert: true});
                } else {
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    eventObject: ":wizbla", 
                    eventFb: ":!target", 
                    soundFile: '/sounds/general/noTarget.wav' 
                        } 
                    }, {upsert: true});
                }
        
        }//End cible direct

        if (mess.param == "reload"){
                owner = playersDb.find({"IRtag": mess.to }).fetch();

                    if (owner[0].wizbla.ammo < defaultPlayer.wizbla.ammoMax)
                    {
                    string = "Rechargement de "+ mess.from + " en cours ...";
                    playersDb.update({"IRtag": mess.to }, 
                    { $set: {
                        eventObject: ":wizbla",  
                        event: string, eventFb: "wizbla.reloadFb", 
                        soundFile: '/sounds/wizbla/reload.wav', "wizbla.canShoot": false }
                    });

                        Meteor.setTimeout(function() {
                            playersDb.update({"IRtag": mess.to }, 
                            { $set: { "wizbla.ammo": defaultPlayer.wizbla.ammoMax, "wizbla.canShoot": true }});
                            Meteor.call('ButtSendTest', ":wizbla", "!111111", "ammo", 20, function(err, result) {})
                            }, 4000
                        );
                    }
            }

if (mess.param == "nxtMode") {
        if ( mode == "plasma"){
        playersDb.update({"IRtag": mess.to }, 
            { $set: {
                "wizbla.mode": "chargedFire",
                eventObject: ":wizbla", 
                eventFb: "modeCharged", 
                soundFile: '/sounds/wizbla/change_mode.wav' 
        }
            });
    }
    else 
    {
        playersDb.update({"IRtag": mess.to }, 
            { $set: {
                "wizbla.mode": "plasma",
                eventObject: ":wizbla", 
                eventFb: "modePlasma", 
                soundFile: '/sounds/wizbla/change_mode.wav' 
        }
            });
    }
}

if (mode == "plasma") {
        if (mess.param == "trigger"  && mess.value && player[0].wizbla.canShoot ){
              ammo = player[0].wizbla.ammo ;

              if (ammo >0 ){
                playersDb.update({"IRtag": mess.to }, 
                { $inc: { "wizbla.ammo": -1 }});

                shooter = playersDb.find({"IRtag": mess.to }).fetch();
                ammo = player[0]["wizbla"].ammo ;

                victimIRtag = shooter[0]["wizbla"].directTarget ;
                playersDb.update({"IRtag": victimIRtag }, 
                    { $inc: { 
                    health: -5 }});
                victim = playersDb.find( {IRtag: victimIRtag} ).fetch();

                playersDb.update({"IRtag": mess.to }, 
                    { $set: {
                    eventObject: ":wizbla",  
                    eventFb: "plasmFb", 
                    soundFile: '/sounds/wizbla/plasma_fire.wav' } }, {upsert: true});  

                    if (victimIRtag == "!vide")
                    {

                    string = shooter[0]["name"] + " tire dans le vide ...";
                    playersDb.update({"IRtag": mess.to }, { $set: { event: string }});
                    }
                else if (victimIRtag != "!vide")
                    {
                    
                    string = shooter[0]["name"] + " tire sur " + victim[0].name;
                    playersDb.update({"IRtag": mess.to }, { $set: { event: string, eventFb2: "beenShot" }});
                    playersDb.update({"IRtag": victimIRtag }, { $set: { shooter: victimIRtag }});
                }

              }
              else
              {
                playersDb.update({"IRtag": mess.to }, 
                { $set: {
                    eventObject: ":wizbla", 
                    eventFb: "wizblaAmmoDepleted", 
                    event: "Munitions de WizarBlaster épuisées.", 
                    soundFile: '/sounds/wizbla/depleted.wav' } }, {upsert: true});
              }

            playersDb.update({"IRtag": mess.to }, { $set: { "wizbla.canShoot": false }});
            nextShoot = player[0].wizbla.plasmaFireRate ;
            
                Meteor.setTimeout(function() {
                    playersDb.update({"IRtag": mess.to }, { $set: { "wizbla.canShoot": true }});
                    }, nextShoot
                );

          }
    }
    
if (mode == "chargedFire") {
        if (mess.param == "trigger"  && mess.value && player[0].wizbla.canShoot ){
              //shooter = playersDb.find({"IRtag": mess.to }).fetch();
              ammo = player[0].wizbla.ammo ;

              if (ammo >0 ){
                playersDb.update({"IRtag": mess.to }, 
                { $inc: { "wizbla.ammo": -20 }});

                shooter = playersDb.find({"IRtag": mess.to }).fetch();
                ammo = player[0].wizbla.ammo ;

                playersDb.update({"IRtag": mess.to }, 
                    { $set: {
                    eventObject: ":wizbla",  
                    eventFb: "fireFb", 
                    soundFile: '/sounds/wizbla/charged_firebegin.wav' 
                    } 
                }, {upsert: true});  


                Meteor.setTimeout(function() {

                playersDb.update({"IRtag": mess.to }, 
                    { $set: {
                    eventObject: ":wizbla",  
                    eventFb: "sound", 
                    soundFile: '/sounds/wizbla/charged_fire.wav' 
                    } 
                });  

                    Meteor.setTimeout(function() {
                        playersDb.update({"IRtag": mess.to }, 
                            { $set: {
                            eventObject: ":wizbla",  
                            eventFb: "sound", 
                            soundFile: '/sounds/wizbla/charged_explode2.wav' 
                            } 
                        });  

                        shooter = playersDb.find({"IRtag": mess.to }).fetch();
                        victimIRtag = shooter[0].wizbla.directTarget ;
                        playersDb.update({"IRtag": victimIRtag }, 
                            { $inc: { 
                            health: -35
                            }
                        });
                        victim = playersDb.find( {IRtag: victimIRtag} ).fetch();

                        if (victimIRtag == "!vide")
                        {

                        string = shooter[0].name + " tire dans le vide ...";
                        playersDb.update({"IRtag": mess.to }, { $set: { event: string }});
                        }
                    else if (victimIRtag != "!vide")
                        {
                        
                        string = shooter[0].name + " tire sur " + victim[0].name ;
                        playersDb.update({"IRtag": mess.to }, { $set: { event: string, eventFb2: "beenShot" }});
                        playersDb.update({"IRtag": victimIRtag }, { $set: { shooter: victimIRtag }});
                    }
                    }, 900
                    );

                }, 2250
                );


              }
              else
              {
                playersDb.update({"IRtag": mess.to }, 
                { $set: {
                eventObject: ":wizbla", 
                eventFb: "wizblaAmmoDepleted", 
                event: "Munitions de WizarBlaster épuisées.", 
                soundFile: '/sounds/wizbla/depleted.wav' } }, {upsert: true});
              }

            playersDb.update({"IRtag": mess.to }, { $set: { "wizbla.canShoot": false }});

            nextShoot = player[0].wizbla.chargedFireRate ;
            
                Meteor.setTimeout(function() {
                    playersDb.update({"IRtag": mess.to }, { $set: { "wizbla.canShoot": true }});
                    }, nextShoot
                );

          }
    }//end mode == charged

}