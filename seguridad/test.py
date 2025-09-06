import requests
import os

url = "http://localhost:3000/api/products"

# Ruta absoluta de la imagen (expandimos el "~")
image_path = os.path.expanduser("/public/images/plumber.jpg")

# Datos del nuevo producto
new_product = {
    "name": "Plumber Service expand user",
    "description": "Servicio profesional de plomería con garantía",
    "price": 150.0,
    "basePrice": 100.0,
    "markup": 50.0,
    "stock": 10,
    "category": "services",
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
