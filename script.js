function calculateImpact() {
    const gamblingAmount = document.getElementById('gambling_amount').value;
    const weeklySalary = document.getElementById('weekly_salary').value;
    const startDate = document.getElementById('start_date').value;

    // Convert start date to Date object and calculate weeks since then
    const start = new Date(startDate);
    const now = new Date();
    const weeks = Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));

 
    const totalGamblingAmount = weeks * gamblingAmount;
    const totalIncome = weeks * weeklySalary;
    const percentageOfIncome = (totalGamblingAmount / totalIncome) * 100;
    const years = Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000)); // Approximate years
    const weeklyGamblingAmount = parseFloat(document.getElementById('gambling_amount').value);
    const yearlyGamblingAmount = weeklyGamblingAmount * 52; // Convert weekly to yearly
    
    const vehicleFileInput = document.getElementById('vehicleFileInput');
    const Vfile = vehicleFileInput.files[0]; // Assuming the user has already selected a file
    if (!Vfile) {
        console.error('No vehicle data file selected');
        return; // Exit if no file is selected
    }

    const Vreader = new FileReader();
    Vreader.onload = function(e) {
        const text = e.target.result;
        console.log("Vehicle file loaded, trying to parse CSV to Objects");
        const vehicles = parseCSVToObjects(text);
        console.log("Successfully parsed CSV to Objects, comparing gambling to vehicle cost");


        const chosenVehicle = compareGamblingToVehicleCost(totalGamblingAmount, vehicles);

        let comparisonResult = chosenVehicle
            ? `You could have bought a ${chosenVehicle.Year} ${chosenVehicle.Brand} ${chosenVehicle.Model} with your gambling money.`
            : `You could not afford any vehicle with your gambling money.`;

        // Display the result
        displayVehicleComparisonResult(comparisonResult);
    };
    Vreader.readAsText(Vfile);


    // Handle the Excel file upload
    const Hfile = document.getElementById('hobby_file').files[0];
    const Hreader = new FileReader();

    Hreader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const hobbies = XLSX.utils.sheet_to_json(ws, {header:1});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        let allHobbyItems=[];
    

        // Collect all checked hobbies into an array
        const selectedHobbies = Array.from(document.querySelectorAll('input[name="hobby"]:checked')).map(el => el.value);

        let resultsHtml = `<p>You have spent ${percentageOfIncome.toFixed(2)}% of your total income over ${weeks} weeks.</p>`;
    

        selectedHobbies.forEach(hobby => {
            const hobbyItems = json.filter(item => item['Hobby'] === hobby);
            allHobbyItems = allHobbyItems.concat(hobbyItems);
           

 
    

    });
    const maxTotalCost = totalGamblingAmount;
   
    const selectedItems = getRandomHobbyItems(allHobbyItems, maxTotalCost);
    const { labels, dataPoints } = prepareLineGraphData(selectedItems);
    updateHobbyImpactLineGraph(labels, dataPoints);

    document.getElementById('results').innerHTML = resultsHtml;
    };

 
    drawFinancePieChart(totalIncome, totalGamblingAmount);
  
    calculateInvestmentGrowth(yearlyGamblingAmount, years, 20);

    Hreader.readAsBinaryString(Hfile);
   
   
    function drawFinancePieChart(totalIncome, totalGamblingAmount) {
        const ctx = document.getElementById('financePieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Spent on Gambling', 'Remaining Income'],
                datasets: [{
                    label: 'Financial Overview',
                    data: [totalGamblingAmount, totalIncome - totalGamblingAmount],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }]
            }
        });
    }
    function getRandomHobbyItems(hobbyItems, maxTotalCost) {
        // Shuffle array to randomize selection
        const shuffledItems = hobbyItems.sort(() => 0.5 - Math.random());
        let selectedItems = [];
        let totalCost = 0;
    
        for (const item of shuffledItems) {
            const itemCost = parseFloat(item[' Price ']); // Ensure numeric value
            if (totalCost + itemCost <= maxTotalCost) {
                selectedItems.push(item);
                totalCost += itemCost;
            } else {
                break; // Stop if the next item would exceed the total allowed cost
            }
        }
    
        return selectedItems; // Returns the randomly selected items within budget
    }
    

    function prepareLineGraphData(selectedItems) {
        // Ensure items are sorted by cost in ascending order
        selectedItems.sort((a, b) => parseFloat(a[' Price ']) - parseFloat(b[' Price ']));
    
        let cumulativeCost = 0;
        const labels = [];
        const dataPoints = [];
    
        selectedItems.forEach(item => {
            cumulativeCost += parseFloat(item[' Price ']);
            labels.push(item['Item Name']); // Use the item name as the label
            dataPoints.push(cumulativeCost); // Cumulative cost as the data point
        });
    
        return { labels, dataPoints };
    }
    
    function updateHobbyImpactLineGraph(labels, dataPoints) {
        const ctx = document.getElementById('hobbyImpactLineGraph').getContext('2d');
        const myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative Cost of Missed Hobbies',
                    data: dataPoints,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cost in Dollars'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    },
                    title: {
                        display: true,
                        text: 'Impact of Gambling on Hobby Opportunities'
                    }
                }
            }
        });
    }
    function calculateInvestmentGrowth(yearlyAmount, years, forecastYears) {
        const investmentOptions = [
            { name: "Stock Market", rate: 0.07 },
            { name: "Savings Account", rate: 0.04 }
        ];
    
        let labels = [];
        for (let i = 0; i <= years + forecastYears; i++) {
            labels.push(`Year ${i}`);
        }
    
        let datasets = investmentOptions.map(option => {
            let data = [];
            for (let year = 0; year <= years; year++) {
                // Calculate the future value for each year up to the current time
                let futureValue = yearlyAmount * Math.pow(1 + option.rate, year);
                data.push(futureValue);
            }
            for (let year = years + 1; year <= years + forecastYears; year++) {
                // Forecast future value beyond the current time without additional investments
                let lastValue = data[data.length - 1]; // Last calculated value
                let futureValue = lastValue * (1 + option.rate);
                data.push(futureValue);
            }
            return {
                label: option.name,
                data: data,
                fill: false,
                borderColor: option.name === "Stock Market" ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)',
                tension: 0.1
            };
        });
    
        drawInvestmentForecastGraph(labels, datasets);
    }
    function drawInvestmentForecastGraph(labels, datasets) {
        const ctx = document.getElementById('investmentForecastGraph').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Value in Dollars' }
                    }
                },
                plugins: {
                    legend: { display: true },
                    title: { display: true, text: 'Investment Growth Forecast' }
                }
            }
        });
    }
           


    function compareGamblingToVehicleCost(totalGamblingAmount, vehicleData) {
        console.log("Comparing Gambling to Vehicle Cost");
        let chosenVehicle = null;
        let minPriceDifference = Infinity;
    
        for (const vehicle of vehicleData) {
            const priceDifference = Math.abs(totalGamblingAmount - vehicle.Price);
            if (priceDifference < minPriceDifference) {
                minPriceDifference = priceDifference;
                chosenVehicle = vehicle;
            }
        }
    
        return chosenVehicle;
    }
    function displayVehicleComparisonResult(result) {
        const resultElement = document.createElement('p');
        resultElement.textContent = result;
        document.getElementById('results').appendChild(resultElement);
    }
    
    
    function parseCSVToObjects(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim()); // Removes any empty lines
        const headers = lines[0].split(',').map(header => header.trim());
    
        return lines.slice(1).map(line => {
            const values = line.split(',');
            let obj = {};
            headers.forEach((header, index) => {
                // Check if values[index] is not undefined before calling trim()
                obj[header] = values[index] ? values[index].trim() : '';
            });
            return obj;
        }).filter(row => row.UsedOrNew && row.Year && row.Brand && row.Model && row.Price); // Adjust based on your CSV structure and ensure no empty rows are included
    }
    
    

}
    