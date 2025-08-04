import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traductions
const resources = {
  fr: {
    translation: {
      header: {
        projects: 'Projets',
        about: 'À propos',
        contact: 'Contact'
      },
      home: {
        title: 'Créateur d\'expériences digitales',
        subtitle: 'Développeur Full-Stack passionné par la création d\'applications web modernes et performantes.',
        statsProjects: 'Projets réalisés',
        statsExperience: 'Années d\'expérience',
        statsTechnologies: 'Technologies maîtrisées',
        portfolioTitle: 'Portfolio',
        portfolioSubtitle: 'Découvrez mes derniers projets et réalisations',
        viewDetails: 'Voir les détails',
        visitSite: 'Visiter le site',
        sourceCode: 'Code source'
      },
      project: {
        createdOn: 'Créé le',
        technologies: 'Technologies utilisées',
        visitSite: 'Visiter le site',
        sourceCode: 'Code source',
        backToPortfolio: 'Retour au portfolio',
        notFound: 'Projet non trouvé',
        notFoundDescription: 'Le projet que vous recherchez n\'existe pas ou a été supprimé.',
        loadingError: 'Erreur de chargement',
        retry: 'Réessayer'
      },
      common: {
        loading: 'Chargement...'
      }
    }
  },
  en: {
    translation: {
      header: {
        projects: 'Projects',
        about: 'About',
        contact: 'Contact'
      },
      home: {
        title: 'Digital Experience Creator',
        subtitle: 'Full-Stack Developer passionate about creating modern and performant web applications.',
        statsProjects: 'Projects completed',
        statsExperience: 'Years of experience',
        statsTechnologies: 'Technologies mastered',
        portfolioTitle: 'Portfolio',
        portfolioSubtitle: 'Discover my latest projects and achievements',
        viewDetails: 'View details',
        visitSite: 'Visit site',
        sourceCode: 'Source code'
      },
      project: {
        createdOn: 'Created on',
        technologies: 'Technologies used',
        visitSite: 'Visit site',
        sourceCode: 'Source code',
        backToPortfolio: 'Back to portfolio',
        notFound: 'Project not found',
        notFoundDescription: 'The project you are looking for does not exist or has been deleted.',
        loadingError: 'Loading error',
        retry: 'Retry'
      },
      common: {
        loading: 'Loading...'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // langue par défaut
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;