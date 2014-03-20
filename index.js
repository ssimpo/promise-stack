'use strict';

var Q = require('q');

var QQ = function QQ() {
	var deferred = Q.defer();
	var promiseStack = [];
	var promiseDone = 0;
	
	var construct = {
		add: function(promise) {
			var stackObject = createStackObject(promise);
			
			promise.fin(function(){
				if (!stackObject.resolved) {
					stackObject.resolved = true;
					promiseDone++;
					if (promiseDone >= promiseStack.length) {
						deferred.resolve();
					}
				}
			});
			
			promiseStack.push(stackObject);
		},
		
		count: function() {
			return promiseStack.length;
		},
		
		defer: function(){
			var deferred = Q.defer();
			construct.add(deferred.promise);
			return deferred;
		},
		
		all: function(promises){
			var all = Q.all(promises);
			construct.add(all);
			return all;
		},
		
		allSettled: function(promises){
			var all = Q.all(promises);
			construct.add(all);
			return all;
		},
		
		nfcall: function(){
			var args = convertArgumentsToArray(arguments);
			var nodeFunc = args.shift();
			var promise = Q.nfapply(nodeFunc, args);
			construct.add(promise);
			return promise;
		},
		
		nfapply: function(nodeFunc, args){
			var promise = Q.nfapply(nodeFunc, args);
			construct.add(promise);
			return promise;
		},
		
		then: function(resolved, progress, rejected){
			return deferred.promise.then(resolved, progress, rejected);
		},
		
		fin: deferred.promise.fin
	};
	
	return construct;
}

function convertArgumentsToArray(args) {
	var argArray = [];
	
	for (var i = 0; i < args.length; i++) {
		argArray.push(args[i]);
	}
	
	return argArray;
}

function createStackObject(promise) {
	return {
		'resolved': false,
		'promise': promise
	};
}

module.exports = QQ;