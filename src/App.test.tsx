import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { isUserLoggedIn } from './App';
import { act } from 'react-dom/test-utils';
import { Navigate } from 'react-router-dom';
import Conversation from './pages/chat/Conversation';

describe('App', () => {
  it('should render App component', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })

    render(<App />);
    screen.getByTestId('app-container');

    await act(async () => {
      return
    });
  });

  it('should not render private route  but redirect to Home', () => {
    expect(isUserLoggedIn(<Conversation />)).toStrictEqual(<Navigate to="/" />)
  });
  it('should render private route', () => {
    localStorage.setItem("connection_state", "connected");
    expect(isUserLoggedIn(<Conversation />)).toStrictEqual(<Conversation />)
  });
})
