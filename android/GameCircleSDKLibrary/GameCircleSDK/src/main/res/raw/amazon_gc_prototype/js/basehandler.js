/*! Copyright 2013 Amazon Digital Services, Inc. All rights reserved. */
var BaseHandler=(function(){var a=function(){};a.handleRequest=function(d){var b;if(!(d instanceof Request)){console.log("handleRequest: input was not of type Request");b=$.Deferred();b.resolve(new Result(constants.NativeCallResultCode.REQUEST_ERROR,{}));return b}console.log("handleRequest: message type is "+JSON.stringify(d.getType()));var e=d.getParams();var c=e.action;if(this[c]==null){console.log("handleRequest: actionCode not supported: "+c);b=$.Deferred();b.resolve(new Result(constants.NativeCallResultCode.REQUEST_ERROR,{}));return b}return this[c](e)};return a})();console.log("BaseHandler loaded.");