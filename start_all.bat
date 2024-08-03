@echo off
cd /d %~dp0
call npm install
start cmd /k "npm start"