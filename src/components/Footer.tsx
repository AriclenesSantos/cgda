const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-sm font-semibold text-gradient">
          Game Dev Angola
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Comunidade Game Dev Angola. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
