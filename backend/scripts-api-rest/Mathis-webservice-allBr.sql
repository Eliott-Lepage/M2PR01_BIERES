/*
auth : Mathis
Creation de la procédure qui récupère toutes les bières avec des critères de tri mais accepte toutes les brasseries, 
le tri se fait avec le prix minimum, prix maximum, degré d'alcoolémie minimum et maximum la couleur est également un critère de tri.
*/
CREATE PROCEDURE "DBA"."proc_catalogueAllBr"(in couleur varchar(15), in pMin decimal(4,2), in pMax decimal(4,2), in dMin decimal(3,1), in dMax decimal(3,1))
RESULT (id char(3), biere varchar(30), couleur varchar(15), alcool decimal(3,1), volume decimal(4,2), brasserie varchar(60), prix decimal(4,2))
BEGIN
    call sa_set_http_header('Access-Control-Allow-Origin','*');
    call sa_set_http_header('Content-Type','application/json');
    select biereId, biereNom, biereCouleur, biereAlcool, biereVolume, brasseurNom, bierePrix from dba.tbBieres as biere
    join dba.tbBrasseurs as brasseur on biere.brasseurId = brasseur.brasseurId 
    where biereCouleur = couleur AND (bierePrix BETWEEN pMin AND pMax) AND (biereAlcool BETWEEN dMin AND dMax)
    order by biere.biereNom ASC;
END;
/*
auth : Mathis
Creation du webservice pour la procédure catalogueAllBr
*/
CREATE SERVICE "allBr" TYPE 'JSON' AUTHORIZATION OFF USER "dba" URL ON METHODS 'GET' AS call DBA.proc_catalogueAllBr(:couleur,:pMin,:pMax,:dMin,:dMax);
