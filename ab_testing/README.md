# A/B Testing Module

A comprehensive A/B testing framework with statistical analysis for the Mini API Catalogue project.

## Features

- ✅ **Consistent User Assignment** - Uses hashing to ensure users always see the same variant
- ✅ **Multiple Variants** - Support for A/B/n tests with any number of variants
- ✅ **Statistical Analysis** - Z-test, Chi-square, Bayesian analysis
- ✅ **Sample Size Calculator** - Determine required sample size before starting
- ✅ **Event Tracking** - Track conversions, page views, and custom events
- ✅ **CLI Tools** - Command-line interface for managing tests
- ✅ **REST API** - Flask API for integration with frontend
- ✅ **Confidence Intervals** - Calculate CI for conversion rates
- ✅ **Real-time Results** - View test results as data comes in

## Installation

```bash
cd ab_testing
pip install -r requirements.txt
```

## Quick Start

### 1. Setup Example Tests

```bash
python cli.py setup-examples
```

### 2. Simulate Test Data

```bash
python cli.py simulate
```

### 3. View Results

```bash
# List all tests
python cli.py list

# View detailed results with statistical analysis
python cli.py results checkout_button_color --detailed
```

### 4. Start API Server

```bash
python api.py
```

The API will be available at `http://localhost:5001`

## Usage Examples

### Python API

```python
from ab_test import ab_manager
from datetime import datetime, timedelta

# Create a test
ab_manager.create_test(
    test_id='button_color',
    name='Button Color Test',
    description='Testing different button colors',
    variants=[
        {
            'name': 'control',
            'weight': 50.0,
            'description': 'Green button',
            'config': {'color': '#10b981'}
        },
        {
            'name': 'variant',
            'weight': 50.0,
            'description': 'Orange button',
            'config': {'color': '#ff6b00'}
        }
    ],
    start_date=datetime.now(),
    end_date=datetime.now() + timedelta(days=14)
)

# Get variant for a user
variant = ab_manager.get_variant('button_color', 'user_123')
print(f"User gets variant: {variant.name}")
print(f"Button color: {variant.config['color']}")

# Track events
ab_manager.track_event(
    test_id='button_color',
    user_id='user_123',
    event_name='page_view'
)

ab_manager.track_event(
    test_id='button_color',
    user_id='user_123',
    event_name='conversion',
    value=49.99
)

# Get results
results = ab_manager.get_test_results('button_color')
```

### REST API Endpoints

#### Get Variant for User
```bash
GET /api/ab-test/variant/{test_id}/{user_id}
```

Response:
```json
{
  "test_id": "button_color",
  "user_id": "user_123",
  "variant": {
    "name": "control",
    "description": "Green button",
    "config": {
      "color": "#10b981"
    }
  }
}
```

#### Track Event
```bash
POST /api/ab-test/track
Content-Type: application/json

{
  "test_id": "button_color",
  "user_id": "user_123",
  "event_name": "conversion",
  "value": 49.99,
  "metadata": {
    "product_id": "123"
  }
}
```

#### Get Test Results
```bash
GET /api/ab-test/results/{test_id}?detailed=true
```

#### List All Tests
```bash
GET /api/ab-test/tests
```

#### Create New Test
```bash
POST /api/ab-test/create
Content-Type: application/json

{
  "test_id": "new_test",
  "name": "My Test",
  "description": "Test description",
  "variants": [
    {
      "name": "control",
      "weight": 50.0,
      "description": "Control variant"
    },
    {
      "name": "variant",
      "weight": 50.0,
      "description": "Test variant"
    }
  ],
  "start_date": "2025-12-04T00:00:00",
  "end_date": "2025-12-18T23:59:59"
}
```

### CLI Commands

```bash
# List all tests
python cli.py list

# Show test results
python cli.py results <test_id>

# Show detailed statistical analysis
python cli.py results <test_id> --detailed

# Calculate required sample size
python cli.py sample-size 0.05 0.20
# Args: baseline_rate (5%), minimum_detectable_effect (20%)

# Track a conversion manually
python cli.py track <test_id> <user_id> --value 99.99

# Export results to JSON
python cli.py export <test_id> results.json
```

## Statistical Analysis

The framework provides comprehensive statistical analysis:

### Z-Test
- Tests for statistical significance between variants
- Calculates p-value and confidence level
- Computes lift percentage

### Chi-Square Test
- Tests for independence between variants
- Validates results with different statistical approach

### Bayesian Analysis
- Calculates probability that variant is better than control
- Uses Beta distribution
- More intuitive interpretation than p-values

### Confidence Intervals
- 95% confidence intervals for conversion rates
- Helps visualize uncertainty in estimates

### Sample Size Calculator
- Determines required sample size before starting test
- Based on baseline rate and minimum detectable effect
- Ensures adequate statistical power

## Example Tests Included

1. **Product Card Design** - Testing different product card layouts
2. **Checkout Button Color** - Three-way test of button colors
3. **Free Shipping Banner** - Testing impact of free shipping messaging
4. **Recommendation Algorithm** - Comparing recommendation strategies
5. **Search Bar Position** - Testing search bar placement

## Integration with Frontend

```javascript
// Get variant for current user
const response = await fetch(`/api/ab-test/variant/button_color/${userId}`);
const { variant } = await response.json();

// Apply variant configuration
if (variant.name === 'control') {
  buttonColor = '#10b981';
} else {
  buttonColor = variant.config.color;
}

// Track conversion
await fetch('/api/ab-test/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    test_id: 'button_color',
    user_id: userId,
    event_name: 'conversion',
    value: orderTotal
  })
});
```

## Best Practices

1. **Always calculate sample size first** - Don't start a test without knowing how long it needs to run
2. **Run tests for full business cycles** - Include weekends if your traffic patterns vary
3. **One test at a time per metric** - Avoid interaction effects
4. **Wait for statistical significance** - Don't call tests early
5. **Consider practical significance** - A 1% lift might be statistically significant but not worth implementing
6. **Monitor test health** - Check that traffic is being split correctly
7. **Document everything** - Keep track of what you're testing and why

## Troubleshooting

### Tests not appearing
- Check that start_date is in the past
- Verify test is marked as active

### No statistical significance
- Calculate required sample size
- Run test longer to collect more data
- Consider increasing minimum detectable effect

### Inconsistent results
- Ensure user IDs are consistent
- Check for sampling ratio mismatch
- Verify events are being tracked correctly

## CI/CD Integration

The A/B testing module is fully integrated into the GitHub Actions CI/CD pipeline:

### Automated Testing

Every push and pull request triggers:
- **flake8** - Syntax and style validation (PEP 8)
- **pylint** - Code quality analysis
- **Import tests** - Validates all modules can be imported
- **Example setup** - Tests that examples work correctly

### Quality Standards

- ✅ **0 errors** - All 160 flake8 errors fixed
- ✅ **PEP 8 compliant** - Max line length 79 characters
- ✅ **No unused imports** - Clean, optimized code
- ✅ **1067 lines** - 5 Python modules

See `CI_INTEGRATION.md` for detailed information about the CI setup.

## Contributing

To add new test types or analysis methods, extend the base classes in `ab_test.py` and `statistical_analysis.py`.

## License

MIT
