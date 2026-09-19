'use client'

import { useLocale } from '@/components/i18n/locale-provider'
import type { PlanVersion } from '@/types'

interface VersionHistoryProps {
  versions: PlanVersion[]
  onRestore: (version: PlanVersion) => void
  onClose: () => void
}

export function VersionHistory({ versions, onRestore, onClose }: VersionHistoryProps) {
  const { t } = useLocale()

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex h-[80dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[80dvh] sm:rounded-3xl">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-bold text-[#FF9A76]">{t('versionHistory')}</h2>
          <button type="button" onClick={onClose} className="text-sm text-gray-500">
            {t('close')}
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {versions.length === 0 ? (
            <p className="text-sm text-gray-500">{t('noVersions')}</p>
          ) : (
            <ol className="space-y-3">
              {versions.map((version) => (
                <li key={version.id} className="rounded-2xl border border-[#FF9A76]/20 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#7ECCC4]">
                    {version.source === 'user'
                      ? t('versionUser')
                      : version.source === 'restore'
                        ? t('versionRestore')
                        : t('versionAi')}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{version.summary}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                  <button
                    type="button"
                    onClick={() => onRestore(version)}
                    className="mt-3 rounded-full bg-[#FFF8F3] px-3 py-1.5 text-xs font-semibold text-[#FF9A76]"
                  >
                    {t('restoreVersion')}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
