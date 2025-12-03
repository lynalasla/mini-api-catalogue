"""
Tests unitaires pour le module operations.py
"""

import unittest
from operations import addition, maximum, format_nom


class TestOperations(unittest.TestCase):
    """
    Classe de tests pour les fonctions du module operations
    """
    
    def test_addition(self):
        """
        Test de la fonction addition
        """
        # Test avec des nombres positifs
        self.assertEqual(addition(2, 3), 5)
        self.assertEqual(addition(10, 5), 15)
        
        # Test avec des nombres négatifs
        self.assertEqual(addition(-2, -3), -5)
        
        # Test avec des nombres décimaux
        self.assertAlmostEqual(addition(2.5, 3.7), 6.2)
        
        # Test avec zéro
        self.assertEqual(addition(0, 5), 5)
        self.assertEqual(addition(5, 0), 5)
    
    def test_maximum(self):
        """
        Test de la fonction maximum
        """
        # Test avec des nombres positifs
        self.assertEqual(maximum(5, 3), 5)
        self.assertEqual(maximum(3, 5), 5)
        
        # Test avec des nombres négatifs
        self.assertEqual(maximum(-2, -5), -2)
        
        # Test avec des nombres égaux
        self.assertEqual(maximum(4, 4), 4)
        
        # Test avec zéro
        self.assertEqual(maximum(0, -5), 0)
        self.assertEqual(maximum(10, 0), 10)
    
    def test_format_nom(self):
        """
        Test de la fonction format_nom
        """
        # Test avec des noms simples
        self.assertEqual(format_nom("jean", "dupont"), "DUPONT Jean")
        self.assertEqual(format_nom("marie", "martin"), "MARTIN Marie")
        
        # Test avec des majuscules en entrée
        self.assertEqual(format_nom("PIERRE", "BERNARD"), "BERNARD Pierre")
        
        # Test avec des minuscules en entrée
        self.assertEqual(format_nom("sophie", "durand"), "DURAND Sophie")
        
        # Test avec des noms composés
        self.assertEqual(format_nom("jean-paul", "sartre"), "SARTRE Jean-paul")


if __name__ == '__main__':
    # Lancer tous les tests
    unittest.main(verbosity=2)
