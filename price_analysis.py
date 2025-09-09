#!/usr/bin/env python3
"""
Análisis de precios de listaGrande.csv
Categoriza productos en 4 grupos con diferentes márgenes de ganancia:
- Categoría 1 (más baratos): 100% markup
- Categoría 2: 66% markup  
- Categoría 3: 40% markup
- Categoría 4 (más caros): 20% markup
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

def load_and_clean_data(csv_path):
    """Carga y limpia los datos del CSV"""
    print("📊 Cargando datos de listaGrande.csv...")
    
    # Leer CSV
    df = pd.read_csv(csv_path, encoding='utf-8')
    
    print(f"✅ Datos cargados: {len(df)} productos")
    print(f"📋 Columnas disponibles: {list(df.columns)}")
    
    # Limpiar columna de precios
    price_col = 'Precios con IVA (DOLAR (U$S))'
    df[price_col] = pd.to_numeric(df[price_col], errors='coerce')
    
    # Filtrar productos con precio válido
    df_clean = df.dropna(subset=[price_col])
    df_clean = df_clean[df_clean[price_col] > 0]
    
    print(f"🧹 Productos con precio válido: {len(df_clean)}")
    
    return df_clean, price_col

def analyze_price_distribution(df, price_col):
    """Analiza la distribución de precios"""
    prices = df[price_col]
    
    print("\n📈 ANÁLISIS DE DISTRIBUCIÓN DE PRECIOS")
    print("=" * 50)
    print(f"Precio mínimo: ${prices.min():.2f}")
    print(f"Precio máximo: ${prices.max():.2f}")
    print(f"Precio promedio: ${prices.mean():.2f}")
    print(f"Precio mediano: ${prices.median():.2f}")
    print(f"Desviación estándar: ${prices.std():.2f}")
    
    # Percentiles
    percentiles = [25, 50, 75, 90, 95, 99]
    print(f"\n📊 PERCENTILES:")
    for p in percentiles:
        print(f"P{p}: ${prices.quantile(p/100):.2f}")
    
    return prices

def categorize_products(df, price_col):
    """Categoriza productos en 4 grupos usando cuartiles"""
    prices = df[price_col]
    
    # Calcular cuartiles para dividir en 4 categorías
    q1 = prices.quantile(0.25)
    q2 = prices.quantile(0.50)
    q3 = prices.quantile(0.75)
    
    print(f"\n🎯 CATEGORIZACIÓN POR CUARTILES")
    print("=" * 50)
    print(f"Q1 (25%): ${q1:.2f}")
    print(f"Q2 (50%): ${q2:.2f}")
    print(f"Q3 (75%): ${q3:.2f}")
    
    # Asignar categorías
    def assign_category(price):
        if price <= q1:
            return 1  # Más baratos - 100% markup
        elif price <= q2:
            return 2  # 66% markup
        elif price <= q3:
            return 3  # 40% markup
        else:
            return 4  # Más caros - 20% markup
    
    df['categoria'] = df[price_col].apply(assign_category)
    
    # Estadísticas por categoría
    print(f"\n📋 RESUMEN POR CATEGORÍA:")
    for cat in range(1, 5):
        cat_data = df[df['categoria'] == cat]
        count = len(cat_data)
        min_price = cat_data[price_col].min()
        max_price = cat_data[price_col].max()
        avg_price = cat_data[price_col].mean()
        
        markup_pct = [100, 66, 40, 20][cat-1]
        print(f"Categoría {cat} ({markup_pct}% markup): {count} productos")
        print(f"  Rango: ${min_price:.2f} - ${max_price:.2f}")
        print(f"  Promedio: ${avg_price:.2f}")
    
    return df

def calculate_markup_strategy(df, price_col):
    """Calcula los nuevos precios con markup aplicado"""
    markup_rates = {1: 1.0, 2: 0.66, 3: 0.40, 4: 0.20}  # Multiplicadores
    
    df['precio_original'] = df[price_col]
    df['markup_rate'] = df['categoria'].map(markup_rates)
    df['precio_final'] = df[price_col] * (1 + df['markup_rate'])
    df['ganancia_unitaria'] = df['precio_final'] - df['precio_original']
    df['margen_porcentaje'] = (df['ganancia_unitaria'] / df['precio_original']) * 100
    
    print(f"\n💰 ESTRATEGIA DE PRECIOS APLICADA")
    print("=" * 50)
    
    for cat in range(1, 5):
        cat_data = df[df['categoria'] == cat]
        markup_pct = markup_rates[cat] * 100
        avg_original = cat_data['precio_original'].mean()
        avg_final = cat_data['precio_final'].mean()
        avg_gain = cat_data['ganancia_unitaria'].mean()
        
        print(f"Categoría {cat} ({markup_pct}% markup):")
        print(f"  Precio promedio original: ${avg_original:.2f}")
        print(f"  Precio promedio final: ${avg_final:.2f}")
        print(f"  Ganancia promedio: ${avg_gain:.2f}")
    
    return df

def generate_reports(df, price_col):
    """Genera reportes detallados"""
    print(f"\n📊 GENERANDO REPORTES DETALLADOS")
    print("=" * 50)
    
    # Reporte por categoría
    for cat in range(1, 5):
        cat_data = df[df['categoria'] == cat]
        markup_pct = [100, 66, 40, 20][cat-1]
        
        print(f"\n🏷️ CATEGORÍA {cat} - {markup_pct}% MARKUP ({len(cat_data)} productos)")
        print("-" * 60)
        
        # Top 10 productos más baratos de esta categoría
        top_cheap = cat_data.nsmallest(10, price_col)[['Cód.', 'Descripción', 'Marca', price_col, 'precio_final', 'ganancia_unitaria']]
        print("Top 10 más baratos:")
        for _, row in top_cheap.iterrows():
            print(f"  {row['Cód.']} | {row['Descripción'][:50]}... | ${row[price_col]:.2f} → ${row['precio_final']:.2f} (+${row['ganancia_unitaria']:.2f})")
    
    # Análisis de rubros
    print(f"\n🏪 ANÁLISIS POR RUBRO")
    print("-" * 60)
    rubro_analysis = df.groupby('Rubro').agg({
        price_col: ['count', 'mean', 'min', 'max'],
        'categoria': 'mean',
        'ganancia_unitaria': 'mean'
    }).round(2)
    
    rubro_analysis.columns = ['Cantidad', 'Precio_Promedio', 'Precio_Min', 'Precio_Max', 'Categoria_Promedio', 'Ganancia_Promedio']
    rubro_analysis = rubro_analysis.sort_values('Precio_Promedio', ascending=False)
    
    print("Rubros ordenados por precio promedio:")
    for rubro, data in rubro_analysis.head(15).iterrows():
        print(f"  {rubro}: {data['Cantidad']} productos, ${data['Precio_Promedio']:.2f} promedio")

def create_visualizations(df, price_col):
    """Crea visualizaciones de los datos"""
    print(f"\n📈 CREANDO VISUALIZACIONES")
    print("=" * 50)
    
    # Configurar estilo
    plt.style.use('seaborn-v0_8')
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Análisis de Precios - ListaGrande.csv', fontsize=16, fontweight='bold')
    
    # 1. Distribución de precios
    axes[0,0].hist(df[price_col], bins=50, alpha=0.7, color='skyblue', edgecolor='black')
    axes[0,0].set_title('Distribución de Precios Originales')
    axes[0,0].set_xlabel('Precio (USD)')
    axes[0,0].set_ylabel('Frecuencia')
    axes[0,0].axvline(df[price_col].mean(), color='red', linestyle='--', label=f'Promedio: ${df[price_col].mean():.2f}')
    axes[0,0].legend()
    
    # 2. Precios por categoría
    df.boxplot(column=price_col, by='categoria', ax=axes[0,1])
    axes[0,1].set_title('Precios por Categoría')
    axes[0,1].set_xlabel('Categoría')
    axes[0,1].set_ylabel('Precio (USD)')
    
    # 3. Ganancia por categoría
    ganancia_por_cat = df.groupby('categoria')['ganancia_unitaria'].mean()
    axes[1,0].bar(ganancia_por_cat.index, ganancia_por_cat.values, color=['green', 'orange', 'red', 'purple'])
    axes[1,0].set_title('Ganancia Promedio por Categoría')
    axes[1,0].set_xlabel('Categoría')
    axes[1,0].set_ylabel('Ganancia Promedio (USD)')
    
    # 4. Comparación precio original vs final
    sample = df.sample(min(1000, len(df)))  # Muestra para mejor visualización
    axes[1,1].scatter(sample[price_col], sample['precio_final'], alpha=0.6, c=sample['categoria'], cmap='viridis')
    axes[1,1].plot([0, sample[price_col].max()], [0, sample[price_col].max()], 'r--', label='Sin markup')
    axes[1,1].set_title('Precio Original vs Precio Final')
    axes[1,1].set_xlabel('Precio Original (USD)')
    axes[1,1].set_ylabel('Precio Final (USD)')
    axes[1,1].legend()
    
    plt.tight_layout()
    plt.savefig('price_analysis.png', dpi=300, bbox_inches='tight')
    print("✅ Gráfico guardado como 'price_analysis.png'")
    
    return fig

def export_results(df, price_col):
    """Exporta los resultados a CSV"""
    print(f"\n💾 EXPORTANDO RESULTADOS")
    print("=" * 50)
    
    # Seleccionar columnas relevantes para exportar
    export_cols = [
        'Cód.', 'Cód. Fab.', 'Descripción', 'Rubro', 'Marca', 'Stock',
        price_col, 'categoria', 'markup_rate', 'precio_final', 'ganancia_unitaria', 'margen_porcentaje'
    ]
    
    df_export = df[export_cols].copy()
    df_export.columns = [
        'Codigo', 'Codigo_Fabricante', 'Descripcion', 'Rubro', 'Marca', 'Stock',
        'Precio_Original_USD', 'Categoria', 'Markup_Rate', 'Precio_Final_USD', 'Ganancia_Unitaria_USD', 'Margen_Porcentaje'
    ]
    
    # Exportar CSV completo
    df_export.to_csv('price_analysis_results.csv', index=False, encoding='utf-8')
    print("✅ Resultados exportados a 'price_analysis_results.csv'")
    
    # Exportar por categorías
    for cat in range(1, 5):
        cat_data = df_export[df_export['Categoria'] == cat]
        cat_data.to_csv(f'categoria_{cat}_products.csv', index=False, encoding='utf-8')
        print(f"✅ Categoría {cat} exportada a 'categoria_{cat}_products.csv'")
    
    return df_export

def main():
    """Función principal"""
    print("🚀 INICIANDO ANÁLISIS DE PRECIOS")
    print("=" * 60)
    
    # Cargar datos
    csv_path = Path("listaGrande.csv")
    if not csv_path.exists():
        print("❌ Error: No se encontró listaGrande.csv")
        return
    
    df, price_col = load_and_clean_data(csv_path)
    
    # Análisis de distribución
    prices = analyze_price_distribution(df, price_col)
    
    # Categorización
    df = categorize_products(df, price_col)
    
    # Cálculo de markup
    df = calculate_markup_strategy(df, price_col)
    
    # Generar reportes
    generate_reports(df, price_col)
    
    # Crear visualizaciones
    create_visualizations(df, price_col)
    
    # Exportar resultados
    df_export = export_results(df, price_col)
    
    print(f"\n🎉 ANÁLISIS COMPLETADO")
    print("=" * 60)
    print(f"📊 Total productos analizados: {len(df)}")
    print(f"💰 Ganancia total estimada: ${df['ganancia_unitaria'].sum():,.2f}")
    print(f"📈 Margen promedio: {df['margen_porcentaje'].mean():.1f}%")
    print(f"📁 Archivos generados:")
    print(f"   - price_analysis.png")
    print(f"   - price_analysis_results.csv")
    print(f"   - categoria_1_products.csv")
    print(f"   - categoria_2_products.csv")
    print(f"   - categoria_3_products.csv")
    print(f"   - categoria_4_products.csv")

if __name__ == "__main__":
    main()
