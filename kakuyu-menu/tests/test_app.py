import unittest
from unittest.mock import patch

import app as menu_app


class MenuAppTests(unittest.TestCase):
    def setUp(self):
        menu_app.app.config.update(TESTING=True)
        self.client = menu_app.app.test_client()

    def test_index_loads(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('鶴友寮 食堂メニュー'.encode(), response.data)

    def test_month_extraction_reiwa(self):
        key, label = menu_app._extract_month('学寮食堂献立表（令和8年9月）', 'https://www.maizuru-ct.ac.jp/kakuyu/2026/09/10/2191/')
        self.assertEqual(key, '2026-09')
        self.assertEqual(label, '令和8年9月')

    def test_month_extraction_western(self):
        key, label = menu_app._extract_month('2027年1月 学寮食堂献立表', 'https://www.maizuru-ct.ac.jp/kakuyu/2027/01/02/1/')
        self.assertEqual(key, '2027-01')
        self.assertEqual(label, '2027年1月')

    @patch.object(menu_app, 'get_menus')
    def test_api_returns_menu_data(self, mocked_get_menus):
        mocked_get_menus.return_value = {
            'menus': [menu_app.FALLBACK_MENU],
            'status': 'ok',
            'message': 'テスト取得',
            'source_url': menu_app.CATEGORY_URL,
            'updated_at': '2026-11-21T00:00:00+00:00',
        }
        response = self.client.get('/api/menus')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['menus'][0]['month'], '2026-09')

    def test_health(self):
        response = self.client.get('/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['status'], 'ok')


if __name__ == '__main__':
    unittest.main()
