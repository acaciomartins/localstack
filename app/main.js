'use strict';

const AWS = require('aws-sdk');
const LOCALSTACK_HOSTNAME = process.env.LOCALSTACK_HOSTNAME;
const ENDPOINT = `http://${LOCALSTACK_HOSTNAME}:4566`;
if (LOCALSTACK_HOSTNAME) {
    process.env.AWS_SECRET_ACCESS_KEY = 'test'
    process.env.AWS_ACCESS_KEY_ID = 'test'
}

const QUEUE_NAME = 'my-queue';
const CLIENT_CONFIG = LOCALSTACK_HOSTNAME ? {endpoint: ENDPOINT} : {};

const headers = {
    'content-type': 'application/json',
    'Access-Control-Allow-Headers' : 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  };

  
const connectSQS = () => new AWS.SQS(CLIENT_CONFIG);

exports.handler = function (event, context, callback) {
    startNewRequest(event);
    var response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
        body: "Hello world! :)",
    };
    callback(null, response);
};

const startNewRequest = async (event) => {
    console.log('event', event);
    const requestID = '5555';
    const status = 'QUEUED';
    // put message onto SQS queue
    const sqs = connectSQS();
    const message = {'requestID': requestID};
    const queueUrl = (await sqs.getQueueUrl({QueueName: QUEUE_NAME}).promise()).QueueUrl;
    let params = {
        MessageBody: JSON.stringify(message),
        QueueUrl: queueUrl
    };
    await sqs.sendMessage(params).promise();

    const body = JSON.stringify({
        requestID,
        status
    });
    return {
        statusCode: 200,
        headers,
        body
    };
};