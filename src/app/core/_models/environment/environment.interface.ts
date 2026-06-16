export interface IEnvironment {
  production: boolean;
  k8sUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  mockAdminPassword?: string;
  application: {
    name: string;
    author: string;
    themeColor: string;
    defaultShareImage: string;
  };
}
