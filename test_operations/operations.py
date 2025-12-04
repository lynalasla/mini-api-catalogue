"""
Module contenant des fonctions utilitaires pour diverses opérations
"""


def addition(a, b):
    """
    Additionne deux nombres
    
    Args:
        a (float): Premier nombre
        b (float): Deuxième nombre
    
    Returns:
        float: La somme de a et b
    """
    return a + b


def maximum(a, b):
    """
    Retourne le maximum entre deux nombres
    
    Args:
        a (float): Premier nombre
        b (float): Deuxième nombre
    
    Returns:
        float: Le plus grand des deux nombres
    """
    return a if a > b else b


def format_nom(prenom, nom):
    """
    Formate un nom complet en majuscules avec le format: NOM Prénom
    
    Args:
        prenom (str): Le prénom de la personne
        nom (str): Le nom de famille de la personne
    
    Returns:
        str: Le nom formaté au format "NOM Prénom"
    """
    return f"{nom.upper()} {prenom.capitalize()}"
