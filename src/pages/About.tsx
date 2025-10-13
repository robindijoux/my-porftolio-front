import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page d'accueil avec scroll vers la section about
    navigate('/', { replace: true });
    setTimeout(() => {
      document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [navigate]);

  return null;
};

export default About;