"""Package the existing presentation at /tcc and add domain-wide discovery files."""
from html import escape
import json
from pathlib import Path
import re
import shutil
import xml.etree.ElementTree as ET

DOMAIN = 'leticiaos.arq.br'
ORIGIN = f'https://{DOMAIN}'
CANONICAL = f'{ORIGIN}/tcc/'
SITE = Path(__file__).resolve().parent
OUTPUT = SITE / '_site'


def add_metadata(html):
    title_match = re.search(r'<title>(.*?)</title>', html, re.S)
    if not title_match:
        raise ValueError('The presentation must have a title.')
    title = title_match.group(1)
    work_title = title.split(' | ')[0]
    image = f'{CANONICAL}assets/project-2026/galeria-a1-praca.webp'
    structured = {
        '@context': 'https://schema.org', '@type': 'CreativeWork',
        'name': work_title, 'url': CANONICAL, 'inLanguage': 'pt-BR',
        'author': {'@type': 'Person', 'name': 'Letícia Oliveira Santos'},
        'image': image,
    }
    tags = [
        f'<link rel="canonical" href="{CANONICAL}">',
        '<meta name="robots" content="index,follow,max-image-preview:large">',
        '<meta property="og:type" content="website">',
        '<meta property="og:locale" content="pt_BR">',
        '<meta property="og:site_name" content="Letícia Oliveira Santos">',
        f'<meta property="og:title" content="{escape(work_title, quote=True)}">',
        f'<meta property="og:description" content="{escape(work_title, quote=True)}">',
        f'<meta property="og:url" content="{CANONICAL}">',
        f'<meta property="og:image" content="{image}">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<link rel="sitemap" type="application/xml" href="/sitemap.xml">',
        '<script type="application/ld+json">'
        + json.dumps(structured, ensure_ascii=False).replace('<', '\\u003c') + '</script>',
    ]
    return html.replace('</head>', '\n' + '\n'.join(tags) + '\n</head>', 1)


def make_sitemap(source):
    ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
    image_ns = 'http://www.google.com/schemas/sitemap-image/1.1'
    ET.register_namespace('', ns)
    ET.register_namespace('image', image_ns)
    root = ET.Element(f'{{{ns}}}urlset')
    page = ET.SubElement(root, f'{{{ns}}}url')
    ET.SubElement(page, f'{{{ns}}}loc').text = CANONICAL
    for image in sorted((source / 'assets/project-2026').glob('galeria-*.webp')):
        if image.stem.endswith('-thumb'):
            continue
        item = ET.SubElement(page, f'{{{image_ns}}}image')
        ET.SubElement(item, f'{{{image_ns}}}loc').text = CANONICAL + image.relative_to(source).as_posix()
    return ET.tostring(root, encoding='utf-8', xml_declaration=True) + b'\n'


def build(source=SITE / 'dist', output=OUTPUT):
    source, output = Path(source), Path(output)
    if (source.resolve() == output.resolve()
            or source.resolve() in output.resolve().parents
            or output.resolve() in source.resolve().parents):
        raise ValueError('The output must be outside the source directory.')
    html = (source / 'index.html').read_text()
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    shutil.copytree(source, output / 'tcc')
    (output / 'tcc/index.html').write_text(add_metadata(html))
    # The relative target also works when previewing under a repository subpath.
    (output / 'index.html').write_text(f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Letícia Oliveira Santos</title><meta name="robots" content="noindex,follow">
<link rel="canonical" href="{CANONICAL}"><meta http-equiv="refresh" content="0;url=tcc/">
<script>location.replace(new URL('tcc/', location.href).pathname + location.search + location.hash);</script>
</head><body><a href="tcc/">Abrir o trabalho de Letícia Oliveira Santos</a></body></html>
''')
    (output / '404.html').write_text('''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Página não encontrada | Letícia Oliveira Santos</title></head>
<body><h1>Página não encontrada</h1><p><a href="/tcc/">Abrir o trabalho de Letícia Oliveira Santos</a></p></body></html>
''')
    (output / 'CNAME').write_text(DOMAIN + '\n')
    (output / '.nojekyll').touch()
    (output / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {ORIGIN}/sitemap.xml\n')
    (output / 'sitemap.xml').write_bytes(make_sitemap(source))
    print(f'Packaged {CANONICAL} and {ORIGIN}/sitemap.xml in {output}')


if __name__ == '__main__':
    build()
