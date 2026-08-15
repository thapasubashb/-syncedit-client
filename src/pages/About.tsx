import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { state: { scrollToSection: 4 } }); // Scrolls to footer
  }, [navigate]);
  return null;
}