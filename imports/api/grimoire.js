    // if (mess.param == "nova_feu"){
    //         Meteor.call('nova_feu', function() {
    //             for (var i=0 ; i < mess.to.length ; i++) {
    //                 playersDb.update({"name": mess.to[i]}, { $inc: { health: -10 }});

    //                 targets = playersDb.find({name: mess.to[i]}).fetch();
    //                 targetName = targets[0]["name"];
    //                 targetHealth = targets[0]["health"];
    //                 console.log(targetName, targetHealth);

    //             }
    //         })
    //     }//End nova_feu

    // if (mess.param == "nova_soins"){
    //         Meteor.call('nova_soins', function() {
    //             for (var i=0 ; i < mess.to.length ; i++) {
    //                 playersDb.update({"name": mess.to[i]}, { $inc: { health: +10 }});

    //                 targets = playersDb.find({name: mess.to[i]}).fetch();
    //                 targetName = targets[0]["name"];
    //                 targetHealth = targets[0]["health"];
    //                 console.log(targetName, targetHealth);
    //             }
    //         })
    //     }//End nova_soins