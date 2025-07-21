document.addEventListener('DOMContentLoaded', () => {

    const languageSwitcher = document.querySelector('.language-switcher');
    const langButtons = languageSwitcher.querySelectorAll('a');
    
    const changeLanguage = async (lang) => {
        localStorage.setItem('language', lang);
        
        const response = await fetch(`assets/lang/${lang}.json`);
        const translations = await response.json();

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    };

    langButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            const lang = button.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });

    const savedLanguage = localStorage.getItem('language') || 'en'; // Inglés por defecto
    changeLanguage(savedLanguage);
});