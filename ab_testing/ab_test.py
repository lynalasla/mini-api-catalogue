"""
A/B Testing Module for Mini API Catalogue
Provides functionality for running and analyzing A/B tests
"""

import hashlib
import json
from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass


@dataclass
class Variant:
    """Represents a variant in an A/B test"""
    name: str
    weight: float  # Percentage of traffic (0-100)
    description: str
    config: Dict = None

    def __post_init__(self):
        if self.config is None:
            self.config = {}


@dataclass
class ABTest:
    """Represents an A/B test configuration"""
    test_id: str
    name: str
    description: str
    variants: List[Variant]
    start_date: datetime
    end_date: Optional[datetime]
    active: bool = True

    def is_active(self) -> bool:
        """Check if test is currently active"""
        now = datetime.now()
        if not self.active:
            return False
        if self.start_date > now:
            return False
        if self.end_date and self.end_date < now:
            return False
        return True

    def get_variant(self, user_id: str) -> Variant:
        """
        Assign a variant to a user based on consistent hashing
        This ensures the same user always gets the same variant
        """
        if not self.is_active():
            return self.variants[0]  # Default to control group

        # Create a hash of user_id + test_id for consistent assignment
        hash_input = f"{user_id}-{self.test_id}"
        hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)

        # Normalize to 0-100 range
        normalized = (hash_value % 10000) / 100

        # Assign variant based on weight distribution
        cumulative = 0
        for variant in self.variants:
            cumulative += variant.weight
            if normalized <= cumulative:
                return variant

        return self.variants[-1]  # Fallback to last variant


class ABTestManager:
    """Manages A/B tests and tracks results"""

    def __init__(self):
        self.tests: Dict[str, ABTest] = {}
        self.events: List[Dict] = []

    def create_test(
        self,
        test_id: str,
        name: str,
        description: str,
        variants: List[Dict],
        start_date: datetime,
        end_date: Optional[datetime] = None
    ) -> ABTest:
        """Create a new A/B test"""
        variant_objects = [
            Variant(
                name=v['name'],
                weight=v['weight'],
                description=v.get('description', ''),
                config=v.get('config', {})
            )
            for v in variants
        ]

        # Validate weights sum to 100
        total_weight = sum(v.weight for v in variant_objects)
        if abs(total_weight - 100.0) > 0.01:
            raise ValueError(
                f"Variant weights must sum to 100, got {total_weight}")

        test = ABTest(
            test_id=test_id,
            name=name,
            description=description,
            variants=variant_objects,
            start_date=start_date,
            end_date=end_date
        )

        self.tests[test_id] = test
        return test

    def get_variant(self, test_id: str, user_id: str) -> Optional[Variant]:
        """Get the variant for a specific user in a test"""
        test = self.tests.get(test_id)
        if not test:
            return None
        return test.get_variant(user_id)

    def track_event(
        self,
        test_id: str,
        user_id: str,
        event_name: str,
        value: Optional[float] = None,
        metadata: Optional[Dict] = None
    ):
        """Track an event for analysis"""
        test = self.tests.get(test_id)
        if not test:
            return

        variant = test.get_variant(user_id)

        event = {
            'timestamp': datetime.now().isoformat(),
            'test_id': test_id,
            'user_id': user_id,
            'variant': variant.name,
            'event_name': event_name,
            'value': value,
            'metadata': metadata or {}
        }

        self.events.append(event)

    def get_test_results(self, test_id: str) -> Dict:
        """Get aggregated results for a test"""
        test = self.tests.get(test_id)
        if not test:
            return {}

        test_events = [e for e in self.events if e['test_id'] == test_id]

        results = {
            'test_id': test_id,
            'test_name': test.name,
            'total_events': len(test_events),
            'variants': {}
        }

        for variant in test.variants:
            variant_events = [
                e for e in test_events if e['variant'] == variant.name]

            unique_users = len(set(e['user_id'] for e in variant_events))

            # Calculate conversion events (you can customize this)
            conversions = [
                e for e in variant_events if e['event_name'] == 'conversion']
            conversion_rate = len(conversions) / \
                unique_users if unique_users > 0 else 0

            # Calculate average value
            values = [e['value']
                      for e in variant_events if e['value'] is not None]
            avg_value = sum(values) / len(values) if values else 0

            results['variants'][variant.name] = {
                'total_events': len(variant_events),
                'unique_users': unique_users,
                'conversions': len(conversions),
                'conversion_rate': conversion_rate,
                'average_value': avg_value
            }

        return results

    def export_results(self, test_id: str, filename: str):
        """Export test results to a JSON file"""
        results = self.get_test_results(test_id)
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)

    def stop_test(self, test_id: str):
        """Stop a running test"""
        if test_id in self.tests:
            self.tests[test_id].active = False


# Global instance
ab_manager = ABTestManager()
