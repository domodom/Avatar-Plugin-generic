let cyto;

const {Graph} = require('cyto-avatar');
const {remote} = require('electron');
const {Menu, BrowserWindow} = remote;
const _ = require('underscore');
const fs = require ('fs-extra');

var lockRoom;

const nodeType = "speaker";

exports.addPluginElements = function(CY) {
    cyto = new Graph(CY, __dirname);
    cyto.loadAllGraphElements()
      .then(elems => {
        elems.forEach(function(ele) {
          if (ele.hasClass(nodeType)) {
            cyto.onClick(ele, (evt) => {
                showContextMenu(evt);
              })
              .then(elem => cyto.onRightClick(elem, (evt) => {
                showContextMenu(evt);
              }))
          }
        })
      })
      .catch(err => {
        warn('Error loading Elements', err);
      })
}

// Sauvegarde les modules (nodes) à la fermeture du serveur
exports.onAvatarClose = function(callback) {
  cyto.saveAllGraphElements(nodeType)
  .then(() => {
    callback();
  })
  .catch(err => {
    if (debug) warn('Error saving Elements', err)
    callback();
  })
}

exports.action = function(data, callback){

	var tblCommand = {
		restart: function() {
			if (data.action.mobile) {
				data.action.room = setClient(data);
			}

			if (data.action.room) {
				var room;
				var clients = Avatar.Socket.getClients();
				var to = _.filter(clients, function(num){
					switch ((data.action.room).toLowerCase()) {
					case 'toutes les pieces':
					case 'toutes les pièces':
					case 'all':
						return  num.id;
						break;
					case 'piece courante':
					case 'pièce courante':
					case 'current':
						if (num.id == data.client && !Avatar.isMobile(data.client))
									room = num.id;

						if (num.id == data.client && Avatar.isMobile(data.client))
									room = Avatar.currentRoom;

						if (!Avatar.isMobile(data.client))
							return  num.id == data.client;
						else
							return  num.id == Avatar.currentRoom;
						break;
					default:
						if (data.action.room == num.id) room = num.id;
						return  data.action.room == num.id;
					}
				});

				if (!to || to.length == 0) {
					return Avatar.speak("Ce client n'est pas connecté", data.client, function() {
						Avatar.Speech.end(data.client);
					});
				}

				var tts = (room) ? 'la pièce ' + room : 'toutes les pièces';
				Avatar.speak('Je redémarre ' + tts, data.client, function() {
					// Si c'est la pièce courante, je passe 'end' pour arreter le listen en boucle si actif et remettre le son des periphs
					var option = (data.action.room == 'current') ? 'end' : true;

					Avatar.Speech.end(data.client, option, function() {

						_.map(to, function(num) {
							if (!Avatar.isMobile(num.id))
								Avatar.Socket.getClientSocket( num.id).emit('restart');
						});

					});
				});
			} else {
				Avatar.speak('Je suis désolé. Je n\'ai pas compris le nom de la pièce', data.client, function() {
					Avatar.Speech.end(data.client);
				});
			}
		},
		intercom : function() {

			if (data.action.room) {
			    var room;
				var clients = Avatar.Socket.getClients();
				var to = _.filter(clients, function(num){
					switch (data.action.room) {
					case 'all':
						return  num.id;
						break;
					case 'current':
						if (num.id == data.client) room = num.id;
						return  num.id == data.client;
						break;
					default:
						if (data.action.room == num.id) room = num.id;
						return  data.action.room == num.id;
					}
				});

				if (!to)
					return Avatar.speak('Je suis désolé. Je n\'ai pas compris le nom de la pièce', data.client, function() {
						Avatar.Speech.end(data.client);
					});

				var tts = (room) ? 'la pièce ' + room : 'toutes les pièces';
				Avatar.speak('Intercom avec ' + tts + '. Je t\'écoute...', data.client, function() {
					_.map(to, function(num) {
						Avatar.Socket.getClientSocket(data.client).emit('intercom', num.id);
					});
				});

			} else {
				Avatar.speak('Je suis désolé. Je n\'ai pas compris le nom de la pièce', data.client, function() {
					Avatar.Speech.end(data.client);
				});
			}
		},
		isConnected : function() {
			var clients = Avatar.Socket.getClients();
			var tts;

			if (clients) {
				_.map(clients, function(client) {
					tts = (tts) ? tts + ', ' + client.id : client.id;
				});

				tts = tts + " connecté";
			} else
				tts = 'il n\'y a aucun client de connecté';

			Avatar.speak(tts, data.client, function() {
				Avatar.Speech.end(data.client);
			});
		},
		currentRoom : function() {
			if (!lockRoom) {
				var client;
		    if (data.action.mobile)
					client = setClient(data);
				else // Keep compatibilty with virtual client
					client =  data.action.client;

				info ('Current room from sensor:', client);
				Avatar.currentRoom = client;

				// Avatar 3.0
				if (Config.interface)
					Avatar.Interface.setCurrentRoom(client);

			} else {
				info ('Current room switch is locked');
			}
		},
		lockRoom: function () {
			var client = setClient(data);

			if (client != 'current') {
				var clients = Avatar.Socket.getClients();
				var ex = _.find(clients, function(num){
						return num.id.toLowerCase()  == client.toLowerCase() ;
				});
				if (!ex) {
					ex = _.find(Config.default.mapping, function(num){
			      return num.split(',')[0].toLowerCase() == client.toLowerCase();
			    });
				}
				if (!ex) {
					if (!data.action.mobile) {
						return Avatar.speak('La pièce ' + client + 'n\'existe pas', data.client, function() {
							Avatar.Speech.end(data.client);
						});
					} else {
						return warn('La pièce ' + client + ' n\'existe pas')
					}
				}
			}

			Avatar.currentRoom = (client != 'current') ? client : data.client;
			info (client, 'est maintenant verrouillé');
			lockRoom = true;

			// Avatar 3.0
			if (Config.interface)
				Avatar.Interface.setCurrentRoom((client != 'current') ? client : data.client);

			if (!data.action.mobile) {
				Avatar.speak('j\'ai verrouillé la pièce ' + ((client != 'current') ? client : data.client), data.client, function() {
					Avatar.Speech.end(data.client);
				});
			}
		},
		unlockRoom: function () {
			info ('Unlock locked room');
			lockRoom = false;
			if (!data.action.mobile) {
				Avatar.speak('j\'ai liberé les capteurs de présences', data.client, function() {
					Avatar.Speech.end(data.client);
				});
			}
		},
		getCurrentRoom : function() {
			var tts = Avatar.currentRoom + " est la pièce courante";
			Avatar.speak(tts, data.client, function() {
				Avatar.Speech.end(data.client);
			});
		},
		listen: function() {
			var client = setClient(data);

			var socketClient = Avatar.Socket.getClientSocket(client);
			if (!socketClient)
				return info ('Start listenning', 'room:', client, "Le client n'existe pas");

			socketClient.emit('start_listen');
			Avatar.Interface.unmuteIcon(client);

			var jsonClient = fs.readJsonSync('./resources/core/muteClient.json', 'utf-8', (err) => {
			  if (err) throw err;
			  info('Le fichier muteClient.json n\'existe pas');
			});
			jsonClient[client] = false;
			fs.writeFileSync('./resources/core/muteClient.json', JSON.stringify(jsonClient, null, 4), 'utf8');

		},
		stop_listen: function() {
			var client = setClient(data);

			var socketClient = Avatar.Socket.getClientSocket(client);
			if (!socketClient)
				return info ('Stop listenning', 'room:', client, "Le client n'existe pas");

			socketClient.emit('stop_record');
		},
		muteOnOff : function() {
			var client = data.client;
			if (data.action.room)
				client = data.action.room;

			// 1: mute  0: unmute
			Avatar.runApp('%CD%/nircmd/nircmd', 'mutesysvolume ' + data.action.set, client);
			info ('mute/unmute speaker', 'room:', client);
		},
		muteOnOffClient : function() {

			var client = setClient(data);

			if (client == 'current') client = data.client;
			var clients = Avatar.Socket.getClients();
			var jsonClient = fs.readJsonSync('./resources/core/muteClient.json', 'utf-8', (err) => {
			  if (err) throw err;
			  info('Le fichier muteClient.json n\'existe pas');
			});


			var socketClient = Avatar.Socket.getClientSocket(client);

			if (!data.action.set) { data.action.set = '0' }
			if (socketClient) {
				// 1: mute  0: unmute
				Avatar.Socket.getClientSocket(client).emit('listen', { 'listen' : (data.action.set == '1') ? true : false } );

				// Affichage icone sur l'interface Serveur & recupération valeur lors du redémarrage du serveur
				if (data.action.set != '1') {
						addSpeakerGraph(client, data.action.set);
						jsonClient[client] = true;
						fs.writeFileSync('./resources/core/muteClient.json', JSON.stringify(jsonClient, null, 4), 'utf8');
			}
			else {
						addSpeakerGraph(client, data.action.set);
						jsonClient[client] = false;
						fs.writeFileSync('./resources/core/muteClient.json', JSON.stringify(jsonClient, null, 4), 'utf8');
			}
				info ('mute/unmute micro', 'room:', client);
			} else
				info ('mute/unmute micro', 'room:', client, "Le client n'existe pas");
		},

		set_speaker : function() {

			var client = setClient(data);
			var value;
			var setValue;

			// Client mobile like Android
			if (data.action.mobile) {
				// Back to 0 first
				setValue = data.action.set;
				value = parseInt(data.action.set) * 660;
				if (client.toLowerCase() != 'server') {

					var socketClient = Avatar.Socket.getClientSocket(client);
				    if (!socketClient)
						return error ('Increase/Decrease speaker', 'room:', client, "Le client n'existe pas");

					Avatar.runApp('%CD%/nircmd/nircmd', 'changesysvolume -66000', client, function() {
						// Set volume to value
						setTimeout(function(){
							Avatar.runApp('%CD%/nircmd/nircmd', 'changesysvolume ' + value, client);
							info ('Increase/Decrease speaker volume:', setValue, 'room:', client);
						}, 500);
					});
				} else {
					var exec = require('child_process').exec;
					var path = require('path');
					var webroot = path.resolve(__dirname);
					var nirCmd = webroot + '/nircmd/nircmd changesysvolume ';

					var cmd = nirCmd + '-66000';
					exec(cmd, function (err, stdout, stderr) {
						if (err) {
							return error('Increase/Decrease speaker volume on Server:', err || 'Unable to Increase/Decrease speaker volume on Server');
						}
						var cmd = nirCmd + value;
						exec(cmd, function (err, stdout, stderr) {
							if (err) {
								return error('Increase/Decrease speaker volume on Server:', err || 'Unable to Increase/Decrease speaker volume on Server');
							}
							info ('Increase/Decrease speaker volume:', setValue, 'room:', client);
						});
					});
				}
			} else {
				if (data.action.set != 'default') {
					//1800 = pas de 2

					switch (data.action.set) {
						case 'submin':
							value = '-1800';
							break;
						case 'addmin':
							value = '1800';
							break;
						case 'submax':
							value = '-9000';
							break;
						case 'addmax':
							value = '9000';
							break;
					}

					Avatar.runApp('%CD%/nircmd/nircmd', 'changesysvolume ' + value, client);
					info ('Increase/Decrease speaker volume', 'room:', client);
				} else {
					// sur le client directement, peut avoir des volumes par défaut différents
					Avatar.Socket.getClientSocket(client).emit('speaker_volume');
				}
			}
		}
	};

	info("Generic command:", data.action.command, "From:", data.client);
	tblCommand[data.action.command]();

	return callback();
}


