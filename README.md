# Helios Stellar Spectral Lab (Solar Analyzer)

![Live Demo](https://img.shields.io/badge/Live_Demo-Online-success?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Helios Spectral Lab** is a professional-grade, web-based stellar astrophysics application designed to analyze, classify, and visualize astronomical spectra. It process complex spectral datasets (like FITS or NetCDF files) from instruments like TSIS-1 or SDSS, to deduce the fundamental physical and kinematic properties of celestial bodies.

🔗 **[Try it live here!](https://solar-analyzer-6nru.onrender.com)**

---

## 🌟 Key Features

* **Advanced Spectral Deconvolution:** Accurately extracts both absorption and emission lines by statistically analyzing the local continuum across vast wavelength regimes (UV to Infrared).
* **Kinematic Solver (Redshift):** Employs a robust, modified chi-squared algorithmic search to lock onto the precise rest-frame or recession velocity of an object, safely differentiating between local high-resolution solar forests and highly red-shifted extragalactic models.
* **Astrophysical Classification:** Classifies spectra into established morphological brackets (A/B, F/G, K/M) or extragalactic objects (Galaxies, Quasars) based on the presence of Balmer lines, metallicity dominance, and velocity tensors.
* **Interactive Visualization:** Renders high-fidelity interactive graphs of user data with graphical heatmaps indicating absorption intensity per wavelength segment.

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

## 📊 Usage

1. Launch the web interface.
2. Click the **Upload** button to supply the application with your spectral data file (`.nc` or `.fits` standard astronomy formats).
3. Wait for the engine to crunch the spectrum.
4. Review the returned kinematic analysis, physical classification, and identified atomic signatures. 

---
*Built for astronomical discovery and data visualization.*
