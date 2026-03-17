// 1. Ton tableau de données (La source de vérité)
let listeEtudiants = []; 


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

    // On vide le formulaire pour la prochaine saisie
    monFormulaire.reset();

    // On demande au tableau de se mettre à jour
    rafraichirInterface();
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

