/**
 * Unit test for cart total calculation
 */
describe('Cart calculations', () => {
  interface CartItem {
    precio: number;
    quantity: number;
  }

  function calculateCartTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.precio * item.quantity), 0);
  }

  test('calculates total for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  test('calculates total for single item', () => {
    const items: CartItem[] = [
      { precio: 100, quantity: 1 }
    ];
    expect(calculateCartTotal(items)).toBe(100);
  });

  test('calculates total for multiple items with quantities', () => {
    const items: CartItem[] = [
      { precio: 50, quantity: 2 },
      { precio: 75, quantity: 1 },
      { precio: 25, quantity: 3 }
    ];
    // 50*2 + 75*1 + 25*3 = 100 + 75 + 75 = 250
    expect(calculateCartTotal(items)).toBe(250);
  });

  test('handles zero quantity', () => {
    const items: CartItem[] = [
      { precio: 100, quantity: 0 },
      { precio: 50, quantity: 1 }
    ];
    expect(calculateCartTotal(items)).toBe(50);
  });
});

