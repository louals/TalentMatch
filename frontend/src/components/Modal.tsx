import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  closeOnOverlayClick = true,
  showCloseButton = true,
  initialFocusRef,
  size = "md",
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      lastActiveElement.current = document.activeElement as HTMLElement;
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close modal on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        closeOnOverlayClick
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, closeOnOverlayClick]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trap and initial focus
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        (focusableElements[0] as HTMLElement).focus();
      }
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    modalRef.current.addEventListener("keydown", handleTabKey);

    return () => {
      modalRef.current?.removeEventListener("keydown", handleTabKey);
      if (lastActiveElement.current) {
        lastActiveElement.current.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8"
    >
      {/* Overlay with fade-in animation */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out animate-fadeIn"
      />

      {/* Modal container with slide-up animation */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all duration-300 ease-out animate-slideUp`}
      >
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            {title && (
              <h2
                id="modal-title"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto rounded-lg p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                aria-label="Close modal"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal content */}
        <div className="p-6">{children}</div>
      </div>

      {/* Add these animations to your global CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>,
    document.body
  );
};