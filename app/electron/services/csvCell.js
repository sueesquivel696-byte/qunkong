const e=/^[=+\-@\t\r\n]/;function r(n){let t=n==null?"":String(n);return e.test(t)&&(t=`'${t}`),`"${t.replace(/"/g,'""')}"`}module.exports={csvCell:r};
