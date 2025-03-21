/**
 * Interface representing the active user data.
 */
export interface ActiveUserData {
  /**
   * The unique identifier for the user (subject).
   * @example 'a1234567-89ab-cdef-0123-456789abcdef'
   */
  sub: string;

  /**
   * The email address of the user.
   * @example 'user@example.com'
   */
  email: string;

  /**
   * The role of the user.
   * @example 'admin'
   */
  role: string;
}
