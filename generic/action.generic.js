'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('underscore');

var _helpers = require('../../node_modules/ava-ia/lib/helpers');


exports.default = function (state) {

	return new Promise(function (resolve, reject) {

		for (var rule in Config.modules.generic.rules) {
			  var match = (0, _helpers.syntax)(state.sentence, Config.modules.generic.rules[rule]);
			  if (match) break;
		}

		 setTimeout(function(){
			if (match) {
				if (state.debug) info('ActionGeneric'.bold.yellow, 'action:', rule.yellow);
				var room;

				if (state.rawSentence.toLowerCase().indexOf('tous') != -1 || state.rawSentence.toLowerCase().indexOf('tout') != -1) {
					room = 'all';
				}

				if (!room) {
					var clients = Avatar.Socket.getClients();
					room = _.find(clients, function(client){
							return state.rawSentence.toLowerCase().indexOf(client.id.toLowerCase()) != -1 && state.rawSentence.toLowerCase().indexOf(Avatar.currentRoom.toLowerCase()) == -1;
						});

					if (room) {
						room = room.id;
					} else {
            room = Avatar.ia.clientFromRule(state.rawSentence);
          }
				}

				state.action = {
					module: 'generic',
					command: rule,
					room: room
				};

				resolve(state);

			}

		}, 500);
	});
};
