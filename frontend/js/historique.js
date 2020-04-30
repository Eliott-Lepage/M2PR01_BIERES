/**
 * Auth : Cédric De Dryver
 *
 * Affiche l'historique d'achat de bière du client selon son identifiant  (mail) et son mot de passe (mdp)
 *
 * Affiche une erreur (historique.js:33) si il y a une erreur de connexion ou un message (historique.js:66) si le client n'a rien commandé sur le site.
 *
 * @param form
 * @returns False (Afin de ne pas refresh la page)
 */

function connexionHistorique(form){
    /**<--- VARIABLES --->*/

    let clientId ="";
    let mayStop = false;
    let jsonClient,jsonHistorique = {},jsonVentes = {};
    let strRetour ="";
    let strDetail ="";
    let keyJsonHistorique = [];

    /**
     * Fait une requete HTTP XML pour recevoir l'ID du client si le mot de passe et l'identifiant (email) sont correct
     * @type {XMLHttpRequest}
     * @result : la var clientId recoit l'id du client necessaire a l'obtention de son historique.
     */
    let xhr =  new XMLHttpRequest();
    xhr.open('get','connexion?mail='+form.mail.value+'&mdp='+form.mdp.value,false);
    xhr.onload = function (){
        jsonClient = JSON.parse(xhr.responseText);
        if(Object.keys(jsonClient).length === 0){

            document.querySelector('#recuHistorique').innerHTML="<p> Mauvais identifiant ou mauvais mot de passe</p>";
            mayStop = true;
        }
        else{
            clientId = String(jsonClient[0].clientId);
        }
    };
    xhr.send();

    /**
     * Permet l'arret du programme si les identifiant sont faux.
     */
    if(mayStop === true){
        return false;
    }


    /**
     * Va recevoir l'Id de la commande necessaire pour voir les produit qui ont été acheté dans la table Vente.
     *
     * @type {XMLHttpRequest}
     * @result : un strRetour qui s'affichera dans la balise div id="recuHistorique" la commande au niveau global (ID, prix total et quantité totale).
     */

    xhr = new XMLHttpRequest();
    xhr.open('get','getHistory?code='+clientId,false);
    xhr.onload= function (){
        jsonHistorique= Object.assign(jsonHistorique,JSON.parse(xhr.responseText));
        };
    xhr.send();

    keyJsonHistorique = Object.keys(jsonHistorique);

    if(keyJsonHistorique.length === 0){
        gid("recuHistorique").innerHTML = "Vous avez passé aucune commande sur notre site.";
        return false;
    }

    strRetour +="<table>"+"<thead><th>Id de la commande</th><th>Prix Total</th><th>Quantité Totale</th><th></th> </thead>";
    for(let i in jsonHistorique) {
        strRetour += "<tr id="+ jsonHistorique[i].commId +"><td>" + jsonHistorique[i].commId + "</td>"
            + "<td>" + jsonHistorique[i].prixTot + "€ </td>"
            + "<td>" + jsonHistorique[i].quantTot +"</td>"
            + "<td id= detail_"+jsonHistorique[i].commId+"></td></tr>";
    }
    gid("recuHistorique").innerHTML = strRetour;


    /**
     *  Va afficher dans la balise déroulante Details les details de la commande (produit et quantité commandé).
     *
     * @type {XMLHttpRequest}
     * @result : un strDetail qui s'affichera dans une partie du tableau td id=detail_coXXX avec les produit et leur quantité respective commandé).
     */
    for(let i in jsonHistorique){
        strDetail = "";
        xhr = new XMLHttpRequest();
        xhr.open('get','getVentes?id='+jsonHistorique[i].commId,false);
        xhr.onload= function(){
            jsonVentes= Object.assign(jsonVentes,JSON.parse(xhr.responseText));
        };
        xhr.send();

        strDetail +="<details><summary>Details produit</summary>";
        for(let j in jsonVentes){
            strDetail+= "Produit = "+jsonVentes[j].biereId+" ,Quantité = "+jsonVentes[j].prodQuant+ " ,<br>";
        }
        strDetail+="</details>";
        gid("detail_"+jsonHistorique[i].commId+"").innerHTML = strDetail;
    }

    return false;
}