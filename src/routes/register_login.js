const UserModel = require('../models/M_register_login');
const {createTokens, validateToken}= require('../services/JWTauth');
const jwt = require('jsonwebtoken')
const cookie = require('cookie');
const dotenv = require('dotenv');
dotenv.config();

require('../../global.js');

// const invalidatedTokens = new Set();

function register_rentee(req, res) {
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        let requestData = {};
        try {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const parsedData = new URLSearchParams(stringData);
            for (var pair of parsedData.entries()) {
                requestData[pair[0]] = pair[1];
            }
            // console.log("DataObj: ", requestData);

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
            return;
        }
        // console.log(requestData)
        UserModel.registerrentee(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'User Registered Successfully' }));
            }
          });
    });
}

function register_renter(req, res) {
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        let requestData = {};
        try {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const parsedData = new URLSearchParams(stringData);
            for (var pair of parsedData.entries()) {
                requestData[pair[0]] = pair[1];
            }
            // console.log("DataObj: ", requestData);

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
            return;
        }
        // console.log(requestData)
        UserModel.registerrenter(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'User Registered Successfully' }));
            }
          });
    });
}

function login_user(req, res) {
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        let requestData = {};
        try {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const parsedData = new URLSearchParams(stringData);
            for (var pair of parsedData.entries()) {
                requestData[pair[0]] = pair[1];
            }
            // console.log("DataObj: ", requestData);

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
            return;
        }
        // console.log(requestData)
        UserModel.login_verify(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else if (typeof(result)=="string") {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: result }));
            } else{
                const accessToken=createTokens(result[0])
                res.setHeader('Set-Cookie', `access_token=${accessToken};Max-Age=604800;httpOnly=true`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Login Success" }));
            }
            
          });
    });
}

function logout_user(req, res) {
    const user_id=validateToken(req.headers.cookie)
    if (user_id!=false){
        const cookies = cookie.parse(req.headers.cookie);
        const accessToken = cookies.access_token;
        invalidatedTokens.add(accessToken);
        res.setHeader('Set-Cookie', `access_token=NulL;Max-Age=1;httpOnly=true`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Logged Out Success" }));
    }
    else{
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
    }
}
module.exports = {register_rentee,register_renter,login_user,logout_user};