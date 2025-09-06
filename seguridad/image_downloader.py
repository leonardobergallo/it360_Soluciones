import requests, os

API_KEY = "abd934305c65c17426c425ba3d13cb82dd23a2b4aef16e678955d10edec010af"

def descargar_imagen(query, carpeta="public/images"):
    os.makedirs(carpeta, exist_ok=True)

    params = {
        "engine": "google",
        "q": query,
        "tbm": "isch",
        "num": 1,
        "api_key": API_KEY,
    }
    r = requests.get("https://serpapi.com/search.json", params=params)
    if r.status_code != 200:
        print("❌ Error:", r.status_code, r.text)
        return
    
    resultados = r.json().get("images_results", [])
    if not resultados:
        print("⚠️ No hay imágenes para:", query)
        return
    
    url = resultados[0]["original"]
    print("Descargando:", url)
    img = requests.get(url, stream=True)
    if img.status_code == 200:
        path = os.path.join(carpeta, query.replace(" ", "_") + ".jpg")
        with open(path, "wb") as f:
            for chunk in img.iter_content(1024):
                f.write(chunk)
        print("✅ Imagen guardada en:", path)

# Ejemplo
# descargar_imagen("TP-Link AX1500 (ARCHER AX12)")
