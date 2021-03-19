const PORT = process.env.PORT || 5000;
var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var morgan = require("morgan");
var jwt = require('jsonwebtoken');
var http = require("http");
var path = require('path')
const admin = require("firebase-admin");
const fs = require('fs')
const multer = require('multer')
var { userModel, productmodel } = require("./dbrepo/models");

var { SERVER_SECRET } = require("./core/index");

var authRoutes = require("./routes/auth");

var app = express();

var server = http.createServer(app);



app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(morgan('dev'));


app.use("/", express.static(path.resolve(path.join(__dirname, "front-end/build"))))

app.use('/auth', authRoutes);

app.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);

    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; // 84600,000

            if (diff > 300000) { // expire after 5 min (in milis)
                res.send({
                    message: "TOKEN EXPIRED",
                    status: 401
                });
            } else { // issue new Token
                var token = jwt.sign({
                    id: decodedData.id,
                    name: decodedData.name,
                    email: decodedData.email,
                    phone: decodedData.phone,
                    role: decodedData.role
                }, SERVER_SECRET)

                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                req.headers.jToken = decodedData
                next();
            }
        } else {
            res.send({
                message: "Invalid Token",
                status: 401
            });
        }


    });

});

app.get("/profile", (req, res, next) => {
    console.log(req.body);

    userModel.findById(req.body.jToken.id, 'name email phone createdOn role', function (err, doc) {
        if (!err) {
            res.send({
                status: 200,
                profile: doc
            })

        } else {
            res.send({
                message: "Server Error",
                status: 500
            });
        }
    });
})



// This code is only for upload cart
// This code is only for upload cart
// This code is only for upload cart
// This code is only for upload cart
// This code is only for upload cart
// This code is only for upload cart
// This code is only for upload cart
// This code is only for upload cart

const storage = multer.diskStorage({
    destination: './upload/',
    filename: function (req, file, cb) {
        cb(null, `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`)
    }
})
var upload = multer({ storage: storage })




