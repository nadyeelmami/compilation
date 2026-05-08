const countries = [
    { code: '212', name: 'Maroc', flag: 'https://flagcdn.com/ma.svg', len: 9, networks: ['5', '6', '7'], gender: 'le' },
    { code: '213', name: 'Algérie', flag: 'https://flagcdn.com/dz.svg', len: 9, networks: ['5', '6', '7'], gender: 'l\'' },
    { code: '216', name: 'Tunisie', flag: 'https://flagcdn.com/tn.svg', len: 8, networks: ['2', '4', '5', '9'], gender: 'la' },
    { code: '218', name: 'Libye', flag: 'https://flagcdn.com/ly.svg', len: 9, networks: ['9'], gender: 'la' },
    { code: '222', name: 'Mauritanie', flag: 'https://flagcdn.com/mr.svg', len: 8, networks: ['2', '3', '4'], gender: 'la' }
];
const phoneInput = document.getElementById('phone');
const cuteStatus = document.getElementById('cuteStatus');
const flagInputImg = document.getElementById('flagInputImg');
const flagInputIcon = document.querySelector('.flag-input-icon i');

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

document.getElementById('cuteAuthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const val = phoneInput.value.trim();
    
    if (!val.startsWith('+') && !val.startsWith('00')) {
        updateCuteStatus('error', 'fa-circle-xmark', 'Le numéro doit commencer par "+" ou "00".');
        return;
    }

    const dialCodeFull = val.replace(/^\+|00/, '');
    const country = countries.find(c => dialCodeFull.startsWith(c.code));

    if (!country) {
        updateCuteStatus('error', 'fa-ban', 'Indicatif non autorisé (Maghreb uniquement)');
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

            updateCuteStatus('error', 'fa-phone-slash', 
                `L'indicatif correspond ${prep} ${country.name}, mais cet opérateur n'est pas reconnu.`);
            return;
        }
    }
    if (count !== country.len) {
        updateCuteStatus('error', 'fa-triangle-exclamation', 
            `Format ${country.name} invalide.<br>Attendu: ${country.len} chiffres.`, count);
    } else {
        updateCuteStatus('success', 'fa-circle-check', `Succès ! Numéro ${country.name} valide.`);
    }
});

function updateCuteStatus(type, icon, message, count = null) {
    cuteStatus.className = `cute-status ${type}`;
    cuteStatus.innerHTML = `
        <i class="fa-solid ${icon}"></i> 
        <div>${message}</div>
        ${count !== null ? `<span class="badge-count">Saisi: ${count}</span>` : ''}
    `;
    cuteStatus.style.display = 'flex';
}
