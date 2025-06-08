// Fungsi untuk menampilkan field yang sesuai dengan jenis perhitungan peluang
function showProbabilityFields() {
    const probabilityType = document.getElementById('probabilityType').value;
    
    // Sembunyikan semua field terlebih dahulu
    document.querySelectorAll('.probability-fields').forEach(field => {
        field.classList.add('d-none');
    });
    
    // Tampilkan field yang sesuai
    document.getElementById(`${probabilityType}Fields`).classList.remove('d-none');
}

// Fungsi untuk menghitung ukuran pemusatan data
function calculateCentralTendency() {
    const dataInput = document.getElementById('dataInput').value;
    const dataArray = dataInput.split(',').map(item => parseFloat(item.trim())).filter(item => !isNaN(item));
    
    if (dataArray.length === 0) {
        alert('Masukkan data yang valid!');
        return;
    }
    
    // Hitung mean
    const mean = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    
    // Hitung median
    const sortedData = [...dataArray].sort((a, b) => a - b);
    let median;
    if (sortedData.length % 2 === 0) {
        median = (sortedData[sortedData.length/2 - 1] + sortedData[sortedData.length/2]) / 2;
    } else {
        median = sortedData[Math.floor(sortedData.length/2)];
    }
    
    // Hitung modus
    const frequencyMap = {};
    sortedData.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
    
    let maxFrequency = 0;
    let modes = [];
    for (const num in frequencyMap) {
        if (frequencyMap[num] > maxFrequency) {
            modes = [num];
            maxFrequency = frequencyMap[num];
        } else if (frequencyMap[num] === maxFrequency) {
            modes.push(num);
        }
    }
    
    const mode = maxFrequency > 1 ? modes.join(', ') : 'Tidak ada modus';
    
    // Hitung range
    const range = Math.max(...sortedData) - Math.min(...sortedData);
    
    // Hitung varians
    const squaredDifferences = dataArray.map(num => Math.pow(num - mean, 2));
    const variance = squaredDifferences.reduce((sum, val) => sum + val, 0) / dataArray.length;
    
    // Hitung standar deviasi
    const stdDev = Math.sqrt(variance);
    
    // Tampilkan hasil
    document.getElementById('meanResult').textContent = mean.toFixed(2);
    document.getElementById('medianResult').textContent = median.toFixed(2);
    document.getElementById('modeResult').textContent = mode;
    document.getElementById('rangeResult').textContent = range.toFixed(2);
    document.getElementById('varianceResult').textContent = variance.toFixed(2);
    document.getElementById('stdDevResult').textContent = stdDev.toFixed(2);
    
    // Buat visualisasi data
    createChart(sortedData);
}

// Fungsi untuk menghitung faktorial
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Fungsi untuk menghitung peluang
function calculateProbability() {
    const probabilityType = document.getElementById('probabilityType').value;
    let result;
    
    try {
        switch(probabilityType) {
            case 'basic':
                const favorable = parseInt(document.getElementById('favorableOutcomes').value);
                const total = parseInt(document.getElementById('totalOutcomes').value);
                
                if (favorable <= 0 || total <= 0 || favorable > total) {
                    throw new Error('Input tidak valid');
                }
                
                result = (favorable / total).toFixed(4);
                break;
                
            case 'permutation':
                const nPerm = parseInt(document.getElementById('nPermutation').value);
                const rPerm = parseInt(document.getElementById('rPermutation').value);
                
                if (nPerm <= 0 || rPerm <= 0 || rPerm > nPerm) {
                    throw new Error('Input tidak valid');
                }
                
                result = (factorial(nPerm) / factorial(nPerm - rPerm)).toString();
                break;
                
            case 'combination':
                const nComb = parseInt(document.getElementById('nCombination').value);
                const rComb = parseInt(document.getElementById('rCombination').value);
                
                if (nComb <= 0 || rComb <= 0 || rComb > nComb) {
                    throw new Error('Input tidak valid');
                }
                
                result = (factorial(nComb) / (factorial(rComb) * factorial(nComb - rComb))).toString();
                break;
                
            case 'binomial':
                const n = parseInt(document.getElementById('nTrials').value);
                const k = parseInt(document.getElementById('kSuccesses').value);
                const p = parseFloat(document.getElementById('pProbability').value);
                
                if (n <= 0 || k < 0 || k > n || p < 0 || p > 1) {
                    throw new Error('Input tidak valid');
                }
                
                const combination = factorial(n) / (factorial(k) * factorial(n - k));
                result = (combination * Math.pow(p, k) * Math.pow(1 - p, n - k)).toFixed(6);
                break;
                
            default:
                result = 'Pilih jenis perhitungan terlebih dahulu';
        }
        
        document.getElementById('probabilityResult').textContent = result;
    } catch (error) {
        alert(error.message);
        document.getElementById('probabilityResult').textContent = '-';
    }
}

// Fungsi untuk membuat chart visualisasi data
function createChart(data) {
    const ctx = document.getElementById('dataChart').getContext('2d');
    
    // Hancurkan chart sebelumnya jika ada
    if (window.dataChart) {
        window.dataChart.destroy();
    }
    
    // Hitung frekuensi untuk histogram
    const frequencyMap = {};
    data.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });
    
    const labels = Object.keys(frequencyMap);
    const frequencies = Object.values(frequencyMap);
    
    window.dataChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Frekuensi Data',
                data: frequencies,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frekuensi'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Nilai Data'
                    }
                }
            }
        }
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    showProbabilityFields();
});