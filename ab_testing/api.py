"""
Flask API endpoints for A/B testing
Integrate with the main Express API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ab_test import ab_manager
from statistical_analysis import analyze_test
from datetime import datetime

app = Flask(__name__)
CORS(app)


@app.route('/api/ab-test/variant/<test_id>/<user_id>', methods=['GET'])
def get_variant(test_id, user_id):
    """Get the assigned variant for a user"""
    variant = ab_manager.get_variant(test_id, user_id)

    if not variant:
        return jsonify({'error': 'Test not found'}), 404

    return jsonify({
        'test_id': test_id,
        'user_id': user_id,
        'variant': {
            'name': variant.name,
            'description': variant.description,
            'config': variant.config
        }
    })


@app.route('/api/ab-test/track', methods=['POST'])
def track_event():
    """Track an event for A/B test"""
    data = request.json

    required_fields = ['test_id', 'user_id', 'event_name']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    ab_manager.track_event(
        test_id=data['test_id'],
        user_id=data['user_id'],
        event_name=data['event_name'],
        value=data.get('value'),
        metadata=data.get('metadata')
    )

    return jsonify({'success': True})


@app.route('/api/ab-test/tests', methods=['GET'])
def list_tests():
    """List all A/B tests"""
    tests = []
    for test_id, test in ab_manager.tests.items():
        tests.append({
            'test_id': test_id,
            'name': test.name,
            'description': test.description,
            'active': test.is_active(),
            'start_date': test.start_date.isoformat(),
            'end_date': test.end_date.isoformat() if test.end_date else None,
            'variants': [
                {
                    'name': v.name,
                    'weight': v.weight,
                    'description': v.description
                }
                for v in test.variants
            ]
        })

    return jsonify({'tests': tests})


@app.route('/api/ab-test/results/<test_id>', methods=['GET'])
def get_results(test_id):
    """Get results for a specific test"""
    if test_id not in ab_manager.tests:
        return jsonify({'error': 'Test not found'}), 404

    results = ab_manager.get_test_results(test_id)

    # Add statistical analysis if requested
    if request.args.get('detailed') == 'true' and len(
            results['variants']) >= 2:
        variants_list = list(results['variants'].items())
        control = variants_list[0][1]

        analyses = []
        for i in range(1, len(variants_list)):
            variant_name, variant = variants_list[i]

            analysis = analyze_test(
                control['conversions'],
                control['unique_users'],
                variant['conversions'],
                variant['unique_users']
            )

            analyses.append({
                'variant': variant_name,
                'analysis': analysis
            })

        results['statistical_analysis'] = analyses

    return jsonify(results)


@app.route('/api/ab-test/create', methods=['POST'])
def create_test():
    """Create a new A/B test"""
    data = request.json

    try:
        start_date = datetime.fromisoformat(data['start_date'])
        end_date = datetime.fromisoformat(
            data['end_date']) if data.get('end_date') else None

        test = ab_manager.create_test(
            test_id=data['test_id'],
            name=data['name'],
            description=data['description'],
            variants=data['variants'],
            start_date=start_date,
            end_date=end_date
        )

        return jsonify({
            'success': True,
            'test_id': test.test_id,
            'message': 'Test created successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/ab-test/stop/<test_id>', methods=['POST'])
def stop_test(test_id):
    """Stop a running test"""
    if test_id not in ab_manager.tests:
        return jsonify({'error': 'Test not found'}), 404

    ab_manager.stop_test(test_id)

    return jsonify({
        'success': True,
        'message': f'Test {test_id} stopped'
    })


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'active_tests': len(
            [t for t in ab_manager.tests.values() if t.is_active()]
        ),
        'total_events': len(ab_manager.events)
    })


if __name__ == '__main__':
    # Load example tests for development
    from examples import setup_example_tests
    setup_example_tests()

    app.run(host='0.0.0.0', port=5001, debug=True)
