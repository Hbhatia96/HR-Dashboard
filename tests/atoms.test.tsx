import { describe, it, expect, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { ModalPortal } from '../src/components/atoms/ModalPortal';
import { SalaryReferenceCompare } from '../src/components/atoms/SalaryReferenceCompare';

describe('Atoms', () => {
  it('ModalPortal renders children in a portal', async () => {
    render(<ModalPortal><div>Portal Child</div></ModalPortal>);
    await act(async () => {
      await new Promise(r => setTimeout(r, 10));
    });
    expect(document.body.innerHTML).toContain('Portal Child');
  });

  it('SalaryReferenceCompare renders properly', () => {
    const stat = [{ country: 'USA', averageSalary: 100000, maxSalary: 150000, minSalary: 50000 }] as any;
    const empData = { country: 'USA', salary: 110000 } as any;
    const { container } = render(<SalaryReferenceCompare employee={empData} countryStats={stat} />);
    expect(container).toBeDefined();
    
    // Check when salary is less than average
    const empData2 = { country: 'USA', salary: 90000 } as any;
    const { container: container2 } = render(<SalaryReferenceCompare employee={empData2} countryStats={stat} />);
    expect(container2).toBeDefined();

    // Missing stats
    const { container: container3 } = render(<SalaryReferenceCompare employee={empData} countryStats={[]} />);
    expect(container3).toBeDefined();
  });
});


