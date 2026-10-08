export * from './models';
export * from './menu.config';
export let configuration: ConfigurationInterface;

import developmentConfig from './config.development.json';
import productionConfig from './config.production.json';
import { ConfigurationInterface } from './models';

if (import.meta.env.VITE_APP_ENV === 'production') {
  console.log('Production mode');
  configuration = productionConfig;
} else {
  console.log('Development mode');
  configuration = developmentConfig;
}
