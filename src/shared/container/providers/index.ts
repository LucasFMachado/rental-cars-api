import { container } from 'tsyringe';

import { DateProvider } from './DateProvider/DateProvider';
import { IDateProvider } from './DateProvider/interfaces/IDateProvider';
import { IMailProvider } from './MailProvider/interfaces/IMailProvider';
import { MailProvider } from './MailProvider/MailProvider';

container.registerSingleton<IDateProvider>('DateProvider', DateProvider);
container.registerInstance<IMailProvider>('MailProvider', new MailProvider());
