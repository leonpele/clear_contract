'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'La suppression a échoué');
      }
      window.location.href = '/';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La suppression a échoué');
      setLoading(false);
    }
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs text-ink-faint hover:text-risk-high underline transition-colors duration-150"
      >
        Supprimer mon compte
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-risk-high-border bg-risk-high-bg px-4 py-3 space-y-3">
      <p className="text-sm text-risk-high">
        Cette action est définitive : votre compte, votre historique
        d&apos;analyses et vos données seront supprimés immédiatement, sans
        possibilité de récupération.
      </p>
      {error && <p className="text-sm text-risk-high">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          className="!border-risk-high-border !text-risk-high hover:!bg-risk-high-bg"
          onClick={handleDelete}
        >
          {loading ? 'Suppression…' : 'Confirmer la suppression définitive'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={loading}
          onClick={() => {
            setConfirming(false);
            setError('');
          }}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}
