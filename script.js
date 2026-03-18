// On essaie de récupérer les données, sinon on crée un tableau vide []
let listeEtudiants = JSON.parse(localStorage.getItem('mes_etudiants')) || [];

// IMPORTANT : Appelle tes fonctions d'affichage dès le chargement du script
// pour que les données enregistrées apparaissent direct au démarrage
rafraichirInterface();
mettreAJourCompteur(); 


const monFormulaire = document.getElementById('student-form');
const corpsTableau = document.getElementById('student-table-body');
const affichageCompteur = document.getElementById('inscrit-count');

monFormulaire.addEventListener('submit', function(event) {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Création de l'objet : regarde les "id" de chaque <input> ou <select>
    const nouvelEtudiant = {
        id: Date.now(), // Génère un ID unique automatiquement
        nom: document.getElementById('name').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        filiere: document.getElementById('filiere').value
    };

    // On l'ajoute à la liste
    listeEtudiants.push(nouvelEtudiant);
    sauvegarderDansLeStockage(); 
    
    monFormulaire.reset();
    rafraichirInterface();
    mettreAJourCompteur();
});

function rafraichirInterface() {
    // 1. On vide le corps du tableau
    // Regarde l'ID de ton <tbody> dans ton HTML
    const corpsTableau = document.getElementById('student-table-body');
    corpsTableau.innerHTML = "";

    listeEtudiants.forEach(etudiant => {
        // 2. Création de la ligne
        const ligne = document.createElement('tr');

        // 3. Injection du contenu
        // Remplace [[TES_CLASSES_A]] par tes classes (ex: "btn-action")
        ligne.innerHTML = `
            <td>${etudiant.nom}</td>
            <td>${etudiant.prenom}</td>
            <td>${etudiant.email}</td>
            <td>${etudiant.age}</td>
            <td>${etudiant.filiere}</td>
            <td>
                <a href="#" class="edit-btn" onclick="preparerModif(${etudiant.id})">
                    <ion-icon name="create-outline"></ion-icon>
                </a>
                
                <a href="#" class="delete-btn" onclick="supprimerEtudiant(${etudiant.id})">
                    <ion-icon name="trash-outline"></ion-icon>
                </a>
            </td>
        `;

        corpsTableau.appendChild(ligne);
    });
}

function mettreAJourCompteur() {

    const affichage = document.getElementById('inscrit-count'); 
    if (affichage) {
        // 3. On injecte le texte avec la longueur du tableau JS
        affichage.innerText = listeEtudiants.length + " Etudiant(s) inscrit(s)";
    }
}
function sauvegarderDansLeStockage() {
    // JSON.stringify transforme ton tableau d'objets en texte (String)
    localStorage.setItem('mes_etudiants', JSON.stringify(listeEtudiants));
}

function supprimerEtudiant(idASupprimer) {
    // 1. Une petite confirmation pour la sécurité
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
        
        // 2. On filtre : on garde tous les étudiants SAUF celui qui a cet ID
        listeEtudiants = listeEtudiants.filter(etudiant => etudiant.id !== idASupprimer);

        // 3. On synchronise tout
        sauvegarderDansLeStockage(); // Ta fonction de LocalStorage
        rafraichirInterface();       // Ta fonction qui redessine le <tbody>
        mettreAJourCompteur();       // Ta fonction qui change le chiffre en haut
    }
}