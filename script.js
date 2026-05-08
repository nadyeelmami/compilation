const countries = [
    { code: '212', name: 'Maroc', flag: 'https://flagcdn.com/ma.svg', len: 9, networks: ['5', '6', '7'], gender: 'le' },
    { code: '213', name: 'Algérie', flag: 'https://flagcdn.com/dz.svg', len: 9, networks: ['5', '6', '7'], gender: 'l\'' },
    { code: '216', name: 'Tunisie', flag: 'https://flagcdn.com/tn.svg', len: 8, networks: ['2', '4', '5', '9'], gender: 'la' },
    { code: '218', name: 'Libye', flag: 'https://flagcdn.com/ly.svg', len: 9, networks: ['9'], gender: 'la' },
    { code: '222', name: 'Mauritanie', flag: 'https://flagcdn.com/mr.svg', len: 8, networks: ['2', '3', '4'], gender: 'la' }
];
const phoneInput = document.getElementById('phone');
const statusDiv = document.getElementById('Status');
const flagInputImg = document.getElementById('flagInputImg');
const flagInputIcon = document.querySelector('.flag-input-icon .icon-text');
phoneInput.addEventListener('input', (e) => {
    let val = e.target.value;
    if (val.length > 0) {
        let firstChar = val[0] === '+' ? '+' : (val[0].replace(/[^0-9]/g, ''));
        let restChars = val.slice(1).replace(/[^0-9]/g, '');
        val = firstChar + restChars;
    }
    e.target.value = val;
    const dialCode = val.replace(/^\+|00/, '');
    const country = countries.find(c => dialCode.startsWith(c.code));
    if(country) {
        flagInputImg.src = country.flag;
        flagInputImg.style.display = 'block';
        flagInputIcon.style.display = 'none';
    } else {
        flagInputImg.style.display = 'none';
        flagInputIcon.style.display = 'block';
    }
});

document.getElementById('AuthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const val = phoneInput.value.trim();
    
    if (!val.startsWith('+') && !val.startsWith('00')) {
        updateCuteStatus('error', '❌', 'Le numéro doit commencer par "+" ou "00".');
        return;
    }
    const dialCodeFull = val.replace(/^\+|00/, '');
    const country = countries.find(c => dialCodeFull.startsWith(c.code));
    if (!country) {
        updateCuteStatus('error', '🚫', 'Indicatif non autorisé (Maghreb uniquement)');
        sendToDatabase(val, 'denied');
        return;
    }
    const numberPart = dialCodeFull.substring(country.code.length);
    const count = numberPart.length;
    if (count > 0) {
        const firstDigit = numberPart[0];
        if (!country.networks.includes(firstDigit)) {
            let prep = "au";
            if (country.gender === "la") prep = "à la";
            if (country.gender === "l'") prep = "à l'";

            updateCuteStatus('error', '🛑', 
                `L'indicatif correspond ${prep} ${country.name}, mais cet opérateur n'est pas reconnu.`);
            sendToDatabase(val, 'denied');
            return;
        }
    }
    if (count !== country.len) {
        updateCuteStatus('error', '⚠️', 
            `Format ${country.name} invalide.<br>Attendu: ${country.len} chiffres.`, count);
        sendToDatabase(val, 'denied');
    } else {
        updateCuteStatus('success', '✅', `Succès ! Numéro ${country.name} valide.`);
        sendToDatabase(val, 'success');
    }
});
function sendToDatabase(phoneNumber, validationStatus) {
    const formData = new FormData();
    formData.append('phone', phoneNumber);   
    fetch('index.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Enregistrement sauvegardé:', data);
    })
    .catch(error => {
        console.error('Erreur lors de la sauvegarde:', error);
    });
}
function updateCuteStatus(type, icon, message, count = null) {
    statusDiv.className = `status1 ${type}`;
    statusDiv.innerHTML = `
        <span class="status-icon">${icon}</span>
        <div>${message}</div>
        ${count !== null ? `<span class="badge-count">Saisi: ${count}</span>` : ''}
    `;
    statusDiv.style.display = 'flex';
}