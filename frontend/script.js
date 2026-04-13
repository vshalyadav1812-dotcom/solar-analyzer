// Tabs logic
function switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// Upload & Drop Logic
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('results-section');

// Global state for model querying
let currentWaveMin = 0;
let currentWaveMax = 0;
let baseSpectrumTrace = null;

['dragover', 'dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, e => e.preventDefault(), false);
});

dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
});

dropZone.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFiles(fileInput.files);
});

async function handleFiles(fileList) {
    let validFiles = [];
    for(let i=0; i<fileList.length; i++){
        let name = fileList[i].name.toLowerCase();
        if(name.endsWith('.nc') || name.endsWith('.fits') || name.endsWith('.fit')) {
            validFiles.push(fileList[i]);
        }
    }
    
    if (!validFiles.length) {
        alert('Please select valid .nc or .fits files.');
        return;
    }

    dropZone.classList.add('hidden');
    resultsSection.classList.add('hidden');
    loading.classList.remove('hidden');

    const formData = new FormData();
    validFiles.forEach(f => formData.append('files', f));

    try {
        const response = await fetch('/analyze', {
            method: 'POST', body: formData
        });

        const data = await response.json();
        
        if (data.detail) {
            throw new Error(JSON.stringify(data.detail));
        }
        if (data.error) throw new Error(data.error);

        renderResults(data);

    } catch (error) {
        alert(`Analysis Error: ${error.message}`);
        console.error(error);
        loading.classList.add('hidden');
        dropZone.classList.remove('hidden');
    }
}

