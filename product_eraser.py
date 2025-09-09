import requests

BASE_URL = "http://localhost:3000/api/products"

def fetch_all_products():
    try:
        resp = requests.get(BASE_URL, timeout=20)
        if resp.status_code != 200:
            print(f"❌ Error obteniendo productos: {resp.status_code} {resp.text}")
            return []
        data = resp.json()
        if not isinstance(data, list):
            print("❌ La respuesta no es una lista")
            return []
        return data
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error de conexión al obtener productos: {e}")
        return []

def delete_product(product_id: str):
    try:
        resp = requests.delete(BASE_URL, json={"id": product_id}, timeout=20)
        if resp.status_code == 200:
            print(f"✅ Producto {product_id} eliminado correctamente")
        else:
            print(f"❌ Error eliminando {product_id}: {resp.status_code} {resp.text}")
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error de conexión eliminando {product_id}: {e}")

def main():
    products = fetch_all_products()
    if not products:
        print("⚠️ No se encontraron productos para eliminar.")
        return

    print(f"🔎 Encontrados {len(products)} productos. Eliminando...")
    for p in products:
        product_id = p.get("id")
        if not product_id:
            continue
        delete_product(product_id)

if __name__ == "__main__":
    main()