var setClient = function (data) {

	// client direct (la commande provient du client et est exécutée sur le client)
	var client = data.client;
	// Client spécifique fixe (la commande ne provient pas du client et n'est pas exécutée sur le client et ne peut pas changer)
	if (data.action.room)
		client = data.action.room;
	// Client spécifique non fixe dans la commande HTTP (la commande ne provient pas du client et n'est pas exécutée sur le client et peut changer)
	if (data.action.setRoom)
		client = data.action.setRoom;

	return client;
}


/* PARTIE POUR AFFICHER UN ICONE MUTE SUR L'INTERFACE SERVEUR */

function addSpeakerGraph(client, set) {
  let style = { };
  let id = 'speaker_' + client;

  style.x = 100;
  style.y = 50;
  style.img = __dirname + '/assets/images/speaker.png';

  if (set == '1') {
    cyto.removeGraphElementByID(id);
  } else {
    if (fs.existsSync('./resources/core/plugins/generic/assets/nodes/speaker_' + client + '.json')) {
      let prop = fs.readJsonSync('./resources/core/plugins/generic/assets/nodes/speaker_' + client + '.json', {
        throws: false
      });
      if (prop) {
        style.x = prop.position.x;
        style.y = prop.position.y;
      }
    }

    return new Promise((resolve, reject) => {
      cyto.getGraph()
        .then(cy => cyto.addGraphElement(cy, id))
        .then(elem => cyto.addElementName(elem, id))
        .then(elem => cyto.addElementClass(elem, nodeType))
        .then(elem => cyto.addElementImage(elem, style.img))
        .then(elem => cyto.addElementSize(elem, 30))
        .then(elem => cyto.selectElement(elem, false))
        .then(elem => cyto.addElementRenderedPosition(elem, style.x, style.y))
        .then(elem => cyto.onClick(elem, (evt) => {
          showContextMenu(evt);
        }))

        .then(elem => {
          resolve(elem);
        })
        .catch(err => {
          reject();
        })
    })
  }
}

