# HeliosAnalyzer: Web Astronomy & FITS Analysis Environment

![Live Demo](https://img.shields.io/badge/Live_Demo-Online-success?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

HeliosAnalyzer is a web-based astronomy analysis environment for interactive exploration of astronomical spectra and FITS imaging data.

Inspired by tools like SAOImage DS9, it combines spectral classification, redshift estimation, FITS visualization, and astrophysical metadata extraction into a lightweight browser-based workflow.

🔗 **[Try it live here!](https://solar-analyzer-6nru.onrender.com)**

---

## 🌌 Scientific Philosophy

HeliosAnalyzer prioritizes scientific interpretability over aesthetic image rendering. FITS images preserve detector pixels without interpolation, maintain NaN transparency, and use percentile-based intensity scaling inspired by observatory workflows.

---

## 🌟 Key Features

### FITS Imaging Features
- **DS9-Style Visualization:** Interactive browser-based rendering of raw detector data.
- **Scientific Stretching:** Percentile-based (P5–P99) intensity scaling, featuring Linear, Log, Sqrt, and Asinh algorithms to preserve both bright cores and faint nebulosity.
- **WCS Metadata Extraction:** Exposes full coordinate headers and observational metadata.
- **NaN-Aware Rendering:** Missing detector regions or dead pixels are preserved as transparent rather than zeroed out.
- **Spectral Regimes:** Infers observing regimes (Radio → X-ray) based on wavelength calculations.
- **Cube-Awareness:** Detects multi-dimensional hypercubes and provides explicit dimensional warnings to researchers.

### Spectral Analysis Features
- **Interactive Exploratory Analysis:** Renders high-fidelity interactive graphs of 1D spectra.
- **Line Identification:** Identifies candidate absorption and emission lines across wide wavelength regimes.
- **Kinematic Solver:** Estimates recessional velocities and redshifts using a coarse search and fine-fitting chi-squared algorithm.
- **Astrophysical Classification:** Estimates morphological brackets (A/B, F/G, K/M) or identifies extragalactic objects based on Balmer presence and velocity tensors.

---

## 🏗 Architecture

**Backend:**
- FastAPI
- Astropy
- NumPy / SciPy
- Xarray
- Pydantic (Strict Response Schemas)

**Frontend:**
- Plotly.js (with disabled z-smoothing for raw pixel fidelity)
- Vanilla JS
- Glassmorphism DS9-inspired "Rose Water Scientific" UI

---

## ⚠️ Current Limitations

To maintain scientific transparency, users should be aware of the following limitations:
- 3D FITS cubes are currently displayed as the first slice only (no channel iteration yet).
- Spectral classification is heuristic and intended for exploratory analysis, not definitive validation.
- Extremely large FITS mosaics may be downsampled for browser rendering stability.
- Live WCS Live Probing requires standard `CRPIX`/`CDELT` headers; complex rotation matrices are simplified.

---

## 🚀 How to Run Locally

If you'd like to test or modify the engine yourself on your own machine, follow the steps below:

### Prerequisites
Make sure you have Python 3.9+ installed on your computer.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vshalyadav1812-dotcom/solar-analyzer.git
   cd solar-analyzer
   ```

2. **Install the dependencies:**
   It is highly recommended to create a virtual environment first.
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the API Server:**
   ```bash
   python main.py
   ```
   *Alternatively, you can run it via Uvicorn directly:*
   `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

4. **Access the App:**
   Open your browser and navigate to `http://localhost:8000`

---
*Built for astronomical exploration, data visualization, and open-source science.*
