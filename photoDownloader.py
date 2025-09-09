import base64
import html
from pathlib import Path
from urllib.parse import urlparse, parse_qs, unquote, urljoin
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- Función para normalizar y descargar src ---
def download_image_from_src(img_src: str, page_url: str = None, dest: str = "image.jpg"):
    # Si dest es solo un nombre de archivo, guardar en public/images
    base_images_dir = Path("/home/bartolo/Documents/it360/it360_Soluciones/public/images")
    dest_path = Path(dest)
    if dest_path.parent == Path('.'):
        dest_path = base_images_dir / dest_path.name

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
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        dest_path.write_bytes(data)
        return str(dest_path.resolve())

    # descarga normal con requests
    headers = {"User-Agent": "Mozilla/5.0"}
    if page_url:
        headers["Referer"] = page_url

    resp = requests.get(final_url, headers=headers, timeout=30)
    resp.raise_for_status()
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    dest_path.write_bytes(resp.content)
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

    def descargar_foto(self, query: str, destino="foto.jpg"):
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
