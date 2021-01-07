require('dotenv').config()
const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');
const fs = require('fs');
const request = require('request');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const Lexabox = require('dropbox');
const colors = require('colors');
const logSymbols = require('log-symbols');
const checkDiskSpace = require('check-disk-space');
const OneSignal = require('onesignal-node');
const MongoStore = require('connect-mongo')(session);
var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;
var multer = require('multer');
var sftpStorage = require('multer-sftp');
var FTPStorage = require('multer-ftp');
var FTP = require('ftp');
const AWS = require('aws-sdk');
const Setting = require("./models/settings.js");
const Admin = require("./models/admin.js");
const Rider = require("./models/riders.js");
const Driver = require("./models/drivers.js");
const Vehicle = require("./models/vehicles.js");
const Chat = require("./models/chats.js");
const Favorite = require("./models/favorites.js");
const Distress = require("./models/distress.js");
const Ride = require("./models/rides.js");
const Rate = require("./models/rates.js");
const Promo = require("./models/promotions.js");
const Payment = require("./models/payments.js");
const Notification = require("./models/notifications.js");
const Carbrands = require("./models/carbrands.js");
const Colorcodes = require('./models/colorcodes.js');
const Cms = require("./models/cms.js");
const freelance = '5f47f9e62dc7b16cb6f33c40';
const player = require('play-sound')(opts = {})
const Supportchat = require("./models/supportchat.js");
const ftpConnection = { host: 'lexacle.com', port: 21, secure: false, user: 'vapor@cloud.lexacle.com', password: 'Leslie#Myles@2028' };
//const url = process.env.DB_URL;
const url = 'mongodb+srv://tufike:nUJjC9qzGYih8ZrX@cluster0.17g7f.mongodb.net/tufike?retryWrites=true&w=majority';
const atsdk = { apiKey: '8d82a365b9424afffc695b8558648dc4b29b7d63b86db1313028eb4e54052209', username: 'tufike' };
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave('FLWPUBK-1fea7bc68f87f43c193cc1bb05b7fb4a-X', 'FLWSECK-ad2fead7d8ec7c8fdafcc9ef41d8f44e-X');
const AfricasTalking = require('africastalking')(atsdk);
const sms = AfricasTalking.SMS;
const smb = AfricasTalking.APPLICATION;
const cloudUrl = 'https://cloud.lexacle.com/vapor';
const dbToken = 'EtwLS5gnxUYAAAAAAAAAARH-Ycv4cdQwqbxWk5Ip_inxzskPwrmAZQ1DTB16YHHY';
const dropBoxAPI = { method: "POST", url: 'https://api.dropboxapi.com/2/users/get_space_usage', headers: { "Authorization": "Bearer " + dbToken } };
var ehbs = require('nodemailer-express-handlebars-plaintext-inline-ccs');
const etemplatesFolder = './views/templates/email';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, function(err) {
    if (err) {
        console.log(err);
    } else {}
});
var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function() {
    mdb.db.stats(function(err, stats) {
        if (err) {
            console.log('Could not connect to Database Server');
        } else {
            //console.log(stats);
        }
    });
});
var fidel = new FTP();
fidel.on('ready', function() {
    fidel.size('/', function(err, status) {
        if (err) {} else {
            //console.log(status)
        }
        fidel.end();
    });
});
//fidel.connect(ftpConnection);
//dropInfo();

function dropInfo() {
    request(dropBoxAPI, function(err, res) {
        if (err) {
            //console.log(err);
        } else {
            //console.log(res.body)
        }
    })
}
function dropLink(path, url){
  var headers = {
      'Authorization': 'Bearer ' + dbToken,
      'Content-Type': 'application/json'
  };
  var dataString = '{"path": "/' + path + '", "url": "' + url + '"}';
  options = {
      method: "POST",
      url: 'https://api.dropboxapi.com/2/files/save_url',
      headers: headers,
      body: dataString
  };
  request(options, function(err, res, body) {
      if (err) {
          //console.log(err);
      }else {
        //console.log(res.body)
      }
  })
}

function unDropLink(path) {
    var headers = {
        'Authorization': 'Bearer ' + dbToken,
        'Content-Type': 'application/json'
    };
    var dataString = '{"path": "/' + path + '"}';
    var options = {
        url: 'https://api.dropboxapi.com/2/files/delete_v2',
        method: 'POST',
        headers: headers,
        body: dataString
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
        } else {
            //console.log(error)
        }
    }
    request(options, callback);
}
function iLinkPro(path, url) {
    var headers = {
        'Authorization': 'Bearer ' + dbToken,
        'Content-Type': 'application/json'
    };
    var dataString = '{"path": "/' + path + '"}';
    var options = {
        url: 'https://api.dropboxapi.com/2/files/delete_v2',
        method: 'POST',
        headers: headers,
        body: dataString
    };
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          //console.log(response)
            dropLink(path, url)
        } else {
          console.error()
            //dropLink(path, url)
        }
    }
    request(options, callback);
}
function dropIt(loccy, folly, filley) {
    var content = fs.readFileSync(loccy + filley);
    options = {
        method: "POST",
        url: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
            "Content-Type": "application/octet-stream",
            "Authorization": "Bearer " + dbToken,
            "Dropbox-API-Arg": "{\"path\": \"/vapor/" + folly + filley + "\",\"mode\": \"overwrite\",\"autorename\": false,\"mute\": false}",
        },
        body: content
    };
    request(options, function(err, res, body) {
        if (err) {
            //console.log(err);
        }
    })
}

function unDropIt(folly, undrop) {
    var headers = {
        'Authorization': 'Bearer ' + dbToken,
        'Content-Type': 'application/json'
    };
    var dataString = '{"path": "/vapor/' + folly + undrop + '"}';
    var options = {
        url: 'https://api.dropboxapi.com/2/files/delete_v2',
        method: 'POST',
        headers: headers,
        body: dataString
    };

    function callbacky(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
        } else {
            //console.log(error)
        }
    }

    request(options, callbacky);
}

const riderBurst = new OneSignal.Client('78aa0c2b-c194-4e2d-b7ae-45ab7af286fc', 'YzVhNThmODktOWU2OC00YWNjLWFiMmUtNGRlNTY2MjhjZGIw');
const driverBurst = new OneSignal.Client('f672e8f6-4fc2-4d1c-af43-726fe8308183', 'NGNlMDRiMGQtYjdjMS00ZWQ3LTg2YjktNGMyZDhlMjExMmQ3');
const ownerBurst = new OneSignal.Client('172feb21-563e-4fb8-b66e-4426e1a922ee', 'MzdlOTJmOGQtMzdiMS00N2RhLThlMTAtZGVmYjU5NjE3NmFh');
const adminBurst = new OneSignal.Client('4b618591-01ab-4580-8769-51d4c91da11c', 'N2M0ODYwNGUtYTNiYy00MDkyLWE1NjAtMzk1YzVjNjI3NzFj');
const userClient = new OneSignal.UserClient('ZWM2NGVhMjctNWEzNy00YzUxLTg1M2QtYjdiNjYwNTZhMGRi', {
    apiRoot: 'https://onesignal.com/api/v2'
});
//allRiderBursts();
//allDriverBursts();
//oneBurstRider(oneMessage, oneHeader, oneUser);
//multiBurstRider(oneMessage, oneHeader);
//oneBurstDriver(oneMessage, oneHeader, oneUser);
//multiBurstDriver(oneMessage, oneHeader);
async function allRiderBursts() {
    const signal = await riderBurst.viewNotifications();
    return signal.body.notifications;
}
async function allDriverBursts() {
    const signal = await driverBurst.viewNotifications();
    return signal.body.notifications;
}

async function oneBurstRider(oneMessage, oneHeader, oneUser) {
    const notification = {
        app_id: "78aa0c2b-c194-4e2d-b7ae-45ab7af286fc",
        headings: {
            'en': oneHeader
        }, //'Tufike Pamoja Cabs 👌',
        android_background_layout: {
            'headings_color': 'FFFF0000',
            'contents_color': 'FF00FF00'
        },
        android_accent_color: 'ae00b8',
        android_led_color: 'FF00FF00',
        contents: {
            'en': oneMessage,
        },
        include_player_ids: [oneUser], //included_segments: ['Subscribed Users'],
    };
    try {
        const response = await riderBurst.createNotification(notification);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            /*
            console.log(e.statusCode);
            console.log(e.body);
            */
        }
    }
}
async function multiBurstAdmin(oneHeader, oneMessage) {
    const notification = {
        app_id: "4b618591-01ab-4580-8769-51d4c91da11c",
        headings: {
            'en': oneHeader
        }, //'Tufike Pamoja Cabs 👌',
        chrome_web_icon: 'https://www.dropbox.com/s/im9zcwb5bwqqjvn/rider.png?raw=1',
        priority: 10,
        contents: {
            'en': oneMessage,
        },
        included_segments: ['Subscribed Users'],
    };
    try {
        const response = await adminBurst.createNotification(notification);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            //console.log(e.statusCode);
            //console.log(e.body);
        }
    }
}

async function multiBurstRider(oneMessage, oneHeader) {
    const notification = {
        app_id: "78aa0c2b-c194-4e2d-b7ae-45ab7af286fc",
        priority: 10,
        headings: {
            'en': oneHeader
        }, //'Tufike Pamoja Cabs 👌',
        contents: {
            'en': oneMessage,
        },
        included_segments: ['Subscribed Users'],
    };
    try {
        const response = await riderBurst.createNotification(notification);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            //console.log(e.statusCode);
            //console.log(e.body);
        }
    }
}

async function oneBurstDriver(oneMessage, oneHeader, oneUser) {
    const notification = {
        app_id: "f672e8f6-4fc2-4d1c-af43-726fe8308183",
        headings: {
            'en': oneHeader
        }, //'Tufike Pamoja Cabs 👌',
        contents: {
            'en': oneMessage,
        },
        include_player_ids: [oneUser] //included_segments: ['Subscribed Users'],
    };
    try {
        const response = await driverBurst.createNotification(notification);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            //console.log(e.statusCode);
            //console.log(e.body);
        }
    }
}

async function multiBurstDriver(oneMessage, oneHeader) {
    const notification = {
        app_id: "f672e8f6-4fc2-4d1c-af43-726fe8308183",
        headings: {
            'en': oneHeader
        }, //'Tufike Pamoja Cabs 👌',
        contents: {
            'en': oneMessage,
        },
        included_segments: ['Subscribed Users'],
    };
    try {
        const response = await driverBurst.createNotification(notification);
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            //console.log(e.statusCode);
            //console.log(e.body);
        }
    }
}

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true,
    inflate: true,
    limit: '10mb'
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    secret: 'Jy2JFZwTD4CZ3CG9rYaSfISXnM3p3',
    resave: false,
    cookie: {
        secure: false,
        httpOnly: false,
        expires: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
var ObjectId = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'mail.lexacle.com',
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    auth: {
        user: 'tufike@lexacle.com',
        pass: 'Tufike@2019'
    }
});
const eoptions = {
    viewEngine: hbs,
    templatesDir: etemplatesFolder,
    extName: '.hbs',
    plaintextOptions: {
      uppercaseHeadings: false
    }
  }
const PORT = process.env.PORT || 4080;
var http = require('http').createServer(app);
var io = require('socket.io')(http);
http.listen(PORT, '0.0.0.0', function() {
    console.log(logSymbols.success, `Tufike Admin Console listening on port: ${ PORT }`.cyan);
});
var tufikeData = new CronJob('*/5 * * * * *', function() {
    systemPunch();
}, null, true, 'Africa/Nairobi');
var mDbBackupCron = new CronJob('0 * * * *', function() {
    nightly();
}, null, true, 'Africa/Nairobi');
mDbBackupCron.start();


var setquery = {setid: 'main'};
Setting.findOne(setquery).exec(function(err, res) {
    if (err) { console.log(err) } else {
      //mDbBackupCron.setTime(new CronTime('16 1 * * *'))
    }
  })

function systemPunch() {

    smb.fetchApplicationData()
        .then(response => {
            var res = { istat: 'success', response };
            io.sockets.emit('sms balance', res)
        })
        .catch(error => {
            var res = { istat: 'failed' };
            io.sockets.emit('sms balance', res)
                //console.log(error);
        });
    var pquery1 = { packagename: 'Basic' };
    var pquery2 = { packagename: 'Comfy' };
    var pquery3 = { packagename: 'Lux' };
    Ride.countDocuments(pquery1).exec(function(err, p1) {
        Ride.countDocuments(pquery2).exec(function(err, p2) {
            Ride.countDocuments(pquery3).exec(function(err, p3) {
                var preferences = { basic: p1, comfy: p2, lux: p3 };
                io.sockets.emit('all cron preferences', preferences);
            })
        })
    })
    Rider.find().exec(function(err, res) {
        if (err) { console.log(err); } else {
            io.sockets.emit('all cron riders', res);
        }
    })
    Driver.find().exec(function(err, res) {
        if (err) { console.log(err); } else {
            io.sockets.emit('all cron drivers', res);
        }
    })
    Vehicle.find().exec(function(err, res) {
        if (err) { console.log(err); } else {
            io.sockets.emit('all cron vehicles', res);
        }
    })
    Rate.find().exec(function(err, res) {
        if (err) { console.log(err); } else {
            io.sockets.emit('all cron rates', res);
        }
    })
    Ride.find().exec(function(err, res) {
        if (err) { console.log(err); } else {
            io.sockets.emit('all cron rides', res);
        }
    })
}
/*
const mpesa =  async () =>{

    try {

        const payload = {
            "tx_ref": "MC-15852113s09v5050e8",
            "amount": "2",
            "currency": "KES",
            "email": "felixoenga@gmail.com",
            "phone_number": "0727779929",
            "fullname": "Felix Oenga"
    }
       const response =  await flw.MobileMoney.mpesa(payload)
       console.log(response);
    } catch (error) {
        console.log(error)
    }

}


mpesa();


*/
var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

var config = {
    user: "vapor@cloud.lexacle.com",
    // Password optional, prompted if none given
    password: "Leslie#Myles@2028",
    host: "ftp.lexacle.com",
    port: 21,
    localRoot: __dirname + "/models",
    remoteRoot: "/models",
    include: ["*", "**/*"],
    deleteRemote: true,
    forcePasv: true,
    sftp: false
};

ftpDeploy.deploy(config).then(res => console.log("finished:", res)).catch(err => console.log(err));
function ftpDB(){
var ftpDep = new FtpDeploy();
var config = {
    user: "vapor@cloud.lexacle.com",
    password: "Leslie#Myles@2028",
    host: "ftp.lexacle.com",
    port: 21,
    localRoot: __dirname + "/core/mdb",
    remoteRoot: "/core/mdb",
    include: ["*", "**/*"],
    deleteRemote: false,
    forcePasv: true,
    sftp: false
};
//ftpDep.deploy(config, function(err, res) {if (err){}else{}});
}



var maxSize = 5 * 1000000;
app.post('/upload/logbook', function(req, res, callback) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg' && ext !== '.pdf') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/vehicles/logbooks', ftp: ftpConnection })
    }).single('logbook');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var vid = req.body.vid;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathfile = splitpath[4];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: vid };
            var nupdate = { $set: { logbook: pathfile } };
            Vehicle.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.logbook !== 'none') {
                        var ipath = '/vapor/assets/vehicles/logbooks/' + result.logbook;
                        unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/vehicles/logbooks/' + result.logbook, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});
app.post('/upload/insurance', function(req, res, callback) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg' && ext !== '.pdf') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/vehicles/insurance', ftp: ftpConnection })
    }).single('insurance');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var vid = req.body.vid;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathfile = splitpath[4];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: vid };
            var nupdate = { $set: { insurance: pathfile } };
            Vehicle.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.insurance !== 'none') {
                      var ipath = '/vapor/assets/vehicles/insurance/' + result.insurance;
                      unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/vehicles/insurance/' + result.insurance, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});
app.post('/upload/front', function(req, res, callback) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/vehicles/cars', ftp: ftpConnection })
    }).single('frontphoto');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var vid = req.body.vid;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathphoto = splitpath[4];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: vid };
            var nupdate = { $set: { frontphoto: pathphoto } };
            Vehicle.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.frontphoto !== 'none') {
                      var ipath = '/vapor/assets/vehicles/cars/' + result.frontphoto;
                      unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/vehicles/cars/' + result.frontphoto, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});
app.post('/upload/side', function(req, res, callback) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/vehicles/cars', ftp: ftpConnection })
    }).single('sidephoto');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var vid = req.body.vid;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathphoto = splitpath[4];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: vid };
            var nupdate = { $set: { sidephoto: pathphoto } };
            Vehicle.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.sidephoto !== 'none') {
                      var ipath = '/vapor/assets/vehicles/cars/' + result.sidephoto;
                      unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/vehicles/cars/' + result.sidephoto, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});

app.post('/upload/rear', function(req, res, callback) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/vehicles/cars', ftp: ftpConnection })
    }).single('rearphoto');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var vid = req.body.vid;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathphoto = splitpath[4];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: vid };
            var nupdate = { $set: { backphoto: pathphoto } };
            Vehicle.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.backphoto !== 'none') {
                      var ipath = '/vapor/assets/vehicles/cars/' + result.backphoto;
                      unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/vehicles/cars/' + result.backphoto, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});

app.post('/upload/license', function(req, res, callback) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/drivers/documents/license', ftp: ftpConnection })
    }).single('license');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var did = req.body.did;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathphoto = splitpath[5];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: did };
            var nupdate = { $set: { license: pathphoto } };
            Driver.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.license !== 'none') {
                      var ipath = '/vapor/assets/drivers/documents/license/' + result.license;
                      unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/drivers/documents/license/' + result.license, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});
app.post('/upload/ntsa', function(req, res) {
    var upload = multer({
        limits: { fileSize: maxSize },
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.webp' && ext !== '.jpeg') {
                return callback(('failed'))
            }
            callback(null, true)
        },
        storage: new FTPStorage({ basepath: '/assets/drivers/documents/ntsa', ftp: ftpConnection })
    }).single('ntsa');
    upload(req, res, function(err) {
        if (err) {
            res.end('error')
        } else {
            var did = req.body.did;
            var fullpath = res.req.file.path;
            var splitpath = fullpath.split("/");
            var pathphoto = splitpath[5];
            var path = `vapor${fullpath}`;
            var url = `${cloudUrl}${fullpath}`;
            dropLink(path, url);
            var query = { _id: did };
            var nupdate = { $set: { ntsa: pathphoto } };
            Driver.findOneAndUpdate(query, nupdate).exec(function(err, result) {
                if (err) { console.log(err); } else {
                    if (result.ntsa !== 'none') {
                      var ipath = '/vapor/assets/drivers/documents/ntsa/' + result.ntsa;
                      unDropLink(ipath);
                        var fidel = new FTP();
                        fidel.on('ready', function() {
                            fidel.delete('/assets/drivers/documents/ntsa/' + result.ntsa, function(err) {
                                if (err) throw err;
                                fidel.end();
                            });
                        });
                        fidel.connect(ftpConnection);
                    }
                }
            })
            res.end('success')
        }
    });
});

