import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Features() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { state: { scrollToSection: 1 } });
  }, [navigate]);
  return null;
}