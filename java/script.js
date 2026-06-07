
document.addEventListener('DOMContentLoaded', function() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    updateButtonText(theme);
    localStorage.setItem('theme', theme);
  }

  function updateButtonText(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = `<span>${theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}</span>`;
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  function addThemeToggleButton() {
    if (!document.getElementById('theme-toggle')) {
      const btn = document.createElement('button');
      btn.id = 'theme-toggle';
      btn.className = 'theme-toggle-btn';
      btn.setAttribute('aria-label', 'Переключить тему оформления');
      btn.addEventListener('click', toggleTheme);
      document.body.appendChild(btn);
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
  addThemeToggleButton();
});
(function() {
  const pinBtn = document.createElement('button');
  pinBtn.id = 'pin-btn';
  pinBtn.setAttribute('aria-label', 'Избранное');
  pinBtn.textContent = '📌';
  pinBtn.title = 'Избранное (кликните, чтобы открыть)';

  const favContainer = document.createElement('div');
  favContainer.id = 'favorites-compact';

  const favTitle = document.createElement('div');
  favTitle.textContent = 'Избранное';
  favTitle.style.cssText = `
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #F9F0FF;
  `;

  const favList = document.createElement('ul');
  favList.style.cssText = `
    margin: 0;
    padding: 0;
    list-style: none;
  `;

  favContainer.appendChild(favTitle);
  favContainer.appendChild(favList);

  document.body.appendChild(favContainer);
  document.body.appendChild(pinBtn);

  favContainer.style.display = 'none';

  pinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = favContainer.style.display === 'block';
    favContainer.style.display = isVisible ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!favContainer.contains(e.target) && e.target !== pinBtn) {
      favContainer.style.display = 'none';
    }
  });

  function addToFavorites(title) {
    const existing = Array.from(favList.children).find(li =>
      li.querySelector('.fav-text')?.textContent.startsWith(title)
    );
    if (existing) return;

    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    textSpan.className = 'fav-text';
    textSpan.textContent = title;

    const delBtn = document.createElement('span');
    delBtn.className = 'fav-del';
    delBtn.textContent = '✕';
    delBtn.onclick = (ev) => {
      ev.stopPropagation();
      li.remove();
    };

    li.appendChild(textSpan);
    li.appendChild(delBtn);
    favList.appendChild(li);
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.card, .card__content, .store-card, .type-item');
    if (!card) return;

    let title = '';
    if (card.querySelector('h4')) title = card.querySelector('h4').textContent.trim();
    else if (card.querySelector('h3')) title = card.querySelector('h3').textContent.trim();
    else if (card.querySelector('.type-label')) title = card.querySelector('.type-label').textContent.trim();
    else if (card.querySelector('.store-name')) title = card.querySelector('.store-name').textContent.trim();

    if (title) addToFavorites(title);
  });
})();
 

