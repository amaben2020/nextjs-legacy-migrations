import React from 'react';
import { mount } from '@cypress/react';
import { SessionProvider } from 'next-auth/react';
import AuthButton from '../../src/components/AuthButton.client';

describe('AuthButton Component', () => {
  const mountWithSession = (session: any = null) => {
    return mount(
      <SessionProvider session={session}>
        <AuthButton />
      </SessionProvider>
    );
  };

  describe('Unauthenticated State', () => {
    it('should render sign in button when no session', () => {
      mountWithSession(null);

      cy.get('button').contains('Sign in').should('be.visible');
      cy.get('[data-testid="user-avatar"]').should('not.exist');
      cy.get('button').contains('Sign out').should('not.exist');
    });
  });

  describe('Authenticated State', () => {
    const mockSession = {
      user: {
        id: 'test-user-1',
        name: 'Test User',
        email: 'test@example.com',
        image: null,
      },
    };

    it('should render user avatar and sign out button when authenticated', () => {
      mountWithSession(mockSession);

      cy.get('[data-testid="user-avatar"]').should('be.visible');
      cy.get('button').contains('Sign out').should('be.visible');
      cy.get('button').contains('Sign in').should('not.exist');
    });

    it('should display user initials in avatar fallback', () => {
      mountWithSession(mockSession);

      cy.get('[data-testid="user-avatar"]').should('contain', 'TU');
    });

    it('should display user image when provided', () => {
      const sessionWithImage = {
        ...mockSession,
        user: {
          ...mockSession.user,
          image: 'https://example.com/avatar.jpg',
        },
      };

      mountWithSession(sessionWithImage);

      cy.get('[data-testid="user-avatar"] img').should('be.visible');
      cy.get('[data-testid="user-avatar"] img').should(
        'have.attr',
        'src',
        'https://example.com/avatar.jpg'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with single name', () => {
      const sessionWithSingleName = {
        user: {
          id: 'test-user-1',
          name: 'Test',
          email: 'test@example.com',
        },
      };

      mountWithSession(sessionWithSingleName);

      cy.get('[data-testid="user-avatar"]').should('contain', 'T');
    });

    it('should handle user with no name', () => {
      const sessionWithNoName = {
        user: {
          id: 'test-user-1',
          name: null,
          email: 'test@example.com',
        },
      };

      mountWithSession(sessionWithNoName);

      cy.get('[data-testid="user-avatar"]').should('contain', 'JD'); // Default fallback
    });
  });
});
