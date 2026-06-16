/**
 * Represents the core User entity within the system (COFRAP).
 * This structure is used for profile management and session state.
 */
export interface User {
  /**
   * Unique identifier for the user (Primary Key).
   */
  id: string;

  /**
   * The display name / login chosen by the administrator.
   */
  username: string;

  /**
   * Indicates if the user's credentials are expired (older than 6 months).
   */
  expired?: boolean;
}
