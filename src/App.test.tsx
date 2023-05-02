import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Start Tour Button', () => {
  render(<App />)
  const linkElement = screen.getByText(/Start Tour/i)
  expect(linkElement).toBeInTheDocument()
})
