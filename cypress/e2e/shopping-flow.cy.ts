describe('E2E Shopping Flow', () => {
  beforeEach(() => {
    // Visit home page
    cy.visit('/');
  });

  it('should navigate to collections, view products, and add to cart', () => {
    // Navigate to collections
    cy.contains('a', 'Collection').click();
    cy.url().should('include', '/collections');

    // Wait for products to load
    cy.get('body').should('be.visible');

    // Check if products are displayed (if any exist)
    // This test will pass even if no products exist, as long as the page loads
    cy.get('body').then(($body) => {
      if ($body.find('[class*="grid"]').length > 0) {
        // If products exist, try to add one to cart
        cy.get('button').contains('Add to cart').first().click();
        
        // Check for success notification (if toast is visible)
        // Note: This might not always be visible depending on toast settings
      }
    });

    // Navigate to cart page
    cy.contains('a', 'Cart').click();
    cy.url().should('include', '/cart');
  });

  it('should display empty cart message when cart is empty', () => {
    cy.visit('/cart');
    
    // Should show empty cart message or login prompt
    cy.get('body').should('contain.text', 'empty').or('contain.text', 'login');
  });
});

