let myChart;

const form = document.querySelector("form#form");
form.addEventListener("submit", e => {
    e.preventDefault();

    const canvas = document.getElementById('myChart');
    let tempCorpo = document.getElementById("tempCorpo").value;
    let tempAmbiente = document.getElementById("tempAmb").value;
    let k = document.getElementById("k").value;

    tempCorpo = Number(tempCorpo);
    tempAmbiente = Number(tempAmbiente);
    k = Number(k);

    canvas.className = "invisible";
    const elementoMensagem = document.getElementById("error-message");

    if(k == 0)
        return ExibirMensagemErro("k deve ser diferente de 0", elementoMensagem);

    if(k < 0.001)
        return ExibirMensagemErro("k deve ser maior do que 0.001", elementoMensagem);

    if(isNaN(k) || isNaN(tempAmbiente) || isNaN(tempCorpo))
        return ExibirMensagemErro("Todos devem ser números", elementoMensagem);

    if(tempAmbiente == tempCorpo)
        return ExibirMensagemErro("Dois corpos na mesma temperatura não trocam calor", elementoMensagem);
        
    if(myChart)
        myChart.destroy();

    MostrarGrafico(canvas, tempCorpo, tempAmbiente, k);
    elementoMensagem.className="invisible";
})

function ExibirMensagemErro(mensagem, elementoMensagem){
    elementoMensagem.innerHTML = mensagem;
    elementoMensagem.className = "";
}

function DefinirComprimento(tempCorpo, tempAmbiente, k){
    if(tempCorpo > tempAmbiente){
        return Math.round(-Math.log(1/(tempCorpo-tempAmbiente))/k)
    }else{
        return Math.round(-Math.log(1/(tempAmbiente-tempCorpo))/k)
    }
}

function MostrarGrafico(canvas, tempCorpo, tempAmbiente, k){
    const ctx = canvas.getContext('2d');

    canvas.className = "";

    tempCorpo = Number(tempCorpo);
    tempAmbiente = Number(tempAmbiente);
    k = Number(k);

    const comprimento = DefinirComprimento(tempCorpo, tempAmbiente, k) + 10;

    const labels = Array.from({length: comprimento}, (_, i) => i);
    const data = labels.map(x => tempAmbiente + (tempCorpo - tempAmbiente) * Math.exp(-k*x));

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperatura do Corpo',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 5,
                pointRadius: 0,
            },{
                label: 'Temperatura ambiente',
                data: Array(comprimento).fill(tempAmbiente),
                backgroundColor: 'rgba(239, 144, 104, 1)',
                borderColor: 'rgba(239, 144, 104, 1)',
                borderWidth: 5,
                pointRadius: 0,
            }]
        },
        options: {
            interaction: {
                intersect: false,
            },
            scales: {
                x:{
                    gridLines:{
                        display: true,
                        stepSize: 10,
                    },
                    ticks: {
                        stepSize: 10,
                        callback: function(value, index) {
                            return index % 10 === 0 ? value : '';
                        }
                    },
                    display: true,
                    title: {
                        display: true,
                        text: 'Tempo em minutos'
                    },
                },
                y: {
                    beginAtZero: true,
                    display: true,
                    title: {
                        display: true,
                        text: 'T°C'
                    },
                    suggestedMax: Math.max(tempAmbiente, tempCorpo) + 5,
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Temperatura em °C de um corpo se aproximando da Temperatura Ambiente ao longo do tempo em minutos'
                },
            },
        }
    });
}
