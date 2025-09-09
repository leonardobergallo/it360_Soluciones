#!/usr/bin/env python3
"""
Análisis de precios de listaGrande.csv
Categoriza productos en 4 grupos con diferentes márgenes de ganancia:
- Categoría 1 (más baratos): 100% markup
- Categoría 2: 66% markup  
- Categoría 3: 40% markup
- Categoría 4 (más caros): 20% markup
"""

import csv
import statistics
from pathlib import Path

def load_and_clean_data(csv_path):
    """Carga y limpia los datos del CSV"""
    print("📊 Cargando datos de listaGrande.csv...")
    
    products = []
    with open(csv_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                price_str = row['Precios con IVA (DOLAR (U$S))'].strip()
                if price_str and price_str != '0.0':
                    price = float(price_str)
                    if price > 0:
                        products.append({
                            'codigo': row['Cód.'],
                            'codigo_fab': row['Cód. Fab.'],
                            'descripcion': row['Descripción'],
                            'rubro': row['Rubro'],
                            'marca': row['Marca'],
                            'stock': row['Stock'],
                            'precio': price
                        })
            except (ValueError, KeyError):
                continue
    
    print(f"✅ Datos cargados: {len(products)} productos con precio válido")
    return products

def analyze_price_distribution(products):
    """Analiza la distribución de precios"""
    prices = [p['precio'] for p in products]
    
    print("\n📈 ANÁLISIS DE DISTRIBUCIÓN DE PRECIOS")
    print("=" * 50)
    print(f"Precio mínimo: ${min(prices):.2f}")
    print(f"Precio máximo: ${max(prices):.2f}")
    print(f"Precio promedio: ${statistics.mean(prices):.2f}")
    print(f"Precio mediano: ${statistics.median(prices):.2f}")
    
    # Percentiles
    sorted_prices = sorted(prices)
    n = len(sorted_prices)
    percentiles = [25, 50, 75, 90, 95, 99]
    print(f"\n📊 PERCENTILES:")
    for p in percentiles:
        idx = int((p / 100) * n)
        if idx >= n:
            idx = n - 1
        print(f"P{p}: ${sorted_prices[idx]:.2f}")
    
    return prices

def categorize_products(products):
    """Categoriza productos en 4 grupos usando cuartiles"""
    prices = [p['precio'] for p in products]
    sorted_prices = sorted(prices)
    n = len(sorted_prices)
    
    # Calcular cuartiles
    q1_idx = int(0.25 * n)
    q2_idx = int(0.50 * n)
    q3_idx = int(0.75 * n)
    
    q1 = sorted_prices[q1_idx]
    q2 = sorted_prices[q2_idx]
    q3 = sorted_prices[q3_idx]
    
    print(f"\n🎯 CATEGORIZACIÓN POR CUARTILES")
    print("=" * 50)
    print(f"Q1 (25%): ${q1:.2f}")
    print(f"Q2 (50%): ${q2:.2f}")
    print(f"Q3 (75%): ${q3:.2f}")
    
    # Asignar categorías
    for product in products:
        price = product['precio']
        if price <= q1:
            product['categoria'] = 1  # Más baratos - 100% markup
        elif price <= q2:
            product['categoria'] = 2  # 66% markup
        elif price <= q3:
            product['categoria'] = 3  # 40% markup
        else:
            product['categoria'] = 4  # Más caros - 20% markup
    
    # Estadísticas por categoría
    print(f"\n📋 RESUMEN POR CATEGORÍA:")
    markup_rates = {1: 1.0, 2: 0.66, 3: 0.40, 4: 0.20}
    
    for cat in range(1, 5):
        cat_products = [p for p in products if p['categoria'] == cat]
        cat_prices = [p['precio'] for p in cat_products]
        
        if cat_prices:
            count = len(cat_products)
            min_price = min(cat_prices)
            max_price = max(cat_prices)
            avg_price = statistics.mean(cat_prices)
            markup_pct = markup_rates[cat] * 100
            
            print(f"Categoría {cat} ({markup_pct}% markup): {count} productos")
            print(f"  Rango: ${min_price:.2f} - ${max_price:.2f}")
            print(f"  Promedio: ${avg_price:.2f}")
    
    return products, markup_rates

def calculate_markup_strategy(products, markup_rates):
    """Calcula los nuevos precios con markup aplicado"""
    print(f"\n💰 ESTRATEGIA DE PRECIOS APLICADA")
    print("=" * 50)
    
    for product in products:
        categoria = product['categoria']
        markup_rate = markup_rates[categoria]
        product['precio_original'] = product['precio']
        product['precio_final'] = product['precio'] * (1 + markup_rate)
        product['ganancia_unitaria'] = product['precio_final'] - product['precio_original']
        product['margen_porcentaje'] = (product['ganancia_unitaria'] / product['precio_original']) * 100
    
    for cat in range(1, 5):
        cat_products = [p for p in products if p['categoria'] == cat]
        if cat_products:
            markup_pct = markup_rates[cat] * 100
            avg_original = statistics.mean([p['precio_original'] for p in cat_products])
            avg_final = statistics.mean([p['precio_final'] for p in cat_products])
            avg_gain = statistics.mean([p['ganancia_unitaria'] for p in cat_products])
            
            print(f"Categoría {cat} ({markup_pct}% markup):")
            print(f"  Precio promedio original: ${avg_original:.2f}")
            print(f"  Precio promedio final: ${avg_final:.2f}")
            print(f"  Ganancia promedio: ${avg_gain:.2f}")
    
    return products

def generate_reports(products):
    """Genera reportes detallados"""
    print(f"\n📊 GENERANDO REPORTES DETALLADOS")
    print("=" * 50)
    
    # Reporte por categoría
    for cat in range(1, 5):
        cat_products = [p for p in products if p['categoria'] == cat]
        markup_pct = [100, 66, 40, 20][cat-1]
        
        print(f"\n🏷️ CATEGORÍA {cat} - {markup_pct}% MARKUP ({len(cat_products)} productos)")
        print("-" * 60)
        
        # Top 10 productos más baratos de esta categoría
        cat_products.sort(key=lambda x: x['precio'])
        top_cheap = cat_products[:10]
        
        print("Top 10 más baratos:")
        for product in top_cheap:
            desc = product['descripcion'][:50] + "..." if len(product['descripcion']) > 50 else product['descripcion']
            print(f"  {product['codigo']} | {desc} | ${product['precio']:.2f} → ${product['precio_final']:.2f} (+${product['ganancia_unitaria']:.2f})")
    
    # Análisis de rubros
    print(f"\n🏪 ANÁLISIS POR RUBRO")
    print("-" * 60)
    
    rubros = {}
    for product in products:
        rubro = product['rubro']
        if rubro not in rubros:
            rubros[rubro] = []
        rubros[rubro].append(product)
    
    rubro_stats = []
    for rubro, rubro_products in rubros.items():
        prices = [p['precio'] for p in rubro_products]
        avg_price = statistics.mean(prices)
        count = len(rubro_products)
        avg_gain = statistics.mean([p['ganancia_unitaria'] for p in rubro_products])
        
        rubro_stats.append({
            'rubro': rubro,
            'count': count,
            'avg_price': avg_price,
            'avg_gain': avg_gain
        })
    
    rubro_stats.sort(key=lambda x: x['avg_price'], reverse=True)
    
    print("Rubros ordenados por precio promedio:")
    for stat in rubro_stats[:15]:
        print(f"  {stat['rubro']}: {stat['count']} productos, ${stat['avg_price']:.2f} promedio")

def export_results(products):
    """Exporta los resultados a CSV"""
    print(f"\n💾 EXPORTANDO RESULTADOS")
    print("=" * 50)
    
    # Exportar CSV completo
    with open('price_analysis_results.csv', 'w', newline='', encoding='utf-8') as file:
        fieldnames = [
            'Codigo', 'Codigo_Fabricante', 'Descripcion', 'Rubro', 'Marca', 'Stock',
            'Precio_Original_USD', 'Categoria', 'Precio_Final_USD', 'Ganancia_Unitaria_USD', 'Margen_Porcentaje'
        ]
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        
        for product in products:
            writer.writerow({
                'Codigo': product['codigo'],
                'Codigo_Fabricante': product['codigo_fab'],
                'Descripcion': product['descripcion'],
                'Rubro': product['rubro'],
                'Marca': product['marca'],
                'Stock': product['stock'],
                'Precio_Original_USD': f"{product['precio_original']:.2f}",
                'Categoria': product['categoria'],
                'Precio_Final_USD': f"{product['precio_final']:.2f}",
                'Ganancia_Unitaria_USD': f"{product['ganancia_unitaria']:.2f}",
                'Margen_Porcentaje': f"{product['margen_porcentaje']:.1f}"
            })
    
    print("✅ Resultados exportados a 'price_analysis_results.csv'")
    
    # Exportar por categorías
    for cat in range(1, 5):
        cat_products = [p for p in products if p['categoria'] == cat]
        filename = f'categoria_{cat}_products.csv'
        
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            fieldnames = [
                'Codigo', 'Codigo_Fabricante', 'Descripcion', 'Rubro', 'Marca', 'Stock',
                'Precio_Original_USD', 'Precio_Final_USD', 'Ganancia_Unitaria_USD', 'Margen_Porcentaje'
            ]
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            
            for product in cat_products:
                writer.writerow({
                    'Codigo': product['codigo'],
                    'Codigo_Fabricante': product['codigo_fab'],
                    'Descripcion': product['descripcion'],
                    'Rubro': product['rubro'],
                    'Marca': product['marca'],
                    'Stock': product['stock'],
                    'Precio_Original_USD': f"{product['precio_original']:.2f}",
                    'Precio_Final_USD': f"{product['precio_final']:.2f}",
                    'Ganancia_Unitaria_USD': f"{product['ganancia_unitaria']:.2f}",
                    'Margen_Porcentaje': f"{product['margen_porcentaje']:.1f}"
                })
        
        print(f"✅ Categoría {cat} exportada a '{filename}'")

def main():
    """Función principal"""
    print("🚀 INICIANDO ANÁLISIS DE PRECIOS")
    print("=" * 60)
    
    # Cargar datos
    csv_path = Path("listaGrande.csv")
    if not csv_path.exists():
        print("❌ Error: No se encontró listaGrande.csv")
        return
    
    products = load_and_clean_data(csv_path)
    
    # Análisis de distribución
    prices = analyze_price_distribution(products)
    
    # Categorización
    products, markup_rates = categorize_products(products)
    
    # Cálculo de markup
    products = calculate_markup_strategy(products, markup_rates)
    
    # Generar reportes
    generate_reports(products)
    
    # Exportar resultados
    export_results(products)
    
    print(f"\n🎉 ANÁLISIS COMPLETADO")
    print("=" * 60)
    print(f"📊 Total productos analizados: {len(products)}")
    
    total_gain = sum(p['ganancia_unitaria'] for p in products)
    avg_margin = statistics.mean([p['margen_porcentaje'] for p in products])
    
    print(f"💰 Ganancia total estimada: ${total_gain:,.2f}")
    print(f"📈 Margen promedio: {avg_margin:.1f}%")
    print(f"📁 Archivos generados:")
    print(f"   - price_analysis_results.csv")
    print(f"   - categoria_1_products.csv")
    print(f"   - categoria_2_products.csv")
    print(f"   - categoria_3_products.csv")
    print(f"   - categoria_4_products.csv")

if __name__ == "__main__":
    main()
