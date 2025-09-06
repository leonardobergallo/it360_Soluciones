import pandas as pd
import glob
import os

# Directorio actual o el que pases como argumento
target_dir = os.getcwd() # .
# Si quieres que sea un argumento de linea de comandos:
# import sys
# if len(sys.argv) > 1:
#     target_dir = sys.argv[1]

# Directorio actual donde se ejecuta el script
current_directory = os.getcwd()

# Define el nombre de la subcarpeta que quieres
target_subdirectory_name = "csv_files"

# Combina el directorio actual con el nombre de la subcarpeta
# Esto creará una ruta como "/path/to/your/script/csv_files"
final_dir = os.path.join(current_directory, target_subdirectory_name)


xlsx_files = glob.glob(os.path.join(target_dir, "*.xlsx"))

if not xlsx_files:
    print(f"No se encontraron archivos .xlsx en '{target_dir}'.")
else:
    for xlsx_file in xlsx_files:
        try:
            print(f"Convirtiendo '{xlsx_file}'...")
            # Leer todas las hojas
            xls = pd.ExcelFile(xlsx_file)
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=sheet_name)
                
                # Generar nombre del CSV: nombre_archivo_hoja.csv
                base_name = os.path.splitext(os.path.basename(xlsx_file))[0]
                csv_filename = f"{base_name}_{sheet_name}.csv"
                csv_path = os.path.join(final_dir, csv_filename)
                
                df.to_csv(csv_path, index=False, encoding='utf-8')
                print(f"  ✔ OK: Hoja '{sheet_name}' de '{xlsx_file}' a '{csv_path}'.")
        except Exception as e:
            print(f"  ✖ ERROR: Falló la conversión de '{xlsx_file}': {e}")
    print("Proceso de conversión completado.")
