import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../src/components/common/Input';

describe('Input Component', () => {
  it('renders with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = jest.fn();
    render(<Input name="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Input name="test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Input label="Required Field" name="test" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
