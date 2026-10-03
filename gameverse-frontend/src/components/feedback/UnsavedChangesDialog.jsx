import React from 'react';

export function UnsavedChangesDialog({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50" onClick={onCancel} />
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-slate-800 bg-slate-900 p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-semibold text-white tracking-tight">You have unsaved changes.</h2>
          <p className="text-sm text-slate-400">
            Leave this page? Your organization information will be discarded and cannot be recovered.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="mt-2 inline-flex h-10 items-center justify-center rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:mt-0"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
          >
            Leave
          </button>
        </div>
      </div>
    </>
  );
}
