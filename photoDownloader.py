import base64
import html
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote, urljoin
import requests
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- Función para normalizar y descargar src ---
def _ensure_png_path(path: Path) -> Path:
    # Fuerza extensión .png
    return path.with_suffix('.png') if path.suffix.lower() != '.png' else path


def _to_png_transparent(image_bytes: bytes, white_threshold: int = 245) -> bytes:
    """
    Convierte a PNG con fondo transparente. Hace transparente el fondo blanco/casi blanco.
    white_threshold: 0-255. Mayor => más píxeles se vuelven transparentes.
    """
    with Image.open(BytesIO(image_bytes)) as im:
        im = im.convert('RGBA')
        pixels = im.load()
        width, height = im.size
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if r >= white_threshold and g >= white_threshold and b >= white_threshold:
                    pixels[x, y] = (r, g, b, 0)
        out = BytesIO()
        im.save(out, format='PNG')
        return out.getvalue()


def download_image_from_src(img_src: str, page_url: str = None, dest: str = "image.png"):
    # Si dest es solo un nombre de archivo, guardar en public/images
    base_images_dir = Path("/home/bartolo/Documents/it360/it360_Soluciones/public/images")
    dest_path = Path(dest)
    if dest_path.parent == Path('.'):
        dest_path = base_images_dir / dest_path.name
    dest_path = _ensure_png_path(dest_path)

    src = html.unescape((img_src or "").strip())
    if src.startswith("//"):
        src = "https:" + src
    elif src.startswith("/") and page_url:
        src = urljoin(page_url, src)

    parsed = urlparse(src)
    qs = parse_qs(parsed.query)
    if "u" in qs and qs["u"]:
        final_url = unquote(qs["u"][0])
    else:
        final_url = src

    if final_url.startswith("//"):
        final_url = "https:" + final_url

    # data:image
    if final_url.startswith("data:"):
        header, b64 = final_url.split(",", 1)
        data = base64.b64decode(b64)
        png_bytes = _to_png_transparent(data)
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        dest_path.write_bytes(png_bytes)
        return str(dest_path.resolve())

    # descarga normal con requests
    headers = {"User-Agent": "Mozilla/5.0"}
    if page_url:
        headers["Referer"] = page_url

    resp = requests.get(final_url, headers=headers, timeout=30)
    resp.raise_for_status()
    png_bytes = _to_png_transparent(resp.content)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    dest_path.write_bytes(png_bytes)
    return str(dest_path.resolve())

# --- Clase Selenium Downloader para Notebook ---
class PhotoDownloader:
    def __init__(self, headless=True):
        self.headless = headless
        self.driver = None
        self._init_driver()

    def _init_driver(self):
        options = Options()
        options.headless = self.headless
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117 Safari/537.36")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)

        self.driver = webdriver.Chrome(options=options)
        self.driver.set_window_size(1280, 800)

    def descargar_foto(self, query: str, destino="foto.png"):
        q = query.replace(" ", "+")
        url = f"https://duckduckgo.com/?q={q}&iax=images&ia=images"
        self.driver.get(url)

        xpath = "/html/body/div[2]/div[6]/div[4]/div/div[2]/div/div[2]/section/ol/li[1]/ol/li[1]/figure/div/img"
        wait = WebDriverWait(self.driver, 15)
        img_elem = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))

        src = img_elem.get_attribute("src") or img_elem.get_attribute("data-src")
        if not src:
            raise Exception("No se pudo obtener el src de la imagen")

        ruta = download_image_from_src(src, page_url=self.driver.current_url, dest=destino)
        print(f"[{query}] Imagen guardada en: {ruta}")
        return ruta

    def cerrar(self):
        if self.driver:
            self.driver.quit()
            self.driver = None
