from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET

from build_pages import build, CANONICAL, ORIGIN


class PagesPackagingTest(unittest.TestCase):
    def test_refuses_an_output_that_would_remove_source_files(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / 'dist'
            source.mkdir()
            (source / 'index.html').write_text('<title>Preserve</title>')
            with self.assertRaises(ValueError):
                build(source, Path(folder))
            self.assertTrue((source / 'index.html').exists())

    def test_preserves_subpath_assets_and_exposes_canonical_sitemap(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            source = root / 'source'
            assets = source / 'assets/project-2026'
            assets.mkdir(parents=True)
            (source / 'index.html').write_text('<html><head><title>Trabalho | Letícia</title></head><body><img src="assets/project-2026/galeria-a1-praca.webp"></body></html>')
            (assets / 'galeria-a1-praca.webp').write_bytes(b'image')
            (assets / 'galeria-a1-praca-thumb.webp').write_bytes(b'thumbnail')
            output = root / 'output'
            build(source, output)
            html = (output / 'tcc/index.html').read_text()
            self.assertIn(f'rel="canonical" href="{CANONICAL}"', html)
            self.assertIn('src="assets/project-2026/galeria-a1-praca.webp"', html)
            self.assertEqual((output / 'tcc/assets/project-2026/galeria-a1-praca.webp').read_bytes(), b'image')
            self.assertIn("location.search + location.hash", (output / 'index.html').read_text())
            self.assertIn(f'Sitemap: {ORIGIN}/sitemap.xml', (output / 'robots.txt').read_text())
            xml = ET.parse(output / 'sitemap.xml')
            ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'i': 'http://www.google.com/schemas/sitemap-image/1.1'}
            self.assertEqual([n.text for n in xml.findall('s:url/s:loc', ns)], [CANONICAL])
            self.assertEqual([n.text for n in xml.findall('s:url/i:image/i:loc', ns)], [CANONICAL+'assets/project-2026/galeria-a1-praca.webp'])


if __name__ == '__main__':
    unittest.main()
