# Étude de données NoSQL

#### TP Réalisé par : Damien CARRIER — Clément SAVINAUD

#### Pour le 6 mars 2022

---

#### [Lien Github](https://github.com/MirakuSan/imt-social-network-analysis)

---

## Contexte

L'objectif de ce TP est de modéliser, implémenter et tester en volumétrie un service d’analyse de comportement d’achat
d’utilisateurs regroupés dans un réseau social. Cette implémentation et ces tests seront effectués *avec un SGBDR
traditionnel **et** une base NoSQL* afin de comparer les avantages, inconvénients et performances de chaque solution.

Les tests devront pouvoir être effectués par un utilisateur sans intervention dans le code donc il faut également
développer un logiciel (Web ou client lourd au choix) permettant de lancer des requêtes sur les 2 bases avec
mesure/affichage des temps de réponse.

## Cahier des charges

Les utilisateurs sont regroupés au sein d’un réseau social leur permettant d’avoir des cercles de followers. Le lien de
« follows » devra être orienté. En termes de volumétrie pour cette phase de test, on peut envisager de créer 1M
utilisateurs. Chaque utilisateur pourrait avoir environ 0 – 20 followers directs.

**Attention** : sur plusieurs niveaux, un utilisateur peut être son propre follower ! Il faut prendre en compte ce point
pour éviter, lors des recherches, de doublonner les résultats. Concernant les achats, la base pourrait contenir 10 000
références de produits. Pour les achats, chaque utilisateur pourrait avoir commandé entre 0 et 5 produits parmi ces
références.

## Projet

Vous pourrez retrouver ce projet en suivant le lien suivant :

```
https://github.com/MirakuSan/imt-social-network-analysis
```

Pour ce projet, nous avons réalisé une application web à l'aide de **ReactJS** pour le front et de **ExpressJS** pour le
back.

Pour les bases de données, nous avons fait le choix d'utiliser **MariaDB** pour la BDD SQL et **Neo4J** pour la BDD
NoSQL.

### Entités

#### MariaDB

| Person     |                          |
|:-----------|:------------------------:|
| Attriute   |           Type           |
| ID         | Integer (Auto Incrément) |
| firstName  |          string          |
| lastName   |          string          |

| Product     |                          |
|:------------|:------------------------:|
| Attriute    |           Type           |
| ID          | Integer (Auto Incrément) |
| productName |          string          |

| Relation      |                          |
|:--------------|:------------------------:|
| Attriute      |           Type           |
| id_influencer |          string          |
| id_follower   |          string          |

| Orders     |         |
|:-----------|:-------:|
| Attriute   |  Type   |
| id_person  | Integer |
| id_product | Integer |

#### NoSQL

Il n'y a pas vraiment d'entité pour le NoSQL mais voilà à quoi pourrait ressembler ces entités :

| Person     |                      |
|:-----------|:--------------------:|
| Attriute   |         Type         |
| firstName  |        string        |
| lastName   |        string        |

| Product     |                      |
|:------------|:--------------------:|
| Attriute    |         Type         |
| productName |        string        |

### Requêtes

Pour faire nos recherches nous réaliserons 3 requêtes de recherche que nous transformerons en SQL et en Neo4J qui sont :

1. Obtenir la liste et le nombre des produits commandés par les cercles de followers d’un individu (niveau 1, …, niveau
   n) &rarr; cette requête permet d’observer le rôle d’influenceur d’un individu au sein du réseau social pour le
   déclenchement d’achats.
2. Même requête, mais avec spécification d’un produit particulier &rarr; cette requête permet d’observer le rôle
   d’influenceur d’un individu suite à un « post » mentionnant un article spécifique.
3. Pour une référence de produit donné, obtenir le nombre de personnes l’ayant commandé dans un cercle de followers
   « **_orienté_** » de niveau n (à effectuer sur plusieurs niveaux : 0, 1, 2 …) &rarr; permet de rechercher les
   produits « viraux », c’est-à-dire ceux qui se vendent le plus au sein de groupes de followers par opposition aux
   achats isolés pour lesquels le groupe social n’a pas d’impact

## Réalisations