var SERVICE_ACCOUNT = {
    "type": "service_account",
    "project_id": "infinity-taste",
    "private_key_id": "7cb03068179121c1063d27513ac3b0c328dcea34",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXI86EUhRJrvcr\nK19OjsUq/SjTtVui96Uj2b1e+e+qQtwJluiWPny6v2HdoWuHQKLixW5psmyYbr7k\nYur/RHR4ExB+5bURZycHpYmE/wbs5NRNrlyycq6sOnPySCFFTempXVf3FJs0ZQJ4\nBbOHvdvLbjMWSGYVdfyeDBRvdz4BtN5bjHHDsi/FoXuFGbB4rCTsa/XCPYvJ8zJp\nf87lAwBmkaI/7/Kip9rzBhHb/+i3VYxnNJenMXAhax2uUsSh0DYCATO/EJvTmvM0\nI8uxH2H9aAGfN3NoAqXP4JpCdkWWxOVQgFF2vnZZuWFIPiR94uFmGE4gg2/pqn86\nBT4u9E+PAgMBAAECggEAEcthcSrIwLQc3bRJkFI23IzZ1bMwistlYgcsyJXcpcsh\nZO+jiqzouoP13cY3hsERbGmaSk97gaboSrNqv4sru0djVc1tuBLRAZF303TDN/jp\nFgxFVa0y64wmQoxDfolhzVL0HF8Mtup9k+v36y9rRVRAJ4t2mWg+yczaSxVa85BN\nhJgPTWhWdRemkbqTfzGA2XGZwEpPr7tq1u5uz+5IvyBInwyoUPKNvh/yL3cveQAc\n/lOuWEQ5Jqcu27WJhjLquqBcMX0T+w6/4Yf5gQpcePwmsA+8Eca+74/nVxD9Ocl2\ngYpQJK8f/3XBWmCfW439P/fWwUzp0Jy3ijT9YlOR4QKBgQDRhWUpoa2kk0p84zPt\n1n21Ss4whpo4VgWj6wzBbQKoWXW9tGlmHYAr8pmiqvTlUeQuNr+CX18q4/AtPwFS\nyGACX+8bcv4LILr0uRauJ2pPD4/tbxTuJFLjAff6u4sdjiQowpomQ/AAoXtPIr8f\nCSPIJ4mB5C30hr2ZCLMYsBT5bQKBgQC4qvhOMFzNG0+S9TPA+3Z/MYbWji6sby4a\nBzuFfnfC+D02Lz+zv9nTV48Pyq1ats7+9FEYmZ53T0Cg+kDylomEzRlu5XHNm9NJ\n++ssXi64TxnIIy510dwQGTHIkahCnda9hC8apJB2CDWM5mSN4JiV7ZFclnSyzyI+\nezk1133rawKBgQC48iE8QIVAsuublgrutNk+QIwFdauIcxaDfSZDT3B7Hoy6Khin\nlP7gzEMlvfZyvnjG+njOIlWlTJNjvSvz4QAu2HP+LOFm/TtKbl9A13YV18zab6Vw\nGQw5ajF1WDsSmbf9atobUPj39ZMdZbSDNtQpCA1vZPXT1WRjQ7Sj5Dp/eQKBgAQ0\n+OUnGuYdSinJ5jzuPZvWMAExSgTpn34+Te/TmrzZVOOoHeZlZ3v2Ea9Fab+YTIzo\nWfSag06qgoloShR8s3NQDNVG6tnJQ/36fDgNiTjvrGGv034hosbHHCg6kT+7Qsoc\neco8l4Ho2/dyxDWrOS6pM9eNIel06I3N1tbQKvEzAoGACRPEXKf+vIVAR4qcFstk\nEJjgCUqVucSEmurqjhWXG+CdgOmOo5264mWJzkz1hIPPJijMfWFVRzMhT+JQZVTM\nHVD32ecUirM6u3RPfkJR2LQA9GfPp4CRposzS3YGJ8j37TDGRkA+4bBHoMdGxTM9\nOilPT+ymjidh9hTmfbC4qjQ=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-kv9sp@infinity-taste.iam.gserviceaccount.com",
    "client_id": "118243715814975574793",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kv9sp%40infinity-taste.iam.gserviceaccount.com"
}







admin.initializeApp({
    credential: admin.credential.cert(SERVICE_ACCOUNT),
    DATABASE_URL: "https://infinity-taste-default-rtdb.firebaseio.com/"
});



const bucket = admin.storage().bucket("gs://infinity-taste.appspot.com");

//==============================================

app.post("/admindashboard", upload.any(), (req, res, next) => {

    bucket.upload(
        req.files[0].path,

        function (err, file, apiResponse) {
            if (!err) {
                console.log("api resp: ", apiResponse);

                file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then((urlData, err) => {

                    if (!err) {
                        // console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 
                        console.log(req.body.email)
                        console.log(req.body.avalablity)
                        console.log("headerskdflasfjks ka data  ===================>>>>> ", req.headers.jToken.id)
                        console.log("headerskdflasfjks request headers  ===================>>>>> ", req.headers)
                        userModel.findById(req.headers.jToken.id, 'email role', (err, users) => {
                            console.log("Adminperson ====> ", users.email)

                            if (!err) {
                                productmodel.create({
                                    "title": req.body.title,
                                    "price": req.body.price,
                                    "availability": req.body.avalablity,
                                    "cartimage": urlData[0],
                                    "description": req.body.description
                                })
                                    .then((data) => {
                                        console.log(data)
                                        res.send({
                                            status: 200,
                                            message: "Product add successfully",
                                            data: data
                                        })

                                    }).catch(() => {
                                        console.log(err);
                                        res.status(500).send({
                                            message: "Not added, " + err
                                        })
                                    })
                            }
                            else {
                                res.send({
                                    message: "error"
                                });
                            }
                        })
                        try {
                            fs.unlinkSync(req.files[0].path)
                            //file removed
                        } catch (err) {
                            console.error(err)
                        }
                    }
                })
            } else {
                console.log("err: ", err)
                res.status(500).send();
            }
        });
})




server.listen(PORT, () => {
    console.log("Server is Running:", PORT);
});