import importlib.util, pathlib, unittest
spec = importlib.util.spec_from_file_location('reviews', pathlib.Path(__file__).resolve().parents[1] / 'collectors' / 'reviews.py')
module = importlib.util.module_from_spec(spec); spec.loader.exec_module(module)
class CollectorTests(unittest.TestCase):
    def test_zero_cap_is_not_failure(self):
        result = module.collect({'limit': 0, 'platform': 'ios', 'app': '123', 'country': 'us', 'language': 'en'})
        self.assertEqual(result['reviews'], [])
        self.assertEqual(result['status'], 'disabled')
    def test_strict_cap_and_duplicate_ids(self):
        from unittest.mock import patch
        import json
        entry = {'id': {'label': 'abc'}, 'im:rating': {'label': '2'}, 'content': {'label': 'actual comment'}}
        class Response:
            def __enter__(self): return self
            def __exit__(self, *args): pass
            def read(self, *args): return json.dumps({'feed': {'entry': [entry, entry]}}).encode()
        with patch('urllib.request.urlopen', return_value=Response()), patch('time.sleep'):
            result = module.collect({'limit': 1, 'platform': 'ios', 'app': '123', 'country': 'us', 'language': 'en'})
        self.assertEqual(len(result['reviews']), 1)
        self.assertEqual(result['reviews'][0]['text'], 'actual comment')
if __name__ == '__main__': unittest.main()
