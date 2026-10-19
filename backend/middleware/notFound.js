const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', '..', 'frontend');

// Remplace l'ancien fallback `app.get('*')` qui renvoyait index.html en HTTP 200
// pour TOUTE URL inconnue. Conséquences de ce fallback :
//   - /shell.php, /wso.php, /wp-login.php, /xmlrpc.php répondaient 200 OK, ce qui
//     faisait conclure aux scanners automatiques que le site était compromis ;
//   - soft-404 généralisés, pénalisants pour l'indexation.
// Le site est multi-pages (chaque page est un vrai fichier .html) : aucun
// routage côté client à rattraper, donc un vrai 404 est la bonne réponse.
function createNotFoundHandler({ servesFrontend }) {
  return function notFound(req, res) {
    if (!servesFrontend || req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Not found' });
    }

    return res.status(404).sendFile(path.join(FRONTEND_DIR, '404.html'), (err) => {
      if (err && !res.headersSent) {
        res.status(404).type('text/plain').send('404 — Page introuvable');
      }
    });
  };
}

module.exports = { createNotFoundHandler };
