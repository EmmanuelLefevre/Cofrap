export interface IEnvironment {
  production: boolean;
  k3sUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  mockAdminPassword?: string;
  application: {
    name: string;
    author: string;
    themeColor: string;
    defaultShareImage: string;
  };
}
