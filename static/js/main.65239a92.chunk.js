(this.webpackJsonpcounter=this.webpackJsonpcounter||[]).push([[0],{16:function(e,n,t){e.exports=t(17)},17:function(e,n,t){"use strict";t.r(n);var a=t(1),r=(t(18),t(14)),c=t.n(r),u=t(0),o=t.n(u),l=t(15),i=t.n(l),s=c()({notify:function(e){var n=e.isUncaught,t=e.isFriendly,a=e.userMsg;e.productionMsg;n?alert("ERROR - ".concat(a)):t&&alert("WARNING - ".concat(a))}}).createData,h=s("React",o.a),m=h.memo,f=h.useState,d=h.useEffect,E=h.useMemo,g=s("ReactDOM",i.a).render,v=s("showing counter",m((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.count,t=void 0===n?0:n,a=e.delay,r=void 0===a?1e3:a,c=e.handleOnChange,u=e.handleOnClick;return o.a.createElement(o.a.Fragment,null,o.a.createElement("h1",null,"Counter: ",t),o.a.createElement("label",null,"Delay:",o.a.createElement("input",{type:"text",value:r,onChange:c})),o.a.createElement("button",{onClick:u},"Reset"))})),(function(){return o.a.createElement("h1",null,"Error with the counter")})),p=s("using counter",(function(){var e=f(0),n=Object(a.a)(e,2),t=n[0],r=n[1],c=f(1e3),u=Object(a.a)(c,2),l=u[0],i=u[1],h=E((function(){return s("Event handlers",[function(e){i(e.target.value)},function(){r(0)}])}),[r,i]),m=Object(a.a)(h,2),g=m[0],p=m[1];return d((function(){var e=s("Ticking the timer",(function(){r(t+1)})),n=setTimeout(e,l);return function(){return clearTimeout(n)}}),[t,l]),o.a.createElement(v,{count:t,delay:l,handleOnChange:g,handleOnClick:p})}),(function(){return o.a.createElement(v,null)})),O=document.getElementById("root");g(o.a.createElement(p,null),O)},18:function(e,n,t){}},[[16,1,2]]]);
//# sourceMappingURL=main.65239a92.chunk.js.map