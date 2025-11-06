const csvUrl = "https://raw.githubusercontent.com/kolvimun/Cadestrelandusequery/refs/heads/main/Baudhimai.csv";
let csvData = [];

// Fetch CSV data on page load
document.addEventListener("DOMContentLoaded", async () => {
    showProgress(true);
    csvData = await fetchCSVData();
    populateVdcDropdown();
    showProgress(false);
});

// Show/Hide progress bar
function showProgress(show) {
    document.querySelector('.progress').style.display = show ? 'block' : 'none';
}

// Fetch and parse CSV data
async function fetchCSVData() {
    const response = await fetch(csvUrl);
    const text = await response.text();
    return text.split("\n").slice(1).map(row => {
        const [vdc, ward, parcel_id, landuse] = row.split(",");
        return { vdc, ward, parcel_id, landuse };
    });
}

// Populate VDC dropdown
function populateVdcDropdown() {
    const vdcDropdown = document.getElementById("vdc");
    const vdcOptions = [...new Set(csvData.map(item => item.vdc))].sort();
    vdcOptions.forEach(vdc => {
        const option = document.createElement("option");
        option.value = vdc;
        option.textContent = vdc;
        vdcDropdown.appendChild(option);
    });
}

// Populate Ward dropdown based on VDC selection
function populateWards() {
    const selectedVdc = document.getElementById("vdc").value;
    const wardDropdown = document.getElementById("ward");
    wardDropdown.innerHTML = '<option value="">-- Select Ward --</option>';
    if (selectedVdc) {
        const wards = [...new Set(csvData.filter(item => item.vdc === selectedVdc).map(item => item.ward))].sort();
        wards.forEach(ward => {
            const option = document.createElement("option");
            option.value = ward;
            option.textContent = ward;
            wardDropdown.appendChild(option);
        });
    }
}

// Query the CSV data based on user inputs
function queryData() {
    const vdc = document.getElementById("vdc").value;
    const ward = document.getElementById("ward").value;
    const parcelId = document.getElementById("parcel").value.trim();
    let results = csvData;

    if (vdc) results = results.filter(item => item.vdc === vdc);
    if (ward) results = results.filter(item => item.ward === ward);
    if (parcelId) results = results.filter(item => item.parcel_id === parcelId);

    displayResults(results);
}

// Display the filtered results
function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    const table = document.createElement("table");
    table.className = "table table-bordered table-striped";
    table.innerHTML = `
        <thead>
            <tr>
                <th>कित्ता नं</th>
                <th>भू-उपयोग क्षेत्र</th>
            </tr>
        </thead>
    `;

    const tbody = document.createElement("tbody");
    results.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.parcel_id}</td>
            <td>${row.landuse}</td>
          `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultsDiv.appendChild(table);
}

