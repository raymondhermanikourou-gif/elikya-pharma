const pharmacies = [
  {
    id: 1,
    nom: "Pharmacie du Centre",
    adresse: "Avenue de l'Indépendance, Centre-ville",
    lat: -4.2692,
    lng: 15.2714,
  },
  {
    id: 2,
    nom: "Pharmacie Moungali",
    adresse: "Rue Bouenza, Moungali",
    lat: -4.245,
    lng: 15.265,
  },
  {
    id: 3,
    nom: "Pharmacie Bacongo",
    adresse: "Avenue du Djoué, Bacongo",
    lat: -4.31,
    lng: 15.26,
  },
  {
    id: 4,
    nom: "Pharmacie Poto-Poto",
    adresse: "Boulevard Lyautey, Poto-Poto",
    lat: -4.26,
    lng: 15.29,
  },
  {
    id: 5,
    nom: "Pharmacie CHU Brazzaville",
    adresse: "Avenue Auxence Ickonga, CHU",
    lat: -4.275,
    lng: 15.255,
  },
];
const produits = [
  {
    nom: "Paracétamol 500mg",
    stock: [42, 0, 15, 8, 120],
    prix: [500, 0, 500, 500, 450],
  },
  {
    nom: "Amoxicilline 250mg",
    stock: [0, 30, 5, 22, 60],
    prix: [0, 1200, 1200, 1200, 1100],
  },
  {
    nom: "Ibuprofène 400mg",
    stock: [18, 12, 0, 35, 9],
    prix: [750, 750, 0, 750, 700],
  },
  {
    nom: "Métronidazole 250mg",
    stock: [7, 0, 28, 0, 14],
    prix: [600, 0, 600, 0, 550],
  },
  {
    nom: "Cotrimoxazole 480mg",
    stock: [0, 45, 11, 3, 0],
    prix: [0, 400, 400, 400, 0],
  },
  {
    nom: "Doxycycline 100mg",
    stock: [23, 6, 0, 19, 8],
    prix: [900, 900, 0, 900, 850],
  },
];
const hopitaux = [
  {
    id: 1,
    nom: "CHU de Brazzaville",
    adresse: "Avenue Auxence Ickonga",
    lat: -4.275,
    lng: 15.255,
  },
  {
    id: 2,
    nom: "Hôpital Adolphe Sicé",
    adresse: "Rue Bouenza, Moungali",
    lat: -4.245,
    lng: 15.27,
  },
  {
    id: 3,
    nom: "Clinique Nganga Edouard",
    adresse: "Avenue de France, Centre-ville",
    lat: -4.27,
    lng: 15.28,
  },
  {
    id: 4,
    nom: "Hôpital de Base de Bacongo",
    adresse: "Avenue du Djoué, Bacongo",
    lat: -4.305,
    lng: 15.258,
  },
  {
    id: 5,
    nom: "Centre de Transfusion CNTS",
    adresse: "Boulevard Denis Sassou Nguesso",
    lat: -4.262,
    lng: 15.266,
  },
];
const sangData = [
  { groupe: "A+", stock: [8, 0, 12, 3, 25], prix: [5000, 0, 5000, 5000, 4500] },
  { groupe: "A-", stock: [0, 4, 2, 0, 8], prix: [0, 6000, 6000, 0, 5500] },
  { groupe: "B+", stock: [15, 6, 0, 9, 20], prix: [5000, 5000, 0, 5000, 4500] },
  { groupe: "B-", stock: [0, 2, 0, 1, 5], prix: [0, 6000, 0, 6000, 5500] },
  {
    groupe: "O+",
    stock: [20, 10, 8, 0, 30],
    prix: [5000, 5000, 5000, 0, 4500],
  },
  { groupe: "AB+", stock: [3, 0, 5, 2, 10], prix: [7000, 0, 7000, 7000, 6500] },
];

const normaliser = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
let tagsMed = [];

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("search-medicament");
  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = this.value.trim();
        if (val && !tagsMed.includes(val)) {
          tagsMed.push(val);
          afficherTagsMed();
        }
        this.value = "";
      }
    });
  }
});

