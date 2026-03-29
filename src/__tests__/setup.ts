import '@testing-library/jest-dom'
import React from 'react'

// Mock framer-motion — render plain HTML tags so components work in tests
vi.mock('framer-motion', () => {
  const makeTag = (tag: string) =>
    ({ children, initial: _i, animate: _a, transition: _t, ...rest }: Record<string, unknown>) =>
      React.createElement(tag, rest, children)

  return {
    motion: new Proxy({} as Record<string, unknown>, {
      get: (_t, tag: string) => makeTag(tag),
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

// Suppress recharts ResizeObserver errors in jsdom
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
