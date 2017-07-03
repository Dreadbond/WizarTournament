import { Actions, playersDb } from '../../players/players.js';
import  {defaultPlayer} from '../../rules/rules.js';

var currentGesture = [] ;
var nextReset = 1000 ;

var barrier = {
    gesture: [5, 4] ,
    cooldown: 5000 ,
    canCast: 1 ,
};

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////Gant//////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
export function arcaglove() {
player = playersDb.find({"IRtag": mess.to }).fetch();

    if (mess.param == "target"){

                playersDb.update({"IRtag": mess.to }, { $set: { "arcaglove.directTarget": mess.value }});

                if (mess.value != "!vide")
                {
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    eventObject: ":gant", 
                    eventFb: ":target", 
                    soundFile: '/sounds/general/target.wav'
                        } 
                    }, {upsert: true});
                } else {
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    eventObject: ":gant", 
                    eventFb: ":!target", 
                    soundFile: '/sounds/general/noTarget.wav' 
                        } 
                    });
                }
        
        }//End cible direct

    if (mess.param == "position"){

        pos = mess.value ;
        currentGesture.push(pos) ;
        var spell = "" ;
        preSpell = player[0].arcaglove.preSpell ;

        for (i=0; i<currentGesture.length; i++){
            if (currentGesture[i] == barrier.gesture[i] && preSpell == "barrier"){
                spell = "barrier" ;
            }
            else 
            {
                spell = "" ;
            }
        }
            //console.log("Barrier");

            if (spell == "barrier" && barrier.canCast ){
                
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    eventObject: ":gant", 
                    eventFb: "barrier", 
                    soundFile: '/sounds/gant/barrier_cast.mp3' 
                        } 
                    });

                Meteor.setTimeout(function() {
                    barrier.canCast = 1 ;
                    console.log("Barrier pret !");
                    }, barrier.cooldown
                );
                barrier.canCast = 0 ;
                currentGesture = [pos] ;
                spell == "";
            }
        
        

            //console.log("currentGesture :", currentGesture);
            Meteor.setTimeout(function() {
                currentGesture = [pos] ;
                //console.log("reset gesture");
                }, nextReset
            );
    }

    if (mess.param == "fingers"){

        playersDb.update({"IRtag": mess.to}, 
        { $set: {
            "arcaglove.pattern": mess.value,
            "arcaglove.preSpell": "rien",
                } 
            });
        

        if (
            mess.value[1] < 1000 && 
            mess.value[2] < 990 && 
            mess.value[3] < 990 && 
            mess.value[4] < 990 ) 
            {
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    "arcaglove.preSpell": "barrier",
                    eventObject: ":gant", 
                    eventFb: "protCast", 
                    soundFile: '/sounds/gant/barrier_precast.mp3' 
                        } 
                    });
            }
            
            if (
            mess.value[1] > 990 && 
            mess.value[2] < 1000 && 
            mess.value[3] < 1000 && 
            mess.value[4] > 980 ) 
            {
                playersDb.update({"IRtag": mess.to}, 
                { $set: {
                    "arcaglove.preSpell": "fireball",
                    eventObject: ":gant", 
                    eventFb: "fireCast", 
                    soundFile: '/sounds/gant/fireball_precast.mp3' 
                        } 
                    });
            }


        //console.log("doigt :", mess.value);
    }   

}