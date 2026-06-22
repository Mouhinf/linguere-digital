require('dotenv').config();
const { sequelize, models } = require('../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database reset');

    const { User, Service, Project, BlogPost, Testimonial } = models;

    // Create admin user
    await User.create({
      email: 'linguere660@gmail.com',
      password: 'diack@linguere',
      nom: 'Admin',
      prenom: 'Linguère',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create services
    const services = await Service.bulkCreate([
      {
        titre: 'Développement Web',
        categorie: 'informatique',
        description: 'Solutions web modernes et performantes',
        descriptionLongue: 'Nous créons des applications web robustes et scalables avec les dernières technologies.',
        icone: 'globe',
        prix: 1500,
        ordre: 1,
        actif: true
      },
      {
        titre: 'Machine Learning',
        categorie: 'data-science',
        description: 'Intelligence artificielle et analyse de données',
        descriptionLongue: 'Exploitez la puissance du ML pour transformer vos données en insights actionnables.',
        icone: 'brain',
        prix: 2500,
        ordre: 2,
        actif: true
      },
      {
        titre: 'Marketing Digital',
        categorie: 'marketing',
        description: 'Stratégies marketing digitales performantes',
        descriptionLongue: 'Augmentez votre visibilité et généralisez plus de leads avec nos stratégies éprouvées.',
        icone: 'trending-up',
        prix: 800,
        ordre: 3,
        actif: true
      },
      {
        titre: 'Formation Professionnelle',
        categorie: 'formation',
        description: 'Formations techniques et professionnelles',
        descriptionLongue: 'Montez en compétences avec nos formations adaptées à votre niveau et vos besoins.',
        icone: 'book',
        prix: 500,
        ordre: 4,
        actif: true
      }
    ]);
    console.log('✅ Services created');

    // Create projects
    const projects = await Project.bulkCreate([
      {
        titre: 'Portail E-Commerce Dakar',
        description: 'Plateforme de vente en ligne pour PME sénégalaise',
        contenuComplet: 'Développement complet d\'une plateforme e-commerce avec intégration paiement',
        categorie: 'Web',
        client: 'Dakar Shop',
        technologies: ['React', 'Node.js', 'MySQL'],
        dateProjets: new Date('2024-01-15'),
        publie: true,
        ordre: 1
      },
      {
        titre: 'Dashboard Analytics IA',
        description: 'Système de prédiction et visualisation d\'analytics',
        contenuComplet: 'Dashboard avancé avec ML pour prédictions business',
        categorie: 'Data',
        client: 'Tech Corp Afrique',
        technologies: ['Python', 'TensorFlow', 'React'],
        dateProjets: new Date('2024-02-20'),
        publie: true,
        ordre: 2
      },
      {
        titre: 'Campagne Marketing Global',
        description: 'Stratégie marketing digitale multi-canal',
        contenuComplet: 'Campagne intégrée SEO, SEM et Social Media',
        categorie: 'Marketing',
        client: 'StartUp Innovation',
        technologies: ['Google Ads', 'SEO', 'Analytics'],
        dateProjets: new Date('2024-03-10'),
        publie: true,
        ordre: 3
      }
    ]);
    console.log('✅ Projects created');

    // Create blog posts
    const posts = await BlogPost.bulkCreate([
      {
        titre: 'Introduction à l\'IA et Machine Learning',
        slug: 'intro-ia-ml',
        contenu: '<h2>L\'IA révolutionne l\'industrie</h2><p>Le machine learning est devenu incontournable...</p>',
        resume: 'Découvrez les bases du machine learning et son impact.',
        categorie: 'IA',
        tags: ['IA', 'ML', 'Technologie'],
        metaDescription: 'Guide complet du machine learning',
        publie: true
      },
      {
        titre: 'Les meilleures pratiques SEO en 2025',
        slug: 'seo-best-practices-2025',
        contenu: '<h2>SEO moderne</h2><p>Voici les tendances actuelles en SEO...</p>',
        resume: 'Optimisez votre présence en ligne avec nos stratégies SEO.',
        categorie: 'Marketing',
        tags: ['SEO', 'Marketing', 'Web'],
        metaDescription: 'Stratégies SEO pour 2025',
        publie: true
      },
      {
        titre: 'Transformation numérique en Afrique',
        slug: 'transformation-numerique-afrique',
        contenu: '<h2>L\'Afrique digitale</h2><p>L\'Afrique connaît une révolution numérique...</p>',
        resume: 'Comment la technologie transforme le continent africain.',
        categorie: 'Tendances',
        tags: ['Afrique', 'Numérique', 'Technologie'],
        metaDescription: 'Transformation numérique de l\'Afrique',
        publie: true
      }
    ]);
    console.log('✅ Blog posts created');

    // Create testimonials
    await Testimonial.bulkCreate([
      {
        nom: 'Aminata Diallo',
        entreprise: 'Dakar Digital Solutions',
        position: 'Directrice Marketing',
        contenu: 'Linguère Digital a transformé notre présence en ligne. Service exceptionnel!',
        etoiles: 5,
        approuve: true,
        ordre: 1
      },
      {
        nom: 'Mamadou Kane',
        entreprise: 'Tech Africa',
        position: 'CTO',
        contenu: 'Équipe professionnelle, délais respectés, code de qualité. À recommander!',
        etoiles: 5,
        approuve: true,
        ordre: 2
      },
      {
        nom: 'Fatou Sarr',
        entreprise: 'Commerce Plus',
        position: 'Responsable IT',
        contenu: 'Leur solution e-commerce a augmenté nos ventes de 150%.',
        etoiles: 5,
        approuve: true,
        ordre: 3
      }
    ]);
    console.log('✅ Testimonials created');

    console.log('\n✨ Seed completed successfully!');
    console.log('Admin credentials: linguere660@gmail.com / diack@linguere');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

// Export for use in server.js seed endpoint
module.exports = { seedDatabase };

// Allow direct execution: node seeders/seed.js
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
