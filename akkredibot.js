var MongoClient = require('mongodb').MongoClient // her oprettes variablen med Mongo klienten
var express = require('express'); // her loades Express modulet
var app = express(); //her oprettes App variablen og sættes til Express() modulet. 
var jsonResponse = []; // her oprettes jsonResponse som et array
var NumberInt = require('mongoose-int32'); // loades så MongodDB kan håndtager tal.
var mongodbArray = [] // Her oprette variablen der skal indeholde resultatet fra MongodDB'en
var mongodbSvar = 0 // Her oprette variablen der skal indeholde resultatet fra MongodDB'en
var mongodbSvar2 = 0 // Her oprette variablen der skal indeholde resultatet fra MongodDB'en
var mongodbUdd1 = 0 // Her oprette variablen til uddannelsestype for en specifik insitution
var mongodbUdd2 = 0 // Her oprette variablen til uddannelsestype for en specifik insitution
var mongodbAfgr1 = 0 // Her oprette variablen til uddannelsestype for en specifik insitution
var mongodbAfgr2 = 0 // Her oprette variablen til uddannelsestype for en specifik insitution
var mongodbAfgr3 = 0 // Her oprette variablen til uddannelsestype for en specifik insitution
app.use(express.static(__dirname + '/img')); // Gør det muligt at vise png-billederne

// her sættes express til at lytte til port 80
app.listen(80, function() {
    console.log('Akkreditbot is listening on port 80...');
});

// Her fra starter de forskellige app.get kald.

//Samlet antal UA'er og IA'er (done)
app.get('/antal', function(req, res) {

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                "﻿Id": { $gt: parseInt(901000) } //jeg ved ikke hvorfor men ?-tegnet skal være med for at det virker

            }, function(err, result) {

                mongodbSvar = result

            })
            db.collection('akkrdata').count({

                "﻿Id": { $lt: parseInt(901000) } //jeg ved ikke hvorfor men ?-tegnet skal være med for at det virker

            }, function(err, result) {

                mongodbSvar2 = result

                callback()
            })
        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "for eksempel så har vi akkrediteret " + mongodbSvar2 + " uddannelser og " + mongodbSvar + " insitutioner." });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til uddannelsestyper (Done)
app.get('/type', function(req, res) {

    var type = req.query.udd
    if (type == "Erhvervsakademiudd") { type = "Erhvervsakademiuddannelse" };
    var uddtype

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Uddannelsestype: type

            }, function(err, result) {

                mongodbSvar = result

                callback()
            })
        })
    }

    if (type == "Kandidat") { uddtype = "kandidatuddannelser." };
    if (type == "Bachelor") { uddtype = "bacheloruddannelser." };
    if (type == "Professionsbachelor") { uddtype = "professionsbachelorer." };
    if (type == "Erhvervsakademiuddannelse") { uddtype = "erhvervsakademiuddannelser." };

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har akkrediteret " + mongodbSvar + " " + uddtype });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til afgørelser (Done)
app.get('/UA', function(req, res) {

    var type = req.query.afgorelse
    var afgorelse

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Raadets_afgoerelse: type

            }, function(err, result) {
                mongodbSvar = result

                callback()
            })
        })
    }

    if (type == "Positiv") { afgorelse = "positive afgørelser." };
    if (type == "Betinget positiv") { afgorelse = "betinget positive afgørelser." };
    if (type == "Afslag") { afgorelse = "afslag på akkreditering." };

    function SendJSON() {
        jsonResponse.push({ "text": "Rådet har tildelt " + mongodbSvar + " " + afgorelse });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

//Antal akkrediteringer fordelt i forhold til Sprog (done)
app.get('/lang', function(req, res) {

    var type = req.query.sprog
    var sprog

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Sprog: type

            }, function(err, result) {
                mongodbSvar = result

                callback()
            })
        })
    }

    if (type == "Dansk") { sprog = "dansksprogede uddannelser." };
    if (type == "Engelsk") { sprog = "engelsksprogede uddannelser." };

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har akkrediteret " + mongodbSvar + " " + sprog });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til Universiteter (Done)
app.get('/uni', function(req, res) {

    var type = req.query.navn
    var hovedinst

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Institution: type,

            }, function(err, result) { mongodbSvar = result })

            db.collection('akkrdata').count({

                Institution: type,
                Uddannelsestype: "Bachelor"

            }, function(err, result) { mongodbUdd1 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Uddannelsestype: "Kandidat"

            }, function(err, result) { mongodbUdd2 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Positiv"

            }, function(err, result) { mongodbAfgr1 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Betinget positiv"

            }, function(err, result) { mongodbAfgr2 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Afslag"

            }, function(err, result) {
                mongodbAfgr3 = result

                callback()
            })

        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har samlet akkrediteret " + mongodbSvar + " uddannelser fra " + type });
        jsonResponse.push({ "text": "Heraf " + mongodbUdd1 + " bacheloruddannelser og " + mongodbUdd2 + " kandidatuddannelser." });
        jsonResponse.push({ "text": "Akkredtiteringsrådet har givet " + type + " " + mongodbAfgr1 + " positive afgørelser, " + mongodbAfgr2 + " betinget positive og " + mongodbAfgr3 + " afslag på akkreditering" });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til Professionshøjskoler (Done)
