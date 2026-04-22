# TransPay Frontend

TransPay Frontend est l’application côté client du système TransPay, une plateforme de paiement automatisé du transport en commun utilisant le Mobile Money.

## Objectif du projet

Cette application fait partie du projet TransPay, conçu pour faciliter le paiement des frais de transport en commun à travers un système rapide, sécurisé et sans argent liquide.

## Technologies frontend

- React vite
- Css et Bootstrap

## Architecture des dossiers

```
frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── ui/
│ │ ├── layout/
│ ├── pages/
│ ├── layouts/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── styles/
│ ├── App.jsx
│ └── main.jsx
├── package.json
```

## Fonctionnalités

- Authentification des utilisateurs
- Sélection des trajets
- Affichage du tarif
- Interface de paiement Mobile Money
- Affichage du ticket numérique
- Historique des paiements

## Installation du projet

```bash
git clone https://github.com/Ste-Verbeck-et-Fils/transpay.git

cd transpay

npm install

npm run dev

```

## Comment contribuer

### une fois l'installation du projet effectuée

- creer une branche feature portant le nom du module à developper

### exemple :

```bash
git checkout develop
git checkout -b feature/paiement
```

- Commit vos changements

```bash
git add .
git commit -m "feat: description du changement..."
```

- Push vers votre branche créé précédemment

```bash
git push origin feature/paiement
```

- Creer une Pull Request

## Interface Passager

## Page d'accueil du passager

- Cette page presente la page d'accueil du passager

<img width="100%" src="./docs/images/passager home.png"  > 

## Page pour voir le profile du passager

- Dans cette page on peut voir le profil du passager

<img  width="100%" src="./docs/images/passager profile.png">

## Page de paiement du passager

- Dans cette page on nous montre qu'un passager peut effectuer un paiement 

<img  width="100%" src="./docs/images/passager paiement mobile.png">

## Page du scanner QR CODE du passager 

- Ici On nous montrer qu'on peut scanner 

<img  width="100%" src="./docs/images/passager scan or type bus code.png">

## Page ticket passager

- c'est une page pour le ticket du passager

<img  width="100%" src="./docs/images/passager ticket.png">

## Page pour les trajets disponible

- ca nous montre les trajets qui sont disponible 

<img width="100%" src="./docs/images/passager trajet.png">

## Page des details de paiement et trajet 

- il y a toutes les details du paiement et du trajet 

<img width="100%" src="./docs/images/passager details paiement+trajet.png">

## Page de l'historique 

- il y a l'historique tu trajet 

<img width="100%" src="./docs/images/passager historique.png">


