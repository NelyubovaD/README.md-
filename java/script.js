
(function() {
  class ThemeManager {
  constructor() {
    this.btn = null;
    this.init();
  }
  init() {
    const saved = localStorage.getItem('theme') || 'light';
    this.applyTheme(saved);
    this.addToggleButton();
  }
  applyTheme(theme) {
    if (theme === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    this.updateButtonText(theme);
    localStorage.setItem('theme', theme);
  }
  updateButtonText(theme) {
    if (!this.btn) return;
    this.btn.textContent = '';
    const span = document.createElement('span');
    span.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    this.btn.appendChild(span);
  }
  addToggleButton() {
    if (document.getElementById('theme-toggle')) return;
    this.btn = document.createElement('button');
    this.btn.id = 'theme-toggle';
    this.btn.className = 'theme-toggle-btn';
    this.btn.setAttribute('aria-label', 'Переключить тему');
    this.btn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      this.applyTheme(isDark ? 'light' : 'dark');
    });
    document.body.appendChild(this.btn);
    this.updateButtonText(localStorage.getItem('theme') || 'light');
  }
}

  class FavoritesManager {
    constructor() {
      this.container = null;
      this.list = null;
      this.storageKey = 'favorites_list';
      this.init();
    }
    init() {
      this.createUI();
      this.loadFromStorage();
      this.setupDelegation();
    }
    createUI() {
      this.container = document.createElement('div');
      this.container.id = 'favorites-compact';
      this.container.style.cssText = `
        position: fixed; bottom: 80px; right: 20px; width: 250px;
        background: #2c2c2c; color: white; border-radius: 12px;
        padding: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000; display: none;
      `;
      const title = document.createElement('div');
      title.textContent = '⭐ Избранное';
      title.style.cssText = 'font-weight:bold; margin-bottom:8px;';
      this.list = document.createElement('ul');
      this.list.style.cssText = 'margin:0; padding:0; list-style:none; max-height:200px; overflow-y:auto;';
      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'Очистить всё';
      clearBtn.style.cssText = 'margin-top:8px; background:#ff9800; border:none; border-radius:4px; padding:4px 8px; cursor:pointer;';
      clearBtn.addEventListener('click', (e) => { e.stopPropagation(); this.clearAll(); });
      this.container.appendChild(title);
      this.container.appendChild(this.list);
      this.container.appendChild(clearBtn);
      const pinBtn = document.createElement('button');
      pinBtn.id = 'pin-btn';
      pinBtn.textContent = '📌';
      pinBtn.style.cssText = 'position:fixed; bottom:20px; right:20px; width:50px; height:50px; border-radius:50%; background:#ff5722; color:white; font-size:24px; border:none; cursor:pointer; z-index:1000;';
      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.container.style.display = this.container.style.display === 'block' ? 'none' : 'block';
      });
      document.body.appendChild(this.container);
      document.body.appendChild(pinBtn);
      document.addEventListener('click', (e) => {
        if (!this.container.contains(e.target) && e.target !== pinBtn) this.container.style.display = 'none';
      });
    }
    addFavorite(title) {
      const existing = Array.from(this.list.children).find(li => li.querySelector('.fav-text')?.textContent === title);
      if (existing) return;
      const li = document.createElement('li');
      li.style.cssText = 'display:flex; justify-content:space-between; margin-bottom:6px;';
      const span = document.createElement('span');
      span.className = 'fav-text';
      span.textContent = title;
      const del = document.createElement('span');
      del.textContent = '✕';
      del.style.cssText = 'cursor:pointer; color:#ff8888; margin-left:8px;';
      del.addEventListener('click', (ev) => { ev.stopPropagation(); li.remove(); this.saveToStorage(); });
      li.appendChild(span);
      li.appendChild(del);
      this.list.appendChild(li);
      this.saveToStorage();
    }
    clearAll() {
      while (this.list.firstChild) this.list.removeChild(this.list.firstChild);
      this.saveToStorage();
    }
    saveToStorage() {
      const items = Array.from(this.list.children).map(li => li.querySelector('.fav-text').textContent);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
    loadFromStorage() {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) JSON.parse(saved).forEach(t => this.addFavorite(t));
    }
    setupDelegation() {
      document.addEventListener('click', (e) => {
        const card = e.target.closest('.card, .card__content, .store-card, .type-item');
        if (!card) return;
        let title = card.querySelector('h4')?.textContent?.trim() || 
                    card.querySelector('h3')?.textContent?.trim() || 
                    card.querySelector('.type-label')?.textContent?.trim() || 
                    card.querySelector('.store-name')?.textContent?.trim();
        if (title) this.addFavorite(title);
      });
    }
  }

  class LashMatcher {
    constructor() {
      this.form = document.getElementById('lashForm');
      this.resultDiv = document.getElementById('matcherResult');
      this.recommendations = {
        "8_B_natural": { model: "Ardell #21", description: "Эффект от ресниц — лифтинг, распахнутый взгляд...", imageUrl: "https://usanails.ru/image/cache/data/Ardell/Andrea/21-600x600.jpg" },
        "8_C_natural": { model: "Ardell #WISPIES", description: "Удлинённые в центре реснички, эффект распахнутого взгляда...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_24yyijsZ63h26TiaXW4xb-fpTcjuDn3127KhaibxY761cd7nhC5x5s&s=10" },
        "8_D_natural": { model: "Ardell #743", description: "Оптимальное сочетание густоты и средней длины...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZUJir0SytlF5flNASql7HBAR3SnVHPrwO68xgxm1eQ&s=10" },
        "8_B_volumetric": { model: "Ardell #21", description: "Лифтинг, распахнутый взгляд, объём...", imageUrl: "https://usanails.ru/image/cache/data/Ardell/Andrea/21-600x600.jpg" },
        "8_C_volumetric": { model: "Ardell #WISPIES", description: "Удлинённые в центре реснички...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_24yyijsZ63h26TiaXW4xb-fpTcjuDn3127KhaibxY761cd7nhC5x5s&s=10" },
        "8_D_volumetric": { model: "Ardell #511", description: "Удлинённые ресницы по центру, кукольный взгляд...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6bvauyWMGgT5mTtwcQxlrqPJI5gEnDDk_fcQaReF4hw&s=10" },
        "10_C_natural": { model: "Ardell #340", description: "Эффект распахнутых глаз...", imageUrl: "https://example.com/ardell_340.jpg" },
        "8_C_dramatic": { model: "Ardell #579", description: "Яркая модель с двойным объёмом...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThl4aZJa20Ahpe2SLN1EkuaIF4wNEa20o1Vot48ccBSw&s" },
        "8_D_dramatic": { model: "Ardell #13", description: "Густой объём для вечерних макияжей...", imageUrl: "https://static.tildacdn.com/tild6336-3837-4733-a436-663534663538/513_3.jpg" },
        "10_C_volumetric": { model: "Ardell #575", description: "Универсальная модель...", imageUrl: "https://static.tildacdn.com/tild6266-3764-4364-b534-323664373337/70487_1.jpg" },
        "12_B_natural": { model: "Ardell #174", description: "Невесомая модель, кошачий взгляд...", imageUrl: "https://static.tildacdn.com/tild3261-3765-4465-a531-653539323637/66523_1.jpg" },
        "12_C_natural": { model: "Ardell #162", description: "Акцент на внешний уголок...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhaTY-Ss1Y7ayOedG6GKagqzEEK2KvVhuK33lOedD-xg&s" },
        "12_C_volumetric": { model: "Ardell #162", description: "Акцент на внешний уголок...", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhaTY-Ss1Y7ayOedG6GKagqzEEK2KvVhuK33lOedD-xg&s" },
        "14_B_natural": { model: "Ardell #152", description: "Эффект подводки...", imageUrl: "https://pcdn.goldapple.ru/p/p/89000500006/web/696d674d61696e5064708ddc3c3b445c6a2.jpg" },
        "14_C_natural": { model: "Ardell #152", description: "Эффект подводки...", imageUrl: "https://pcdn.goldapple.ru/p/p/89000500006/web/696d674d61696e5064708ddc3c3b445c6a2.jpg" },
        "14_D_natural": { model: "Ardell #152", description: "Эффект подводки...", imageUrl: "https://pcdn.goldapple.ru/p/p/89000500006/web/696d674d61696e5064708ddc3c3b445c6a2.jpg" }
      };
      if (this.form && this.resultDiv) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    }
    handleSubmit(e) {
      e.preventDefault();
      const length = document.getElementById('length').value;
      const curl = document.getElementById('curl').value;
      const effect = document.getElementById('effect').value;
      const key = `${length}_${curl}_${effect}`;
      const rec = this.recommendations[key];
      while (this.resultDiv.firstChild) this.resultDiv.removeChild(this.resultDiv.firstChild);
      const card = document.createElement('div');
      card.className = 'matcher-result-card';
      card.style.cssText = 'background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);';
      const h3 = document.createElement('h3');
      h3.textContent = 'Рекомендация.';
      card.appendChild(h3);
      const p = document.createElement('p');
      p.textContent = rec ? `Рекомендуемая модель: ${rec.model}. ${rec.description}` : `Для комбинации (длина ${length}, изгиб ${curl}, эффект ${effect}) пока нет готовой рекомендации.`;
      card.appendChild(p);
      if (rec && rec.imageUrl) {
        const img = document.createElement('img');
        img.src = rec.imageUrl;
        img.style.maxWidth = '100%';
        img.style.borderRadius = '8px';
        img.style.marginTop = '1rem';
        card.appendChild(img);
      }
      this.resultDiv.appendChild(card);
    }
  }

  class SalesWidget {
    constructor() {
      this.btn = null;
      this.container = null;
      this.listContainer = null;
      this.loading = null;
      this.errorMsg = null;
      this.initUI();
      this.initEvents();
    }
    initUI() {
      this.btn = document.createElement('div');
      this.btn.id = 'sales-badge';
      this.btn.textContent = '🔥 Скидки';
      this.btn.style.cssText = `
        position: fixed; bottom: 20px; left: 20px;
        background: #e91e63; color: white; padding: 10px 16px;
        border-radius: 40px; font-weight: bold; cursor: pointer;
        z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        font-family: sans-serif;
      `;
      this.btn.title = 'Горячие скидки (кликните)';
      
      this.container = document.createElement('div');
      this.container.id = 'sales-compact';
      this.container.style.cssText = `
        position: fixed; bottom: 80px; left: 20px; width: 280px;
        background: white; border-radius: 12px; padding: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); z-index: 1000;
        display: none; font-family: sans-serif; max-height: 400px;
        overflow-y: auto; border: 1px solid #ddd;
      `;
      const title = document.createElement('div');
      title.textContent = '🔥 Горячие скидки';
      title.style.cssText = 'font-weight:bold; margin-bottom:12px; font-size:1.1rem;';
      
      this.loading = document.createElement('div');
      this.loading.textContent = 'Загрузка...';
      this.loading.style.display = 'none';
      this.loading.style.padding = '10px';
      this.loading.style.textAlign = 'center';
      
      this.errorMsg = document.createElement('div');
      this.errorMsg.textContent = 'Не удалось загрузить скидки. Попробуйте позже.';
      this.errorMsg.style.cssText = 'display:none; color:#d32f2f; padding:10px; text-align:center;';
      
      this.listContainer = document.createElement('div');
      
      this.container.appendChild(title);
      this.container.appendChild(this.loading);
      this.container.appendChild(this.errorMsg);
      this.container.appendChild(this.listContainer);
      document.body.appendChild(this.container);
      document.body.appendChild(this.btn);
    }
    
    initEvents() {
      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = this.container.style.display === 'block';
        if (!isVisible) {
          this.loadSalesData();
        }
        this.container.style.display = isVisible ? 'none' : 'block';
      });
      document.addEventListener('click', (e) => {
        if (!this.container.contains(e.target) && e.target !== this.btn) {
          this.container.style.display = 'none';
        }
      });
    }
    
    async loadSalesData() {
      this.loading.style.display = 'block';
      this.errorMsg.style.display = 'none';
      while (this.listContainer.firstChild) {
        this.listContainer.removeChild(this.listContainer.firstChild);
      }
      this.listContainer.style.display = 'none';
      
      try {
        const response = await fetch('https://fakestoreapi.com/products?limit=5');
        if (!response.ok) throw new Error('Ошибка сети');
        const products = await response.json();
        console.log('Скидки загружены:', products);
        this.renderSales(products);
      } catch (error) {
        console.error('Ошибка загрузки скидок:', error);
        this.errorMsg.style.display = 'block';
      } finally {
        this.loading.style.display = 'none';
      }
    }
    
    renderSales(products) {
      if (!products || products.length === 0) {
        this.errorMsg.style.display = 'block';
        return;
      }
      this.listContainer.style.display = 'block';
      let hasDiscount = false;
      for (const prod of products) {
        const oldPrice = prod.price * (1 + (Math.random() * 0.3 + 0.1));
        const newPrice = prod.price;
        const discount = Math.round((1 - newPrice / oldPrice) * 100);
        if (discount < 5) continue;
        hasDiscount = true;
        
        const card = document.createElement('div');
        card.style.cssText = 'border-bottom:1px solid #eee; padding:8px 0; margin-bottom:4px;';
        
        const name = document.createElement('div');
        name.textContent = prod.title.length > 40 ? prod.title.slice(0,40)+'…' : prod.title;
        name.style.fontWeight = 'bold';
        
        const discountSpan = document.createElement('span');
        discountSpan.textContent = `-${discount}%`;
        discountSpan.style.cssText = 'background:#e91e63; color:white; border-radius:12px; padding:2px 8px; font-size:0.7rem; margin-left:8px;';
        name.appendChild(discountSpan);
        
        const priceBlock = document.createElement('div');
        priceBlock.style.marginTop = '6px';
        const oldSpan = document.createElement('del');
        oldSpan.textContent = Math.round(oldPrice) + ' ₽';
        oldSpan.style.color = '#999';
        oldSpan.style.marginRight = '8px';
        const newSpan = document.createElement('span');
        newSpan.textContent = Math.round(newPrice) + ' ₽';
        newSpan.style.color = '#e91e63';
        newSpan.style.fontWeight = 'bold';
        priceBlock.appendChild(oldSpan);
        priceBlock.appendChild(newSpan);
        
        card.appendChild(name);
        card.appendChild(priceBlock);
        this.listContainer.appendChild(card);
      }
      if (!hasDiscount) {
        const sample = document.createElement('div');
        sample.textContent = 'Специальные предложения скоро появятся!';
        sample.style.padding = '10px';
        sample.style.textAlign = 'center';
        this.listContainer.appendChild(sample);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new FavoritesManager();
    new LashMatcher();
    new SalesWidget();
  });
})();