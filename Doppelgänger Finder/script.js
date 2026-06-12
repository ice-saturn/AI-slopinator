const vstupSoubor = document.getElementById('vstup-soubor');
const nahledObrazku = document.getElementById('nahled-obrazku');
const placeholderText = document.getElementById('placeholder-text');

const btnHledat = document.getElementById('btn-hledat');
const progressBar = document.getElementById('progress-bar');
const shodaCislo = document.getElementById('shoda-cislo');
const statusText = document.getElementById('status-text');

const popupModal = document.getElementById('popup-modal');
const btnZavrit = document.getElementById('btn-zavrit');

// 1. OBLUHA NAHRÁVÁNÍ OBRÁZKU
vstupSoubor.addEventListener('change', function() {
    const soubor = this.files[0];

    if (soubor) {
        const ctenar = new FileReader();

        ctenar.addEventListener('load', function() {
            nahledObrazku.setAttribute('src', this.result);
            nahledObrazku.style.display = 'block'; 
            placeholderText.style.display = 'none'; // Schováme text
        });

        ctenar.readAsDataURL(soubor);
    } else {
        nahledObrazku.style.display = 'none';
        placeholderText.style.display = 'block';
        nahledObrazku.setAttribute('src', '');
    }
});

// 2. LOGIKA ODPOČÍTÁVÁNÍ A PROGRESS BARU
btnHledat.addEventListener('click', function() {
    // Validace, zda jsou vyplněná pole (volitelné, ale doporučené)
    if(document.getElementById('name').value === "" || !vstupSoubor.files[0]) {
        alert("Prosím vyplňte jméno a nahrajte fotografii!");
        return;
    }

    // Reset a příprava na animaci
    btnHledat.disabled = true;
    statusText.innerText = "DNA and facial features analysis underway...";
    shodaCislo.classList.add('aktivni-odpocet');
    
    let aktualniProcenta = 0;
    let lideNaZemi = 8100000000; // Začínáme na populaci Země
    
    // Délka animace v ms (např. 5000 ms = 5 vteřin)
    const celkovyCas = 5000; 
    const intervalCas = 30; // Jak často se bude bar aktualizovat (v ms)
    const kroky = celkovyCas / intervalCas;
    
    const casovac = setInterval(function() {
        aktualniProcenta += (100 / kroky);
        if (aktualniProcenta > 100) aktualniProcenta = 100;
        
        // Aktualizace progress baru
        progressBar.style.width = aktualniProcenta + '%';
        
        // Exponenciální nebo rychlé snižování počtu lidí dolů k 1
        let zbyleProcento = (100 - aktualniProcenta) / 100;
        // Použijeme mocninu, aby číslo padalo na začátku obrovskou rychlostí
        let aktualniLide = Math.ceil(Math.pow(zbyleProcento, 4) * (lideNaZemi - 1)) + 1;
        
        // Formátování čísla s mezerami pro lepší čitelnost
        shodaCislo.innerText = aktualniLide.toLocaleString('cs-CZ');

        // Konec načítání
        if (aktualniProcenta >= 100) {
            clearInterval(casovac);
            shodaCislo.innerText = "1";
            statusText.innerText = "Scan complete.";
            btnHledat.disabled = false;
            
            // Zobrazení pop-upu
            popupModal.style.display = 'flex';
        }
    }, intervalCas);
});

// 3. ZAVŘENÍ POP-UP OKNA
btnZavrit.addEventListener('click', function() {
    popupModal.style.display = 'none';
    // Reset prvků po zavření
    progressBar.style.width = '0%';
    shodaCislo.innerText = "waiting for launch";
    shodaCislo.classList.remove('aktivni-odpocet');
    statusText.innerText = "Ready for scan.";
});