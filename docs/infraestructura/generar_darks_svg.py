import re
import os

# Colores a reemplazar: { color_original: color_dark }
COLOR_MAP = {
    "#000000": "#e0e0e0",
    "#000":    "#e0e0e0",
    "black":   "#e0e0e0",
    "#333333": "#cccccc",
    "#333":    "#cccccc",
    "#1a1a1a": "#d0d0d0",
    "#ffffff": "#1e1e1e",  # fondo blanco → fondo oscuro
    "white":   "#1e1e1e",
}

# SVGs a procesar
SVG_FILES = [
    "flujo_principal.svg",
    "flujo_ruta.svg",
    "flujo_poi.svg",
    "flujo_poi_paradas.svg",
]

def generate_dark(filename):
    with open(filename, "r", encoding="utf-8") as f:
        content = f.read()

    # Eliminar rect de fondo blanco explícito
    content = re.sub(
        r'<rect[^>]*fill\s*=\s*["\'](?:white|#fff|#ffffff)["\'][^>]*/?>',
        '',
        content,
        flags=re.IGNORECASE
    )

    # Reemplazar colores
    for original, dark in COLOR_MAP.items():
        content = content.replace(f'fill="{original}"', f'fill="{dark}"')
        content = content.replace(f'fill=\'{original}\'', f'fill=\'{dark}\'')
        content = content.replace(f'stroke="{original}"', f'stroke="{dark}"')
        content = content.replace(f'stroke=\'{original}\'', f'stroke=\'{dark}\'')
        content = content.replace(f'color="{original}"', f'color="{dark}"')
        # También en style inline: fill:black o fill:#000
        content = content.replace(f'fill:{original}', f'fill:{dark}')
        content = content.replace(f'stroke:{original}', f'stroke:{dark}')

    # Guardar versión dark
    dark_filename = filename.replace(".svg", "_dark.svg")
    with open(dark_filename, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✅ Generado: {dark_filename}")

for svg in SVG_FILES:
    if os.path.exists(svg):
        generate_dark(svg)
    else:
        print(f"⚠️  No encontrado: {svg}")