function afficherTagsMed() {
  const c = document.getElementById("tags-medicament");
  if (!c) return;
  if (tagsMed.length === 0) {
    c.classList.add("hidden");
    return;
  }
  c.classList.remove("hidden");
  c.innerHTML = tagsMed
    .map(
      (t, i) =>
        `<span class="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">${t}<button onclick="supprimerTagMed(${i})" class="text-green-600 hover:text-green-900 font-bold">✕</button></span>`,
    )
    .join("");
}

function supprimerTagMed(index) {
  tagsMed.splice(index, 1);
  afficherTagsMed();
}

function lancerRecherche() {
  document.getElementById("resultats-sang").classList.add("hidden");
  document.getElementById("resultats-sang").innerHTML = "";
  const input = document.getElementById("search-medicament");
  const val = input.value.trim();
  if (val && !tagsMed.includes(val)) {
    tagsMed.push(val);
    afficherTagsMed();
    input.value = "";
  }
  const recherches = tagsMed.length > 0 ? tagsMed : val ? [val] : [];
  if (recherches.length === 0) {
    input.focus();
    return;
  }
  const zone = document.getElementById("resultats-medicament");
  zone.innerHTML = "";
  zone.classList.remove("hidden");
  zone.innerHTML = `<div class="flex items-center justify-between mb-2"><p class="text-xs font-semibold text-gray-500">Résultats</p><button onclick="fermerResultatsMed()" class="text-xs text-gray-400 hover:text-gray-700">✕ Fermer</button></div>`;
  recherches.forEach((terme) => {
    const produit = produits.find((p) =>
      normaliser(p.nom).includes(normaliser(terme)),
    );
    if (!produit) {
      zone.innerHTML += `<div class="fade-up bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600"> <strong>${terme}</strong> — aucun résultat.</div>`;
      return;
    }
    zone.innerHTML += `<p class="fade-up text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-2">Résultats pour <span class="text-green-600">${produit.nom}</span></p>`;
    let count = 0;
    pharmacies.forEach((ph, idx) => {
      if (count >= 3) return;
      const stock = produit.stock[idx];
      const prix = produit.prix[idx];
      if (stock === 0) return;
      count++;
      const sc = stock <= 10 ? "stock-low" : "stock-ok";
      const sl = stock <= 10 ? ` ${stock} restants` : ` ${stock} en stock`;
      zone.innerHTML += `<div class="fade-up bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow mb-2"><div class="flex items-start justify-between gap-2 mb-2"><div><p class="font-semibold text-gray-900 text-sm">${ph.nom}</p><p class="text-xs text-gray-400 mt-0.5"> ${ph.adresse}</p></div><span class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${sc}">${sl}</span></div><div class="flex items-center gap-1.5 mb-3"><span class="text-green-700 font-bold text-sm">${prix.toLocaleString()} FCFA</span><span class="text-xs text-gray-400">/ unité</span></div><div class="flex gap-2"><button onclick="yAller(${ph.lat},${ph.lng})" class="flex-1 flex items-center justify-center gap-2 border border-green-500 text-green-700 font-semibold text-xs py-2 rounded-xl hover:bg-green-50 transition-colors"> Y aller</button><button onclick="ouvrirReservation('${produit.nom}','${ph.nom}',${prix})" class="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold text-xs py-2 rounded-xl hover:bg-green-700 transition-colors"> Réserver</button></div></div>`;
    });
    if (count === 0) {
      zone.innerHTML += `<div class="fade-up bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-700">⚠ <strong>${produit.nom}</strong> en rupture dans toutes nos pharmacies.</div>`;
    }
  });
  setTimeout(() => {
    zone.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

function fermerResultatsMed() {
  const zone = document.getElementById("resultats-medicament");
  zone.classList.add("hidden");
  zone.innerHTML = "";
  tagsMed = [];
  afficherTagsMed();
  document.getElementById("search-medicament").value = "";
}

function lancerRechercheSang() {
  document.getElementById("resultats-medicament").classList.add("hidden");
  document.getElementById("resultats-medicament").innerHTML = "";
  const input = document.getElementById("search-sang");
  const terme = input.value.trim();
  if (!terme) {
    input.focus();
    return;
  }
  const zone = document.getElementById("resultats-sang");
  zone.innerHTML = "";
  zone.classList.remove("hidden");
  const sang = sangData.find((s) =>
    normaliser(s.groupe).includes(normaliser(terme)),
  );
  zone.innerHTML = `<div class="flex items-center justify-between mb-2"><p class="text-xs font-semibold text-gray-500">Résultats</p><button onclick="fermerResultatsSang()" class="text-xs text-gray-400 hover:text-gray-700">✕ Fermer</button></div>`;
  if (!sang) {
    zone.innerHTML += `<div class="fade-up bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600"> Groupe <strong>${terme}</strong> non trouvé. Essayez: A+, B-, O+, AB+</div>`;
    return;
  }
  zone.innerHTML += `<p class="fade-up text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-2">Poches <span class="text-red-500">Groupe ${sang.groupe}</span> disponibles</p>`;
  let count = 0;
  hopitaux.forEach((h, idx) => {
    if (count >= 3) return;
    const stock = sang.stock[idx];
    const prix = sang.prix[idx];
    if (stock === 0) return;
    count++;
    const sc = stock <= 5 ? "stock-low" : "stock-ok";
    const sl =
      stock <= 5
        ? ` ${stock} poches restantes`
        : ` ${stock} poches disponibles`;
    zone.innerHTML += `<div class="fade-up bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow mb-2"><div class="flex items-start justify-between gap-2 mb-2"><div><p class="font-semibold text-gray-900 text-sm">${h.nom}</p><p class="text-xs text-gray-400 mt-0.5"> ${h.adresse}</p></div><span class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${sc}">${sl}</span></div><div class="flex items-center gap-1.5 mb-3"><span class="text-red-600 font-bold text-sm">${prix.toLocaleString()} FCFA</span><span class="text-xs text-gray-400">/ poche</span></div><div class="flex gap-2"><button onclick="yAller(${h.lat},${h.lng})" class="flex-1 flex items-center justify-center gap-2 border border-red-400 text-red-600 font-semibold text-xs py-2 rounded-xl hover:bg-red-50 transition-colors"> Y aller</button><button onclick="ouvrirReservationSang('Groupe ${sang.groupe}','${h.nom}',${prix})" class="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-semibold text-xs py-2 rounded-xl hover:bg-red-600 transition-colors"> Réserver</button></div></div>`;
  });
  if (count === 0) {
    zone.innerHTML += `<div class="fade-up bg-yellow-50 border border-yellow-100 rounded-xl p-3 text-sm text-yellow-700">⚠ Groupe <strong>${sang.groupe}</strong> en rupture dans tous nos établissements.</div>`;
  }
  setTimeout(() => {
    zone.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

function fermerResultatsSang() {
  const zone = document.getElementById("resultats-sang");
  zone.classList.add("hidden");
  zone.innerHTML = "";
  document.getElementById("search-sang").value = "";
}

function yAller(lat, lng) {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`,
    "_blank",
  );
}

let reservationEnCours = {};

function ouvrirReservation(produitNom, pharmacieNom, prix) {
  reservationEnCours = { produitNom, pharmacieNom, prix };
  document.getElementById("overlay-pharmacie-nom").textContent = pharmacieNom;
  document.getElementById("overlay-produit-info").innerHTML =
    ` <strong>${produitNom}</strong> — ${prix.toLocaleString()} FCFA / unité`;
  document.getElementById("overlay-reservation").classList.add("show");
}

function ouvrirReservationSang(groupe, hopitalNom, prix) {
  reservationEnCours = { produitNom: groupe, pharmacieNom: hopitalNom, prix };
  document.getElementById("overlay-pharmacie-nom").textContent = hopitalNom;
  document.getElementById("overlay-produit-info").innerHTML =
    ` <strong>${groupe}</strong> — ${prix.toLocaleString()} FCFA / poche`;
  document.getElementById("overlay-reservation").classList.add("show");
}

function fermerOverlay(e) {
  if (e.target === document.getElementById("overlay-reservation"))
    fermerOverlayDirect();
}
function fermerOverlayDirect() {
  document.getElementById("overlay-reservation").classList.remove("show");
}

function confirmerReservation() {
  const nom = document.getElementById("form-nom").value.trim();
  const tel = document.getElementById("form-telephone").value.trim();
  if (!nom || !tel) {
    alert("Veuillez remplir votre nom et téléphone.");
    return;
  }
  fermerOverlayDirect();
  document.getElementById("overlay-confirmation").classList.add("show");
  document.getElementById("form-nom").value = "";
  document.getElementById("form-telephone").value = "";
  document.getElementById("form-quantite").value = 1;
}

function fermerConfirmation(e) {
  if (!e || e.target === document.getElementById("overlay-confirmation")) {
    document.getElementById("overlay-confirmation").classList.remove("show");
  }
}

function toggleMenu() {
  document.getElementById("mobile-menu").classList.toggle("open");
}

// ══════════════════════════════════════════
// SOS ALERTE
// ══════════════════════════════════════════
let modeAlerte = 'whatsapp';
let typeAlerte = 'medicament';

function selectTypeAlerte(type) {
  typeAlerte = type;
  const input = document.getElementById('alerte-produit');
  const label = document.getElementById('label-produit-alerte');
  if (type === 'medicament') {
    input.placeholder = 'Ex : Paracétamol 500mg, Amoxicilline...';
    label.textContent = 'Médicament recherché';
    document.getElementById('btn-type-med').className = 'flex items-center justify-center gap-2 border-2 border-green-500 bg-green-50 text-green-700 font-semibold text-xs py-2.5 rounded-xl transition-all';
    document.getElementById('btn-type-sang').className = 'flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 font-semibold text-xs py-2.5 rounded-xl transition-all hover:border-green-300';
  } else {
    input.placeholder = 'Ex : Groupe A+, O-, B+, AB+...';
    label.textContent = 'Groupe sanguin recherché';
    document.getElementById('btn-type-sang').className = 'flex items-center justify-center gap-2 border-2 border-red-400 bg-red-50 text-red-600 font-semibold text-xs py-2.5 rounded-xl transition-all';
    document.getElementById('btn-type-med').className = 'flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 font-semibold text-xs py-2.5 rounded-xl transition-all hover:border-green-300';
  }
}

function selectModeAlerte(mode) {
  modeAlerte = mode;
  if (mode === 'whatsapp') {
    document.getElementById('champ-whatsapp').classList.remove('hidden');
    document.getElementById('champ-email').classList.add('hidden');
    document.getElementById('btn-whatsapp').className = 'flex items-center justify-center gap-2 border-2 border-green-500 bg-green-50 text-green-700 font-semibold text-xs py-2.5 rounded-xl transition-all';
    document.getElementById('btn-email').className = 'flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 font-semibold text-xs py-2.5 rounded-xl transition-all hover:border-green-300';
  } else {
    document.getElementById('champ-email').classList.remove('hidden');
    document.getElementById('champ-whatsapp').classList.add('hidden');
    document.getElementById('btn-email').className = 'flex items-center justify-center gap-2 border-2 border-green-500 bg-green-50 text-green-700 font-semibold text-xs py-2.5 rounded-xl transition-all';
    document.getElementById('btn-whatsapp').className = 'flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 font-semibold text-xs py-2.5 rounded-xl transition-all hover:border-green-300';
  }
}

function soumettreAlerte() {
  const produit = document.getElementById('alerte-produit').value.trim();
  const contact = modeAlerte === 'whatsapp'
    ? document.getElementById('alerte-whatsapp').value.trim()
    : document.getElementById('alerte-email').value.trim();
  if (!produit || !contact) {
    alert('Veuillez remplir le produit et votre contact.');
    return;
  }
  const msg = typeAlerte === 'medicament'
    ? `Vous serez alerté par ${modeAlerte === 'whatsapp' ? 'WhatsApp' : 'email'} dès que <strong>${produit}</strong> est disponible dans une pharmacie partenaire.`
    : `Vous serez alerté par ${modeAlerte === 'whatsapp' ? 'WhatsApp' : 'email'} dès que le groupe <strong>${produit}</strong> est disponible dans un hôpital partenaire.`;
  document.getElementById('msg-confirmation-alerte').innerHTML = msg;
  document.getElementById('overlay-alerte').classList.add('show');
  document.getElementById('alerte-produit').value = '';
  document.getElementById('alerte-whatsapp').value = '';
  document.getElementById('alerte-email').value = '';
}

function fermerAlerteOverlay(e) {
  if (!e || e.target === document.getElementById('overlay-alerte')) {
    document.getElementById('overlay-alerte').classList.remove('show');
  }
}

// ══════════════════════════════════════════
// CONSEILS SANTÉ
// ══════════════════════════════════════════
const conseils = [
  {
    badge: ' Médicaments',
    image: 'src/assets/conservemedoc.png',
    titre: 'Comment conserver ses médicaments correctement',
    contenu: `
      <p>La bonne conservation de vos médicaments est essentielle pour qu'ils restent efficaces et sans danger.</p>
      <p><strong> Température</strong><br/>La plupart des médicaments se conservent à température ambiante (15-25°C). Évitez les endroits chauds comme la cuisine ou la voiture. Certains comme l'insuline nécessitent le réfrigérateur — lisez toujours la notice.</p>
      <p><strong> Lumière et humidité</strong><br/>Gardez vos médicaments dans leur emballage d'origine, à l'abri de la lumière directe et de l'humidité. La salle de bain n'est pas un bon endroit — la vapeur d'eau les détériore.</p>
      <p><strong> Date de péremption</strong><br/>Ne consommez jamais un médicament périmé. Vérifiez la date avant chaque prise et rapportez les médicaments non utilisés à la pharmacie.</p>
      <p><strong> Sécurité</strong><br/>Rangez vos médicaments hors de portée des enfants, dans une armoire fermée à clé si possible.</p>
    `
  },
  {
    badge: ' Don de sang',
    image: 'src/assets/donsang1.png',
    titre: 'Qui peut donner son sang et à quelle fréquence ?',
    contenu: `
      <p>Le don de sang est un acte simple qui peut sauver jusqu'à 3 vies. Voici tout ce que vous devez savoir.</p>
      <p><strong> Critères pour donner</strong><br/>• Avoir entre 18 et 65 ans<br/>• Peser au minimum 50 kg<br/>• Être en bonne santé générale<br/>• Ne pas être à jeun le jour du don<br/>• Ne pas avoir pris d'antibiotiques récemment</p>
      <p><strong> Fréquence recommandée</strong><br/>• Hommes : toutes les 8 semaines (56 jours) maximum<br/>• Femmes : toutes les 12 semaines maximum<br/>• Chaque don représente environ 450 ml de sang</p>
      <p><strong> Bénéfices pour le donneur</strong><br/>Le don stimule la production de nouvelles cellules sanguines, constitue un bilan de santé gratuit, et réduit le risque de maladies cardiovasculaires selon certaines études.</p>
      <p><strong> Où donner à Brazzaville ?</strong><br/>Centre National de Transfusion Sanguine (CNTS) — Boulevard Denis Sassou Nguesso. Ouvert du lundi au vendredi de 7h à 15h.</p>
    `
  },
  {
    badge: ' Prévention',
    image: 'src/assets/prevention.png',
    titre: 'Gestes essentiels pour prévenir les infections courantes',
    contenu: `
      <p>À Brazzaville, quelques gestes simples au quotidien peuvent vous protéger de la majorité des infections courantes.</p>
      <p><strong> Lavage des mains</strong><br/>Lavez-vous les mains régulièrement avec de l'eau propre et du savon pendant au moins 20 secondes — avant les repas, après les toilettes, après les transports en commun.</p>
      <p><strong> Port du masque</strong><br/>En cas de symptômes respiratoires ou dans les lieux très fréquentés, portez un masque pour protéger les autres et vous-même.</p>
      <p><strong> Désinfection des surfaces</strong><br/>Nettoyez régulièrement les surfaces fréquemment touchées : poignées de portes, téléphone, robinets.</p>
      <p><strong> Vaccination</strong><br/>Respectez le calendrier vaccinal recommandé par le Ministère de la Santé du Congo. Les vaccins contre la fièvre jaune, la méningite et l'hépatite B sont essentiels.</p>
      <p><strong> Eau propre</strong><br/>Consommez uniquement de l'eau potable ou bouillie. Les infections gastro-intestinales sont souvent liées à l'eau contaminée.</p>
    `
  },
  {
    badge: ' Hôpitaux',
    image: 'src/assets/csi.webp',
    titre: 'Hôpitaux de référence au Congo en 2025',
    contenu: `
      <p>Voici les principaux établissements de santé à Brazzaville avec leurs spécialités.</p>
      <p><strong> CHU de Brazzaville</strong><br/>Avenue Auxence Ickonga — Établissement public de référence nationale. Urgences, chirurgie, maternité, pédiatrie, cardiologie.</p>
      <p><strong> Hôpital Adolphe Sicé</strong><br/>Rue Bouenza, Moungali — Spécialisé en médecine interne et chirurgie générale. Disponible 24h/7.</p>
      <p><strong> Hôpital de Base de Bacongo</strong><br/>Avenue du Djoué — Consultations générales, maternité, pédiatrie. Service d'urgences actif.</p>
      <p><strong> Centre Hospitalier de Talangaï</strong><br/>Nord de Brazzaville — Médecine générale, soins primaires, vaccination.</p>
      <p><strong> Clinique Nganga Edouard</strong><br/>Avenue de France, Centre-ville — Clinique privée spécialisée en chirurgie et imagerie médicale.</p>
      <p><strong> CNTS — Centre National de Transfusion Sanguine</strong><br/>Boulevard Denis Sassou Nguesso — Collecte de sang, analyses, transfusions. Lun-Ven 7h-15h.</p>
    `
  }
];

function ouvrirConseil(index) {
  const c = conseils[index];
  document.getElementById('conseil-badge').textContent = c.badge;
  document.getElementById('conseil-image').src = c.image;
  document.getElementById('conseil-image').alt = c.titre;
  document.getElementById('conseil-titre').textContent = c.titre;
  document.getElementById('conseil-contenu').innerHTML = c.contenu;
  document.getElementById('overlay-conseil').classList.add('show');
}

function fermerConseil(e) {
  if (e.target === document.getElementById('overlay-conseil')) {
    fermerConseilDirect();
  }
}

function fermerConseilDirect() {
  document.getElementById('overlay-conseil').classList.remove('show');
}

// 
// AUTHENTIFICATION
// 
function ouvrirInscription() {
  document.getElementById('overlay-inscription').classList.add('show');
}
function fermerInscription(e) {
  if (e.target === document.getElementById('overlay-inscription')) fermerInscriptionDirect();
}
function fermerInscriptionDirect() {
  document.getElementById('overlay-inscription').classList.remove('show');
}
function ouvrirConnexion() {
  document.getElementById('overlay-connexion').classList.add('show');
}
function fermerConnexion(e) {
  if (e.target === document.getElementById('overlay-connexion')) fermerConnexionDirect();
}
function fermerConnexionDirect() {
  document.getElementById('overlay-connexion').classList.remove('show');
}
function allerInscription() {
  fermerConnexionDirect();
  setTimeout(() => ouvrirInscription(), 200);
}
function allerConnexion() {
  fermerInscriptionDirect();
  setTimeout(() => ouvrirConnexion(), 200);
}
function soumettreInscription() {
  const nom = document.getElementById('ins-nom').value.trim();
  const tel = document.getElementById('ins-tel').value.trim();
  const email = document.getElementById('ins-email').value.trim();
  const mdp = document.getElementById('ins-mdp').value.trim();
  if (!nom || !tel || !email || !mdp) { alert('Veuillez remplir tous les champs.'); return; }
  if (mdp.length < 6) { alert('Le mot de passe doit contenir au moins 6 caractères.'); return; }
  fermerInscriptionDirect();
  document.getElementById('msg-inscription-ok').innerHTML =
    `Bienvenue <strong>${nom}</strong> ! Votre compte sera activé dès réception de votre paiement de 1 000 FCFA.`;
  document.getElementById('overlay-inscription-ok').classList.add('show');
  document.getElementById('ins-nom').value = '';
  document.getElementById('ins-tel').value = '';
  document.getElementById('ins-email').value = '';
  document.getElementById('ins-mdp').value = '';
}
function fermerInscriptionOk(e) {
  if (!e || e.target === document.getElementById('overlay-inscription-ok')) {
    document.getElementById('overlay-inscription-ok').classList.remove('show');
  }
}
function soumettreConnexion() {
  const email = document.getElementById('con-email').value.trim();
  const mdp = document.getElementById('con-mdp').value.trim();
  if (!email || !mdp) { alert('Veuillez remplir tous les champs.'); return; }
  fermerConnexionDirect();
  alert('Connexion réussie ! Bienvenue sur ElikyaPharma.');
  document.getElementById('con-email').value = '';
  document.getElementById('con-mdp').value = '';
}