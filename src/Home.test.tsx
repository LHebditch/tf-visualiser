import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from './Home';

describe('App Component', () => {
  it('renders the heading Vite + React', () => {
    render(<App />);
    const headingElement = screen.getByText(/TF Visualizer/i);
    expect(headingElement).toBeInTheDocument();
  });

});