app.get('/prof', function(req, res) {

    var type = req.query.navn
    var hovedinst

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Institution: type

            }, function(err, result) {
                mongodbSvar = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Uddannelsestype: "Professionsbachelor"

            }, function(err, result) { mongodbUdd1 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Uddannelsestype: "Erhvervsakademiuddannelse"

            }, function(err, result) { mongodbUdd2 = result })


            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Positiv"

            }, function(err, result) { mongodbAfgr1 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Betinget positiv"

            }, function(err, result) { mongodbAfgr2 = result })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Afslag"

            }, function(err, result) {
                mongodbAfgr3 = result

                callback()
            })

        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har samlet akkrediteret " + mongodbSvar + " uddannelser fra " + type });
        jsonResponse.push({ "text": "Heraf " + mongodbUdd1 + " professionsbachelorer og " + mongodbUdd2 + " erhvervsakademiuddannelser." });
        jsonResponse.push({ "text": "Akkredtiteringsrådet har givet " + type + " " + mongodbAfgr1 + " positive afgørelser, " + mongodbAfgr2 + " betinget positive og " + mongodbAfgr3 + " afslag på akkreditering" });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
    mongodbSvar = 0;
    mongodbUdd1 = 0;
    mongodbUdd2 = 0;
    mongodbAfgr1 = 0;
    mongodbAfgr2 = 0;
    mongodbAfgr3 = 0;
});

// Antal akkrediteringer fordelt i forhold til erhvervsakademier (Done)
app.get('/ea', function(req, res) {

    var type = req.query.navn
    var hovedinst

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Institution: type

            }, function(err, result) {
                mongodbSvar = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Uddannelsestype: "Professionsbachelor"

            }, function(err, result) {
                mongodbUdd1 = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Uddannelsestype: "Erhvervsakademiuddannelse"

            }, function(err, result) {
                mongodbUdd2 = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Positiv"

            }, function(err, result) {
                mongodbAfgr1 = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Betinget positiv"

            }, function(err, result) {
                mongodbAfgr2 = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Afslag"

            }, function(err, result) {
                mongodbAfgr3 = result

                callback()
            })

        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har samlet akkrediteret " + mongodbSvar + " uddannelser fra " + type });
        jsonResponse.push({ "text": "Heraf " + mongodbUdd1 + " professionsbachelorer og " + mongodbUdd2 + " erhvervsakademiuddannelser." });
        jsonResponse.push({ "text": "Akkredtiteringsrådet har givet " + type + " " + mongodbAfgr1 + " positive afgørelser, " + mongodbAfgr2 + " betinget positive og " + mongodbAfgr3 + " afslag på akkreditering" });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til Maritim uddannelsesinstitution (Done)
app.get('/maritim', function(req, res) {

    var type = req.query.navn
    var hovedinst

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Institution: type

            }, function(err, result) {
                mongodbSvar = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Positiv"

            }, function(err, result) {
                mongodbAfgr1 = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Betinget positiv"

            }, function(err, result) {
                mongodbAfgr2 = result

            })

            db.collection('akkrdata').count({

                Institution: type,
                Raadets_afgoerelse: "Afslag"

            }, function(err, result) {
                mongodbAfgr3 = result

                callback()
            })

        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har samlet akkrediteret " + mongodbSvar + " uddannelser fra " + type });
        jsonResponse.push({ "text": "Akkredtiteringsrådet har givet " + type + " " + mongodbAfgr1 + " positive afgørelser, " + mongodbAfgr2 + " betinget positive og " + mongodbAfgr3 + " afslag på akkreditering" });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til år (Done)
