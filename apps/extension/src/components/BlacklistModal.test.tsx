import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlacklistModal } from './BlacklistModal';

describe('BlacklistModal', () => {
  it('renders current domain and list of blacklisted domains', () => {
    const onToggle = vi.fn();
    const onAdd = vi.fn();
    const onRemove = vi.fn();
    const onClose = vi.fn();

    render(
      <BlacklistModal
        currentDomain="github.com"
        isCurrentDomainBlacklisted={false}
        blacklistedDomains={['chase.com', 'bankofamerica.com']}
        onToggleCurrentDomain={onToggle}
        onAddDomain={onAdd}
        onRemoveDomain={onRemove}
        onClose={onClose}
      />
    );

    expect(screen.getByText('github.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    expect(screen.getByText('chase.com')).toBeInTheDocument();
    expect(screen.getByText('bankofamerica.com')).toBeInTheDocument();

    // Toggle current domain
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(onToggle).toHaveBeenCalled();

    // Remove domain
    const removeBtn = screen.getByLabelText('Unblock chase.com');
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith('chase.com');

    // Close modal
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('allows manually adding a domain', () => {
    const onAdd = vi.fn();

    render(
      <BlacklistModal
        currentDomain={null}
        isCurrentDomainBlacklisted={false}
        blacklistedDomains={[]}
        onToggleCurrentDomain={vi.fn()}
        onAddDomain={onAdd}
        onRemoveDomain={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('e.g. chase.com, bank.org');
    fireEvent.change(input, { target: { value: 'https://paypal.com/signin' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    expect(onAdd).toHaveBeenCalledWith('https://paypal.com/signin');
  });
});
