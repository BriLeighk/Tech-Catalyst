import { Buffer } from 'buffer';
import process from 'process';
import stream from 'stream-browserify';
import crypto from 'crypto-browserify';
import assert from 'assert';
import http from 'stream-http';
import https from 'https-browserify';
import os from 'os-browserify/browser';
import url from 'url/';

window.Buffer = Buffer;
window.process = process;
window.stream = stream;
window.crypto = crypto;
window.assert = assert;
window.http = http;
window.https = https;
window.os = os;
window.url = url;