app.get('/UAaar', function(req, res) {

    var type = parseInt(req.query.aar)

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({
                Aar: type
            }, function(err, result) {

                mongodbSvar = result

                callback()
            })
        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "I " + type + " har vi akkrediteret " + mongodbSvar + " uddannelser." });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til institutionstyper (Done)
app.get('/insttype', function(req, res) {

    var type = req.query.type
    if (type == "Maritim institution") { type = "Maritim uddannelsesinstitution" };
    var uddtype

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Institutionstype: type

            }, function(err, result) {

                mongodbSvar = result

                callback()
            })
        })
    }

    if (type == "Universitet") { uddtype = "uddannelser udbudt på et universitet." };
    if (type == "Professionshøjskole") { uddtype = "uddannelser udbudt på en professionshøjskole." };
    if (type == "Erhvervsakademi") { uddtype = "uddannelser udbudt på et erhvervsakademi." };
    if (type == "Maritim uddannelsesinstitution") { uddtype = "uddannelser udbudt på en maritim uddannelsesinstitution." };

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har akkrediteret " + mongodbSvar + " " + uddtype });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Antal akkrediteringer fordelt i forhold til Hovedområder  (Done)
app.get('/hoved', function(req, res) {

    var type = req.query.omraade

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Hovedomraade: type

            }, function(err, result) {

                mongodbSvar = result

                callback()
            })
        })
    }

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har akkrediteret " + mongodbSvar + " uddannelser, indenfor " + type + "." });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

//Antal akkrediteringer fordelt i forhold til Akkrediteringstype (Done)
app.get('/akkr', function(req, res) {

    var type = req.query.type
    if (type == "Ny uddannelse") { type = "Ny" };
    if (type == "Institutions") { type = "Institutionsakkreditering" };
    var akkrtype

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').count({

                Ny_eksisterende: type

            }, function(err, result) {
                mongodbSvar = result

                callback()
            })
        })
    }

    if (type == "Institutionsakkreditering") { akkrtype = "institutionsakkrediteringer." };
    if (type == "Eksisterende") { akkrtype = "akkrediteiringer af eksisterende uddannelser." };
    if (type == "Ny") { akkrtype = "akkrediteiringer af nye uddannelser eller udadnnelsesudbud." };

    function SendJSON() {
        jsonResponse.push({ "text": "Vi har foretaget " + mongodbSvar + " " + akkrtype });
        res.send(jsonResponse);
    }

    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// Liste med UA'er (Done)
