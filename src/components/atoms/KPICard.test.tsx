import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPICard } from './KPICard';

describe('KPICard', () => {
  it('renders correctly', () => {
    render(
      <KPICard
        label="Test Label"
        value={42}
        icon={<div data-testid="icon" />}
        iconBgClass="bg-red-500"
        iconTextClass="text-red-500"
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('accepts sublabel prop', () => {
    render(
      <KPICard
        label="Test Label"
        value={42}
        sublabel="Test Sublabel"
        icon={<div />}
        iconBgClass=""
        iconTextClass=""
      />
    );
    expect(screen.getByText('Test Sublabel')).toBeInTheDocument();
  });
});
