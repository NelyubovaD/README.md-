
document.addEventListener('DOMContentLoaded', function() {
    function showNotification(message, type = 'info') {
        let existingNote = document.querySelector('.custom-notification');
        if (existingNote) existingNote.remove();

        const note = document.createElement('div');
        note.className = 'custom-notification';          
        note.textContent = message;                     

        if (type === 'success') note.classList.add('note-success');
        if (type === 'error') note.classList.add('note-error');

        note.style.position = 'fixed';
        note.style.bottom = '20px';
        note.style.right = '20px';
        note.style.backgroundColor = type === 'error' ? '#ff6b6b' : '#7c5e9e';
        note.style.color = 'white';
        note.style.padding = '10px 20px';
        note.style.borderRadius = '30px';
        note.style.fontSize = '14px';
        note.style.zIndex = '9999';
        note.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        note.style.fontWeight = 'bold';
        note.style.opacity = '0';
        note.style.transition = 'opacity 0.3s';
        document.body.appendChild(note);
  
        setTimeout(() => { note.style.opacity = '1'; }, 10);
  
        setTimeout(() => {
            note.style.opacity = '0';
            setTimeout(() => note.remove(), 300);
        }, 3000);
    }

    function smoothScrollTo(selector) {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',      
                block: 'start'           
            });
        }
    }
    const scrollBtn = document.createElement('button');
    scrollBtn.textContent = '⬆ Наверх';
    scrollBtn.id = 'scrollToTopBtn';
    scrollBtn.style.position = 'fixed';
    scrollBtn.style.bottom = '30px';
    scrollBtn.style.right = '30px';
    scrollBtn.style.backgroundColor = '#a16ad4';
    scrollBtn.style.color = 'white';
    scrollBtn.style.border = 'none';
    scrollBtn.style.borderRadius = '50px';
    scrollBtn.style.padding = '10px 18px';
    scrollBtn.style.cursor = 'pointer';
    scrollBtn.style.fontSize = '16px';
    scrollBtn.style.fontWeight = 'bold';
    scrollBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    scrollBtn.style.zIndex = '1000';
    scrollBtn.style.display = 'none';  
    scrollBtn.style.transition = 'all 0.2s';

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {       
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });

    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();                    
            const targetId = this.getAttribute('href'); 
            smoothScrollTo(targetId);
        });
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
       
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.style.backgroundColor = 'rgba(255,255,255,0.3)';
            link.style.fontWeight = 'bold';
            link.style.borderRadius = '40px';
            link.style.padding = '0.6rem 1.2rem';
        }
    });

    const usageTable = document.querySelector('table tbody'); 
    if (usageTable && window.location.pathname.includes('eyelash-care.html')) {

        const rows = usageTable.querySelectorAll('tr');
        rows.forEach((row, index) => {

            const actionCell = document.createElement('td');
            const counterSpan = document.createElement('span');
            counterSpan.textContent = '0';   
            counterSpan.style.margin = '0 8px';
            counterSpan.style.fontWeight = 'bold';
            const incBtn = document.createElement('button');
            incBtn.textContent = '+1';
            incBtn.className = 'btn-small';
            incBtn.style.padding = '2px 8px';
            incBtn.style.margin = '0 4px';
            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'сброс';
            resetBtn.className = 'btn-small';
            resetBtn.style.padding = '2px 8px';
            resetBtn.style.backgroundColor = '#ccc';

            const storageKey = `usage_count_${index}`;
            let savedCount = localStorage.getItem(storageKey);
            if (savedCount !== null) {
                counterSpan.textContent = savedCount;
            }

            incBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                let current = parseInt(counterSpan.textContent);
                current++;
                counterSpan.textContent = current;
                localStorage.setItem(storageKey, current);
                showNotification(`Использований: ${current}`, 'success');
            });

            resetBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                counterSpan.textContent = '0';
                localStorage.setItem(storageKey, '0');
                showNotification('Счётчик сброшен', 'info');
            });

            actionCell.appendChild(incBtn);
            actionCell.appendChild(counterSpan);
            actionCell.appendChild(resetBtn);
            row.appendChild(actionCell);
        });
      
        const tableHead = document.querySelector('table thead tr');
        if (tableHead) {
            const th = document.createElement('th');
            th.textContent = 'Счётчик использований';
            tableHead.appendChild(th);
        }
    }

    const brandTable = document.querySelector('table'); 
    if (brandTable && window.location.pathname.includes('reviews.html')) {

        const filterContainer = document.createElement('div');
        filterContainer.style.margin = '10px 0 20px';
        const filterLabel = document.createElement('label');
        filterLabel.textContent = ' Фильтр по бренду: ';
        filterLabel.style.fontWeight = 'bold';
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = 'Введите название...';
        filterInput.style.padding = '8px';
        filterInput.style.borderRadius = '30px';
        filterInput.style.border = '1px solid #e2cbe8';
        filterInput.style.width = '250px';

        filterContainer.appendChild(filterLabel);
        filterContainer.appendChild(filterInput);

        brandTable.parentNode.insertBefore(filterContainer, brandTable);

        filterInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const rows = brandTable.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const brandCell = row.cells[0];
                if (brandCell) {
                    const brandName = brandCell.textContent.toLowerCase();
                    if (brandName.includes(query)) {
                        row.style.display = '';      
                        row.style.display = 'none';   
                    }
                }
            });
        });
    }

    const storeCards = document.querySelectorAll('.card');
    if (storeCards.length && window.location.pathname.includes('buy.html')) {
        storeCards.forEach(card => {
            const shareBtn = document.createElement('button');
            shareBtn.textContent = ' Поделиться';
            shareBtn.className = 'btn-small';
            shareBtn.style.marginTop = '10px';
            shareBtn.style.backgroundColor = '#9b6bcf';
            shareBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const storeName = card.querySelector('h4')?.innerText || 'магазин';
                showNotification(`Ссылка на ${storeName} скопирована в буфер (демо)`, 'success');
            });
            card.appendChild(shareBtn);
        });
    }
});