app.use(require('./routes/login'));
app.use(require('./routes/dashboard'));
app.use(require('./routes/riders'));
app.use(require('./routes/drivers'));
app.use(require('./routes/vehicles'));
app.use(require('./routes/rides'));
app.use(require('./routes/distress'));
app.use(require('./routes/transactions'));
app.use(require('./routes/support'));
app.use(require('./routes/packages'));
app.use(require('./routes/notifications'));
app.use(require('./routes/promotions'));
app.use(require('./routes/points'));
app.use(require('./routes/profile'));
app.use(require('./routes/settings'));
app.use(require('./routes/users'));
app.use(require('./routes/logout'));

app.post('/auth', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://loclhost:4080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var email = req.body.email;
    var password = req.body.password;
    var query = {
        email: email,
        password: password
    };
    Admin.findOne(query).exec(function(err, result) {
        if (err) {
            var response = {
                status: 3
            };
            res.end(JSON.stringify(response))
        } else {
            if (result) {
                res.end(JSON.stringify(result))
                req.session.loggedin = true;
                req.session.uid = result._id;
                req.session.save();
            } else {
                var response = {
                    status: 3
                };
                res.end(JSON.stringify(response))
            }
        }
    })
})

var onlinequery = { $set: { "settings.online": 0 } };
Rider.updateMany(onlinequery).exec(function(err, res) {
    if (err) { console.log(err); } else {
        Driver.updateMany(onlinequery).exec(function(err, res) {
            if (err) { console.log(err); } else {
                Vehicle.updateMany(onlinequery).exec(function(err, res) {
                    if (err) { console.log(err); } else {

                    }
                })
            }
        })
    }
})
var count = 0;
const users = {};
io.on('connection', function(socket) {
    count++;
    io.emit('connected users', count);
    socket.on('tufike pamoja', function(xid) {
        io.sockets.emit('online', xid);
        users[socket.id] = xid;
        var superquery = { _id: xid };
        var superdata = { $set: { "settings.online": 1 } };
        Rider.updateOne(superquery, superdata).exec(function(err, res) {
            if (err) { console.log(err); } else {
                Driver.updateOne(superquery, superdata).exec(function(err, res) {
                    if (err) { console.log(err); } else {
                        Vehicle.updateOne(superquery, superdata).exec(function(err, res) {
                            if (err) { console.log(err); } else {

                            }
                        })
                    }
                })
            }
        })
    })
    socket.on('deploy system backup', function(vapor) {
        vaporDeploy.deploy(vaporconfig, function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('deploy system backup', res)
            }
        });
    })
    socket.on('disconnect', function() {
        count--;
        io.emit('connected users', count);
        var xid = users[socket.id];
        io.sockets.emit('offline', xid);
        var superquery = { _id: xid };
        var superdata = { $set: { "settings.online": 0 } };
        Rider.updateOne(superquery, superdata).exec(function(err, res) {
            if (err) { console.log(err); } else {
                Driver.updateOne(superquery, superdata).exec(function(err, res) {
                    if (err) { console.log(err); } else {
                        Vehicle.updateOne(superquery, superdata).exec(function(err, res) {
                            if (err) { console.log(err); } else {
                                delete users[socket.id];
                            }
                        })
                    }
                })
            }
        })
    });
    socket.on('cloud dropbox stats', function(admin) {
        options = {
            method: "POST",
            url: 'https://api.dropboxapi.com/2/users/get_space_usage',
            headers: { "Authorization": "Bearer " + dbToken }
        };
        request(options, function(err, res) {
            if (err) {
                var response = { status: 'disconnected' };
                socket.emit('cloud dropbox stats', response)
            } else {
                var response = res.body;
                socket.emit('cloud dropbox stats', response)
            }
        })
    })
    socket.on('cloud database stats', function(admin) {
        mdb.db.stats(function(err, stats) {
            if (err) {

            } else {
                socket.emit('cloud database stats', stats)
            }
        });
    })
    socket.on('cloud ssd stats', function(admin) {
        checkDiskSpace('/').then((diskSpace) => {
            socket.emit('cloud ssd stats', diskSpace);
        })
    })
    socket.on('fetch admin account', function(aid) {
        var query = { _id: aid };
        Admin.findOne(query).exec(function(err, result) {
            if (err) { console.log(err) } else {
                socket.emit('fetch admin account', result)
            }
        })
    })
    socket.on('update admin password',function(account){
      var query = {_id: account.aid, password: account.curpass};
      var nupdate = {$set: {password: account.newpass}};
      Admin.findOneAndUpdate(query, nupdate).exec(function(err, result) {
          if (err) { console.log(err); } else {
            if(result){
              var data = {status: 'success', result: result};
              socket.emit('update admin password',data)
            }
            else {
              var data = {status: 'failed', result: null};
              socket.emit('update admin password',data)
            }
          }
        })
    })
    socket.on('update admin account',function(account){
      var query = {_id: account.aid};
      var nupdate = {$set: {firstname: account.fname, lastname: account.lname, email: account.email, phone: account.phone, about: account.about}};
      Admin.findOneAndUpdate(query, nupdate).exec(function(err, result) {
          if (err) { console.log(err); } else {
            socket.emit('update admin account',result)
          }
        })
    })
    socket.on('initiate distress alert', function(xdistress) {
        var rid = xdistress.rid;
        var initname = xdistress.initiator;
        var query = { _id: ObjectId(rid) }
        var setquery = { setid: 'main' };
        Ride.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err) } else {

                var distressdata = {
                    rideid: res[0]._id,
                    driverid: res[0].driver,
                    riderid: res[0].rider,
                    initiator: initname,
                    vehicleid: res[0].xdriver.vehicle,
                    riderlocation: {
                        type: "Point",
                        coordinates: [res[0].xdriver.location.coordinates[0], res[0].xdriver.location.coordinates[1]]
                    },
                    driverlocation: {
                        type: "Point",
                        coordinates: [res[0].xdriver.location.coordinates[0], res[0].xdriver.location.coordinates[1]]
                    },
                    created: Date.now(),
                    status: 1
                };
                const Dxdata = new Distress(distressdata)
                Setting.findOne(setquery).exec(function(err, res) {
                    if (err) { console.log(err) } else {
                        var corephone = '+254' + (res.setphone).substr(1);
                        const dsms = {
                            to: corephone,
                            message: 'Distress alert has been initiated by Tufike ' + initname + '. Please check this on the Admin console and resolve this ASAP'
                        }
                        sms.send(dsms)
                            .then(response => {})
                            .catch(error => {
                                console.log(error);
                            });

                    }
                })
                Dxdata.save((err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        io.sockets.emit('initiate distress alert', result);
                        io.sockets.emit('distress alert initiated', result);
                    }
                })
            }
        })
    })
    socket.on('fetch distress alerts', function(admin) {
        var query = { status: { $ne: 5 } };
        Distress.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: 'rideid',
                    foreignField: '_id',
                    as: 'ride'
                }
            },
            {
                $unwind: {
                    path: '$ride',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'riderid',
                    foreignField: '_id',
                    as: 'rider'
                }
            },
            {
                $unwind: {
                    path: '$rider',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driverid',
                    foreignField: '_id',
                    as: 'driver'
                }
            },
            {
                $unwind: {
                    path: '$driver',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicleid',
                    foreignField: '_id',
                    as: 'vehicle'
                }
            },
            {
                $unwind: {
                    path: '$vehicle',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch distress alerts', res)
            }
        })
    })
    socket.on('fetch system settings', function(sid) {
        var query = { setid: 'main' };
        Setting.findOne(query).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch system settings', res);
            }
        })
    })
    socket.on('update vapor console', function(setup) {
        var query = { _id: setup.sid };
        var newset = { $set: { setmail: setup.email, setphone: setup.phone, setminredeem: setup.minred, setmaxredeem: setup.maxred, setperpoint: setup.cash, setrides: setup.maxrid, setchat: setup.chatxt, setcronfs: setup.cronfs, setcrondb: setup.crondb, setcronpn: setup.cronpn, setnrider: setup.nrider, setndriver: setup.ndriver, setmpesa: setup.smpesa, setcard: setup.scard, setpoints: setup.spoints, setpromo: setup.spromo } };
        Setting.findOneAndUpdate(query, newset).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('update vapor console', res);
            }
        })
    })
    socket.on('disable ride package', function(pid) {
        var query = { _id: pid };
        var newset = { $set: { status: 2 } };
        Rate.findOneAndUpdate(query, newset).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('disable ride package', res);
            }
        })
    })
    socket.on('enable ride package', function(pid) {
        var query = { _id: pid };
        var newset = { $set: { status: 1 } };
        Rate.findOneAndUpdate(query, newset).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('enable ride package', res);
            }
        })
    })
    socket.on('check driver documents', function(did) {
        io.sockets.emit('online', did);
        var query = { _id: did };
        Driver.findOne(query).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('check driver documents', res);
            }
        })
    })
    socket.on('check disk space', function(admin) {
        checkDiskSpace('/').then((diskSpace) => {
            socket.emit('check disk space', diskSpace);
        })
    })
    socket.on('delete admin account', function(did) {
        var query = { _id: did };
        Admin.deleteOne(query).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('delete admin account', res);
            }
        })
    })
    socket.on('fetch admin users', function(admin) {
        Admin.find().sort({ _id: -1 }).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch admin users', res);
            }
        })
    })
    socket.on('fetch system settings', function(admin) {
        var query = { setid: 'main' };
        Setting.findOne(query).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch system settings', res);
            }
        })
    })
    socket.on('create admin account', function(account) {
        const Admindata = new Admin(account)
        Admindata.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    for (key in err.keyValue) {
                        if (err.keyValue.hasOwnProperty(key)) {
                            var keyval = err.keyValue[key];
                        }
                    }
                    var message = {
                        icon: 'person',
                        color: 'danger',
                        content: 'The email ' + keyval + ' has already been registered with one of the Tufike Pamoja Admins',
                        sound: 'favorite'
                    };
                    io.sockets.emit('notify admin', JSON.stringify(message));
                } else {
                    var message = {
                        icon: 'person',
                        color: 'danger',
                        content: 'An unknown error occurred while creating the admin account. Please try again later.',
                        sound: 'favorite'
                    };
                    io.sockets.emit('notify admin', JSON.stringify(message));
                }
            } else {
                io.sockets.emit('create admin account', result);
                var message = {
                    icon: 'person',
                    color: 'success',
                    content: 'A New Admin account has been created successfully',
                    sound: 'favorite'
                };
                io.sockets.emit('notify admin', JSON.stringify(message));
                player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
            }
        })
    })
    socket.on('fetch driver documents', function(did) {
        var query = { _id: did };
        Driver.findOne(query).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch driver documents', res);
            }
        })
    })
    socket.on('block driver account', function(did) {
        var query = { _id: did };
        var newdata = { $set: { status: 3 } };
        Driver.findOneAndUpdate(query, newdata).exec(function(err, res) {
            if (err) { console.log(err); } else {
                io.sockets.emit('block driver account', res);
            }
        })
    })
    socket.on('unblock driver account', function(did) {
        var query = { _id: did };
        var newdata = { $set: { status: 2 } };
        Driver.findOneAndUpdate(query, newdata).exec(function(err, res) {
            if (err) { console.log(err); } else {
                io.sockets.emit('unblock driver account', res);
            }
        })
    })
    socket.on('update ride package', function(pdata) {
        var query = { _id: pdata.pid };
        var newdata = {
            $set: {
                package: pdata.pname,
                basefare: pdata.pbase,
                minimumfare: pdata.pminimum,
                permin: pdata.pmin,
                perkm: pdata.pkm,
                waitingtime: pdata.pwtime,
                waitingcharges: pdata.pwcharge,
                commission: pdata.pcom,
                rewards: pdata.ppoints,
                perreward: pdata.psh,
                minredeem: pdata.prmin,
                maxredeem: pdata.prmax
            }
        };
        Rate.findOneAndUpdate(query, newdata).exec(function(err, result) {
            if (err) { console.log(err); } else {
                socket.emit('update ride package', result);
            }
        })
    })
    socket.on('fetch vehicle details', function(oid) {
        var query = { _id: ObjectId(oid) };
        Vehicle.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'xrates'
                }
            },
            {
                $unwind: {
                    path: "$xrates",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec(function(err, result) {
            if (err) { console.log(err) } else {
                socket.emit('fetch vehicle details', result)
            }
        })
    })
    socket.on('fetch all rewards', function(admin) {
        var query = { rewardedpoints: { $ne: 0 } };
        Ride.aggregate([{
                $match: query
            },
            {
                $group: {
                    _id: "$rider",
                    rides: { $sum: 1 },
                    totalRewarded: { $sum: '$rewardedpoints' },
                    totalRedeemed: { $sum: '$redeemedpoints' },
                    rider: { $last: '$rider' },
                    created: { $last: '$created' }
                }
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch all rewards', res);
            }
        })
    })
    socket.on('lnm rider', function(lnmdata) {
        var query = { _id: lnmdata.uid };
        Rider.findOne(query).exec(function(err, response) { if (err) { console.log(err) } else {} })
        console.log(lnmdata);
        const mpesa = async() => {
            try {
                const payload = {
                    'tx_ref': lnmdata.rid,
                    'amount': lnmdata.amount,
                    'currency': 'KES',
                    'email': lnmdata.email,
                    'phone_number': lnmdata.phone,
                    'fullname': lnmdata.name
                }
                const response = await flw.MobileMoney.mpesa(payload)
                console.log(response);
                io.sockets.emit('lnm rider', response);
            } catch (error) {
                console.log(error)
                io.sockets.emit('lnm rider', error);
            }
        }
        mpesa()
    })
    socket.on('lnm verify', function(vinah) {
        const verify = async() => {
            try {
                const payload = { 'id': vinah }
                const response = await flw.Transaction.verify(payload)
                console.log(response);
                io.sockets.emit('lnm verify', response);
            } catch (error) {
                console.log(error)
                io.sockets.emit('lnm verify', error);
            }
        }
        verify();
    })

    socket.on('receive driver payments', function(payload) {
        const Paydata = new Payment(payload);
        Paydata.save((err, result) => {
            if (err) { console.log(err); } else {
                io.sockets.emit('receive driver payments', payload);
                io.sockets.emit('driver payment received', payload);
            }
        })
    })
    socket.on('fetch recent payments', function(admin) {
        Payment.aggregate([{
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'pdriver'
                }
            },
            {
                $unwind: {
                    path: "$pdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'pvehicle'
                }
            },
            {
                $unwind: {
                    path: "$pvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: 'cashier',
                    foreignField: '_id',
                    as: 'xadmin'
                }
            },
            {
                $unwind: {
                    path: "$xadmin",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $limit: 4
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch recent payments', res);
            }
        })
    })
    socket.on('fetch payment transactions', function(admin) {
        Payment.aggregate([{
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'pdriver'
                }
            },
            {
                $unwind: {
                    path: "$pdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'pvehicle'
                }
            },
            {
                $unwind: {
                    path: "$pvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch payment transactions', res);
            }
        })
    })
    socket.on('fetch all payments', function(admin) {
        Ride.aggregate([{
                $group: {
                    _id: "$driver",
                    rides: { $sum: 1 },
                    totalAmount: { $sum: '$actprice' },
                    driver: { $last: '$driver' },
                    created: { $last: '$created' }
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'xdriver.vehicle',
                    foreignField: '_id',
                    as: 'xvehicle'
                }
            },
            {
                $unwind: {
                    path: "$xvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'xvehicle.package',
                    foreignField: '_id',
                    as: 'xrates'
                }
            },
            {
                $unwind: {
                    path: "$xrates",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'xdriver._id',
                    foreignField: 'driver',
                    as: 'xpayments'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch all payments', res);
            }
        })
    })
    socket.on('fetch ride totals', function(oid) {
        var query = { vehicle: ObjectId(oid) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: '$xpackage',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch ride totals', res);
            }
        })
    })
    socket.on('fetch driver totals', function(did) {
        var query = { _id: ObjectId(did) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: '$xpackage',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch driver totals', res);
            }
        })
    })
    socket.on('fetch my transactions', function(oid) {
        var query = { vehicle: ObjectId(oid) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xpayment'
                }
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch my transactions', res);
            }
        })
    })
    socket.on('fetch driver transactions', function(did) {
        var query = { _id: ObjectId(did) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xpayment'
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: '_id',
                    foreignField: 'vehicle',
                    as: 'xvehicle'
                }
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch driver transactions', res);
            }
        })
    })
    socket.on('fetch single payment', function(did) {
        var query = { driver: ObjectId(did) };
        Ride.aggregate([{
                $match: query
            },
            {
                $group: {
                    _id: "$driver",
                    rides: { $sum: 1 },
                    totalAmount: { $sum: '$actprice' },
                    driver: { $last: '$driver' },
                    created: { $last: '$created' }
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'xdriver.vehicle',
                    foreignField: '_id',
                    as: 'xvehicle'
                }
            },
            {
                $unwind: {
                    path: "$xvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'xvehicle.package',
                    foreignField: '_id',
                    as: 'xrates'
                }
            },
            {
                $unwind: {
                    path: "$xrates",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'xdriver._id',
                    foreignField: 'driver',
                    as: 'xpayments'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch single payment', res);
            }
        })
    })
    socket.on('assign vehicle to driver', function(edata) {
        var xuery = { vehicle: edata.vid };
        var xassign = { $set: { vehicle: ObjectId(edata.xid), package: ObjectId(edata.xid) } };
        var query = { _id: edata.did };
        var vassign = { $set: { vehicle: ObjectId(edata.vid), package: ObjectId(edata.pid) } };
        Driver.updateMany(xuery, xassign).exec(function(err, result) {
            if (err) { console.log(err); } else {
                Driver.findOneAndUpdate(query, vassign).exec(function(err, res) {
                    if (err) { console.log(err); } else {
                        socket.emit('assign vehicle to driver', res);
                        var drivername = res.firstname + ' ' + res.lastname;
                        var notify = { vid: edata.vid, header: 'Vehicle assigned to driver', message: 'Your vehicle was assigned to Tufike Pamoja Driver ' + drivername };
                        io.sockets.emit('notify owner', notify);
                        var ndata1 = {
                            userid: ObjectId(edata.vid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: notify.message,
                            title: notify.header,
                            status: 1,
                            time: Date.now()
                        };
                        var ndata2 = {
                            userid: ObjectId(edata.did),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You have been assign to a cab and package',
                            title: 'Cab and Ride Package assigned',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata1 = new Notification(ndata2);
                        Notificationdata1.save((err, result) => {
                            if (err) { console.log(err); } else {
                                io.sockets.emit('new vehicle notification', ndata1);
                                const Notificationdata2 = new Notification(ndata1);
                                Notificationdata2.save((err, result) => {
                                    if (err) { console.log(err); } else {
                                        io.sockets.emit('new package assigned', ndata2);
                                        io.sockets.emit('new driver notification', ndata2);
                                    }
                                })
                            }
                        })

                    }
                })
            }
        })

    })
    socket.on('fetch driver vehicle', function(did) {
        var query = { _id: ObjectId(did) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'xvehicle'
                }
            },
            {
                $unwind: {
                    path: "$xvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: "$xpackage",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('fetch driver vehicle', res);
            }
        })
    })
    socket.on('assign package to vehicle', function(edata) {
        var query = { _id: edata.vid };
        var dquery = { vehicle: edata.vid };
        var passign = { $set: { package: ObjectId(edata.pid) } };
        Vehicle.findOneAndUpdate(query, passign).exec(function(err, res) {
            if (err) { console.log(err); } else {
                Driver.updateOne(dquery, passign).exec(function(err, result) {
                    if (err) { console.log(err) } else {
                        socket.emit('assign package to vehicle', res);
                        var notify = { vid: edata.vid, header: 'Package assigned to vehicle', message: 'A new ride package was just assigned to your vehicle from Tufike Pamoja Cabs' };
                        io.sockets.emit('notify owner', notify);
                        var ndata = {
                            userid: ObjectId(edata.vid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: notify.message,
                            title: notify.header,
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {
                            if (err) { console.log(err); } else {
                                io.sockets.emit('new vehicle notification', ndata);
                            }
                        })
                    }
                })
            }
        })
    })
    socket.on('owner driver profile', function(oid) {
        var query = { vehicle: ObjectId(oid) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }

            },
        ]).exec(function(err, result) {
            if (err) { console.log(err) } else {
                socket.emit('owner driver profile', result)
            }
        })
    })
    socket.on('check owner uploads', function(oid) {
        var query = { _id: oid };
        Vehicle.findOne(query).exec(function(err, result) {
            if (err) { console.log(err) } else {
                socket.emit('check owner uploads', result)
            }
        })
    })
    socket.on('vehicle rides made', function(did) {
        var query = { driver: ObjectId(did) };
        Ride.aggregate([{
                $match: query
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            }
        ]).exec(function(err, result) {
            if (err) { console.log(err) } else {
                socket.emit('vehicle rides made', result)
            }
        })
    })
    socket.on('load car brands', function(search) {
        Carbrands.find().exec(function(err, res) {
            if (err) { console.log(err); } else {
                socket.emit('load car brands', res);
            }
        })
    })
    socket.on('update vehicle registration', function(vdata) {
        var query = { _id: vdata.oid };
        var vup = { $set: { make: vdata.make, model: vdata.model, color: vdata.color, plate: vdata.plate, manufacture: vdata.manufacture, purchase: vdata.purchase } };
        Vehicle.updateOne(query, vup).exec(function(err, response) {
            if (err) { console.log(err); } else {
                socket.emit('update vehicle registration', response);
            }
        })
    })
    socket.on('fetch single vehicle', function(oid) {
        var query = { _id: oid };
        Vehicle.findOne(query).exec(function(err, response) {
            if (err) { console.log(err); } else {
                socket.emit('fetch single vehicle', response);
            }
        })
    })
    socket.on('fetch single package', function(pid) {
        var query = { _id: pid };
        Rate.findOne(query).exec(function(err, response) {
            if (err) { console.log(err); } else {
                socket.emit('fetch single package', response);
            }
        })
    })
    socket.on('add new promo', function(newpromo) {
        const Newpromodata = new Promo(newpromo)
        Newpromodata.save((err, result) => {
            if (err) {
                console.log(err)
                if (err.code === 11000) {
                    for (key in err.keyValue) {
                        if (err.keyValue.hasOwnProperty(key)) {
                            var keyval = err.keyValue[key];
                        }
                    }
                    socket.emit('add new promo', {
                        status: 4,
                        message: 'Promo Code ' + keyval + ' already exists within Tufike Pamoja'
                    });
                } else {
                    socket.emit('add new promo', {
                        status: 5,
                        message: 'An unkown error occurred. Please try again later'
                    });
                }
            } else {
                socket.emit('add new promo', result);
            }
        })
    })
    socket.on('activate new promo', function(promoid) {
        var query = { _id: promoid };
        var newdata = { $set: { status: 1 } };
        Promo.findOneAndUpdate(query, newdata).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('activate new promo', res);
                var activenot = { $set: { 'activepush.promotions': 1 } };
                Rider.updateMany(activenot).exec(function(err, result) {
                    if (err) { console.log(err) } else {
                        var xmessage = {
                            icon: 'info',
                            title: 'Tufike Pamoja Live Updates',
                            message: 'New promotion is now available. Check available promotions now to get ride discounts.',
                            funcode: 'promotion'
                        };
                        io.sockets.emit('notify app users', xmessage);
                        var oneHeader = 'Get ' + res.discount + '% off Tufike Pamoja Rides';
                        var oneMessage = res.content;
                        multiBurstRider(oneMessage, oneHeader);
                    }
                })
            }
        })
    })

    socket.on('deactivate new promo', function(promoid) {
        var query = { _id: promoid };
        var newdata = { $set: { status: 2 } };
        Promo.findOneAndUpdate(query, newdata).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('deactivate new promo', res);
                var xmessage = {
                    icon: 'info',
                    title: 'Tufike Pamoja Live Updates',
                    message: 'A promotion has been stopped. Please keep using Tufike Pamoja App to get amazing ride discounts.',
                    funcode: 'promotion'
                };
                io.sockets.emit('notify app users', xmessage);
            }
        })
    })
    socket.on('delete new promo', function(promoid) {
        var query = { _id: promoid };
        var newdata = { $set: { status: 2 } };
        Promo.deleteOne(query).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('delete new promo', res);
                var xmessage = {
                    icon: 'delete_sweep',
                    title: 'Tufike Pamoja Live Updates',
                    message: 'A promotion has expired. Please keep using Tufike Pamoja App to get amazing ride discounts.',
                    funcode: 'promotion'
                };
                io.sockets.emit('notify app users', xmessage);
            }
        })
    })
    socket.on('delete old transaction', function(tid) {
        var query = { _id: tid };
        Payment.deleteOne(query).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('delete old transaction', res);
            }
        })
    })

    socket.on('notify single rider', function(notify) {
        Rider.findOne({
            _id: notify.rid
        }).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                var ndata = {
                    userid: ObjectId(notify.rid),
                    sender: 'Tufike Pamoja Notification',
                    icon: 'notifications_active',
                    message: notify.message,
                    title: notify.header,
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                io.sockets.emit('new rider notification', ndata);
                var oneUser = result.signalid;
                var oneMessage = notify.message;
                var oneHeader = notify.header;
                oneBurstRider(oneMessage, oneHeader, oneUser)
                async function oneBurstRider(oneMessage, oneHeader, oneUser) {
                    const notification = {
                        app_id: "78aa0c2b-c194-4e2d-b7ae-45ab7af286fc",
                        android_background_layout: {
                            'headings_color': 'FFFF0000',
                            'contents_color': 'FF00FF00'
                        },
                        android_accent_color: 'ae00b8',
                        android_led_color: 'FF00FF00',
                        priority: 10,
                        //large_icon: 'https://www.dropbox.com/s/im9zcwb5bwqqjvn/rider.png?raw=1',
                        headings: {
                            'en': oneHeader
                        }, //'Tufike Pamoja Cabs 👌',
                        contents: {
                            'en': oneMessage,
                        },
                        include_player_ids: [oneUser], //included_segments: ['Subscribed Users'],
                    };
                    try {
                        const response = await riderBurst.createNotification(notification);
                        io.sockets.emit('notify single rider', notify);
                    } catch (e) {
                        if (e instanceof OneSignal.HTTPError) {
                            console.log(e.statusCode);
                            console.log(e.body);
                        }
                    }
                }

            }
        })
    });

    socket.on('notify all riders', function(notify) {
        var ndata = {
            userid: ObjectId(notify.rid),
            sender: 'Tufike Pamoja Notification',
            icon: 'notifications_active',
            message: notify.message,
            title: notify.header,
            status: 1,
            time: Date.now()
        };
        const Notificationdata = new Notification(ndata);
        Notificationdata.save((err, result) => {})
        io.sockets.emit('new rider notification', ndata);
        var oneMessage = notify.message;
        var oneHeader = notify.header;
        multiBurstRider(oneMessage, oneHeader)
        async function multiBurstRider(oneMessage, oneHeader) {
            const notification = {
                app_id: "78aa0c2b-c194-4e2d-b7ae-45ab7af286fc",
                android_background_layout: {
                    'headings_color': 'FFFF0000',
                    'contents_color': 'FF00FF00'
                },
                android_accent_color: 'ae00b8',
                android_led_color: 'FF00FF00',
                priority: 10,
                //large_icon: 'https://www.dropbox.com/s/im9zcwb5bwqqjvn/rider.png?raw=1',
                headings: {
                    'en': oneHeader
                }, //'Tufike Pamoja Cabs 👌',
                contents: {
                    'en': oneMessage,
                },
                included_segments: ['Subscribed Users'], //include_player_ids: [oneUser],
            };
            try {
                const response = await riderBurst.createNotification(notification);
                var notifix = response.body;
                io.sockets.emit('notify all riders', notifix);
            } catch (e) {
                if (e instanceof OneSignal.HTTPError) {
                    console.log(e.statusCode);
                    console.log(e.body);
                }
            }
        }
    });


    socket.on('notify single owner', function(notify) {
        Vehicle.findOne({
            _id: notify.oid
        }).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                var ndata = {
                    userid: ObjectId(notify.oid),
                    sender: 'Tufike Pamoja Notification',
                    icon: 'notifications_active',
                    message: notify.message,
                    title: notify.header,
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                io.sockets.emit('new vehicle notification', ndata);
                var oneUser = result.signalid;
                var oneMessage = notify.message;
                var oneHeader = notify.header;
                oneBurstOwner(oneMessage, oneHeader, oneUser)
                async function oneBurstOwner(oneMessage, oneHeader, oneUser) {
                    const notification = {
                        app_id: "172feb21-563e-4fb8-b66e-4426e1a922ee",
                        android_background_layout: {
                            'headings_color': 'FFFF0000',
                            'contents_color': 'FF00FF00'
                        },
                        android_accent_color: 'ae00b8',
                        android_led_color: 'FF00FF00',
                        priority: 10,
                        //large_icon: 'https://www.dropbox.com/s/im9zcwb5bwqqjvn/rider.png?raw=1',
                        headings: {
                            'en': oneHeader
                        }, //'Tufike Pamoja Cabs 👌',
                        contents: {
                            'en': oneMessage,
                        },
                        include_player_ids: [oneUser], //included_segments: ['Subscribed Users'],
                    };
                    try {
                        const response = await ownerBurst.createNotification(notification);
                        io.sockets.emit('notify single owner', notify);
                        console.log(response.body);
                    } catch (e) {
                        if (e instanceof OneSignal.HTTPError) {
                            console.log(e.statusCode);
                            console.log(e.body);
                        }
                    }
                }

            }
        })
    });

    socket.on('notify all owners', function(notify) {
        var ndata = {
            userid: ObjectId(notify.oid),
            sender: 'Tufike Pamoja Notification',
            icon: 'notifications_active',
            message: notify.message,
            title: notify.header,
            status: 1,
            time: Date.now()
        };
        const Notificationdata = new Notification(ndata);
        Notificationdata.save((err, result) => {})
        io.sockets.emit('new vehicle notification', ndata);
        var oneMessage = notify.message;
        var oneHeader = notify.header;
        multiBurstOwner(oneMessage, oneHeader)
        async function multiBurstOwner(oneMessage, oneHeader) {
            const notification = {
                app_id: "172feb21-563e-4fb8-b66e-4426e1a922ee",
                android_background_layout: {
                    'headings_color': 'FFFF0000',
                    'contents_color': 'FF00FF00'
                },
                android_accent_color: 'ae00b8',
                android_led_color: 'FF00FF00',
                priority: 10,
                //large_icon: 'https://www.dropbox.com/s/im9zcwb5bwqqjvn/rider.png?raw=1',
                headings: {
                    'en': oneHeader
                }, //'Tufike Pamoja Cabs 👌',
                contents: {
                    'en': oneMessage,
                },
                included_segments: ['Subscribed Users'], //include_player_ids: [oneUser],
            };
            try {
                const response = await ownerBurst.createNotification(notification);
                var notifix = response.body;
                io.sockets.emit('notify all owners', notifix);
                console.log(response.body)
            } catch (e) {
                if (e instanceof OneSignal.HTTPError) {
                    console.log(e.statusCode);
                    console.log(e.body);
                }
            }
        }
    });

    socket.on('fetch rider notifications', function(admin) {
        Notification.aggregate([{
                    $sort: { _id: -1 }
                },
                {
                    $lookup: {
                        from: 'riders',
                        localField: 'userid',
                        foreignField: '_id',
                        as: 'xrider'
                    }
                }
            ]).limit(100).exec(function(err, res) {
                if (err) { console.log(err); } else {
                    socket.emit('fetch rider notifications', res)
                }
            })
            /*
            allRiderBursts();
            async function allRiderBursts() {
                const signal = await riderBurst.viewNotifications();
                var allbursts = signal.body.notifications;
                socket.emit('fetch rider notifications', allbursts)
            }
            */
    })
    socket.on('fetch driver notifications', function(admin) {
        Notification.aggregate([{
                    $sort: { _id: -1 }
                },
                {
                    $lookup: {
                        from: 'drivers',
                        localField: 'userid',
                        foreignField: '_id',
                        as: 'xdriver'
                    }
                }
            ]).limit(100).exec(function(err, res) {
                if (err) { console.log(err); } else {
                    socket.emit('fetch driver notifications', res)
                }
            })
            /*
            allDriverBursts();
            async function allDriverBursts() {
                const signal = await driverBurst.viewNotifications();
                var allbursts = signal.body.notifications;
                socket.emit('fetch driver notifications', allbursts)
            }
            */
    })
    socket.on('fetch owner notifications', function(admin) {
        Notification.aggregate([{
                    $sort: { _id: -1 }
                },
                {
                    $lookup: {
                        from: 'vehicles',
                        localField: 'userid',
                        foreignField: '_id',
                        as: 'xowner'
                    }
                }
            ]).limit(100).exec(function(err, res) {
                if (err) { console.log(err); } else {
                    socket.emit('fetch owner notifications', res)
                }
            })
            /*
            allRiderBursts();
            async function allRiderBursts() {
                const signal = await riderBurst.viewNotifications();
                var allbursts = signal.body.notifications;
                socket.emit('fetch rider notifications', allbursts)
            }
            */
    })
    socket.on('update cms about', function(cms) {
        var query = {
            _id: cms.id
        };
        Cms.updateOne(query, {
            $set: {
                about: cms.content,
                time: cms.time
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                var activenot = { $set: { 'activepush.about': 1 } };
                Rider.updateMany(activenot).exec(function(err, result) {
                    if (err) { console.log(err) } else {
                        socket.emit('update cms about', res)
                        var xmessage = {
                            icon: 'info',
                            title: 'Tufike Pamoja Live Updates',
                            message: 'About Tufike Pamoja content has been updated.',
                            funcode: 'about'
                        };
                        io.sockets.emit('notify app users', xmessage);
                    }
                })

            }
        })
    })
    socket.on('update cms terms', function(cms) {
        var query = {
            _id: cms.id
        };
        Cms.updateOne(query, {
            $set: {
                terms: cms.content,
                time: cms.time
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                var activenot = { $set: { 'activepush.terms': 1 } };
                Rider.updateMany(activenot).exec(function(err, result) {
                    if (err) { console.log(err) } else {
                        socket.emit('update cms terms', res)
                        var xmessage = {
                            icon: 'info',
                            title: 'Tufike Pamoja Live Updates',
                            message: 'Tufike Pamoja terms of use has been updated.',
                            funcode: 'terms'
                        };
                        io.sockets.emit('notify app users', xmessage);
                    }
                })
            }
        })
    })
    socket.on('update cms privacy', function(cms) {
        var query = {
            _id: cms.id
        };
        Cms.updateOne(query, {
            $set: {
                privacy: cms.content,
                time: cms.time
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                var activenot = { $set: { 'activepush.privacy': 1 } };
                Rider.updateMany(activenot).exec(function(err, result) {
                    if (err) { console.log(err) } else {
                        socket.emit('update cms privacy', res)
                        var xmessage = {
                            icon: 'info',
                            title: 'Tufike Pamoja Live Updates',
                            message: 'Tufike Pamoja privacy policy has been updated.',
                            funcode: 'privacy'
                        };
                        io.sockets.emit('notify app users', xmessage);
                    }
                })
            }
        })
    })
    socket.on('fetch all packages', function(admin) {
        Rate.find().sort({
            _id: -1
        }).exec(function(err, result) {
            socket.emit('fetch all packages', result);
        })
    })
    socket.on('fetch all promos', function(admin) {
        var query = { status: { $ne: 3 } };
        Promo.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'discountpromos',
                    as: 'xrides'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch all promos', result);
        })
    })
    socket.on('fetch all rides', function(admin) {
        Ride.aggregate([{
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            }, {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch all rides', result);
        })
    })
    socket.on('fetch pending rides', function(admin) {
        var query = { driveraccept: 0, status: 1 };
        Ride.aggregate([{
                $match: query
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            }, {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch pending rides', result);
        })
    })
    socket.on('fetch completed rides', function(admin) {
        var query1 = { driveraccept: 1, driverinit: { $ne: 0 }, driverstop: { $ne: 0 }, status: 1 };
        var query2 = { driveraccept: 1, driverarrive: { $ne: 0 }, driverstop: { $ne: 0 }, status: 1 };
        var query3 = { driveraccept: 1, driverstart: { $ne: 0 }, driverstop: { $ne: 0 }, status: 1 };
        Ride.aggregate([{
                $match: {
                    $or: [query1, query2, query3]
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            }, {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch completed rides', result);
        })
    })
    socket.on('fetch active rides', function(admin) {
        var query1 = { driveraccept: 1, driverinit: { $ne: 0 }, driverstop: 0, status: 1 };
        var query2 = { driveraccept: 1, driverarrive: { $ne: 0 }, driverstop: 0, status: 1 };
        var query3 = { driveraccept: 1, driverstart: { $ne: 0 }, driverstop: 0, status: 1 };
        Ride.aggregate([{
                $match: {
                    $or: [query1, query2, query3]
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            }, {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch active rides', result);
        })
    })
    socket.on('fetch cancelled rides', function(admin) {
        var query1 = { driveraccept: 2, status: 1 };
        var query2 = { driveraccept: 3, status: 1 };
        Ride.aggregate([{
                $match: {
                    $or: [query1, query2]
                }
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            }, {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch cancelled rides', result);
        })
    })
    socket.on('fetch driver initiated rides', function(admin) {
        var query = { driveraccept: 1, status: 2 };
        Ride.aggregate([{
                $match: query
            },
            {
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            }, {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch driver initiated rides', result);
        })
    })
    socket.on('count records', function(admin) {
        Rider.countDocuments({}, function(err, riders) {
            if (err) {
                riders = 0;
            } else {
                Driver.countDocuments({}, function(err, drivers) {
                    if (err) {
                        drivers = 0;
                    } else {
                        Ride.countDocuments({}, function(err, rides) {
                            if (err) {
                                rides = 0;
                            } else {
                                Vehicle.countDocuments({}, function(err, owners) {
                                    if (err) {
                                        owners = 0;
                                    } else {
                                        var result = {
                                            riders: riders,
                                            drivers: drivers,
                                            rides: rides,
                                            owners: owners
                                        };
                                        socket.emit('count records', result)
                                    }
                                })
                            }
                        })
                    }
                })
              }
          })
    })
    socket.on('count other records', function(admin) {
        Rider.countDocuments({
            status: 2
        }, function(err, riders) {
            if (err) {
                riders = 0;
            } else {
                Driver.countDocuments({
                    status: 2
                }, function(err, drivers) {
                    if (err) {
                        drivers = 0;
                    } else {
                        Ride.countDocuments({
                            driveraccept: { $gte: 2 }
                        }, function(err, rides) {
                            if (err) {
                                rides = 0;
                            } else {
                                Vehicle.countDocuments({
                                    status: 2
                                }, function(err, owners) {
                                    if (err) {
                                        owners = 0;
                                    } else {
                                        var result = {
                                            riders: riders,
                                            drivers: drivers,
                                            rides: rides,
                                            owners: owners
                                        };
                                        socket.emit('count other records', result)
                                    }
                                })
                            }
                        })
                    }
                })
            }

        })
    })
    socket.on('fetch all vehicles', function(admin) {
        Vehicle.aggregate([{
                $sort: { _id: -1 }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: '_id',
                    foreignField: 'vehicle',
                    as: 'xdriver'
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch all vehicles', result);
        })
    })
    socket.on('super functions vehicle', function(vid) {
        var query = { _id: ObjectId(vid) };
        Vehicle.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: 'rates',
                    localField: 'package',
                    foreignField: '_id',
                    as: 'rates'
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: '_id',
                    foreignField: 'vehicle',
                    as: 'drivers'
                }
            },
            {
                $lookup: {
                    from: "rides",
                    localField: "drivers._id",
                    foreignField: "driver",
                    as: "rides",
                }
            },
        ]).exec(function(err, result) {
            socket.emit('super functions vehicle', result);
        })
    })
    socket.on('fetch all riders', function(admin) {
        Rider.aggregate([{
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'rider',
                    as: 'rides'
                }
            },
            {
                $lookup: {
                    from: 'favorites',
                    localField: '_id',
                    foreignField: 'riderid',
                    as: 'favorites'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, result) {
            socket.emit('fetch all riders', result);
        })
    })
    socket.on('fetch single rider', function(riderid) {
        Rider.findOne({
            _id: riderid
        }).exec(function(err, result) {
            socket.emit('fetch single rider', result);
        })
    })
    socket.on('fetch all drivers', function(admin) {
        Driver.aggregate([{
            $lookup: {
                from: 'rides',
                localField: '_id',
                foreignField: 'driver',
                as: 'xrides'
            }
        }, {
            $lookup: {
                from: 'vehicles',
                localField: 'vehicle',
                foreignField: '_id',
                as: 'xvehicle'
            }
        }, {
            $sort: {
                _id: -1
            }
        }]).exec(function(err, result) {
            socket.emit('fetch all drivers', result);
        })
    })
    socket.on('fetch no vehicle drivers', function(novehicle) {
        var query = { vehicle: novehicle, license: { $ne: 'none' }, ntsa: { $ne: 'none' }, };
        Driver.find(query).sort({
            _id: -1
        }).exec(function(err, result) {
            socket.emit('fetch no vehicle drivers', result);
        })
    })

    socket.on('fetch single driver', function(driverid) {
        var query = { _id: ObjectId(driverid) };
        Driver.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides',
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'xvehicle',
                }
            },
            {
                $unwind: {
                    path: "$xvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'xvehicle.package',
                    foreignField: '_id',
                    as: 'xpackage',
                }
            }
        ]).exec(function(err, result) {
            if (err) { console.log(err); } else {
                socket.emit('fetch single driver', result);
            }
        })
    })
    socket.on('fetch scheduled rides', function(did) {
        var query1 = { driver: ObjectId(did), driveraccept: 0, paystat: 0, clientrating: 0 };
        var query2 = { driver: ObjectId(did), driveraccept: 1, paystat: 0, clientrating: 0 };
        var query3 = { driver: ObjectId(did), driveraccept: 1, paystat: 1, clientrating: 0 };
        var query4 = { driver: ObjectId(did), driveraccept: 1, paystat: 2, clientrating: 0 };
        Ride.aggregate([{
            $match: {
                $or: [query1, query2, query3, query4]
            }
        }]).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch scheduled rides', res)
            }
        })
    })
    socket.on('fetch requested ride', function(did) {
        var query1 = { driver: ObjectId(did), driveraccept: 0, paystat: 0, clientrating: 0 };
        var query2 = { driver: ObjectId(did), driveraccept: 1, paystat: 0, clientrating: 0 };
        var query3 = { driver: ObjectId(did), driveraccept: 1, paystat: 1, clientrating: 0 };
        var query4 = { driver: ObjectId(did), driveraccept: 1, paystat: 2, clientrating: 0 };
        Ride.aggregate([{
                $match: {
                    $or: [query1, query2, query3, query4]
                }
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: "$xpackage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'promos',
                    localField: 'discountpromos',
                    foreignField: '_id',
                    as: 'xpromo'
                }
            },
            {
                $unwind: {
                    path: "$xpromo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'distresses',
                    localField: '_id',
                    foreignField: 'rideid',
                    as: 'xdistress'
                }
            },
            {
                $unwind: {
                    path: "$xdistress",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $limit: 1
            }
        ]).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch requested ride', res);
            }
        })
    })



    socket.on('accept client ride', function(rid) {
        var query = {
            _id: rid
        };
        var newval = {
            $set: {
                driveraccept: 1
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('accept client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Your ride from ' + result.origin + ' to ' + result.destination + ' was accepted',
                            title: 'Driver Accepted your ride',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })

                    }
                })
            }
        })
    })
    socket.on('reject client ride', function(rid) {
        var query = {
            _id: rid
        };
        var newval = {
            $set: {
                driveraccept: 2
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('reject client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Your ride from ' + result.origin + ' to ' + result.destination + ' was rejected',
                            title: 'Driver Rejected your ride',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'success',
                            content: 'Client\'s Ride has been rejected by the driver',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
                        io.sockets.emit('ride cancelled', result);
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })
    socket.on('initiate client ride', function(rid) {
        var query = {
            _id: rid
        };
        var ndate = Date.now();
        var newval = {
            $set: {
                driverinit: ndate
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('initiate client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Your ride from ' + result.origin + ' to ' + result.destination + ' was initiated',
                            title: 'Driver Initiated your ride',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'primary',
                            content: 'Client\'s Ride from ' + result.origin + ' to ' + result.destination + ' has been initiated',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })

    socket.on('arrived client ride', function(rid) {
        var query = {
            _id: rid
        };
        var ndate = Date.now();
        var newval = {
            $set: {
                driverarrive: ndate
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('arrived client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Your Driver is waiting for you. Please get to your Driver ASAP',
                            title: 'Driver is Here!',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'primary',
                            content: 'Driver has arrived at the client\'s pick-up location ' + result.origin,
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })

    socket.on('start client ride', function(rid) {
        var query = {
            _id: rid
        };
        var ndate = Date.now();
        var newval = {
            $set: {
                driverstart: ndate
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('start client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Your Ride has started. Have a safe Journey and be safe.',
                            title: 'Safe Journey Ahead',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'success',
                            content: 'Client\'s Ride from ' + result.origin + ' to ' + result.destination + ' has been started',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })

    socket.on('stop client ride', function(rid) {
        var query = {
            _id: rid
        };
        var ndate = Date.now();
        var newval = {
            $set: {
                driverstop: ndate
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('stop client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Your Ride has stopped. Its time to pay and have a good day ahead.',
                            title: 'Ride Stopped',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'success',
                            content: 'Client\'s Ride from ' + result.origin + ' to ' + result.destination + ' has been stopped',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })


    socket.on('paid client ride', function(payee) {
        var query = {
            _id: payee.rid
        };
        var ndate = Date.now();
        var newval = {
            $set: {
                paystat: payee.status,
                actprice: payee.amount,
                rewardedpoints: payee.pointy
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('paid client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Payment Received. Please take a minute to rate your driver.',
                            title: 'Payment Settled',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'check',
                            color: 'success',
                            content: 'Payment for Client\'s Ride from ' + result.origin + ' to ' + result.destination + ' has been settled',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })

    socket.on('unpaid client ride', function(payee) {
        var query = {
            _id: payee.rid
        };
        var ndate = Date.now();
        var newval = {
            $set: {
                paystat: payee.status,
                actprice: payee.amount,
                rewardedpoints: payee.pointy
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('unpaid client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Payment Not Received. Please take a minute to rate your driver.',
                            title: 'Payment was not received',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'close',
                            color: 'danger',
                            content: 'Payment for Client\'s Ride from ' + result.origin + ' to ' + result.destination + ' has not been settled',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })


    socket.on('rate client ride', function(rating) {
        var query = {
            _id: rating.rid
        };
        var newval = {
            $set: {
                clientrating: rating.rate,
                clientcomment: rating.comment
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('rate client ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.driver,
                            icon: 'notifications_active',
                            message: 'Client and ride rating reviews completed successfully.',
                            title: 'Ride Completed',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'success',
                            content: 'Ride from ' + result.origin + ' to ' + result.destination + ' received a review',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Rider.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstRider(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })

    socket.on('rate driver ride', function(rating) {
        var query = {
            _id: rating.rid
        };
        var newval = {
            $set: {
                driverrating: rating.rate,
                drivercomment: rating.comment
            }
        };
        Ride.updateOne(query, newval, function(err, res) {
            if (err) {
                console.log(err);
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.sockets.emit('rate driver ride', result);
                        io.sockets.emit('relaunch admin rides', result);
                        var ndata = {
                            userid: result.driver,
                            sender: result.rider,
                            icon: 'notifications_active',
                            message: 'Driver and ride rating reviews completed successfully.',
                            title: 'Driver Rating',
                            status: 1,
                            time: Date.now()
                        };
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'success',
                            content: 'Driver\'s Ride from ' + result.origin + ' to ' + result.destination + ' has received a review',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        Driver.findOne({
                            _id: ndata.userid
                        }).exec(function(err, res) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (res) {
                                    var oneMessage = ndata.message;
                                    var oneHeader = ndata.title;
                                    var oneUser = res.signalid;
                                    oneBurstDriver(oneMessage, oneHeader, oneUser);
                                }
                            }
                        })
                    }
                })
            }
        })
    })



    socket.on('extra functions vehicle', function(oid) {
        var query = {
            _id: oid
        };
        Vehicle.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('extra functions vehicle', result);
        });
    })

    socket.on('extra functions rider', function(uid) {
        var query = {
            _id: uid
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('extra functions rider', result);
        });
    })
    socket.on('extra functions driver', function(did) {
        var query = {
            _id: did
        };
        Driver.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('extra functions driver', result);
        });
    })
    socket.on('opc check email', function(email) {
        var query = {
            email: email
        };
        Vehicle.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('opc check email', result);
        });
    })
    socket.on('opc send code', function(ecode) {
        var query = {
            email: ecode.email
        };
        var newcode = {
            $set: {
                activationcode: ecode.code
            }
        };
        Vehicle.updateOne(query, newcode, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                var mailOptions = {
                    from: 'tufike@lexacle.com',
                    to: ecode.email,
                    subject: 'Tufike Pamoja Password Reset Code',
                    html: 'Password reset Code ' + ecode.code
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        var result = {
                            status: 0
                        };
                        socket.emit('opc send code', result);
                    } else {
                        var result = {
                            status: 1
                        };
                        socket.emit('opc send code', result);
                    }
                });
            }
        })
    })
    socket.on('opc confirm code', function(reset) {
        var query = {
            email: reset.email,
            activationcode: reset.code
        };
        Vehicle.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('opc confirm code', result);
        });
    })
    socket.on('opc reset password', function(npass) {
        var query = {
            email: npass.email
        };
        var newpass = {
            $set: {
                password: npass.password
            }
        };
        Vehicle.updateOne(query, newpass).exec(function(err, result) {
            if (err) throw err;
            socket.emit('opc reset password', result);
        });
    })
    socket.on('rpc check email', function(email) {
        var query = {
            email: email
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('rpc check email', result);
        });
    })
    socket.on('rpc send code', function(ecode) {
        var query = {
            email: ecode.email
        };
        var newcode = {
            $set: {
                activationcode: ecode.code
            }
        };
        Rider.updateOne(query, newcode, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                var mailOptions = {
                    from: 'tufike@lexacle.com',
                    to: ecode.email,
                    subject: 'Tufike Pamoja Account Activation Code',
                    html: 'Activation Code ' + ecode.code
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        var result = {
                            status: 0
                        };
                        socket.emit('rpc send code', result);
                    } else {
                        var result = {
                            status: 1
                        };
                        socket.emit('rpc send code', result);
                    }
                });
            }
        })
    })
    socket.on('rpc confirm code', function(reset) {
        var query = {
            email: reset.email,
            activationcode: reset.code
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('rpc confirm code', result);
        });
    })
    socket.on('rpc reset password', function(npass) {
        var query = {
            email: npass.email
        };
        var newpass = {
            $set: {
                password: npass.password
            }
        };
        Rider.updateOne(query, newpass).exec(function(err, result) {
            if (err) throw err;
            socket.emit('rpc reset password', result);
        });
    })

    socket.on('fetch rider details', function(uid) {
        var query = {
            _id: uid
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch rider details', result);
        });
    })
    socket.on('send support', function(message) {
        const Supportdata = new Supportchat(message)
        Supportdata.save((err, result) => {
            if (err) {
                console.log(err)
            } else {
                socket.broadcast.emit('send support', result);
                var nmessage = {
                    icon: 'forum',
                    color: 'success',
                    content: message.sendername + '<br>' + message.message,
                    sound: 'support'
                };
                io.sockets.emit('notify admin', JSON.stringify(nmessage));
            }
        })
    })
    socket.on('receive support', function(message) {
        const Supportdata = new Supportchat(message)
        Supportdata.save((err, result) => {
            if (err) {
                console.log(err)
            } else {
                socket.broadcast.emit('receive support', result);
                io.sockets.emit('support sent', message);
            }
        })
    })
    socket.on('fetch support', function(uid) {
        var query = {
            userid: uid
        };
        Supportchat.aggregate([{
            $match: query
        }, {
            $sort: {
                _id: -1
            }
        }, {
            $limit: 10
        }, {
            $sort: {
                _id: 1
            }
        }]).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch support', result);
        });
    })
    socket.on('fetch support messages', function(uid) {
        var query = {
            userid: uid
        };
        Supportchat.aggregate([{
            $match: query
        }, {
            $sort: {
                _id: -1
            }
        }, {
            $limit: 10
        }, {
            $sort: {
                _id: 1
            }
        }]).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch support messages', result);
        });
    })
    socket.on('fetch promos', function(uid) {
        Promo.find().sort({
            startdate: -1
        }).limit(10).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch promos', result);
        });
    })
    socket.on('fetch active promos', function(uid) {
        var query = { startdate: { $lte: Date.now() }, stopdate: { $gte: Date.now() }, status: 1 };
        Promo.find(query).sort({
            startdate: -1
        }).limit(10).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch active promos', result);
        });
    })
    socket.on('apply promo code', function(procontent) {
        var rid = procontent.rid;
        var code = procontent.code;
        var did = procontent.did;
        var supersuccess = { status: 'success', ride: rid, driver: did };
        var superfailed = { status: 'failed', ride: rid, driver: did };
        var query = { promocode: code, startdate: { $lte: Date.now() }, stopdate: { $gte: Date.now() }, status: 1 };
        Promo.findOne(query).exec(function(err, result) {
            if (err) { console.log(err); } else {
                if (result) {
                    var pid = result._id;
                    var pdiscount = result.discount;
                    var queryx = { _id: rid };
                    var newdata = { $set: { discountpromos: pid } };
                    Ride.findOneAndUpdate(queryx, newdata).exec(function(err, res) {
                        if (err) { console.log(err); } else {
                            io.sockets.emit('apply promo code', supersuccess);
                            var ndata = {
                                userid: res.rider,
                                sender: res.rider,
                                icon: 'ride',
                                message: 'Promo code ' + code + ' applied on your ride for a ' + pdiscount + '% discount',
                                title: 'Promo Code Applied',
                                status: 1,
                                time: Date.now()
                            };
                            const Notificationdata = new Notification(ndata);
                            Notificationdata.save((err, result) => {
                                if (err) { console.log(err) } else {
                                    io.sockets.emit('new rider notification', ndata);
                                    var message = {
                                        icon: 'notifications_active',
                                        color: 'success',
                                        content: 'Rider applied promo code ' + code + ' for a ' + pdiscount + '% discount',
                                        sound: 'booking'
                                    };
                                    io.sockets.emit('notify admin', JSON.stringify(message));
                                    player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
                                }
                            })
                        }
                    })
                } else {
                    io.sockets.emit('apply promo code', superfailed);
                }
            }
        });
    })
    socket.on('fetch promos new', function(uid) {
        var query = {
            stopdate: {
                $gte: Date.now()
            }
        };
        Promo.find(query).sort({
            stopdate: -1
        }).limit(10).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch promos new', result);
        });
    })
    socket.on('find promo code', function(promo) {
        var query = {
            promocode: promo.code
        };
        Promo.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    var discount = result.discount;
                    Ride.findOneAndUpdate({
                        _id: promo.rideid
                    }, {
                        $set: {
                            discountpromos: discount
                        }
                    }, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            socket.emit('find promo code', result);
                        }
                    });
                } else {
                    socket.emit('find promo code', result);
                }

            }

        });
    })
    socket.on('fetch ride packages', function(freelance) {
        Rate.find().exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch ride packages', res)
            }
        })
    })
    socket.on('rate my driver', function(urate) {
        Ride.findOne({
            _id: urate.rideid
        }).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                var packageid = result.packageid;
                var distance = (result.distance / 1000).toFixed(0);
                Rate.findOne({
                    _id: packageid
                }).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        var points = (result.rewards) * distance;
                        Ride.findOneAndUpdate({
                            _id: urate.rideid
                        }, {
                            $set: {
                                driverrating: urate.rate,
                                drivercomment: urate.comment,
                                rewardedpoints: points,
                                status: 2
                            }
                        }, (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                socket.emit('rate my driver', result);
                            }
                        });
                    }
                })
            }
        })
    })
    socket.on('count notifications', function(uid) {
        var query = {
            userid: uid,
            status: 1
        };
        Notification.find(query).sort({
            _id: -1
        }).exec(function(err, result) {
            if (err) throw err;
            socket.emit('count notifications', result);
        });
    })
    socket.on('fetch notifications', function(uid) {
        var query1 = { userid: ObjectId(uid), status: { $ne: 3 } };
        var query2 = { userid: ObjectId(freelance) };
        Notification.aggregate(
            [{
                    $match: query1
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]).limit(40).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch notifications', result);
        });
    })
    socket.on('clear notifications', function(uid) {
        var query = {
            userid: uid,
            status: 1
        };
        var status = {
            $set: {
                status: 2
            }
        };
        Notification.updateMany(query, status).exec(function(err, result) {
            socket.emit('clear notifications', result);
        });
    })
    socket.on('delete notifications', function(nid) {
        var query = { _id: nid };
        var delex = { $set: { status: 3 } };
        Notification.findOneAndUpdate(query, delex).exec(function(err, res) {
            if (err) { console.log(err); } else {
                io.sockets.emit('delete notifications', res);
            }
        })
    })
    socket.on('super delete notifications', function(nid) {
        var query = { _id: nid };
        Notification.deleteOne(query).exec(function(err, res) {
            if (err) { console.log(err); } else {
                io.sockets.emit('super delete notifications', res);
            }
        })
    })
    socket.on('delete all notifications', function(uid) {
        Notification.deleteMany({
            userid: uid
        }, function(err, result) {
            if (err) console.log(err);
            socket.emit('delete all notifications', result);
        });
    })
    socket.on('fetch cms', function(status) {
        var query = {
            status: status
        };
        Cms.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch cms', result);
            }
        })
    })
    socket.on('fetch rewards', function(uid) {
        var query = {
            rider: uid
        };
        Ride.find(query).sort({
            _id: -1
        }).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch rewards', result);
            }
        })
    })
    socket.on('fetch rewards rates', function() {
        Rate.find().exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch rewards rates', result);
            }
        })
    })
    socket.on('fetch total points', function(uid) {
        var query = {
            rider: uid
        };
        Ride.find(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch total points', result)
            }
        })
    })
    socket.on('redeem points', function(xredeem) {
        var query = { _id: xredeem.rid };
        Ride.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                var npoints = parseInt(result.redeemedpoints) + parseInt(xredeem.points);
                var points = {
                    $set: {
                        redeemedpoints: npoints
                    }
                };
                Ride.updateOne(query, points, function(err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        io.sockets.emit('redeem points', result);
                        var ndata = {
                            userid: result.rider,
                            sender: result.rider,
                            icon: 'ride',
                            message: 'You redeemed ' + xredeem.points + ' Points for your ride from ' + result.origin + ' to ' + result.destination,
                            title: 'Ride Points Redeemed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {
                            if (err) { console.log(err) } else {
                                io.sockets.emit('new rider notification', ndata);
                                var message = {
                                    icon: 'airline_seat_recline_normal',
                                    color: 'success',
                                    content: result.rider + ' redeemed ' + xredeem.points + ' for their ride from ' + result.origin + ' to ' + result.destination,
                                    sound: 'booking'
                                };
                                io.sockets.emit('notify admin', JSON.stringify(message));
                                player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
                            }
                        })

                    }
                })
            }
        })
    })
    socket.on('fetch ride receipt', function(rid) {
        var query = {
            _id: ObjectId(rid)
        };
        Ride.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xrates'
                }
            },
            {
                $unwind: {
                    path: "$xrates",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'promos',
                    localField: 'discountpromos',
                    foreignField: '_id',
                    as: 'xpromo'
                }
            },
            {
                $unwind: {
                    path: "$xpromo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'settings',
                    let: { account: 'main' },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$setid", '$$account'] }
                                ]
                            }
                        }
                    }],
                    as: "xset"
                }
            },
            {
                $unwind: {
                    path: "$xset",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).exec(function(err, result) {
            if (err) { console.log(err); } else {
                socket.emit('fetch ride receipt', result);
            }

        })
    })

    socket.on('fetch my rides', function(uid) {
        var query = {
            rider: ObjectId(uid)
        };
        Ride.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'xdriver.vehicle',
                    foreignField: '_id',
                    as: 'xvehicle'
                }
            },
            {
                $unwind: {
                    path: "$xvehicle",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: "$xpackage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch my rides', result);
            }
        })
    })

    socket.on('fetch my clients', function(did) {
        var query = {
            driver: ObjectId(did)
        };
        Ride.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider',
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver',
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage',
                }
            },
            {
                $unwind: {
                    path: "$xpackage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch my clients', result);
        });
    })

    socket.on('cancel ride', function(rideid) {
        var query = {
            _id: rideid
        };
        var status = 3;
        var status = {
            $set: {
                driveraccept: status
            }
        };
        Ride.updateOne(query, status, function(err, res) {
            if (err) {
                console.log(err)
            } else {
                Ride.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        var ndata = {
                            userid: result.rider,
                            sender: result.rider,
                            icon: 'ride',
                            message: 'From ' + result.origin + ' to ' + result.destination,
                            title: 'Ride Cancelled',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {

                        })
                        Driver.findOne({ _id: result.driver }).exec(function(err, rest) {
                            if (err) {
                                console.log(err)
                            } else {
                                var oneMessage = ndata.message;
                                var oneHeader = 'Client has cancelled their ride';
                                var oneUser = rest.signalid;
                                oneBurstDriver(oneMessage, oneHeader, oneUser);
                            }
                        })
                        var message = {
                            icon: 'airline_seat_recline_normal',
                            color: 'success',
                            content: 'Ride ' + ndata.message + ' has been cancelled by the rider',
                            sound: 'booking'
                        };
                        io.sockets.emit('notify admin', JSON.stringify(message));
                        player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
                        io.sockets.emit('ride cancelled', result);
                        socket.emit('cancel ride', result);
                    }
                })
            }
        })
    })

    socket.on('fetch driver profile', function(driverid) {
        var query = {
            _id: ObjectId(driverid)
        };
        Driver.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }
            }, {
                $lookup: {
                    from: 'rides',
                    let: { did: "$_id", rstop: 0, status: 1 },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$driver", '$$did'] },
                                    { $gt: ["$driverstop", '$$rstop'] },
                                    { $eq: ["$driveraccept", "$$status"] }
                                ]
                            }
                        }
                    }],
                    as: "arides"
                }
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'vehicle',
                    foreignField: '_id',
                    as: 'xvehicle'
                }
            }
        ]).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch driver profile', result);
            }
        })
    })
    socket.on('fetch rider profile', function(riderid) {
        var query = {
            _id: ObjectId(riderid)
        };
        Rider.aggregate([{
                $match: query
            }, {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'driver',
                    as: 'xrides'
                }
            }, {
                $lookup: {
                    from: 'rides',
                    let: { rid: "$_id", rstop: 0, status: 1 },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$rider", '$$rid'] },
                                    { $gt: ["$driverstop", '$$rstop'] },
                                    { $eq: ["$driveraccept", "$$status"] }
                                ]
                            }
                        }
                    }],
                    as: "arides"
                }
            }
        ]).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch rider profile', result);
            }
        })
    })
    socket.on('fetch driver rank', function(driver) {
        var query = {
            driver: driver,
            status: {
                $ne: 3
            }
        };
        Ride.find(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch driver rank', result);
            }
        })
    })

    socket.on('fetch nearby drivers', function(location) {
        var lat = location.lat;
        var lng = location.lng;
        var pid = location.pid;
        var query = { package: ObjectId(pid), status: { $ne: 3 }, blend: 0 };
        var squery = { setid: 'main' };
        Setting.findOne(squery).exec(function(err, res) {
            if (err) {} else {
                Driver.aggregate([{
                        $geoNear: {
                            near: {
                                type: "Point",
                                coordinates: [lng, lat]
                            },
                            key: "location",
                            spherical: true,
                            distanceField: "distance.meters",
                            maxDistance: res.setndriver
                        }
                    },
                    {
                        $match: query
                    },
                    {
                        $limit: 20
                    }, {
                        $lookup: {
                            from: 'rides',
                            localField: '_id',
                            foreignField: 'driver',
                            as: 'xrides'
                        }
                    },
                    {
                        $lookup: {
                            from: 'rides',
                            let: { did: "$_id", rstop: 0, status: 1 },
                            pipeline: [{
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$driver", '$$did'] },
                                            { $gt: ["$driverstop", '$$rstop'] },
                                            { $eq: ["$driveraccept", "$$status"] }
                                        ]
                                    }
                                }
                            }],
                            as: "arides"
                        }
                    },
                ]).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('fetch nearby drivers', result);
                    }
                })
            }
        })
    })

    socket.on('fetch nearby riders', function(location) {
        var did = location.did;
        var lat = location.lat;
        var lng = location.lng;
        var query1 = { status: { $ne: 3 } };
        var query2 = { status: { $ne: 0 } };
        Rider.aggregate([{
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    key: "location",
                    spherical: true,
                    distanceField: "distance.meters"
                }
            },
            {
                $match: {
                    $or: [query1, query2]
                }
            },
            {
                $limit: 20
            }, {
                $lookup: {
                    from: 'rides',
                    localField: '_id',
                    foreignField: 'rider',
                    as: 'xrides'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch nearby riders', result);
            }
        })
    })

    socket.on('fetch driver status', function(did) {
        var query = {
            driver: did
        };
        Ride.find(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch driver status', result);
            }
        })
    })

    socket.on('init ride', function(ride) {
        var query = { status: 1 };
        Rate.find(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('init ride', result);
            }
        })
    })
    socket.on('init ride driver', function(ride) {
        var query = { _id: ride.pid };
        Rate.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('init ride driver', result);
            }
        })
    })

    socket.on('fetch single ride', function(rid) {
        var query = {
            _id: ObjectId(rid)
        };
        var query = {
            _id: ObjectId(rid)
        };
        Ride.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: "$xpackage",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch single ride', result);
            }
        })
    })

    socket.on('check existing ride', function(uid) {
        var query1 = { rider: ObjectId(uid), driveraccept: 0, paystat: 0, driverrating: 0 };
        var query2 = { rider: ObjectId(uid), driveraccept: 1, paystat: 0, driverrating: 0 };
        var query3 = { rider: ObjectId(uid), driveraccept: 1, paystat: 1, driverrating: 0 };
        var query4 = { rider: ObjectId(uid), driveraccept: 1, paystat: 2, driverrating: 0 };
        Ride.aggregate([{
                $match: {
                    $or: [query1, query2, query3, query4]
                }
            }, {
                $sort: {
                    _id: 1
                }
            },
            {
                $lookup: {
                    from: 'rides',
                    localField: 'rider',
                    foreignField: 'rider',
                    as: 'xrides'
                }
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xpackage'
                }
            },
            {
                $unwind: {
                    path: "$xpackage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'promos',
                    localField: 'discountpromos',
                    foreignField: '_id',
                    as: 'xpromo'
                }
            },
            {
                $unwind: {
                    path: "$xpromo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'distresses',
                    localField: '_id',
                    foreignField: 'rideid',
                    as: 'xdistress'
                }
            },
            {
                $unwind: {
                    path: "$xdistress",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'settings',
                    let: { account: 'main' },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$setid", '$$account'] }
                                ]
                            }
                        }
                    }],
                    as: "xset"
                }
            },
            {
                $unwind: {
                    path: "$xset",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $limit: 1
            }
        ]).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('check existing ride', result);
            }
        })
    })
    socket.on('waiting charges', function(pid) {
        var query = {
            _id: pid
        };
        Rate.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('waiting charges', result);
            }
        })
    })

    socket.on('fetch rider details', function(riderid) {
        var query = {
            _id: riderid
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                socket.emit('fetch rider details', result);
            }
        })
    })

    socket.on('book new ride', function(booking) {
        const Bookingdata = new Ride(booking)
        Bookingdata.save((err, result) => {
            if (err) {
                console.log(err)
            } else {
                io.sockets.emit('book new ride', result);

                var ndata = {
                    userid: booking.rider,
                    sender: booking.driver,
                    icon: 'ride',
                    message: 'From ' + booking.origin + ' to ' + booking.destination,
                    title: 'New Ride Booking',
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                Driver.findOne({ _id: booking.driver }).exec(function(err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                        var oneMessage = ndata.message;
                        var oneHeader = 'New client ride request';
                        var oneUser = res.signalid;
                        oneBurstDriver(oneMessage, oneHeader, oneUser);
                    }
                })
                var message = {
                    icon: 'airline_seat_recline_normal',
                    color: 'success',
                    content: 'A New Ride Booking request has been initiated by a rider',
                    sound: 'booking'
                };
                io.sockets.emit('notify admin', JSON.stringify(message));
                player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
            }
        })
    })
    socket.on('book them ride', function(booking) {
        const Bookingdata = new Ride(booking)
        Bookingdata.save((err, result) => {
            if (err) {
                console.log(err)
            } else {
                io.sockets.emit('book them ride', result);

                var ndata = {
                    userid: booking.driver,
                    sender: booking.rider,
                    icon: 'ride',
                    message: 'From ' + booking.origin + ' to ' + booking.destination,
                    title: 'New Ride Initiated',
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                Rider.findOne({ _id: booking.rider }).exec(function(err, res) {
                    if (err) {
                        console.log(err)
                    } else {
                      if(res){
                        var oneMessage = ndata.message;
                        var oneHeader = 'New ride initiated by driver';
                        var oneUser = res.signalid;
                        oneBurstRider(oneMessage, oneHeader, oneUser);
                      }
                    }
                })
                var message = {
                    icon: 'airline_seat_recline_normal',
                    color: 'success',
                    content: 'A New Ride Booking request has been initiated by a driver',
                    sound: 'booking'
                };
                io.sockets.emit('notify admin', JSON.stringify(message));
                player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
            }
        })
    })
    socket.on('login vehicle', function(account) {
        var query = {
            email: account.email,
            password: account.password
        };
        Vehicle.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    socket.emit('login vehicle', result);
                } else {
                    socket.emit('login vehicle', {
                        status: 'invalid'
                    });
                }
            }
        });
    })
    socket.on('login rider', function(account) {
        var query = {
            email: account.email,
            password: account.password
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    socket.emit('login rider', result);
                } else {
                    socket.emit('login rider', {
                        status: 'invalid'
                    });
                }
            }
        });
    })
    socket.on('login driver', function(account) {
        var query = {
            email: account.email,
            password: account.password
        };
        Driver.findOne(query).exec(function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result) {
                    socket.emit('login driver', result);
                } else {
                    socket.emit('login driver', {
                        status: 'invalid'
                    });
                }
            }
        });
    })
    socket.on('create vehicle', function(account) {
        const Vehicleaccount = new Vehicle(account)
        Vehicleaccount.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    for (key in err.keyValue) {
                        if (err.keyValue.hasOwnProperty(key)) {
                            var keyval = err.keyValue[key];
                        }
                    }
                    socket.emit('create vehicle', {
                        status: 0,
                        response: keyval + ' has already been registered with Tufike Pamoja',
                        user: account.email
                    });
                } else {
                    socket.emit('create vehicle', {
                        status: 0,
                        response: 'An unkown error occurred. Please try again later',
                        user: account.email
                    });
                }
            } else {
                socket.emit('create vehicle', result);
                var vphone = '+254' + (account.phone).substr(1);
                const vsms = {
                    to: vphone,
                    message: 'Hi ' + account.firstname + ', ' + account.activationcode + ' is your Tufike Pamoja Vehicle Owner Account activation code'
                }
                sms.send(vsms)
                    .then(response => {})
                    .catch(error => {
                        console.log(error);
                    });
                transporter.use('compile', ehbs(eoptions));
                var mailOptions = {
                    from: { name: 'Tufike Pamoja Cabs', address: 'tufike@lexacle.com' },
                    to: account.email,
                    replyTo: 'tufikecabs@gmail.com',
                    subject: 'Tufike Pamoja',
                    template: 'vehicle',
                    context: {
                      activationcode: account.activationcode,
                      name: account.firstname
                    }
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                    } else {
                    }
                });
            }
        })
    })

    socket.on('create rider', function(account) {
        const Rideraccount = new Rider(account)
        Rideraccount.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    for (key in err.keyValue) {
                        if (err.keyValue.hasOwnProperty(key)) {
                            var keyval = err.keyValue[key];
                        }
                    }
                    socket.emit('create rider', {
                        status: 0,
                        response: keyval + ' has already been registered with Tufike Pamoja',
                        user: account.email
                    });
                } else {
                    socket.emit('create rider', {
                        status: 0,
                        response: 'An unkown error occurred. Please try again later',
                        user: account.email
                    });
                }
            } else {
                socket.emit('create rider', result);
                var vphone = '+254' + (account.phone).substr(1);
                const vsms = {
                    to: vphone,
                    message: 'Welcome ' + account.firstname + ', ' + account.activationcode + ' is your Tufike Pamoja Account activation code'
                }
                sms.send(vsms)
                    .then(response => {})
                    .catch(error => {
                    });
                    var mailOptions = {
                        priority: 'high',
                        from: { name: 'Tufike Pamoja Cabs', address: 'tufike@lexacle.com' },
                        to: account.email,
                        replyTo: 'tufikecabs@gmail.com',
                        subject: 'Tufike Pamoja Activation Code',
                        template: 'rider',
                        context: {
                          activationcode: result.activationcode,
                          name: result.firstname
                        }
                    }
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                    } else {
                    }
                });
            }
        })
    })

    socket.on('create driver', function(account) {
        const Driveraccount = new Driver(account)
        Driveraccount.save((err, result) => {
            if (err) {
                if (err.code === 11000) {
                    for (key in err.keyValue) {
                        if (err.keyValue.hasOwnProperty(key)) {
                            var keyval = err.keyValue[key];
                        }
                    }
                    socket.emit('create driver', {
                        status: 0,
                        response: keyval + ' has already been registered with Tufike Pamoja',
                        user: account.email
                    });
                } else {
                    socket.emit('create driver', {
                        status: 0,
                        response: 'An unkown error occurred. Please try again later',
                        user: account.email
                    });
                }
            } else {
              socket.emit('create driver', result);
              var vphone = '+254' + (account.phone).substr(1);
              const vsms = {
                  to: vphone,
                  message: 'Welcome ' + account.firstname + ', ' + account.activationcode + ' is your Tufike Pamoja Account activation code'
              }
              sms.send(vsms)
                  .then(response => {})
                  .catch(error => {
                      //console.log(error);
                  });
              var mailOptions = {
                  priority: 'high',
                  from: { name: 'Tufike Pamoja Cabs', address: 'tufike@lexacle.com' },
                  to: account.email,
                  replyTo: 'tufikecabs@gmail.com',
                  subject: 'Tufike Pamoja Activation Code',
                  template: 'driver',
                  context: {
                    activationcode: account.activationcode,
                    name: account.firstname
                  }
              }
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {

                    } else {

                    }
                });
            }
        })
    })

    socket.on('activate vehicle account', function(account) {
        var query = {
            _id: account.oid,
            activationcode: account.code
        };
        var status = {
            $set: {
                status: 2
            }
        };
        Vehicle.find(query).exec(function(err, result) {
            if (err) {
                console.log(err);
                socket.emit('activate vehicle account', {
                    status: 'invalid',
                    response: 'Invalid Account activation code, please try again',
                    result: 'none'
                });
            } else {
                var countusers = result.length;
                if (countusers === 0) {
                    socket.emit('activate vehicle account', {
                        status: 'invalid',
                        response: 'Invalid Account activation code, please try again',
                        result: 'none'
                    });
                } else if (countusers === 1) {
                    Vehicle.updateOne(query, status, function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('activate vehicle account', {
                                status: 'success',
                                response: 'Account verification completed successfully.',
                                result: result
                            });
                        }
                    })
                }
            }
        });
    })

    socket.on('activate rider account', function(account) {
        var query = {
            _id: account.uid,
            activationcode: account.code
        };
        var status = {
            $set: {
                status: 2
            }
        };
        Rider.find(query).exec(function(err, result) {
            if (err) {
                console.log(err);
                socket.emit('activate rider account', {
                    status: 'invalid',
                    response: 'Invalid Account activation code, please try again',
                    result: 'none'
                });
            } else {
                var countusers = result.length;
                if (countusers === 0) {
                    socket.emit('activate rider account', {
                        status: 'invalid',
                        response: 'Invalid Account activation code, please try again',
                        result: 'none'
                    });
                } else if (countusers === 1) {
                    Rider.updateOne(query, status, function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('activate rider account', {
                                status: 'success',
                                response: 'Account verification completed successfully.',
                                result: result
                            });
                        }
                    })
                }
            }
        });
    })

    socket.on('activate driver account', function(account) {
        var query = {
            _id: account.did,
            activationcode: account.code
        };
        var status = {
            $set: {
                status: 2
            }
        };
        Driver.find(query).exec(function(err, result) {
            if (err) {
                console.log(err);
                socket.emit('activate driver account', {
                    status: 'invalid',
                    response: 'An error occurred while activating your account, please try again',
                    result: 'none'
                });
            } else {
                var countusers = result.length;
                if (countusers === 0) {
                    socket.emit('activate driver account', {
                        status: 'invalid',
                        response: 'Invalid Account activation code, please try again',
                        result: 'none'
                    });
                } else if (countusers === 1) {
                    Driver.updateOne(query, status, function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            socket.emit('activate driver account', {
                                status: 'success',
                                response: 'Account verification completed successfully.',
                                result: result
                            });
                        }
                    })
                }
            }
        });
    })


    socket.on('email ride receipt', function(receipt) {
        var query = {
            _id: ObjectId(receipt.rid)
        };
        Ride.aggregate([{
                $match: query
            },
            {
                $lookup: {
                    from: 'riders',
                    localField: 'rider',
                    foreignField: '_id',
                    as: 'xrider'
                }
            },
            {
                $unwind: {
                    path: "$xrider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'driver',
                    foreignField: '_id',
                    as: 'xdriver'
                }
            },
            {
                $unwind: {
                    path: "$xdriver",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'rates',
                    localField: 'packageid',
                    foreignField: '_id',
                    as: 'xrates'
                }
            },
            {
                $unwind: {
                    path: "$xrates",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'promos',
                    localField: 'discountpromos',
                    foreignField: '_id',
                    as: 'xpromo'
                }
            },
            {
                $unwind: {
                    path: "$xpromo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'settings',
                    let: { account: 'main' },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$setid", '$$account'] }
                                ]
                            }
                        }
                    }],
                    as: "xset"
                }
            },
            {
                $unwind: {
                    path: "$xset",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).exec(function(err, response) {
            if (err) { console.log(err); } else {
                console.log(response)
                for (var key in response) {
                    var rideremail = response[key].xrider.email;
                    var drivername = response[key].xdriver.firstname + ' ' + response[key].xdriver.lastname;
                    var ridername = response[key].xrider.firstname + ' ' + response[key].xrider.lastname;
                    var packagephoto = response[key].xrates.photo;
                    var packagename = response[key].xrates.package;
                    var permin = response[key].xrates.permin;
                    var perkm = response[key].xrates.perkm;
                    var basefare = response[key].xrates.basefare;
                    var maxwaiting = response[key].xrates.waitingtime;
                    var perwaiting = response[key].xrates.waitingcharges;
                    var minfare = response[key].xrates.minimumfare;
                    var minprice = minfare;
                    var origin = response[key].origin;
                    var destination = response[key].destination;
                    var distance = response[key].distance;
                    var duration = response[key].duration;
                    var driveraccept = response[key].driveraccept;
                    var driverinit = response[key].driverinit;
                    var driverarrive = response[key].driverarrive;
                    var driverstart = response[key].driverstart;
                    var driverstop = response[key].driverstop;
                    var paystat = response[key].paystat;
                    var clientrate = response[key].clientrating;
                    var redeemedpoints = response[key].redeemedpoints;
                    var redeemedcash = redeemedpoints * response[key].xset.setperpoint;
                    if (driveraccept === 0) {
                        ridestatus = 'Pending';
                        ridecolor = 'gray';
                    } else if (driveraccept === 1) {
                        if (driverinit === 0 && driverarrive === 0 && driverstart === 0 && driverstop === 0 && paystat === 0 && clientrate === 0) {
                            ridestatus = 'Accepted';
                            ridecolor = 'teal';
                        } else if (driverinit > 0 && driverarrive === 0 && driverstart === 0 && driverstop === 0 && paystat === 0 && clientrate === 0) {
                            ridestatus = 'Initialized';
                            ridecolor = 'purple';
                        } else if (driverinit > 0 && driverarrive > 0 && driverstart === 0 && driverstop === 0 && paystat === 0 && clientrate === 0) {
                            ridestatus = 'Arrived';
                            ridecolor = 'deeppurple';
                        } else if (driverinit > 0 && driverarrive > 0 && driverstart > 0 && driverstop === 0 && paystat === 0 && clientrate === 0) {
                            ridestatus = 'In Progress';
                            ridecolor = 'green';
                        } else if (driverinit > 0 && driverarrive > 0 && driverstart > 0 && driverstop > 0 && paystat === 0 && clientrate === 0) {
                            ridestatus = 'Stopped';
                            ridecolor = 'pink';

                        } else if (driverinit > 0 && driverarrive > 0 && driverstart > 0 && driverstop > 0 && paystat > 0 && clientrate === 0) {
                            if (driverinit > 0 && driverarrive > 0 && driverstart > 0 && driverstop > 0 && paystat === 1 && clientrate === 0) {
                                ridestatus = 'Paid';
                                ridecolor = 'green';
                            } else if (driverinit > 0 && driverarrive > 0 && driverstart > 0 && driverstop > 0 && paystat === 2 && clientrate === 0) {
                                ridestatus = 'Unpaid';
                                ridecolor = 'pink';
                            }
                        } else if (driverinit > 0 && driverarrive > 0 && driverstart > 0 && driverstop > 0 && paystat > 0 && clientrate > 0) {
                            ridestatus = 'Complete';
                            ridecolor = 'primary';
                        }
                    } else if (driveraccept === 2) {
                        ridestatus = 'Rejected';
                        ridecolor = 'red';
                    } else if (driveraccept === 3) {
                        ridestatus = 'Cancelled';
                        ridecolor = 'deeporange';
                    }
                    if (redeemedcash > 0) {
                        redeemcolor = 'text-color-primary';
                    } else {
                        redeemcolor = 'text-color-gray';
                    }
                    if (driverarrive === 0 && driverstart === 0) {
                        var waitingtime = 0;
                    } else if (driverarrive > 0 && driverstart === 0) {
                        var waitingtime = Date.now() - driverarrive;
                    } else if (driverarrive > 0 && driverstart > 0) {
                        var waitingtime = driverstart - driverarrive;
                    }
                    if (driverstart === 0 && driverstop === 0) {
                        var ridetime = 0;
                    } else if (driverstart > 0 && driverstop === 0) {
                        var ridetime = Date.now() - driverstart;
                    } else if (driverstart > 0 && driverstop > 0) {
                        var ridetime = driverstop - driverstart;
                    }
                    if (response[key].xpromo) {
                        prodiscount = response[key].xpromo.discount;
                        procolor = 'text-color-primary';
                        procodebase = response[key].xpromo.promocode;
                    } else {
                        prodiscount = 0;
                        procolor = 'text-color-gray';
                        procodebase = 'NONE';
                    }
                    var waitingtimemins = Math.round(waitingtime / 60000);
                    var ridetimemins = Math.round(ridetime / 60000);
                    var waitingallow = (maxwaiting * 60000);
                    if (waitingtime > waitingallow) {
                        waitingfee = Math.round(((waitingtime - waitingallow) / 60000) * perwaiting);
                        waitingcolor = 'text-color-primary';
                    } else {
                        waitingfee = 0;
                        waitingcolor = 'text-color-gray';
                    }
                    if (ridetime > 0) {
                        ridefee = Math.round((ridetime * permin) / 60000);
                        ridecolor = 'text-color-primary';
                    } else {
                        ridefee = 0;
                        ridecolor = 'text-color-gray';
                    }
                    var distancekm = (distance / 1000).toFixed(2);
                    var distancefee = Math.round((distance / 1000) * perkm);
                    var totalfee = basefare + waitingfee + ridefee + distancefee;

                    var payoutfee = totalfee - redeemedcash;
                    var proamount = Math.round((prodiscount / 100) * payoutfee);
                    var finalfee = payoutfee - proamount;
                    if (finalfee < minprice && prodiscount > 0 || finalfee < minprice && redeemedcash > 0) {
                        sysprice = finalfee;
                        ppicker = 'text-color-gray';
                    } else if (finalfee < minprice && prodiscount === 0 || finalfee < minprice && redeemedcash === 0) {
                        sysprice = minprice;
                        ppicker = 'text-color-primary';
                    } else if (finalfee > minprice) {
                        sysprice = finalfee;
                        ppicker = 'text-color-gray';
                    } else {
                        ppicker = '';
                    }
                    var mailOptions = {
                        priority: 'high',
                        from: 'Tufike Pamoja Cabs <tufike@lexacle.com>',
                        to: receipt.email,
                        replyTo: 'tufikecabs@gmail.com',
                        subject: 'Tufike Pamoja Ride Receipt',
                        html: `
                    <!doctype html>
                    <html>
                    <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>Ride Transaction Receipt</title>
                    <style>
                    @media only screen and (max-width: 620px) {
                      table[class=body] h1 {
                        font-size: 28px !important;
                        margin-bottom: 10px !important;
                    }
                    table[class=body] p,
                    table[class=body] ul,
                    table[class=body] ol,
                    table[class=body] td,
                    table[class=body] span,
                    table[class=body] a {
                        font-size: 16px !important;
                    }
                    table[class=body] .wrapper,
                    table[class=body] .article {
                        padding: 10px !important;
                    }
                    table[class=body] .content {
                        padding: 0 !important;
                    }
                    table[class=body] .container {
                        padding: 0 !important;
                        width: 100% !important;
                    }
                    table[class=body] .main {
                        border-left-width: 0 !important;
                        border-radius: 0 !important;
                        border-right-width: 0 !important;
                    }
                    table[class=body] .btn table {
                        width: 100% !important;
                    }
                    table[class=body] .btn {
                        width: 100% !important;
                    }
                    table[class=body] .img-responsive {
                        height: auto !important;
                        max-width: 100% !important;
                        width: auto !important;
                    }
                }
                @media all {
                  .ExternalClass {
                    width: 100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                    line-height: 100%;
                }
                .apple-link a {
                    color: inherit !important;
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    text-decoration: none !important;
                }
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                    font-size: inherit;
                    font-family: inherit;
                    font-weight: inherit;
                    line-height: inherit;
                }
            }
            </style>
            </head>
            <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
            <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
            <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
            <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"><b>Ride Transaction Receipt</b></span>
            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 0px;">

            <!-- START MAIN CONTENT AREA -->
            <tr style="background-image: linear-gradient(60deg, #7F2DD3, #450080) !important;">
                <td style="padding: 20px;font-weight:600;font-size:28px;color:#ffffff;">
                Tufike Pamoja Ride Receipt
                </td>
                </tr>
            <tr>
            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
            <tr>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi ${ridername},</p>
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Welcome to Tufike Pamoja Cabs. Enjoy personalized Taxi Services wherever you are, whenever you need it. Below is your Ride Transaction Receipt</p>
            <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
            <tbody>
            <tr>
            <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
            <tbody>
            <div class="list media-list no-margin no-padding animated fadeIn">
            <ul>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">${packagename} Package</div>
            <div class="item-after">KES. ${permin} Per min</div>
            </div>
            <div class="item-subtitle text-color-gray">
            Minimum <span class="${ppicker}">KES. ${minfare}</span>
            <span class="right">Base Fare <span class="text-color-primary">KES. ${basefare}</span></span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Total Ride Time</div>
            <div class="item-after text-color-gray">${ridetimemins} Mins</div>
            </div>
            <div class="item-subtitle">
            Driver Waiting Time
            <span class="right text-color-gray">${waitingtimemins} Mins</span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Ride Time Fee</div>
            <div class="item-after ${ridecolor}">KES. ${ridefee}</div>
            </div>
            <div class="item-subtitle">
            Waiting Time Fee
            <span class="right ${waitingcolor}">KES. ${waitingfee}</span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Distance Fee</div>
            <div class="item-after text-color-primary">KES. ${distancefee}</div>
            </div>
            <div class="item-subtitle">
            Ride Distance
            <span class="right text-color-gray">${distancekm} KM</span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Rewards Discount</div>
            <div class="item-after ${redeemcolor}">KES. ${redeemedcash}</div>
            </div>
            <div class="item-subtitle">
            Points Redeemed
            <span class="right text-color-gray">${redeemedpoints} Pts</span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Promo Discount</div>
            <div class="item-after ${procolor}">KES. ${proamount}</div>
            </div>
            <div class="item-subtitle">
            Promo Code <span class="text-color-gray"><b>${procodebase}</b></span>
            <span class="right text-color-gray">${prodiscount}% Off</span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Payable Ride Fees</div>
            <div class="item-after text-color-primary"><b>KES. ${sysprice}</b></div>
            </div>
            <div class="item-subtitle">
            Total Ride Charges
            <span class="right text-color-gray">KES. ${totalfee}</span>
            </div>
            </div>
            </div>
            </li>
            <li>
            <div class="item-content">
            <div class="item-media"></div>
            <div class="item-inner">
            <div class="item-title-row">
            <div class="item-subtitle">Driver</div>
            <div class="item-after text-color-gray">${drivername}</div>
            </div>
            <div class="item-subtitle">
            Ride status
            <span class="right text-color-gray">${ridestatus}</span>
            </div>
            </div>
            </div>
            </li>
            </ul>
            </div>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Thank you for choosing Tufike Pamoja Cabs. <i>"Together we ride"</i></p>
            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">
            Best regards,<br>
            Tufike Pamoja Team<br>
            +254 716 435 983
            </p>
            </td>
            </tr>
            </table>
            </td>
            </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer" style="clear: both; margin-top: 0px; text-align: center; width: 100%;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
            <tr style="background-image: linear-gradient(60deg, #450080, #7F2DD3) !important;">
            <td class="content-block" style="font-family: sans-serif;font-size: 12px;vertical-align: top;padding-bottom: 10px;padding-top: 10px;color: #999999;text-align: center;">
            <span class="apple-link" style="color: #fff;font-size: 12px;text-align: center;">Tufike Pamoja Cabs, Nanyuki - Kenya, tufikecabs@gmail.com</span>
            </td>
            </tr>
            <tr>
            <tr>
            <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
            Developed by <a href="https://lexacle.com" style="color: #999999; font-size: 12px; text-align: center; text-decoration: none;">Lexacle Technologies Ltd</a>.
            </td>
            </tr>
            </table>
            </div>
            </div>
            </td>
            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
            </tr>
            </table>
            </body>
            </html>`
                    };
                }
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        socket.emit('email ride receipt', info.response);
                        console.log('Email sent: ' + info.response);
                    }
                });

            }

        })
    })
    socket.on('resend vehicle code', function(account) {
        var query = {
            _id: account.oid
        };
        Vehicle.findOne(query).exec(function(err, result) {
            if (err) {
                socket.emit('resend vehicle code', {status: 'unauth',response: 'none'});
            } else {
              socket.emit('resend vehicle code', {status: 'success', response: result.activationcode});
                var vphone = '+254' + (result.phone).substr(1);
                var vmessage = 'Welcome ' + result.firstname + ', ' + result.activationcode + ' is your Tufike Pamoja Vehicle Owner Account activation code';
                const vsms = {
                    to: [vphone],
                    message: vmessage
                }
                sms.send(vsms)
                    .then(response => {
                    })
                    .catch(error => {
                    });
                    transporter.use('compile', ehbs(eoptions));
                    var mailOptions = {
                        priority: 'high',
                        from: { name: 'Tufike Pamoja Cabs', address: 'tufike@lexacle.com' },
                        to: account.email,
                        replyTo: 'tufikecabs@gmail.com',
                        subject: 'Tufike Pamoja',
                        template: 'vehicle',
                        context: {
                          activationcode: result.activationcode,
                          name: result.firstname
                        }
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                    } else {
                    }
                });
            }
        })
    })
    socket.on('resend rider code', function(account) {
        var query = {
            _id: account.uid
        };
        Rider.findOne(query).exec(function(err, result) {
            if (err) {
                socket.emit('resend rider code', {status: 'unauth',response: 'none'});
            } else {
              socket.emit('resend rider code', {status: 'success',response: result.activationcode});
                var vphone = '+254' + (result.phone).substr(1);
                var vmessage = 'Welcome ' + result.firstname + ', ' + result.activationcode + ' is your Tufike Pamoja Rider Account activation code';
                const vsms = {
                    to: [vphone],
                    message: vmessage
                }
                sms.send(vsms)
                    .then(response => {
                    })
                    .catch(error => {
                    });
                    transporter.use('compile', ehbs(eoptions));
                    var mailOptions = {
                        priority: 'high',
                        from: { name: 'Tufike Pamoja Cabs', address: 'tufike@lexacle.com' },
                        to: account.email,
                        replyTo: 'tufikecabs@gmail.com',
                        subject: 'Tufike Pamoja Activation Code',
                        template: 'rider',
                        context: {
                          activationcode: result.activationcode,
                          name: result.firstname
                        }
                    }
                    transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                    } else {
                    }
                });
            }
        })
    })

    socket.on('resend driver code', function(account) {
        var query = {
            _id: account.did
        };
        Driver.findOne(query).exec(function(err, result) {
            if (err) {
                socket.emit('resend driver code', {status: 'unauth',response: 'none'});
            } else {
              var vphone = '+254' + (result.phone).substr(1);
              var vmessage = 'Welcome ' + result.firstname + ', ' + result.activationcode + ' is your Tufike Pamoja Driver Account activation code';
              const vsms = {
                  to: [vphone],
                  message: vmessage
              }
              sms.send(vsms)
                  .then(response => {
                  })
                  .catch(error => {
                  });
              socket.emit('resend driver code', {status: 'success',response: result.activationcode});
                transporter.use('compile', ehbs(eoptions));
                var mailOptions = {
                    priority: 'high',
                    from: { name: 'Tufike Pamoja Cabs', address: 'tufike@lexacle.com' },
                    to: account.email,
                    replyTo: 'tufikecabs@gmail.com',
                    subject: 'Tufike Pamoja Activation Code',
                    template: 'driver',
                    context: {
                      activationcode: result.activationcode,
                      name: result.firstname
                    }
                }
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                    } else {
                    }
                });

            }
        })
    })

    socket.on('unset rider badge', function(code) {
        var uid = code.uid;
        var page = code.page;
        var query = {
            _id: uid
        };
        if (page === 'about') {
            var activenot = { $set: { 'activepush.about': 0 } };
        } else if (page === 'terms') {
            var activenot = { $set: { 'activepush.terms': 0 } };
        } else if (page === 'privacy') {
            var activenot = { $set: { 'activepush.privacy': 0 } };
        } else if (page === 'rewards') {
            var activenot = { $set: { 'activepush.rewards': 0 } };
        } else if (page === 'promotions') {
            var activenot = { $set: { 'activepush.promotions': 0 } };
        }
        Rider.updateOne(query, activenot, function(err, res) {
            if (err) {} else {
                io.sockets.emit('update rider badge', uid);
            }
        })
    })
    socket.on('update rider location', function(location) {
        var query = {
            _id: location.uid
        };
        var lat = location.lat;
        var lng = location.lng;
        var newcoords = {
            $set: {
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            }
        };
        Rider.updateOne(query, newcoords, function(err, res) {
            if (err) {} else {
                socket.emit('update rider location', location);
                io.sockets.emit('new rider location', location);
            }
        })
    })
    socket.on('update driver location', function(location) {
        var query = {
            _id: location.did
        };
        var lat = location.lat;
        var lng = location.lng;
        var newcoords = {
            $set: {
                location: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            }
        };
        Driver.updateOne(query, newcoords, function(err, res) {
            if (err) {} else {
                socket.emit('update driver location', location);
                io.sockets.emit('new driver location', location);
            }
        })
    })
    socket.on('update driver online', function(xdata) {
        var query = {
            _id: xdata.did
        };
        var newstatus = { blend: xdata.status }
        Driver.updateOne(query, newstatus, function(err, res) {
            if (err) {} else {
                socket.emit('update driver online', xdata);
                if (xdata.status === 0) {
                    var ndata = {
                        userid: xdata.did,
                        sender: 'Tufike Pamoja',
                        icon: 'wifi_slash',
                        message: 'You have disabled driver offline mode',
                        title: 'Offline mode disabled',
                        status: 1,
                        time: Date.now()
                    };
                } else if (xdata.status === 1) {
                    var ndata = {
                        userid: xdata.did,
                        sender: 'Tufike Pamoja',
                        icon: 'wifi',
                        message: 'You have initiated driver offline mode',
                        title: 'Offline mode initiated',
                        status: 1,
                        time: Date.now()
                    };
                }
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                io.sockets.emit('new driver notification', ndata);
            }
        })
    })

    socket.on('add favorites', function(favoriteplace) {
        var query = {
            riderid: favoriteplace.riderid,
            placeid: favoriteplace.placeid
        };
        Favorite.find(query).exec(function(err, result) {
            if (err) {
                throw err;
            } else {
                if (result.length > 0) {
                    var result = {
                        status: 2
                    };
                    socket.emit('add favorites', result);
                } else {
                    const newfavorite = new Favorite(favoriteplace)
                    newfavorite.save((err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            socket.emit('add favorites', result);
                            var message = {
                                icon: 'favorite',
                                color: 'success',
                                content: 'A New Favorite Place has been added to the database',
                                sound: 'favorite'
                            };
                            io.sockets.emit('notify admin', JSON.stringify(message));
                            player.play('./public/assets/admin/sounds' + message.sound + '.mp3');
                            var ndata = {
                                userid: favoriteplace.riderid,
                                sender: 'Tufike Pamoja',
                                icon: 'notifications_active',
                                message: 'You added ' + favoriteplace.placename + ' as your ' + favoriteplace.alias + ' place',
                                title: 'New favorite ' + favoriteplace.alias + ' place added',
                                status: 1,
                                time: Date.now()
                            };
                            const Notificationdata = new Notification(ndata);
                            Notificationdata.save((err, result) => {})
                        }
                    })
                }
            }
        })

    })

    socket.on('fetch favorites', function(uid) {
        var query = {
            riderid: uid
        };
        Favorite.find(query).sort({
            _id: -1
        }).exec(function(err, result) {
            if (err) throw err;
            socket.emit('fetch favorites', result);
        });
    })

    socket.on('delete favorites', function(fid) {
        Favorite.deleteOne({
            _id: fid
        }, function(err, response) {
            if (err) {
                console.log(err);
            } else {
                socket.emit('delete favorites', response)
            }
        });
    })

    socket.on('update admin photo', function(profile) {
        var photoData = profile.photo;
        var base64Data = photoData.replace(/^data:image\/png;base64,/, "");
        var photoName = Buffer.from(base64Data, 'base64');
        var file = profile.aid + '.png',
            folder = 'assets/admin/avatars/';
        var fidel = new FTP();
        fidel.on('ready', function() {
            fidel.put(photoName, folder + file, function(err) {
                if (err) {
                    console.log('err', err);
                } else {
                  var path = `vapor/${folder}${file}`;
                  var url = `${cloudUrl}/${folder}${file}`;
                  dropLink(path, url);
                    var photoname = profile.aid + '.png';
                    var query = {
                        _id: profile.aid
                    };
                    var avatar = {
                        $set: {
                            photo: photoname
                        }
                    };
                    var s_query = {
                        userid: profile.aid
                    };
                    var s_avatar = {
                        $set: {
                            senderphoto: photoname
                        }
                    };
                    Supportchat.updateMany(s_query, s_avatar, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Admin.updateOne(query, avatar, function(err, result) {
                        if (err) {
                            throw err;
                        } else {
                            Admin.findOne(query).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    socket.emit('update admin photo', result);
                                }
                            })
                        }
                    })
                    fidel.end();
                }
            });
        });
        fidel.connect(ftpConnection);
    })

    socket.on('update vehicle photo', function(profile) {
        var photoData = profile.photo;
        var base64Data = photoData.replace(/^data:image\/png;base64,/, "");
        var photoName = Buffer.from(base64Data, 'base64');
        var file = profile.oid + '.png',
            folder = 'assets/vehicles/avatars/';
        var fidel = new FTP();
        fidel.on('ready', function() {
            fidel.put(photoName, folder + file, function(err) {
                if (err) {
                    console.log('err', err);
                } else {
                  var path = `vapor/${folder}${file}`;
                  var url = `${cloudUrl}/${folder}${file}`;
                  dropLink(path, url);
                    var photoname = profile.oid + '.png';
                    var query = {
                        _id: profile.oid
                    };
                    var avatar = {
                        $set: {
                            photo: photoname
                        }
                    };
                    var avatar2 = {
                        $set: {
                            receiverphoto: photoname
                        }
                    };
                    var query3 = {
                        userid: profile.oid,
                        messagetype: 'sent'
                    };
                    var avatar3 = {
                        $set: {
                            senderphoto: photoname
                        }
                    };
                    Supportchat.updateMany(query3, avatar3, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Vehicle.updateOne(query, avatar, function(err, result) {
                        if (err) {
                            throw err;
                        } else {
                            Vehicle.findOne(query).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    socket.emit('update vehicle photo', result);
                                    var ndata = {
                                        userid: profile.oid,
                                        sender: 'Tufike Pamoja',
                                        icon: 'notifications_active',
                                        message: 'Your account profile photo was updated successfully',
                                        title: 'Profile Photo Changed',
                                        status: 1,
                                        time: Date.now()
                                    };
                                    const Notificationdata = new Notification(ndata);
                                    Notificationdata.save((err, result) => {})
                                    io.sockets.emit('new vehicle notification', ndata);
                                    //dropIt(loccy, folly, filley);
                                }
                            })
                        }
                    })
                    fidel.end();
                }
            });
        });
        fidel.connect(ftpConnection);
    })

    socket.on('update rider photo', function(profile) {
        var photoData = profile.photo;
        var base64Data = photoData.replace(/^data:image\/png;base64,/, "");
        var photoName = Buffer.from(base64Data, 'base64');
        var file = profile.uid + '.png',
            folder = 'assets/riders/avatars/';
        var fidel = new FTP();
        fidel.on('ready', function() {
            fidel.put(photoName, folder + file, function(err) {
                if (err) {
                    console.log('err', err);
                } else {
                  var path = `vapor/${folder}${file}`;
                  var url = `${cloudUrl}/${folder}${file}`;
                  dropLink(path, url);
                    var photoname = profile.uid + '.png';
                    var query = {
                        _id: profile.uid
                    };
                    var avatar = {
                        $set: {
                            photo: photoname
                        }
                    };
                    var query1 = {
                        sender: profile.uid
                    };
                    var avatar1 = {
                        $set: {
                            senderphoto: photoname
                        }
                    };
                    var query2 = {
                        receiver: profile.uid
                    };
                    var avatar2 = {
                        $set: {
                            receiverphoto: photoname
                        }
                    };
                    var query3 = {
                        userid: profile.uid
                    };
                    var avatar3 = {
                        $set: {
                            senderphoto: photoname
                        }
                    };
                    Chat.updateMany(query1, avatar1, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Chat.updateMany(query2, avatar2, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Supportchat.updateMany(query3, avatar3, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Rider.updateOne(query, avatar, function(err, result) {
                        if (err) {
                            throw err;
                        } else {
                            Rider.findOne(query).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    socket.emit('update rider photo', result);
                                    var ndata = {
                                        userid: ObjectId(profile.uid),
                                        sender: 'Tufike Pamoja',
                                        icon: 'notifications_active',
                                        message: 'Your account profile photo was updated successfully',
                                        title: 'Profile Photo Changed',
                                        status: 1,
                                        time: Date.now()
                                    };
                                    const Notificationdata = new Notification(ndata);
                                    Notificationdata.save((err, result) => {})
                                    io.sockets.emit('new rider notification', ndata);
                                }
                            })
                        }
                    })
                    fidel.end();
                }
            });
        });
        fidel.connect(ftpConnection);
    })



    socket.on('update driver photo', function(profile) {
        var photoData = profile.photo;
        var base64Data = photoData.replace(/^data:image\/png;base64,/, "");
        var photoName = Buffer.from(base64Data, 'base64');
        var file = profile.did + '.png',
            folder = 'assets/drivers/avatars/';
        var fidel = new FTP();
        fidel.on('ready', function() {
            fidel.put(photoName, folder + file, function(err) {
                if (err) {
                    //console.log(err)
                } else {
                    var path = `vapor/${folder}${file}`;
                    var url = `${cloudUrl}/${folder}${file}`;
                    iLinkPro(path, url);
                    var photoname = profile.did + '.png';
                    var query = {
                        _id: profile.did
                    };
                    var avatar = {
                        $set: {
                            photo: photoname
                        }
                    };
                    var query1 = {
                        sender: profile.did
                    };
                    var avatar1 = {
                        $set: {
                            senderphoto: photoname
                        }
                    };
                    var query2 = {
                        receiver: profile.did
                    };
                    var avatar2 = {
                        $set: {
                            receiverphoto: photoname
                        }
                    };
                    var query3 = {
                        userid: profile.did
                    };
                    var avatar3 = {
                        $set: {
                            senderphoto: photoname
                        }
                    };
                    Chat.updateMany(query1, avatar1, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Chat.updateMany(query2, avatar2, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Supportchat.updateMany(query3, avatar3, function(err, res) {
                        if (err) {
                            throw err;
                        } else {}
                    })
                    Driver.updateOne(query, avatar, function(err, result) {
                        if (err) {
                            throw err;
                        } else {
                            Driver.findOne(query).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    socket.emit('update driver photo', result);
                                    var ndata = {
                                        userid: ObjectId(profile.did),
                                        sender: 'Tufike Pamoja',
                                        icon: 'notifications_active',
                                        message: 'Your account profile photo was updated successfully',
                                        title: 'Profile Photo Changed',
                                        status: 1,
                                        time: Date.now()
                                    };
                                    const Notificationdata = new Notification(ndata);
                                    Notificationdata.save((err, result) => {})
                                    io.sockets.emit('new driver notification', ndata);
                                }
                            })
                        }
                    })
                    fidel.end();
                }
            });
        });
        fidel.connect(ftpConnection);
    })
    socket.on('update vehicle firstname', function(profile) {
        var query = {
            _id: profile.oid
        };
        var firstname = profile.firstname;
        Vehicle.updateOne(query, {
            $set: {
                firstname: firstname
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle firstname', result);
                        var ndata = {
                            userid: profile.oid,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile first name',
                            title: 'Account First Name Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new vehicle notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update rider firstname', function(profile) {
        var query = {
            _id: profile.uid
        };
        var firstname = profile.firstname;
        Rider.updateOne(query, {
            $set: {
                firstname: firstname
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider firstname', result);
                        var ndata = {
                            userid: ObjectId(profile.uid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile first name',
                            title: 'Account First Name Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new rider notification', ndata);
                    }
                })
            }
        })
    })


    socket.on('update driver firstname', function(profile) {
        var query = {
            _id: profile.did
        };
        var firstname = profile.firstname;
        Driver.updateOne(query, {
            $set: {
                firstname: firstname
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver firstname', result);
                        var ndata = {
                            userid: profile.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile first name',
                            title: 'Account First Name Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })


    socket.on('update vehicle lastname', function(profile) {
        var query = {
            _id: profile.oid
        };
        var lastname = profile.lastname;
        Vehicle.updateOne(query, {
            $set: {
                lastname: lastname
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle lastname', result);
                        var ndata = {
                            userid: profile.oid,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile last name',
                            title: 'Account Last Name Updated',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new vehicle notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update rider lastname', function(profile) {
        var query = {
            _id: profile.uid
        };
        var lastname = profile.lastname;
        Rider.updateOne(query, {
            $set: {
                lastname: lastname
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider lastname', result);
                        var ndata = {
                            userid: ObjectId(profile.uid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile last name',
                            title: 'Account Last Name Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new rider notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update driver lastname', function(profile) {
        var query = {
            _id: profile.did
        };
        var lastname = profile.lastname;
        Driver.updateOne(query, {
            $set: {
                lastname: lastname
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver lastname', result);
                        var ndata = {
                            userid: profile.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile last name',
                            title: 'Account Last Name Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update vehicle email', function(profile) {
        var query = {
            _id: profile.oid
        };
        var email = profile.email;
        var oid = profile.oid;
        Vehicle.find({
            email: email,
            _id: {
                $ne: oid
            }
        }).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                if (result > 0) {
                    var result = {
                        status: 3
                    };
                    socket.emit('update vehicle email', result);
                } else {
                    Vehicle.updateOne(query, {
                        $set: {
                            email: email
                        }
                    }, function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            Vehicle.findOne(query).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    socket.emit('update vehicle email', result);
                                    var ndata = {
                                        userid: profile.oid,
                                        sender: 'Tufike Pamoja',
                                        icon: 'notifications_active',
                                        message: 'You updated your account profile email address',
                                        title: 'Account Email Address Changed',
                                        status: 1,
                                        time: Date.now()
                                    };
                                    const Notificationdata = new Notification(ndata);
                                    Notificationdata.save((err, result) => {})
                                    io.sockets.emit('new vehicle notification', ndata);
                                }
                            })
                        }
                    })
                }
            }
        })
    })

    socket.on('update rider email', function(profile) {
        var query = {
            _id: profile.uid
        };
        var email = profile.email;
        var uid = profile.uid;
        Rider.find({
            email: email,
            _id: {
                $ne: uid
            }
        }).exec(function(err, res) {
            if (err) {
                console.log(err)
            } else {
                if (result > 0) {
                    var result = {
                        status: 3
                    };
                    socket.emit('update rider email', result);
                } else {
                    Rider.updateOne(query, {
                        $set: {
                            email: email
                        }
                    }, function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            Rider.findOne(query).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    socket.emit('update rider email', result);
                                    var ndata = {
                                        userid: ObjectId(profile.uid),
                                        sender: 'Tufike Pamoja',
                                        icon: 'notifications_active',
                                        message: 'You updated your account profile email address',
                                        title: 'Account Email Address Changed',
                                        status: 1,
                                        time: Date.now()
                                    };
                                    const Notificationdata = new Notification(ndata);
                                    Notificationdata.save((err, result) => {})
                                    io.sockets.emit('new rider notification', ndata);
                                }
                            })
                        }
                    })
                }
            }
        })
    })
    socket.on('update driver email', function(profile) {
        var query = {
            _id: profile.did
        };
        var email = profile.email;
        Driver.updateOne(query, {
            $set: {
                email: email
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver email', result);
                        var ndata = {
                            userid: profile.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile email address',
                            title: 'Account Email Address Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update vehicle phone', function(profile) {
        var query = {
            _id: profile.oid
        };
        var phone = profile.phone;
        Vehicle.updateOne(query, {
            $set: {
                phone: phone
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle phone', result);
                        var ndata = {
                            userid: profile.oid,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile phone number',
                            title: 'Account Phone Number Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new vehicle notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update rider phone', function(profile) {
        var query = {
            _id: profile.uid
        };
        var phone = profile.phone;
        Rider.updateOne(query, {
            $set: {
                phone: phone
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider phone', result);
                        var ndata = {
                            userid: ObjectId(profile.uid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile phone number',
                            title: 'Account Phone Number Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new rider notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update driver phone', function(profile) {
        var query = {
            _id: profile.did
        };
        var phone = profile.phone;
        Driver.updateOne(query, {
            $set: {
                phone: phone
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver phone', result);
                        var ndata = {
                            userid: profile.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your account profile phone number',
                            title: 'Account Phone Number Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('find vehicle password', function(alter) {
        var query = {
            _id: alter.oid,
            password: alter.password
        };
        Vehicle.find(query).exec(function(err, res) {
            if (err) {
                throw err;
            } else {
                socket.emit('find vehicle password', res);
            }
        })
    })
    socket.on('find rider password', function(alter) {
        var query = {
            _id: alter.uid,
            password: alter.password
        };
        Rider.find(query).exec(function(err, res) {
            if (err) {
                throw err;
            } else {
                socket.emit('find rider password', res);
            }
        })
    })
    socket.on('find driver password', function(alter) {
        var query = {
            _id: alter.did,
            password: alter.password
        };
        Driver.find(query).exec(function(err, res) {
            if (err) {
                throw err;
            } else {
                socket.emit('find driver password', res);
            }
        })
    })
    socket.on('update vehicle password', function(newpass) {
        var query = {
            _id: newpass.oid
        };
        var password = newpass.password;
        Vehicle.updateOne(query, {
            $set: {
                password: password
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                socket.emit('update vehicle password', res);
                var ndata = {
                    userid: newpass.oid,
                    sender: 'Tufike Pamoja',
                    icon: 'notifications_active',
                    message: 'Your account password was modified',
                    title: 'Account Password Updated',
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                io.sockets.emit('new vehicle notification', ndata);
            }
        })
    })
    socket.on('update rider password', function(newpass) {
        var query = {
            _id: newpass.uid
        };
        var password = newpass.password;
        Rider.updateOne(query, {
            $set: {
                password: password
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                socket.emit('update rider password', res);
                var ndata = {
                    userid: ObjectId(newpass.uid),
                    sender: 'Tufike Pamoja',
                    icon: 'notifications_active',
                    message: 'Your account password was modified',
                    title: 'Account Password Updated',
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                io.sockets.emit('new rider notification', ndata);
            }
        })
    })
    socket.on('update driver password', function(newpass) {
        var query = {
            _id: newpass.did
        };
        var password = newpass.password;
        Driver.updateOne(query, {
            $set: {
                password: password
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                socket.emit('update driver password', res);
                var ndata = {
                    userid: newpass.did,
                    sender: 'Tufike Pamoja',
                    icon: 'notifications_active',
                    message: 'Your account password was modified',
                    title: 'Account Password Updated',
                    status: 1,
                    time: Date.now()
                };
                const Notificationdata = new Notification(ndata);
                Notificationdata.save((err, result) => {})
                io.sockets.emit('new driver notification', ndata);
            }
        })
    })
    socket.on('update vehicle notifications', function(xdata) {
        var query = {
            _id: xdata.oid
        };
        var notifications = xdata.status;
        Vehicle.updateOne(query, {
            $set: {
                'settings.notifications': notifications
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle notifications', result);

                    }
                })
            }
        })
    })
    socket.on('update rider notifications', function(xdata) {
        var query = {
            _id: xdata.uid
        };
        var notifications = xdata.status;
        Rider.updateOne(query, {
            $set: {
                'settings.notifications': notifications
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider notifications', result);

                    }
                })
            }
        })
    })
    socket.on('update driver notifications', function(xdata) {
        var query = {
            _id: xdata.did
        };
        var notifications = xdata.status;
        Driver.updateOne(query, {
            $set: {
                'settings.notifications': notifications
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver notifications', result);
                    }
                })
            }
        })
    })
    socket.on('update vehicle mode', function(xdata) {
        var query = {
            _id: xdata.oid
        };
        var mode = xdata.status;
        Vehicle.updateOne(query, {
            $set: {
                'settings.mode': mode
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle mode', result);
                        var ndata = {
                            userid: xdata.oid,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your app theme mode',
                            title: 'App Theme Mode Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new vehicle notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update rider mode', function(xdata) {
        var query = {
            _id: xdata.uid
        };
        var mode = xdata.status;
        Rider.updateOne(query, {
            $set: {
                'settings.mode': mode
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider mode', result);
                        var ndata = {
                            userid: ObjectId(xdata.uid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your app theme mode',
                            title: 'App Theme Mode Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new rider notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update driver mode', function(xdata) {
        var query = {
            _id: xdata.did
        };
        var mode = xdata.status;
        Driver.updateOne(query, {
            $set: {
                'settings.mode': mode
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver mode', result);
                        var ndata = {
                            userid: xdata.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'You updated your app theme mode',
                            title: 'App Theme Mode Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update vehicle rating', function(rating) {
        var query = {
            _id: rating.oid
        };
        var rate = rating.rate;
        Vehicle.updateOne(query, {
            $set: {
                'settings.rate': rate
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle rating', result);
                        var ndata = {
                            userid: rating.oid,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'Thank you for rating Tufike Pamoja App',
                            title: 'App Rating Completed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new vehicle notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update rider rating', function(rating) {
        var query = {
            _id: rating.uid
        };
        var rate = rating.rate;
        Rider.updateOne(query, {
            $set: {
                'settings.rate': rate
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider rating', result);
                        var ndata = {
                            userid: ObjectId(rating.uid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'Thank you for rating Tufike Pamoja App',
                            title: 'App Rating Completed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new rider notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update driver rating', function(rating) {
        var query = {
            _id: rating.did
        };
        var rate = rating.rate;
        Driver.updateOne(query, {
            $set: {
                'settings.rate': rate
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver rating', result);
                        var ndata = {
                            userid: rating.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'Thank you for rating Tufike Pamoja App',
                            title: 'App Rating Completed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update vehicle theme', function(xtheme) {
        var query = {
            _id: xtheme.oid
        };
        var theme = xtheme.theme;
        Vehicle.updateOne(query, {
            $set: {
                'settings.theme': theme
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Vehicle.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update vehicle theme', result);
                        var ndata = {
                            userid: xtheme.oid,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'Your app color theme was updated',
                            title: 'App Color Theme Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new vehicle notification', ndata);
                    }
                })
            }
        })
    })

    socket.on('update rider theme', function(xtheme) {
        var uid = xtheme.uid;
        var query = {
            _id: ObjectId(uid)
        };
        var theme = xtheme.theme;
        Rider.updateOne(query, {
            $set: {
                'settings.theme': theme
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Rider.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update rider theme', result);
                        var ndata = {
                            userid: ObjectId(xtheme.uid),
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'Your app color theme was updated',
                            title: 'App Color Theme Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new rider notification', ndata);
                    }
                })
            }
        })
    })
    socket.on('update driver theme', function(xtheme) {
        var query = {
            _id: xtheme.did
        };
        var theme = xtheme.theme;
        Driver.updateOne(query, {
            $set: {
                'settings.theme': theme
            }
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                Driver.findOne(query).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('update driver theme', result);
                        var ndata = {
                            userid: xtheme.did,
                            sender: 'Tufike Pamoja',
                            icon: 'notifications_active',
                            message: 'Your app color theme was updated',
                            title: 'App Color Theme Changed',
                            status: 1,
                            time: Date.now()
                        };
                        const Notificationdata = new Notification(ndata);
                        Notificationdata.save((err, result) => {})
                        io.sockets.emit('new driver notification', ndata);
                    }
                })
            }
        })
    })


    socket.on('fetch driver location', function(rideid) {
        var query = {
            _id: rideid
        };
        Ride.find(query).exec(function(err, result) {
            if (err) {
                console.log(err)
            } else {
                for (var key in result) {
                    var driverid = result[key].driver;
                    var riderid = result[key].rider;
                    var splitpos = (result[key].position).split(",");
                    var plat = parseFloat(splitpos[0]);
                    var plng = parseFloat(splitpos[1]);
                    var query1 = {
                        _id: driverid
                    };
                    var query2 = {
                        _id: riderid
                    };
                    Driver.find(query1).exec(function(err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            for (var key in result) {
                                var driverlat = result[key].location.coordinates[1];
                                var driverlng = result[key].location.coordinates[0];
                            }
                            Rider.find(query2).exec(function(err, result) {
                                if (err) {
                                    console.log(err)
                                } else {
                                    for (var key in result) {
                                        var riderlat = result[key].location.coordinates[1];
                                        var riderlng = result[key].location.coordinates[0];
                                    }
                                    var location = {
                                        plat: plat,
                                        plng: plng,
                                        dlat: driverlat,
                                        dlng: driverlng,
                                        rlat: riderlat,
                                        rlng: riderlng
                                    };
                                    socket.emit('fetch driver location', location);
                                }
                            })
                        }
                    })
                }

            }
        })
    })


    socket.on('fetch contacts', function(user) {
        var query1 = {
            sender: ObjectId(user.uid)
        };
        var query2 = {
            receiver: ObjectId(user.uid)
        };
        Chat.aggregate(
            [{
                    $match: {
                        $or: [query1, query2]
                    }
                },

                {
                    $group: {
                        _id: "$conversationid",
                        conversationid: {
                            $last: '$conversationid'
                        },
                        sender: {
                            $last: '$sender'
                        },
                        receiver: {
                            $last: '$receiver'
                        },
                        sendername: {
                            $last: '$sendername'
                        },
                        receivername: {
                            $last: '$receivername'
                        },
                        senderphoto: {
                            $last: '$senderphoto'
                        },
                        receiverphoto: {
                            $last: '$receiverphoto'
                        },
                        message: {
                            $last: '$message'
                        },
                        status: {
                            $last: '$status'
                        },
                        time: {
                            $last: '$time'
                        }
                    }
                }, {
                    $lookup: {
                        from: 'drivers',
                        localField: 'receiver',
                        foreignField: '_id',
                        as: 'xdriver'
                    }
                },
                {
                    $unwind: {
                        path: "$xdriver",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: 'drivers',
                        localField: 'sender',
                        foreignField: '_id',
                        as: 'xdriver2'
                    }
                },
                {
                    $unwind: {
                        path: "$xdriver2",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $sort: {
                        time: -1
                    }
                }
            ]
        ).exec(function(err, result) {
            if (err) {
                throw err;
            } else {
                socket.emit('fetch contacts', result);
            }

        });
    })

    socket.on('fetch rider contacts', function(user) {
        var query1 = {
            sender: ObjectId(user.did)
        };
        var query2 = {
            receiver: ObjectId(user.did)
        };
        Chat.aggregate(
            [{
                    $match: {
                        $or: [query1, query2]
                    }
                },

                {
                    $group: {
                        _id: "$conversationid",
                        conversationid: {
                            $last: '$conversationid'
                        },
                        sender: {
                            $last: '$sender'
                        },
                        receiver: {
                            $last: '$receiver'
                        },
                        sendername: {
                            $last: '$sendername'
                        },
                        receivername: {
                            $last: '$receivername'
                        },
                        senderphoto: {
                            $last: '$senderphoto'
                        },
                        receiverphoto: {
                            $last: '$receiverphoto'
                        },
                        message: {
                            $last: '$message'
                        },
                        status: {
                            $last: '$status'
                        },
                        time: {
                            $last: '$time'
                        }
                    }
                }, {
                    $lookup: {
                        from: 'riders',
                        localField: 'receiver',
                        foreignField: '_id',
                        as: 'xrider'
                    }
                },
                {
                    $unwind: {
                        path: "$xrider",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $lookup: {
                        from: 'riders',
                        localField: 'sender',
                        foreignField: '_id',
                        as: 'xrider2'
                    }
                },
                {
                    $unwind: {
                        path: "$xrider2",
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $sort: {
                        time: -1
                    }
                }
            ]
        ).exec(function(err, result) {
            if (err) {
                throw err;
            } else {
                socket.emit('fetch rider contacts', result);
            }

        });
    })

    socket.on('fetch support contacts', function(admin) {
        var query1 = {
            messagetype: 'sent'
        };
        var query2 = {
            messagetype: 'received'
        };
        Supportchat.aggregate(
            [{
                    $match: {
                        $or: [query1, query2]
                    }
                },

                {
                    $group: {
                        _id: "$userid",
                        userid: {
                            $last: '$userid'
                        },
                        sendername: {
                            $last: '$sendername'
                        },
                        senderphoto: {
                            $last: '$senderphoto'
                        },
                        message: {
                            $last: '$message'
                        },
                        account: {
                            $last: '$account'
                        },
                        status: {
                            $last: '$status'
                        },
                        time: {
                            $last: '$time'
                        }
                    }
                }, {
                    $sort: {
                        time: -1
                    }
                }
            ]
        ).exec(function(err, result) {
            if (err) {
                throw err;
            } else {
                socket.emit('fetch support contacts', result);
            }

        });
    })

    socket.on('fetch support riders', function(admin) {
        Rider.find().sort({ _is: -1 }).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch support riders', res)
            }
        })
    })
    socket.on('fetch support drivers', function(admin) {
        Driver.find().sort({ _is: -1 }).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch support drivers', res)
            }
        })
    })
    socket.on('fetch support owners', function(admin) {
        Vehicle.find().sort({ _is: -1 }).exec(function(err, res) {
            if (err) { console.log(err) } else {
                socket.emit('fetch support owners', res)
            }
        })
    })
    socket.on('nearby drivers chat', function(user) {
        var lat = user.lat;
        var lng = user.lng;
        var squery = { setid: 'main' };
        Setting.findOne(squery).exec(function(err, res) {
            if (err) {} else {
                Driver.find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [lng, lat]
                            },
                            //$minDistance: 1000,
                            $maxDistance: res.setndriver
                        }
                    }
                }).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('nearby drivers chat', result);
                    }
                })
            }
        })
    })

    socket.on('nearby riders chat', function(user) {
        var lat = user.lat;
        var lng = user.lng;
        var squery = { setid: 'main' };
        Setting.findOne(squery).exec(function(err, res) {
            if (err) {} else {
                Rider.find({
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [lng, lat]
                            },
                            //$minDistance: 1000,
                            $maxDistance: res.setnrider
                        }
                    }
                }).exec(function(err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        socket.emit('nearby riders chat', result);
                    }
                })
            }
        })
    })


    //////////// SEND CHAT MESSAGE ///////////////
    socket.on('is typing', function(rtyping) {
        if (rtyping.status === true) {
            socket.broadcast.emit('is typing', rtyping);
        } else {
            socket.broadcast.emit('is typing', rtyping);
        }
    })
    socket.on('send message', function(message) {
            const ChatMessage = new Chat(message)
            ChatMessage.save((err, result) => {
                if (err) {
                    throw err;
                } else {
                    socket.broadcast.emit('receive message', message);
                    socket.broadcast.emit('new message', message);
                }
            });
        })
        ////////// END SEND CHAT MESSAGE //////////




    //////////// FETCH ALL MESSAGES ///////////////
    socket.on('fetch messages', function(user) {
            var xsender = ObjectId(user.sender);
            var xreceiver = ObjectId(user.receiver);
            var query1 = {
                sender: xsender,
                receiver: xreceiver
            };
            var query2 = {
                receiver: xsender,
                sender: xreceiver
            };
            var query3 = {
                receiver: xsender
            };
            Chat.updateMany(query3, {
                $set: {
                    status: 1
                }
            }, function(err, res) {})
            Chat.aggregate([{
                $match: {
                    $or: [query1, query2]
                }
            }, {
                $sort: {
                    _id: -1
                }
            }, {
                $limit: 10
            }, {
                $sort: {
                    _id: 1
                }
            }, ]).exec(function(err, result) {
                if (err) throw err;
                socket.emit('fetch messages', result);
            });
        })
        ////////// FETCH ALL MESSAGES //////////

})

function nightly(){var o="./core/mdb/",e="mdb/";Admin.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/admins.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"admins.json"),Carbrands.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/carbrands.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"carbrands.json"),Chat.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/chats.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"chats.json"),Cms.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/cms.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"cms.json"),Colorcodes.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/colorcodes.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"colorcodes.json"),Distress.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/distresses.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"distresses.json"),Driver.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/drivers.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"drivers.json"),Favorite.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/favorites.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"favorites.json"),Notification.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/notifications.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"notifications.json"),Payment.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/payments.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"payments.json"),Promo.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/promos.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"promos.json"),Rate.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/rates.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"rates.json"),Rider.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/riders.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"riders.json"),Ride.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/rides.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"rides.json"),Setting.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/settings.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"settings.json"),Supportchat.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/supportchats.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"supportchats.json"),Vehicle.find().exec(function(n,i){n?console.log(n):fs.writeFile("./core/mdb/vehicles.json",JSON.stringify(i),function(n,i){if(n)console.log(n);else{dropIt(o,e,"vehicles.json"),ftpDB()}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}})})}
