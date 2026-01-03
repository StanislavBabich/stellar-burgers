// Константы для селекторов
const BUN_NAME = 'Краторная булка N-200i';
const BUN_TOP_TEXT = 'Краторная булка N-200i (верх)';
const BUN_BOTTOM_TEXT = 'Краторная булка N-200i (низ)';
const MAIN_INGREDIENT_NAME = 'Биокотлета из марсианской Магнолии';
const SAUCE_NAME = 'Соус Spicy-X';
const FILLINGS_TAB = 'Начинки';
const INGREDIENT_DETAILS_TEXT = 'Детали ингредиента';
const ORDER_BUTTON_TEXT = 'Оформить заказ';
const ORDER_ID_TEXT = 'идентификатор заказа';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Очищаем токены перед каждым тестом
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });

    // Перехватываем запросы к API
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

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

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Добавляем булку в конструктор
      cy.addIngredientToConstructor(BUN_NAME);

      // Проверяем, что булка появилась в конструкторе
      cy.contains(BUN_TOP_TEXT).should('be.visible');
      cy.contains(BUN_BOTTOM_TEXT).should('be.visible');
    });

    it('должен добавить начинку в конструктор', () => {
      // Переключаемся на вкладку "Начинки"
      cy.switchToTab(FILLINGS_TAB);

      // Добавляем начинку в конструктор
      cy.addIngredientToConstructor(MAIN_INGREDIENT_NAME);

      // Проверяем, что начинка появилась в конструкторе
      cy.contains(MAIN_INGREDIENT_NAME).should('be.visible');
    });

    it('должен добавить соус в конструктор', () => {
      // Переключаемся на вкладку "Соусы"
      cy.switchToTab('Соусы');

      // Добавляем соус в конструктор
      cy.addIngredientToConstructor(SAUCE_NAME);

      // Проверяем, что соус появился в конструкторе
      cy.contains(SAUCE_NAME).should('be.visible');
    });

    it('должен добавить булку и начинку в конструктор', () => {
      // Добавляем булку
      cy.addIngredientToConstructor(BUN_NAME);

      // Добавляем начинку
      cy.switchToTab(FILLINGS_TAB);
      cy.addIngredientToConstructor(MAIN_INGREDIENT_NAME);

      // Проверяем наличие обоих ингредиентов
      cy.contains(BUN_TOP_TEXT).should('be.visible');
      cy.contains(MAIN_INGREDIENT_NAME).should('be.visible');
      cy.contains(BUN_BOTTOM_TEXT).should('be.visible');
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('должен открыть модальное окно при клике на ингредиент', () => {
      // Открываем модальное окно ингредиента
      cy.openIngredientModal(BUN_NAME);

      // Проверяем, что модальное окно открылось
      cy.contains(INGREDIENT_DETAILS_TEXT).should('be.visible');
      cy.contains(BUN_NAME).should('be.visible');
    });

    it('должен закрыть модальное окно при клике на крестик', () => {
      // Открываем модальное окно
      cy.openIngredientModal(BUN_NAME);

      // Проверяем, что модальное окно открылось
      cy.contains(INGREDIENT_DETAILS_TEXT).should('be.visible');

      // Закрываем модальное окно
      cy.closeModal();

      // Проверяем, что модальное окно закрылось
      cy.contains(INGREDIENT_DETAILS_TEXT).should('not.exist');
    });

    it('должен закрыть модальное окно при клике на оверлей', () => {
      // Открываем модальное окно
      cy.openIngredientModal(BUN_NAME);

      // Проверяем, что модальное окно открылось
      cy.contains(INGREDIENT_DETAILS_TEXT).should('be.visible');

      // Кликаем на оверлей
      cy.get('body').click(0, 0);

      // Проверяем, что модальное окно закрылось
      cy.contains(INGREDIENT_DETAILS_TEXT).should('not.exist');
    });

    it('должен отображать данные выбранного ингредиента в модальном окне', () => {
      // Открываем модальное окно для булки
      cy.openIngredientModal(BUN_NAME);

      // Проверяем данные ингредиента в модальном окне
      cy.contains(INGREDIENT_DETAILS_TEXT).should('be.visible');

      // Проверяем данные внутри модального окна
      cy.get('#modals').within(() => {
        cy.contains(BUN_NAME).should('exist');
        cy.contains('420').should('exist'); // калории
        cy.contains('80').should('exist'); // белки
        cy.contains('24').should('exist'); // жиры
        cy.contains('53').should('exist'); // углеводы
      });

      // Закрываем модальное окно
      cy.closeModal();

      // Открываем модальное окно для начинки
      cy.switchToTab(FILLINGS_TAB);
      cy.openIngredientModal(MAIN_INGREDIENT_NAME);

      // Проверяем данные начинки в модальном окне
      cy.contains(INGREDIENT_DETAILS_TEXT).should('be.visible');
      cy.get('#modals').within(() => {
        cy.contains(MAIN_INGREDIENT_NAME).should('exist');
      });
    });
  });

  describe('Создание заказа', () => {
    it('должен создать заказ и отобразить модальное окно с номером заказа', () => {
      // Добавляем булку и начинку
      cy.addBurgerForOrder(BUN_NAME, FILLINGS_TAB, MAIN_INGREDIENT_NAME);

      // Кликаем на кнопку "Оформить заказ"
      cy.contains(ORDER_BUTTON_TEXT).click();

      // Ждем запроса создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с заказом открылось
      cy.contains(ORDER_ID_TEXT).should('be.visible');
      cy.contains('12345').should('be.visible'); // номер заказа из мока
    });

    it('должен закрыть модальное окно заказа и очистить конструктор', () => {
      // Добавляем булку и начинку
      cy.addBurgerForOrder(BUN_NAME, FILLINGS_TAB, MAIN_INGREDIENT_NAME);

      // Кликаем на кнопку "Оформить заказ"
      cy.contains(ORDER_BUTTON_TEXT).click();

      // Ждем запроса создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось
      cy.contains(ORDER_ID_TEXT).should('be.visible');

      // Закрываем модальное окно
      cy.closeModal();

      // Проверяем, что модальное окно закрылось
      cy.contains(ORDER_ID_TEXT).should('not.exist');

      // Проверяем, что конструктор очищен
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
}); 
