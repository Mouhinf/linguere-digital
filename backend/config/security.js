// Configuration des en-têtes de sécurité (helmet v8).
// Extrait de server.js pour garder celui-ci sous le plafond de 250 lignes.

// Seules origines externes légitimes du site, inventoriées dans le frontend :
//   - fonts.googleapis.com / fonts.gstatic.com : Space Grotesk + DM Sans
//   - cdn.quilljs.com : éditeur de texte riche de l'admin (admin/blog-edit.html)
const STYLE_ORIGINS = ['https://fonts.googleapis.com', 'https://cdn.quilljs.com'];
const SCRIPT_ORIGINS = ['https://cdn.quilljs.com'];
const FONT_ORIGINS = ['https://fonts.gstatic.com'];

// `'unsafe-inline'` reste nécessaire pour l'instant : le frontend compte
// 7 blocs <script> inline, 22 attributs on* (onclick/oninput/onerror) et
// 144 attributs style=. Une CSP stricte casserait les pages en l'état.
// La CSP bloque néanmoins le vecteur principal — le chargement d'un script
// hébergé sur un domaine tiers — ainsi que l'injection d'iframes et le
// détournement de formulaires. À durcir après refactorisation des handlers.
const INLINE = "'unsafe-inline'";
const SELF = "'self'";

function buildCspDirectives({ isProduction }) {
  const directives = {
    'default-src': [SELF],
    'base-uri': [SELF],
    'object-src': ["'none'"],
    'frame-ancestors': [SELF],
    'frame-src': [SELF],
    'form-action': [SELF],
    'script-src': [SELF, INLINE, ...SCRIPT_ORIGINS],
    // script-src-attr vaut 'none' par défaut chez helmet, ce qui neutraliserait
    // les 22 handlers on* existants : on l'autorise explicitement.
    'script-src-attr': [INLINE],
    'style-src': [SELF, INLINE, ...STYLE_ORIGINS],
    'font-src': [SELF, 'data:', ...FONT_ORIGINS],
    'img-src': [SELF, 'data:', 'https:'],
    'connect-src': [SELF],
    'manifest-src': [SELF]
  };

  // Inutile (et gênant) en HTTP local.
  if (isProduction) {
    directives['upgrade-insecure-requests'] = [];
  }

  return directives;
}

function buildHelmetOptions({ isProduction }) {
  return {
    contentSecurityPolicy: {
      directives: buildCspDirectives({ isProduction })
    },
    // HSTS seulement en production : sur localhost, le navigateur forcerait
    // ensuite https://localhost pour tous les autres projets.
    strictTransportSecurity: isProduction
      ? { maxAge: 31536000, includeSubDomains: true }
      : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    // Ces deux en-têtes casseraient le chargement des polices et du CDN Quill.
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  };
}

module.exports = {
  buildHelmetOptions,
  buildCspDirectives
};
