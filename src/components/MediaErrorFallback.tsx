export function MediaErrorFallback({ label }: { label: string }) {
  return <p className="media-fallback" role="status">{label} media is unavailable. Project details remain below.</p>
}
