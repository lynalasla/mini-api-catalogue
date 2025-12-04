"""
Tests unitaires pour le module operations.py
Couvre les cas normaux, limites et exceptionnels
"""

import unittest
from operations import addition, maximum, format_nom


class TestAddition(unittest.TestCase):
    """
    Tests dédiés à la fonction addition
    """
    
    def test_addition_nombres_positifs(self):
        """Test avec des nombres entiers positifs"""
        self.assertEqual(addition(2, 3), 5)
        self.assertEqual(addition(10, 5), 15)
        self.assertEqual(addition(100, 200), 300)
    
    def test_addition_nombres_negatifs(self):
        """Test avec des nombres négatifs"""
        self.assertEqual(addition(-2, -3), -5)
        self.assertEqual(addition(-10, -5), -15)
        self.assertEqual(addition(-100, -200), -300)
    
    def test_addition_nombres_mixtes(self):
        """Test avec un mélange de positifs et négatifs"""
        self.assertEqual(addition(5, -3), 2)
        self.assertEqual(addition(-5, 3), -2)
        self.assertEqual(addition(10, -10), 0)
    
    def test_addition_nombres_decimaux(self):
        """Test avec des nombres décimaux"""
        self.assertAlmostEqual(addition(2.5, 3.7), 6.2, places=10)
        self.assertAlmostEqual(addition(0.1, 0.2), 0.3, places=10)
        self.assertAlmostEqual(addition(1.5, -0.5), 1.0, places=10)
    
    def test_addition_avec_zero(self):
        """Test avec zéro (élément neutre)"""
        self.assertEqual(addition(0, 5), 5)
        self.assertEqual(addition(5, 0), 5)
        self.assertEqual(addition(0, 0), 0)
        self.assertEqual(addition(-5, 0), -5)
    
    def test_addition_grands_nombres(self):
        """Test avec de très grands nombres"""
        self.assertEqual(addition(1000000, 2000000), 3000000)
        self.assertEqual(addition(999999999, 1), 1000000000)


class TestMaximum(unittest.TestCase):
    """
    Tests dédiés à la fonction maximum
    """
    
    def test_maximum_nombres_positifs(self):
        """Test avec des nombres positifs"""
        self.assertEqual(maximum(5, 3), 5)
        self.assertEqual(maximum(3, 5), 5)
        self.assertEqual(maximum(100, 50), 100)
    
    def test_maximum_nombres_negatifs(self):
        """Test avec des nombres négatifs"""
        self.assertEqual(maximum(-2, -5), -2)
        self.assertEqual(maximum(-10, -3), -3)
        self.assertEqual(maximum(-100, -200), -100)
    
    def test_maximum_nombres_mixtes(self):
        """Test avec positifs et négatifs"""
        self.assertEqual(maximum(5, -3), 5)
        self.assertEqual(maximum(-5, 3), 3)
        self.assertEqual(maximum(0, -10), 0)
    
    def test_maximum_nombres_egaux(self):
        """Test avec des nombres égaux"""
        self.assertEqual(maximum(4, 4), 4)
        self.assertEqual(maximum(0, 0), 0)
        self.assertEqual(maximum(-5, -5), -5)
    
    def test_maximum_avec_zero(self):
        """Test avec zéro"""
        self.assertEqual(maximum(0, -5), 0)
        self.assertEqual(maximum(10, 0), 10)
        self.assertEqual(maximum(0, 5), 5)
    
    def test_maximum_nombres_decimaux(self):
        """Test avec des nombres décimaux"""
        self.assertEqual(maximum(3.14, 2.71), 3.14)
        self.assertEqual(maximum(0.1, 0.2), 0.2)
        self.assertAlmostEqual(maximum(1.999, 2.001), 2.001)


class TestFormatNom(unittest.TestCase):
    """
    Tests dédiés à la fonction format_nom
    """
    
    def test_format_nom_minuscules(self):
        """Test avec des noms en minuscules"""
        self.assertEqual(format_nom("jean", "dupont"), "DUPONT Jean")
        self.assertEqual(format_nom("marie", "martin"), "MARTIN Marie")
        self.assertEqual(format_nom("pierre", "bernard"), "BERNARD Pierre")
    
    def test_format_nom_majuscules(self):
        """Test avec des noms en majuscules"""
        self.assertEqual(format_nom("PIERRE", "BERNARD"), "BERNARD Pierre")
        self.assertEqual(format_nom("MARIE", "CURIE"), "CURIE Marie")
    
    def test_format_nom_casse_mixte(self):
        """Test avec une casse mixte"""
        self.assertEqual(format_nom("JeAn", "DuPoNt"), "DUPONT Jean")
        self.assertEqual(format_nom("mArIe", "mArTiN"), "MARTIN Marie")
    
    def test_format_nom_composes(self):
        """Test avec des noms composés"""
        self.assertEqual(format_nom("jean-paul", "sartre"), "SARTRE Jean-paul")
        self.assertEqual(format_nom("marie-claire", "dubois"), "DUBOIS Marie-claire")
    
    def test_format_nom_accents(self):
        """Test avec des caractères accentués"""
        self.assertEqual(format_nom("José", "García"), "GARCÍA José")
        self.assertEqual(format_nom("françois", "rené"), "RENÉ François")
    
    def test_format_nom_espaces(self):
        """Test avec des espaces dans les noms"""
        self.assertEqual(format_nom("jean pierre", "de la fontaine"), "DE LA FONTAINE Jean pierre")
    
    def test_format_nom_courts(self):
        """Test avec des noms très courts"""
        self.assertEqual(format_nom("a", "b"), "B A")
        self.assertEqual(format_nom("li", "wu"), "WU Li")
    
    def test_format_nom_longs(self):
        """Test avec des noms très longs"""
        prenom = "jean-baptiste-marie-joseph"
        nom = "de la rochefoucauld"
        resultat = format_nom(prenom, nom)
        self.assertTrue(resultat.startswith("DE LA ROCHEFOUCAULD"))
        self.assertTrue("Jean-baptiste-marie-joseph" in resultat)


if __name__ == '__main__':
    # Lancer tous les tests
    unittest.main(verbosity=2)
