describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    // Устанавливаем токены авторизации перед переходом на страницу
    cy.setCookie('accessToken', 'Bearer test-access-token', {
      path: '/'
    });
    
    // Переходим на главную страницу и устанавливаем localStorage
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем токены после каждого теста
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookie('accessToken');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим первую булку и кликаем на кнопку "Добавить"
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });

    it('должен добавить начинку в конструктор', () => {
      // Переключаемся на вкладку "Начинки"
      cy.contains('Начинки').click();
      
      // Находим начинку и кликаем на кнопку "Добавить"
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что начинка появилась в конструкторе
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });

    it('должен добавить соус в конструктор', () => {
      // Переключаемся на вкладку "Соусы"
      cy.contains('Соусы').click();
      
      // Находим соус и кликаем на кнопку "Добавить"
      cy.contains('Соус Spicy-X').should('be.visible');
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что соус появился в конструкторе
      cy.contains('Соус Spicy-X').should('be.visible');
    });

    it('должен добавить булку и начинку в конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Начинки').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем наличие обоих ингредиентов
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      // Кликаем на ингредиент (не на кнопку "Добавить")
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Кликаем на крестик (кнопка закрытия в header модального окна)
      // Модальное окно рендерится в портале #modals, ищем кнопку там
      cy.get('#modals').within(() => {
        // Ищем кнопку закрытия - она находится в header и содержит SVG (CloseIcon)
        cy.get('button[type="button"]').first().click();
      });

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');

      // Кликаем на оверлей (вне модального окна)
      cy.get('body').click(0, 0);

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен отображать данные выбранного ингредиента в модальном окне', () => {
      // Открываем модальное окно для булки
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('a')
        .first()
        .click();

      // Проверяем данные ингредиента в модальном окне
      cy.contains('Детали ингредиента').should('be.visible');
      
      // Проверяем данные внутри модального окна (используем exist вместо visible для элементов, которые могут быть обрезаны)
      cy.get('#modals').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('420').should('exist'); // калории
        cy.contains('80').should('exist'); // белки
        cy.contains('24').should('exist'); // жиры
        cy.contains('53').should('exist'); // углеводы
      });

      // Закрываем модальное окно
      cy.get('#modals').within(() => {
        cy.get('button[type="button"]').first().click();
      });

      // Открываем модальное окно для начинки
      cy.contains('Начинки').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('a')
        .first()
        .click();

      // Проверяем данные начинки в модальном окне
      cy.contains('Детали ингредиента').should('be.visible');
      cy.get('#modals').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });
  });

  describe('Создание заказа', () => {
    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Начинки').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем запроса создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с заказом открылось
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('12345').should('be.visible'); // номер заказа из мока
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Начинки').click();
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем запроса создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось
      cy.contains('идентификатор заказа').should('be.visible');

      // Закрываем модальное окно
      cy.get('#modals').within(() => {
        cy.get('button[type="button"]').first().click();
      });

      // Проверяем, что модальное окно закрылось
      cy.contains('идентификатор заказа').should('not.exist');

      // Проверяем, что конструктор очищен
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});


