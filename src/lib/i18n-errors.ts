// Traduz mensagens de erro (Supabase/Auth/Storage) para português.
// Mantém uma tabela de padrões conhecidos e faz fallback para a mensagem original.

const PATTERNS: Array<[RegExp, string]> = [
  // Auth
  [/invalid login credentials/i, "Credenciais inválidas. Verifique o email e a senha."],
  [/email not confirmed/i, "Email ainda não confirmado. Verifique a sua caixa de entrada."],
  [/user (already )?registered/i, "Este email já está registado."],
  [/user not found/i, "Utilizador não encontrado."],
  [/invalid email/i, "Email inválido."],
  [/email address .* is invalid/i, "Endereço de email inválido."],
  [/new password should be different/i, "A nova senha deve ser diferente da anterior."],
  [/password should be at least (\d+) characters?/i, "A senha deve ter pelo menos $1 caracteres."],
  [/password is too short/i, "Senha demasiado curta."],
  [/password.*(pwned|breach|compromis|data breach|leaked)/i, "Esta senha foi encontrada em vazamentos de dados públicos. Escolha uma senha diferente e mais forte."],
  [/weak password/i, "Senha fraca. Use letras, números e símbolos."],
  [/passwords do not match/i, "As senhas não coincidem."],
  [/rate limit|too many requests/i, "Demasiadas tentativas. Aguarde alguns segundos e tente novamente."],
  [/token has expired|jwt expired/i, "Sessão expirada. Faça login novamente."],
  [/signup.*disabled|signups not allowed/i, "Novos registos estão desativados."],
  [/for security purposes, you can only request this after/i, "Por segurança, aguarde alguns segundos antes de tentar novamente."],
  [/unsupported provider/i, "Provedor de autenticação não suportado."],

  // DB / RLS
  [/permission denied/i, "Sem permissão para executar esta ação."],
  [/row-level security|violates row-level security/i, "Sem permissão para alterar estes dados."],
  [/duplicate key value|already exists/i, "Este registo já existe."],
  [/violates foreign key/i, "Referência inválida a outro registo."],
  [/violates not-null/i, "Preencha todos os campos obrigatórios."],
  [/value too long/i, "Um dos campos excede o tamanho permitido."],

  // Storage
  [/payload too large|file size/i, "Ficheiro demasiado grande."],
  [/mime type|not allowed/i, "Tipo de ficheiro não permitido."],
  [/bucket not found/i, "Espaço de armazenamento não encontrado."],

  // Rede
  [/failed to fetch|network request failed|networkerror/i, "Falha de rede. Verifique a sua ligação e tente novamente."],
  [/timeout/i, "Tempo de resposta esgotado. Tente novamente."],
];

export function translateError(err: unknown): string {
  const raw =
    typeof err === "string"
      ? err
      : err instanceof Error
      ? err.message
      : (err as any)?.message ?? String(err ?? "");
  if (!raw) return "Ocorreu um erro inesperado. Tente novamente.";
  for (const [re, msg] of PATTERNS) {
    if (re.test(raw)) return raw.replace(re, msg);
  }
  return raw;
}
