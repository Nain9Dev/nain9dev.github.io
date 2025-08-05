document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.querySelector('.language-switcher');
    
    if (!languageSwitcher) {
        console.warn('Language switcher not found');
        return;
    }
    
    const langButtons = languageSwitcher.querySelectorAll('a[data-lang]');
    
    const changeLanguage = async (lang) => {
        try {
            // Store selected language
            localStorage.setItem('language', lang);
            
            // Fetch translations
            const response = await fetch(`assets/lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${lang}.json`);
            }
            
            const translations = await response.json();

            // Update page title
            if (translations.page_title) {
                document.title = translations.page_title;
            }

            // Update all elements with data-key attributes
            document.querySelectorAll('[data-key]').forEach(element => {
                const key = element.getAttribute('data-key');
                if (translations[key]) {
                    // Check if element is an input and update placeholder
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            });

            // Update active language indicator
            langButtons.forEach(btn => btn.classList.remove('active'));
            const activeButton = document.querySelector(`[data-lang="${lang}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }

            // Smooth fade effect
            document.body.style.opacity = '0.8';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 200);

        } catch (error) {
            console.error('Error changing language:', error);
            // Fallback to English if error occurs
            if (lang !== 'en') {
                changeLanguage('en');
            }
        }
    };

    // Add click event listeners to language buttons
    langButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            const lang = button.getAttribute('data-lang');
            if (lang) {
                changeLanguage(lang);
            }
        });
    });

    // Load saved language or default to English
    const savedLanguage = localStorage.getItem('language') || 'en';
    changeLanguage(savedLanguage);
});