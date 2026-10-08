import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import i18n from '../../modules/i18n/i18n';
import { StatusPage } from './StatusPage';

describe('StatusPage', () => {
  it('renders the localized forbidden page', async () => {
    await i18n.changeLanguage('en');
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <StatusPage status={403} />
        </MemoryRouter>
      </I18nextProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Access denied' })).toBeInTheDocument();
  });
});