// menu contextuel pour la fonction mute / unmute
function showContextMenu(elem) {
	let id = elem.id();

	let room ;

	 room = id.substring(id.lastIndexOf("_"));
	 room = room.replace('_','');

    let pluginMenu = [
			{
					label: 'Active l\'écoute',
					icon: 'resources/app/images/icons/unmute.png',
					click: () => {Avatar.call('generic', {command: 'muteOnOffClient', set : '1', client: room});}
			},
      {type: 'separator'},
      {
          label: 'Sauvegarder',
          icon: 'resources/app/images/icons/save.png',
          click: () => { Avatar.Interface.onAvatarClose(0, function() {
            saveNode(room, elem);
            info (elem.id() + ' sauvegardé !');
        })}
      }
    ];

    // Création du menu
    var handler = function (e) {
      e.preventDefault();
      menu.popup({window: remote.getCurrentWindow()});
      window.removeEventListener('contextmenu', handler, false);
    }
    const menu = Menu.buildFromTemplate(pluginMenu);
    window.addEventListener('contextmenu', handler, false);
}

function saveNode(room, elem) {
  let id = elem.id();

    let roomJSON = fs.readJsonSync('./resources/core/plugins/generic/mute_room.json', 'utf-8', (err) => {
      if (err) throw err;
      info('Le fichier mute_room.json n\'existe pas');
    });

    roomJSON[id] = { };
    roomJSON[id].room = room;
    roomJSON[id].x = elem.renderedPosition('x');
    roomJSON[id].y = elem.renderedPosition('y');

   fs.writeFileSync('./resources/core/plugins/generic/mute_room.json', JSON.stringify(roomJSON, null, 4), 'utf8');

}
