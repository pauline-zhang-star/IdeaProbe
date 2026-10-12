"""Public review collectors. JSON stdin/stdout; never fabricate missing reviews."""
import json, sys, time, urllib.request

def collect(config):
    rows, seen, errors = [], set(), []
    limit = max(0, min(int(config.get('limit', 500)), 3000))
    def add(r):
        if r['id'] and r['id'] not in seen and len(rows) < limit:
            seen.add(r['id']); rows.append(r)
    if not limit: return {'reviews': [], 'status': 'disabled', 'errors': []}
    platform, app = config['platform'], config['app']
    if platform == 'ios':
        for sort in ('mostrecent', 'mosthelpful'):
            for page in range(1, 11):
                if len(rows) >= limit: break
                url = 'https://itunes.apple.com/{}/rss/customerreviews/page={}/id={}/sortby={}/json'.format(config['country'], page, app, sort)
                entries = None
                for attempt in range(3):
                    try:
                        req = urllib.request.Request(url, headers={'User-Agent': 'IdeaResearch/0.1'})
                        with urllib.request.urlopen(req, timeout=20) as response:
                            entries = json.loads(response.read(2000000)).get('feed', {}).get('entry', [])
                        if isinstance(entries, dict): entries = [entries]
                        break
                    except Exception:
                        if attempt == 2: errors.append({'page': page, 'sort': sort, 'reason': 'request_failed'})
                        else: time.sleep(2 ** attempt)
                if not entries: break
                for e in entries:
                    score = e.get('im:rating', {}).get('label', '')
                    if not str(score).isdigit(): continue
                    add({'id': e.get('id', {}).get('label', ''), 'text': e.get('content', {}).get('label', ''), 'rating': int(score), 'date': e.get('updated', {}).get('label', ''), 'version': e.get('im:version', {}).get('label', ''), 'source_url': url, 'sampling_order': sort})
                time.sleep(.5)
    elif platform == 'android':
        try:
            from google_play_scraper import reviews, Sort
            token, tokens = None, set()
            while len(rows) < limit:
                result, next_token = reviews(app, lang=config['language'], country=config['country'], sort=Sort.NEWEST, count=min(200, limit-len(rows)), continuation_token=token)
                for r in result:
                    add({'id': r.get('reviewId',''), 'text': r.get('content','') or '', 'rating': r.get('score'), 'date': r['at'].isoformat() if r.get('at') else '', 'version': r.get('reviewCreatedVersion'), 'source_url': 'https://play.google.com/store/apps/details?id='+app, 'sampling_order': 'newest'})
                marker = repr(next_token)
                if not result or not next_token or marker in tokens: break
                tokens.add(marker); token = next_token; time.sleep(1)
        except ImportError: errors.append({'reason': 'missing_google_play_scraper'})
        except Exception: errors.append({'reason': 'request_failed'})
    for r in rows: r.update(platform=platform, country=config['country'], language=config['language'], app_id=app)
    return {'reviews': rows, 'status': 'partial' if rows and errors else 'failed' if errors else 'ok' if rows else 'empty', 'errors': errors}

if __name__ == '__main__':
    try: print(json.dumps(collect(json.load(sys.stdin)), ensure_ascii=False))
    except Exception: print(json.dumps({'reviews': [], 'status': 'failed', 'errors': [{'reason': 'invalid_collector_input'}]}))
