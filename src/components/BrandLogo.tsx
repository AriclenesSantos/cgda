import cgdaFull from "@/assets/brand/cgda-full.png.asset.json";
import cgdaWhite from "@/assets/brand/cgda-white.png.asset.json";
import { useTheme } from "@/lib/theme";

/**
 * BrandLogo — logotipo oficial da CGDA (PNG com fundo transparente).
 * Usa a variante colorida no tema claro e a variante branca no tema escuro
 * para garantir legibilidade do lettering "Comunidade Game Dev Angola".
 */
export default function BrandLogo({ className = "" }: { className?: string }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? cgdaWhite.url : cgdaFull.url;
  return (
    <img
      src={src}
      alt="Comunidade Game Dev Angola"
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
