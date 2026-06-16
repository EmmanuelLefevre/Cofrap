export type SnackbarType =
  | 'created'
  | 'modified'
  | 'deleted'
  | 'logIn-logOut'
  | 'orange-alert'
  | 'red-alert';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
}
