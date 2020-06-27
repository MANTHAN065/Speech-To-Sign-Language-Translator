/*
        Load json file for sigml available for easy searching
*/

/*
  Global SigmlData is a
  javascript object
*/
var SigmlData;
var lookup = {};

$.getJSON( "SignFiles/signdump.json", function( data ) {
    SigmlData = data;

    // make the lookup table
    for (i = 0, len = SigmlData.length; i < len; i++) {
        lookup[SigmlData[i].w] = SigmlData[i].s;
    }
  });


    $("#speech_loader").hide();
    $('#loader').hide();

    /*var sigmlList = JSON.parse(list);
    console.log(sigmlList);*/
    $.getJSON("js/sigmlFiles.json", function(json){
        sigmlList = json;
        //console.log("reached here");
        //console.log(sigmlList);
    });

    // code for clear button in input box for words
    $("#btnClear").click(function() {
        $("#inputText").val("");
    });

    // code to check if avatar has been loaded or not and hide the loading sign
    var loadingTout = setInterval(function() {
        if(tuavatarLoaded) {
            $("#loading").hide();
            clearInterval(loadingTout);
            console.log("Avatar loaded successfully !");
        }
    }, 1000);


    // code to animate tabs

    alltabhead = ["menu1-h", "menu2-h", "menu3-h", "menu4-h"];
    alltabbody = ["menu1", "menu2", "menu3", "menu4"];

    function activateTab(tabheadid, tabbodyid)
    {
        for(x = 0; x < alltabhead.length; x++)
            $("#"+alltabhead[x]).css("background-color", "white");
        $("#"+tabheadid).css("background-color", "#d5d5d5");
        for(x = 0; x < alltabbody.length; x++)
            $("#"+alltabbody[x]).hide();
        $("#"+tabbodyid).show();
    }

    function getParsedText(speech) {
        // console.log("$$ 1");

        var HttpClient = function() {
            this.get = function(aUrl, aCallback) {
                var anHttpRequest = new XMLHttpRequest();
                anHttpRequest.onreadystatechange = function() {
                    if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                        aCallback(anHttpRequest.responseText);
                }

                anHttpRequest.open( "GET", aUrl,false );
                anHttpRequest.send( null );
            }
        };
        var final_response = "";
        var client = new HttpClient();
        client.get('http://localhost:7001/parser' + '?speech=' + speech, function(response) {
            console.log("The response is : "+response);
            final_response = JSON.parse(response);
            console.log(final_response);
        });
        // console.log("$$ 4");
        console.log()
        document.getElementById('isl').innerHTML = final_response['isl_text_string'];
        document.getElementById('speech_').innerHTML = speech;
        return final_response['pre_process_string'];
    }
    activateTab("menu1-h", "menu1"); // activate first menu by default

    function startDictation() {
        $('#playeng').hide();
        $('#clicktospeak').hide();
        $("#speech_loader").show();
        $('#listening').show();

        console.log('Speech recognition started...');

        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            let recognition = new webkitSpeechRecognition();


            recognition.continuous = true;
            recognition.maxAlternatives = 1;
            recognition.interimResults = false;

            recognition.lang = "en-CA";
            recognition.start();

            recognition.onresult = function(e) {
                // document.getElementById('transcript').value = e.results[0][0].transcript;
                $('#playeng').show();
                $('#clicktospeak').show();
                $("#speech_loader").hide();
                $("#listening").hide();
                $('#loader').show();

                console.log('Speech: ' + e.results[0][0].transcript);

                let speech = e.results[0][0].transcript;
                console.log(speech);
                let parsedSpeech = getParsedText(speech);
                console.log(parsedSpeech);

                clickme(parsedSpeech);

                $('#loader').hide();

                recognition.stop();

                console.log('Speech recognition stopped...');

            };

            recognition.onerror = function(e) {
                recognition.stop();
            }

        }
    }



    function startDictation2() {
        $('#playeng').hide();
        $('#clicktospeak').hide();
        $("#speech_loader").show();
        $("#listening").show();
        console.log('Speech recognition started...');

        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            let recognition = new webkitSpeechRecognition();


            recognition.continuous = true;
            recognition.maxAlternatives = 1;
            recognition.interimResults = false;

            recognition.lang = "en-CA";
            recognition.start();

               recognition.onresult = function(e) {
                // document.getElementById('transcript').value = e.results[0][0].transcript;
                $('#playeng').show();
                $('#clicktospeak').show();
                $("#speech_loader").hide();
                $("#listening").hide();
                $('#loader').show();

                console.log('Speech: ' + e.results[0][0].transcript);

                let speech = e.results[0][0].transcript;

                console.log(speech);
                speech=speech.toLowerCase();
                console.log(speech);

                if(speech.match("ok jarvis")||speech.match("okay jarvis")||speech.match("k jarvis"))
                {
                        recognition=new webkitSpeechRecognition();
                        recognition.continuous = true;
                        recognition.maxAlternatives = 10;
                        recognition.interimResults = false;

                        recognition.lang = "en-US";
                        recognition.start();
                        recognition.onresult = function(e) {
                // document.getElementById('transcript').value = e.results[0][0].transcript;
                $('#playeng').show();
                $('#clicktospeak').show();
                $("#speech_loader").hide();
                $("#listening").hide();
                $('#loader').show();

                console.log('Speech: ' + e.results[0][0].transcript);

                let speech = e.results[0][0].transcript;
                console.log(speech);
                let parsedSpeech = getParsedText(speech);
                console.log(parsedSpeech);
                clickme(parsedSpeech);
                $('#loader').hide();
                 startDictation2();
};


                    }

                    else{

                            startDictation2();
                    }

            };


        }
    }




    function clickme(speech) {

        inputText = speech;
        // read the language that has been set
        lang = "English"; // using english for default
        tokens = [];



            // tokenize the english paragraph
            tokenString = tokenizeEnglish(inputText);
            tokens = tokenString.split(',');
            console.log("Got tokens");

                // remove empty values from tokens
        for(x = 0; x < tokens.length; x++) {
            t = tokens[x];

            if(t == "")
                tokens.splice(x, 1);
        }

        console.log(tokens);

        // process tokens based on language settings
        // use the script to generate the sigml files available and if
        // word file is available use word file less speak as letter based
        // list of sigmlfile is available in sigmlArray.js


        for(x = 0; x < tokens.length; x++) {
            // process each token
            t = tokens[x];
            if(t == "EOL")
                continue;
            // convert token to lower case for seaching in the database
            // search for name and it will return filename if it will exists
            t = t.toLowerCase();
            t = t.replace('.',""); // remove the puntuation from the end
            tokens[x] = t;
        }

        console.log(tokens);
           data=tokens;
           console.log("reached here")


           playseq = Array();
    for(i = 0; i < data.length; i++)
      playseq.push(data[i]);

    // start playing only if length of data received
    // was more than 0

    if(data.length > 0) {
      var playtimeout = setInterval(function() {

          if(playseq.length == 0 || data.length == 0) {
            clearInterval(playtimeout);
            console.log("Clear play interval");
            avatarbusy=false;
            return;
          }

          if(avatarbusy == false) {
            avatarbusy = true; // this is set to flase in allcsa.js

            word2play = playseq.shift();

            if(lookup[word2play]==null) {

              avatarbusy=false;

              // break word2play into chars and unshift them to playseq
                for(i = word2play.length - 1; i >= 0; i--)
                  playseq.unshift(word2play[i]);


            } else {
              data2play = lookup[word2play];
              console.log(data2play);
              $("#currentWord").text(word2play);
              $(".txtaSiGMLText").val(data2play);
              $(".bttnPlaySiGMLText").click();
             }
          } else {
            console.log("Avatar is still busy");

            // check if error occured then reset the avatar to free
            errtext = $(".statusExtra").val();
            if(errtext.indexOf("invalid") != -1) {

              avatarbusy = false;

            }
          }
      }, 500);
    }







    }
