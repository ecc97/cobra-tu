import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useVideoModal } from './useVideoModal';

describe('useVideoModal', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useVideoModal());
    expect(result.current.isOpen).toBe(false);
  });

  it('should open modal when openModal is called', () => {
    const { result } = renderHook(() => useVideoModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should close modal when closeModal is called', () => {
    const { result } = renderHook(() => useVideoModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should set body overflow to hidden when opening modal', () => {
    const { result } = renderHook(() => useVideoModal());

    act(() => {
      result.current.openModal();
    });

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when closing modal', () => {
    const { result } = renderHook(() => useVideoModal());

    act(() => {
      result.current.openModal();
    });

    expect(document.body.style.overflow).toBe('hidden');

    act(() => {
      result.current.closeModal();
    });

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should toggle modal correctly', () => {
    const { result } = renderHook(() => useVideoModal());

    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openModal();
    });
    expect(result.current.isOpen).toBe(true);
  });
});
