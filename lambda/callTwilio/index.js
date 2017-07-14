'use strict';

let AWS = require('aws-sdk');

let polly = new AWS.Polly({region: 'us-east-1'});

let bucket = "refreshd-twilio";
let s3bucket = new AWS.S3({params: {Bucket: bucket}});


exports.handler = (event, context, callback) => {


    let inputmessages = event.message;

    let phonenumber = event.phonenumber;
    let voice = "female";

    let pollyvoice;
    if (voice === 'female') {
        voice = 'woman';
        pollyvoice = 'Nicole'
    } else {
        voice = 'man';
        pollyvoice = 'Russell'
    }

    let numberofmessages = inputmessages.length;
    const msgstart = `<speak>Hello, this is ${pollyvoice}, your virtual care assistant. <prosody rate="slow" pitch="+15%">I have ${numberofmessages} reminders for you. `;

    let index, len;
    let messages = "";
    let msgmiddle = "";
    let pollymessage = "";
    let msg = inputmessages[0];
    let msgend = "";

    if (numberofmessages === 1) {
        //only one message then complete message
        //msgend = `Your reminder is, ${msg} <break time="1s"/></prosody> Would you like to listen to your reminder again?</speak><Record action="${recordactionurl}" timeout="2" playBeep="false"/>`;
        msgend = `Your reminder is, ${msg} <break time="1s"/></prosody> Thankyou, goodbye</speak>`;
        pollymessage = msgstart + msgend;
    } else {
        for (index = 0, len = inputmessages.length; index < len; ++index) {

            if (index === 0) {
                msgmiddle += `Your first reminder is ${inputmessages[index]}. `;
            } else {
                if (index === len - 1) {
                    msgmiddle += `Your last reminder is ${inputmessages[index]}. `;
                } else {
                    msgmiddle += `Your next reminder is ${inputmessages[index]}. `;
                }
                //msgend = `<break time="1s"/></prosody> Would you like to listen to your reminders again?</speak><Record action="${recordactionurl}" timeout="2" playBeep="false"/>`;
                msgend = `<break time="1s"/></prosody> Thankyou, goodbye</speak>`;
            }
        }
        pollymessage = msgstart + msgmiddle + msgend;
        console.log(pollymessage);
    }

    let params = {
        OutputFormat: "mp3",
        Text: pollymessage,
        TextType: "ssml",
        VoiceId: pollyvoice
    };


    polly.synthesizeSpeech(params, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            let recordingtime = new Date().getTime();
            let recordingfilename = recordingtime + "-" + phonenumber.substring(1) + ".mp3";
            const params = {
                Bucket: bucket,
                ACL: 'public-read',
                Key: recordingfilename,
                Body: data.AudioStream,
                ContentType: 'audio/mpeg'
            };
            s3bucket.upload(params, (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(data.Location);

                    const response = `<?xml version="1.0" encoding="UTF-8"?><Response><Play>${data.Location}</Play></Response>`;

                    let time = new Date().getTime();
                    let s3filename = time + "-" + phonenumber.substring(1) + ".xml";

                    let params = {
                        Key: s3filename,
                        Body: response,
                        ContentType: "application/xml"
                    };
                    s3bucket.upload(params, function (err, res) {
                        if (err)
                            console.log("Error in uploading file on s3 due to " + err)
                        else
                            console.log("File successfully uploaded.")
                        //Need to reutrn the URL form the res
                        console.log(res.Location);

                        const twilio = require('twilio');
                        const accountSid = 'xxxxxxx';
                        const authToken = 'xxxxxxx';
                        const twilionumber = '+123456';
                        const client = new twilio(accountSid, authToken);
                        client.calls.create({
                            url: res.Location,
                            method: 'GET',
                            to: phonenumber,
                            from: twilionumber
                        }, function (err, call) {
                            console.log(call.sid);
                        });
                    });
                }
            });
        }
    });
};