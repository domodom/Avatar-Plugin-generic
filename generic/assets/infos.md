# Les standards

<b>Ce plugin regroupe une collection de fonctionnalités intégrées à Avatar comprenant:</b>
- [Répeter la dernière commande](#répeter-la-dernière-commande)
- [La liste des clients connectés](#la-liste-des-clients-connectés)
- [Démarrer/Stopper le dialogue d'un client sans passer par le mot-clé déclencheur](#démarrerstopper-le-dialogue-dun-client-sans-passer-par-le-mot-clé-déclencheur)
- [Couper/Remettre l'écoute d'un client](#couperremettre-lécoute-dun-client)
- [Définir la pièce courante](#définir-la-pièce-courante)
- [Verrouiller ou déverrouiller la pièce courante](#verrouiller-ou-deverrouiller-la-pièce-courante)
- [Connaitre la pièce courante](#connaitre-la-pièce-courante)
- [Le redémarrage des clients à la demande](#le-redémarrage-des-clients-à-la-demande)
- [Un mode Intercom pour communiquer entre clients](#le-mode-intercom-pour-communiquer-entre-clients)
- [Modifier le volume de l'enceinte du serveur ou d'un client](#modifier-le-volume-de-lenceinte-du-serveur-ou-dun-client)
- [Couper/Remettre le volume de l'enceinte d'un client](#couperremettre-le-volume-de-lenceinte-dun-client)


<br>
**Ce plugin ne peut pas être inactif ou être supprimé.**
<br>

### Répeter la dernière commande
Cette action vous permet de répeter la dernière action effectuée sur le client courant.

**Syntaxe de la règle**:  encore

**Exemples:**
- **Vous:** Monte le son de la télé
- **Avatar:** C'est fait
- **Vous:** Encore
- **Avatar:** C'est fait
- **Vous:** Encore
- **Avatar:** ....

**Astuce:**
Cette fonction prend tout son sens avec un client configuré en mode Loop sinon vous devez dire le mot-clé déclencheur avant la règle.


<br>

### La liste des clients connectés
Les clients connectés sont affichés dans l'interface d'Avatar mais si vous le désirez, vous pouvez lui demander vocalement.

**Syntaxe de la règle**:  * client * connecté

**Exemples:**
- **Vous:** Quels sont les clients connectés ?
- **Vous:** Peux tu me donner les clients connectés ?
- **Avatar:** Salon, Cuisine, Chambre connectés

<br>

### Démarrer/Stopper le dialogue d'un client sans passer par le mot-clé déclencheur
En utilisation normale, pour démarrer un dialogue, vous devez dire le mot-clé que vous avez défini, comme par exemple "Sarah" ou encore "Jarvis".

Quelques-fois, il est bon de pouvoir démarrer ou stopper l'écoute sans passer par le mot-clé, comme par exemple, lorsqu'il y a trop de bruit dans la pièce.

**Démarrer l'écoute:**
- Utilisez l'action **"Démarrer l'écoute"** dans le menu dynamique du node représentant le client dans l'interface Avatar
- Avec le client Android,  par le menu d'actions de l'application et la commande **"Démarre l'écoute"**
- Par tout autre moyen, comme avec un bouton poussoir
	- Pour démarrer l'écoute dans la pièce courante:
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=listen
	- Pour démarrer l'écoute dans une pièce spécifique:
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=listen&setRoom=**Nom de la pièce**

<br>

**Stopper l'écoute:**
- Utilisez l'action **"Stop l'écoute"** dans le menu dynamique du node représentant le client dans l'interface Avatar
- Avec le client Android,  par le menu d'actions de l'application et la commande **"Stop l'écoute"**
- Par tout autre moyen, comme avec un bouton poussoir:
	- Pour stopper l'écoute dans la pièce courante
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=stop_listen
	- Pour stopper l'écoute dans une pièce spécifique
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=stop_listen&setRoom=**Nom de la pièce**

<br>


### Couper/Remettre l'écoute d'un client
Cette fonction est très utile lorsque l'on désire mettre Avatar en mode silence.

**Couper l'écoute:**
- Utilisez l'action **"Désactive l'écoute"** dans le menu dynamique du node représentant le client dans l'interface Avatar
- Avec le client Android,  par le menu d'actions de l'application et les commandes **"Mute pièce courante"** et **"Mute sélection de la pièce"**
- Par tout autre moyen, comme avec un bouton poussoir
	- Pour couper l'écoute dans la pièce courante:
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=muteOnOffClient&set=0
	- Pour couper l'écoute dans une pièce spécifique:
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=muteOnOffClient&set=0&setRoom=**Nom de la pièce**

<br>

**Remettre l'écoute:**
- Utilisez l'action **"Active l'écoute"** dans le menu dynamique du node représentant le client dans l'interface Avatar
- Avec le client Android,  par le menu d'actions de l'application et les commandes **"UnMute pièce courante"** et **"UnMute sélection de la pièce"**
- Par tout autre moyen, comme avec un bouton poussoir:
	- Pour remettre l'écoute dans la pièce courante
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=muteOnOffClient&set=1
	- Pour démarrer l'écoute dans une pièce spécifique
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=muteOnOffClient&set=1&setRoom=**Nom de la pièce**

<br>

### Définir la pièce courante
Connaitre la pièce courante est utile si vous avez une installation avec plusieurs clients.

Si vous n'avez qu'un seul client, n'oubliez-pas de définir son nom dans le client par défaut des paramètres d'Avatar.
A noté que les clients mappés sont aussi reconnus comme pièces courantes.

Vous pouvez ainsi ne pas dire le nom de la pièce où vous vous trouvez avec une règle, par exemple, vous pouvez dire "Allume la lumière" et Avatar comprendra qu'il faut allumer dans la pièce courante.
Il peut aussi vous proposer de lui-même de vous communiquer des informations, comme lorsque votre programme télé favori est en train de passer ou encore s'il doit fermer les volets en vous posant la question et ca bien sûr seulement dans la pièce où vous vous trouvez et non pas partout dans toute la maison et sur tous les clients. 

Par conséquent, pour vous localiser, vous devez définir la pièce courante.
Vous avez beaucoup de possibilités pour la définir, en voici quelques-unes:
- Utilisez l'action **"Définir comme pièce courante"** dans le menu dynamique du node représentant le client dans l'interface Avatar
- Avec le client Android,  par le menu d'actions de l'application et la commande **"Définir la pièce courante"**
- Automatiquement avec des capteurs de présences ou par tout autre moyen, comme avec un bouton poussoir: 
	- Configurez votre box domotique pour qu'elle envoie une action à Avatar lorsqu'un module est déclenché dans une pièce
		- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=currentRoom&setRoom=**Nom de la pièce**

<br>

### Verrouiller ou deverrouiller la pièce courante
Il est possible d'interdire le changement de la pièce courante.

**Verrouiller une pièce:**
- Utilisez l'action **"Fixer comme pièce courante"** dans le menu dynamique du node représentant le client dans l'interface Avatar 
- Utilisez la règle vocale **(fixe|verrouille) * [nom de la pièce]**
	- Exemple: 
    	- Verrouille le Salon
    	- Fixe la pièce Cuisine

**Déverrouiller une pièce:**
- Utilisez l'action **"Réactive capteurs de pièce courante"** dans le menu dynamique du serveur dans l'interface Avatar 
- Utilisez la règle vocale **(Libère|Déverrouille) * [nom de la pièce]**
	- Exemple: 
    	- Déverrouille le Salon
    	- Libère la pièce Cuisine

<br>

### Connaitre la pièce courante
Pour connaitre la pièce courante, vous pouvez la visualiser dans l'interface Avatar.
Le node qui est encerclé de rouge est la pièce courante.

vous pouvez aussi utiliser une règle vocale:

**Syntaxe de la règle**:  Quelle * pièce courante 

**Exemples:**
- **Vous:** Quelle est la pièce courante ?
- **Avatar:** Salon est la pièce courante


<br>

### Le redémarrage des clients à la demande
Vous pouvez utiliser cette action pour redémarrer les clients à la demande.

**Important:**
Cette commande nécessite le paramètrage d'un fichier de propriétés afin de connaitre le type de microphone utilisé pour le client Avatar.

Si vous utilisez un microphone classique (hors Kinect), ce paramètrage n'est pas à effectuer (par défaut).
Dans le cas d'un microphone Kinect:
- Ouvrez le fichier _c:\Dossier d'install du client\app\restart\config.json_
- Si besoin, modifiez seulement la propriété **nodejs**, laissez les autres propriétés avec les valeurs par défaut.
	- Propriété **nodejs**:
		- Si vous utilisez un microphone Kinect, la valeur doit être:
			- Avatar_Client_Kinect_Audio.cmd
        - Si vous utilisez un microphone classique, la valeur doit être:
			- Avatar_Client_Microphone.cmd


**Syntaxe de la règle**:  Redémarre * (tous les clients || nom d'un client)

**Exemples:**
- **Vous:** Redémarre
	- _Redémarre la pièce courante._
- **Vous:** Redémarre le Salon
	- _Redémarre le client Salon_
- **Vous:** Tu peux redémarrer la Chambre
	- _Redémarre le client Chambre_
- **Vous:** Pourrais-tu redémarrer tous les clients
- **Vous:** Redémarre tous les clients
	- _Redémarre tous les clients connectés_

<br>

### Le mode Intercom pour communiquer entre clients
Vous pouvez utiliser cette action pour envoyer un message vocal d'un client vers un autre client.

L'enregistrement du message est automatiquement intérrompu après 1 ou 2 secondes de pause.

**Syntaxe de la règle**:  intercom || mode intercom * (tous les clients || nom d'un client)

**Exemples:**
- **Vous:** Intercom
	- _Passe en mode intercom avec la pièce courante (pas très utile...)_
- **Vous:** Intercom avec la Chambre
	- _Passe en mode intercom avec le client Chambre_
- **Vous:** mode intercom avec le Salon
	- _Passe en mode intercom avec le client Salon_
- **Vous:** Intercom avec tous les clients
	- _Passe en mode intercom avec tous les clients connectés_
- **Avatar:** Je t'écoute...
- **Vous:** Enregistrez votre message, il sera ensuite envoyé vers les clients avec lesquels vous avez ouvert la communication

<br>

### Modifier le volume de l'enceinte du serveur ou d'un client
Cette fonction permet de modifier le volume du PC serveur ou d'un client.

Pour modifier le volume du serveur (Valeur du volume de 0 à 100):
- Avec le client Android,  par le menu d'actions de l'application et la commande **"Volume sur le serveur"**
- Par un moyen externe ou un plugin:
	- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=set_speaker&set=**Valeur du volume**&setRoom=serveur
    

Pour modifier le volume d'un client (Valeur du volume de 0 à 100)::
- Avec le client Android,  par le menu d'actions de l'application et la commande **"Volume sur un PC client"**
- Par un moyen externe ou un plugin:
	- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=set_speaker&set=**Valeur du volume**&setRoom=**Nom de la pièce**

<br>

### Couper/Remettre le volume de l'enceinte d'un client

Pour couper le volume:
- Par un moyen externe ou un plugin:
	- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=muteOnOff&set=1&setRoom=**Nom de la pièce**
    

Pour Remettre le volume:
- Avec le client Android,  par le menu d'actions de l'application et la commande **"Volume sur un PC client"**
- Par un moyen externe ou un plugin:
	- http://**IP SERVEUR**:**PORT**/Avatar/generic?command=muteOnOff&set=0&setRoom=**Nom de la pièce**
<br>
<br>
<br>
<br>