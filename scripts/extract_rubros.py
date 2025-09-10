#!/usr/bin/env python3
import argparse
import csv
import os
import sys
from typing import Dict


def normalize_whitespace(value: str) -> str:
    return " ".join(value.split()).strip()


def extract_unique_rubros(csv_path: str) -> Dict[str, str]:
    if not os.path.isfile(csv_path):
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    # Map of normalized lowercase -> display value (first occurrence)
    normalized_to_display: Dict[str, str] = {}

    with open(csv_path, "r", encoding="utf-8", errors="replace", newline="") as f:
        reader = csv.reader(f)
        try:
            header = next(reader)
        except StopIteration:
            return {}

        # Find Rubro column (case-insensitive contains 'rubro')
        header_lower = [h.lower() for h in header]
        try:
            rubro_idx = next(i for i, h in enumerate(header_lower) if "rubro" in h)
        except StopIteration:
            raise ValueError("Column 'Rubro' not found in CSV header")

        for row in reader:
            if rubro_idx >= len(row):
                continue
            raw = row[rubro_idx]
            display = normalize_whitespace(raw)
            if not display:
                continue
            key = display.lower()
            if key not in normalized_to_display:
                normalized_to_display[key] = display

    return normalized_to_display


def main():
    parser = argparse.ArgumentParser(description="Extract unique 'Rubro' values from listaGrande.csv")
    parser.add_argument("--input", "-i", default="listaGrande.csv", help="Path to listaGrande.csv (default: listaGrande.csv)")
    parser.add_argument("--output", "-o", default="rubros.txt", help="Output text file with one rubro per line (default: rubros.txt)")
    parser.add_argument("--csv", dest="csv_output", default=None, help="Optional CSV output file (single 'Rubro' column)")
    args = parser.parse_args()

    try:
        rubros_map = extract_unique_rubros(args.input)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    # Sort for deterministic output (case-insensitive, Spanish locale not guaranteed) 
    rubros_sorted = sorted(rubros_map.values(), key=lambda s: s.lower())

    # Write TXT
    with open(args.output, "w", encoding="utf-8", newline="\n") as out_txt:
        for r in rubros_sorted:
            out_txt.write(f"{r}\n")

    # Optional CSV
    if args.csv_output:
        with open(args.csv_output, "w", encoding="utf-8", newline="") as out_csv:
            writer = csv.writer(out_csv)
            writer.writerow(["Rubro"])
            for r in rubros_sorted:
                writer.writerow([r])

    print(f"Saved {len(rubros_sorted)} unique rubros to {args.output}" + (f" and {args.csv_output}" if args.csv_output else ""))


if __name__ == "__main__":
    main()


