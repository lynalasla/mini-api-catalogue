"""
Statistical Analysis for A/B Tests
Performs statistical significance testing
"""

import math
from typing import Dict, Tuple
from scipy import stats
import numpy as np


class ABTestAnalyzer:
    """Performs statistical analysis on A/B test results"""

    @staticmethod
    def calculate_conversion_rate(conversions: int, visitors: int) -> float:
        """Calculate conversion rate"""
        if visitors == 0:
            return 0.0
        return conversions / visitors

    @staticmethod
    def calculate_standard_error(
            conversion_rate: float,
            visitors: int) -> float:
        """Calculate standard error for conversion rate"""
        if visitors == 0:
            return 0.0
        return math.sqrt((conversion_rate * (1 - conversion_rate)) / visitors)

    @staticmethod
    def z_test(
        control_conversions: int,
        control_visitors: int,
        variant_conversions: int,
        variant_visitors: int
    ) -> Dict[str, float]:
        """
        Perform Z-test to compare two conversion rates
        Returns p-value and confidence level
        """
        # Calculate conversion rates
        p1 = (control_conversions / control_visitors
              if control_visitors > 0 else 0)
        p2 = (variant_conversions / variant_visitors
              if variant_visitors > 0 else 0)

        # Calculate pooled probability
        p_pool = (control_conversions + variant_conversions) / \
            (control_visitors + variant_visitors)

        # Calculate standard error
        se = math.sqrt(p_pool * (1 - p_pool) *
                       (1 / control_visitors + 1 / variant_visitors))

        # Calculate z-score
        if se == 0:
            z_score = 0
        else:
            z_score = (p2 - p1) / se

        # Calculate p-value (two-tailed test)
        p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))

        # Calculate confidence level
        confidence = (1 - p_value) * 100

        # Calculate lift
        lift = ((p2 - p1) / p1 * 100) if p1 > 0 else 0

        return {
            'z_score': z_score,
            'p_value': p_value,
            'confidence': confidence,
            'is_significant': p_value < 0.05,  # 95% confidence
            'control_rate': p1,
            'variant_rate': p2,
            'lift': lift
        }

    @staticmethod
    def chi_square_test(
        control_conversions: int,
        control_visitors: int,
        variant_conversions: int,
        variant_visitors: int
    ) -> Dict[str, float]:
        """
        Perform Chi-Square test for independence
        """
        # Create contingency table
        observed = np.array([
            [control_conversions, control_visitors - control_conversions],
            [variant_conversions, variant_visitors - variant_conversions]
        ])

        # Perform chi-square test
        chi2, p_value, dof, _expected = stats.chi2_contingency(observed)

        return {
            'chi_square': chi2,
            'p_value': p_value,
            'degrees_of_freedom': dof,
            'is_significant': p_value < 0.05
        }

    @staticmethod
    def calculate_sample_size(
        baseline_rate: float,
        minimum_detectable_effect: float,
        alpha: float = 0.05,
        power: float = 0.8
    ) -> int:
        """
        Calculate required sample size for A/B test

        Args:
            baseline_rate: Current conversion rate (0-1)
            minimum_detectable_effect: Smallest change to detect
                (e.g., 0.1 for 10%)
            alpha: Significance level (default 0.05 for 95% confidence)
            power: Statistical power (default 0.8)
        """
        # Z-scores for alpha and power
        z_alpha = stats.norm.ppf(1 - alpha / 2)
        z_beta = stats.norm.ppf(power)

        # Expected variant rate
        variant_rate = baseline_rate * (1 + minimum_detectable_effect)

        # Calculate pooled standard deviation
        pooled_std = math.sqrt(
            baseline_rate * (1 - baseline_rate) +
            variant_rate * (1 - variant_rate)
        )

        # Calculate sample size per variant
        n = ((z_alpha + z_beta) * pooled_std /
             (variant_rate - baseline_rate)) ** 2

        return math.ceil(n)

    @staticmethod
    def confidence_interval(
        conversions: int,
        visitors: int,
        confidence_level: float = 0.95
    ) -> Tuple[float, float]:
        """
        Calculate confidence interval for conversion rate
        """
        if visitors == 0:
            return (0.0, 0.0)

        rate = conversions / visitors
        z = stats.norm.ppf(1 - (1 - confidence_level) / 2)
        se = math.sqrt((rate * (1 - rate)) / visitors)

        lower = max(0, rate - z * se)
        upper = min(1, rate + z * se)

        return (lower, upper)

    @staticmethod
    def bayesian_probability(
        control_conversions: int,
        control_visitors: int,
        variant_conversions: int,
        variant_visitors: int,
        num_simulations: int = 100000
    ) -> float:
        """
        Calculate Bayesian probability that variant is better than control
        Uses Beta distribution
        """
        # Beta distribution parameters (using uniform prior)
        alpha_control = control_conversions + 1
        beta_control = control_visitors - control_conversions + 1

        alpha_variant = variant_conversions + 1
        beta_variant = variant_visitors - variant_conversions + 1

        # Sample from Beta distributions
        control_samples = np.random.beta(
            alpha_control, beta_control, num_simulations)
        variant_samples = np.random.beta(
            alpha_variant, beta_variant, num_simulations)

        # Calculate probability that variant > control
        probability = np.mean(variant_samples > control_samples)

        return probability


# Example usage functions
def analyze_test(
    control_conversions: int,
    control_visitors: int,
    variant_conversions: int,
    variant_visitors: int
) -> Dict:
    """
    Comprehensive analysis of an A/B test
    """
    analyzer = ABTestAnalyzer()

    # Z-test
    z_test_results = analyzer.z_test(
        control_conversions, control_visitors,
        variant_conversions, variant_visitors
    )

    # Chi-square test
    chi_square_results = analyzer.chi_square_test(
        control_conversions, control_visitors,
        variant_conversions, variant_visitors
    )

    # Confidence intervals
    control_ci = analyzer.confidence_interval(
        control_conversions, control_visitors)
    variant_ci = analyzer.confidence_interval(
        variant_conversions, variant_visitors)

    # Bayesian probability
    bayesian_prob = analyzer.bayesian_probability(
        control_conversions, control_visitors,
        variant_conversions, variant_visitors
    )

    return {
        'z_test': z_test_results,
        'chi_square': chi_square_results,
        'confidence_intervals': {
            'control': {'lower': control_ci[0], 'upper': control_ci[1]},
            'variant': {'lower': variant_ci[0], 'upper': variant_ci[1]}
        },
        'bayesian_probability_variant_better': bayesian_prob,
        'recommendation': _get_recommendation(z_test_results, bayesian_prob)
    }


def _get_recommendation(z_test_results: Dict, bayesian_prob: float) -> str:
    """Generate recommendation based on test results"""
    if z_test_results['is_significant'] and bayesian_prob > 0.95:
        if z_test_results['lift'] > 0:
            return ("STRONGLY RECOMMEND: Deploy variant - "
                    "statistically significant improvement")
        return "STRONGLY RECOMMEND: Keep control - variant performs worse"
    if z_test_results['is_significant']:
        if z_test_results['lift'] > 0:
            return ("RECOMMEND: Deploy variant - "
                    "statistically significant improvement")
        return "RECOMMEND: Keep control - variant performs worse"
    if bayesian_prob > 0.9:
        return "CONSIDER: Variant shows promise but needs more data"
    return "INCONCLUSIVE: Continue test or redesign experiment"