function renderResults(data) {
    loading.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Store state
    currentWaveMin = data.spectrum.wavelength[0];
    currentWaveMax = data.spectrum.wavelength[data.spectrum.wavelength.length - 1];

    baseSpectrumTrace = {
        x: data.spectrum.wavelength,
        y: data.spectrum.irradiance,
        mode: 'lines',
        line: { color: '#ffffff', width: 1.2 },
        name: 'Observation' // Base is white for contrast against shading
    };

    // Plotly layout with Shaded Regions
    const shapes = data.models.shade_regions.map(region => {
        const color = region.type === 'emission' ? `rgba(59, 130, 246, ${region.opacity})` : `rgba(239, 68, 68, ${region.opacity})`;
        return {
            type: 'rect',
            xref: 'x', yref: 'paper',
            x0: region.wave - (region.width / 2), 
            x1: region.wave + (region.width / 2),
            y0: 0, y1: 1,
            fillcolor: color,
            line: { width: 0 },
            layer: 'below'
        }
    });

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#9CA3AF', family: 'Inter' },
        margin: { t: 10, r: 10, b: 40, l: 60 },
        xaxis: { title: data.spectrum.x_label, gridcolor: 'rgba(255,255,255,0.05)' },
        yaxis: { title: data.spectrum.y_label, gridcolor: 'rgba(255,255,255,0.05)' },
        shapes: shapes,
        showlegend: true
    };

    Plotly.newPlot('spectrum-plot', [baseSpectrumTrace], layout, {responsive: true});

    // Classification
    document.getElementById('star-class').textContent = data.classification.class;
    document.getElementById('star-reason').textContent = data.classification.reason;

    // Kinematics
    const isCosmological = data.classification.class.includes('Galaxy') || data.classification.class.includes('Quasar');
    document.getElementById('label-velocity').textContent = isCosmological ? "Recessional Velocity (approx)" : "Radial Velocity";
    
    document.getElementById('kine-z').textContent = data.kinematics.z;
    document.getElementById('kine-v').textContent = data.kinematics.velocity;
    document.getElementById('kine-state').textContent = data.kinematics.motion;
    document.getElementById('kine-conf').textContent = data.kinematics.confidence + (data.kinematics.sigma_z !== undefined && data.kinematics.sigma_z > 0 ? ` (σ = ${data.kinematics.sigma_z.toFixed(4)})` : "");
    
    // Metallicity
    document.getElementById('metal-index').textContent = data.metallicity.index;
    const est = document.getElementById('metal-estimate');
    if (isCosmological) {
        est.textContent = "Requires BPT Ratios";
        est.style.color = '#F87171'; est.style.background = 'rgba(248, 113, 113, 0.1)';
        document.getElementById('metal-desc').textContent = "Galactic metallicity cannot be derived from simple continuum morphology. It requires calibrated line ratios (e.g. [O III]/Hβ, [N II]/Hα).";
    } else {
        est.textContent = data.metallicity.estimate;
        document.getElementById('metal-desc').textContent = "Depth ratio index correlating to high-metallicity OPAL theories.";
        if (data.metallicity.estimate.includes('High')) {
            est.style.color = '#F59E0B'; est.style.background = 'rgba(245, 158, 11, 0.1)';
        } else {
            est.style.color = '#10B981'; est.style.background = 'rgba(16, 185, 129, 0.1)';
        }
    }
    // 3. Render Properties
    document.getElementById('prop-range').textContent = data.properties.spectral_range + ' nm';
    document.getElementById('prop-total').textContent = data.properties.integrated_irradiance;
    document.getElementById('prop-mean').textContent = data.properties.mean_irradiance;
    document.getElementById('prop-points').textContent = data.properties.data_points.toLocaleString();

    // Hide Sandbox tab if non-stellar cosmology
    const sandboxTabBtn = document.querySelector('button[onclick="switchTab(\'sandbox\')"]');
    if (sandboxTabBtn) {
        if (data.classification.class.includes('Galaxy') || data.classification.class.includes('Quasar')) {
            sandboxTabBtn.style.display = 'none';
        } else {
            sandboxTabBtn.style.display = 'block';
        }
    }

    // 4. Render Elemental Abundances
    const tbody = document.getElementById('elements-tbody');
    tbody.innerHTML = ''; // clear

    if (data.abundances.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888;">No prominent known elements detected in this range.</td></tr>';
    } else {
        // Sort by relative depth descending
        data.abundances.sort((a, b) => b.depth_rel - a.depth_rel);
        const maxDepth = Math.max(1, ...data.abundances.map(a => a.depth_rel));
        
        data.abundances.forEach(el => {
            const widthPct = Math.min(100, (el.depth_rel / maxDepth) * 100);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${el.element}</strong> <span style="color:#888; font-size:0.85rem">(${el.type})</span></td>
                <td>${el.wavelength_nm.toFixed(2)}</td>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span>${el.depth_rel}</span>
                        <div style="width: 50px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px;">
                            <div style="width: ${widthPct}%; height: 100%; background: var(--accent-secondary); border-radius: 2px;"></div>
                        </div>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Sandbox Real-time Rendering
const sliderT = document.getElementById('slider-t');
const sliderZ = document.getElementById('slider-z');
const sliderG = document.getElementById('slider-g');

const valT = document.getElementById('t-val');
const valZ = document.getElementById('z-val');
const valG = document.getElementById('g-val');

function updateSandbox() {
    valT.textContent = sliderT.value;
    valZ.textContent = sliderZ.value;
    valG.textContent = sliderG.value;

    if (!baseSpectrumTrace) return;

    const fd = new FormData();
    fd.append('t', sliderT.value);
    fd.append('z', sliderZ.value);
    fd.append('logg', sliderG.value);
    fd.append('wave_min', currentWaveMin);
    fd.append('wave_max', currentWaveMax);

    fetch('/model', { method: 'POST', body: fd })
        .then(res => res.json())
        .then(data => {
            if (data.error) return;
            
            // Mathematically scale the proxy model (which is in physical Blackbody raw flux)
            // to perfectly overlay the observation's Y-axis.
            const obsMax = Math.max(...baseSpectrumTrace.y);
            const modelMax = Math.max(...data.irradiance);
            const scaleFactor = obsMax / modelMax;
            const scaledIrradiance = data.irradiance.map(val => val * scaleFactor);

            const modelTrace = {
                x: data.wavelength,
                y: scaledIrradiance,
                mode: 'lines',
                line: { color: '#3B82F6', width: 2, dash: 'dot' }, // Blue dotted proxy model
                name: 'Proxy Model'
            };
            
            // Re-render plot with both traces intact. Keep shapes.
            const layout = document.getElementById('spectrum-plot').layout;
            Plotly.react('spectrum-plot', [baseSpectrumTrace, modelTrace], layout);
        })
        .catch(err => console.error(err));
}

sliderT.addEventListener('change', updateSandbox);
sliderZ.addEventListener('change', updateSandbox);
sliderG.addEventListener('change', updateSandbox);

// For smooth scrolling when changing tabs
document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    if(t.textContent === 'Model Sandbox') updateSandbox();
}));
