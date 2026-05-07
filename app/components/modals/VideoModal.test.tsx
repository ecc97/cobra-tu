import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VideoModal } from './VideoModal';

describe('VideoModal', () => {
  beforeEach(() => {
    // Reset body overflow
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should not render when isOpen is false', () => {
    const { container } = render(
      <VideoModal isOpen={false} onClose={() => {}} videoSrc="/video.mp4" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    render(
      <VideoModal isOpen={true} onClose={() => {}} videoSrc="/video.mp4" />
    );
    expect(screen.getByRole('button', { name: /cerrar modal/i })).toBeInTheDocument();
  });

  it('should render video element with correct src', () => {
    render(
      <VideoModal isOpen={true} onClose={() => {}} videoSrc="/videos/demo.mp4" />
    );
    const video = document.querySelector('video') as HTMLVideoElement;
    expect(video).toHaveAttribute('src', '/videos/demo.mp4');
  });

  it('should call onClose when close button is clicked', () => {
    const mockClose = vi.fn();
    render(
      <VideoModal isOpen={true} onClose={mockClose} videoSrc="/video.mp4" />
    );
    const closeButton = screen.getByRole('button', { name: /cerrar modal/i });
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it('should call onClose when overlay is clicked', () => {
    const mockClose = vi.fn();
    const { container } = render(
      <VideoModal isOpen={true} onClose={mockClose} videoSrc="/video.mp4" />
    );
    const overlay = container.querySelector('[aria-hidden="true"]');
    fireEvent.click(overlay!);
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it('should not call onClose when modal content is clicked', () => {
    const mockClose = vi.fn();
    const { container } = render(
      <VideoModal isOpen={true} onClose={mockClose} videoSrc="/video.mp4" />
    );
    const videoContainer = container.querySelector('.aspect-video');
    fireEvent.click(videoContainer!);
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('should close modal when Escape key is pressed', () => {
    const mockClose = vi.fn();
    render(
      <VideoModal isOpen={true} onClose={mockClose} videoSrc="/video.mp4" />
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalledOnce();
  });

  it('should not close modal when other keys are pressed', () => {
    const mockClose = vi.fn();
    render(
      <VideoModal isOpen={true} onClose={mockClose} videoSrc="/video.mp4" />
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('should have video controls enabled', () => {
    render(
      <VideoModal isOpen={true} onClose={() => {}} videoSrc="/video.mp4" />
    );
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('controls');
    expect(video).toHaveAttribute('autoplay');
  });

  it('should display keyboard shortcut info', () => {
    render(
      <VideoModal isOpen={true} onClose={() => {}} videoSrc="/video.mp4" />
    );
    expect(screen.getByText(/presiona/i)).toBeInTheDocument();
  });
});
