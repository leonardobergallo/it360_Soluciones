import requests
import os

url = "http://localhost:3000/api/products"

# Ruta absoluta de la imagen (expandimos el "~")
image_path = os.path.expanduser("/public/images/heleitor.png")

# Datos del nuevo producto
new_product = {
    "name": "Heladera Kohinoor",
    "description": "Es un heladera de alta calidad para llamadas y música.",
    "price": 514556,
    "basePrice": 178458985455.0,
    "markup": 5068965.0,
    "stock": 10,
    "category": "Electrodomésticos",
    "image": image_path  # la API espera un string, no el archivo en binario
}

try:
    response = requests.post(url, json=new_product)

    if response.status_code == 201:
        print("✅ Producto creado con éxito:")
        print(response.json())
    else:
        print(f"❌ Error {response.status_code}: {response.text}")

except requests.exceptions.RequestException as e:
    print("⚠️ Error al conectar con la API:", e)
