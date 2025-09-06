import requests

url = "http://localhost:3000/api/products"

# Lista de IDs a eliminar
ids = [
    "a95f560c-8e9f-4b27-a757-0cdd7ded2bc1",
    "648b996f-dd2e-4e57-9b21-9318b8e46a1e"
]

for product_id in ids:
    try:
        response = requests.delete(url, json={"id": product_id})

        if response.status_code == 200:
            print(f"✅ Producto {product_id} eliminado correctamente")
        else:
            print(f"❌ Error eliminando {product_id}: {response.status_code} {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error de conexión eliminando {product_id}: {e}")
