#!/usr/bin/env python3
"""
Command-line interface for A/B testing
"""

import argparse
from ab_test import ab_manager
from statistical_analysis import analyze_test, ABTestAnalyzer
from examples import setup_example_tests, simulate_test_data


def list_tests():
    """List all A/B tests"""
    print("\n📋 Active A/B Tests:")
    print("=" * 80)

    for test_id, test in ab_manager.tests.items():
        status = "✅ Active" if test.is_active() else "❌ Inactive"
        print(f"\n{status} {test.name} ({test_id})")
        print(f"   Description: {test.description}")
        print("   Variants:")
        for variant in test.variants:
            print(f"      - {variant.name}: {variant.weight}% traffic")
        print(
            f"   Period: {
                test.start_date.date()} to {
                test.end_date.date() if test.end_date else 'ongoing'}")


def show_results(test_id: str, detailed: bool = False):
    """Show results for a specific test"""
    if test_id not in ab_manager.tests:
        print(f"❌ Test '{test_id}' not found!")
        return

    test = ab_manager.tests[test_id]
    results = ab_manager.get_test_results(test_id)

    print(f"\n📊 Results for: {test.name}")
    print("=" * 80)
    print(f"Test ID: {test_id}")
    print(f"Total Events: {results['total_events']}")
    print()

    # Display variant results
    for variant_name, variant_data in results['variants'].items():
        print(f"Variant: {variant_name}")
        print(f"   Unique Users: {variant_data['unique_users']}")
        print(f"   Conversions: {variant_data['conversions']}")
        print(f"   Conversion Rate: {variant_data['conversion_rate']:.2%}")
        print(f"   Average Value: ${variant_data['average_value']:.2f}")
        print()

    # Perform statistical analysis if we have control and variant
    if detailed and len(results['variants']) >= 2:
        variants_list = list(results['variants'].items())
        control = variants_list[0][1]

        for i in range(1, len(variants_list)):
            variant_name, variant = variants_list[i]

            print(f"\n📈 Statistical Analysis: Control vs {variant_name}")
            print("-" * 80)

            analysis = analyze_test(
                control['conversions'],
                control['unique_users'],
                variant['conversions'],
                variant['unique_users']
            )

            z_test = analysis['z_test']
            print(f"Conversion Rate Lift: {z_test['lift']:.2f}%")
            print(
                f"Statistical Significance: {
                    '✅ YES' if z_test['is_significant'] else '❌ NO'}")
            print(f"P-value: {z_test['p_value']:.4f}")
            print(f"Confidence: {z_test['confidence']:.2f}%")
            print(
                f"Bayesian Probability (Variant Better): {
                    analysis['bayesian_probability_variant_better']:.2%}")
            print(f"\n💡 Recommendation: {analysis['recommendation']}")
            print()


def calculate_sample_size(baseline_rate: float, mde: float):
    """Calculate required sample size"""
    analyzer = ABTestAnalyzer()
    sample_size = analyzer.calculate_sample_size(baseline_rate, mde)

    print("\n📏 Sample Size Calculator")
    print("=" * 80)
    print(f"Baseline Conversion Rate: {baseline_rate:.2%}")
    print(f"Minimum Detectable Effect: {mde:.2%}")
    print("Significance Level: 95%")
    print("Statistical Power: 80%")
    print()
    print(f"✅ Required sample size per variant: {sample_size:,} users")
    print(f"   Total required: {sample_size * 2:,} users")


def track_conversion(test_id: str, user_id: str, value: float = None):
    """Track a conversion event"""
    if test_id not in ab_manager.tests:
        print(f"❌ Test '{test_id}' not found!")
        return

    variant = ab_manager.get_variant(test_id, user_id)
    ab_manager.track_event(
        test_id=test_id,
        user_id=user_id,
        event_name='conversion',
        value=value
    )

    print(
        f"✅ Conversion tracked for user {user_id} in variant '{
            variant.name}'")


def export_results(test_id: str, filename: str):
    """Export results to file"""
    if test_id not in ab_manager.tests:
        print(f"❌ Test '{test_id}' not found!")
        return

    ab_manager.export_results(test_id, filename)
    print(f"✅ Results exported to {filename}")


def main():
    parser = argparse.ArgumentParser(description='A/B Testing CLI')
    subparsers = parser.add_subparsers(
        dest='command', help='Available commands')

    # List tests
    subparsers.add_parser('list', help='List all A/B tests')

    # Show results
    results_parser = subparsers.add_parser('results', help='Show test results')
    results_parser.add_argument('test_id', help='Test ID')
    results_parser.add_argument(
        '--detailed',
        action='store_true',
        help='Show detailed statistical analysis')

    # Calculate sample size
    sample_parser = subparsers.add_parser(
        'sample-size', help='Calculate required sample size')
    sample_parser.add_argument(
        'baseline',
        type=float,
        help='Baseline conversion rate (0-1)')
    sample_parser.add_argument(
        'mde',
        type=float,
        help='Minimum detectable effect (0-1)')

    # Track conversion
    track_parser = subparsers.add_parser('track', help='Track a conversion')
    track_parser.add_argument('test_id', help='Test ID')
    track_parser.add_argument('user_id', help='User ID')
    track_parser.add_argument('--value', type=float, help='Conversion value')

    # Export results
    export_parser = subparsers.add_parser('export', help='Export test results')
    export_parser.add_argument('test_id', help='Test ID')
    export_parser.add_argument('filename', help='Output filename')

    # Setup examples
    subparsers.add_parser('setup-examples', help='Setup example tests')

    # Simulate data
    subparsers.add_parser('simulate', help='Simulate test data')

    args = parser.parse_args()

    if args.command == 'list':
        list_tests()
    elif args.command == 'results':
        show_results(args.test_id, args.detailed)
    elif args.command == 'sample-size':
        calculate_sample_size(args.baseline, args.mde)
    elif args.command == 'track':
        track_conversion(args.test_id, args.user_id, args.value)
    elif args.command == 'export':
        export_results(args.test_id, args.filename)
    elif args.command == 'setup-examples':
        setup_example_tests()
    elif args.command == 'simulate':
        setup_example_tests()
        simulate_test_data()
        msg = "python cli.py results checkout_button_color --detailed"
        print(f"\n✅ Run '{msg}' to see analysis")
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
