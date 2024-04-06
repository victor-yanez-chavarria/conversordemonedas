const url = 'https://mindicador.cl/api'; //URL API MIINDICADOR
const currencies =['uf','dolar','euro','utm','bitcoin'];

// CHART INIT

const ctx = document.getElementById('myChart');

  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

// END CHART INIT
const paintCurrencies = (currencies) =>{
    html = '<option disabled selected>Seleccione moneda</option>';
    const selectCurrencies = document.querySelector('#currencies');
    currencies.forEach(currencie => {
        html += `
            <option value=${currencie.codigo} id=${currencie.codigo}>${currencie.codigo}</option>
        `});
    selectCurrencies.innerHTML = html;
}

const getCurrencies = async () =>{
    try{
        const resCurrencies = await fetch(url);
        const data = await resCurrencies.json();
        const currenciesList = currencies.map(currencie => {
            return {
                codigo: currencie.charAt(0).toUpperCase() + currencie.slice(1),
                valor:data[currencie].valor
            }
        });
        paintCurrencies(currenciesList);
        return data;
    }catch(error){
        document.querySelector('h1').style.display = 'none';
        document.querySelector('.card').style.display = 'none';
        document.querySelector('.error').style.display = 'flex';
        document.querySelector('.errorMessage').textContent = 'Lo siento, hasta ayer funcionaba. Te dejo el error y si sabes que paso nos llamas: ' + error.message;
        console.log(error);
    };
}
const getSymbolCurrencie = (actualCurrencie) => {
    if (actualCurrencie === 'dolar'){
        return "USD";
    }else if ( actualCurrencie === 'bitcoin'){
        return "₿";
    }else if ( actualCurrencie === 'euro'){
        return "€";
    }else{
        return "";
    }
}
const confChart = (data) =>{
    const typeOfChart = "line";
    const days = data.serie.map((info) => (info.fecha.slice(0,10))).slice(0,10);
    const title = data.codigo.toUpperCase();
    const values = data.serie.map ((info) => {return info.valor;});
    const config = {
        type: typeOfChart,
        data: {
            labels: days,
            datasets: [{
                label: title,
                borderWidth: 3,
                borderColor: 'red',
                color: 'black',
                lineTension: 0.2,
                backgroundColor: 'red',
                data: values
            } ]
        },
        options: {
            scales: {
                x:{
                    grid: {
                        drawOnChartArea: true,
                        color: '#D6D6D6',
                        borderColor: '#D6D6D6'
                    },
                    ticks: {
                        color: 'black'
                    },
                    border: {
                        color: '#D6D6D6'
                    }
                },
                y: {
                    grid: {
                        drawOnChartArea: true,
                        color: '#D6D6D6'
                    },
                    ticks: {
                        color: 'black'
                    },
                    border: {
                        color: '#D6D6D6'
                    }
                }
            },
            plugins: {
                legend:{
                    labels: {
                        color: 'black'
                    }
                }
            }

        }
    };
    return config;
}
const calcMoneyExchange = async() =>{
    const clpAmount = document.querySelector('#clpAmount').value;
    const currencieIndex = document.querySelector('#currencies').selectedIndex;
    if (clpAmount ==='' || currencieIndex === 0){
        // alert('Debe ingresar un monto en pesos para convertirlo al a moneda deseada')
        const modal = document.querySelector('#myModal');
        modal.style.display = 'block';
        modal.querySelector('#OK').addEventListener('click', (event) => modal.style.display = 'none');
    }else{
        const actualCurrencie = document.querySelector('#currencies').selectedOptions[0].value.toLowerCase();
        const currencieSymbol = getSymbolCurrencie(actualCurrencie);
        try{
            document.querySelector('#answer').style.display = 'none';
            document.querySelector('#valueOfDay').style.display = 'none';
            document.querySelector('.animatedLoader').style.display = 'inline-block';
            const resCurrencies = await fetch(url + '/' + actualCurrencie);
            const data = await resCurrencies.json();
            const actualValueCurrency =  Number(data.serie[0].valor);
            let change = clpAmount / actualValueCurrency;
            setTimeout(() => {
                document.querySelector('.animatedLoader').style.display = 'none';
                document.querySelector('#answer').style.display = 'inline-block';
                document.querySelector('#valueOfDay').style.display = 'block'
                document.querySelector('#answer').innerText = "$" + clpAmount + " equivalen a " + currencieSymbol + "$" + change.toFixed(2)
                document.querySelector('#valueOfDay').innerText = "Valor del dia: " + "$" + actualValueCurrency.toFixed(2);
                const conf = confChart(data);
                const chartDOM = document.querySelector("#myChart");
                myChart.destroy();
                myChart = new Chart(chartDOM, conf);
                document.querySelector(".chart").style.display = "flex";
            },1000);
        }catch(error){
            document.querySelector('h1').style.display = 'none';
            document.querySelector('.card').style.display = 'none';
            document.querySelector('.error').style.display = 'flex';
            document.querySelector('.errorMessage').textContent = 'Lo siento, hasta ayer funcionaba. Te dejo el error y si sabes que paso nos llamas: ' + error.
            message;
            console.log(error);
        };
     };
};

getCurrencies();
const buttonCalc = document.querySelector('#convert');
buttonCalc.addEventListener('click',calcMoneyExchange);



