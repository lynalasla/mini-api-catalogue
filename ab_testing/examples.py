"""
Examples of A/B tests for the e-commerce platform
"""

import json
import random
from datetime import datetime, timedelta
from ab_test import ab_manager


def setup_example_tests():
    """Setup example A/B tests for the e-commerce platform"""

    # Test 1: Product Card Design
    ab_manager.create_test(
        test_id='product_card_design',
        name='Product Card Design Test',
        description='Testing different product card layouts to improve CTR',
        variants=[
            {
                'name': 'control',
                'weight': 50.0,
                'description': 'Current design with image and basic info',
                'config': {
                    'layout': 'vertical',
                    'show_rating': True,
                    'show_stock': False
                }
            },
            {
                'name': 'variant_a',
                'weight': 50.0,
                'description': 'Horizontal layout with more product details',
                'config': {
                    'layout': 'horizontal',
                    'show_rating': True,
                    'show_stock': True,
                    'show_delivery_info': True
                }
            }
        ],
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=14)
    )

    # Test 2: Checkout Button Color
    ab_manager.create_test(
        test_id='checkout_button_color',
        name='Checkout Button Color Test',
        description='Testing button colors to improve conversion rate',
        variants=[
            {
                'name': 'control',
                'weight': 33.33,
                'description': 'Green button (current)',
                'config': {
                    'button_color': '#10b981',
                    'button_text': 'Checkout'
                }
            },
            {
                'name': 'variant_orange',
                'weight': 33.33,
                'description': 'Orange button',
                'config': {
                    'button_color': '#ff6b00',
                    'button_text': 'Checkout'
                }
            },
            {
                'name': 'variant_blue',
                'weight': 33.34,
                'description': 'Blue button',
                'config': {
                    'button_color': '#3b82f6',
                    'button_text': 'Complete Purchase'
                }
            }
        ],
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=21)
    )

    # Test 3: Free Shipping Banner
    ab_manager.create_test(
        test_id='free_shipping_banner',
        name='Free Shipping Banner Test',
        description='Testing impact of free shipping threshold messaging',
        variants=[
            {
                'name': 'control',
                'weight': 50.0,
                'description': 'No banner',
                'config': {
                    'show_banner': False
                }
            },
            {
                'name': 'variant_banner',
                'weight': 50.0,
                'description': 'Show free shipping banner',
                'config': {
                    'show_banner': True,
                    'threshold': 50.00,
                    'message': 'Free shipping on orders over $50!'
                }
            }
        ],
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=30)
    )

    # Test 4: Product Recommendation Algorithm
    ab_manager.create_test(
        test_id='recommendation_algorithm',
        name='Product Recommendation Algorithm Test',
        description='Testing different recommendation algorithms',
        variants=[
            {
                'name': 'control',
                'weight': 50.0,
                'description': 'Random recommendations',
                'config': {
                    'algorithm': 'random'
                }
            },
            {
                'name': 'variant_collaborative',
                'weight': 50.0,
                'description': 'Collaborative filtering',
                'config': {
                    'algorithm': 'collaborative_filtering',
                    'min_similarity': 0.3
                }
            }
        ],
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=45)
    )

    # Test 5: Search Bar Position
    ab_manager.create_test(
        test_id='search_bar_position',
        name='Search Bar Position Test',
        description='Testing search bar placement for better engagement',
        variants=[
            {
                'name': 'control',
                'weight': 50.0,
                'description': 'Top right corner',
                'config': {
                    'position': 'top-right',
                    'width': '300px'
                }
            },
            {
                'name': 'variant_center',
                'weight': 50.0,
                'description': 'Top center prominent',
                'config': {
                    'position': 'top-center',
                    'width': '500px',
                    'prominent': True
                }
            }
        ],
        start_date=datetime.now(),
        end_date=datetime.now() + timedelta(days=14)
    )

    print("✅ Example A/B tests created successfully!")
    active_count = len([t for t in ab_manager.tests.values()
                       if t.is_active()])
    print(f"Total active tests: {active_count}")


def simulate_test_data():
    """Simulate some test data for analysis"""
    users = [f"user_{i}" for i in range(1000)]

    for user_id in users:
        # Simulate page views
        for test_id in ab_manager.tests:
            variant = ab_manager.get_variant(test_id, user_id)

            # Track page view
            ab_manager.track_event(
                test_id=test_id,
                user_id=user_id,
                event_name='page_view',
                metadata={'variant': variant.name}
            )

            # Simulate conversion with different rates per variant
            conversion_rates = {
                'control': 0.05,
                'variant_a': 0.07,
                'variant_orange': 0.06,
                'variant_blue': 0.08,
                'variant_banner': 0.06,
                'variant_collaborative': 0.065,
                'variant_center': 0.055
            }

            rate = conversion_rates.get(variant.name, 0.05)
            if random.random() < rate:
                ab_manager.track_event(
                    test_id=test_id,
                    user_id=user_id,
                    event_name='conversion',
                    value=random.uniform(20, 200),
                    metadata={'variant': variant.name}
                )

    print("✅ Simulated test data generated!")


if __name__ == '__main__':
    setup_example_tests()
    simulate_test_data()

    # Show results for one test
    print("\n📊 Sample Results for 'checkout_button_color' test:")
    results = ab_manager.get_test_results('checkout_button_color')
    print(json.dumps(results, indent=2))
