/*! Copyright 2013 Amazon Digital Services, Inc. All rights reserved. */
ElementsUtility=(function(){return{getElement:function(e,h,f){if(elementStore===undefined||elementStore===null){return e}var i="enUS";var g=arguments;var d=h+f;var a=elementStore[d];if(a===undefined||a===null){a=elementStore[i]}if(a===undefined||a===null){return e}var c=a[e];if(!c){c=e}else{if(typeof g[3]==="object"){var b=g[3];c=c.replace(/\$\{(\w+?)\}/g,function(k,m){var l=b[m],j=typeof l==="undefined";return !j?l:k})}else{if(g.length>3){c=c.replace(/\$\{([1-9]+?)\}/g,function(k,m){var l=g[parseInt(m,10)+2],j=typeof l==="undefined";return !j?l:k})}}}return c}}}());