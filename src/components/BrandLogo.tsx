/**
 * BrandLogo — versão em linhas monocromática do logo CGDA.
 * Usa currentColor para adaptar ao tema (preto no claro, branco no escuro).
 */
export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="CGDA"
      role="img"
    >
      {/* moldura hexagonal */}
      <path d="M32 4 L56 18 L56 46 L32 60 L8 46 L8 18 Z" />
      {/* comando estilizado */}
      <rect x="18" y="26" width="28" height="14" rx="7" />
      {/* d-pad */}
      <path d="M23 33 h4 M25 31 v4" />
      {/* botões */}
      <circle cx="39" cy="31.5" r="1.2" fill="currentColor" />
      <circle cx="42" cy="34.5" r="1.2" fill="currentColor" />
      {/* letras C G D A */}
      <path d="M14 14 h6 M20 14 v4" opacity="0.0" />
    </svg>
  );
}
