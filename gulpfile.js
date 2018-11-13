
const dialogflow = require('dialogflow');
const gulp = require('gulp');
var fs = require("fs");
const jsZip = require("jszip");
let privateKey = ""
let clientEmail = ""
let config = {
    credentials: {
        private_key: privateKey,
        client_email: clientEmail
    }
}

gulp.task('restore-skill-google', function(){
   
    var data = fs.readFileSync("out.zip");
    const zipBase64 = data.toString('base64',{ encoding: "base64" });
    console.log(zipBase64)
    const AC = new dialogflow.AgentsClient(config);
    AC.restoreAgent({parent: 'projects/test1-edada',agentContent: zipBase64});
})

gulp.task('export-skill-google', function(){
    
	
    const AC = new dialogflow.AgentsClient(config);
    AC.exportAgent({parent: 'projects/test1-edada'})
    .then(function(resultat){
        console.log('Reussis : ' + resultat);

      var stringifyValue1 = JSON.stringify(resultat[0]);
      var parseValue1 = JSON.parse(stringifyValue1);
      //  console.log(parseValue1);
      //  console.log("-----------------------------------------");
      //  stringifyValue = JSON.stringify(resultat[1]);
      //   parseValue = JSON.parse(stringifyValue);
      //  console.log(parseValue);
      //  console.log("-----------------------------------------");
      //  console.log(parseValue.response.value.data);


       // var buffer1 = parseValue.response.value.data;
        //console.log(parseValue.response.value.data.toString('utf8'));
        var zip = new jsZip();
        console.log("-----------------------------------------" + parseValue1.result.agentContent);
        zip.loadAsync(parseValue1.result.agentContent, {base64: true}).then(function (zip1) {
            // obtenir les fichier dans le zip
           // files = Object.keys(zip1.files);
       
           // for(i=0; i< files.length; i++){
           //     console.log(files[i] + " " + zip1.files[files[i]].date);
           // }nodebuffer
            
            zip1.generateNodeStream({type:'nodebuffer',compression: "DEFLATE",streamFiles:true})
            .pipe(fs.createWriteStream('out.zip'))
            .on('finish', function () {
                console.log("out.zip written.");
            
            });
          
        });

    })
    .catch(function(erreur){
        console.log('Erreur lors de la requete : '+erreur);
    })
});
