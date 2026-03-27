// On essaie de récupérer les données, sinon on crée un tableau vide []
let listeEtudiants = JSON.parse(localStorage.getItem('mes_etudiants')) || [];

const monFormulaire = document.getElementById('student-form');
const corpsTableau = document.getElementById('student-cards');
const affichageCompteur = document.getElementById('inscrit-count');
const addStudentBtn = document.getElementById('add-student-btn');
const toggleListBtn = document.getElementById('toggle-list-btn');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');

// Initialisation de l'interface
rafraichirInterface();
mettreAJourCompteur();

let modeEdition = false;
let idEdition = null;

// Event listeners
addStudentBtn.addEventListener('click', () => {
    monFormulaire.style.display = 'block';
    addStudentBtn.style.display = 'none';
    submitBtn.textContent = 'Enregistrer';
    cancelBtn.style.display = 'inline-block';
});

cancelBtn.addEventListener('click', () => {
    monFormulaire.reset();
    monFormulaire.style.display = 'none';
    addStudentBtn.style.display = 'block';
    cancelBtn.style.display = 'none';
    modeEdition = false;
    idEdition = null;
});

toggleListBtn.addEventListener('click', () => {
    const cards = document.getElementById('student-cards');
    if (cards.style.display === 'none') {
        cards.style.display = 'flex';
        toggleListBtn.textContent = 'Masquer Liste';
    } else {
        cards.style.display = 'none';
        toggleListBtn.textContent = 'Afficher Liste';
    }
});

searchInput.addEventListener('input', () => {
    rafraichirInterface();
});

monFormulaire.addEventListener('submit', function(event) {
    // Empêche le rechargement de la page
    event.preventDefault();

    // Création de l'objet 
    const nouvelEtudiant = {
        id: modeEdition ? idEdition : Date.now(), 
        matricule: modeEdition ? idEdition : Date.now(), 
        nom: document.getElementById('name').value,
        prenom: document.getElementById('prenom').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
            filiere: document.getElementById('filiere').value,
        photo: document.getElementById('photo').value || 'https://via.placeholder.com/100' 
    };
    
    if (modeEdition) {
        // Mettre à jour l'étudiant existant
        const index = listeEtudiants.findIndex(etudiant => etudiant.id === idEdition);
        if (index !== -1) {
            listeEtudiants[index] = nouvelEtudiant;
        }
        modeEdition = false;
        idEdition = null;
    } else {
        // Ajouter nouveau
        listeEtudiants.push(nouvelEtudiant);
    }

    sauvegarderDansLeStockage(); 
    
    monFormulaire.reset();
    monFormulaire.style.display = 'none';
    addStudentBtn.style.display = 'block';
    cancelBtn.style.display = 'none';
    rafraichirInterface();
    mettreAJourCompteur();
});

function rafraichirInterface() {
    // 1. On vide le conteneur des cartes
    const conteneurCartes = document.getElementById('student-cards');
    conteneurCartes.innerHTML = "";

    // Filtrer les étudiants selon la recherche
    const query = searchInput.value.toLowerCase();
    const etudiantsFiltres = listeEtudiants.filter(etudiant => {
        return etudiant.nom.toLowerCase().includes(query) ||
               etudiant.prenom.toLowerCase().includes(query) ||
               etudiant.matricule.toString().includes(query);
    });

    etudiantsFiltres.forEach(etudiant => {
        // 2. Création de la carte
        const carte = document.createElement('div');
        carte.className = 'student-card';

        // 3. Injection du contenu
        carte.innerHTML = `
            <img src="${etudiant.photo}" alt="Photo de ${etudiant.prenom} ${etudiant.nom}" class="student-photo">
            <h3>${etudiant.prenom} ${etudiant.nom}</h3>
            <p>Matricule: ${etudiant.matricule}</p>
            <div class="card-actions">
                <button class="edit-btn" onclick="preparerModif(${etudiant.id})">
                    <ion-icon name="create-outline"></ion-icon>
                </button>
                <button class="delete-btn" onclick="supprimerEtudiant(${etudiant.id})">
                    <ion-icon name="trash-outline"></ion-icon>
                </button>
            </div>
        `;

        conteneurCartes.appendChild(carte);
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

function preparerModif(id) {
    const etudiant = listeEtudiants.find(e => e.id === id);
    if (etudiant) {
        // Remplir le formulaire
        document.getElementById('photo').value = etudiant.photo || '';
        document.getElementById('name').value = etudiant.nom;
        document.getElementById('prenom').value = etudiant.prenom;
        document.getElementById('email').value = etudiant.email;
        document.getElementById('age').value = etudiant.age;
        document.getElementById('filiere').value = etudiant.filiere;

        // Passer en mode édition
        modeEdition = true;
        idEdition = id;

        // Afficher le formulaire
        monFormulaire.style.display = 'block';
        addStudentBtn.style.display = 'none';
        submitBtn.textContent = 'Mettre à jour';
        cancelBtn.style.display = 'inline-block';
    }
}

function supprimerEtudiant(idASupprimer) {
    // 1. Une petite confirmation pour la sécurité
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
        
        // 2. On filtre : on garde tous les étudiants SAUF celui qui a cet ID
        listeEtudiants = listeEtudiants.filter(etudiant => etudiant.id !== idASupprimer);

        // 3. On synchronise tout
        sauvegarderDansLeStockage(); // Ta fonction de LocalStorage
        rafraichirInterface();       // Ta fonction qui redessine les cartes
        mettreAJourCompteur();       // Ta fonction qui change le chiffre en haut
    }
}