(function() {
  const form = document.getElementById('lashForm');
  const resultDiv = document.getElementById('matcherResult');

  const recommendations = {
    "8_B_natural": {
      model: "Ardell #21",
      description: "Эффект от ресниц — лифтинг, распахнутый взгляд, объём, а также максимально натуральный и естественный вид. Акцент сделан на середину века с деликатным объёмом. Такая модель подходит для миндалевидных, азиатских, круглых, больших и маленьких глаз, а также при нависшем веке.",
      imageUrl: "https://usanails.ru/image/cache/data/Ardell/Andrea/21-600x600.jpg"
    },
    "8_C_natural": {
      model: "Ardell #WISPIES",
      description: "Эта знаменитая модель ресниц подходит абсолютно всем благодаря продуманной конструкции. Удлинённые в центре ленты реснички визуально создают эффект распахнутого взгляда. Плетение «крест-накрест» максимально приближено к структуре натуральных ресниц, поэтому модель, несмотря на свою яркость, выглядит естественно. Акцент сделан на внешний край. Рекомендуется для миндалевидных, азиатских, круглых, больших глаз, при нависшем веке, а также для маленьких глаз.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_24yyijsZ63h26TiaXW4xb-fpTcjuDn3127KhaibxY761cd7nhC5x5s&s=10"
    },

    "8_D_natural": {
      model: "Ardell #743",
      description: "Оптимальное сочетание густоты и средней длины для яркого, запоминающегося образа. Удлинённая ресница по центру зрительно расширяет глаза и придаёт взгляду открытость. Эффект — лифтинг, натуральный, «распахнутый взгляд». Акцент сделан на центральную часть века. Ресницы подходят для миндалевидных, азиатских, круглых, больших и маленьких глаз, а также при нависшем веке.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbZUJir0SytlF5flNASql7HBAR3SnVHPrwO68xgxm1eQ&s=10" 
    },

    "8_B_volumetric": {
      model: "Ardell #21",
      description: "Эффект от ресниц — лифтинг, распахнутый взгляд, объём, а также максимально натуральный и естественный вид. Акцент сделан на середину века с деликатным объёмом. Такая модель подходит для миндалевидных, азиатских, круглых, больших и маленьких глаз, а также при нависшем веке.",
      imageUrl: "https://usanails.ru/image/cache/data/Ardell/Andrea/21-600x600.jpg"},

    
    "8_C_volumetric": {
      model: "Ardell #WISPIES",
      description: "Эта знаменитая модель ресниц подходит абсолютно всем благодаря продуманной конструкции. Удлинённые в центре ленты реснички визуально создают эффект распахнутого взгляда. Плетение «крест-накрест» максимально приближено к структуре натуральных ресниц, поэтому модель, несмотря на свою яркость, выглядит естественно. Акцент сделан на внешний край. Рекомендуется для миндалевидных, азиатских, круглых, больших глаз, при нависшем веке, а также для маленьких глаз.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_24yyijsZ63h26TiaXW4xb-fpTcjuDn3127KhaibxY761cd7nhC5x5s&s=10"
    },


    "8_D_volumetric": {
      model: "Ardell #511",
      description: "Удлинённые ресницы по центру создают эффект «кукольного» и распахнутого взгляда. Обеспечивает визуальный лифтинг, придаёт глазам выразительность и напоминает эффект подводки. Акцент сделан на ресничный край и объём. Идеально подходит для круглых, больших глаз и при нависшем веке.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6bvauyWMGgT5mTtwcQxlrqPJI5gEnDDk_fcQaReF4hw&s=10"
    },

    "10_C_natural": {
      model: "Ardell #340",
      description: "Обеспечивает эффект «распахнутых» глаз. Визуально увеличивает их размер благодаря тому, что самая длинная ресница находится ровно по центру.",
      imageUrl: "https://example.com/ardell_340.jpg"
    },

    "8_C_dramatic": {
      model: "Ardell #579",
      description: "Яркая модель, созданная для смелых образов, с акцентом на двойной объём. Она дарит эффект лифтинга, распахнутого взгляда и подходит для вечернего макияжа. Основной акцент приходится на середину века. Ресницы идеальны для миндалевидных, азиатских, круглых, больших и маленьких глаз.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThl4aZJa20Ahpe2SLN1EkuaIF4wNEa20o1Vot48ccBSw&s"
    },

    "8_D_dramatic": {
      model: "Ardell #13",
      description: "Эта яркая модель с густым объёмом специально создана для вечерних макияжей, а также фото- и видеосъёмок. Благодаря округлой форме взгляд становится кукольным, а тесьма визуально имитирует подводку. Эффект включает в себя 3D-объём, smoky eyes и кукольный взгляд. Акцент сделан на середину века. Ресницы подходят для миндалевидных, азиатских, круглых и больших глаз.",
      imageUrl: "https://static.tildacdn.com/tild6336-3837-4733-a436-663534663538/513_3.jpg"
    },

    "10_C_volumetric": {
      model: "Ardell #575",
      description: "Эта модель ресниц отличается универсальностью: она легко создаёт эффект густо прокрашенных ресниц для повседневного образа и при этом эффектно дополняет вечерний макияж со стрелками.",
      imageUrl: "https://static.tildacdn.com/tild6266-3764-4364-b534-323664373337/70487_1.jpg"
    },


    "12_B_natural": {
      model: "Ardell #174",
      description: "Невесомая модель деликатно и мягко удлиняет собственные ресницы. Длинные реснички у внешнего края добавляют макияжу кокетливости и игривости, формируя эффект кошачьего взгляда.",
      imageUrl: "https://static.tildacdn.com/tild3261-3765-4465-a531-653539323637/66523_1.jpg"
    },

    
    "12_C_natural": {
      model: "Ardell #162",
      description: "Универсальная модель с мягким акцентом на внешний уголок глаза. Двойной объём ресниц делает эффектным любой макияж. Мягкая тесьма точно повторяет изгибы века, поэтому ресницы совершенно не ощущаются на глазах.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhaTY-Ss1Y7ayOedG6GKagqzEEK2KvVhuK33lOedD-xg&s"
    },

    "12_C_volumetric": {
      model: "Ardell #162",
      description: "Универсальная модель с мягким акцентом на внешний уголок глаза. Двойной объём ресниц делает эффектным любой макияж. Мягкая тесьма точно повторяет изгибы века, поэтому ресницы совершенно не ощущаются на глазах.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhaTY-Ss1Y7ayOedG6GKagqzEEK2KvVhuK33lOedD-xg&s"
    },

    "14_B_natural": {
      model: "Ardell #152",
      description: "Эта модель создаёт эффект подводки благодаря сплошной ультрачёрной тесьме. Умеренный объём и удлинение к внешнему уголку глаза добавляют макияжу яркости — ведь ни одна тушь не способна дать такой результат, как накладные ресницы. Несмотря на выразительность модели, она выглядит натурально благодаря заострённым кончикам, которые имитируют собственные ресницы.",
      imageUrl: "https://pcdn.goldapple.ru/p/p/89000500006/web/696d674d61696e5064708ddc3c3b445c6a2.jpg"
    },

    "14_C_natural": {
      model: "Ardell #152",
      description: "Эта модель создаёт эффект подводки благодаря сплошной ультрачёрной тесьме. Умеренный объём и удлинение к внешнему уголку глаза добавляют макияжу яркости — ведь ни одна тушь не способна дать такой результат, как накладные ресницы. Несмотря на выразительность модели, она выглядит натурально благодаря заострённым кончикам, которые имитируют собственные ресницы.",
      imageUrl: "https://pcdn.goldapple.ru/p/p/89000500006/web/696d674d61696e5064708ddc3c3b445c6a2.jpg"
    },

    "14_D_natural": {
      model: "Ardell #152",
      description: "Эта модель создаёт эффект подводки благодаря сплошной ультрачёрной тесьме. Умеренный объём и удлинение к внешнему уголку глаза добавляют макияжу яркости — ведь ни одна тушь не способна дать такой результат, как накладные ресницы. Несмотря на выразительность модели, она выглядит натурально благодаря заострённым кончикам, которые имитируют собственные ресницы.",
      imageUrl: "https://pcdn.goldapple.ru/p/p/89000500006/web/696d674d61696e5064708ddc3c3b445c6a2.jpg"
    },
  };

  function getRecommendation(length, curl, effect) {
    const key = `${length}_${curl}_${effect}`;
    const rec = recommendations[key];
    if (rec) {
      return {
        text: `Рекомендуемая модель: ${rec.model}. ${rec.description}`,
        imageUrl: rec.imageUrl
      };
    } else {
      return {
        text: `Для комбинации (длина ${length}, изгиб ${curl}, эффект ${effect}) пока нет готовой рекомендации. Пожалуйста, свяжитесь с нами для подбора.`,
        imageUrl: null
      };
    }
  }

  if (form && resultDiv) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const length = document.getElementById('length').value;
      const curl = document.getElementById('curl').value;
      const effect = document.getElementById('effect').value;

      const { text: recommendationText, imageUrl } = getRecommendation(length, curl, effect);

      resultDiv.innerHTML = `
        <div class="matcher-result-card" style="background: var(--card-bg); border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow-lg);">
          <h3>Рекомендация.</h3>
          <p>${recommendationText}</p>
          ${imageUrl ? `<img src="${imageUrl}" alt="Рекомендованные ресницы" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;">` : ''}
        </div>
      `;
    });
  }
})();

(function() {
  function mockFetchSalesData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          data: [
            { product: 'Ardell Demi Wispies', oldPrice: 550, price: 440 },
            { product: 'Kiss Magnetic Lashes', oldPrice: 400, price: 340 }
          ]
        });

      }, 1000); 
    });
  }

  function calculateDiscount(oldPrice, price) {
    if (!oldPrice || oldPrice <= 0 || price >= oldPrice) return 0;
    return Math.round((1 - price / oldPrice) * 100);
  }

  const salesBtn = document.createElement('div');
  salesBtn.id = 'sales-badge';
  salesBtn.textContent = '🔥 Скидки';
  salesBtn.title = 'Горячие скидки (кликните, чтобы развернуть)';

  const salesContainer = document.createElement('div');
  salesContainer.id = 'sales-compact';

  const salesTitle = document.createElement('div');
  salesTitle.textContent = '🔥 Горячие скидки';

  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'sales-loading';
  loadingIndicator.textContent = 'Загрузка данных о скидках...';
  loadingIndicator.style.display = 'none';

  const errorMessage = document.createElement('div');
  errorMessage.id = 'sales-error';
  errorMessage.textContent = 'Данные временно недоступны. Показаны примеры.';
  errorMessage.style.cssText = `
    display: none;
    color: #666;
    font-style: italic;
    padding: 10px;
    background: #f9f9f9;
    border-left: 3px solid #ccc;
  `;

  const salesList = document.createElement('div');

  salesContainer.appendChild(salesTitle);
  salesContainer.appendChild(loadingIndicator);
  salesContainer.appendChild(errorMessage);
  salesContainer.appendChild(salesList);
  document.body.appendChild(salesContainer);
  document.body.appendChild(salesBtn);
  salesContainer.style.display = 'none';

  salesBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isVisible = salesContainer.style.display === 'block';

    if (!isVisible) {
      loadingIndicator.style.display = 'block';
      errorMessage.style.display = 'none';
      salesList.style.display = 'none';
    }

    salesContainer.style.display = isVisible ? 'none' : 'block';
  });

  document.addEventListener('click', function(e) {
    if (!salesContainer.contains(e.target) && e.target !== salesBtn) {
      salesContainer.style.display = 'none';
    }
  });

  mockFetchSalesData().then(function(result) {
    loadingIndicator.style.display = 'none';

    if (result.status === 'error') {
      errorMessage.style.display = 'block';
    } else {
      salesList.style.display = 'block';
      salesList.innerHTML = '';

      for (let i = 0; i < result.data.length; i++) {
        const item = result.data[i];
        const discount = calculateDiscount(item.oldPrice, item.price);
        if (discount === 0) continue;

        const card = document.createElement('div');
        card.className = 'sales-item';

        const info = document.createElement('div');
        info.className = 'sales-info';

        const strong = document.createElement('strong');
        strong.textContent = item.product;
        const spanDisc = document.createElement('span');
        spanDisc.className = 'sales-disc';
        spanDisc.textContent = '-' + discount + '% скидка';

        info.appendChild(strong);
        info.appendChild(spanDisc);

        const priceBlock = document.createElement('div');
        priceBlock.className = 'sales-price';

        const del = document.createElement('del');
        del.textContent = item.oldPrice + ' ₽';
        const newPriceSpan = document.createElement('span');
        newPriceSpan.className = 'price-new';
        newPriceSpan.textContent = item.price + ' ₽';

        priceBlock.appendChild(del);
        priceBlock.appendChild(newPriceSpan);

        card.appendChild(info);
        card.appendChild(priceBlock);
        salesList.appendChild(card);
      }
    }

    if (salesList.children.length === 0) {
      salesBtn.style.display = 'none';
    }
  }).catch(function(err) {
    console.error('Ошибка:', err);
    loadingIndicator.style.display = 'none';
    errorMessage.style.display = 'block';
  });
})();

