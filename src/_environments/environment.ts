import { IEnvironment } from '@core/_models/environment/environment.interface';

export const ENVIRONMENT: IEnvironment = {
  production: false,
  k8sUrl: process.env['NG_APP_BACKEND_API_URL'] || 'http://127.0.0.1:8080/function',
  logLevel: 'debug',
  application: {
    name: 'Cofrap',
    author: 'Emmanuel Lefevre, Arthur Annarumma, Maxence Dross-Denis, Hamza Aziz',
    themeColor: '#08b26b',
    defaultShareImage: 'https://cofrap.emmanuellefevre.com/assets/logos/logo.png'
  }
};
