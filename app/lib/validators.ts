/**
 * Validadores para casos edge
 */

export const validators = {
  /**
   * Valida que un email tenga formato correcto
   */
  isValidEmail: (email: string): boolean => {
    if (!email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valida que la fecha de vencimiento sea mayor o igual a la de emisión
   */
  isValidDateRange: (issueDate: string, dueDate: string): boolean => {
    if (!issueDate || !dueDate) return true; // No validar si están vacías
    return new Date(dueDate) >= new Date(issueDate);
  },

  /**
   * Sanitiza números negativos
   */
  sanitizeNumber: (value: number): number => {
    return Math.max(0, value);
  },

  /**
   * Valida que la cantidad sea al menos 1
   */
  isValidQuantity: (quantity: number): boolean => {
    return quantity > 0 && quantity === Math.floor(quantity);
  },

  /**
   * Valida que el precio sea válido (positivo, máximo 2 decimales)
   */
  isValidPrice: (price: number): boolean => {
    if (price < 0) return false;
    const decimals = (price.toString().split('.')[1] || '').length;
    return decimals <= 2;
  },

  /**
   * Normaliza precios a 2 decimales
   */
  normalizePrice: (price: number): number => {
    return Math.round(price * 100) / 100;
  },

  /**
   * Valida que el nombre no sea solo espacios y tenga mínimo 2 caracteres
   */
  isValidName: (name: string): boolean => {
    return name.trim().length >= 2;
  },

  /**
   * Valida que haya al menos un item válido con descripción y precio
   */
  hasValidItems: (
    items: Array<{ description: string; price: number; quantity: number }>
  ): boolean => {
    return items.some(
      (item) =>
        item.description.trim().length > 0 &&
        item.price > 0 &&
        item.quantity > 0
    );
  },
};
