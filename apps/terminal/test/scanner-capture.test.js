import test from'node:test';
import assert from'node:assert/strict';
import{createScannerCapture}from'../scanner-capture.js';

const input=()=>({value:'',dataset:{},dispatchEvent(){this.changed=true}});
test('slow/manual input cannot verify a terminal scanner field',()=>{const scanner=createScannerCapture(),target=input();scanner.arm(target);let at=0;for(const key of'C-IRAN-1')scanner.handle({key,isTrusted:true,timeStamp:at+=200});scanner.handle({key:'Enter',isTrusted:true,timeStamp:at+10});assert.equal(target.value,'');assert.equal(scanner.isVerified(target),false)});
test('a rapid trusted terminal scanner burst plus Enter is accepted',()=>{const scanner=createScannerCapture(),target=input();scanner.arm(target);let at=0;for(const key of'C-IRAN-1')scanner.handle({key,isTrusted:true,timeStamp:at+=10});assert.equal(scanner.handle({key:'Enter',isTrusted:true,timeStamp:at+10}),true);assert.equal(target.value,'C-IRAN-1');assert.equal(scanner.isVerified(target),true)});
test('synthetic key events can never verify a terminal scanner field',()=>{const scanner=createScannerCapture(),target=input();scanner.arm(target);for(const key of'C-IRAN-1')scanner.handle({key,isTrusted:false,timeStamp:10});scanner.handle({key:'Enter',isTrusted:false,timeStamp:20});assert.equal(scanner.isVerified(target),false)});
