const{ipcMain:e}=require("electron");function a(t){e.handle("get-app-auth-status",()=>t.getStatus()),e.handle("login-app-auth",(i,n)=>t.login(n))}module.exports={registerAppAuthHandlers:a};