app.get('/findua', function(req, res) {

    var inst = req.query.Search_Inst
    if (inst == "KU") { inst = "Københavns Universitet" };
    if (inst == "CBS") { inst = "Copenhagen Business School" };
    if (inst == "DMJX") { inst = "Danmarks Medie- og Journalisthøjskole" };
    if (inst == "SIMAC") { inst = "Svendborg International Maritime Academy" };
    if (inst == "Martec") { inst = "Martec - Frederikshavns Maritime uddannelsescenter" };
    if (inst == "MSK") { inst = "Maskinmesterskolen København" };
    if (inst == "IBA") { inst = "Erhvervsakademi Kolding" };
    if (inst == "EAMV") { inst = "Erhvervsakademi Midtvest" };
    if (inst == "EASV") { inst = "Erhvervsakademi Sydvest" };
    if (inst == "EAL") { inst = "Erhvervsakademiet Lillebælt" };
    if (inst == "Dania") { inst = "Erhvervsakademi Dania" };
    if (inst == "CBA") { inst = "Copenhagen Business Academy" };
    if (inst == "UCC") { inst = "Professionshøjskolen UCC" };
    if (inst == "Metropol") { inst = "Professionshøjskolen Metropol" };
    if (inst == "AU") { inst = "Aarhus Universitet" };
    if (inst == "AAU") { inst = "Aalborg Universitet" };
    if (inst == "EASJ") { inst = "Erhvervsakademi Sjælland" };
    if (inst == "AAMS") { inst = "Aarhus Maskinmesterskole" };
    if (inst == "VIA") { inst = "VIA University College" };
    if (inst == "EAAA") { inst = "Erhvervsakademi Aarhus" };
    if (inst == "KEA") { inst = "Københavns Erhvervsakademi" };
    if (inst == "UCS") { inst = "University College Sjælland" };
    if (inst == "UCL") { inst = "University College Lillebælt" };
    if (inst == "SDU") { inst = "Syddansk Universitet" };
    if (inst == "RUC") { inst = "Roskilde Universitet" };
    if (inst == "ITU") { inst = "IT-Universitetet i København" };
    if (inst == "DTU") { inst = "Danmarks Tekniske Universitet" };
    var udd = req.query.udd
    var mongodburl = 0
    var mongodburl2 = 0
    var mongodbNavn

    function QueryMongoDB(callback) {
        MongoClient.connect('mongodb://localhost:27017/Akkredibot', function(err, db) {
            if (err) throw err

            // her vælges akkredibot databasen inklusiv query 
            db.collection('akkrdata').find(

                { Institution: inst, $text: { $search: udd } }, { "Navn": 1, "Link_til_afgoerelsesbrev": 1, _id: 0 }

            ).toArray(function(err, result) {
                if (err) throw err;

                mongodbArray = result;

                if (mongodbArray.length == 0) {
                    jsonResponse.push({ "text": "Kunne desværre ikke finde noget, tjek evt. stavning" })
                } else if (mongodbArray.length == 1) {
                    jsonResponse.push({ "text": "Her er hvad jeg fandt: " + mongodbArray[0].Navn + "" })
                    jsonResponse.push({ "text": "Og du kan hente akkrediteringsrapporten her: http://akkrediteringsraadet.dk/wp-content/uploads/afgoerelser/" + mongodbArray[0].Link_til_afgoerelsesbrev + "" })
                } else if (mongodbArray.length > 4) {
                    jsonResponse.push({ "text": "Der er for mange muligheder, prøv at gøre din søgning mere specifik." })
                } else {
                    for (var i = 0; i < result.length; i++) {
                        (function(j) {
                            mongodbSvar = result[i].Navn
                            mongodburl = result[i].Link_til_afgoerelsesbrev
                            i++
                            mongodbSvar2 = result[i].Navn
                            mongodburl2 = result[i].Link_til_afgoerelsesbrev

                            jsonResponse.push({
                                "attachment": {
                                    "type": "template",
                                    "payload": {
                                        "template_type": "list",
                                        "top_element_style": "compact",
                                        "elements": [{
                                                "title": "" + mongodbSvar + "",
                                                "subtitle": "Tryk på knappen nedenfor for at hente akkrediteringsrapporten.",
                                                "buttons": [{
                                                    "type": "web_url",
                                                    "url": "http://akkrediteringsraadet.dk/wp-content/uploads/afgoerelser/" + mongodburl + "",
                                                    "title": "Hent akkreditering"
                                                }]
                                            },
                                            {
                                                "title": "" + mongodbSvar2 + "",
                                                "subtitle": "Tryk på knappen nedenfor for at hente akkrediteringsrapporten.",
                                                "buttons": [{
                                                    "type": "web_url",
                                                    "url": "http://akkrediteringsraadet.dk/wp-content/uploads/afgoerelser/" + mongodburl2 + "",
                                                    "title": "Hent akkreditering"
                                                }]
                                            }
                                        ]
                                    }
                                }
                            });
                        })(i);
                    }
                }
                callback()
            })
        })
    }

    function SendJSON() {
        res.send(jsonResponse);
    }
    QueryMongoDB(SendJSON);
    jsonResponse.length = 0;
});

// En test af Chart-Node
app.get('/chart', function(req, res) {

    const ChartjsNode = require('chartjs-node');
    // 600x600 canvas size
    var chartNode = new ChartjsNode(600, 600);
    var randomnumber = Math.random();
    var imagename = "testimage" + randomnumber + ".png"

    // each api returns a Promise
    chartNode.drawChart({
            type: 'bar',
            data: {
                labels: ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
                datasets: [{
                    label: 'Antal akkrediteringer',
                    data: [57, 125, 249, 262, 271, 289, 227, 98, 126, 93, 41],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 30,
                        right: 30,
                        top: 30,
                        bottom: 30
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
        .then(() => {
            // now we have a chart
            // lets get the image stream
            return chartNode.getImageStream('image/png');
        })
        .then(imageStream => {
            // now you can do anything with the image, like upload to S3
            // lets get the image buffer
            return chartNode.getImageBuffer('image/png');
        })
        .then(imageBuffer => {
            // now you can modify the raw PNG buffer if you'd like
            // want to write the image directly to the disk, no problem
            return chartNode.writeImageToFile('image/png', '/home/nicki/akkredibot/img/' + imagename);
        })
        .then(() => {
            jsonResponse.length = 0;
            jsonResponse.push({
                "attachment": {
                    "type": "image",
                    "payload": {
                        "url": "http://95.85.21.185/" + imagename + ""
                    }
                }
            });
            res.send(jsonResponse);
            jsonResponse.length = 0;

            chartNode.destroy()
        });
});